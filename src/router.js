import Vue from "vue";
import VueRouter from "vue-router";
// import Auth from '@okta/okta-vue'
// import Login from "@/components/views/Login.vue";
import Register from "@/components/views/Register.vue";
import ForgotPassword from "@/components/views/ForgotPassword.vue";
import ChangePassword from "@/components/views/ChangePassword.vue";
import Unauthorized from "@/components/views/Unauthorized.vue";
import Main from "@/components/views/Main.vue";
import CaseView from "@/components/views/CaseView";
import CaseFilePleadings from "@/components/views/CaseFilePleadings";
import CaseFileUploads from "@/components/views/CaseFileUploads";
import VerifiedComplaint from "@/components/views/VerifiedComplaint";
import OrderDetails from "@/components/views/OrderDetails";
import LandlordCertification from "@/components/views/LandlordCertification";
import NewProperty from "@/components/views/NewProperty.vue";
import NewPropertyForm from "@/components/views/NewPropertyForm.vue";
// import LetsSetupProperty from '@/components/views/LetsSetupProperty.vue'
import Properties from "@/components/views/Properties";
import Type from "@/components/subpages/newProperty/Type";
import Address from "@/components/subpages/newProperty/Address";
import Registration from "@/components/subpages/newProperty/Registration";
import UploadRegistration from "@/components/subpages/newProperty/UploadRegistration";
import Owner from "@/components/subpages/newProperty/Owner";
import AssociationToOwner from "@/components/subpages/newProperty/AssociationToOwner";
import Contact from "@/components/subpages/newProperty/Contact";
// import TempMenu from '@/components/views/TempMenu'
import BeforeCreating from "@/components/subpages/verifiedComplaint/BeforeCreating";
import Intro from "@/components/subpages/verifiedComplaint/Intro";
import SelectProperty from "@/components/subpages/verifiedComplaint/SelectProperty";
import Tenants from "@/components/subpages/verifiedComplaint/Tenants";
import LeaseDetails from "@/components/subpages/verifiedComplaint/LeaseDetails";
import PastDueRent from "@/components/subpages/verifiedComplaint/PastDueRent";
import AdditionalCharges from "@/components/subpages/verifiedComplaint/AdditionalCharges";
import AdditionalChargesExtended from "@/components/subpages/verifiedComplaint/AdditionalChargesExtended";
import ChargeTypes from "@/components/subpages/verifiedComplaint/ChargeTypes";
import Documents from "@/components/subpages/verifiedComplaint/Documents";
import UploadDocuments from "@/components/subpages/UploadDocuments";
import Confirmation from "@/components/subpages/verifiedComplaint/Confirmation";
import Verification from "@/components/subpages/verifiedComplaint/Verification";
import Mileage from "@/components/subpages/verifiedComplaint/Mileage";
import SuitAmountSummary from "@/components/subpages/verifiedComplaint/SuitAmountSummary";
import Representation from "@/components/subpages/verifiedComplaint/Representation";
import LegalFees from "@/components/subpages/verifiedComplaint/LegalFees";
import Filing from "@/components/subpages/verifiedComplaint/Filing";
import Signature from "@/components/subpages/verifiedComplaint/Signature";
import Done from "@/components/subpages/verifiedComplaint/Done";
import RegisterOnly from "./components/views/RegisterOnly";
import Profile from "@/components/views/Profile";
import EmailVerification from "@/components/views/EmailVerification";
import ResetPasswordSuccess from "@/components/views/ResetPasswordSuccess";
import AuthLoading from "@/components/views/AuthLoading";
import Terms from "@/components/views/Terms";

import Instructions from "@/components/subpages/warrantOfRemoval/Instructions";
import CourtOutcome from "@/components/subpages/warrantOfRemoval/CourtOutcome";
import UpdateFilingInfo from "@/components/subpages/warrantOfRemoval/UpdateFilingInfo";
import ConfirmBreach from "@/components/subpages/warrantOfRemoval/ConfirmBreach";
import MoveOutDate from "@/components/subpages/warrantOfRemoval/MoveOutDate";
import BreachPaymentsPlan from "@/components/subpages/warrantOfRemoval/BreachPaymentsPlan";
import BreachOtherConditions from "@/components/subpages/warrantOfRemoval/BreachOtherConditions";
import RentBalance from "@/components/subpages/warrantOfRemoval/RentBalance";
import WorFiling from "@/components/subpages/warrantOfRemoval/Filing";
import ReviewAndSign from "@/components/subpages/warrantOfRemoval/ReviewAndSign";
import WorOrderDetails from "@/components/subpages/warrantOfRemoval/OrderDetails";

import { store } from "./store";
// import authHelpers from './authHelpers'

Vue.use(VueRouter);

const routes = [
  // AUTHORIZATION ROUTES
  {
    path: "/login",
    name: "login",
    component: AuthLoading, // Login,
    meta: {
      isAuthRoute: true,
    },
  },
  {
    path: "/unauthorized",
    name: "unauthorized",
    component: Unauthorized,
    meta: {
      isAuthRoute: true,
    },
  },
  {
    path: "/register",
    name: "register",
    component: Register,
    meta: {
      isAuthRoute: true,
    },
  },
  {
    path: "/register-only",
    name: "register-only",
    component: RegisterOnly,
    meta: {
      isAuthRoute: true,
    },
  },
  {
    path: "/forgot-password",
    name: "forgot-password",
    component: ForgotPassword,
    meta: {
      isAuthRoute: true,
    },
  },
  {
    path: "/change-password",
    name: "change-password",
    component: ChangePassword,
    meta: {
      isAuthRoute: true,
    },
  },
  {
    path: "/welcome",
    name: "welcome",
    component: EmailVerification,
    meta: {
      isAuthRoute: true,
    },
  },
  {
    path: "/reset-password-success",
    name: "reset-password-success",
    component: ResetPasswordSuccess,
    meta: {
      isAuthRoute: true,
    },
  },
  {
    path: "/terms",
    name: "terms",
    component: Terms,
    meta: {
      title: "FileEvictions | Terms",
    },
  },

  // {
  //   path: "/",
  //   name: "document-menu",
  //   component: TempMenu
  // },
  {
    path: "/",
    name: "main",
    component: Main,
    meta: {
      title: "FileEvictions | Dashboard",
    },
  },
  // {
  //   path: "/document-menu",
  //   name: "document-menu",
  //   component: TempMenu
  // },
  {
    path: "/properties",
    name: "properties",
    component: Properties,
    meta: {
      title: "FileEvictions | Properties",
    },
  },
  {
    path: "/properties/:id",
    name: "new-property",
    component: NewProperty,
    children: [
      {
        path: "type",
        alias: "/",
        name: "property-type",
        component: Type,
      },
      {
        path: "address",
        name: "property-address",
        component: Address,
      },
      {
        path: "registration",
        name: "property-registration",
        component: Registration,
      },
      {
        path: "upload",
        name: "upload-registration",
        component: UploadRegistration,
      },
      {
        path: "owner",
        name: "property-owner",
        component: Owner,
      },
      {
        path: "owner-association",
        name: "property-association-to-owner",
        component: AssociationToOwner,
      },
      {
        path: "contact",
        name: "client-contact",
        component: Contact,
      },
    ],
  },
  {
    path: "/verified-complaint/:id",
    name: "verified-complaint",
    component: VerifiedComplaint,
    children: [
      {
        path: "before-creating",
        alias: "/",
        name: "vc-before-creating",
        component: BeforeCreating,
      },
      {
        path: "intro",
        name: "vc-intro",
        component: Intro,
      },
      {
        path: "select-property",
        name: "vc-select-property",
        component: SelectProperty,
      },
      {
        path: "property",
        name: "vc-new-property",
        component: NewPropertyForm,
        children: [
          {
            path: "type",
            alias: "/",
            name: "vc-property-type",
            component: Type,
          },
          {
            path: "address",
            name: "vc-property-address",
            component: Address,
          },
          // {
          //   path: "registration",
          //   name: "vc-property-registration",
          //   component: Registration,
          // },
          // {
          //   path: "upload",
          //   name: "vc-upload-registration",
          //   component: UploadRegistration,
          // },
          {
            path: "owner",
            name: "vc-property-owner",
            component: Owner,
          },
          {
            path: "owner-association",
            name: "vc-property-association-to-owner",
            component: AssociationToOwner,
          },
          {
            path: "contact",
            name: "vc-client-contact",
            component: Contact,
          },
        ],
      },
      {
        path: "tenants",
        name: "vc-tenants",
        component: Tenants,
      },
      {
        path: "lease-details",
        name: "vc-lease-details",
        component: LeaseDetails,
      },
      {
        path: "past-due-rent",
        name: "vc-past-due-rent",
        component: PastDueRent,
        props: true,
      },
      {
        path: "additional-charges",
        name: "vc-additional-charges",
        component: AdditionalCharges,
      },
      {
        path: "charge-types",
        name: "vc-charge-types",
        component: ChargeTypes,
      },
      {
        path: "additional-charges-extended",
        name: "vc-additional-charges-extended",
        component: AdditionalChargesExtended,
      },
      {
        path: "documents",
        name: "vc-documents",
        component: Documents,
      },
      {
        path: "upload-documents",
        name: "vc-upload-documents",
        component: UploadDocuments,
      },
      {
        path: "confirmation",
        name: "vc-confirmation",
        component: Confirmation,
      },
      {
        path: "verification",
        name: "vc-verification",
        component: Verification,
      },
      {
        path: "certification",
        name: "vc-certification",
        component: () => import("@/components/views/Certification"),
      },
      {
        path: "lease",
        name: "vc-lease",
        component: () => import("@/components/views/Lease"),
      },
      {
        path: "upload-lease",
        name: "vc-upload-lease",
        component: () => import("@/components/views/UploadLease"),
      },
      {
        path: "registration",
        name: "vc-registration",
        component: () => import("@/components/views/Registration"),
      },
      {
        path: "upload-lease-registration",
        name: "vc-upload-lease-registration",
        component: () => import("@/components/views/UploadLeaseRegistration"),
      },
      {
        path: "mileage",
        name: "vc-mileage",
        component: Mileage,
      },
      {
        path: "suit-summary",
        name: "vc-suit-summary",
        component: SuitAmountSummary,
      },
      {
        path: "representation",
        name: "vc-representation",
        component: Representation,
      },
      {
        path: "legal-fees",
        name: "vc-legal-fees",
        component: LegalFees,
      },
      {
        path: "filing",
        name: "vc-filing",
        component: Filing,
      },
      {
        path: "signature",
        name: "vc-signature",
        component: Signature,
        props: true,
      },
      {
        path: "complete",
        name: "vc-done",
        component: Done,
      },
    ],
  },
  {
    path: "/verified-complaint/:id/single",
    name: "stand-alone-forms",
    component: () => import("@views/StandAloneForms"),
    children: [
      {
        path: "certification",
        name: "saf-certification",
        component: () => import("@views/Certification"),
        meta: "single",
      },
      {
        path: "lease",
        name: "saf-lease",
        component: () => import("@views/Lease"),
        meta: "single",
      },
      {
        path: "upload-lease",
        name: "saf-upload-lease",
        component: () => import("@views/UploadLease"),
        meta: "single",
      },
      {
        path: "registration",
        name: "saf-registration",
        component: () => import("@views/Registration"),
        meta: "single",
      },
      {
        path: "upload-lease-registration",
        name: "saf-upload-lease-registration",
        component: () => import("@views/UploadLeaseRegistration"),
        meta: "single",
      },
      {
        path: "signature",
        name: "saf-signature",
        component: Signature,
        meta: "single",
      },
      {
        path: "court-information",
        name: "saf-court-information",
        component: () => import("@views/CourtInformation"),
        meta: {
          type: "single",
          withStickyBar: false,
        },
      },
      // {
      //   path: "signature-warrant-of-removal",
      //   name: "saf-signature-warrant-of-removal",
      //   // component: WarrantOfRemoval,
      //   component: Signature,
      //   meta: {
      //     type: "single",
      //     withStickyBar: false,
      //   },
      // },
    ],
  },
  {
    path: "/verified-complaint/:id/wor",
    name: "warrant-of-removal",
    component: () => import("@views/WarrantOfRemoval"),
    children: [
      {
        path: "instructions",
        name: "wor-instructions",
        component: Instructions,
        meta: "wor",
      },
      {
        path: "court-outcome",
        name: "wor-court-outcome",
        component: CourtOutcome,
        meta: "wor",
      },
      {
        path: "update-filing-info",
        name: "wor-update-filing-info",
        component: UpdateFilingInfo,
        meta: "wor",
      },
      {
        path: "confirm-breach",
        name: "wor-confirm-breach",
        component: ConfirmBreach,
        meta: "wor",
      },
      {
        path: "move-out-date",
        name: "wor-move-out-date",
        component: MoveOutDate,
        meta: "wor",
      },
      {
        path: "breach-of-payments-plan",
        name: "wor-breach-of-payments-plan",
        component: BreachPaymentsPlan,
        meta: "wor",
      },
      {
        path: "breach-of-other-conditions",
        name: "wor-breach-of-other-conditions",
        component: BreachOtherConditions,
        meta: "wor",
      },
      {
        path: "uc-rent-balance",
        name: "wor-uc-rent-balance",
        component: RentBalance,
        meta: "wor",
      },
      {
        path: "filing",
        name: "wor-filing",
        component: WorFiling,
        meta: "wor",
      },
      {
        path: "signature",
        name: "wor-signature",
        component: ReviewAndSign,
        meta: "wor",
        props: true,
      },
    ],
  },
  {
    path: "/verified-complaint/:id/wor/order-details",
    name: "wor-order-details",
    component: WorOrderDetails,
  },
  {
    path: "/landlord-certification",
    name: "landlord-certification",
    component: LandlordCertification,
  },
  {
    path: "/case-view/:id/overview",
    name: "case-view-overview",
    component: CaseView,
    meta: {
      title: "FileEvictions | Case File",
    },
  },
  {
    path: "/case-view/:id/pleadings",
    name: "case-view-pleadings",
    component: CaseFilePleadings,
    meta: {
      title: "FileEvictions | Case File",
    },
  },
  {
    path: "/case-view/:id/uploads",
    name: "case-view-uploads",
    component: CaseFileUploads,
    meta: {
      title: "FileEvictions | Case File",
    },
  },
  {
    path: "/verified-complaint/:id/order-details",
    name: "vc-order-details",
    component: OrderDetails,
    props: true,
  },
  {
    path: "/verified-complaint/:id/single/order-details",
    name: "saf-order-details",
    component: OrderDetails,
    meta: "single",
  },
  {
    path: "/profile",
    name: "profile",
    component: Profile,
    meta: {
      title: "FileEvictions | Profile",
    },
  },
  {
    path: "/as-user/:auth0Id",
    name: "as-user",
    component: Main,
  },
];

const router = new VueRouter({
  mode: "history",
  routes,
});

router.beforeEach((to, from, next) => {
  store.commit("global/set_global_error", null, { root: true });
  if (!window.navigator.onLine) {
    store.commit(
      "global/set_global_error",
      { message: "You seem to be offline.", type: "offline" },
      {
        root: true,
      }
    );
  }
  if (from.name) {
    // if (to.name === "vc-past-due-rent" && from.name === "vc-lease-details") {
    //   localStorage.setItem("resetPastDueRentData", "1");
    // } else {
    //   localStorage.removeItem("resetPastDueRentData");
    // }
    /*
        Issue: user comes to the past-due-rent page from the lease-details page.
        pastDueRent array gets recallculated, all items gets de-selected.
        Fix: prevent the user from clicking away from the past-due-rent page if no items are selected.
            This fix  doesn't work the first round of leaseDetails > pastDueRent > any other page.
      */
    // console.log("from.name :>> ", from.name);
    if (
      // from.name.includes("vc-") &&
      from.name === "vc-past-due-rent" &&
      to.name.includes("vc-") &&
      to.name !== "vc-past-due-rent" &&
      to.name !== "vc-lease-details" &&
      to.params?.id !== "new"
    ) {
      const { pastDueRent } = store.getters["eviction/currentCase"];
      if (pastDueRent?.length) {
        const isSomeSelected = pastDueRent.some(
          (item) => item.selected === true
        );
        if (!isSomeSelected) {
          console.warn("No past due item is selected");
          store.commit(
            "global/set_global_error",
            {
              message: "Please select at least one 'past due rent'.",
              type: "pastDueRent",
            },
            { root: true }
          );
          return;
        }
      }
    }
  }

  next();
});

//* Set the page title
const DEFAULT_TITLE = "FileEvictions";
router.afterEach((to, from) => {
  Vue.nextTick(() => {
    document.title = to.meta.title || DEFAULT_TITLE;
  });
});

export default router;
