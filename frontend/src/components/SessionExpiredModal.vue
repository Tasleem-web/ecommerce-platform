<template>
  <div
    v-if="visible"
    class="modal fade show d-block"
    tabindex="-1"
    role="dialog"
    style="background-color: rgba(0, 0, 0, 0.5)"
  >
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content">
        <div class="modal-header bg-warning text-white">
          <h5 class="modal-title">
            <i class="bi bi-exclamation-triangle me-2"></i> Session Expired
          </h5>
        </div>
        <div class="modal-body text-center py-4">
          <i class="bi bi-clock-history display-3 text-warning mb-3 d-block"></i>
          <p class="mb-0 fs-5">Your session has expired.</p>
          <p class="text-muted">You will be redirected to the login page.</p>
        </div>
        <div class="modal-footer justify-content-center">
          <button type="button" class="btn btn-warning px-4" @click="redirectToLogin">
            OK
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "SessionExpiredModal",
  data() {
    return {
      visible: false,
    };
  },
  methods: {
    ...mapActions("userModule", ["logout"]),
    ...mapActions(["addNotification"]),
    show() {
      this.visible = true;
    },
    async redirectToLogin() {
      await this.logout();

      this.visible = false;
      localStorage.removeItem("authToken");
      sessionStorage.removeItem("authToken");
      this.addNotification({
        type: "success",
        message: "Logged out successfully",
      });
      this.$router.push({ name: "Login" });
    },
  },
};
</script>
