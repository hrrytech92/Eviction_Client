import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import propertyModule from "./_store/property.js";
import evictionModule from "./_store/eviction.js";
import globalModule from "./_store/global.js";
import router from "@/router";
import useRequest from "./utils/useRequest.js";
Vue.use(Vuex);

export const store = new Vuex.Store({
  modules: {
    property: propertyModule,
    eviction: evictionModule,
    global: globalModule,
  },

  state: {
    status: "",
    token: localStorage.getItem("acc_token") || "",
    // authenticated: true,
    auth: false,
    authLoaded: false,
    errorMsg: "",
    continueWithoutLogin: false,
    dialog: "",
    propertyHeaders: [
      "owner",
      "property",
      "county",
      "action",
      "registrationFiled",
      "menu",
    ],
    delinquents: [
      {
        id: 1,
        service: "Full Eviction",
        ownerFirstName: "Leslie",
        ownerLastName: "Black",
        streetAddress: "1124 Somewhere Ln",
        city: "Newark",
        state: "NJ",
        zipcode: "89898",
        county: "Newark",
        tenants: [
          { firstName: "Charlotte", lastName: "Smith" },
          { firstName: "Timothy", lastName: "Smith" },
        ],
        rentDue: "02.02.20",
        monthlyRent: "$2,000",
        lastRec: "12.01.19",
        feesOwed: "$500",
        pastDue: "$4,000",
        letterSent: "03.01.20",
        daysLeft: 3,
        docketNo: "LT-293223",
        hearingDate: "03.03.20",
        initialSuitAmount: "2000",
        currentSuitAmount: "2500",
        attorney: { firstName: "Kimberly", lastName: "Swanson" },
        status: "Verified Complaint",
        statusType: "Filed",
        statusDate: "03.03.20",
        action: { api: "enterCourtInfo" },
      },
      {
        id: 11,
        service: "Full Eviction",
        ownerFirstName: "Leslie",
        ownerLastName: "Black",
        streetAddress: "1124 Somewhere Ln",
        city: "Newark",
        state: "NJ",
        zipcode: "89898",
        county: "Newark",
        tenants: [
          { firstName: "Charlotte", lastName: "Smith" },
          { firstName: "Timothy", lastName: "Smith" },
          { firstName: "Harvey", lastName: "Smith" },
          { firstName: "Charlie", lastName: "Smith" },
        ],
        docketNo: "LT-293223",
        hearingDate: "03.03.20",
        rentDue: "02.02.20",
        monthlyRent: "$2,000",
        lastRec: "12.01.19",
        feesOwed: "$500",
        pastDue: "$4,000",
        initialSuitAmount: "2000",
        currentSuitAmount: "2500",
        attorney: { firstName: "Kimberly", lastName: "Swanson" },
        status: "Verified Complaint",
        letterSent: "03.04.20",
        daysLeft: 0,
        statusType: "Filed",
        statusDate: "03.03.20",
        action: { api: "enterCourtInfo" },
      },
    ],
    tasks: [],
    tasksLoaded: false,
    attorney: {},
    client: {
      firstName: "",
      lastName: "",
    },
    redirect: "",
    cart: [],
    contactInfos: [],
    citiesAndSubs: [],
    loading: false,
  },

  getters: {
    // isLoggedIn: state => !!state.token,
    authLoaded: (state) => () => state.authLoaded,
    isAuthenticated: (state) => state.auth,
    continueWithoutLogin: (state) => state.continueWithoutLogin,
    authStatus: (state) => state.status,
    errorMsg: (state) => state.errorMsg,
    dialog: (state) => state.dialog,
    propertyHeaders: (state) => state.propertyHeaders,
    tasks: (state) => state.tasks,
    delinquents: (state) => state.delinquents,
    userName: (state) => {
      return state.client.firstName + " " + state.client.lastName;
    },
    completedTasks: (state) => {
      return state.tasks.filter((task) => task.status === "completed").length;
    },
    incompletedTasks: (state) => {
      return state.tasks.filter((task) => task.status === "in progress").length;
    },
    overdueTasks: (state) => {
      return state.tasks.filter((task) => task.status === "overdue").length;
    },
    allTasks: (state) => state.tasks.length,
    attorney: (state) => state.attorney,
    client: (state) => state.client,
    cart: (state) => state.cart,
    cartTotal: (state) => state.cart.length,
    redirect: (state) => state.redirect,
    allCitiesAndSubs: (state) => state.citiesAndSubs,
    loading: (state) => state.loading,
    contactInfos: (state) => state.contactInfos,
  },

  actions: {
    // login_user({commit}, user){
    //   return new Promise((resolve) => {
    //   commit('set_auth',  true)
    //   commit('set_client', user)
    //   resolve()
    //   })
    // },
    // login ({commit}, user){
    //   return new Promise((resolve, reject) =>{
    //     commit('auth_request')
    //     axios({url: `${process.env.VUE_APP_URL}/auth/login`, data: user, method: 'POST'})
    //     .then(resp => {
    //       const token = resp.data.token
    //       const user = resp.data.user
    //       localStorage.setItem('acc_token', JSON.stringify(token))
    //       axios.defaults.headers.common['Authorization'] = token
    //       commit('auth_success', {token, user})
    //       resolve(resp)
    //     })
    //     .catch(err => {
    //       commit('auth_error')
    //       localStorage.removeItem('acc_token')
    //       reject(err)
    //     })
    //   })
    // },

    // register({commit}, user){
    //   return new Promise((resolve, reject) => {
    //     commit('auth_request')
    //     axios({url: `${process.env.VUE_APP_URL}/auth/registerClient`, data: user, method: 'POST'})
    //     .then(resp => {
    //       const token = resp.data.token
    //       const user = resp.data.user
    //       localStorage.setItem('acc_token', token)
    //       axios.defaults.headers.common['Authorization'] = token
    //       commit('auth_success', {token, user})
    //       resolve(resp)
    //     })
    //     .catch(err => {
    //       commit('auth_error', err)
    //       localStorage.removeItem('acc_token')
    //       reject(err)
    //     })
    //   })
    // },

    // logout({commit}){
    //   return new Promise((resolve) => {
    //     commit('logout')
    //     localStorage.removeItem('acc_token')
    //     delete axios.defaults.headers.common['Authorization']
    //     resolve()
    //   })
    // },

    loadTasks({ commit, getters }) {
      axios
        .get(`${process.env.VUE_APP_URL}/getTasks`)
        .then((r) => r.data)
        .then((data) => {
          commit("set_tasks", data);
        });
    },
    async guestInitialSetup({ dispatch, commit }) {
      console.log("guestInitialSetup");
      const userData = JSON.parse(sessionStorage.getItem("userData"));
      commit("set_client", userData);

      await dispatch(
        "eviction/loadCase",
        { logMessage: "store.js.vue at line 223" },
        { root: true }
      );
    },
    // eslint-disable-next-line
    async initialSetup({ commit, dispatch }) {
      try {
        const { data: client } = await useRequest({
          path: "client",
          throwError: true,
        });
        commit("set_client", client);

        const { name, params, path } = router.currentRoute;
        if (!name) router.push("/"); //*If user goes to '/verified-complaint

        //* If in property or in VC, then get currentProperty and currentCase
        const paramId = params.id;
        if (name.startsWith("vc-") && paramId === "new") {
          //* User reloaded page before completing varifeid complaint (not a guest)
          router.push({ name: "vc-before-creating" });
          return;
        }

        if (paramId && paramId !== "new") {
          if (name.startsWith("vc-") || name.startsWith("saf-")) {
            const caseId = paramId;
            // console.log("caseId :>> ", caseId);
            await dispatch(
              "eviction/loadCase",
              { caseId, logMessage: "store.js.vue at line 259" },
              { root: true }
            );
          } else if (path.startsWith("/properties")) {
            const propertyId = paramId;
            await dispatch("property/loadProperty", propertyId, { root: true });
          } else if (
            path.startsWith("/case-view") ||
            path.endsWith("/order-details")
          ) {
            const caseId = paramId;
            await dispatch(
              "eviction/loadCase",
              { caseId, logMessage: "store.js.vue at line 261" },
              { root: true }
            );
            if (path.startsWith("/case-view"))
              await dispatch(
                "eviction/getCaseOrders",
                { caseId, logMessage: "store.js.vue at line 266" },
                { root: true }
              );
          } else if (path.startsWith("/profile")) {
            await dispatch("loadContactInfos");
          }
        }

        await useRequest({
          path: "cart",
          onSuccess: (cartData) => {
            // console.log("cartData :>> ", cartData);
            // commit("set_cart", cartData)
          },
        });
        return;
      } catch (err) {
        console.log("initialSetup error:", err);
        throw new Error(err);
      }
    },
    async updateUser({ commit, getters }, userData) {
      console.log("updateUser userData :>> ", userData);
      if (!getters.isAuthenticated) {
        const prevUserData = JSON.parse(sessionStorage.getItem("userData"));
        sessionStorage.setItem(
          "userData",
          JSON.stringify({ ...prevUserData, ...userData })
        );
        return;
      }
      await useRequest({
        method: "put",
        path: "api/update-user",
        data: { user: userData },
      });

      // const { defaultContactInfoId } = userData;
      const updatedClient = { ...getters.client, ...userData };
      commit("set_client", updatedClient);
    },
    async loadContactInfos({ commit, rootGetters }) {
      if (!rootGetters.isAuthenticated) {
        console.log("unauthenticated, I will not load contact infos");
        return;
      }
      await useRequest({
        path: `contactInfos`,
        onSuccess: (contactInfos) => commit("set_contactInfos", contactInfos),
      });
    },
    // loadUser({commit, getters}){
    //   if(localStorage.getItem('acc_token') === null){
    //     return;
    //   }
    //   else{
    //     const authToken = JSON.parse(localStorage.getItem('acc_token'))
    //     axios.defaults.headers.common['Authorization'] = `Bearer ${authToken.token}`
    //   }
    //     axios
    //     .get(`${process.env.VUE_APP_URL}/auth/user`)
    //     .then(r => r.data)
    //     .then(data =>{
    //       commit('set_client', data)
    //     })
    //     .then(()=>{
    //       if (getters.cases.length === 0){
    //         this.dispatch('loadCases')
    //       }
    //     })
    // },
  },

  mutations: {
    // mutations for authorization
    set_auth(state, auth) {
      state.auth = auth;
    },
    set_client(state, user) {
      state.client = user;
    },
    set_auth_loaded(state, loaded) {
      state.authLoaded = loaded;
    },
    set_auth_error(state, err) {
      state.errorMsg = err;
    },
    // mutations for application
    setDialog(state, dialogValue) {
      state.dialog = dialogValue;
    },
    set_tasks(state, tasks) {
      state.tasks = tasks;
      state.tasksLoaded = true;
    },

    set_redirect(state, url) {
      state.redirect = url;
    },
    set_cont_wo_login(state, cont) {
      state.continueWithoutLogin = cont;
    },
    update_cart(state, cart) {
      state.cart = cart;
    },
    update_task_status(state, { id, status }) {
      const index = state.tasks.findIndex((e) => e.id === id);
      Vue.set(state.tasks[index], "status", status);
    },
    delete_task(state, id) {
      const index = state.tasks.findIndex((e) => e.id === id);
      state.tasks.splice(index, 1);
    },
    set_all_cities_and_subs(state, data) {
      state.citiesAndSubs = data;
    },
    set_contactInfos(state, contactInfos) {
      state.contactInfos = contactInfos;
    },
    set_loading(state, flag) {
      state.loading = flag;
    },
  },
});
