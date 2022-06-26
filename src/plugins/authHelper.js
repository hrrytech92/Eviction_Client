import Vue from "vue";
import authHelpers from "../authHelpers";

export default {
  install() {
    Vue.authHelpers = authHelpers;
    Vue.prototype.$authHelpers = authHelpers;
  },
};
