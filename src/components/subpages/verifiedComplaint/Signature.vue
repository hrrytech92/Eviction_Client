<template>
  <VerifiedComplaintBox
    :continue-btn-disabled="!valid"
    vcContinueBtnText="Submit"
    @vcBoxContinue="next"
    @vcBoxCancel="goBack"
  >
    <div class="custom-title pt-8 pb-4">Let's Finalize</div>

    <div class="custom-subtitle mb-4 mt-2">Preview</div>
    <div class="mb-12" v-if="!isInStandaloneForms">
      Please take a moment to review carefully. Should you need to make changes,
      jump to the section by clicking on the navigation menu in the sidebar.
    </div>
    <div
      style="
        height: 538px;
        border: 1px solid #8ba4b4;
        border-radius: 20px;
        position: relative;
        z-index: 1;
      "
      class="py-4"
    >
      <div class="magnify-icon">
        <v-icon large @click="openPDF"> mdi-magnify </v-icon>
      </div>
      <PdfPreviewProgressBar :isPdfLoading="isLoading" />
      <!-- <LoadingOverlay
        :active="isLoading"
        :is-full-page="false"
        :loader="dots"
        color="#4DCCC4"
      /> -->
      <vue-scroll :ops="ops">
        <PdfViewer v-if="pdf" :src="pdf" />
      </vue-scroll>
    </div>

    <div class="custom-subtitle mb-4 mt-12">Signature Block</div>
    <div class="pb-6">
      Based on the information you have provided, your signature block will
      appear as follows. You may edit the information as you see fit.
    </div>
    <div
      style="height: 132px; padding: 20px"
      class="signature-pad mt-6 d-flex align-center justify-center"
    >
      <EditableField
        v-model="signatureText"
        inputStyles="width: 490px;"
        valueStyles="width: 490px;"
      />
    </div>

    <div v-if="isEfile || isInStandaloneForms">
      <div class="custom-subtitle mb-4 mt-12">Signature</div>
      <div class="pb-6">
        <div v-if="isInStandaloneForms">
          All pleadings must be properly executed. If you intend to e-file,
          provide an electronic signature below.
          <span class="font-weight-medium">
            If you intend to file in person or mail in, print the document and
            provide your original signature. <u>Do not</u> sign below.
          </span>
        </div>
        <div v-else>
          All pleadings must be properly executed. Provide an electronic
          signature below. (Keep in mind, if you intend to mail in or file in
          person, please print the document and provide your original
          signature.)
        </div>
      </div>
      <VueSignaturePad
        ref="signaturePad"
        height="155px"
        class="signature-pad mt-6"
      />
      <v-btn
        style="margin-top: -40px"
        text
        class="btn--plain float-right pr-2"
        color="#8BA4B4"
        @click="clear"
      >
        Clear
      </v-btn>
    </div>

    <div class="d-flex align-center py-4 mt-8">
      <div class="custom-subtitle mr-8">Confirm</div>
      <v-divider />
    </div>
    <div class="d-flex align-center my-2">
      <v-switch
        v-model="confirmed"
        class="px-4 custom-switch"
        color="primary"
      />
      <span style="font-size: 18px">
        I hereby affirm under penalty of perjury that all representations made
        herein are correct, to the best of my knowledge, and that I am the owner
        or authorized to act on behalf of the owner of the property.
      </span>
    </div>

    <v-dialog
      v-model="showShouldLoginDialog"
      :max-width="375"
      style="border-radius: 20px"
    >
      <ShouldLoginDialog
        @login:clicked="completeCase('login')"
        @register:clicked="completeCase('register')"
      />
    </v-dialog>

    <v-dialog v-model="successDialog" persistent value="''" max-width="600">
      <SuccessDialog @submit="completeCase">
        <template v-slot:success-text>
          <span v-if="isInStandaloneForms">
            <!-- eslint-disable-next-line -->
            You have successfully completed the
            <span class="font-weight-medium"
              >Certification of Lease and Registration Statement</span
            >.
            <!-- eslint-disable-next-line -->
            On the following screen, you’ll receive your order confirmation
            access to download the document. Your next step will be to file it
            with the court. We’ll provide you with instructions on how to do
            just that.
          </span>
          <span v-else>
            On the following screen, you’ll receive your order confirmation and
            access to download your documents. Your next step will be to file
            them with the court. We’ll include instructions to guide you through
            the process.
          </span>
        </template>
      </SuccessDialog>
    </v-dialog>
  </VerifiedComplaintBox>
</template>

<script>
import EditableField from "@/components/EditableField.vue";
import PdfViewer from "@/components/PdfViewer.vue";
import { getSignatureText, auth0OptionsHelper, openPDFInNewTab } from "@/utils";
import { mapGetters } from "vuex";
import ShouldLoginDialog from "@/components/dialogs/ShouldLoginDialog";
import useRequest from "@/utils/useRequest";
import { VueSignaturePad } from "vue-signature-pad";
import VerifiedComplaintBox from "@components/VerifiedComplaintBox";
import SuccessDialog from "@components/dialogs/SuccessDialog";
import viewSupport from "@/mixins/view-support";
import dayjs from "dayjs";
import PdfPreviewProgressBar from "../../PdfPreviewProgressBar.vue";

export default {
  name: "Signature",
  components: {
    VerifiedComplaintBox,
    EditableField,
    PdfViewer,
    ShouldLoginDialog,
    VueSignaturePad,
    SuccessDialog,
    PdfPreviewProgressBar,
  },
  // mixins: [PDFTemplateData, viewSupport],
  mixins: [viewSupport],
  props: {
    filingPlan: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      pdf: "",
      isLoading: false,
      isDataSaved: false,
      oldTemplateData: "",
      // signatureImage: "",
      signatureText: "",
      // isNewSignature: false,
      confirmed: false,
      successDialog: false,
      showShouldLoginDialog: false,
      ops: {
        vuescroll: {},
        scrollPanel: {},
        rail: {
          // background: '#EAEBEB',
          opacity: 0,
          size: "8px",
          specifyBorderRadius: false,
          gutterOfEnds: "10px",
          gutterOfSide: "0px",
        },
        bar: {
          onlyShowBarOnScroll: false,
          keepShow: true,
          background: "#4DCCC4",
          opacity: 1,
          size: "8px",
        },
      },
    };
  },
  computed: {
    ...mapGetters({
      case: "eviction/currentCase",
      property: "property/currentProperty",
      isAuthenticated: "isAuthenticated",
      client: "client",
    }),
    valid() {
      return this.confirmed;
    },
    isEfile() {
      return this.filingPlan === "E-FILE";
    },
    // isLoading() {
    //   return !this.pdf;
    // },
  },
  async activated() {
    window.scrollTo(0, 0);
    this.isDataSaved = false;
    this.pdf = null;
    this.isLoading = true;

    if (this.isInStandaloneForms) {
      this.renderTemplate();
      this.$store.commit("global/set_stand_alone_forms_progress_value", 100);
    } else {
      //* debounce after two seconds
      setTimeout(() => {
        if (this.$route.name === "vc-signature") this.renderTemplate();
        // console.error("don't forget...");
      }, 2000);
    }

    this.signatureText =
      this.case.signatureText || getSignatureText(this.property);

    // this.saveLegalFees(this.case);

    // if (this.isInStandaloneForms) return (this.isNewSignature = true);

    // if (this.isEfile) {
    //   const { id, signatureImage, signatureImageBase64 } = this.case;
    //   // console.log({ signatureImage, signatureImageBase64 });
    //   if (!signatureImage && !signatureImageBase64) {
    //     this.isNewSignature = true;
    //     return;
    //   }
    // if (signatureImageBase64) {
    //   //*already have signatureImageBase64 in the store
    //   this.$refs.signaturePad.fromDataURL(signatureImageBase64);
    // } else {
    //   const { data: base64, error } = await useRequest({
    //     path: `signatureImage/${id}/${signatureImage}`,
    //   });
    //   if (error) return (this.isNewSignature = true);
    //   this.$store.commit("eviction/update_current_case", {
    //     signatureImageBase64: base64,
    //   });
    //   this.$refs.signaturePad.fromDataURL(base64);
    // }
    // this.$refs.signaturePad.clearSignature();
    // this.$refs.signaturePad.lockSignaturePad();
    // }
  },
  deactivated() {
    !this.isDataSaved && this.saveData();
  },
  methods: {
    undo() {
      this.$refs.signaturePad.undoSignature();
    },
    clear() {
      this.$refs.signaturePad.clearSignature();
      this.$refs.signaturePad.openSignaturePad();
      // this.isNewSignature = true;
    },
    async saveData(isCompletingCase = false) {
      this.isDataSaved = true;

      //* otherwise, ther's no clrs in this flow

      const caseData = {
        signatureText: "",
        isClrsInStandAloneForm:
          this.case.isClrsInStandAloneForm || this.isInStandaloneForms,
      };

      if (this.signatureText !== getSignatureText(this.property)) {
        caseData.signatureText = this.signatureText;
      }

      // if (this.isNewSignature  (this.isEfile || this.isInStandaloneForms)) {
      if (this.isEfile || this.isInStandaloneForms) {
        //* Save new written signature
        const { isEmpty, data } = this.$refs.signaturePad.saveSignature();
        if (!isEmpty) {
          if (this.isInStandaloneForms) caseData.newSignatureBase64Clrs = data;
          else if (this.isEfile) caseData.newSignatureBase64 = data;
        }
      }

      if (!this.isClrsInStandAloneForm) {
        caseData.vcDateDrafted = dayjs().format("YYYY-MM-DD");
      }

      if (isCompletingCase) {
        // wor flow data initialize
        caseData.courtOutcome = "";
        caseData.pastDueRentPaid = 0;
        caseData.worFilingPlan = "";
      }

      await this.$store.dispatch("eviction/updateCase", {
        caseData,
        // submitted: isCompletingCase,
        // lastStep: isCompletingCase
        //   ? "Verified Complaint Complete"
        //   : "Review & Sign",

        status: isCompletingCase ? "verifiedComplaintComplete" : "sign",
      });
    },
    next() {
      if (this.isAuthenticated) {
        this.successDialog = true;
      } else {
        this.saveData();
        this.showShouldLoginDialog = true;
      }
    },
    goBack() {
      let nameToPush = "vc-filing";
      if (this.$route.name === "saf-signature-warrant-of-removal")
        nameToPush = "case-view-overview";
      else if (this.isInStandaloneForms) nameToPush = "saf-registration";
      this.$router.push({
        // name: this.isInStandaloneForms ? "saf-registration" : "vc-filing",
        name: nameToPush,
      });
    },
    openPDF() {
      if (!this.pdf) return;
      const data64 = this.pdf.replace("data:application/pdf;base64,", "");
      if (data64 === "undefined") return;
      openPDFInNewTab("FileEviction | Preview", data64);
      // const pdfWindow = window.open("PDF");
      // pdfWindow.document.write(
      //   "<title>FileEviction | Preview</title><iframe width='100%' height='100%' src='data:application/pdf;base64, " +
      //     encodeURI(data64) +
      //     "'></iframe>"
      // );
    },
    async completeCase(authType) {
      // const legalFee = await this.calculateCourtFees(this.case);

      // await this.$store.dispatch("eviction/updateCase", {
      //   caseData: {
      //     legalFees: legalFee,
      //   },
      //   submitted: true,
      //   // lastStep: "Verified Complaint Complete",
      //   lastStep: "Review & Sign",
      // });

      await this.saveData(true);
      const orderInfo = {
        caseId: this.case.id,
        payment_status: "Pending",
        packageId: 1,
        flowType: !this.isInStandaloneForms ? "01" : "02",
      };
      if (!this.$auth.isAuthenticated) {
        sessionStorage.setItem("guestOrder", JSON.stringify(orderInfo));
        this.$auth.loginWithRedirect(auth0OptionsHelper(authType));
        return;
      }

      this.$store
        .dispatch("eviction/createOrder", {
          payload: { orderInfo },
        })
        .then(() => {
          this.$router.push({
            // name: "vc-order-details"
            name: this.routerPushCondition("order-details"),
          });
        });

      // await this.$store.dispatch("eviction/updateCase", {
      //   caseData: {
      //     legalFees: legalFee,
      //   },
      //   submitted: true,
      //   lastStep: "Verified Complaint Complete",
      // });

      // this.$router.push({ name: "vc-order-details" });

      /** If not authenticated should store in local storage */

      // localStorage.setItem("document", JSON.stringify(this.case));
      // localStorage.setItem("document_type", "verified_complaints");
      // localStorage.setItem(
      //   "document_name",
      //   `Verified Complaint - ${this.case.property.streetAddress}`
      // );
      // localStorage.setItem("status", "Verified Complaint Complete");
      // localStorage.setItem("action", "File Verified Complaint");
    },
    async renderTemplate() {
      console.log("renderTemplate is executed, Signature.pdf:377");
      try {
        // if (!this.compareObjects(this.oldTemplateData, templateData)) {
        // if template data is the not same as the last time, we will create a new pdf
        const guestData = !this.$auth.isAuthenticated && {
          property: JSON.parse(sessionStorage.getItem("property")),
          case: JSON.parse(sessionStorage.getItem("case")),
        };

        let templateName = "verified_complaint_preview";
        if (this.isInStandaloneForms) {
          templateName =
            this.$route.name === "saf-signature-warrant-of-removal"
              ? "wor_request_preview"
              : "clrs_form_preview";
        }
        const { data } = await useRequest({
          path: this.$auth.isAuthenticated
            ? "create-case-pleading-pdf"
            : "create-case-pleading-pdf-guest",
          method: "post",
          data: {
            caseId: this.case.id,
            guestData,
            // templateName: this.isInStandaloneForms
            //   ? "clrs_form_preview"
            //   : "verified_complaint_preview",
            templateName,
            isCLRSOnly: this.isInStandaloneForms,
            // clrsExists: this.case.clrsSubmission || this.case.clrsExemption,
          },
          throwError: true,
        });
        const linkSource = `data:application/pdf;base64,${data.fileData}`;
        this.pdf = linkSource;
        // this.oldTemplateData = templateData;
        // this.isLoading = false;

        //   if (preview && showDialog) {
        //     // if preview
        //     this.previewDialog = true;
        //   } else if (!preview) {
        //     this.createLink(linkSource);
        //   }
        // } else if (showDialog) {
        //   // if template data is the not same as the last time, we will preview and will show old pdf
        //   this.previewDialog = true;
        // }
      } catch (error) {
        console.log("renderTemplate error:", error);
      } finally {
        this.isLoading = false;
      }
    },
    compareObjects(oldObj, newObj) {
      if (!oldObj) return false; // if there was no previous version

      for (const p in oldObj) {
        if (Object.prototype.hasOwnProperty.call(oldObj, p)) {
          if (oldObj[p] !== newObj[p]) {
            // if p is an empty array, it will be an observable in oldObj and break the tests
            if (Array.isArray(oldObj[p])) continue;
            return false;
          }
        }
      }
      return true;
    },
    createLink(linkSource, fileName = "file.pdf", downloadOnly = false) {
      const link = document.createElement("a");
      // const fileName = `${templateName}.pdf`;
      link.href = linkSource;
      if (downloadOnly) {
        link.download = fileName;
      }
      link.click();
    },
  },
};
</script>

<style>
.signature-pad {
  background: #fafbfc 0% 0% no-repeat padding-box;
  border: 1px solid #8ba4b4;
  border-radius: 20px;
}
.magnify-icon {
  position: absolute;
  z-index: 10;
  top: 15px;
  right: 25px;
  cursor: pointer;
}
</style>
