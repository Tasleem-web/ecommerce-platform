<template>
  <!-- ================= ELEMENT: PROFILE DROPDOWN CARD ================= -->
  <div class="card account-dropdown-card shadow p-3">
    <div class="text-center">
      <div
        class="text-muted small mb-3 text-truncate d-flex justify-content-between align-items-center"
      >
        <span class="text-dark">{{ currentUser.email }}</span>
        <button
          type="button"
          class="btn-close fs-6 p-2"
          aria-label="Close"
          @click="$emit('close')"
        ></button>
      </div>

      <!-- User Avatar Segment -->
      <div class="profile-pic-wrapper mb-3">
        <img
          :src="
            currentUser.image ||
            'https://res.cloudinary.com/tasleem/image/upload/v1782056301/male_user_icon_voqiwc.png'
          "
          alt="User profile photo"
        />
      </div>

      <h2 class="fs-4 fw-normal mb-3 text-dark" v-if="currentUser">
        Hi, {{ currentUser.name }}!
      </h2>

      <a href="#" class="btn btn-google-pill" @click="logoutUser">Logout</a>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  name: "AccountComponent",
  props: {
    currentUser: {
      type: Object,
      default: null,
    },
  },
  methods: {
    ...mapActions("userModule", ["logout"]),
    ...mapActions(["addNotification"]),
    async logoutUser() {
      this.$emit('close');
      await this.logout();
      this.addNotification({
        type: "success",
        message: "Logged out successfully",
      });
      this.$router.push({ name: "home" });
    },
  },
};
</script>

<style scoped>
/* ==================== MAIN CARD LAYOUT ==================== */
.account-dropdown-card {
  width: min(400px, 100vw);
  max-width: 280px;
  background-color: #f8fafd;
  border: none;
}

/* ==================== PROFILE AVATAR BLOCK ==================== */
.profile-pic-wrapper {
  position: relative;
  width: 90px;
  height: 90px;
  margin: 0 auto;
}
.profile-pic-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}
.camera-overlay-badge {
  position: absolute;
  bottom: 0;
  right: 0;
  background-color: #ffffff;
  border: 1px solid #c4c7c5;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #444746;
  font-size: 12px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
  cursor: pointer;
}

/* ==================== ACTION PILLS & BUTTONS ==================== */
.btn-google-pill {
  border: 1px solid #747775;
  color: #0b57d0;
  background-color: transparent;
  border-radius: 100px;
  font-weight: 500;
  font-size: 14px;
  padding: 8px 24px;
  transition: background-color 0.2s;
}
.btn-google-pill:hover {
  background-color: #f1f3f4;
  color: #0b57d0;
  border-color: #747775;
}

/* Split row action container */
.account-actions-bar {
  background-color: #ffffff;
  border-radius: 20px;
  border: 1px solid #e1e3e1;
  display: flex;
  overflow: hidden;
}
.action-bar-btn {
  flex: 1;
  background: transparent;
  border: none;
  padding: 16px;
  font-size: 14px;
  font-weight: 500;
  color: #1f1f1f;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  text-decoration: none;
  transition: background-color 0.2s;
}
.action-bar-btn:hover {
  background-color: #f1f3f4;
  color: #1f1f1f;
}
.action-bar-divider {
  width: 1px;
  background-color: #e1e3e1;
  align-self: stretch;
}

/* ==================== LIST MENUS ==================== */
.menu-list-wrapper {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.menu-list-item {
  background-color: #ffffff;
  border: 1px solid #e1e3e1;
  border-radius: 16px;
  padding: 14px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  text-decoration: none;
  color: #1f1f1f;
  font-size: 14px;
  transition: background-color 0.15s;
}
.menu-list-item:hover {
  background-color: #f1f3f4;
  color: #1f1f1f;
}
.item-leading {
  display: flex;
  align-items: center;
  gap: 14px;
}
.item-leading i {
  color: #444746;
  font-size: 16px;
  width: 20px;
  text-align: center;
}
.item-trailing-text {
  font-size: 12px;
  color: #444746;
}

.btn-close:focus {
  box-shadow: none;
}
</style>
