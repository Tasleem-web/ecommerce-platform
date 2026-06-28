import { ApiProducts } from "./Api";
const END_POINT = 'products';

export default {
  all() {
    return ApiProducts.get(END_POINT)
  },
  find(productId) {
    return ApiProducts.get(`${END_POINT}/${productId}`)
  },
  create(productData) {
    return ApiProducts.post(END_POINT, productData)
  },
  update(productId, productData) {
    return ApiProducts.put(`${END_POINT}/${productId}`, productData)
  },
  delete(productId) {
    return ApiProducts.delete(`${END_POINT}/${productId}`)
  }

}