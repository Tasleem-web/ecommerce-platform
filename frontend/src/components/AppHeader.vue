<template>
  <div>
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

        <div v-if="currentUser" class="dropdown" data-bs-auto-close="outside">
          <div
            class="profile-icon"
            id="dropdownMenu2"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <img
              :src="
                currentUser.image ||
                'https://res.cloudinary.com/tasleem/image/upload/v1782056301/male_user_icon_voqiwc.png'
              "
              class="rounded-circle"
              alt="Profile"
            />
          </div>
          <div
            class="dropdown-menu dropdown-menu-end p-0"
            aria-labelledby="dropdownMenu2"
            @click.stop
          >
            <Account :currentUser="currentUser" />
          </div>
        </div>
        <router-link v-else class="nav-link" :to="{ name: 'Login' }"> Login </router-link>
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
  border: 1px solid;
  background-color: #fff;
  cursor: pointer;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
  }
}
</style>
