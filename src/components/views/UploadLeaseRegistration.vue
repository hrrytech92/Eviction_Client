<template>
  <VerifiedComplaintBox @vcBoxContinue="next" @vcBoxCancel="back">
    <div style="width: 80%" class="pt-10 pb-4 mx-auto text-left">
      <div class="custom-title pt-8 pb-4">Upload Document</div>
      <DocumentUploadV2 is-registration update-registration-filed-date />
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
      currentProperty: "property/currentProperty",
    }),
  },
  activated() {
    window.scrollTo(0, 0);

    this.loadPropertyRegistrations();
  },
  deactivated() {
    this.saveData();
  },
  methods: {
    loadPropertyRegistrations() {
      const { propertyId } = this.currentProperty;

      if (!this.$store.getters.isAuthenticated) {
        this.$store.dispatch("property/getRegistrationDocs", { propertyId });
        return;
      }

      if (!propertyId) return;
      this.$store.dispatch("property/getRegistrationDocs", { propertyId });
    },
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

      if (this.isInStandaloneForms) {
        this.$router.push({ name: "saf-signature" });
      } else {
        this.$router.push({ name: "vc-suit-summary" });
      }
    },
    back() {
      this.$router.push({ name: this.routerPushCondition("registration") });
    },
  },
};
</script>

<style scoped></style>
