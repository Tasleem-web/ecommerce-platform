export const cartCounts = (state) => {
  return state.cart.length;
}

export const cartTotalPrice = (state) => {
  return state.cart.reduce((acc, item) => {
    return acc + (item?.quantity || 0) * (item?.price || 0);
  }, 0).toFixed(2);
}