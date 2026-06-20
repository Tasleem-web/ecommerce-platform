export const cartCounts = (state) => {
  return state.cart.length;
}

export const cartTotalPrice = (state) => {
  return state.cart.reduce((acc, item) => {
    return acc + item.quantity * item.product.price;
  }, 0).toFixed(2);
}