<template>
  <div id="registration-form">
    <form>
      <div class="form-group">
        <label for="name">Your Name:</label>
        <input
          type="text"
          class="form-control"
          id="name"
          placeholder="Enter your name"
          name="name"
        />
      </div>
      <div class="form-group">
        <label for="newemail">Email:</label>
        <input
          type="email"
          class="form-control"
          id="newemail"
          placeholder="Enter new email"
          name="newemail"
        />
      </div>
      <div class="form-group">
        <label for="newpwd">Password:</label>
        <input
          type="password"
          class="form-control"
          id="newpwd"
          placeholder="New password"
          name="newpwd"
        />
      </div>
      <button type="submit" class="btn btn-default">Register</button>
    </form>
  </div>
</template>

<script>
export default {
  name: "RegistrationComponent",
};
</script>

<style scoped></style>
