<template>
  <VerifiedComplaintBox @vcBoxContinue="next" @vcBoxCancel="back">
    <div style="width: 80%" class="pt-10 pb-4 mx-auto text-left">
      <div class="custom-title pt-8 pb-4">Upload Lease</div>
      <DocumentUploadV2 />
    </div>
  </VerifiedComplaintBox>
</template>

<script>
import VerifiedComplaintBox from "@/components/VerifiedComplaintBox";
import DocumentUploadV2 from "@/components/DocumentUploadV2";
import { mapGetters } from "vuex";
import ViewSupport from "@/mixins/view-support";

export default {
  name: "UploadLease",
  components: { DocumentUploadV2, VerifiedComplaintBox },
  mixins: [ViewSupport],
  computed: {
    ...mapGetters({
      currentCase: "eviction/currentCase",
    }),
  },
  activated() {
    window.scrollTo(0, 0);

    // this.$store.dispatch("eviction/loadDocuments", {
    //   caseId: this.currentCase.id,
    //   // documentType: 1,
    // });
  },
  deactivated() {
    this.saveData();
  },
  methods: {
    saveData() {
      const payloadDispatch = {
        caseData: {},
        submitted: false,
      };

      if (!this.isInStandaloneForms) {
        payloadDispatch.status = "registration";
      }

      this.$store.dispatch("eviction/updateCase", payloadDispatch);
    },
    next() {
      this.saveData();

      this.$router.push({ name: this.routerPushCondition("registration") });
    },
    back() {
      this.$router.push({ name: this.routerPushCondition("lease") });
    },
  },
};
</script>

<style scoped></style>
