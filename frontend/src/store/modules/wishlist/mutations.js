export const SET_WISHLIST = (state, items) => {
  state.wishlist = items;
}

export const ADD_TO_WISHLIST = (state, item) => {
  state.wishlist.push(item);
}

export const REMOVE_FROM_WISHLIST = (state, productId) => {
  state.wishlist = state.wishlist.filter(item => item.productId !== productId);
}

export const CLEAR_WISHLIST = (state) => {
  state.wishlist = [];
}