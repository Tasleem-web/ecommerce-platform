<template>
  <div
    :class="typeClass"
    class="alert alert-dismissible fade show"
    role="alert"
  >
    <button
      type="button"
      class="btn-close"
      data-bs-dismiss="alert"
      aria-label="Close"
    ></button>
    {{ notification.message }}
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  name: "NotificationMessage",
  props: ["notification"],
  data() {
    return {
      timer: null,
    };
  },
  computed: {
    typeClass() {
      return `alert-${this.notification.type}`;
    },
  },
  methods: {
    ...mapActions(["removeNotification"]),
  },
  created() {
    this.timer = setTimeout(() => {
      this.removeNotification(this.notification);
    }, 3000);
  },
  beforeUnmount() {
    // Clear timer to prevent memory leaks if component is manually closed
    clearTimeout(this.timer);
  },
};
</script>

<style scoped></style>
