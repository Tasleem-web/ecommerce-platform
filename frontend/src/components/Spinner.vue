<template>
  <div class="spinner-border spinner-loader" role="status">
    <span class="visually-hidden">Loading...</span>
  </div>
</template>

<script>
export default {
  name: "spinner-block",
};
</script>

<style scoped>
.spinner-loader {
  width: 3rem;
  height: 3rem;
  top: 50%;
  left: 50%;
  position: fixed;
}
</style>
