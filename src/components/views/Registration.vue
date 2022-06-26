<template>
  <!--  :continue-btn-disabled="isInStandaloneForms ? true : !valid" -->
  <VerifiedComplaintBox
    :continue-btn-disabled="!valid"
    @vcBoxContinue="next"
    @vcBoxCancel="back"
  >
    <div class="custom-title pt-8 pb-4">Certificate of Registration</div>

    <div class="pb-4">
      You may be required to file a copy of the
      <span class="font-weight-medium">
        Certificate of Registration, Landlord Identity Registration
      </span>
      , or any other property registration statement with the court. For more
      information, please see Landlord Registration Act N.J.S.A. 46:8-27 and
      N.J.S.A. 46:8-28.5(b).
    </div>
    <div class="pb-4">
      Select “Yes” if a copy of the registration will be attached to the
      <span class="font-weight-medium">
        Certification of Lease and Registration Statement
      </span>
      you will be filing with the court.
    </div>

    <ConfirmButton
      :required="clrsSubmissionValidate"
      :cb-value="clrsSubmission"
      @optionClicked="optionClrsSubmissionClicked"
    />

    <div v-if="clrsSubmission === true">
      <div class="pt-4 pb-4 font-weight-medium" style="font-size: 28px">
        Upload Registration
      </div>
      <div class="pb-4">
        Would you like to upload a copy of the registration to your
        FileEvictions case file? This will help keep all documents in this case
        in order. Later, you may add additional documents directly to your case
        file.
      </div>

      <!-- <ConfirmButton
        :cb-value="clrsUploadRegistration"
        @optionClicked="optionClrsUploadRegistrationClicked"
      /> -->
      <DocumentUploadV2
        :isRegistration="true"
        :updateRegistrationFiledDate="true"
      />
    </div>
    <div v-if="clrsSubmission === false">
      <div class="pt-4 pb-4 font-weight-medium" style="font-size: 28px">
        Exemption
      </div>
      <div class="pb-4">
        Is this property exempt from registration pursuant to N.J.S.A.
        46:8-28.5(b)?
      </div>

      <ConfirmButton
        :required="clrsExemptionValidate"
        :cb-value="clrsExemption"
        @optionClicked="optionClrsExemptionClicked"
      />

      <div
        class="warning-exemption mt-10"
        v-if="clrsExemption === false && !isInStandaloneForms"
      >
        <div class="pt-4 pb-4 font-weight-medium" style="font-size: 28px">
          Heads up!
        </div>
        <div class="pb-4">
          In order to complete the
          <span class="font-weight-medium">
            Certification of Lease and Registration Statement
          </span>
          , you must attest that you will be submitting a copy of the
          registration or that you are exempt from registering the property. You
          may revise your responses or draft this document at a later time when
          you have the proper documentation. For now, you may move forward to
          finalize the Verified Complaint and Tenant Summons.
        </div>
      </div>
    </div>

    <v-dialog
      v-model="registrationDialog"
      persistent
      value="''"
      max-width="600"
    >
      <CommonWarningDialog
        :dialog-data="dialogData"
        @submit="$router.push({ name: 'case-view-overview' })"
        @close="registrationDialog = false"
      >
        <template v-slot:content-text>
          In order to complete the
          <span class="font-weight-medium">
            Certification of Lease and Registration Statement
          </span>
          , you must attest that you will be submitting a copy of the
          registration or that you are exempt from registering the property. You
          may revise your responses or quit the form and return when you have
          the required documentation.
        </template>
      </CommonWarningDialog>
    </v-dialog>
  </VerifiedComplaintBox>
</template>

<script>
import VerifiedComplaintBox from "@/components/VerifiedComplaintBox";
import ConfirmButton from "@/components/ConfirmButton";
import { mapGetters } from "vuex";
import ViewSupport from "@/mixins/view-support";
import CommonWarningDialog from "@components/dialogs/CommonWarningDialog";
import DocumentUploadV2 from "../DocumentUploadV2.vue";

export default {
  name: "Registration.vue",
  components: {
    VerifiedComplaintBox,
    ConfirmButton,
    CommonWarningDialog,
    DocumentUploadV2,
  },
  mixins: [ViewSupport],
  data: () => ({
    clrsSubmissionValidate: false,
    clrsExemptionValidate: false,
    clrsSubmission: null,
    clrsExemption: null,
    clrsUploadRegistration: null,
    registrationDialog: false,
    dialogData: {
      headerText: "You may not proceed",
      confirmText: "QUIT FORM.",
      cancelText: "EDIT FORM.",
    },
  }),
  computed: {
    ...mapGetters({
      currentCase: "eviction/currentCase",
    }),
    valid() {
      if (this.clrsSubmission) return true;
      return this.clrsSubmission !== null && this.clrsExemption !== null;
    },
  },
  activated() {
    window.scrollTo(0, 0);

    if (this.isInStandaloneForms) {
      this.$store.commit("global/set_stand_alone_forms_progress_value", 75);
    }

    this.clrsSubmission = this.currentCase.clrsSubmission ?? null; //for guest;
    this.clrsUploadRegistration =
      this.currentCase.clrsUploadRegistration ?? null; //for guest;
    this.clrsExemption = this.currentCase.clrsExemption ?? null; //for guest;
  },
  deactivated() {
    this.saveData();
  },
  methods: {
    next() {
      // if (!this.runValidation()) return;

      // this.saveData();

      if (this.isInStandaloneForms) {
        this.$router.push({
          name: "saf-signature",
          // name: "saf-signature-clors",
          // query: { document: "clors" },
        });
      } else {
        this.$router.push({ name: "vc-suit-summary" });
      }
    },
    back() {
      this.$router.push({ name: this.routerPushCondition("lease") });
    },
    // runValidation() {
    //   if (this.clrsSubmission === null && this.clrsExemption === null) {
    //     this.clrsSubmissionValidate = true;
    //     this.clrsExemptionValidate = true;

    //     return false;
    //   }

    //   if (this.clrsSubmission === null) {
    //     this.clrsSubmissionValidate = true;
    //     this.clrsExemptionValidate = false;

    //     return false;
    //   }

    //   this.clrsSubmissionValidate = false;
    //   this.clrsExemptionValidate = false;
    //   return true;
    // },
    saveData() {
      // if (!this.runValidation()) return;
      const payloadDispatch = {
        caseData: {
          clrsSubmission: this.clrsSubmission,
          clrsUploadRegistration: this.clrsUploadRegistration,
          clrsExemption: this.clrsExemption,
        },
        submitted: false,
      };

      // let includeClrsDocument = 0;
      // if (this.isInStandaloneForms) {
      //   if (this.currentCase.clrsDraft === true) {
      //     includeClrsDocument = 1;
      //   }
      //   payloadDispatch.caseData.includeClrsDocument = includeClrsDocument;
      //   payloadDispatch.caseData.isClrsStandaloneFormTouched = 1;
      // }

      if (!this.isInStandaloneForms) {
        payloadDispatch.status = "registration";
      }

      this.$store.dispatch("eviction/updateCase", payloadDispatch);
    },
    optionClrsSubmissionClicked(bool) {
      console.log("bool :>> ", bool);
      this.clrsSubmission = bool;
    },
    optionClrsUploadRegistrationClicked(bool) {
      console.log("bool :>> ", bool);
      this.clrsUploadRegistration = bool;

      if (this.isInStandaloneForms) {
        if (this.clrsUploadRegistration === true) {
          this.$router.push({ name: "saf-upload-lease-registration" });
        } else {
          this.$router.push({ name: "saf-signature" });
        }

        return;
      }

      if (this.clrsUploadRegistration === true) {
        this.$router.push({ name: "vc-upload-lease-registration" });
      } else {
        this.$router.push({ name: "vc-suit-summary" });
      }
    },
    optionClrsExemptionClicked(bool) {
      this.clrsExemption = bool;

      // if (!this.runValidation()) return;

      if (this.isInStandaloneForms) {
        if (this.clrsExemption === true) {
          this.$router.push({ name: "saf-signature" });
        } else {
          this.registrationDialog = true;
        }

        return;
      }

      if (this.clrsExemption === true) {
        this.$router.push({ name: "vc-suit-summary" });
      }
    },
  },
};
</script>

<style scoped>
.warning-exemption {
  background: #ff854e34 0% 0% no-repeat padding-box;
  border: 3px solid #ff854e;
  border-radius: 20px;
  padding: 20px 40px;
}
</style>
