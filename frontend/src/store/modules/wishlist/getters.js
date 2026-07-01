export const wishlistCount = (state) => {
  return state.wishlist.length;
}

export const isInWishlist = (state) => (productId) => {
  return state.wishlist.some(item => item.productId === productId);
}