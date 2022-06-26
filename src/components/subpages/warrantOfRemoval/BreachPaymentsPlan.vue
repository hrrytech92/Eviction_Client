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
      <div class="custom-title pt-8 pb-4">Breach of Payments Plan</div>
      <div class="pb-4">
        Indicate here which payment of the Consent to Enter Judgment was missed, the date it was due to be paid and the amount that was due on that date.
      </div>

      <v-form ref="form" v-model="valid" class="pt-10 pb-4 text-left">
        <div class="text-left" style="width: 70%; margin: auto">
          <div class="font-weight-medium secondary--text pb-2">
            Breach Amount
          </div>
          <v-text-field
            v-model="singlePayment.amount"
            rounded
            type="number"
            solo
            flat
            dense
            background-color="#F0F5F6"
            style="height: 45px"
            :rules="[(v) => !!v || 'Item is required']"
          >
            <div slot="prepend-inner">$</div>
          </v-text-field>

          <div class="font-weight-medium secondary--text pb-2 mt-4">Date Due</div>
          <v-menu
            v-model="singlePayment.menu"
            :close-on-content-click="false"
            :nudge-right="40"
            transition="scale-transition"
            offset-y
            min-width="290px"
          >
            <template v-slot:activator="{ on }">
              <v-text-field
                v-model="singlePayment.dateDueDisplay"
                append-icon="$calendar"
                color="accent"
                readonly
                rounded
                solo
                flat
                dense
                background-color="#F0F5F6"
                v-on="on"
                @click:append="singlePayment.menu = true"
                :rules="[(v) => !!v || 'Item is required']"
              />
            </template>
            <v-date-picker
              v-model="singlePayment.dateDue"
              no-title
              :show-current="false"
              color="primary"
              class="custom-date"
              @input="closedDateDueMenu"
            />
          </v-menu>

          <div
            v-if="!areThereAnyAdditionalForm"
            class="payments-form__form-add-action d-flex align-center mt-4"
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
        class="payments-form__form-divider"
      />

      <v-form
        v-if="areThereAnyAdditionalForm"
        ref="formDate"
        class="payments-form__form px-8 pt-10 pb-4 mx-auto text-left"
         style="width: 70%; margin: auto"
      >
        <div v-for="(pay, index) in additionalPayments" :key="index">
          <div class="font-weight-medium secondary--text pb-2">Breach Amount</div>
          <v-text-field
            v-model="pay.amount"
            rounded
            type="number"
            solo
            flat
            dense
            background-color="#F0F5F6"
            style="height: 45px"
            :rules="[(v) => !!v || 'Item is required']"
          >
            <div slot="prepend-inner">$</div>
          </v-text-field>

          <div class="font-weight-medium secondary--text pb-3 mt-4">Date Due</div>
          <v-menu
            v-model="pay.menu"
            :close-on-content-click="false"
            :nudge-right="40"
            transition="scale-transition"
            offset-y
            min-width="290px"
          >
            <template v-slot:activator="{ on }">
              <v-text-field
                v-model="pay.dateDueDisplay"
                append-icon="$calendar"
                color="accent"
                readonly
                rounded
                solo
                flat
                dense
                background-color="#F0F5F6"
                v-on="on"
                @click:append="pay.menu = true"
                :rules="[(v) => !!v || 'Item is required']"
              />
            </template>
            <v-date-picker
              v-model="pay.dateDue"
              no-title
              :show-current="false"
              color="primary"
              class="custom-date"
              @input="updateDate(pay.dateDue, index)"
            />
          </v-menu>

          <div class="d-flex justify-end">
            <span
              class="body-2"
              style="color: #fa8b5c; cursor: pointer"
              @click="deletePayment(index)"
            >
              Delete
            </span>
          </div>
        </div>

        <div class="payments-form__form-add-action d-flex align-center mt-2">
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
import { getCourtOutcomes } from "@/utils/getInfoForWOR";
import { mapGetters } from "vuex";

export default {
  name: "BreachPaymentsPlan",
  data() {
    return {  
      valid: true,
      singlePayment: {
        amount: null,
        dateDue: "",
        dateDueDisplay: "",
        menu: false,
      },
      additionalPayments: [],
    };
  },
  computed: {
    ...mapGetters({
      currentCase: "eviction/currentCase",
    }),
    areThereAnyAdditionalForm() {
      return this.additionalPayments.length > 0;
    },
    isValid() {
      return this.valid && this.singlePayment.amount && this.singlePayment.amount != " " && this.singlePayment.dateDue && this.singlePayment.dateDue != " "
    },
  },
  activated() {
    window.scrollTo(0, 0);
    if (this.currentCase.breachPayments && this.currentCase.breachPayments.length) {
      this.singlePayment = this.currentCase.breachPayments[0];
    } else {
      this.singlePayment = {
        amount: " ",
        dateDue: "",
        dateDueDisplay: " ",
        menu: false,
      };
    }
    if (this.currentCase.breachPayments && this.currentCase.breachPayments.length > 1) {
      this.additionalPayments = this.currentCase.breachPayments.slice(1);
    } else {
      this.additionalPayments = [];
    }
  },
  methods: {
    async saveData() {
      // if (!this.isValid) return;
      const data = [
        this.singlePayment,
        ...this.additionalPayments,
      ];
      const payments = data.reduce((result, payment) => {
        if (payment.amount && payment.dateDue) {
          result = [
            ...result,
            {
              amount: payment.amount,
              dateDue: payment.dateDue,
              dateDueDisplay: payment.dateDueDisplay,
            }
          ];
        }

        return result;
      }, []);
      await this.$store.dispatch("eviction/updateCase", {
        caseData: {
          breachPayments: payments,
        },
        // submitted: false,
        // logMessage: "LeaseDetails.vue:786",
        // status: "updateFilingInfo",
        flowType: "wor"
      });
    },
    addAdditionalForm() {
      this.additionalPayments.push({
        amount: null,
        dateDue: "",
        dateDueDisplay: "",
        menu: false,
      });
    },
    next() {
      this.saveData();
      const breachTerms = this.currentCase.breachTerms;
      const courtOutcomes = getCourtOutcomes();
      let index = 0;
      if (this.currentCase.courtOutcome == courtOutcomes[3]) // if the Court outcome is "Breach of Consent to Enter Judgment - Pay and Stay"
        index = 1;
      else
        index = 2;
      if (breachTerms[index].selected) // "BREACH OF OTHER CONDITIONS" is selected in Confirmation of Breach
        this.$router.push({ name: "wor-breach-of-other-conditions" });
      else
        this.$router.push({ name: "wor-uc-rent-balance" });
    },
    goBack() {
      const breachTerms = this.currentCase.breachTerms;
      const courtOutcomes = getCourtOutcomes();
      if (this.currentCase.courtOutcome == courtOutcomes[4] && breachTerms[0].selected) // "MOVE OUT DATE" is selected in Confirmation of Breach
        this.$router.push({ name: "wor-move-out-date" });
      else
        this.$router.push({ name: "wor-confirm-breach" });
    },
    closedDateDueMenu(date) {
      this.singlePayment.dateDue = date;
      this.singlePayment.dateDueDisplay = this.$dayjs(date).format("MMMM DD, YYYY");
      this.singlePayment.menu = false;
    },
    updateDate(date, index) {
      this.additionalPayments[index].menu = false;
      this.additionalPayments[index].dateDue = date;
      this.additionalPayments[index].dateDueDisplay = this.$dayjs(date).format("MMMM DD, YYYY");
    },
    deletePayment(index) {
      this.$delete(this.additionalPayments, index);
    },
  },
};
</script>

<style lang="scss">
.payments-form {
  &__form {
    // width: 70%;

    &-add-action {
      margin-top: -20px;
    }

    &-divider {
      margin: 24px auto;
    }
  }
}
</style>
