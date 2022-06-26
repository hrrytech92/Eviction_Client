import { store } from "../store";
import updateCaseSteps from "./updateCaseSteps";
import updateWorSteps from "./updateWorSteps";

export default (data) => {
  // console.log("handleCaseResult, data :>> ", data);
  const prevCase = store.getters["eviction/currentCase"];
  // const clientData = store.getters.client;
  // console.log("clientData :>> ", clientData);
  const tenants = data.tenants || [];
  const updatedCase = {
    // ...prevCase,
    id: data.id,
    complaint: data.complaint,
    actions: data.actions,
    // property: {
    //   buildingNo: data.buildingNo,
    //   city: data.city,
    //   clientType: data.clientType,
    //   county: data.county,
    //   deedNames: data.deedNames,
    //   ownershipType: data.ownershipType,
    //   propertyId: data.propertyId,
    //   registrationDocumentName: data.registrationDocumentName,
    //   registrationFiled: data.registrationFiled,
    //   state: "New Jersey",
    //   streetAddress: data.streetAddress,
    //   subdivision: data.subdivision,
    //   zipcode: data.zipcode,
    // },
    docketNo: data.docketNo,
    manageConf: data.manageConf,
    trialDate: data.trialDate,
    trialTime: data.trialTime,
    courtOutcome: data.courtOutcome,
    courtInfoTime: data.courtInfoTime,
    vcDateFiled: data.vcDateFiled,
    status: data.status,
    statusDate: data.statusDate,
    propertyId: data.propertyId,
    tenantInfoCorrect: tenants.length > 0 ? "yes" : "",
    tenants: tenants,
    tenantsSaved: tenants.length > 0,
    tenantType: tenants[0]?.tenantType || "",
    tenantPhone: tenants[0]?.phone || "",
    tenantExt: tenants[0]?.ext || "",
    tenantPhoneType: tenants[0]?.phoneType || "",
    tenantCell: tenants[0]?.cell || "",
    tenantEmail: tenants[0]?.email || "",
    tenantContactName: tenants[0]?.contactName || "",
    leaseTypeTitle: data.leaseTypeTitle,
    leaseTypeCategory: data.leaseTypeCategory,
    leaseStartDate: data.leaseStartDate,
    // mileageNeighborhood: data.mileageNeighborhood,
    // mileageAnswer: data.mileageAnswer,
    signatureImage: data.signatureImage,
    signatureImageClrs: data.signatureImageClrs,
    signatureText: data.signatureText,
    section8: data.section8,
    section8Type: data.section8Type,
    section8Subsidy: data.section8Subsidy,
    section8TenantPortion: data.section8TenantPortion,
    publicHousingOfficeSection8: JSON.parse(data?.publicHousingOfficeSection8),
    confirmation: JSON.parse(data?.confirmation) || {},
    verification: JSON.parse(data?.verification) || {},
    rentDueBy:
      data.rentCycle === "Semi-monthly"
        ? data.rentDueBy.split(", ")
        : data.rentDueBy,
    rentAmount: data.rentAmount,
    rentCycle: data.rentCycle,
    pastDueRent: data.pastDueRent ? JSON.parse(data.pastDueRent) : [],
    pastDueRentPaid: data.pastDueRentPaid,
    additionalChargesPermitted: data.additionalChargesPermitted,
    lateCharges: data.lateCharges ? JSON.parse(data.lateCharges) : [],
    utilities: data.utilities ? JSON.parse(data.utilities) : [],
    fees: data.fees ? JSON.parse(data.fees) : [],
    otherCharges: data.otherCharges ? JSON.parse(data.otherCharges) : [],
    legalFeesPermitted: data.legalFeesPermitted,
    legalFees: data.legalFees ? JSON.parse(data.legalFees) : [],
    documentsUploadPermitted: data.documentsUploadPermitted,
    attorneyId: data.attorneyId,
    serviceId: data.servicePlanId,
    filingPlan: data.filingPlan,
    worFilingPlan: data.worFilingPlan,
    moveOutDate: data.moveOutDate,
    breachTerms: data.breachTerms ? JSON.parse(data.breachTerms) : [],
    breachPayments: data.breachPayments ? JSON.parse(data.breachPayments) : [],
    breachOtherConds: data.breachOtherConds ? JSON.parse(data.breachOtherConds) : [],
    clrsDraft: data.clrsDraft !== null ? Boolean(data.clrsDraft) : null,
    leaseCopySubmission:
      data.leaseCopySubmission !== null
        ? Boolean(data.leaseCopySubmission)
        : null,
    uploadLease: data.uploadLease !== null ? Boolean(data.uploadLease) : null,
    documentDetailType: data.documentDetailType,
    clrsSubmission:
      data.clrsSubmission !== null ? Boolean(data.clrsSubmission) : null,
    clrsUploadRegistration:
      data.clrsUploadRegistration !== null
        ? Boolean(data.clrsUploadRegistration)
        : null,
    clrsExemption:
      data.clrsExemption !== null ? Boolean(data.clrsExemption) : null,
    // includeClrsDocument:
    //   data.includeClrsDocument !== null
    //     ? Boolean(data.includeClrsDocument)
    //     : null,
    // isClrsStandaloneFormTouched: data.isClrsStandaloneFormTouched,
    isClrsInStandAloneForm: data.isClrsInStandAloneForm,
    // orderDetailsEmailSent: data.orderDetailsEmailSent,
  };

  if (prevCase.documents?.length) {
    updatedCase.documents = prevCase.documents;
  }

  // if (data.verification) {
  //   currentCaseInstance.verification = JSON.parse(data.verification);
  // }
  store.commit("eviction/set_current_case", updatedCase);

  updateCaseSteps(updatedCase);
  updateWorSteps(updatedCase);
};
