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
          <form>
            <!-- Email Input Field -->
            <div class="mb-3">
              <label for="emailInput" class="form-label text-secondary small fw-semibold"
                >Email address</label
              >
              <input
                type="email"
                class="form-control form-control-lg fs-6"
                id="emailInput"
                placeholder="name@example.com"
                required
              />
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
                type="password"
                class="form-control form-control-lg fs-6"
                id="passwordInput"
                placeholder="••••••••"
                required
              />
            </div>

            <!-- Remember Me Checkbox -->
            <div class="mb-4 form-check">
              <input type="checkbox" class="form-check-input" id="rememberMe" />
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
            <a href="#" class="text-primary text-decoration-none small fw-semibold ms-1"
              >Register</a
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "HomeComponent",
  components: {},
};
</script>

<style scoped></style>
