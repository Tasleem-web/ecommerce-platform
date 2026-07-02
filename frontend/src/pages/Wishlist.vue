<template>
  <div class="container my-5">
    <h2 class="mb-4 d-flex align-items-center">
      <span class="me-2">❤️</span> My Wishlist
    </h2>

    <!-- Conditional Layout: If Wishlist has Items -->
    <div class="row g-4" v-if="wishlistItems && wishlistItems.length > 0">
      <!-- Loop through Wishlist Items -->
      <WishlistItemCard
        v-for="item in wishlistItems"
        :key="item.id"
        :item="item"
        @remove="removeItem"
        @move-to-cart="moveToCart"
      />
    </div>

    <!-- Conditional Layout: Empty State View -->
    <div class="text-center py-5 shadow-sm border rounded bg-light" v-else>
      <div class="fs-1 mb-3">💝</div>
      <h3>Your wishlist is empty</h3>
      <p class="text-muted">
        Tap the heart icon on your catalog views to bookmark products here.
      </p>
      <button class="btn btn-outline-primary mt-2 px-4" @click="exploreProducts">
        Explore Catalog
      </button>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import WishlistItemCard from "@/components/WishlistItemCard.vue";

export default {
  name: "WishlistComponent",
  components: {
    WishlistItemCard,
  },
  computed: {
    ...mapState("wishlistModule", {
      wishlistItems: (state) => state.wishlist,
    }),
  },
  methods: {
    ...mapActions("wishlistModule", ["removeFromWishlist"]),
    ...mapActions("cartModule", ["addProductToCart"]),

    removeItem({ productId, title }) {
      this.removeFromWishlist({ productId, title });
    },
    moveToCart(item) {
      this.addProductToCart({
        product: {
          id: item.productId,
          title: item.title,
          category: item.category,
          image: item.image,
          price: item.price,
        },
        quantity: 1,
      });
      this.removeItem({ productId: item.productId, title: item.title });
    },
    exploreProducts() {
      this.$router.push("/products");
    },
  },
};
</script>

<style scoped>
/* 1. Anchors image height strictly to match card ratios evenly */
.wishlist-image-wrapper {
  width: 100%;
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.wishlist-img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  display: block;
}

/* 2. Forces lines to break into standard multi-line ellipsis rules if strings are too long */
.text-multiline-truncate {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  height: 3rem; /* Keeps row heights balanced when layout texts differ in string length */
}
</style>
