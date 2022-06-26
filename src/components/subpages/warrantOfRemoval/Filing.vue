<template>
  <div class="mx-auto secondary--text">
    <v-btn
      color="info"
      icon
      class="float-right ma-8 btn--plain"
      @click="$emit('close:form')"
    >
      <v-icon>mdi-close</v-icon>
    </v-btn>
    <div style="width: 80%" class="pb-4 mx-auto text-left">
      <div class="custom-title pt-8 pb-4">Filing</div>
      <div>
        <p>
          Once the pleadings are drafted, you will be responsible for filing the
          <span class="font-weight-medium">Request for Warrant of Removal</span>
          and the certification. There are three different ways to file the
          aforementioned with the Court. We'll provide detailed instructions
          based on your selection.
        </p>
        <p>
          How would you like to file the
          <span class="font-weight-medium">Request for Warrant of Removal</span
          >?
        </p>
      </div>

      <selection v-model="newFilingPlan" :btns="btns" @input="itemClicked" />
    </div>
    <v-card-actions
      style="background-color: #fafbfc"
      class="justify-end py-6 px-12"
    >
      <v-btn color="accent_light" text class="btn--plain" @click="goBack">
        Go Back
      </v-btn>
      <v-btn
        rounded
        color="accent_light"
        class="px-8 white--text capital--btn"
        depressed
        :disabled="!newFilingPlan"
        @click="next"
      >
        Continue
      </v-btn>
    </v-card-actions>
  </div>
</template>

<script>
import Selection from "@/components/Selection.vue";
import { mapGetters } from "vuex";
import viewSupport from "@/mixins/view-support";

export default {
  name: "Filing",
  components: { Selection },
  mixins: [viewSupport],
  props: {},
  data() {
    return {
      valid: false,
      newFilingPlan: "",
      btns: ["E-FILE", "MAIL IN", "IN PERSON"],
    };
  },
  computed: {
    ...mapGetters({
      case: "eviction/currentCase",
    }),
  },
  activated() {
    window.scrollTo(0, 0);
    this.newFilingPlan = this.case.worFilingPlan || "";
  },
  deactivated() {
    this.saveData();
  },
  methods: {
    async saveData() {
      // if (this.case.filingPlan === this.newFilingPlan) return;
      //* removing the above line because we need to update status to "Filing" anyway
      await this.$store.dispatch("eviction/updateCase", {
        caseData: {
          worFilingPlan: this.newFilingPlan,
        },
        // submitted: false,
        // lastStep: "Review & Sign",
        // lastStep: "Filing",
        status: "filing",
        flowType: "wor"
      });
    },
    itemClicked() {
      // this.saveData().then(() => this.next());
      this.next();
    },
    next() {
      // this.saveData();
      this.$router.push({ 
        name: "wor-signature",
        params: { filingPlan: this.newFilingPlan },
      });
    },
    goBack() {
      this.$router.push({ name: "wor-uc-rent-balance" });
    },
  },
};
</script>
<style></style>
