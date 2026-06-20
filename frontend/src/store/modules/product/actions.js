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
