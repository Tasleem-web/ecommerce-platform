export const SET_PRODUCTS = (state, products) => {
  state.products.items = products.items;
  state.products.total = products.total;
}

export const GET_PRODUCT = (state, product) => {
  console.log(product)
  state.product = product;
}

export const CREATE_PRODUCT = (state, product) => {
  state.products.items.push(product);
  state.products.total++;
}

export const UPDATE_PRODUCT = (state, updatedProduct) => {
  const index = state.products.items.findIndex(product => product.id === updatedProduct.id);
  if (index !== -1) {
    state.products.items.splice(index, 1, updatedProduct);
  }
}

export const DELETE_PRODUCT = (state, productId) => {
  const index = state.products.items.findIndex(product => product.id === productId);
  if (index !== -1) {
    state.products.items.splice(index, 1);
    state.products.total--;
  }
}
