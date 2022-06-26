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
      <div class="custom-title pb-4">Select Court Outcome</div>
      <div class="pb-4 mb-8">
        Let us know what the outcome of your hearing was so that we may better
        help you with the next steps.
      </div>
      <div
        style="
          height: 370px;
          border: 1px solid #c3d1d2;
          border-radius: 20px;
          position: relative;
        "
      >
        <vue-scroll :ops="ops">
          <v-list v-show="!loading" style="background-color: transparent">
            <v-list-item-group
              v-if="outcomes.length > 0"
              v-model="chosenOutcome"
            >
              <v-list-item
                v-for="outcome in outcomes"
                :key="outcome"
                class="py-1"
              >
                <span class="secondary--text">{{ outcome }}</span>
              </v-list-item>
            </v-list-item-group>
            <v-list-item v-else class="py-1">
              <span class="secondary--text">No outcome found.</span>
            </v-list-item>
          </v-list>
        </vue-scroll>
      </div>
    </div>

    <v-dialog v-model="ComplicateDialogOpen" max-width="600">
      <ComplicateDialog @endFlow="endFlow" />
    </v-dialog>

    <v-card-actions
      style="background-color: #fafbfc; border-radius: 0px 0px 10px 10px"
      class="justify-end py-4 pr-12 mt-12"
    >
      <v-btn
        rounded
        color="accent_light"
        class="mb-2 mt-4 btn--plain capital--btn"
        text
        @click="cancel"
      >
        Cancel
      </v-btn>
      <v-btn
        rounded
        color="accent_light"
        class="px-8 mb-2 mt-4 white--text capital--btn"
        depressed
        :disabled="!isOutcomeChosen"
        @click="next"
      >
        Continue
      </v-btn>
    </v-card-actions>
  </div>
</template>

<script>
import { getCourtOutcomes, getBreachTerms } from "@/utils/getInfoForWOR";
import ComplicateDialog from "@/components/dialogs/ComplicateDialog";
import { mapGetters } from "vuex";

export default {
  name: "CourtOutcome",
  components: {
    ComplicateDialog,
  },
  data() {
    return {
      chosenOutcome: "",
      loading: false,
      ComplicateDialogOpen: false,
      outcomes: [],
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
      currentCase: "eviction/currentCase",
    }),
    isOutcomeChosen() {
      return this.chosenOutcome != null && this.chosenOutcome != -1;
    },
  },
  activated() {
    window.scrollTo(0, 0);
    this.outcomes = getCourtOutcomes();
    this.chosenOutcome = this.outcomes.indexOf(this.currentCase.courtOutcome);
  },
  deactivated() {
    this.saveData();
  },
  methods: {
    async saveData() {
      // if (!this.isValid) return;
      const courtOutcomeObj = {
        courtOutcome: this.outcomes[this.chosenOutcome],
      };
      if (courtOutcomeObj.courtOutcome != this.currentCase.courtOutcome) {
        const breachTerms = getBreachTerms();
        if (courtOutcomeObj.courtOutcome == this.outcomes[3])
          courtOutcomeObj.breachTerms = [
            { desc: breachTerms[1], selected: false },
            { desc: breachTerms[2], selected: false },
          ];
        else
          courtOutcomeObj.breachTerms = [
            { desc: breachTerms[0], selected: false },
            { desc: breachTerms[1], selected: false },
            { desc: breachTerms[2], selected: false },
          ];
        courtOutcomeObj.breachPayments = [];
        courtOutcomeObj.breachOtherConds = [];
      }      
      await this.$store.dispatch("eviction/updateCase", {
        caseData: courtOutcomeObj,
        // submitted: false,
        // logMessage: "LeaseDetails.vue:786",
        status: "courtOutcome",
        flowType: "wor"
      });
    },
    next() {
      // this.saveData();
      // if (!this.isValid) return;
      switch (this.chosenOutcome) {
        case 5: // No Judgment for Possession is Entered
        case 6: // Marini Hearing Scheduled
        case 7: // Bankruptcy
        case 8: // Other
          this.ComplicateDialogOpen = true;
          break;
        default:
          this.$router.push({ name: "wor-instructions" });
          break;
      }
    },
    cancel() {
      if (this.$auth.isAuthenticated) this.$router.push("/");
      else this.$auth.loginWithRedirect();
    },
    endFlow() {
      if (this.$auth.isAuthenticated) this.$router.push("/");
      else this.$auth.loginWithRedirect();
    },
  },
};
</script>

<style lang="scss"></style>
