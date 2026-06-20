import { ApiProducts } from "./Api";
const END_POINT = 'products';

export default {
  all() {
    return ApiProducts.get(END_POINT)
  },
  find(productId) {
    return ApiProducts.get(`${END_POINT}/${productId}`)
  }

}