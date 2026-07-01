<template>
  <div class="row justify-content-center">
    <div class="col-12 col-sm-8 col-md-6 col-lg-6">
      <!-- Login Card Container -->
      <div class="card shadow border-0 rounded-3">
        <div class="card-body p-4 p-sm-5">
          <!-- Header/Logo Area -->
          <div class="text-center mb-4">
            <h3 class="fw-bold text-dark mb-2">Welcome Back</h3>
            <p class="text-muted small">Please sign in to your account</p>
          </div>

          <!-- Form Starts Here -->
          <!-- Note: Added @submit.prevent here for standard form handling -->
          <form @submit.prevent="login">
            <!-- Email Input Field -->
            <div class="mb-3">
              <label for="emailInput" class="form-label text-secondary small fw-semibold"
                >Email address</label
              >
              <input
                v-model="formData.email"
                @blur="touched.email = true"
                type="email"
                class="form-control form-control-lg fs-6"
                :class="{ 'is-invalid': touched.email && errors.email }"
                id="emailInput"
                placeholder="name@example.com"
              />
              <!-- Bootstrap validation error container -->
              <div v-if="touched.email && errors.email" class="invalid-feedback">
                {{ errors.email }}
              </div>
            </div>

            <!-- Password Input Field -->
            <div class="mb-3">
              <div class="d-flex justify-content-between align-items-center mb-1">
                <label
                  for="passwordInput"
                  class="form-label text-secondary small fw-semibold mb-0"
                  >Password</label
                >
                <a href="#" class="text-primary text-decoration-none small"
                  >Forgot password?</a
                >
              </div>
              <input
                v-model="formData.password"
                @blur="touched.password = true"
                type="password"
                class="form-control form-control-lg fs-6"
                :class="{ 'is-invalid': touched.password && errors.password }"
                id="passwordInput"
                placeholder="••••••••"
              />
              <!-- Bootstrap validation error container -->
              <div v-if="touched.password && errors.password" class="invalid-feedback">
                {{ errors.password }}
              </div>
            </div>

            <!-- Remember Me Checkbox -->
            <div class="mb-4 form-check">
              <input
                v-model="formData.rememberMe"
                type="checkbox"
                class="form-check-input"
                id="rememberMe"
              />
              <label
                class="form-check-label text-secondary small"
                id="rememberMeLabel"
                for="rememberMe"
                >Remember me</label
              >
            </div>

            <!-- Submit Action Button -->
            <button type="submit" class="btn btn-primary btn-lg w-100 fs-6 mb-3">
              Sign In
            </button>
          </form>

          <!-- Alternative Registration Link -->
          <div class="text-center">
            <span class="text-muted small">Don't have an account?</span>
            <router-link class="nav-link" :to="{ name: 'Register' }">
              Register
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "LoginComponent",
  data() {
    return {
      formData: {
        email: "tasleem+admin@mail.com",
        password: "123456789",
        rememberMe: false,
      },
      touched: {
        email: false,
        password: false,
      },
    };
  },
  computed: {
    errors() {
      const errs = {};
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!this.formData.email) {
        errs.email = "Email address is required.";
      } else if (!emailRegex.test(this.formData.email)) {
        errs.email = "Please enter a valid email address.";
      }

      if (!this.formData.password) {
        errs.password = "Password is required.";
      } else if (this.formData.password.length < 8) {
        errs.password = "Password must be at least 8 characters long.";
      }

      return errs;
    },
    isFormValid() {
      return Object.keys(this.errors).length === 0;
    },
  },
  methods: {
    ...mapActions("userModule", ["authenticate"]),
    ...mapActions(["addNotification"]),

    async login() {
      this.touched.email = true;
      this.touched.password = true;

      if (!this.isFormValid) {
        this.addNotification({
          type: "danger",
          message: "Please enter a valid email and password.",
        });
        return;
      }

      try {
        await this.authenticate({
          email: this.formData.email,
          password: this.formData.password,
        });
        this.$router.push({ name: "home" });
      } catch (err) {
        console.error("Login failed", err);
        this.addNotification({
          type: "danger",
          message:
            err?.response?.data?.message ||
            err.message ||
            "Login failed. Please check your credentials.",
        });
      }
    },
  },
};
</script>

<style scoped></style>
