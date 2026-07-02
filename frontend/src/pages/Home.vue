<template>
  <div class="container mt-4">
    <h1>Welcome to the E-commerce Platform</h1>
    <p>This is the home page of the application.</p>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
  name: "HomeComponent",
  components: {},
  computed: {
    ...mapState("wishlistModule", {
      wishlistItems: (state) => state.wishlist,
    }),
  },
  methods: {
    ...mapActions("wishlistModule", ["fetchWishlist"]),
  },
  mounted() {
    if (this.wishlistItems.length === 0) {
      this.fetchWishlist();
    }
  },
};
</script>

<style scoped></style>
