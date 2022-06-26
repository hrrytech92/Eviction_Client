// import { openPDFInNewTab } from ".";
import useRequest from "./useRequest";

const openSecuredFile = async ({ id, filename, folder }) => {
  // console.log("file :>> ", file);
  const { data } = await useRequest({
    path: `presignedUrl/${folder}/${id}`,
  });
  if (!data) return;
  const { url, base64PDF } = data;
  // if (base64PDF) return openPDFInNewTab(filename, base64PDF); //* I found this afterwards... (shimon)
  const newTab = window.open(id);
  newTab.document.write(
    `<title>${filename}</title>
    <style>body{margin:0;padding:0;overflow:hidden;}</style>`
  );

  if (url) {
    // window.open(url, "_blank");
    newTab.document.write(`<img alt=${filename} src=${url}>`);
  } else if (base64PDF) {
    newTab.document.write(
      "<iframe width='100%' height='100%' src='data:application/pdf;base64, " +
        encodeURI(base64PDF) +
        "'></iframe>"
    );
  }
};
export default openSecuredFile;
