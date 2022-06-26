import { store } from "../store";

export default (theCase) => {
  const currentCase = theCase || store.getters["eviction/currentCase"];
  const steps = store.getters["eviction/worSteps"];

  if (
    currentCase.actions?.length &&
    currentCase.actions[0].actionStringId === "requestSheriff"
  ) {
    //* user is editing a already completed case
    Object.keys(steps).forEach((key, index) => {
      steps[key].status = "completed";
    });
    store.commit("eviction/update_wor_steps", steps);
    return;
  }

  const statusIndex = Object.keys(steps).indexOf(currentCase.status);
  Object.keys(steps).forEach((key, index) => {
    if (index <= statusIndex) {
      steps[key].status = "completed";
    }
  });

  store.commit("eviction/update_wor_steps", steps);
  // }
};
