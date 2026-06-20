<template>
  <div>
    <AppHeader />
    <div class="container mt-3">
      <router-view />
    </div>

    <NotificationList />
  </div>
</template>

<script>
import AppHeader from "./components/AppHeader.vue";
import NotificationList from "./components/NotificationList.vue";
export default {
  name: "App",
  components: {
    AppHeader,
    NotificationList,
  },
};
</script>

<style scoped></style>
