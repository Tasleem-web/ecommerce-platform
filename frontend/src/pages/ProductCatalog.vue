<template>
  <div class="bg-light">
    <div class="d-flex justify-content-end mb-3 px-3 py-3">
      <!-- <button class="btn btn-primary" @click="navigateToAddProduct">
        Add Product
      </button> -->
      <router-link class="btn btn-primary" :to="{ path: '/product/add' }"
        >Add Product
      </router-link>
    </div>
    <div class="container pb-4 mb-4">
      <!-- Controls Panel: Filters & Sorting -->
      <div class="row g-3 mb-4 align-items-center bg-white p-3 rounded shadow-sm mx-0">
        <!-- Filter by Category -->
        <div class="col-12 col-md-4" v-loader="isLoading">
          <label class="form-label small fw-bold text-muted">Category</label>
          <select v-model="filters.category" class="form-select">
            <option value="all">All Categories</option>
            <option v-for="cat in uniqueCategories" :key="cat" :value="cat">
              {{ formatCategory(cat) }}
            </option>
          </select>
        </div>

        <!-- Filter by Availability -->
        <div class="col-12 col-md-4" v-loader="isLoading">
          <label class="form-label small fw-bold text-muted">Availability</label>
          <select v-model="filters.stock" class="form-select">
            <option value="all">All Items</option>
            <option value="in-stock">In Stock Only</option>
            <option value="out-of-stock">Out of Stock Only</option>
          </select>
        </div>

        <!-- Sorting Controls -->
        <div class="col-12 col-md-4" v-loader="isLoading">
          <label class="form-label small fw-bold text-muted">Sort By</label>
          <select v-model="sortBy" class="form-select">
            <option value="default">Default</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Rating: High to Low</option>
          </select>
        </div>
      </div>

      <!-- Layout View Toggle & Summary Status -->
      <div class="d-flex justify-content-between align-items-center mb-4 px-2">
        <p class="text-muted small mb-0">
          Showing {{ displayedProducts.length }} of {{ filteredProducts.length }} products
        </p>

        <!-- Toggle Switch Control -->
        <div
          class="btn-group btn-group-sm shadow-sm"
          role="group"
          aria-label="Layout view toggle"
          v-loader="isLoading"
        >
          <button
            type="button"
            @click="viewMode = 'grid'"
            class="btn px-3"
            :class="viewMode === 'grid' ? 'btn-primary' : 'btn-outline-primary'"
          >
            <i class="bi bi-grid-3x3-gap-fill me-1"></i> Grid
          </button>
          <button
            type="button"
            @click="viewMode = 'list'"
            class="btn px-3"
            :class="viewMode === 'list' ? 'btn-primary' : 'btn-outline-primary'"
          >
            <i class="bi bi-list-task me-1"></i> List
          </button>
        </div>
      </div>

      <!-- Dynamic Product Framework: Grid vs List Layout Configuration -->
      <div
        v-if="displayedProducts.length > 0"
        class="row g-4"
        :class="
          viewMode === 'grid' ? 'row-cols-1 row-cols-md-2 row-cols-lg-3' : 'row-cols-1'
        "
      >
        <div v-for="product in displayedProducts" :key="product.id" class="col">
          <!-- Adds 'flex-md-row' alignment property during List layouts -->
          <div
            class="card h-100 shadow-sm product-card"
            :class="{ 'flex-md-row align-items-center': viewMode === 'list' }"
          >
            <!-- Image Frame -->
            <div
              class="img-container position-relative"
              :class="{ 'list-img-width': viewMode === 'list' }"
            >
              <router-link :to="`/product/${product.id}`" class="text-decoration-none">
                <img :src="product.image" :alt="product.title" loading="lazy" />
              </router-link>
              <!-- <span class="badge bg-danger position-absolute top-0 end-0 m-2"
                >{{ product.discount }}% OFF
              </span> -->
              <font-awesome-icon
                icon="heart"
                @click="toggleWishlist(product)"
                :class="[
                  'wishlist position-absolute',
                  { 'text-danger': isInWishlist(product) },
                ]"
              />
            </div>

            <!-- Information Frame -->
            <div class="card-body d-flex flex-column h-100 w-100">
              <span class="badge bg-secondary mb-2 align-self-start"
                >{{ product.category }}
              </span>
              <!-- <h5 class="card-title fs-6 text-dark fw-bold text-truncate-2">
                {{ product.title }}
              </h5> -->
              <router-link :to="`/product/${product.id}`" class="text-decoration-none">
                <h5 class="card-title fs-6 text-dark fw-bold text-truncate-2">
                  {{ product.title }}
                </h5>
              </router-link>
              <p
                class="card-text text-muted small flex-grow-1 text-truncate-3"
                data-bs-toggle="tooltip"
                :title="product.description"
              >
                {{ product.description }}
              </p>

              <div class="mt-auto pt-3 border-top">
                <div class="d-flex justify-content-between align-items-center mb-3">
                  <span class="text-success fw-bold fs-5"
                    >${{ Number(product.price).toFixed(2) }}</span
                  >
                  <div class="small text-muted" v-if="product.rating">
                    <i class="bi bi-star-fill text-warning me-1"></i
                    >{{ product.rating.rate }}
                    <span class="text-black-50">({{ product.rating.count }})</span>
                  </div>
                </div>

                <div class="d-flex justify-content-between align-items-center gap-2">
                  <button
                    v-if="product.stock > 0"
                    class="btn btn-primary flex-grow-1"
                    @click="addToCart(product)"
                  >
                    <i class="bi bi-cart-plus me-1"></i> Add to Cart
                  </button>
                  <button v-else class="btn btn-outline-danger flex-grow-1" disabled>
                    <i class="bi bi-cart-x me-1"></i> Out of Stock
                  </button>
                  <button
                    type="button"
                    class="btn btn-outline-secondary btn-sm"
                    @click="goToAdmin(product)"
                    aria-label="Edit product"
                  >
                    <font-awesome-icon icon="pen-to-square" size="1x" class="edit-icon" />
                  </button>
                  <button
                    type="button"
                    class="btn btn-danger btn-sm"
                    aria-label="Delete product"
                    data-bs-toggle="modal"
                    data-bs-target="#staticBackdrop"
                    @click="setProductToDelete(product)"
                  >
                    <font-awesome-icon icon="trash" size="1x" class="delete-icon" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div
        v-loader="isLoading"
        v-else
        class="text-center py-5 bg-white rounded shadow-sm"
      >
        <!-- <Spinner /> -->
        <i class="bi bi-box-seizures display-4 text-muted"></i>
        <p class="mt-3 text-muted">No products match your selected criteria.</p>
      </div>

      <!-- delete dialog confirmation -->
      <div
        class="modal fade"
        tabindex="-1"
        role="dialog"
        id="staticBackdrop"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        aria-labelledby="staticBackdropLabel"
      >
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Confirm Deletion</h5>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">
              <p>Are you sure you want to delete this product?</p>
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                data-bs-dismiss="modal"
                @click="cancelDelete"
              >
                Cancel
              </button>
              <button
                type="button"
                class="btn btn-danger"
                data-bs-dismiss="modal"
                @click="confirmDelete"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination Section -->
      <div
        v-if="filteredProducts.length > itemsPerPage"
        class="d-flex flex-column align-items-center mt-5"
      >
        <button
          v-if="hasMoreItems && paginationType === 'load-more'"
          @click="loadMore"
          class="btn btn-outline-primary px-4 py-2 mb-4"
        >
          <i class="bi bi-arrow-clockwise me-1"></i> Load More Products
        </button>

        <nav v-if="paginationType === 'pages'" aria-label="Product pagination">
          <ul class="pagination justify-content-center m-0">
            <li class="page-item" :class="{ disabled: currentPage === 1 }">
              <a class="page-link" href="#" @click.prevent="currentPage--">&laquo;</a>
            </li>
            <li
              v-for="page in totalPages"
              :key="page"
              class="page-item"
              :class="{ active: currentPage === page }"
            >
              <a class="page-link" href="#" @click.prevent="currentPage = page">{{
                page
              }}</a>
            </li>
            <li class="page-item" :class="{ disabled: currentPage === totalPages }">
              <a class="page-link" href="#" @click.prevent="currentPage++">&raquo;</a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
// import Spinner from "@/components/Spinner.vue";
export default {
  name: "ProductCatalog",
  components: {
    // Spinner,
  },
  data() {
    return {
      paginationType: "pages", // Toggle configurations via 'load-more' or 'pages'
      itemsPerPage: 6,
      currentPage: 1,
      visibleCount: 3,
      viewMode: "grid", // Keeps state baseline track of 'grid' or 'list' layout selections
      sortBy: "default",
      filters: {
        category: "all",
        stock: "all",
      },
      productToDelete: null,
      isLoading: true,
    };
  },
  computed: {
    uniqueCategories() {
      const products = Array.isArray(this.products) ? this.products : [];
      return [
        ...new Set(
          products
            .map((p) => p.category)
            .filter((cat) => typeof cat === "string" && cat.trim().length)
        ),
      ];
    },
    filteredProducts() {
      let result = Array.isArray(this.products) ? [...this.products] : [];

      if (this.filters.category !== "all") {
        result = result.filter((p) => p.category === this.filters.category);
      }
      if (this.filters.stock === "in-stock") {
        result = result.filter((p) => p.stock > 0);
      } else if (this.filters.stock === "out-of-stock") {
        result = result.filter((p) => p.stock === 0);
      }
      if (this.sortBy === "price-low") {
        result.sort((a, b) => a.price - b.price);
      } else if (this.sortBy === "price-high") {
        result.sort((a, b) => b.price - a.price);
      } else if (this.sortBy === "rating") {
        result.sort((a, b) => (b.rating?.rate || 0) - (a.rating?.rate || 0));
      }
      return result;
    },
    totalPages() {
      return Math.ceil(this.filteredProducts.length / this.itemsPerPage);
    },
    displayedProducts() {
      if (this.paginationType === "load-more") {
        return this.filteredProducts.slice(0, this.visibleCount);
      }
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredProducts.slice(start, end);
    },
    hasMoreItems() {
      return this.visibleCount < this.filteredProducts.length;
    },
    ...mapState({
      products: (state) => state.productModule.products.items,
      productCount: (state) => state.productModule.products.total,
      wishlist: (state) => state.wishlistModule.wishlist,
    }),
  },
  watch: {
    filteredProducts() {
      this.currentPage = 1;
      this.visibleCount = this.itemsPerPage;
      this.$nextTick(() => {
        if (typeof this.$initTooltips === "function") {
          this.$initTooltips();
        }
      });
    },
  },
  mounted() {
    this.isLoading = true;
    Promise.all([this.fetchProducts(), this.fetchWishlist()]).finally(() => {
      this.isLoading = false;
    });
  },
  updated() {
    this.$nextTick(() => {
      if (typeof this.$initTooltips === "function") {
        this.$initTooltips();
      }
    });
  },
  methods: {
    ...mapActions("productModule", ["fetchProducts", "deleteProduct", "fetchWishlist"]),
    ...mapActions("wishlistModule", [
      "addToWishlist",
      "removeFromWishlist",
      "fetchWishlist",
    ]),
    ...mapActions("cartModule", ["addProductToCart"]),
    formatCategory(value) {
      if (typeof value !== "string") return "";
      return value
        .split(" ")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
    },
    goToAdmin(product) {
      this.$router.push({ path: `/product/edit/${product.id}` });
    },
    toggleWishlist(product) {
      const productId = product.id;
      const isWishlisted = product.isWishlisted;
      if (isWishlisted) {
        this.removeFromWishlist({ productId, title: product.title });
        product.isWishlisted = false;
      } else {
        this.addToWishlist(product);
        product.isWishlisted = true;
      }
    },
    isInWishlist(product) {
      return product.isWishlisted === true;
    },
    loadMore() {
      this.visibleCount += this.itemsPerPage;
    },
    setProductToDelete(product) {
      this.productToDelete = product;
    },
    cancelDelete() {
      this.productToDelete = null;
    },
    confirmDelete() {
      if (!this.productToDelete) return;
      this.deleteProduct(this.productToDelete.id);
      this.productToDelete = null;
    },
    addToCart(product) {
      this.addProductToCart({ product, quantity: 1 });
    },
  },
};
</script>

<style scoped>
.product-card {
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}
.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.12) !important;
}
.img-container {
  height: 250px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background-color: #fff;
}
.img-container img {
  height: 205px;
  width: 250px;
  object-fit: contain;
}
.text-truncate-2,
.text-truncate-3 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
  line-height: 1.4;
  word-break: break-word;
}
.text-truncate-2 {
  -webkit-line-clamp: 2;
  max-height: calc(1.4em * 2);
}
.text-truncate-3 {
  -webkit-line-clamp: 3;
  max-height: calc(1.4em * 3.2);
}
.wishlist {
  top: 10px;
  right: 10px;
  cursor: pointer;
  font-size: 1.2rem;
  transition: transform 0.2s ease-in-out;
}
/* Modifies the landscape container sizing criteria exclusively when list-view is chosen */
@media (min-width: 768px) {
  .list-img-width {
    width: 280px;
    height: 100%;
    min-height: 250px;
    flex-shrink: 0;
  }
}
</style>
