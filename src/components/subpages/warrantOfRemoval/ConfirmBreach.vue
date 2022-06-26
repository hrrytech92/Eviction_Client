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

    <div style="width: 80%" class="pt-15 pb-4 mx-auto text-left">
      <div class="custom-title pb-4">Confirmation of Breach</div>
      <div class="pb-4 mb-8">
        If the tenant(s) has failed to comply with the <span class="font-weight-medium">Consent to Enter Judgment</span>, you may file a
        <span class="font-weight-medium">Request for a Warrant of Removal</span>. Select all of the term(s) the tenant(s) has breached to
        get started with the process.
      </div>
      
      <div class="px-4">
        <v-checkbox
          v-for="breach in breachTerms"
          :key="breach.desc"
          v-model="breach.selected"
          on-icon="mdi-radiobox-marked"
          off-icon="mdi-checkbox-blank-circle-outline"
        >
          <template v-slot:label>
            <div
              class="d-flex align-center justify-center ml-4"
              :class="breach.selected ? 'selection-selected' : 'selection'"
              style="width: 100%"
            >
              <span class="font-weight-medium" style="letter-spacing: 1.68px">
                {{ breach.desc.toUpperCase() }}
              </span>
            </div>
          </template>
        </v-checkbox>
      </div>
    </div>


    <v-card-actions
      style="background-color: #fafbfc; border-radius: 0px 0px 10px 10px"
      class="justify-end py-4 pr-12 mt-12"
    >
      <v-btn
        rounded
        color="accent_light"
        class="mb-2 mt-4 btn--plain capital--btn"
        text
        @click="goBack"
      >
        Go Back
      </v-btn>
      <v-btn
        rounded
        color="accent_light"
        class="px-8 mb-2 mt-4 white--text capital--btn"
        depressed
        :disabled="!isChosen"
        @click="next"
      >
        Continue
      </v-btn>
    </v-card-actions>
  </div>
</template>

<script>
import { getBreachTerms, getCourtOutcomes } from "@/utils/getInfoForWOR";
import { mapGetters } from "vuex";

export default {
  name: "ConfirmBreach",
  data() {
    return {
      breachTerms: [
        { desc: "0", selected: false },
        { desc: "1", selected: false },
        { desc: "2", selected: false }
      ],
    };
  },
  computed: {
    ...mapGetters({
      currentCase: "eviction/currentCase",
    }),
    chosenBreach() {
      return this.breachTerms.filter(item => item.selected == true);
    },
    isChosen() {
      if (this.chosenBreach.length > 0) return true;
      return false;
    },
  },
  activated() {
    window.scrollTo(0, 0);
    this.breachTerms = this.currentCase.breachTerms;
  },
  deactivated() {
    this.saveData();
  },
  methods: {
    async saveData() {
      // if (!this.isValid) return;
      await this.$store.dispatch("eviction/updateCase", {
        caseData: {
          breachTerms: this.breachTerms,
        },
        // submitted: false,
        // logMessage: "LeaseDetails.vue:786",
        // status: "",
        flowType: "wor"
      });
    },
    next() {
      // this.saveData();
      // if (!this.isValid) return;
      const breachTerms = getBreachTerms();
      switch (this.chosenBreach[0].desc) {
        case breachTerms[0]: // TENANT HAS NOT VACATED
          this.$router.push({ name: "wor-move-out-date" });
          break;
        case breachTerms[1]: // FAILED TO MAKE PAYMENT
          this.$router.push({ name: "wor-breach-of-payments-plan" });
          break;
        case breachTerms[2]: // BREACH OF OTHER CONDITIONS
          this.$router.push({ name: "wor-breach-of-other-conditions" });
          break;
      }
    },
    goBack() {
      this.$router.push({ name: "wor-update-filing-info" });
    },
  },
};
</script>

<style lang="scss"></style>
