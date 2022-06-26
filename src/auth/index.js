import Vue from "vue";
import createAuth0Client from "@auth0/auth0-spa-js";
import { store } from "../store";
import router from "../router";
import useRequest from "../utils/useRequest";

let instance;
const onRedirectCallback = (appState) => {
  router.push(localStorage.getItem("redirect_url") || window.location.pathname);
  localStorage.removeItem("redirect_url");
};

/** Creates an instance of the Auth0 SDK. If one has already been created, it returns that instance */
export const useAuth0 = (options) => {
  if (instance) return instance;

  // The 'instance' is simply a Vue object
  instance = new Vue({
    data() {
      return {
        isAuthenticated: false,
        user: {},
        auth0Client: null,
        popupOpen: false,
        error: null,
      };
    },

    methods: {
      async initAuth() {
        // Create a new instance of the SDK client using members of the given options object
        try {
          const client = await createAuth0Client({
            domain: options.domain,
            response_type: "token",
            client_id: options.clientId,
            audience: options.audience,
            redirect_uri: window.location.origin, //+ "/login",,
          });
          // console.log("client :>> ", client);
          this.auth0Client = client;
          if (router.currentRoute.name === "login") {
            return;
          }
        } catch (err) {
          console.log("createAuth0Client error message :>> ", err.message);
          store.commit(
            "global/set_global_error",
            { message: "You seem to be offline.", type: "offline" },
            {
              root: true,
            }
          );
          return;
        }

        try {
          // If the user is returning to the app after authentication..
          const { query } = router.currentRoute;
          // console.log("query :>> ", query);
          const { state, code, error } = query || {};
          if (error) {
            alert(`Error: ${query.error_description}`);
            this.auth0Client.logout();
          }
          if (code && state) {
            // handle the redirect and retrieve tokens
            const { appState } =
              await this.auth0Client.handleRedirectCallback();
            // (useful for retrieving any pre-authentication state, e.g. `redirect to prevois route`)
            onRedirectCallback(appState);
          }

          //* save as-user auth0 id to localStorage
          if (router.currentRoute.name === "as-user") {
            localStorage.setItem(
              "asUserAuth0Id",
              router.currentRoute.params.auth0Id
            );
            router.replace("/");
          }
          await this.authenticateUser();
        } catch (e) {
          console.log("error:>> ", e);
          this.error = e;
        }
      },
      async authenticateUser() {
        try {
          const isAuthenticated = await this.auth0Client.isAuthenticated();
          if (!isAuthenticated) {
            console.log("Unauthenticated");
            // const { path } = router.currentRoute;
            const path = window.location.pathname;
            if (path.startsWith("/verified-complaint/new")) {
              await store.dispatch("guestInitialSetup");
              return;
            }
            if (path !== "/terms" && path !== "/register") {
              localStorage.setItem("redirect_url", path);
              router.push("/login");
              return;
            }
          } else {
            this.isAuthenticated = true;
            store.commit("set_auth", true);

            const claims = await this.auth0Client.getIdTokenClaims();
            // console.log("claims :>> ", claims);
            const { __raw } = claims;

            Vue.prototype.$http.defaults.headers.common.Authorization =
              "Bearer " + __raw;

            //* Handle admin impersonatioon (login as user)
            const asUserId = localStorage.getItem("asUserAuth0Id");
            if (asUserId) {
              Vue.prototype.$http.defaults.headers.common["x-as-user"] =
                asUserId;
            }

            //* handle login after creating a guest case
            if (sessionStorage.getItem("property")) {
              await this.createNewlyAuthenticatedUserData();
            }

            await store.dispatch("initialSetup");
          }
        } catch (e) {
          console.log("authenticateUser error:", e);
          store.commit(
            "global/set_global_error",
            { message: e.message },
            {
              root: true,
            }
          );
        }
      },
      async createNewlyAuthenticatedUserData() {
        console.log("User authenticated after guest flow");
        try {
          // store.commit("set_loading", true);
          const property = JSON.parse(sessionStorage.getItem("property"));
          const caseInfo = JSON.parse(sessionStorage.getItem("case"));
          const userData = JSON.parse(sessionStorage.getItem("userData"));
          console.log({ property, caseInfo, userData });
          if (!property || !caseInfo || !property?.contactInfo) {
            //* Guest user hasn't reached the tenants section, so we are not saving the data.
            console.error(
              "Missing some guest info, removing localStorage data."
            );
            sessionStorage.removeItem("property");
            sessionStorage.removeItem("case");
            sessionStorage.removeItem("userData");
            return;
          }

          const hasGuestOrder = sessionStorage.getItem("guestOrder");
          const requestData = {
            // client,
            property,
            caseInfo,
            userData,
            guestOrder: hasGuestOrder,
          };

          // if (sessionStorage.getItem("guestOrder") !== null) {
          //   requestData.guestOrder = 1;
          // }

          const { data, error } = await useRequest({
            method: "post",
            path: "create-data-for-newly-authenticated-user",
            data: requestData,
          });
          // console.log({ data, error });
          if (error) return;

          const createdCaseId = data.caseDataInfo.id;
          const lastCaseStatus = data.caseDataInfo.status;
          // console.log({ createdCaseId, lastCaseStatus });
          // localStorage.removeItem("hasGuestFlow");
          sessionStorage.removeItem("property");
          sessionStorage.removeItem("case");
          sessionStorage.removeItem("userData");

          // if (sessionStorage.getItem("guestOrder") !== null) {
          if (hasGuestOrder) {
            sessionStorage.removeItem("guestOrder");
            await router.push({
              name: "vc-order-details",
              params: { id: createdCaseId },
            });
          } else {
            const mapCaseStatusToRoute = await import(
              "../utils/initialCaseSteps.json"
            );
            // console.log("mapCaseStatusToRoute :>> ", mapCaseStatusToRoute);
            let routeName;
            if (lastCaseStatus === "property")
              routeName =
                mapCaseStatusToRoute.property.children[data.propertyInfo.status]
                  .routeName;
            else routeName = mapCaseStatusToRoute[lastCaseStatus].routeName;
            // console.log("routeName :>> ", routeName);
            await router.push({
              name: routeName,
              params: { id: createdCaseId },
            });
          }
        } catch (error) {
          console.error("createNewlyAuthenticatedUserData error:", error);
        }
      },
      /** Authenticates the user using the redirect method */
      loginWithRedirect(options) {
        // options.appState = { test: "test1" };
        return this.auth0Client.loginWithRedirect(options);
      },
      /** Returns all the claims present in the ID token */
      getIdTokenClaims(o) {
        return this.auth0Client.getIdTokenClaims(o);
      },
      /** Returns the access token. If the token is invalid or missing, a new one is retrieved */
      getTokenSilently(o) {
        return this.auth0Client.getTokenSilently(o).catch((e) => {
          if (e.error_message !== "login_required") throw e;
        });
      },
      /** Gets the access token using a popup window */

      getTokenWithPopup(o) {
        return this.auth0Client.getTokenWithPopup(o);
      },
      /** Logs the user out and removes their session on the authorization server */
      logout(o) {
        store.commit("set_auth", false);
        localStorage.removeItem("asUserAuth0Id");
        this.auth0Client.logout(o);
        console.log("logged out");
      },
    },
  });
  return instance;
};
