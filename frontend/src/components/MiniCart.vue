<template>
  <div
    class="dropdown-menu dropdown-menu-end p-2"
    aria-labelledby="dropdownMenuButton1"
    @click.stop
  >
    <div v-for="product in cart" :key="product.id">
      <div class="d-flex px-2 justify-content-between">
        <div>
          <strong>{{ product.product.title }}</strong>
          <br />
          {{ product.quantity }} x ${{ product.product.price }}
        </div>
        <div>
          <a
            class="badge bg-secondary text-decoration-none"
            href="#"
            @click="removeItemFromCart(product)"
            >remove</a
          >
        </div>
      </div>
      <hr />
    </div>
    <div
      class="d-flex justify-content-between"
      :class="cartTotalPrice == 0 && 'text-body-tertiary'"
    >
      <div><strong>Total :</strong> ${{ cartTotalPrice }}</div>
      <div>
        <a
          href="#"
          @click.prevent="clearCartItems(cart)"
          :class="cartTotalPrice == 0 && 'disabled pe-none'"
          :ariaDisabled="cartTotalPrice == 0"
        >
          Clear Cart
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState, mapActions } from "vuex";
export default {
  name: "MiniCart",
  computed: {
    ...mapState("cartModule", ["cart"]),
    // ...mapState({
    //   cart: (state) => state.cartModule.cart,
    // }),
    ...mapGetters("cartModule", ["cartTotalPrice"]),
  },
  methods: {
    ...mapActions({
      getCartItems: "cartModule/getCartItems",
      clearCartItems: "cartModule/clearCartItems",
      removeItemFromCart: "cartModule/removeItemFromCart",
    }),
    // ...mapActions(["getCartItems", "clearCartItems", "removeItemFromCart"]),
  },
  mounted() {
    this.getCartItems();
  },
};
</script>

<style scoped>
.dropdown-menu {
  min-width: 320px;
  max-height: 60vh;
  overflow-y: auto;
}
</style>
