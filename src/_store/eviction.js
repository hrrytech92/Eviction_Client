import Vue from "vue";
import axios from "axios";
import moment from "moment";
import router from "@/router";
import useRequest from "@/utils/useRequest";
import handleCaseResult from "@/utils/handleCaseResult";
import updateCaseSteps from "@/utils/updateCaseSteps";
import updateWorSteps from "@/utils/updateWorSteps";
import initialCaseSteps from "@/utils/initialCaseSteps.json";
import initialWorSteps from "@/utils/initialWorSteps.json";
import { store } from "@/store";
// import getInitialCase from "@/utils/initialCaseData";

export default {
  namespaced: true,
  state: {
    currentCase: {}, //getInitialCase(),
    courtAddress: {},
    courtInfo: {},
    mileage: {},
    cases: [],
    caseOrders: [],
    currentOrder: {},
    stepOrders: [
      "Tenant Information",
      "Lease Details",
      "Past Due Rent",
      "Additional Charges",
      "Legal Fees",
      "Documents",
      "Confirmation",
      "Verification",
      "Certification",
      "Lease",
      "Registration",
      // "Mileage",
      "Summary of Suit Amount",
      "Filing",
      "Review & Sign",
    ],
    steps: initialCaseSteps,
    worSteps: initialWorSteps,
    loading: false,
    evictionAppLoaded: false,
    // isLeaseDetailsDataValid: true,
    pleadings: [],
  },
  mutations: {
    set_current_case(state, payload) {
      console.log("set_current_case:", payload);
      Vue.set(state, "currentCase", payload);
    },
    init_case(state) {
      Vue.set(state, "currentCase", {}); //getInitialCase());
    },
    init_case_wor(state) {
      Vue.set(state, "currentCase", {}); //getInitialCase());
    },
    init_steps(state) {
      // const initialSteps = await import("@/utils/initialCaseSteps.json");
      const initialStepsData = JSON.parse(JSON.stringify(initialCaseSteps));
      console.log("initialStepsData :>> ", initialStepsData);

      Vue.set(state, "steps", initialStepsData);
    },
    init_wor_steps(state) {
      const initialWorStepsData = JSON.parse(JSON.stringify(initialWorSteps));
      console.log("initialWorStepsData :>> ", initialWorStepsData);

      Vue.set(state, "worSteps", initialWorStepsData);
    },
    update_current_case(state, updatedFields) {
      console.log("update_current_case, updatedFields:", updatedFields);
      const currentCaseInstance = { ...state.currentCase, ...updatedFields };
      Vue.set(state, "currentCase", currentCaseInstance);

      if (!store.getters.isAuthenticated) {
        sessionStorage.setItem("case", JSON.stringify(currentCaseInstance));
      }
    },
    set_cases(state, cases) {
      const sortedCases = cases
        .sort(function (a, b) {
          return new Date(a.updated_at) - new Date(b.updated_at);
        })
        .reverse();
      Vue.set(state, "cases", sortedCases);
    },
    sort_cases(state, sortDirection) {
      if (sortDirection === "desc") {
        const sortedCases = state.cases.sort(function (a, b) {
          return new Date(a.updated_at) - new Date(b.updated_at);
        });
        Vue.set(state, "cases", sortedCases);
      } else {
        const sortedCases = state.cases
          .sort(function (a, b) {
            return new Date(a.updated_at) - new Date(b.updated_at);
          })
          .reverse();
        Vue.set(state, "cases", sortedCases);
      }
    },
    set_loading(state, flag) {
      Vue.set(state, "loading", flag);
    },
    set_eviction_app_loaded(state, flag) {
      state.evictionAppLoaded = flag;
    },
    set_steps(state, steps) {
      Vue.set(state, "steps", steps);
    },
    set_court_info(state, courtInfo) {
      Vue.set(state, "courtInfo", courtInfo);
    },
    set_mileage(state, mileage) {
      Vue.set(state, "mileage", mileage);
    },
    set_courtAddress(state, courtAddress) {
      Vue.set(state, "courtAddress", courtAddress);
    },
    set_current_order(state, currentOrder) {
      Vue.set(state, "currentOrder", currentOrder);
    },
    set_case_orders(state, caseOrders) {
      Vue.set(state, "caseOrders", caseOrders);
    },
    // set_is_lease_details_data_valid(state, payload) {
    //   state.isLeaseDetailsDataValid = payload;
    // },
    update_steps(state, steps) {
      const currentCaseSteps = Object.assign({}, state.steps);

      for (const key in steps) {
        currentCaseSteps[key] = steps[key];
      }

      //* Expand 'property' if it's in this route (when user reloads page)
      const { path } = router.currentRoute;
      if (path.includes("property"))
        currentCaseSteps.property.showChildren = true;
      // console.log("update_steps, updating to", currentCaseSteps);
      Vue.set(state, "steps", currentCaseSteps);
    },
    update_wor_steps(state, steps) {
      const currentWorSteps = Object.assign({}, state.worSteps);

      for (const key in steps) {
        currentWorSteps[key] = steps[key];
      }

      Vue.set(state, "worSteps", currentWorSteps);
    },
    set_pleadings(state, pleadings) {
      Vue.set(state, "pleadings", pleadings);
    },
  },
  actions: {
    async loadCases({ commit, rootGetters }) {
      if (!rootGetters.isAuthenticated) return;
      const { data: cases } = await useRequest({
        path: "client/cases",
        showLoading: true,
      });

      commit("set_cases", cases);
    },
    // eslint-disable-next-line
    async loadCase(
      { dispatch, getters, rootGetters, commit },
      { caseId, logMessage, forceLoad, fullLoad }
    ) {
      // commit("init_case"); //This is making issues

      if (process.env.NODE_ENV !== "production") {
        console.log(`eviction/loadCase is dispatched from ${logMessage}`);
      }

      if (!rootGetters.isAuthenticated) {
        const localCase = JSON.parse(sessionStorage.getItem("case"));
        if (!localCase) {
          if (router.currentRoute.name !== "vc-before-creating")
            router.push("/verified-complaint/new");
          return;
        }

        const localProperty = JSON.parse(sessionStorage.getItem("property"));
        if (localProperty) {
          await commit("property/set_current_property", localProperty, {
            root: true,
          });
          await dispatch("loadCourtInfo");
        }
        await commit("set_current_case", localCase);
        updateCaseSteps(localCase);
        return;
      }

      if (!forceLoad && getters.currentCase.id === Number(caseId)) {
        //*To prevent re-fetching this case and property.
        return console.log("already loaded this case, id:", caseId);
      }
      commit("init_steps");
      commit("init_wor_steps");

      const { data } = await useRequest({
        path: `case/${parseInt(caseId)}`,
        throwError: true,
      });

      await dispatch("property/loadProperty", data.propertyId, {
        root: true,
      });
      handleCaseResult(data);

      const currentCaseSteps = Object.assign({}, getters.caseSteps);
      let isCaseStepsUpdated = false;
      if (data.section8 && data.section8Type === 2) {
        currentCaseSteps.legalFees.hide = true;
        // currentCaseSteps.additionalCharges.hide = true;
        // commit("update_steps", currentCaseSteps);
        isCaseStepsUpdated = true;
      }
      if (data.clrsDraft === 0) {
        currentCaseSteps.lease.hide = true;
        currentCaseSteps.registration.hide = true;
        // commit("update_steps", currentCaseSteps);
        isCaseStepsUpdated = true;
      }
      if (isCaseStepsUpdated) commit("update_steps", currentCaseSteps);

      await dispatch("loadCourtInfo");
      return data;
    },
    async createCase(
      { rootGetters, commit },
      { caseData, nextPath, logMessage }
    ) {
      if (process.env.NODE_ENV !== "production") {
        console.log(`eviction/createCase is dispatched from ${logMessage}`);
      }

      if (!rootGetters.isAuthenticated) {
        // save to localStorage for when user creates account
        const newCase = {
          documents: [],
          status: "property",
          // actionId: 171,
          actions: [
            {
              actionId: 181,
              actionStringId: "completeVerifiedComplaint",
            },
          ],
          submitted: false,
          confirmation: {},
          verification: {},
        };
        // localStorage.setItem("hasGuestFlow", "1");
        sessionStorage.setItem("case", JSON.stringify(newCase));
        commit("update_current_case", newCase);
        updateCaseSteps();
        return;
      }

      const { data } = await axios.post(
        `${process.env.VUE_APP_URL}/createCase`,
        {
          caseInfo: caseData,
          status: "property",
          // actionId: 171,
          submitted: false,
        }
      );
      handleCaseResult(data);

      if (nextPath) router.push({ name: nextPath, params: { id: data.id } });
      else router.replace({ params: { id: data.id } });

      return data;
    },
    async updateCase(
      { commit, state, getters, rootGetters },
      { caseData, dontMutate, status, logMessage, flowType }
    ) {
      console.log("eviction/updateCase() data:", {
        caseData,
        status,
        logMessage,
      });

      const statusDate = caseData?.statusDate || moment().format("MM.DD.YY");
      const submitted = status === "verifiedComplaintComplete";
      commit("update_current_case", {
        ...caseData,
        status,
        submitted,
        statusDate,
      });
      if (flowType === "wor") {
        updateWorSteps();
      } else {
        updateCaseSteps();
      }

      if (!rootGetters.isAuthenticated) return;
      if (!getters.currentCase.id)
        return console.error("currentCase.id is null");

      const requestData = {
        caseInfo: {
          propertyId: getters.currentCase.propertyId,
          ...caseData,
          statusDate,
        },
        submitted,
        status,
        // status: submitted
        //   ? "Verified Complaint Complete"
        //   : state.stepOrders.indexOf(lastStep) >
        //     state.stepOrders.indexOf(getters.currentCase.status)
        //   ? lastStep
        //   : getters.currentCase.status,
      };
      const { data, error } = await useRequest({
        path: `case/${getters.currentCase.id}`,
        method: "post",
        data: requestData,
        throwError: true,
      });
      // if (error) return;
      handleCaseResult(data);
      return data;
    },
    sortCases({ commit }, sortDirection) {
      commit("sort_cases", sortDirection);
    },
    async loadDocuments(
      { commit, getters, rootGetters },
      { caseId, documentType, logMessage }
    ) {
      if (
        process.env.NODE_ENV !== "production" &&
        typeof logMessage !== "undefined"
      ) {
        console.log(`eviction/loadDocuments is dispatched from ${logMessage}`);
      }

      if (!rootGetters.isAuthenticated) {
        return;
      }

      const { data: documents, error } = await useRequest({
        path: `uploads/${caseId}?documentType=${documentType}`,
      });
      if (error) return;
      commit("update_current_case", { documents });
    },
    async loadCourtInfo({ commit, getters, rootGetters }) {
      const { county, countyId } =
        rootGetters["property/currentProperty"] || {};

      if (!countyId) return; //console.error("loadCourtInfo > countyId is null");
      if (county === getters.courtInfo.county) return; //console.log("courtInfo already loaded");

      const { data } = await useRequest({
        path: `courtServiceInfo/${countyId}`,
      });
      const {
        superiorCourtStreet,
        superiorCourtCity,
        superiorCourtName,
        superiorCourtPhone,
        superiorCourtState,
        superiorCourtZipcode,
        ...rest
      } = data;
      const courtInfo = {
        street: superiorCourtStreet,
        city: superiorCourtCity,
        name: superiorCourtName,
        phone: superiorCourtPhone,
        state: superiorCourtState,
        zipcode: superiorCourtZipcode,
        county,
        ...rest,
      };
      commit("set_court_info", courtInfo);
    },
    async getCaseOrders({ commit }, { caseId, flowType, logMessage }) {
      if (process.env.NODE_ENV !== "production") {
        console.log(`eviction/getCaseOrders is dispatched from ${logMessage}`);
      }
      let path = `caseOrders/${caseId}`;
      if (flowType) path += `?flowType=${flowType}`;
      await useRequest({
        path,
        onSuccess: (orders) => {
          if (flowType) commit("set_current_order", orders);
          else commit("set_case_orders", orders);
        },
      });
    },
    async createOrder({ commit, getters }, { payload }) {
      await useRequest({
        path: `api/orders`,
        method: "post",
        data: payload,
        // onSuccess: (orderDetails) => commit("set_order_details", orderDetails),
        throwError: true,
      });
    },
    async loadMileage({ commit, getters, rootGetters }) {
      const mileageObj = Object.assign({}, getters.mileage);
      const responses = await Promise.all([
        axios.get(`${process.env.VUE_APP_URL}/mileages/court-addresses`),
        axios.get(`${process.env.VUE_APP_URL}/mileages/mileage-areas`),
      ]);
      // const getCurrentCaseCounty =
      //   typeof rootGetters["property/currentProperty"].county !== "undefined"
      //     ? rootGetters["property/currentProperty"].county.trim()
      //     : "";
      const { county } = rootGetters["property/currentProperty"];
      const getCurrentCaseCounty =
        // typeof county !== "undefined" ?
        county?.trim() || "";

      mileageObj.courtAddress = responses[0].data.find(
        (item) => item.county.trim() === getCurrentCaseCounty
      );
      mileageObj.areas = responses[1].data.filter(
        (item) => item.county.trim() === getCurrentCaseCounty
      );

      commit("set_mileage", mileageObj);
    },
    async loadPleadings({ commit, getters }) {
      const { currentCase } = getters;
      if (!currentCase.id) return console.error("currentCase.id is null");
      const { data } = await useRequest({
        path: `pleadings/${currentCase.id}`,
      });
      const pleadings = data || [];
      // console.log("pleadings :>> ", pleadings);
      //* for now, just get the first creted_at date it finds.
      const createdDate = pleadings.find((file) => file.created_at)?.created_at;
      console.log("createdDate :>> ", createdDate);
      // const { streetAddress, unitNo } = this.currentProperty;
      // const getFileName = (fileName) =>
      //   `${fileName} - ${streetAddress}${unitNo ? `, ${unitNo}` : ""}.pdf`;
      const items = [
        {
          name: "Cover Letter",
          templateName: "cover_letter",
          drafted: createdDate,
          updated: createdDate,
        },
        {
          name: "Verified Complaint",
          templateName: "verified_complaint",
          drafted: createdDate,
          updated: createdDate,
        },
        {
          name: "Tenant Summons",
          templateName: "tenant_summons",
          drafted: createdDate,
          updated: createdDate,
        },
        {
          name: "Landlord Case Information Statement",
          templateName: "lcis",
          drafted: createdDate,
          updated: createdDate,
        },
      ];
      if (
        // currentCase.clrsDraft &&
        // (currentCase.leaseCopySubmission ||
        //   currentCase.documentDetailType === 3) &&
        currentCase.clrsSubmission ||
        currentCase.clrsExemption
      ) {
        items.push({
          name: "Certification of Lease and Registration Statement",
          templateName: "clrs_form",
          drafted: createdDate,
          updated: createdDate,
        });
      }
      commit("set_pleadings", items);
    },
  },
  getters: {
    currentCase: (state) => state.currentCase,
    cases: (state) => state.cases,
    caseSteps: (state) => state.steps,
    worSteps: (state) => state.worSteps,
    loading: (state) => state.loading,
    mileage: (state) => state.mileage,
    courtInfo: (state) => state.courtInfo,
    courtAddress: (state) => state.courtAddress,
    caseOrders: (state) => state.caseOrders,
    currentOrder: (state) => state.currentOrder,
    stepOrders: (state) => state.stepOrders,
    evictionAppLoaded: (state) => state.evictionAppLoaded,
    // isLeaseDetailsDataValid: (state) => state.isLeaseDetailsDataValid,
    pleadings: (state) => state.pleadings,
  },
};
