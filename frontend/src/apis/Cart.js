import { ApiCart } from "./Api";

const END_POINT = 'carts';

export default {
  addToCart(data) {
    return ApiCart.post(END_POINT, data)
  },
  deleteFromCart(productId) {
    return ApiCart.delete(`${END_POINT}/${productId}`)
  },
  deleteAllFromCart(cartItems) {
    const deleteRequests = cartItems.map(item => ApiCart.delete(`${END_POINT}/${item.id}`));
    return Promise.all(deleteRequests);
  },
  getCartItems() {
    return ApiCart.get(END_POINT);
  },
  updateCartItem(productId, data) {
    return ApiCart.put(`${END_POINT}/${productId}`, data)
  }
}