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

    <div style="width: 85%" class="pt-10 pb-4 mx-auto text-left">
      <div class="custom-title pt-8 pb-4">Summary of Suit Amount</div>
      <div class="pb-6">
        Based on the information provided, these are the total amounts due, to
        be added to your suit and requested in the Verified Complaint. Review
        carefully and confirm each amount, edit or delete.
      </div>
      <v-container
        v-for="item in summaryItems"
        :key="item.name"
        fluid
        class="pa-0 mb-4"
      >
        <v-row v-if="item.total > 0" no-gutters justify="center" align="center">
          <v-col cols="12">
            <v-container>
              <v-row>
                <div
                  class="suit-amount-summary-item elevated-bar align-center d-flex"
                  @click="openClose(item.name)"
                >
                  <v-col cols="6">
                    <div class="text-left pl-8">
                      {{ item.name }}
                    </div>
                  </v-col>
                  <v-col cols="4">
                    <div class="text-right primary--text">
                      {{ convertToCurrency(item.total) }}
                    </div>
                  </v-col>
                  <v-col
                    style="height: 100%"
                    cols="2"
                    class="pa-0 d-flex justify-end"
                  >
                    <div
                      class="elevated-bar-btn d-flex align-center justify-center"
                    >
                      <v-icon style="font-size: 75px; color: #93aebf">
                        mdi-menu-{{ direction(item.name) }}
                      </v-icon>
                    </div>
                  </v-col>
                </div>
              </v-row>
              <span v-if="item.name === open">
                <v-row class="mt-4">
                  <v-col cols="6">
                    <div
                      class="text-left pl-8 font-weight-medium info--text text-uppercase"
                      style="font-size: 0.9rem"
                    >
                      INCLUDES
                    </div>
                  </v-col>
                </v-row>
                <v-row v-for="row in item.amounts" :key="row.dates">
                  <v-col cols="6" class="py-1">
                    <div class="text-left pl-8" style="font-size: 0.9rem">
                      <p v-if="item.name === 'Past Due Rent'">
                        {{ row.timePeriodDisplay }}
                      </p>
                      <p v-else-if="row.type">{{ row.type }}</p>
                      <p v-else>{{ row.title }}</p>
                    </div>
                  </v-col>
                  <v-col cols="3" class="py-1">
                    <div
                      class="text-right font-weight-medium"
                      style="font-size: 0.9rem"
                    >
                      {{ convertToCurrency(row.amount) }}
                    </div>
                  </v-col>
                  <v-col />
                </v-row>
              </span>
            </v-container>
          </v-col>

          <!-- Don't delete this section -->
          <!-- <v-col class="d-flex justify-center">
            <v-menu
              offset-y
              bottom
              left
              open-on-hover
            >
              <template v-slot:activator="{ on }">
                <v-btn
                  small
                  icon
                  color="primary"
                  class="btn--plain"
                  v-on="on"
                >
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
              </template>

              <v-list dense>
                <v-list-item @click="view(item.id)">
                  <v-list-item-title class="overline info--text">
                    <i
                      style="font-size: 20px"
                      :class="`icofont-search-document pr-4`"
                    />
                    <v-icon
                      color="info"
                      class="pr-4"
                    >
                      $pencil
                    </v-icon>
                    EDIT
                  </v-list-item-title>
                </v-list-item>

                <v-list-item @click="deleteUpload(item.id)">
                  <v-list-item-title class="overline info--text">
                    <i
                      style="font-size: 20px"
                      :class="`icofont-close-circled pr-4`"
                    />
                    DELETE
                  </v-list-item-title>
                </v-list-item>
                <v-list-item
                  v-for="(btn, i) in btns"
                  :key="i"
                  @click="btn.onclick"
                >
                  <v-list-item-title class="overline info--text">
                    <i
                      style="font-size: 20px"
                      :class="`icofont-${btn.icon} pr-4`"
                    />
                    {{ btn.title }}
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-col> -->
        </v-row>
      </v-container>

      <div class="mt-10">
        <div
          class="pt-10 text-right font-weight-medium info--text text-uppercase"
          style="font-size: 0.8rem"
        >
          total suit amount
        </div>
        <div class="text-right font-weight-medium" style="font-size: 2.2rem">
          {{ convertToCurrency(totalAmount) }}
        </div>
      </div>
    </div>
    <v-card-actions
      style="background-color: #fafbfc; border-radius: 0px 0px 10px 10px"
      class="justify-end mt-12 py-4 px-0"
    >
      <div style="width: 85%" class="justify-end d-flex mx-auto">
        <v-btn
          rounded
          color="accent_light"
          class="mb-2 mt-4 btn--plain capital--btn"
          text
          @click="
            $router.push({
              name: currentCase.clrsDraft
                ? 'vc-registration'
                : 'vc-certification',
            })
          "
        >
          go back
        </v-btn>
        <v-btn
          rounded
          color="accent_light"
          class="px-8 mb-2 mt-4 white--text capital--btn"
          depressed
          @click="next"
          :disabled="isPastDueError"
        >
          continue
        </v-btn>
      </div>
    </v-card-actions>
    <!-- <div
      v-if="isPastDueError"
      style="
        color: #ff854e;
        padding-bottom: 10px;
        margin-right: 55px;
        text-align: right;
      "
    >
      Error: Please select at least one 'past due' item
      <v-btn rounded depressed @click="navigateToPastDue"> Select </v-btn>
    </div> -->
  </div>
</template>

<script>
import calculateFees from "@/mixins/calculate-fees";

export default {
  name: "SuitAmountSummary",
  mixins: [calculateFees],
  data() {
    return {
      items: [],
      open: "",
      // useNext: false,
      isPastDueError: false,
    };
  },
  computed: {
    currentCase() {
      return this.$store.getters["eviction/currentCase"];
    },
    direction() {
      return (name) => (name === this.open ? "up" : "down");
    },
    totalAmount() {
      return this.summaryItems.reduce((sum, item) => sum + item.total, 0);
    },
  },
  // watch: {
  //   currentCase: {
  //     deep: true,
  //     immediate: true,
  //     handler: function (newCase, oldCase) {
  //       //* Watch is needed for when the user changes "leagal fees" and comes back to this page.
  //       // if (newVal !== oldVal)
  //       // console.log({ newVal, oldVal });
  //       this.initFeeData();

  //       const { pastDueRent } = this.currentCase || {};
  //       if (pastDueRent.length) {
  //         this.isPastDueError = !pastDueRent.some(
  //           (item) => item.selected === true
  //         );
  //       }
  //     },
  //   },
  // },

  async activated() {
    // console.log("SuitAmountSummary activated");
    this.initFeeData();
    window.scrollTo(0, 0);
    console.log("this.summaryItems :>> ", this.summaryItems);
    // this.useNext = false;
  },
  deactivated() {
    this.saveData();
  },
  methods: {
    saveData() {
      // if (this.useNext) return;
      const courtFees = this.calculateCourtFees(this.currentCase);
      this.$store.dispatch("eviction/updateCase", {
        caseData: {
          legalFees: courtFees,
        },
        // lastStep: "Summary of Suit Amount",
        status: "suitSummary",
        logMessage: "SuitAmountSummary.vue:299",
      });
    },
    next() {
      if (this.isPastDueError) return;
      // this.saveData();
      // this.useNext = true;
      this.$router.push({ name: "vc-filing" });
    },
    openClose(name) {
      if (this.open === name) {
        this.open = "";
      } else {
        this.open = name;
      }
    },
    groupLateCharges() {
      const groupedItems = [];

      // Group the price items by type
      this.lateCharges.map((item) => {
        const existItem = groupedItems.find(
          (group) => group.type === item.type
        );
        if (existItem) {
          existItem.amount =
            parseFloat(existItem.amount) + parseFloat(item.amount);
        } else {
          groupedItems.push(item);
        }
        return item;
      });
      return groupedItems;
    },
    calculateLegalTotal() {
      // const propertyCity = this.$store.getters.allCitiesAndSubs.find(city => city.name == this.property.city);
      // return propertyCity ? propertyCity.mileagePrice : 0;
      return this.calculateTotal(this.currentCase.legalFees);
    },
    navigateToPastDue() {
      this.$router.push({ name: "vc-past-due-rent" });
    },
  },
};
</script>

<style>
.suit-amount-summary-item.elevated-bar:hover {
  filter: none !important;
}
</style>
