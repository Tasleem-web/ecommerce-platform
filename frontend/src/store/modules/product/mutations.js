export const SET_PRODUCTS = (state, products) => {
  state.products.items = products.items;
  state.products.total = products.total;
}

export const GET_PRODUCT = (state, product) => {
  console.log(product)
  state.product = product;
}
