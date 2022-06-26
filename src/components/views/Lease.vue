<template>
  <VerifiedComplaintBox
    :vc-cancel-btn-props="{
      disabled: isInStandaloneForms,
    }"
    @vcBoxContinue="next"
    @vcBoxCancel="back"
    @vcBoxSkip="skip"
    :continue-btn-disabled="!isFormValid"
    :isLease="true"
  >
    <div class="custom-title pt-8 pb-4">Lease</div>
    <div class="pb-4">
      The court requires that a copy of the lease or relevant portions (if the
      lease exceeds 10 pages), be filed. Select “Yes” to confirm you will submit
      a copy directly to the court.
    </div>

    <ConfirmButton
      :required1="leaseCopySubmissionValidate"
      :cb-value="leaseCopySubmission"
      @optionClicked="leaseCopySubmission = $event"
    />

    <div class="pt-4 pb-4 font-weight-medium" style="font-size: 28px">
      Document Details
    </div>
    <div>
      When submitting the lease to the court, you will need to certify that the
      lease is: <span class="pl-1"> (Select one.) </span>
    </div>
    <div class="mb-4">
      <v-radio-group v-model="documentDetailSelected">
        <v-radio
          v-for="(documentDetail, index) in documentDetails"
          :key="index"
          :label="documentDetail.label"
          :value="documentDetail.value"
          class="pl-1 mb-3"
        >
          <template v-slot:label>
            <div style="color: #003a60; font-size: 20px">
              {{ documentDetail.label }}
            </div>
          </template>
        </v-radio>
      </v-radio-group>
    </div>
    <!-- <div class="pb-4">
      <div
        class="d-flex align-center justify-start pb-4"
        v-for="(documentDetail, index) in documentDetails"
        :key="documentDetail.value"
      >
        <div class="d-flex align-center">
          <Checkbox
            size="29px"
            :value="documentDetail.selected"
            class="d-flex pr-3"
            @input="documentDetailsOptionClicked(documentDetail, index)"
          />
          {{ documentDetail.label }}
        </div>
      </div>
      <div v-if="isDocumentDetailsRequiredVisible" class="error--text">
        Required
      </div>
    </div> -->

    <div v-if="leaseCopySubmission">
      <div class="pt-4 pb-4 font-weight-medium" style="font-size: 28px">
        Upload Lease
      </div>
      <div class="pb-4">
        Would you like to upload a copy of the lease to your FileEvictions case
        file? This will help keep all documents in this case in order. Later,
        you may add additional documents directly to your case file.
      </div>

      <!-- <ConfirmButton
        :cb-value="uploadLease"
        @optionClicked="uploadOptionClicked"
      /> -->
      <DocumentUploadV2 />
    </div>
  </VerifiedComplaintBox>
</template>

<script>
import VerifiedComplaintBox from "@/components/VerifiedComplaintBox";
// import Checkbox from "@/components/Checkbox";
import { mapGetters } from "vuex";
import ConfirmButton from "@components/ConfirmButton";
import ViewSupport from "@/mixins/view-support";
import DocumentUploadV2 from "../DocumentUploadV2.vue";

export default {
  name: "Lease.vue",
  components: {
    ConfirmButton,
    // Checkbox,
    VerifiedComplaintBox,
    DocumentUploadV2,
  },
  mixins: [ViewSupport],
  data: () => ({
    leaseCopySubmissionValidate: false,
    // documentDetailsValidate: false,
    leaseCopySubmission: null,
    uploadLease: null,
    documentDetailSelected: null,
    isDocumentDetailsRequiredVisible: false,
    documentDetails: [
      {
        label: "attached in full.",
        value: 1,
        selected: false,
      },
      {
        label:
          "attached in pertinent part and the full lease document is in excess of 10 pages.",
        value: 2,
        selected: false,
      },
      {
        label: "not the subject of a written agreement.",
        value: 3,
        selected: false,
      },
    ],
  }),
  computed: {
    ...mapGetters({
      currentCase: "eviction/currentCase",
    }),
    isFormValid() {
      if (this.leaseCopySubmission === null) return false;
      // if (!this.documentDetails.find((item) => item.selected)) return false;
      if (!this.documentDetailSelected) return false;
      return true;
    },
  },
  activated() {
    window.scrollTo(0, 0);

    if (this.isInStandaloneForms) {
      this.$store.commit("global/set_stand_alone_forms_progress_value", 50);

      // if (this.currentCase.clrsDraft === false) {
      //   this.$store.dispatch("eviction/updateCase", {
      //     caseData: {
      //       clrsDraft: true,
      //     },
      //     // submitted: false,
      //   });
      // }
    }

    this.leaseCopySubmission = this.currentCase.leaseCopySubmission ?? null; //for guest;
    this.uploadLease = this.currentCase.uploadLease ?? null; //for guest;

    // if (this.currentCase.documentDetailType) {
    //   const docDetails = [...this.documentDetails];
    //   const findIndex = docDetails.findIndex(
    //     (documentDetail) =>
    //       documentDetail.value === this.currentCase.documentDetailType
    //   );
    //   docDetails[findIndex].selected = true;
    //   this.documentDetails = docDetails;
    // }
    this.documentDetailSelected = this.currentCase.documentDetailType ?? null;
  },
  deactivated() {
    this.saveData();
  },
  methods: {
    saveData() {
      // if (!this.runValidation()) return;
      const payloadDispatch = {
        caseData: {
          leaseCopySubmission: this.leaseCopySubmission,
          uploadLease: this.uploadLease,
          // documentDetailType:
          //   this.documentDetails.find((item) => item.selected)?.value ?? null,
          documentDetailType: this.documentDetailSelected,
        },
        // submitted: false,
      };

      if (!this.isInStandaloneForms) {
        payloadDispatch.status = this.uploadLease ? "lease" : "registration";
      }

      this.$store.dispatch("eviction/updateCase", payloadDispatch);
    },
    back() {
      if (this.isInStandaloneForms) return;

      this.$router.push({
        name: "vc-certification",
      });
    },
    next() {
      // if (!this.runValidation()) return;
      // this.saveData();
      this.$router.push({
        name: this.routerPushCondition("registration"),
      });
    },
    skip() {
      // if (this.$route.meta == 'wor')
      //   this.$router.push({
      //     name: "wor-background-info",
      //   });
      // else
        this.$router.push({
          name: "vc-suit-summary",
        });
    },
    // documentDetailsOptionClicked(documentDetail, index) {
    //   this.isDocumentDetailsRequiredVisible = false;
    //   const documentDetailsInstance = [...this.documentDetails];
    //   documentDetailsInstance.forEach((pickerTypeObj, pickerTypeObjIndex) => {
    //     return (pickerTypeObj.selected = pickerTypeObjIndex === index);
    //   });

    //   this.documentDetails = [...documentDetailsInstance];
    // },
    // runValidation() {
    //   const isDocumentDetailsNotChecked = this.documentDetails.every(
    //     (value) => value.selected === false
    //   );

    //   if (this.leaseCopySubmission === null && isDocumentDetailsNotChecked) {
    //     window.scrollTo(0, 0);
    //     this.leaseCopySubmissionValidate = true;
    //     this.documentDetailsValidate = true;

    //     return false;
    //   }

    //   if (this.leaseCopySubmission === null) {
    //     window.scrollTo(0, 0);
    //     this.leaseCopySubmissionValidate = true;
    //     this.documentDetailsValidate = false;
    //     return false;
    //   }

    //   if (isDocumentDetailsNotChecked) {
    //     window.scrollTo(0, 0);
    //     this.leaseCopySubmissionValidate = false;
    //     this.documentDetailsValidate = true;
    //     return false;
    //   }

    //   this.leaseCopySubmissionValidate = false;
    //   this.documentDetailsValidate = false;

    //   return true;
    // },
    // uploadOptionClicked(bool) {
    //   this.uploadLease = bool;
    //   if (!this.isFormValid) {
    //     this.isDocumentDetailsRequiredVisible = true;
    //     return;
    //   }
    //   // if (!this.runValidation()) return;

    //   if (this.uploadLease) {
    //     this.$router.push({
    //       name: this.routerPushCondition("upload-lease"),
    //     });
    //   } else {
    //     this.$router.push({ name: this.routerPushCondition("registration") });
    //   }
    // },
  },
};
</script>

<style scoped></style>
