<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col-md-8 offset-md-2">
        <h1 class="mb-4">Edit Product</h1>
        <p class="text-muted mb-4">
          This route is protected and visible only to admin users.
        </p>

        <div class="card shadow-sm">
          <div class="card-body p-4">
            <form @submit.prevent="submitProduct">
              <div class="mb-3">
                <label class="form-label fw-bold">Product Image *</label>
                <div
                  class="image-sections d-flex flex-column justify-content-center align-items-center"
                >
                  <div class="position-relative">
                    <img
                      :src="form.image || defaultImage"
                      alt="Product image"
                      class="rounded-circle product-image-preview"
                      role="button"
                      @click="triggerImageUpload"
                    />
                    <font-awesome-icon
                      icon="pen-to-square"
                      size="1x"
                      class="edit-icon"
                      @click="triggerImageUpload"
                    />
                  </div>
                  <input
                    ref="imageInput"
                    type="file"
                    class="d-none"
                    accept="image/*"
                    @change="onImageChange"
                  />
                  <div
                    class="text-muted font-weight-bold d-flex justify-content-center align-items-center my-3"
                  >
                    <span class="badge bg-secondary">OR</span>
                  </div>
                  <div class="w-100 mt-3">
                    <label for="imageUrl" class="form-label small fw-bold"
                      >Image URL</label
                    >
                    <input
                      id="imageUrl"
                      v-model="form.image"
                      type="url"
                      class="form-control"
                      placeholder="Paste image URL here"
                      @input="clearImageError"
                    />
                  </div>
                  <small class="text-muted mt-2">
                    {{
                      uploadingImage
                        ? "Uploading image..."
                        : "Click the image to upload a file, or paste a direct image URL above"
                    }}
                  </small>
                  <div v-if="errors.image" class="text-danger small mt-1">
                    {{ errors.image }}
                  </div>
                </div>
              </div>
              <!-- Title Field -->
              <div class="mb-3">
                <label for="title" class="form-label fw-bold">Product Title *</label>
                <input
                  v-model="form.title"
                  type="text"
                  class="form-control"
                  id="title"
                  placeholder="Enter product title"
                  maxlength="190"
                  required
                />
                <small class="text-muted d-block mt-1">
                  {{ form.title.length }}/190 characters
                </small>
                <div v-if="errors.title" class="text-danger small mt-1">
                  {{ errors.title }}
                </div>
              </div>

              <!-- Category Field -->
              <div class="mb-3">
                <label for="category" class="form-label fw-bold">Category *</label>
                <input
                  v-model="form.category"
                  type="text"
                  class="form-control"
                  id="category"
                  placeholder="Enter category (e.g., Electronics, Clothing)"
                  maxlength="190"
                  required
                />
                <small class="text-muted d-block mt-1">
                  {{ form.category.length }}/190 characters
                </small>
                <div v-if="errors.category" class="text-danger small mt-1">
                  {{ errors.category }}
                </div>
              </div>

              <!-- Price Field -->
              <div class="mb-3">
                <label for="price" class="form-label fw-bold">Price (USD) *</label>
                <div class="input-group">
                  <span class="input-group-text">$</span>
                  <input
                    v-model.number="form.price"
                    type="number"
                    class="form-control"
                    id="price"
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    required
                  />
                </div>
                <div v-if="errors.price" class="text-danger small mt-1">
                  {{ errors.price }}
                </div>
              </div>

              <!-- Stock Field -->
              <div class="mb-3">
                <label for="stock" class="form-label fw-bold">Stock Quantity</label>
                <input
                  v-model="form.stock"
                  type="number"
                  class="form-control"
                  id="stock"
                  placeholder="0"
                  min="0"
                  step="1"
                />
                <small class="text-muted">Minimum quantity: 0</small>
                <div v-if="errors.stock" class="text-danger small mt-1">
                  {{ errors.stock }}
                </div>
              </div>

              <!-- Description Field -->
              <div class="mb-3">
                <label for="description" class="form-label fw-bold">Description</label>
                <textarea
                  v-model="form.description"
                  class="form-control"
                  id="description"
                  rows="4"
                  placeholder="Enter product description (optional)"
                  maxlength="2000"
                ></textarea>
                <small class="text-muted d-block mt-1">
                  {{ form.description.length }}/2000 characters
                </small>
                <div v-if="errors.description" class="text-danger small mt-1">
                  {{ errors.description }}
                </div>
              </div>

              <!-- Submit Button -->
              <div class="d-grid gap-2 mt-4">
                <button type="submit" class="btn btn-primary btn-lg" :disabled="loading">
                  <span
                    v-if="loading"
                    class="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  {{ isEditMode ? "Update Product" : "Add Product" }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import UserApi from "@/apis/User";
import { useRoute } from "vue-router";

export default {
  name: "ProductConfiguration",
  data() {
    return {
      form: {
        title: "",
        category: "",
        image: "",
        price: "",
        stock: 0,
        description: "",
        rating: { rate: 0, count: 0 },
      },
      errors: {},
      loading: false,
      uploadingImage: false,
      defaultImage:
        "https://res.cloudinary.com/tasleem/image/upload/v1782370648/product_image_hzlp2l.png",
      isEditMode: false,
    };
  },
  async mounted() {
    const route = useRoute();
    const productId = route.params.id;
    if (productId) {
      this.isEditMode = true;
      await this.fetchProduct();
    } else {
      this.isEditMode = false;
    }
  },
  computed: {
    editingProductId() {
      const route = useRoute();
      return route.params.id || null;
    },
    ...mapState({
      product: (state) => state.productModule.product,
    }),
  },
  methods: {
    ...mapActions(["addNotification"]),
    ...mapActions("productModule", ["createProduct", "getProduct", "updateProduct"]),

    triggerImageUpload() {
      this.$refs.imageInput?.click();
    },
    async fetchProduct() {
      const productId = this.editingProductId;
      if (!productId) {
        this.addNotification({
          type: "danger",
          message: "No product ID provided for editing",
        });
        return;
      }

      const product = await this.getProduct(productId);
      if (product) {
        this.form = {
          title: product.title || "",
          category: product.category || "",
          image: product.image || "",
          price: Number(product.price) || 0,
          stock: Number(product.stock) || 0,
          description: product.description || "",
          rating: {
            rate: Number(product.rating?.rate) || 0,
            count: Number(product.rating?.count) || 0,
          },
        };
      }
    },
    onImageChange(event) {
      const file = event.target.files && event.target.files[0];
      if (!file) {
        return;
      }

      if (!file.type.startsWith("image/")) {
        this.errors.image = "Please select a valid image file";
        this.addNotification({
          type: "danger",
          message: "Please select a valid image file",
        });
        return;
      }

      this.uploadProductImage(file);
    },
    clearImageError() {
      if (this.errors.image) {
        this.errors.image = "";
      }
    },
    readFileAsDataUrl(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    },
    async uploadProductImage(file) {
      this.uploadingImage = true;
      this.errors.image = "";

      try {
        const imageData = await this.readFileAsDataUrl(file);
        const uploadResult = await UserApi.uploadImageBuffer(imageData, "product_images");
        const uploadedUrl = uploadResult.data?.url || uploadResult.data?.secure_url;

        if (!uploadedUrl) {
          throw new Error("Image upload did not return a URL");
        }

        this.form.image = uploadedUrl;
        this.addNotification({
          type: "success",
          message: "Image uploaded successfully",
        });
      } catch (error) {
        this.form.image = "";
        this.errors.image = "Image upload failed";
        this.addNotification({
          type: "danger",
          message: error.message || "Image upload failed",
        });
      } finally {
        this.uploadingImage = false;
        if (this.$refs.imageInput) {
          this.$refs.imageInput.value = null;
        }
      }
    },
    validateForm() {
      this.errors = {};

      // Title validation
      if (!this.form.title || this.form.title.trim().length === 0) {
        this.errors.title = "Title is required";
      } else if (this.form.title.length > 190) {
        this.errors.title = "Title must not exceed 190 characters";
      }

      // Category validation
      if (!this.form.category || this.form.category.trim().length === 0) {
        this.errors.category = "Category is required";
      } else if (this.form.category.length > 190) {
        this.errors.category = "Category must not exceed 190 characters";
      }

      // Image validation
      if (!this.form.image || this.form.image.trim().length === 0) {
        this.errors.image = "Image URL is required";
      } else if (!this.isValidUrl(this.form.image)) {
        this.errors.image = "Please enter a valid URL";
      } else if (this.form.image.length > 190) {
        this.errors.image = "Image URL must not exceed 190 characters";
      }

      // Price validation
      if (
        this.form.price === "" ||
        this.form.price === null ||
        this.form.price === undefined
      ) {
        this.errors.price = "Price is required";
      } else if (isNaN(this.form.price) || parseFloat(this.form.price) < 0) {
        this.errors.price = "Price must be a positive number";
      }

      // Stock validation
      if (isNaN(this.form.stock) || parseInt(this.form.stock) < 0) {
        this.errors.stock = "Stock must be a non-negative integer";
      }

      // Description validation
      if (this.form.description.length > 2000) {
        this.errors.description = "Description must not exceed 2000 characters";
      }

      return Object.keys(this.errors).length === 0;
    },
    isValidUrl(url) {
      try {
        new URL(url);
        return true;
      } catch {
        return false;
      }
    },
    getAuthToken() {
      if (typeof window === "undefined") {
        return "";
      }

      return (
        localStorage.getItem("authToken") || sessionStorage.getItem("authToken") || ""
      );
    },
    async submitProduct() {
      if (!this.validateForm()) {
        this.addNotification({
          type: "danger",
          message: "Please fix the errors in the form",
        });
        return;
      }

      const token = this.getAuthToken();
      if (!token) {
        this.addNotification({
          type: "danger",
          message: "You must be logged in as an admin to add products",
        });
        return;
      }

      this.loading = true;
      try {
        // Prepare payload
        const payload = {
          title: this.form.title,
          category: this.form.category,
          image: this.form.image,
          price: parseFloat(this.form.price),
          stock: parseInt(this.form.stock),
          description: this.form.description || null,
          rating: this.form.rating,
        };

        if (!this.isEditMode) {
          await this.createProduct(payload);
        } else {
          await this.updateProduct({
            productId: this.editingProductId,
            productData: payload,
          });
        }
        this.addNotification({
          type: "success",
          message: `Product ${this.isEditMode ? "updated" : "added"} successfully!`,
        });

        // Reset form
        this.form = {
          title: "",
          category: "",
          image: "",
          price: "",
          stock: 0,
          description: "",
          rating: { rate: 0, count: 0 },
        };

        this.$router.push({ name: "products" });
      } catch (error) {
        console.error("Error adding product:", error);
        this.addNotification({
          type: "danger",
          message: error.message || "Failed to add product",
        });
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
}

.form-control:focus,
.form-control:active {
  border-color: #0b57d0;
  box-shadow: 0 0 0 0.2rem rgba(11, 87, 208, 0.25);
}

.btn-primary {
  background-color: #0b57d0;
  border-color: #0b57d0;
}

.btn-primary:hover {
  background-color: #0945a6;
  border-color: #0945a6;
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

small {
  font-size: 0.85rem;
}

.image-sections img {
  border: 1px solid var(--primary-color-dark);
}

.product-image-preview {
  width: 140px;
  height: 140px;
  object-fit: cover;
}

.edit-icon {
  color: var(--primary-color);
  position: absolute;
  bottom: 16px;
  right: 0;
  background-color: #fff;
  cursor: pointer;
  border-radius: 50%;
  padding: 4px;
  background: transparent;
}
</style>
