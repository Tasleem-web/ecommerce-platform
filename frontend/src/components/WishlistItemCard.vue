<template>
  <div class="col-12 col-md-6 col-lg-4">
    <div class="card h-100 shadow-sm border position-relative overflow-hidden">
      <!-- Category Badge Overlay -->
      <div class="position-absolute top-0 start-0 m-2">
        <span class="badge bg-secondary text-uppercase small">{{ item.category }}</span>
      </div>

      <!-- Remove Button Cross Overlay -->
      <button
        class="btn btn-sm btn-light position-absolute top-0 end-0 m-2 rounded-circle border shadow-sm"
        @click="onRemove"
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
          ${{ Number(item.price).toFixed(2) }}
        </h4>

        <!-- 4. Interactive Operational Action Buttons -->
        <div class="d-grid gap-2">
          <button class="btn btn-primary" @click="onMoveToCart">🛒 Move to Cart</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "WishlistItemCard",
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  methods: {
    onRemove() {
      this.$emit("remove", { productId: this.item.productId, title: this.item.title });
    },
    onMoveToCart() {
      this.$emit("move-to-cart", this.item);
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
