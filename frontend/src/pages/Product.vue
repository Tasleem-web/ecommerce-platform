<template>
  <!-- 1. Ensure row has d-flex and align-items-stretch -->
  <div
    class="row border p-2 rounded product-component d-flex align-items-stretch"
    v-if="product"
  >
    <!-- 2. The wrapper column is forced into a flexbox context -->
    <div class="col-4 p-0 rounded border d-flex flex-column dynamic-image-container">
      <div class="image-inner-box">
        <img :src="product.image" :alt="product.title" class="product-img" />
      </div>
    </div>

    <!-- This column naturally controls the overall card height based on text length -->
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

<style scoped>
/* 1. Force the parent column layout to span matching column-8 text height boundaries */
.dynamic-image-container {
  position: relative;
}

/* 2. Break the image asset's circular height calculation loop */
.image-inner-box {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px; /* Safe padding spacing around the graphic inside the border */
}

/* 3. Fit perfectly within the parent container context layout boundaries */
.product-img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  display: block;
}
</style>
