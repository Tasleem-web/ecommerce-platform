<template>
  <div class="notification-list">
    <NotificationMessage
      v-for="notification in notifications"
      :key="notification.id"
      :notification="notification"
    />
  </div>
</template>

<script>
import NotificationMessage from "./NotificationMessage.vue";
import { mapState } from "vuex";
export default {
  name: "NotificationList",
  components: {
    NotificationMessage,
  },
  computed: {
    ...mapState(["notifications"]),
  },
};
</script>

<style scoped>
.notification-list {
  position: fixed;
  right: 0;
  margin-right: 15px;
  width: 320px;
}
.notification-list:not(:first-child) {
  bottom: 15px;
}
</style>
