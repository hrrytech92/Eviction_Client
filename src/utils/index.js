export const base64ToArrayBuffer = (base64) => {
  const binaryString = window.atob(base64);
  const binaryLen = binaryString.length;
  const bytes = new Uint8Array(binaryLen);
  for (let i = 0; i < binaryLen; i++) {
    const ascii = binaryString.charCodeAt(i);
    bytes[i] = ascii;
  }
  return bytes;
};

export const saveByteArray = (reportName, byte) => {
  const blob = new Blob([byte], { type: "application/pdf" });
  const link = document.createElement("a");
  link.href = window.URL.createObjectURL(blob);
  link.download = reportName;
  link.click();
};

export const downloadPDF = (fileName, data, downloadDirectly = false) => {
  if (downloadDirectly) {
    fetch(data)
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
        a.click();
        a.remove(); //afterwards we remove the element again
      })
      .catch(() => alert("Error when downloading PDF"));

    return;
  }

  const sampleArr = base64ToArrayBuffer(encodeURI(data));
  saveByteArray(fileName, sampleArr);
};

export const openPDFInNewTab = (fileName, data, openDirectly = false) => {
  if (openDirectly) {
    window.open(data, "_blank");
    return;
  }

  const newTab = window.open(fileName);
  let html = "<html>";
  html += `<head><title>${fileName}</title></head>`;
  html += '<body style="margin:0!important;padding:0;overflow:hidden;">';
  html += `<iframe width="100%" height="100%" src="data:application/pdf;base64,${data}" type="application/pdf" />`;
  html += "</body>";
  html += "</html>";

  newTab.document.write(html);
};

function isObject(object) {
  return object != null && typeof object === "object";
}

export const deepEqual = (object1, object2) => {
  const keys1 = Object.keys(object1);
  const keys2 = Object.keys(object2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (const key of keys1) {
    const val1 = object1[key];
    const val2 = object2[key];
    const areObjects = isObject(val1) && isObject(val2);
    if (
      (areObjects && !deepEqual(val1, val2)) ||
      (!areObjects && val1 !== val2)
    ) {
      return false;
    }
  }

  return true;
};

export const auth0OptionsHelper = (page) => {
  return {
    screen_hint: page === "register" ? "signup" : "login",
  };
};

export const objFilter = (obj, callback) => {
  return Object.fromEntries(
    Object.entries(obj).filter(([key, value]) => callback(key, value))
  );
};

export const getSignatureText = (currentProperty) => {
  if (!currentProperty.contactInfo)
    return console.error("currentProperty.contactInfo is missing!!");

  const { clientType, ownershipType, deedNames, contactInfo } = currentProperty;

  let signature = `${contactInfo.firstName?.toUpperCase()} ${contactInfo.lastName?.toUpperCase()}`;

  switch (ownershipType) {
    case "Individual":
      if (clientType === "owner") signature += ", Landlord";
      else signature += `, Agent of ${deedNames}`;
      break;
    case "Limited Liability Company":
      if (clientType === "owner") signature += `, Manager, ${deedNames}`;
      else signature += `, on behalf of ${deedNames}`;
      break;
    case "General Partnership":
      if (clientType === "owner")
        signature += `, ${deedNames}, General Partner`;
      else signature += `, Agent for ${deedNames}, a General Partnership`;
      break;
    case "Corporation":
      if (clientType === "owner")
        signature += `, Manager, ${deedNames}, a corporation`;
      else signature += `, on behalf of ${deedNames}`;
      break;
  }

  return signature;
};

export const capitalizeFirstLetter = (string) =>
  string.charAt(0).toUpperCase() + string.slice(1);

export const generateNumbers = (numb) =>
  [...Array(numb).keys()].map((number) => {
    if (number <= 9) {
      return `0${number}`;
    }

    return number.toString();
  });
