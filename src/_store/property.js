import Vue from "vue";
import useRequest from "@/utils/useRequest";
import router from "@/router";
import { store } from "@/store";
import updateCaseSteps from "@/utils/updateCaseSteps";

export default {
  namespaced: true,
  state: {
    currentProperty: {
      propertyId: "",
      propertyType: "",
      ownershipType: "",
      clientType: "",
      unitNo: "",
      streetAddress: "",
      city: "",
      subdivision: "",
      state: "New Jersey",
      zipcode: "",
      county: "",
      contactInfoId: "",
      deedNames: [""],
      registrationFiled: "",
      registrationFiles: [],
      status: "type",
    },
    properties: [],
    steps: {
      type: "",
      address: "",
      registration: "",
      owner: "",
      associationToOwner: "",
      contact: "",
    },
    loading: false,
  },
  mutations: {
    set_current_property(state, property) {
      console.log("set_current_property was called. property:", property);
      Vue.set(state, "currentProperty", property);
    },
    set_steps(state, steps) {
      Vue.set(state, "steps", steps);
    },
    update_current_property(state, updatedFields) {
      const currentPropertyInstance = {
        ...state.currentProperty,
        ...updatedFields,
      };
      console.log(
        "update_current_property, updating property to:",
        currentPropertyInstance
      );
      Vue.set(state, "currentProperty", currentPropertyInstance);

      if (!store.getters.isAuthenticated) {
        sessionStorage.setItem(
          "property",
          JSON.stringify(currentPropertyInstance)
        );
      }
      if (router.currentRoute.name.includes("vc")) updateCaseSteps();
    },
    set_properties(state, properties) {
      Vue.set(state, "properties", properties);
    },
    set_loading(state, flag) {
      Vue.set(state, "loading", flag);
    },
    init_property(state) {
      Vue.set(state, "currentProperty", {
        propertyId: "",
        propertyType: "",
        ownershipType: "",
        clientType: "",
        unitNo: "",
        streetAddress: "",
        city: "",
        subdivision: "",
        state: "New Jersey",
        zipcode: "",
        county: "",
        contactInfoId: "",
        deedNames: [""],
        registrationFiled: "",
        registrationFiles: [],
        status: "type",
      });
    },
  },
  actions: {
    // eslint-disable-next-line
    async loadProperties({ commit }) {
      const { data, error } = await useRequest({
        path: `properties`,
        showLoading: true,
      });
      if (error) return;
      await commit("set_properties", data);
      return data;
    },
    async loadProperty({ commit, rootGetters }, propertyId) {
      console.log("loadProperty was called, propertyId:", propertyId);
      // if (!rootGetters.isAuthenticated) {
      //   const localProperty = sessionStorage.getItem("property");
      //   commit("set_current_property", JSON.parse(localProperty));
      //   return;
      // }
      const { data, error } = await useRequest({
        path: `property/${propertyId}`,
      });
      if (error) return;
      await commit("set_current_property", data);
    },
    async saveProperty(
      { commit, getters, dispatch, rootGetters },
      { propertyData }
    ) {
      console.log("saveProperty was called, propertyData:", propertyData);
      commit("update_current_property", propertyData);

      if (!rootGetters.isAuthenticated) {
        // save to localStorage for when user creates account
        if (!sessionStorage.getItem("case")) {
          dispatch(
            "eviction/createCase",
            {
              logMessage: "property.js at line 145",
            },
            { root: true }
          );
        }
        return;
      }

      const { propertyId } = getters.currentProperty;
      //* create or update property in the db
      const { data: savedProperty, error } = await useRequest({
        path: `properties/save`,
        method: "post",
        data: {
          property: { ...propertyData, propertyId },
        },
      });
      if (error) return;
      commit("update_current_property", savedProperty);

      //* Create case if not yet created.
      const { name, params } = router.currentRoute;
      const isNewCase = name.includes("vc") && params.id === "new";
      if (isNewCase) {
        const newPropertyId = propertyId || savedProperty.propertyId;
        console.log("creating a new case with propertyId:", newPropertyId);
        dispatch(
          "eviction/createCase",
          {
            caseData: {
              propertyId: newPropertyId,
            },
            logMessage: "property.js at line 148",
          },
          { root: true }
        );
      }
      return savedProperty;
    },

    async getRegistrationDocs({ commit, rootGetters }, { propertyId }) {
      if (!rootGetters.isAuthenticated) return;
      await useRequest({
        path: `registration/${propertyId}`,
        onSuccess: (registrationFiles) =>
          commit("update_current_property", { registrationFiles }),
      });
    },
  },
  getters: {
    currentPropertyId: (state) => state.currentProperty.propertyId,
    currentProperty: (state) => state.currentProperty,
    propertySteps: (state) => state.steps,
    properties: (state) => state.properties,
    loading: (state) => state.loading,
  },
};
