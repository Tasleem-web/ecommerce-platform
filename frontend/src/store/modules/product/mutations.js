const normalizeProduct = (product) => ({
  ...product,
  price: Number(product.price) || 0,
  stock: Number(product.stock) || 0,
  rating: {
    rate: Number(product.rating?.rate) || 0,
    count: Number(product.rating?.count) || 0,
  },
});

export const SET_PRODUCTS = (state, products = {}) => {
  const items = Array.isArray(products) ? products : products.items || [];
  const normalizedItems = items.map(normalizeProduct);
  const total = typeof products.total === "number" ? products.total : normalizedItems.length;

  state.products.items = normalizedItems;
  state.products.total = total;
};

export const GET_PRODUCT = (state, product) => {
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
