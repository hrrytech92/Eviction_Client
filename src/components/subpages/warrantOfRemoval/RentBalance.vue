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
      <div class="custom-title pt-8 pb-4">Update and Confirm Rent Balance</div>
      <div class="pb-4">
        We calculated for you the total amount currently due based on the number
        of months that elapsed until the Trial Date. You need to insert any
        payments received from the tenant during that period of time, and
        confirm that the total balance due and owing is accurate.
      </div>
      <div class="d-flex align-center mt-3 mb-3">
        <div class="ml-1 info--text text-uppercase">
          <v-btn
            class="btn--plain"
            color="accent"
            icon
            tile
            @click="addPayDialogOpen = true"
          >
            <v-icon style="font-size: 28px"> mdi-plus-circle-outline </v-icon>
          </v-btn>
          Add Payments
        </div>
      </div>

      <div style="height: 420px; overflow: auto">
        <vue-scroll :ops="ops">
          <v-data-table
            :headers="headers"
            :items="charges"
            class="elevation-1"
            hide-default-footer
            disable-pagination
            disable-sort
          >
            <template v-slot:item.amount="props">
              <div class="d-flex">
                <!-- <v-edit-dialog
                  v-if="props.item.amount"
                  :return-value.sync="props.item.amount"
                  large
                  persistent
                  @save="saveAmount(props.item)"
                > -->
                  <div>
                    {{ convertToCurrency(props.item.amount) }}
                    <!-- <v-icon size="14" color="#4dccc4" class="ml-1">
                      $pencil
                    </v-icon> -->
                  </div>
                  <!-- <template v-slot:input>
                    <div class="mt-4">Change amount</div>
                    <v-text-field
                      v-model="props.item.amount"
                      label="Edit"
                      single-line
                      autofocus
                      type="number"
                    ></v-text-field>
                  </template>
                </v-edit-dialog> -->
                <!-- <v-icon v-if="props.item.amount" size="18" color="#4dccc4" class="ml-1 mt-1" @click="clearAmount(props.item)">
                  mdi-delete
                </v-icon> -->
              </div>
            </template>
            <template v-slot:item.payment="props">
              <div class="d-flex">
                <v-edit-dialog
                  v-if="props.item.payment"
                  large
                  persistent
                  @save="savePayAmount()"
                >
                  <div>
                    {{ convertToCurrency(props.item.payment) }}
                    <v-icon size="14" color="#4dccc4" class="ml-1">
                      $pencil
                    </v-icon>
                  </div>
                  <template v-slot:input>
                    <div class="mt-4">Change amount</div>
                    <v-text-field
                      v-model="props.item.payment"
                      label="Edit"
                      single-line
                      autofocus
                      type="number"
                    ></v-text-field>
                  </template>
                </v-edit-dialog>
                <v-icon v-if="props.item.payment" size="18" color="#4dccc4" class="ml-1 mt-1" @click="clearPayAmount(props.item)">
                  mdi-delete
                </v-icon>
              </div>
            </template>
            <template v-slot:item.totalBalance="props">
              {{ convertToCurrency(props.item.totalBalance) }}
            </template>
          </v-data-table>
        </vue-scroll>
      </div>

      <div>
        <v-dialog
          v-model="addPayDialogOpen"
          value="''"
          max-width="1000"
          persistent
        >
          <AddPayDialog
            @close:dialog="addPayDialogOpen = false"
            @add="addPayment"
          />
        </v-dialog>
      </div>

      <h2 class="text-right mt-3">
        Total due: {{ convertToCurrency(suitBalance) }}
      </h2>
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
        @click="next"
      >
        Continue
      </v-btn>
    </v-card-actions>
  </div>
</template>

<script>
import AddPayDialog from "@/components/dialogs/AddPayDialog";
import { getCourtOutcomes } from "@/utils/getInfoForWOR";
import { mapGetters } from "vuex";

export default {
  name: "RentBalance",
  components: {
    AddPayDialog,
  },
  data() {
    return {
      addPayDialogOpen: false,
      headers: [
        {
          text: "Period",
          align: "start",
          value: "period",
        },
        { text: "Details", value: "details" },
        { text: "Amount Due", value: "amount" },
        { text: "Payments", value: "payment" },
        { text: "Total Balance", value: "totalBalance" },
        { text: "", value: "actions" },
      ],
      ops: {
        vuescroll: {},
        scrollPanel: {
          speed: 100,
          easing: "easeInQuad",
        },
        rail: {
          background: "#EAEBEB",
          opacity: 1,
          size: "10px",
          specifyBorderRadius: false,
          gutterOfEnds: "10px",
          gutterOfSide: "0px",
        },
        bar: {
          onlyShowBarOnScroll: false,
          keepShow: true,
          background: "#4DCCC4",
          opacity: 1,
          size: "10px",
          minSize: 0.1,
        },
      },
      charges: [],
      pastDueRent: [],
      totalPayment: 0,
    };
  },
  computed: {
    ...mapGetters({
      case: "eviction/currentCase",
    }),
    suitAmount() {
      return this.charges.reduce((acc, cur) => {
        return acc + parseFloat(cur.amount);
      }, 0);
    },
    suitBalance() {
      return this.charges.reduce((acc, cur) => {
        return acc + parseFloat(cur.amount) - parseFloat(cur.payment);
      }, 0);
    },
  },
  activated() {
    window.scrollTo(0, 0);
    /* add data to table - START */
    this.charges = [];
    let chargeItem;

    for (const element of this.case.pastDueRent.filter(
      (value) => value.selected
    )) {
      chargeItem = {};
      chargeItem.period = element.timePeriodDisplay;
      chargeItem.details = "Rent";
      chargeItem.amount = parseFloat(element.amount);
      chargeItem.payment = 0;
      chargeItem.totalBalance = 0;
      this.charges.push(chargeItem);
    }
    
    this.totalPayment = this.case.pastDueRentPaid;
    // add payment data for each row
    this.applyChangeInCharge();
  },
  deactivated() {
    this.saveData();
  },
  methods: {
    async saveData() {
      // if (!this.isValid) return;
      await this.$store.dispatch("eviction/updateCase", {
        caseData: {
          pastDueRentPaid: this.totalPayment,
        },
        // submitted: false,
        logMessage: "RentBalance.vue:247",
        status: "rentBalance",
        flowType: "wor"
      });
    },
    next() {
      // this.saveData();
      this.$router.push({ name: "wor-filing" });
    },
    goBack() {
      const courtOutcomes = getCourtOutcomes();
      if (this.case.courtOutcome == courtOutcomes[2]) { // Consent to Enter Judgment - Tenant Vacates (without payment plan)
        this.$router.push({ name: "wor-move-out-date" });
      } else if (this.case.courtOutcome == courtOutcomes[3] // Breach of Consent to Enter Judgment - Pay and Stay
                || this.case.courtOutcome == courtOutcomes[4]) { // Breach of Consent to Enter Judgment - Pay and Vacate
        const breachTerms = this.case.breachTerms;
        let i = 0;
        for (i = breachTerms.length - 1; i >= 0; i--) {
          if (breachTerms[i].selected)
            break;
        }
        switch (i) { // if selected breach term in Confirmation of Breach is ...
          case 0:
            if (this.case.courtOutcome == courtOutcomes[3])
              this.$router.push({ name: "wor-breach-of-payments-plan" });
            else
              this.$router.push({ name: "wor-move-out-date" });
            break;
          case 1: // FAILED TO MAKE PAYMENT
            if (this.case.courtOutcome == courtOutcomes[3])
              this.$router.push({ name: "wor-breach-of-other-conditions" });
            else
              this.$router.push({ name: "wor-breach-of-payments-plan" });
            break;
          case 2: // BREACH OF OTHER CONDITIONS
            this.$router.push({ name: "wor-breach-of-other-conditions" });
            break;
        }
      } else {
        this.$router.push({ name: "wor-update-filing-info" });
      }
    },
    applyChangeInCharge() {
      let charges = [];
      charges = this.charges.slice();
      let payAmount = this.totalPayment;
      let rentAmount = 0;
      for (let i = charges.length-1; payAmount > 0; i--) {
        rentAmount = parseFloat(charges[i].amount);
        if (payAmount > rentAmount) {
          charges[i].payment = rentAmount;
        } else {
          charges[i].payment = payAmount;
        }
        payAmount -= rentAmount;
      }
      let totalBalance = 0;
      for (let k = 0; k < charges.length; k++) {
        totalBalance += (parseFloat(charges[k].amount) - parseFloat(charges[k].payment));
        charges[k].totalBalance = totalBalance;
      }
      this.charges = charges;
    },
    addPayment(payment) {
      const totalPaymentBkp = this.totalPayment;
      const totalPayment = parseFloat(totalPaymentBkp) + parseFloat(payment.amount);
      if (totalPayment > this.suitAmount) {
        alert('Total Payment should be equal or less than Total Amount Due!');
        this.totalPayment = totalPaymentBkp;
        return;
      }
      this.addPayDialogOpen = false;
      this.totalPayment = totalPayment;
      this.applyChangeInCharge();
    },
    // saveAmount() {},
    savePayAmount() {
      const totalPaymentBkp = this.totalPayment;
      const totalPayment = this.charges.reduce((sum, cur) => sum + parseFloat(cur.payment), 0);
      if (totalPayment > this.suitAmount) {
        alert('Total Payment should be equal or less than Total Amount Due!');
        this.totalPayment = totalPaymentBkp;
      } else {
        this.totalPayment = totalPayment;
      }
      this.applyChangeInCharge();
    },
    // clearAmount(item) {
    //   const idx = this.charges.indexOf(item);
    //   this.charges[idx].amount = 0;
    // },
    clearPayAmount(item) {
      const idx = this.charges.indexOf(item);
      this.totalPayment = parseFloat(this.totalPayment) - parseFloat(this.charges[idx].payment);
      this.charges[idx].payment = 0;
      this.applyChangeInCharge();
    },
  },
};
</script>

<style lang="scss"></style>
