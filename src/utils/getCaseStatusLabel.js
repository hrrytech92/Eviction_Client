import caseSteps from "@/utils/initialCaseSteps.json";
function fixDate(date) {
  if (date) {
    const d = new Date(Date.parse(date));
    const day = d.getDate();
    const month = d.getMonth() + 1; // months are counted starting from 0
    const yr = d.getFullYear();
    return `${month}.${day}.${yr}`;
  }
  return "";
}

export default function getCaseStatusLabel(currentCase) {
  if (!currentCase?.actions) return "";
  const actionId = currentCase.actions[0]?.actionId;
  // if(!actionId) return "No further action required";
  switch (actionId) {
    case 181: //Complete Document
      // return `Verified Complaint | ${currentCase.status}`;
      return `Verified Complaint | ${
        caseSteps[currentCase.status]?.label || currentCase.status
      }`;
    case 21: //"Enter Court Information
    case 191: // Complete CLORS
      return `Verified Complaint | Completed: ${currentCase.statusDate} `;
    case 201: //Follow-up with Court
      return `Verified Complaint & File Certification of Lease and Landlord Registration | Completed: ${currentCase.statusDate} `;
    // return `Case Management Conference: ${fixDate(currentCase.manageConf)}`;
    case 211: //Request from sheriff for removal of Tenant
      return `Warrant of Removal | Completed`;
    default:
      return "???";
  }
}
