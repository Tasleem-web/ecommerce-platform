import Cart from "@/apis/Cart";

export const addProductToCart = async ({ commit, dispatch }, { product, quantity }) => {
  try {
    dispatch("addNotification", {
      type: "success",
      message: `Added ${quantity} x ${product.title} to cart`,
      timeout: 3000
    }, { root: true });

    // load current cart from API
    const res = await Cart.getCartItems();
    const cartItems = res.data || [];

    // try to find existing item by product id
    const existing = cartItems.find(
      (it) => (it.product && it.product.id === product.id) || it.productId === product.id
    );

    if (existing) {
      const newQuantity = (existing.quantity || 0) + quantity;

      // prefer an explicit update method if available, fall back to addToCart (upsert)
      if (typeof Cart.updateCartItem === "function") {
        await Cart.updateCartItem(existing.id, { quantity: newQuantity });
      } else {
        await Cart.addToCart({
          productId: product.id,
          product,
          quantity: newQuantity,
          id: existing.id
        });
      }
    } else {
      await Cart.addToCart({
        productId: product.id,
        product,
        quantity
      });
    }

    const updated = await Cart.getCartItems();
    commit("GET_CART_ITEMS", updated.data);
  } catch (err) {
    console.error(err);
  }
}

export const removeItemFromCart = ({ commit, dispatch }, cartItem) => {

  dispatch("addNotification", {
    type: "warning",
    message: `Removed ${cartItem.product.title} from cart`,
    timeout: 3000
  }, { root: true });

  Cart.deleteFromCart(cartItem.id);
  commit("REMOVE_PRODUCT", cartItem.id);
}

export const getCartItems = async ({ commit, dispatch }) => {
  dispatch("addNotification", {
    type: "success",
    message: `Cart items refreshed`,
    timeout: 3000
  }, { root: true });

  Cart.getCartItems().then((result) => {
    commit("GET_CART_ITEMS", result.data);
  }).catch((err) => {
    console.error(err);
  });
};

export const clearCartItems = ({ commit, dispatch }, cartItems) => {
  dispatch("addNotification", {
    type: "danger",
    message: `Cleared all items from cart`,
    timeout: 3000
  }, { root: true });

  Cart.deleteAllFromCart(cartItems)
  commit("CLEAR_CART_ITEMS", [])
}