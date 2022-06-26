import { store } from "../store";

export default (theCase) => {
  const currentCase = theCase || store.getters["eviction/currentCase"];
  const steps = store.getters["eviction/caseSteps"];

  if (
    currentCase.actions?.length &&
    currentCase.actions[0].actionStringId !== "completeVerifiedComplaint"
  ) {
    //* user is editing a already completed case
    Object.keys(steps).forEach((key, index) => {
      steps[key].status = "completed";
    });
    store.commit("eviction/update_steps", steps);
    return;
  }

  //* Handle property steps
  const property = store.getters["property/currentProperty"];
  const { status: propertyStatus, completed: propertyCompleted } = property;

  const propertySteps = steps.property.children;
  if (propertyCompleted) {
    steps.property.status = "completed";
    Object.keys(propertySteps).map((child_key) => {
      propertySteps[child_key].status = "completed";
    });
  } else {
    //* Some property steps not yet completed
    const propertyStatuses = [
      "type",
      "address",
      "registration",
      "owner",
      "associationToOwner",
      "contact",
    ];
    // const indexOfCurrentStatus = propertyStatuses.indexOf(propertyStatus);
    const onlyCompleted = propertyStatuses.filter(
      (status, index) => index <= propertyStatuses.indexOf(propertyStatus)
    );
    Object.keys(propertySteps).map((child_key) => {
      if (onlyCompleted.includes(child_key))
        propertySteps[child_key].status = "completed";
    });
  }

  // const currentStepKey = Object.keys(steps).find(
  //   (key) => steps[key].label === currentCase.status
  // );
  // if (currentStepKey === "property") a.property.showChildren = true;
  // if (currentStepKey || currentCase.status === "Verified Complaint Complete") {
  // let currentStepIndex = Object.keys(steps).length * 2;
  const statusIndex = Object.keys(steps).indexOf(currentCase.status);
  Object.keys(steps).forEach((key, index) => {
    if (index <= statusIndex) {
      steps[key].status = "completed";
    }
  });

  store.commit("eviction/update_steps", steps);
  // }
};
