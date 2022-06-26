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
      <div class="custom-title pt-8 pb-4">Breach of Other Conditions</div>
      <div class="pb-4">
        Provide below other conditions the parties agreed to, as well as the date by which the Tenant had to comply.
        If a date was not specified, enter the date the Consent to Enter Judgment was signed by the parties.
      </div>

      <v-form ref="form" v-model="valid" class="pt-10 pb-4 text-left">
        <div class="text-left" style="width: 80%; margin: auto">
          <div class="font-weight-medium secondary--text pb-2">Compliance Date</div>
          <v-menu
            v-model="singleComp.menu"
            :close-on-content-click="false"
            :nudge-right="40"
            transition="scale-transition"
            offset-y
            min-width="290px"
          >
            <template v-slot:activator="{ on }">
              <v-text-field
                v-model="singleComp.compDateDisplay"
                append-icon="$calendar"
                color="accent"
                readonly
                rounded
                solo
                flat
                dense
                background-color="#F0F5F6"
                v-on="on"
                @click:append="singleComp.menu = true"
                :rules="[(v) => !!v || 'Item is required']"
              />
            </template>
            <v-date-picker
              v-model="singleComp.compDate"
              no-title
              :show-current="false"
              color="primary"
              class="custom-date"
              @input="closedCompDateMenu"
            />
          </v-menu>

          <div class="font-weight-medium secondary--text pb-2">
            Terms
          </div>
          <v-textarea
            v-model="singleComp.terms"
            rounded
            solo
            flat
            dense
            background-color="#F0F5F6"
            :rules="[(v) => !!v || 'Item is required']"
          ></v-textarea>

          <div
            v-if="!areThereAnyAdditionalForm"
            class="utilities-dialog__form-add-action d-flex align-center mt-4"
          >
            <v-btn
              class="btn--plain"
              color="accent"
              icon
              tile
              @click="addAdditionalForm"
            >
              <v-icon style="font-size: 28px"> mdi-plus-circle-outline </v-icon>
            </v-btn>
            <div class="ml-3 info--text caption text-uppercase">
              ADD ADDITIONAL PAYMENT
            </div>
          </div>
        </div>
      </v-form>
      
      <v-divider
        v-if="areThereAnyAdditionalForm"
        width="80%"
        class="utilities-dialog__form-divider"
      />

      <v-form
        v-if="areThereAnyAdditionalForm"
        ref="formDate"
        class="utilities-dialog__form px-8 pt-10 pb-4 mx-auto text-left"
         style="width: 70%; margin: auto"
      >
        <div v-for="(comp, index) in additionalComps" :key="index">
          <div class="font-weight-medium secondary--text pb-3">Compliance Date</div>
          <v-menu
            v-model="comp.menu"
            :close-on-content-click="false"
            :nudge-right="40"
            transition="scale-transition"
            offset-y
            min-width="290px"
          >
            <template v-slot:activator="{ on }">
              <v-text-field
                v-model="comp.dateDueDisplay"
                append-icon="$calendar"
                color="accent"
                readonly
                rounded
                solo
                flat
                dense
                background-color="#F0F5F6"
                v-on="on"
                @click:append="comp.menu = true"
                :rules="[(v) => !!v || 'Item is required']"
              />
            </template>
            <v-date-picker
              v-model="comp.dateDue"
              no-title
              :show-current="false"
              color="primary"
              class="custom-date"
              @input="updateDate(comp.dateDue, index)"
            />
          </v-menu>

          <div class="font-weight-medium secondary--text pb-2">
            Terms
          </div>
          <v-textarea
            v-model="comp.terms"
            rounded
            solo
            flat
            dense
            background-color="#F0F5F6"
            :rules="[(v) => !!v || 'Item is required']"
          ></v-textarea>

          <div class="d-flex justify-end">
            <span
              class="body-2"
              style="color: #fa8b5c; cursor: pointer"
              @click="deleteComp(index)"
            >
              Delete
            </span>
          </div>
        </div>

        <div class="utilities-dialog__form-add-action d-flex align-center mt-2">
          <v-btn
            class="btn--plain"
            color="accent"
            icon
            tile
            @click="addAdditionalForm"
          >
            <v-icon style="font-size: 28px"> mdi-plus-circle-outline </v-icon>
          </v-btn>
          <div class="ml-3 info--text caption text-uppercase">
            ADD ADDITIONAL PAYMENT
          </div>
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
        :disabled="!isValid"
        @click="next"
      >
        Continue
      </v-btn>
    </v-card-actions>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { getCourtOutcomes } from "@/utils/getInfoForWOR";

export default {
  name: "BreachPaymentsPlan",
  data() {
    return {  
      valid: true,
      singleComp: {
        compDate: "",
        compDateDisplay: "",
        menu: false,
        terms: "",
      },
      additionalComps: [],
    };
  },
  computed: {
    ...mapGetters({
      currentCase: "eviction/currentCase",
    }),
    areThereAnyAdditionalForm() {
      return this.additionalComps.length > 0;
    },
    isValid() {
      return this.valid && this.singleComp.compDate && this.singleComp.compDate != " " && this.singleComp.terms && this.singleComp.terms != " "
    },
  },
  activated() {
    window.scrollTo(0, 0);
    if (this.currentCase.breachOtherConds && this.currentCase.breachOtherConds.length) {
      this.singleComp = this.currentCase.breachOtherConds[0];
    } else {
      this.singleComp = {
        compDate: "",
        compDateDisplay: " ",
        menu: false,
        terms: " ",
      };
    }
    if (this.currentCase.breachOtherConds && this.currentCase.breachOtherConds.length > 1) {
      this.additionalComps = this.currentCase.breachOtherConds.slice(1);
    } else {
      this.additionalComps = [];
    }
  },
  methods: {
    async saveData() {
      // if (!this.isValid) return;
      const data = [
        this.singleComp,
        ...this.additionalComps,
      ];
      const comps = data.reduce((result, comp) => {
        if (comp.terms && comp.compDate) {
          result = [
            ...result,
            {
              terms: comp.terms,
              compDate: comp.compDate,
              compDateDisplay: comp.compDateDisplay,
            }
          ];
        }

        return result;
      }, []);
      await this.$store.dispatch("eviction/updateCase", {
        caseData: {
          breachOtherConds: comps,
        },
        // submitted: false,
        // logMessage: "LeaseDetails.vue:786",
        // status: "updateFilingInfo",
        flowType: "wor"
      });
    },
    addAdditionalForm() {
      this.additionalComps.push({
        compDate: "",
        compDateDisplay: "",
        terms: "",
        menu: false,
      });
    },
    next() {
      this.saveData();
      this.$router.push({ name: "wor-uc-rent-balance" });
    },
    goBack() {
      const breachTerms = this.currentCase.breachTerms;
      const courtOutcomes = getCourtOutcomes();
      let i = 0;
      for (i = breachTerms.length - 2; i >= 0; i--) {
        if (breachTerms[i].selected)
          break;
      }
      switch (i) { // if selected breach term in Confirmation of Breach is ...
        case 0: 
          if (this.currentCase.courtOutcome == courtOutcomes[3]) // if the Court outcome is "Breach of Consent to Enter Judgment - Pay and Stay"
            this.$router.push({ name: "wor-breach-of-payments-plan" });
          else
            this.$router.push({ name: "wor-move-out-date" });
          break;
        case 1: // FAILED TO MAKE PAYMENT
          this.$router.push({ name: "wor-breach-of-payments-plan" });
          break;
        default:
          this.$router.push({ name: "wor-confirm-breach" });
          break;
      }
    },
    closedCompDateMenu(date) {
      this.singleComp.compDate = date;
      this.singleComp.compDateDisplay = this.$dayjs(date).format("MMMM DD, YYYY");
      this.singleComp.menu = false;
    },
    updateDate(date, index) {
      this.additionalComps[index].menu = false;
      this.additionalComps[index].compDate = date;
      this.additionalComps[index].compDateDisplay = this.$dayjs(date).format("MMMM DD, YYYY");
    },
    deleteComp(index) {
      this.$delete(this.additionalComps, index);
    },
  },
};
</script>

<style lang="scss"></style>
