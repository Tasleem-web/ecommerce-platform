<template>
  <div class="row border p-2 rounded" v-if="product">
    <div class="col-4 p-0 rounded border">
      <img :src="product.image" class="w-100" alt="" />
    </div>
    <div class="col-8">
      <h1>{{ product.title }}</h1>
      <h3>${{ product.price }}</h3>

      <div class="d-flex">
        <input
          type="text"
          v-model.number="quantity"
          class="text-center col-1 me-2 p-1 rounded"
        />
        <button class="btn btn-primary" @click="addToCart">Add to cart</button>
      </div>

      <p class="mt-4">
        {{ product.description }}
      </p>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
export default {
  name: "ProductComponent",
  props: ["id"],
  data() {
    return {
      quantity: 1,
    };
  },
  computed: {
    ...mapState({
      product: (state) => state.productModule.product,
    }),
  },
  mounted() {
    this.getProduct(this.id);
    // ...mapActions
    // this.$store.dispatch("getProduct", this.id);
  },
  methods: {
    ...mapActions("productModule", ["getProduct"]),
    ...mapActions("cart", ["addProductToCart"]),
    addToCart() {
      this.addProductToCart({
        product: this.product,
        quantity: this.quantity,
      });
    },
  },
};
</script>

<style scoped></style>
