// import Vue from 'vue';
import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";

dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

// export default {
//     install(Vue) {
//       //dayjs.extend(isSameOrBefore)
//         Vue.prototype.dayjs = dayjs
//       }
// }

export default {
  /**
   * Vue
   * @param {Vue} Vue
   */
  install: function (Vue) {
    Object.defineProperties(Vue.prototype, {
      $dayjs: {
        get: function () {
          return dayjs;
        },
      },
    });
    Vue.dayjs = dayjs;
  },
};
