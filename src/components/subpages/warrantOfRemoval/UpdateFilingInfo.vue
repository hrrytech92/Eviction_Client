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
      <div class="custom-title pt-8 pb-4">Court Information</div>
      <div class="pb-4">
        Enter the information below as it appears on the notice provided to you
        by the court. This will help you stay on track with your case, so you
        don’t miss an important step or event.
      </div>

      <v-form ref="form" v-model="valid" class="pt-10 pb-4 text-left">
        <div class="text-left" style="width: 70%; margin: auto">
          <div class="font-weight-medium secondary--text pb-2">
            Docket Number
          </div>
          <v-text-field
            v-model="docketNo"
            rounded
            solo
            flat
            dense
            background-color="#F0F5F6"
            :rules="[(v) => !!v || 'Item is required']"
          />

          <div class="font-weight-medium secondary--text pb-2">Trial Date</div>
          <v-menu
            v-model="trialDateMenuOpen"
            :close-on-content-click="false"
            :nudge-right="40"
            transition="scale-transition"
            offset-y
            min-width="290px"
          >
            <template v-slot:activator="{ on }">
              <v-text-field
                v-model="trialDate"
                append-icon="$calendar"
                color="accent"
                readonly
                rounded
                solo
                flat
                dense
                background-color="#F0F5F6"
                v-on="on"
                @click:append="trialDateMenuOpen = true"
                :rules="[(v) => !!v || 'Item is required']"
              />
            </template>
            <v-date-picker
              v-model="selectedTrialDate"
              no-title
              :show-current="false"
              color="primary"
              class="custom-date"
              @input="closedTrialDateMenu"
            />
          </v-menu>

          <div class="font-weight-medium secondary--text pb-2">
            Date Filed Verified Complaint
          </div>
          <v-menu
            v-model="vcDateFiledMenuOpen"
            :close-on-content-click="false"
            :nudge-right="40"
            transition="scale-transition"
            offset-y
            min-width="290px"
          >
            <template v-slot:activator="{ on }">
              <v-text-field
                v-model="vcDateFiled"
                append-icon="$calendar"
                color="accent"
                readonly
                rounded
                solo
                flat
                dense
                background-color="#F0F5F6"
                v-on="on"
                @click:append="vcDateFiledMenuOpen = true"
                :rules="[(v) => !!v || 'Item is required']"
              />
            </template>
            <v-date-picker
              v-model="selectedVcDateFiled"
              no-title
              :show-current="false"
              color="primary"
              class="custom-date"
              @input="closedVcDateFiledMenu"
            />
          </v-menu>
        </div>
      </v-form>
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
        :disabled="!valid"
        @click="next"
      >
        Continue
      </v-btn>
    </v-card-actions>
  </div>
</template>

<script>
import { getCourtOutcomes } from "@/utils/getInfoForWOR";
import { mapGetters } from "vuex";

export default {
  name: "UpdateFilingInfo",
  data() {
    return {  
      valid: true,
      docketNo: null,
      trialDate: null,
      selectedTrialDate: null,
      trialDateMenuOpen: false,
      vcDateFiled: null,
      selectedVcDateFiled: null,
      vcDateFiledMenuOpen: false,
    };
  },
  computed: {
    ...mapGetters({
      currentCase: "eviction/currentCase",
    }),
  },
  activated() {
    window.scrollTo(0, 0);
    this.docketNo = this.currentCase.docketNo;
    this.selectedTrialDate = this.currentCase.trialDate ?? null;
    this.trialDate = this.selectedTrialDate ? this.$dayjs(this.selectedTrialDate).format("MMMM DD, YYYY") : " ";
    this.selectedVcDateFiled = this.currentCase.vcDateFiled ?? null;
    this.vcDateFiled = this.selectedVcDateFiled ? this.$dayjs(this.selectedVcDateFiled).format("MMMM DD, YYYY") : " ";
  },
  deactivated() {
      this.saveData();
  },
  methods: {
    async saveData() {
      // if (!this.isValid) return;
      const caseData = {
        docketNo: this.docketNo ?? null,
        trialDate: this.selectedTrialDate,
        vcDateFiled: this.selectedVcDateFiled
      };
      await this.$store.dispatch("eviction/updateCase", {
        caseData,
        // submitted: false,
        // logMessage: "LeaseDetails.vue:786",
        status: "updateFilingInfo",
        flowType: "wor"
      });
    },
    next() {
      // this.saveData();
      const courtOutcomes = getCourtOutcomes();
      if (this.currentCase.courtOutcome == courtOutcomes[2]) { // Consent to Enter Judgment - Tenant Vacates (without payment plan)
        this.$router.push({ name: "wor-move-out-date" });  
      } else if (this.currentCase.courtOutcome == courtOutcomes[3] // Breach of Consent to Enter Judgment - Pay and Stay
                 || this.currentCase.courtOutcome == courtOutcomes[4]) { // Breach of Consent to Enter Judgment - Pay and Vacate
        this.$router.push({ name: "wor-confirm-breach" });
      } else {
        this.$router.push({ name: "wor-uc-rent-balance" });
      }
    },
    goBack() {
      this.$router.push({ name: "wor-court-outcome" });
    },
    closedTrialDateMenu(data) {
      this.selectedTrialDate = data;
      this.trialDate = this.$dayjs(this.selectedTrialDate).format("MMMM DD, YYYY");
      this.trialDateMenuOpen = false;
    },
    closedVcDateFiledMenu(data) {
      this.selectedVcDateFiled = data;
      this.vcDateFiled = this.$dayjs(this.selectedVcDateFiled).format("MMMM DD, YYYY");
      this.vcDateFiledMenuOpen = false;
    },
  },
};
</script>

<style lang="scss"></style>
