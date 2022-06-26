import Vue from "vue";
import App from "./App.vue";
import Loading from "./Loading.vue";
import vuetify from "./plugins/vuetify";
import { store } from "./store.js";
import router from "./router.js";
import axios from "axios";
import "vue2-dropzone/dist/vue2Dropzone.min.css";
import "vue-form-wizard/dist/vue-form-wizard.min.css";
import { domain, clientId } from "../auth_config.json";
import { useAuth0 } from "./auth";
import VueMq from "vue-mq";
// import vuepdfmake from "./plugins/vue-pdfmake.js";
// import authPlugin from "./plugins/authHelper.js";
import VueDayjs from "./plugins/dayjs-plugin.js";
import vuescroll from "vuescroll";
import VuetifyDaterangePicker from "vuetify-daterange-picker";
import "vuetify-daterange-picker/dist/vuetify-daterange-picker.css";
import VueInputAutowidth from "vue-input-autowidth";
import convertToCurrency from "./plugins/convertToCurrency.js";
import convertDate from "./plugins/convertDate.js";
import helpers from "./plugins/helpers.js";
import stateHelper from "./plugins/stateHelper.js";
import createAvatarBackgroundColor from "./plugins/createAvatarBG";
import vueKanban from "vue-kanban";
import VuePaginate from "vue-paginate";
import "@/components";
import VueSmoothScroll from "vue2-smooth-scroll";
import VueBus from "vue-bus";
import * as Sentry from "@sentry/vue";
import { Integrations } from "@sentry/tracing";

import "@/assets/styles/index.scss";
import registerConsoleTestFunctions from "./utils/registerConsoleTestFunctions";

Vue.use(VueBus);

Vue.use(VueDayjs);
Vue.use(VuePaginate);

Vue.use(vueKanban);

Vue.use(VueInputAutowidth);

Vue.use(VuetifyDaterangePicker);

// Vue.use(vuepdfmake);

Vue.use(vuescroll);

Vue.use(VueSmoothScroll);

Vue.use(VueMq, {
  breakpoints: {
    mobile: 450,
    tablet: 900,
    laptop: 1250,
    desktop: Infinity,
  },
});

Vue.use(convertToCurrency);
Vue.use(convertDate);
Vue.use(helpers);
Vue.use(stateHelper);
Vue.use(createAvatarBackgroundColor);

Vue.config.productionTip = false;
Vue.prototype.$http = axios;

const auth0Optopns = {
  domain,
  clientId,
};
Vue.prototype.$auth = useAuth0(auth0Optopns);

Sentry.init({
  Vue,
  dsn: "https://335577aa557642c2883d149b3cbeb6c4@o1081572.ingest.sentry.io/6089160",
  integrations: [
    new Integrations.BrowserTracing({
      routingInstrumentation: Sentry.vueRouterInstrumentation(router),
      tracingOrigins: ["localhost", "my-site-url.com", /^\//],
    }),
  ],
  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  // tracesSampleRate: 1.0,
  logErrors: true,
});
registerConsoleTestFunctions();

const app = new Vue({
  vuetify,
  store,
  router,
  render: (h) => h(App),
});

export const auth0Instance = app.constructor.prototype.$auth;
// console.log("app.constructor.prototype.$auth :>> ", authInstance);

//* Show loading while auth innitializes.
const loadingApp = new Vue({
  render: (h) => h(Loading),
});
loadingApp.$mount("#app");

//* Replace loader whn auth init is done.
auth0Instance.initAuth().then(() => {
  app.$mount("#app");
});
