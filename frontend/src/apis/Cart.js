import Api from "./Api";

const END_POINT = 'cart';

export default {
  addToCart(data) {
    return Api.post(END_POINT, data)
  },
  deleteFromCart(productId) {
    return Api.delete(`${END_POINT}/${productId}`)
  },
  deleteAllFromCart(cartItems) {
    const deleteRequests = cartItems.map(item => Api.delete(`${END_POINT}/${item.id}`));
    return Promise.all(deleteRequests);
  },
  getCartItems() {
    return Api.get(END_POINT);
  }
}