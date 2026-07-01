import Product from "@/apis/Product";

export const fetchProducts = ({ commit }) => {
  return Product.all().then((response) => {
    const payload = response?.data || { items: [], total: 0 };
    commit("SET_PRODUCTS", payload);
  });
};

export const getProduct = async ({ commit }, productId) => {
  const response = await Product.find(productId);
  const product = response.data;
  commit("GET_PRODUCT", product);
  return product;
}

export const createProduct = async ({ commit }, productData) => {
  const response = await Product.create(productData);
  commit("CREATE_PRODUCT", response.data);
}

export const updateProduct = async ({ commit }, { productId, productData }) => {
  const response = await Product.update(productId, productData);
  commit("UPDATE_PRODUCT", response.data);
}

export const deleteProduct = async ({ commit }, productId) => {
  await Product.delete(productId);
  commit("DELETE_PRODUCT", productId);
}