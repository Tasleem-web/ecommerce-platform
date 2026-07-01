import Wishlist from "@/apis/Wishlist";

export const fetchWishlist = async ({ commit }) => {
  try {
    const res = await Wishlist.getWishlistItems();
    commit("SET_WISHLIST", res.data || []);
  } catch (err) {
    console.error("Error fetching wishlist:", err);
  }
}

export const addToWishlist = async ({ commit, dispatch }, item) => {
  try {
    dispatch("addNotification", {
      type: "success",
      message: `Added "${item.title}" to wishlist`,
      timeout: 3000
    }, { root: true });

    const res = await Wishlist.addToWishlist({
      productId: item.productId || item.id,
      title: item.title,
      category: item.category,
      image: item.image,
      price: item.price
    });
    commit("ADD_TO_WISHLIST", res.data);
  } catch (err) {
    console.error("Error adding to wishlist:", err);
  }
}

export const removeFromWishlist = async ({ commit, dispatch }, { productId, title }) => {
  try {
    dispatch("addNotification", {
      type: "warning",
      message: `Removed "${title}" from wishlist`,
      timeout: 3000
    }, { root: true });

    await Wishlist.removeFromWishlist(productId);
    commit("REMOVE_FROM_WISHLIST", productId);
  } catch (err) {
    console.error("Error removing from wishlist:", err);
  }
}