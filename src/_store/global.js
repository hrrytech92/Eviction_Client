export default {
  namespaced: true,
  state: {
    globalError: null,
    standAloneFormsProgressValue: 25,
  },
  mutations: {
    set_global_error: (state, error) => {
      // console.log("set_global_error", error);
      state.globalError = error;
    },
    clear_global_error: (state) => {
      // console.log("clear_global_error was called");
      if (state.globalError) state.globalError = null;
    },
    set_stand_alone_forms_progress_value: (state, value) => {
      state.standAloneFormsProgressValue = value;
    },
  },
  actions: {},
  getters: {
    globalError: (state) => state.globalError,
    standAloneFormsProgressValue: (state) => state.standAloneFormsProgressValue,
  },
};
