<template>
  <div class="container my-5">
    <h2 class="mb-4 d-flex align-items-center">
      <span class="me-2">❤️</span> My Wishlist
    </h2>

    <!-- Conditional Layout: If Wishlist has Items -->
    <div class="row g-4" v-if="wishlistItems && wishlistItems.length > 0">
      <!-- Loop through Wishlist Items (Displays in a responsive grid) -->
      <div v-for="item in wishlistItems" :key="item.id" class="col-12 col-md-6 col-lg-4">
        <div class="card h-100 shadow-sm border position-relative overflow-hidden">
          <!-- Category Badge Overlay -->
          <div class="position-absolute top-0 start-0 m-2">
            <span class="badge bg-secondary text-uppercase small">{{
              item.category
            }}</span>
          </div>

          <!-- Remove Button Cross Overlay -->
          <button
            class="btn btn-sm btn-light position-absolute top-0 end-0 m-2 rounded-circle border shadow-sm"
            @click="removeItem(item.productId, item.title)"
            title="Remove from Wishlist"
            style="width: 32px; height: 32px; line-height: 1"
          >
            ✕
          </button>

          <!-- 1. Product Image Frame Wrapper -->
          <div class="wishlist-image-wrapper bg-white border-bottom p-3 mt-4">
            <img :src="item.image" :alt="item.title" class="wishlist-img" />
          </div>

          <!-- Card Body Content Box -->
          <div class="card-body d-flex flex-column">
            <!-- IDs Metadata Context Layer -->
            <div class="text-muted small mb-2 d-flex justify-content-between">
              <span>Prod ID: {{ item.productId }}</span>
              <span>User ID: {{ item.userId }}</span>
            </div>

            <!-- 2. Product Title (Truncates gracefully to 2 lines maximum) -->
            <h5 class="card-title text-multiline-truncate mb-2" :title="item.title">
              {{ item.title }}
            </h5>

            <!-- 3. Base Pricing Component -->
            <h4 class="text-primary fw-bold mb-4 mt-auto">
              ${{ item.price.toFixed(2) }}
            </h4>

            <!-- 4. Interactive Operational Action Buttons -->
            <div class="d-grid gap-2">
              <button class="btn btn-primary" @click="moveToCart(item)">
                🛒 Move to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
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

export default {
  name: "WishlistComponent",
  computed: {
    ...mapState("wishlistModule", {
      wishlistItems: (state) => state.wishlist,
    }),
  },
  methods: {
    ...mapActions("wishlistModule", ["removeFromWishlist", "fetchWishlist"]),
    ...mapActions("cartModule", ["addProductToCart"]),

    removeItem(productId, title) {
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
      this.removeItem(item.productId, item.title);
    },
    exploreProducts() {
      this.$router.push("/catalog");
    },
  },
  mounted() {
    this.fetchWishlist();
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
