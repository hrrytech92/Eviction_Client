<template>
  <v-card class="secondary--text rounded-card">
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
          Once the documents are drafted, you will be responsible for filing
          them with the court. There are three different ways to file. We’ll
          provide detailed instructions based on your selection.
        </p>
        <p style="font-weight: 500">How do you intend to file?</p>
      </div>

      <selection v-model="newFilingPlan" :btns="btns" @input="itemClicked" />
    </div>
    <v-card-actions
      style="background-color: #fafbfc"
      class="justify-end py-6 px-12"
    >
      <v-btn
        color="accent_light"
        text
        class="btn--plain"
        @click="$router.push({ name: 'vc-suit-summary' })"
      >
        go back
      </v-btn>
      <v-btn
        rounded
        color="accent_light"
        class="px-8 white--text capital--btn"
        depressed
        :disabled="!newFilingPlan"
        @click="next"
      >
        continue
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import Selection from "@/components/Selection.vue";
import { mapGetters } from "vuex";

export default {
  name: "Filing",
  components: { Selection },
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
    this.newFilingPlan = this.case.filingPlan || "";
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
          filingPlan: this.newFilingPlan,
        },
        submitted: false,
        // lastStep: "Review & Sign",
        // lastStep: "Filing",
        status: "filingPlan",
      });
    },
    itemClicked() {
      // this.saveData().then(() => this.next());
      this.next();
    },
    next() {
      this.$router.push({
        name: "vc-signature",
        params: { filingPlan: this.newFilingPlan },
      });
    },
  },
};
</script>
<style></style>
