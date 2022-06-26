<template>
  <VerifiedComplaintBox
    :continue-btn-disabled="isInStandaloneForms"
    :vc-cancel-btn-props="{
      disabled: isInStandaloneForms,
    }"
    @vcBoxCancel="
      !isInStandaloneForms && $router.push({ name: 'vc-verification' })
    "
    @vcBoxContinue="next"
  >
    <div class="custom-title pt-8 pb-4">
      Certification of Lease and Registration Statement
    </div>
    <div class="pb-4">
      Gather your documents. The court requires that you file a
      <span class="font-weight-medium">
        Certification of Lease and Registration Statement
      </span>
      , no later than five (5) days prior to your case management conference.
      You’ll need to affirm that the lease (or portions thereof) and
      registration (unless exempt) have been attached.
    </div>
    <div class="pb-4 mt-2">
      You may proceed with completing this form if you intend to submit the
      documents, or you may draft the form at a later time, when the documents
      are available to you.
    </div>
    <div class="pb-4 mt-2 font-weight-medium">
      Would you like to draft the Certification of Lease and Registration
      Statement now?
    </div>

    <ConfirmButton :cb-value="clrsDraft" @optionClicked="optionClicked" />
  </VerifiedComplaintBox>
</template>

<script>
import { mapGetters } from "vuex";
import VerifiedComplaintBox from "@/components/VerifiedComplaintBox";
import ConfirmButton from "@/components/ConfirmButton";
import ViewSupport from "@/mixins/view-support";

export default {
  name: "Certification",
  components: { ConfirmButton, VerifiedComplaintBox },
  mixins: [ViewSupport],
  data: () => ({
    clrsDraft: null,
  }),
  computed: {
    ...mapGetters({
      currentCase: "eviction/currentCase",
      caseSteps: "eviction/caseSteps",
    }),
    valid() {
      return this.clrsDraft !== null;
    },
  },
  activated() {
    window.scrollTo(0, 0);

    if (this.isInStandaloneForms) {
      this.$store.commit("global/set_stand_alone_forms_progress_value", 25);
    }

    this.clrsDraft = this.currentCase.clrsDraft ?? null; //for guest;
  },
  deactivated() {
    this.saveData();
  },
  methods: {
    saveData() {
      const payloadDispatch = {
        caseData: {
          clrsDraft: this.clrsDraft,
        },
        // lastStep: "Certification",
        status: "certification",
      };

      // if (!this.isInStandaloneForms) {
      //   payloadDispatch.lastStep = this.clrsDraft
      //     ? "Lease"
      //     : "Summary of Suit Amount";
      // }

      this.$store.dispatch("eviction/updateCase", payloadDispatch);
    },
    next() {
      // this.saveData();

      if (this.isInStandaloneForms) {
        this.$router.push({ name: "saf-lease" });
      } else {
        if (this.clrsDraft) {
          const currentCaseSteps = Object.assign({}, this.caseSteps);
          currentCaseSteps.lease.hide = false;
          currentCaseSteps.registration.hide = false;
          this.$store.commit("eviction/update_steps", currentCaseSteps);

          this.$router.push({ name: "vc-lease" });
        } else {
          const currentCaseSteps = Object.assign({}, this.caseSteps);
          currentCaseSteps.lease.hide = true;
          currentCaseSteps.registration.hide = true;
          this.$store.commit("eviction/update_steps", currentCaseSteps);

          this.$router.push({ name: "vc-suit-summary" });
        }
      }
    },
    optionClicked(bool) {
      this.clrsDraft = bool;

      if (bool === false && this.isInStandaloneForms) return;
      this.next();
    },
  },
};
</script>

<style scoped></style>
