import Product from "@/apis/Product";

export const getProducts = ({ commit }) => {
  Product.all().then(response => {
    commit("SET_PRODUCTS", response.data)
  })
}

export const getProduct = async ({ commit }, productId) => {
  const response = await Product.find(productId);
  commit("GET_PRODUCT", response.data);
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