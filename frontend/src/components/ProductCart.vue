<template>
  <div class="col-3">
    <div class="card h-100 text-left d-flex flex-column">
      <img
        :src="product.image"
        class="card-img-top w-100 object-fit-contain bg-light"
        style="height: 200px"
        alt="..."
      />
      <div class="card-body d-flex flex-column flex-grow-1">
        <h5
          class="card-title text-primary text-truncate d-block"
          data-bs-toggle="tooltip"
          :data-bs-title="product.title"
        >
          <router-link :to="{ name: 'product', params: { id: product.id } }"
            >{{ product.title }}
          </router-link>
        </h5>
        <p class="card-text fw-bold">${{ product.price }}</p>
        <p
          class="card-text text-truncate d-block"
          data-bs-toggle="tooltip"
          :data-bs-title="product.description"
        >
          {{ product.description }}
        </p>
      </div>
      <div class="px-3 pb-3">
        <button class="btn btn-secondary" @click="addToCart">Add to cart</button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { Tooltip } from "bootstrap";

export default {
  name: "ProductCart",
  props: ["product"],
  methods: {
    ...mapActions("cartModule", ["addProductToCart"]),
    addToCart() {
      this.addProductToCart({
        product: this.product,
        quantity: 1,
      });
    },
  },
};
</script>

<style scoped></style>
