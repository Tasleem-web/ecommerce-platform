<template>
  <div class="spinner-container">
    <div class="spinner-border spinner-loader" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "spinner-block",
};
</script>

<style scoped>
.spinner-loader {
  position: absolute;
}
</style>
