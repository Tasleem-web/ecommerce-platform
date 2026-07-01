import { createStore } from "vuex";

import state from './state';
import * as getters from './getters';
import * as mutations from './mutations';
import * as actions from './actions';
import productModule from "./modules/product";
import cartModule from "./modules/cart";
import userModule from "./modules/user";
import wishlistModule from "./modules/wishlist";

export default createStore({
  state,
  getters,
  mutations,
  actions,

  modules: {
    productModule,
    cartModule,
    userModule,
    wishlistModule
  }
})
