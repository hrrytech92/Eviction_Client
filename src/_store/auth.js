export default {
  namespaced: true,
  state: {
    token: localStorage.getItem("acc_token") || "",
    auth: localStorage.getItem("authenticated") || false,
    authLoaded: false,
    continueWithoutLogin: false,
    redirect: "",
    me: {},
    status: "",
    // errorMsg: "",
  },
  mutations: {
    set_auth(state, auth) {
      state.auth = auth;
    },

    set_me(state, user) {
      state.me = user;
    },

    set_auth_loaded(state, flag) {
      state.authLoaded = flag;
    },

    // set_auth_error(state, err) {
    //   state.errorMsg = err;
    // },

    set_redirect(state, url) {
      state.redirect = url;
    },

    set_do_without_login(state, flag) {
      state.continueWithoutLogin = flag;
    },
  },
  actions: {},
  getters: {
    authLoaded: (state) => state.authLoaded,
    isAuthenticated: (state) => state.auth,
    continueWithoutLogin: (state) => state.continueWithoutLogin,
    authStatus: (state) => state.status,
  },
};
