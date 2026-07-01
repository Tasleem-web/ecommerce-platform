import { ApiWishlist } from "./Api";

const END_POINT = 'wishlist';

export default {
  getWishlistItems() {
    return ApiWishlist.get(END_POINT);
  },
  addToWishlist(data) {
    console.log("Adding to wishlist:", data);
    return ApiWishlist.post(END_POINT, data);
  },
  removeFromWishlist(productId) {
    return ApiWishlist.delete(`${END_POINT}/${productId}`);
  },
  checkWishlist(productId) {
    return ApiWishlist.get(`${END_POINT}/${productId}/check`);
  }
}
