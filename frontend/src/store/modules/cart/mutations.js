export const ADD_TO_CART = (state, { product, quantity }) => {
  const itemInCart = state.cart.find(item => item.product.id === product.id);
  if (itemInCart) {
    itemInCart.quantity += quantity;
    return;
  }

  state.cart.push({ product, quantity });
}

export const REMOVE_PRODUCT = (state, cartItemId) => {
  state.cart = state.cart.filter(item => item.id !== cartItemId);
}

export const GET_CART_ITEMS = (state, cartItems) => {
  state.cart = cartItems
}

export const CLEAR_CART_ITEMS = (state) => {
  state.cart = [];
}