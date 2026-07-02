<template>
  <div class="container my-5">
    <h2 class="mb-4 d-flex align-items-center">
      <span class="me-2">🛒</span> Shopping Cart
    </h2>

    <!-- Conditional Layout: If Cart has Items -->
    <div class="row g-4" v-if="cartItems && cartItems.length > 0">
      <!-- Left Side: List of Items (col-lg-8) -->
      <div class="col-lg-8">
        <div class="card shadow-sm border p-3">
          <div
            v-for="(item, index) in cartItems"
            :key="item.id"
            class="row align-items-center py-3 border-bottom g-3"
            :class="{ 'border-bottom-0': index === cartItems.length - 1 }"
          >
            <!-- 1. Image Field Wrapper -->
            <div class="col-3 col-sm-2 text-center">
              <div class="cart-image-wrapper bg-light rounded border p-1">
                <img :src="item.image" :alt="item.title" class="img-fluid cart-img" />
              </div>
            </div>

            <!-- 2. Product Description Block -->
            <div class="col-9 col-sm-5">
              <span class="badge bg-secondary mb-1 text-uppercase small">{{
                item.category
              }}</span>
              <h5 class="text-truncate mb-1" :title="item.title">{{ item.title }}</h5>
              <div class="text-muted small">
                <span>Product ID: {{ item.productId }}</span>
                <span class="mx-2">|</span>
                <span>User ID: {{ item.userId }}</span>
              </div>
            </div>

            <!-- 3. Quantity Controls Module -->
            <div class="col-6 col-sm-3 d-flex align-items-center">
              <div class="input-group input-group-sm quantity-selector">
                <button
                  class="btn btn-outline-secondary"
                  type="button"
                  @click="updateQty(item, item.quantity - 1)"
                  :disabled="item.quantity <= 1"
                >
                  -
                </button>
                <input
                  type="text"
                  class="form-control text-center bg-white"
                  :value="item.quantity"
                  readonly
                />
                <button
                  class="btn btn-outline-secondary"
                  type="button"
                  @click="updateQty(item, item.quantity + 1)"
                >
                  +
                </button>
              </div>
            </div>

            <!-- 4. Price & Trash Module -->
            <div
              class="col-6 col-sm-2 text-end d-flex flex-sm-column justify-content-between align-items-end h-100"
            >
              <span class="fw-bold fs-5"
                >${{ (item.price * item.quantity).toFixed(2) }}</span
              >
              <button
                class="btn btn-sm btn-outline-danger mt-sm-2"
                @click="removeItem(item.id)"
                title="Remove Item"
              >
                🗑️
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Side: Order Summary Checkout Card (col-lg-4) -->
      <div class="col-lg-4">
        <div class="card shadow-sm border p-4" style="top: 20px">
          <h4 class="mb-4">Order Summary</h4>

          <div class="d-flex justify-content-between mb-2">
            <span class="text-muted">Total Items:</span>
            <span class="fw-semibold">{{ totalItemsCount }} items</span>
          </div>

          <div class="d-flex justify-content-between mb-3">
            <span class="text-muted">Shipping:</span>
            <span class="text-success fw-semibold">FREE</span>
          </div>

          <hr class="my-3" />

          <div class="d-flex justify-content-between align-items-center mb-4">
            <span class="fs-5 fw-bold">Grand Total:</span>
            <span class="fs-4 fw-bold text-primary"
              >${{ cartTotalAmount.toFixed(2) }}</span
            >
          </div>

          <button class="btn btn-primary w-100 py-2 fs-5 fw-medium" @click="checkout">
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>

    <!-- Conditional Layout: Empty State View -->
    <div class="text-center py-5 shadow-sm border rounded bg-light" v-else>
      <div class="fs-1 mb-3">📦</div>
      <h3>Your cart is empty</h3>
      <p class="text-muted">
        Looks like you haven't added any items to your inventory space yet.
      </p>
      <button class="btn btn-primary mt-2 px-4" @click="continueShopping">
        Continue Shopping
      </button>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "CartComponent",
  data() {
    return {};
  },
  computed: {
    // Computes aggregate number of objects currently residing in stack
    totalItemsCount() {
      return this.cartItems.reduce((acc, item) => acc + item.quantity, 0);
    },
    // Dynamically tracks the absolute baseline pricing payload
    cartTotalAmount() {
      return this.cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    },
    ...mapState({
      cartItems: (state) => state.cartModule.cart,
    }),
  },
  methods: {
    // Updates quantity counter values seamlessly
    updateQty(item, newQty) {
      if (newQty < 1) return;
      item.quantity = newQty;
      // Note: If wiring to Vuex, deploy: this.$store.dispatch('cart/updateQty', { id: item.id, qty: newQty });
    },
    // Drops an element targeting explicit array indexes
    removeItem(id) {
      this.cartItems = this.cartItems.filter((item) => item.id !== id);
      // Note: If wiring to Vuex, deploy: this.$store.dispatch('cart/removeItem', id);
    },
    checkout() {
      alert("Redirecting to checkout infrastructure gateway...");
    },
    continueShopping() {
      alert("Redirecting back to catalogs context route...");
    },
  },
};
</script>

<style scoped>
/* Restrains the layout frame so images never explode out of sizing box scale boundaries */
.cart-image-wrapper {
  width: 100%;
  height: 70px;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.cart-img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

/* Restricts the quantitative sizing controllers width constraints */
.quantity-selector {
  max-width: 120px;
}

/* Enforces a clean single line cut-off layout formatting for longer product titles */
.text-truncate {
  max-width: 100%;
  display: inline-block;
}
</style>
