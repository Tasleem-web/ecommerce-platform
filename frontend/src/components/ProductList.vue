<template>
  <div v-if="products.length > 0" class="row g-3 mt-3">
    <ProductCart v-for="product in products" :key="product.id" :product="product" />
  </div>
  <div v-else>
    <Spinner />
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import ProductCart from "./ProductCart.vue";
import Spinner from "./Spinner.vue";
export default {
  name: "ProductList",
  components: {
    ProductCart,
    Spinner,
  },
  computed: {
    ...mapState({
      products: (state) => state.productModule.products.items || [],
    }),
  },
  mounted() {
    this.fetchProducts();
  },
  methods: {
    ...mapActions({
      fetchProducts: "productModule/fetchProducts",
    }),
    // ...mapActions("productModule", ["fetchProducts"]),
  },
};
</script>

<style scoped></style>
