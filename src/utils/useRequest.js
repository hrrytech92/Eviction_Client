import axios from "axios";
import { store } from "../store";
import { auth0Instance } from "../main";
// import router from "@/router";
// import { openPDFInNewTab } from "./";

const useRequest = async ({
  method = "get",
  path,
  data,
  params,
  headers,
  showLoading = false,
  throwError = false,
  onSuccess = () => {},
}) => {
  if (!path) console.warn('"path" is required');
  const request = {
    url: process.env.VUE_APP_URL + "/" + path,
    method,
    data,
    params,
    headers,
  };
  try {
    // console.log({ path, method, data });
    store.commit("global/clear_global_error");

    if (showLoading) store.commit("set_loading", true);
    const { data } = await axios(request);
    await onSuccess(data);
    // if (
    //   !path.startsWith("presignedUrl") &&
    //   !path.startsWith("/render_template")
    // ) {
    //   console.log(`${method.toUpperCase()} ${path} > response:`, data);
    // }

    return { data };
  } catch (error) {
    let errorMessage;
    if (error.response) {
      console.log("error.response :>> ", error.response);
      const { data, statusText } = error.response;
      if (["JsonWebTokenError", "TokenExpiredError"].includes(data)) {
        //* I think we can check befor the request if the token is valid and get refresh token, or reload the page to get it.
        // return auth0Instance.logout({
        //   returnTo: window.location.origin,
        // });
        // await auth0Instance.getIdTokenClaims();
        console.log("Token expired, re-authenticating...");
        await auth0Instance.authenticateUser();
        // router.push("/login");
      }

      if (data.error?.message)
        errorMessage = statusText + ": " + data.error?.message;
      else
        errorMessage = typeof data === "object" ? JSON.stringify(data) : data;
    } else {
      console.log("error :>> ", error);
      errorMessage = error.message || "Error accured";
    }
    console.error(
      `${method.toUpperCase()} request to ${path} error:`,
      errorMessage
    );
    store.commit(
      "global/set_global_error",
      { message: errorMessage },
      { root: true }
    );
    if (throwError) throw new Error(errorMessage);
    return { error: errorMessage, data: null };
  } finally {
    store.commit("set_loading", false);
  }
};

export default useRequest;
