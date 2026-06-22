<template>
  <div>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container">
        <div>
          <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNavAltMarkup"
            aria-controls="navbarNavAltMarkup"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
            <div class="navbar-nav">
              <router-link
                class="nav-link"
                v-for="(navbar, index) in navbarItems"
                :key="index"
                :to="navbar.path"
              >
                {{ navbar.name }}
              </router-link>
              <router-link v-if="isAdmin" class="nav-link" :to="{ name: 'admin' }">
                Admin
              </router-link>
            </div>
          </div>
        </div>

        <div class="dropdown">
          <button
            class="btn btn-secondary dropdown-toggle"
            type="button"
            id="dropdownMenu2"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            {{ currentUser ? currentUser.name : "Account" }}
          </button>
          <div class="dropdown-menu dropdown-menu-end p-0" aria-labelledby="dropdownMenu2" @click.prevent>
            <Account />
          </div>
          <!-- <ul class="dropdown-menu end-0" aria-labelledby="dropdownMenu2">
            <li v-if="currentUser">
              <button class="dropdown-item" type="button" @click="logoutUser">
                Logout
              </button>
            </li>
            <li v-else>
              <router-link class="dropdown-item" :to="{ name: 'Login' }">
                Login
              </router-link>
            </li>
          </ul> -->
        </div>

        <!-- <div class="dropdown">
          <button
            class="btn btn-secondary dropdown-toggle"
            type="button"
            id="dropdownMenuButton1"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            {{ cartCounts }} Cart
          </button>
          <MiniCart />
        </div> -->
      </div>
    </nav>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
// import MiniCart from "./MiniCart.vue";
import Account from "./Account.vue";

export default {
  name: "AppHeader",
  components: {
    // MiniCart,
    Account,
  },
  computed: {
    ...mapGetters({
      currentUser: "userModule/currentUser",
      isAdmin: "userModule/isAdmin",
    }),
  },
  methods: {
    ...mapActions("userModule", ["logout"]),
    ...mapActions(["addNotification"]),
    async logoutUser() {
      await this.logout();
      this.addNotification({
        type: "success",
        message: "Logged out successfully",
      });
      this.$router.push({ name: "home" });
    },
  },
  data() {
    return {
      navbarItems: [
        {
          name: "Home",
          path: "/",
        },
        // {
        //   name: "Product",
        //   path: "product",
        // },
      ],
    };
  },
  // computed: mapGetters({
  //   cartCounts: "cartCounts",
  // }),
  // more then one and same name
  // computed: mapGetters(["cartCounts"]),
  // computed: {
  //   ...mapGetters({
  //     cartCounts: "cartModule/cartCounts",
  //   }),
  //   // ...mapGetters("productModule", ["cartCounts"]),
  // },
};
</script>

<style scoped></style>
