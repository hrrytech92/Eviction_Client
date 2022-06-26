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

    <div style="width: 80%" class="pt-10 pb-4 mx-auto text-left">
      <div class="custom-title pt-8 pb-4">Legal Fees</div>
      <p class="pb-4">
        Take a look at your lease or rental agreement. Depending on the terms,
        you may be able to pursue legal fees. Verify if it specifies legal fees
        as “additional rent.” This may include court costs, attorney fees, and
        other associated legal fees. For more information, see
        <a
          href="https://www.njcourts.gov/notices/2021/n210715b.pdf"
          target="_blank"
          style="color: #6a7fdb; display: inline"
        >
          njcourts.gov/notices/2021/n210715b.pdf.
        </a>
      </p>
      <div class="pb-4 font-weight-medium">
        Would you like to include legal fees in your complaint?
      </div>
      <div class="py-4">
        <v-btn
          rounded
          :color="legalFeesPermitted === false ? 'primary' : 'info_light'"
          dark
          class="px-12 capital--btn"
          :class="{ 'secondary--text': legalFeesPermitted !== false }"
          depressed
          @click="optionClicked(false)"
        >
          no
        </v-btn>
        <v-btn
          rounded
          :color="legalFeesPermitted === true ? 'primary' : 'info_light'"
          dark
          class="px-12 ml-4 capital--btn"
          :class="{ 'secondary--text': legalFeesPermitted !== true }"
          depressed
          @click="optionClicked(true)"
        >
          yes
        </v-btn>
      </div>

      <!-- <div v-if="legalFeesPermitted === 'yes'">
                <div class="headline font-weight-medium pt-8 pb-4">Amounts Due</div>
                <div class="secondary--text caption">Based on your selections, we’ve calculated the legal fees to be charged as rent for the purposes of this action. You may update the amount and add additional legal fees, if not listed.</div>
    

        <v-container>
            <v-row>
            <v-col>
            <v-sheet class="py-4 mb-4 font-weight-medium white--text d-flex flex-column text-center" color="primary" v-for="category in categories" :key="category.title">
                <v-btn fab color="primary" x-small height="25" width="25" class="align-self-end mr-4" :class="{'hidden-item': category.costs.length <= 1}" style="border: solid 1px white !important; margin-top: -5px" @click="openCostsDialog(category)"><v-icon small>mdi-help</v-icon></v-btn>
              <div class="text-uppercase" style="font-size: .8rem; font-weight: 600;">{{category.title}}</div>
              <div style="font-size: 2rem;">${{total(category.costs)}}</div>
              </v-sheet>
            </v-col>
            <v-col class="text-center">
                <v-sheet class="py-12 mb-12 font-weight-medium white--text d-flex flex-column justify-center text-center" height="300" color="rgba(218, 227, 233, .2)">
              <div class="secondary--text" style="font-size: .8rem; font-weight: 600;">TOTAL LEGAL FEES</div>
              <div style="font-size: 2rem;" class="pb-2 primary--text">${{finalTotal}}</div>
              </v-sheet>
              <v-btn fab depressed color="primary" @click="addFeeDialog = true"><v-icon x-large>mdi-plus</v-icon></v-btn>
            </v-col>
            </v-row>
        </v-container>
  </div> -->
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
        @click="back"
      >
        go back
      </v-btn>
      <v-btn
        rounded
        color="accent_light"
        class="px-8 mb-2 mt-4 white--text capital--btn"
        depressed
        :disabled="!valid"
        @click="next"
      >
        continue
      </v-btn>
    </v-card-actions>
    <v-dialog v-model="costsDialog" value="''" max-width="400px">
      <costs-dialog
        v-bind="{ ...dialogProps }"
        @close-costs-dialog="closeCostsDialog"
      />
    </v-dialog>
    <v-dialog v-model="addFeeDialog" value="''" max-width="600">
      <add-fee-dialog
        :dialog-open="addFeeDialog"
        :attorney="attorney"
        @close-dialog="closeDialog"
        @add:item="addItem"
      />
    </v-dialog>
  </div>
</template>

<script>
import CostsDialog from "@/components/dialogs/CostsDialog.vue";
import AddFeeDialog from "@/components/dialogs/AddFeeDialog.vue";

import { mapGetters } from "vuex";

export default {
  name: "LegalFeesPermitted",
  components: {
    CostsDialog,
    AddFeeDialog,
  },
  props: {
    attorney: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      legalFeesPermitted: null,
      dialogProps: {},
      costsDialog: false,
      addFeeDialog: false,
      categories: [
        {
          type: "Filing Fee",
          amount: "57.00",
          selected: this.legalFeesPermitted,
        },
        // {
        //   title: 'Attorney Fees',
        //   costs: [{
        //     name: 'General',
        //     timePeriod: '03.23.2020',
        //     timePeriodDisplay: '03.23.2020',
        //     cost: '600.00'
        //   },]
        // },
        // {
        //   title: "Court Costs",
        //   costs: [

        //     // {
        //     //   name: "Copies",
        //     //   timePeriod: "03.23.2020",
        //     //   timePeriodDisplay: "03.23.2020",
        //     //   cost: "10.00",
        //     // },
        //   ],
        // },
        // {
        //   title: "Software",
        //   total: "60.00",
        //   costs: [
        //     {
        //       name: "General",
        //       timePeriod: "03.23.2020",
        //       timePeriodDisplay: "03.23.2020",
        //       cost: "60.00",
        //     },
        //   ],
        // },
      ],
    };
  },
  computed: {
    ...mapGetters({
      currentCase: "eviction/currentCase",
      currentProperty: "property/currentProperty",
    }),
    valid() {
      return this.legalFeesPermitted !== null;
    },
    finalTotal() {
      return this.categories
        .reduce((total, category) => {
          return (total += parseFloat(this.total(category.costs)));
        }, 0)
        .toFixed(2);
    },
  },
  activated() {
    window.scrollTo(0, 0);
    this.legalFeesPermitted = this.currentCase.legalFeesPermitted ?? null; //for guest;;
  },
  deactivated() {
    this.saveData();
  },
  methods: {
    async saveData() {
      await this.$store.dispatch("eviction/updateCase", {
        caseData: {
          legalFeesPermitted: this.legalFeesPermitted,
        },
        // lastStep: "Confirmation", //"Documents",
        // lastStep: "Legal Fees",
        // submitted: false,
        status: "legalFees",
      });
    },
    next() {
      this.$router.push({ name: "vc-confirmation" });
    },
    optionClicked(bool) {
      this.legalFeesPermitted = bool;
      this.next();
    },
    back() {
      this.$router.push({
        name: this.currentCase.additionalChargesPermitted
          ? "vc-additional-charges-extended"
          : "vc-additional-charges",
      });
    },
    openCostsDialog(category) {
      this.dialogProps = { ...category, total: this.total(category.costs) };
      this.costsDialog = true;
    },
    closeDialog(fee) {
      console.log(fee);
      this.addFeeDialog = false;
    },
    closeCostsDialog() {
      this.costsDialog = false;
    },
    addItem(item) {
      switch (item.title) {
        case "Attorney Fees":
          this.categories[0].costs.push({
            name: item.description,
            cost: item.amount,
            timePeriod: item.timePeriod,
            timePeriodDisplay: item.timePeriodDisplay,
          });
          break;
        case "Court Costs":
          this.categories[1].costs.push({
            name: item.description,
            cost: item.amount,
            timePeriod: item.timePeriod,
          });
          break;
        case "Associated Legal Expenses":
          this.categories[3].costs.push({
            name: item.description,
            cost: item.amount,
            timePeriod: item.timePeriod,
            timePeriodDisplay: item.timePeriodDisplay,
          });
          break;
        case "Other":
          this.categories.push({
            title: item.title2,
            costs: [
              {
                name: item.description,
                cost: item.amount,
                timePeriod: item.timePeriod,
                timePeriodDisplay: item.timePeriodDisplay,
              },
            ],
          });
          break;
        default:
          break;
      }
      this.addFeeDialog = false;
    },
    total(items) {
      return items
        .reduce((total, item) => {
          return (total += parseFloat(item.cost));
        }, 0)
        .toFixed(2);
    },
  },
};
</script>

<style></style>
