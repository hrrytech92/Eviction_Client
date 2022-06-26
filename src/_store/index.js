import Vue from "vue";
import Vuex from "vuex";

import authModule from "/.auth";

Vue.use(Vuex);

export const store = new Vuex.store({
  modules: {
    authModule,
  },
});
