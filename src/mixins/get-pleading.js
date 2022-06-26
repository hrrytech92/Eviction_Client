// import PDFTemplateData from "./pdf-template-data";
import useRequest from "@/utils/useRequest";
export default {
  // mixins: [PDFTemplateData],
  computed: {
    caseId() {
      return this.$store.getters["eviction/currentCase"].id;
    },
    fileNameAddress() {
      const { streetAddress, unitNo } =
        this.$store.getters["property/currentProperty"];
      // return `${streetAddress}${unitNo ? `, ${unitNo}` : ""}`;
      return `${streetAddress}${unitNo}`;
    },
  },

  methods: {
    async getPleading({ templateName, inNewTab, isCLRSOnly, orderId }) {
      const { caseId, fileNameAddress } = this;
      // console.log(data);
      // const pdfData = await this.getTemplateData();
      // console.log("pdfData :>> ", pdfData);
      await useRequest({
        method: "post",
        path: "create-case-pleading-pdf",
        // data: { caseId, fileNameAddress, ...data },
        data: { caseId, fileNameAddress, templateName, isCLRSOnly, orderId },
        headers: {
          "x-url-type": inNewTab && "view",
        },
        showLoading: true,
        onSuccess: ({ fileName, fileData, fileUrl, fileUrls }) => {
          if (fileUrls) {
            fileUrls.forEach((url) => window.open(url, "_blank"));
            return;
          }
          window.open(fileUrl, inNewTab ? "_blank" : "_self");
        },
      });
    },
  },
};
