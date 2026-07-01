<template>
  <div>
    <AppHeader />
    <div class="container mt-3">
      <router-view />
    </div>

    <NotificationList />
    <SessionExpiredModal ref="sessionExpiredModal" />
  </div>
</template>

<script>
import AppHeader from "./components/AppHeader.vue";
import NotificationList from "./components/NotificationList.vue";
import SessionExpiredModal from "./components/SessionExpiredModal.vue";
export default {
  name: "App",
  components: {
    AppHeader,
    NotificationList,
    SessionExpiredModal,
  },
  mounted() {
    window.addEventListener("session-expired", this.onSessionExpired);
  },
  beforeUnmount() {
    window.removeEventListener("session-expired", this.onSessionExpired);
  },
  methods: {
    onSessionExpired() {
      this.$refs.sessionExpiredModal.show();
    },
  },
};
</script>

<style scoped></style>
