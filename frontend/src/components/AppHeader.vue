<template>
  <div class="position-sticky top-0 z-1">
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark py-0">
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

        <div class="dropdown" data-bs-auto-close="outside">
          <button
            class="profile-icon dropdown-toggle btn btn-link text-white p-0 border-0"
            id="dropdownMenu2"
            data-bs-toggle="dropdown"
            aria-expanded="false"
            type="button"
          >
            <img
              :src="
                currentUser?.image ||
                'https://res.cloudinary.com/tasleem/image/upload/v1782056301/male_user_icon_voqiwc.png'
              "
              class="rounded-circle"
              alt="Profile"
            />
          </button>
          <div
            class="dropdown-menu dropdown-menu-end"
            aria-labelledby="dropdownMenu2"
            @click.stop
          >
            <Account
              :currentUser="currentUser"
              @close="closeDropdown"
              v-if="currentUser"
            />
            <template v-else>
              <router-link class="dropdown-item" :to="{ name: 'Login' }" @click="closeDropdown"
                >Login</router-link
              >
              <router-link class="dropdown-item" :to="{ name: 'Register' }" @click="closeDropdown">
                Register
              </router-link>
            </template>
          </div>
        </div>
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
    closeDropdown() {
      const dropdownButton = document.getElementById("dropdownMenu2");
      if (dropdownButton) {
        dropdownButton.click();
      }
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

<style scoped>
.profile-icon {
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  border: 1px solid #fff;
  cursor: pointer;
  color: #fff;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
  }
}
</style>
