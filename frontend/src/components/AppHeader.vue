<template>
  <div class="position-sticky top-0 z-1">
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark py-0">
      <div class="container d-flex align-items-center">
        <div class="flex-grow-1">
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
                :key="`left-${index}`"
                :to="navbar.path"
              >
                {{ navbar.name }}
              </router-link>

              <template v-if="isAdmin">
                <router-link
                  class="nav-link"
                  v-for="(navbar, index) in protectedRoutes"
                  :key="`protected-${index}`"
                  :to="navbar.path"
                >
                  {{ navbar.name }}
                </router-link>
              </template>
            </div>

            <div class="navbar-nav ms-auto px-2">
              <div
                class="dropdown hover-dropdown"
                v-for="(navbar, index) in rightSideMenuItems"
                :key="`right-${index}`"
              >
                <!-- Removed data-bs-toggle and added a native click event -->
                <button
                  class="nav-link"
                  :id="`dropdownMenuButton-${index}`"
                  @click="navigateTo(navbar.path)"
                >
                  <font-awesome-icon :icon="navbar.icon" class="edit-icon" />
                  {{ navbar.name }}
                  <span class="badge bg-danger text-white">2</span>

                  <!-- The MiniCart will act as the dropdown menu -->
                  <MiniCart v-if="navbar.name === 'Cart'" class="dropdown-menu" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="dropdown ms-auto" data-bs-auto-close="outside">
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
              <router-link
                class="dropdown-item"
                :to="{ name: 'Login' }"
                @click="closeDropdown"
                >Login</router-link
              >
              <router-link
                class="dropdown-item"
                :to="{ name: 'Register' }"
                @click="closeDropdown"
              >
                Register
              </router-link>
            </template>
          </div>
        </div>
      </div>
    </nav>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import MiniCart from "./MiniCart.vue";
import Account from "./Account.vue";

export default {
  name: "AppHeader",
  components: {
    MiniCart,
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
    navigateTo(path) {
      this.$router.push(path);
    },
  },
  data() {
    return {
      navbarItems: [
        {
          name: "Home",
          path: "/",
        },
      ],

      protectedRoutes: [
        {
          name: "admin",
          path: "/admin",
        },
        {
          name: "Products",
          path: "/products",
        },
      ],
      rightSideMenuItems: [
        {
          name: "Wishlist",
          icon: "heart",
          path: "/wishlist",
        },
        {
          name: "Cart",
          icon: "cart-arrow-down",
          path: "/cart",
        },
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
/* Triggers the dropdown visibility on hover */
.hover-dropdown:hover .dropdown-menu {
  display: block;
  margin-top: 0; /* Aligns the menu cleanly under the button */
  right: 0; /* Ensures the menu aligns to the right edge of the button */
  left: auto; /* Overrides any default left alignment */
  top: 2.8rem;
}

/* Optional: Ensures the dropdown doesn't instantly snap shut if the cursor gaps */
.dropdown-menu {
  display: none;
  position: absolute;
}
</style>
