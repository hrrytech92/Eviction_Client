import { store } from "@/store";
import router from "@/router";
const caseData = {
  documents: [],
  status: "Review & Sign",
  actions: [
    {
      actionId: 181,
      actionStringId: "completeVerifiedComplaint",
    },
  ],
  submitted: true,
  confirmation: {
    military_tenant: true,
    registered_leasehold: true,
    ownership: false,
    option_to_purchase: false,
    is_owner_occupied: false,
    federal_cares_act: true,
    municipal_rent_control: false,
    notices_attached: false,
  },
  verification: {
    read_info_true: true,
    not_another_court_subject: true,
    another_court_party: "",
    confidential_personal_removed: true,
    statements_true: true,
    interpreter: "",
    disability: "",
  },
  tenantInfoCorrect: "",
  tenantsSaved: true,
  tenants: [
    {
      name: "Tenant One",
    },
  ],
  tenantType: "Individual",
  tenantPhone: "",
  tenantExt: "",
  tenantPhoneType: "",
  tenantCell: "(845) 390-4246",
  tenantEmail: "shwosner@gmail.com",
  tenantContactName: "",
  tenantMailingAddress: {
    address: "25 Hoyt St.",
    unit: "#101",
    city: "Bordentown City",
    state: "New Jersey",
    zipcode: "10977",
    checked: true,
  },
  tenantCompanyName: "",
  statusDate: "12.10.21",
  leaseTypeTitle: "Residential",
  leaseTypeCategory: "Written",
  leaseStartDate: "2021-10-04",
  section8: false,
  section8Type: 2,
  rentCycle: "Monthly",
  rentDueBy: 2,
  rentAmount: "2",
  section8Subsidy: 0,
  section8TenantPortion: 0,
  publicHousingOfficeSection8: {
    id: "",
    name: "",
    address: "",
    phone: "",
    email: "",
  },
  pastDueRent: [
    {
      timePeriod: "December 2021",
      timePeriodDisplay: "December 2021",
      amount: "2",
      selected: true,
    },
    {
      timePeriod: "November 2021",
      timePeriodDisplay: "November 2021",
      amount: "2",
      selected: false,
    },
  ],
  additionalChargesPermitted: false,
  legalFeesPermitted: false,
  clrsDraft: false,
  legalFees: [
    {
      type: "Filing Fee",
      amount: "57.00",
      selected: false,
    },
  ],
  filingPlan: "IN PERSON",
};

const propertyData = {
  propertyId: "",
  propertyType: "Commercial",
  ownershipType: "Individual",
  clientType: "owner",
  unitNo: "#101",
  streetAddress: "25 Hoyt St.",
  city: "Bordentown City",
  subdivision: "",
  state: "New Jersey",
  zipcode: "10977",
  county: "Burlington",
  contactInfoId: "",
  deedNames: "Deed One",
  registrationFiled: "",
  registrationFiles: [],
  status: "contact",
  municipalCode: "0303",
  countyId: 21,
  contactInfo: {
    id: "",
    firstName: "First",
    lastName: "Last",
    company: "Company",
    streetAddress: "123 Test Street",
    unitNo: "101",
    city: "Beverly City",
    state: "New Jersey",
    zipcode: "12345",
    phone: "(212) 123-1234",
    ext: "222",
    cell: "(845) 390-4246",
    email: "shwosner@gmail.com",
  },
  completed: true,
};

const userData = { interpreter: false, disability: false };

const populate = async () => {
  sessionStorage.setItem("property", JSON.stringify(propertyData));
  sessionStorage.setItem("case", JSON.stringify(caseData));
  sessionStorage.setItem("userData", JSON.stringify(userData));
  // localStorage.setItem("hasGuestFlow", 1);
  await store.dispatch(
    "eviction/loadCase",
    { logMessage: "registerConsoleTestFunctions.js at line 141" },
    { root: true }
  );
};

const clearClorsData = () => {
  if (router.currentRoute.name !== "vc-verification")
    router.push({ name: "vc-verification" });
  setTimeout(() => {
    store
      .dispatch(
        "eviction/updateCase",
        {
          caseData: {
            clrsDraft: null,
            documentDetailType: null,
            leaseCopySubmission: null,
            uploadLease: null,
            clrsSubmission: null,
            clrsExemption: null,
          },
          status: "verification",
          logMessage: "registerConsoleTestFunctions.js. at line 159",
        },
        { root: true }
      )
      .then(() => {
        const steps = store.getters["eviction/caseSteps"];
        Object.keys(steps).forEach((key, index) => {
          if (index > 7) steps[key].status = "";
        });
        store.commit("eviction/update_steps", steps);
      });
  }, 1000);
  return "Clearing CLORS data";
};

export default function registerConsoleTestFunctions() {
  window.loadTestData = populate;
  window.clearClorsData = clearClorsData;
}
