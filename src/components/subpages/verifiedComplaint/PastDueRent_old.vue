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
      <div class="custom-title pt-8 pb-4">Past Due Rent</div>
      <div class="pb-12">
        Select all the periods in which the tenant has failed to pay rent, as
        agreed in the lease. If you need to make changes, you may edit the
        amount due.
      </div>

      <!-- <div style="height: 420px" v-scroll.self="addConsecutiveRentDue"> -->
      <div style="height: 420px">
        <vue-scroll :ops="ops">
          <v-list
            style="background-color: transparent"
            v-for="(period, index) in rentsDue"
            :key="period.period"
          >
            <div
              class="rent-item"
              :class="[
                period.selected
                  ? 'selection-border-selected'
                  : 'selection-border',
              ]"
            >
              <div class="d-flex align-center h-full">
                <div
                  :class="[period.selected ? 'secondary--text' : 'info--text']"
                  style="font-size: 0.85rem"
                >
                  {{ period.timePeriodDisplay }}
                  <div class="d-flex">
                    <div style="font-size: 26px; font-weight: 500">$</div>
                    <EditableField
                      v-model="period.amount"
                      @save="updatePastDueRentItem({ period, index }, $event)"
                      valueStyles="font-size:26px; font-weight: 500;"
                      inputStyles="width:90px;font-size:26px;"
                    />
                  </div>
                  <div
                    v-if="rentAmount && period.amount > rentAmount"
                    class="secondary--text"
                  >
                    This amount is more than the stated rental amount.
                  </div>
                </div>
                <Checkbox
                  v-model="period.selected"
                  @input="updatePastDueRentItem({ period, index })"
                  size="29px"
                  style="margin-left: auto"
                />
              </div>
            </div>
            <!-- <v-list-item
              :class="[
                period.selected
                  ? 'selection-border-selected'
                  : 'selection-border',
              ]"
              class="py-1 mb-2"
              style="height: 105px"
            >
              <v-container class="px-10">
                <v-row align="center">
                  <v-col
                    :class="[
                      period.selected ? 'secondary--text' : 'info--text',
                    ]"
                  >
                    <div class="secondary--text" style="font-size: 0.85rem">
                      {{ period.timePeriodDisplay }}
                    </div>
                    <div class="d-flex" style="justify-content: space-between">
                      <div class="font-weight-medium" style="padding-top: 2px">
                        $
                      </div>
                      <EditableField
                        v-model="period.amount"
                        style="width: 430px"
                        @save="updatePastDueRentItem({ period, index }, $event)"
                      />
                      <Checkbox
                        v-model="period.selected"
                        @input="updatePastDueRentItem({ period, index })"
                      />
                    </div>
                    <div
                      v-if="rentAmount && period.amount > rentAmount"
                      class="secondary--text"
                    >
                      This amount is more than the stated rental amount.
                    </div>
                  </v-col>
                </v-row>
              </v-container>
            </v-list-item> -->
          </v-list>
        </vue-scroll>
      </div>
      <!-- <div v-if="noPropertyError" class="error-message mt-4">Select a property.</div> -->
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
        @click="$router.push({ name: 'vc-lease-details' })"
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
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Checkbox from "../../Checkbox.vue";
import EditableField from "@/components/EditableField";
import moment from "moment";
// import { deepEqual } from '@/utils';

export default {
  name: "PastDueRent",
  components: {
    Checkbox,
    EditableField,
  },
  props: {
    resetDataFromLeaseDetails: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      rentsDue: [],
      // resetData: false,
      endLeaseCounter: this.case ? this.case.leaseStartDate : "",
      useNext: false,
      months: [
        {
          text: "January",
          value: "01",
        },
        {
          text: "February",
          value: "02",
        },
        {
          text: "March",
          value: "03",
        },
        {
          text: "April",
          value: "04",
        },
        {
          text: "May",
          value: "05",
        },
        {
          text: "June",
          value: "06",
        },
        {
          text: "July",
          value: "07",
        },
        {
          text: "August",
          value: "08",
        },
        {
          text: "September",
          value: "09",
        },
        {
          text: "October",
          value: "10",
        },
        {
          text: "November",
          value: "11",
        },
        {
          text: "December",
          value: "12",
        },
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
          minSize: 0.1,
        },
      },
    };
  },
  computed: {
    ...mapGetters({
      currentProperty: "property/currentProperty",
      case: "eviction/currentCase",
    }),
    valid() {
      return this.rentsDue.filter((r) => r.selected).length > 0;
    },
    lastPeriodEnd() {
      if (this.rentsDue.length === 0) {
        if (
          this.case.rentCycle === "Monthly" ||
          this.case.rentCycle === "Semi-monthly"
        ) {
          const today = moment().format("MM-D-YYYY");
          const todayAry = today.split("-");

          return `${todayAry[0]}-${this.case.rentDueBy}-${todayAry[2]}`;
        } else {
          return this.$dayjs();
        }
      }
      const lastPeriod = this.rentsDue[this.rentsDue.length - 1].timePeriod;

      if (Array.isArray(lastPeriod)) {
        return lastPeriod[1];
      }
      return lastPeriod;
    },
    rentAmount() {
      if (this.case.section8) {
        return this.case.section8TenantPortion;
      }
      return this.case.rentAmount;
    },
  },
  // watch: {
  //   case: {
  //     async handler(newVal) {
  //       if (newVal) {
  //         setTimeout(async () => {
  //           if (localStorage.getItem("resetPastDueRentData") === "1") {
  //             this.resetData = true;
  //           }

  //           await this.generatePeriods();
  //           this.resetData = false;
  //           localStorage.removeItem("resetPastDueRentData");
  //         }, 100);
  //       }
  //     },
  //   },
  // },

  async activated() {
    window.scrollTo(0, 0);
    this.useNext = false;

    // setTimeout(async () => {
    //   if (localStorage.getItem("resetPastDueRentData") === "1") {
    //     this.resetData = true;
    //   }

    //   await this.generatePeriods();
    //   this.resetData = false;
    //   localStorage.removeItem("resetPastDueRentData");
    // }, 100);
    this.rentsDue = this.case.pastDueRent;
    if (localStorage.getItem("resetPastDueRentData") === "1") {
      await this.generatePeriods();
      localStorage.removeItem("resetPastDueRentData");
    }
  },
  deactivated() {
    this.saveData();
  },
  methods: {
    async updatePastDueRentItem({ period, index }, event) {
      if (typeof event !== "undefined") {
        period.amount = parseInt(event);
      }

      this.$set(this.rentsDue, index, period);

      await this.$store.dispatch("eviction/updateCase", {
        caseData: {
          pastDueRent: this.rentsDue,
        },
        dontMutate: true,
        // submitted: false,
        // lastStep: "Past Due Rent",
        status: "pastDueRent",
        logMessage: "PastDueRent.vue:274",
      });
    },
    async generatePeriods() {
      this.rentsDue = [];

      this.endLeaseCounter = this.case.leaseStartDate || "";
      let leasePeriodStart = "";

      const today = moment().format("MM-D-YYYY");
      const todayDay = today.split("-")[1];

      const res = [];
      const periods = [];

      if (typeof this.case.rentDueBy === "string") {
        if (todayDay < Number(this.case.rentDueBy)) this.rentsDue.shift();
      }

      if (this.case.rentCycle === "Weekly") {
        const dayINeed = Number(this.case.rentDueBy); // 4 for Thursday
        const startDate = moment(this.case.leaseStartDate).isoWeekday();

        // console.log(startDate, dayINeed);

        let startingDay;
        // if we haven't yet passed the day of the week that I need:
        if (startDate <= dayINeed) {
          // then just give me this week's instance of that day
          startingDay = moment(this.case.leaseStartDate).isoWeekday(dayINeed);
        } else {
          // otherwise, give me *next week's* instance of that same day
          startingDay = moment(this.case.leaseStartDate)
            .add(1, "weeks")
            .isoWeekday(dayINeed);
        }

        while (
          startingDay.isBefore(moment()) &&
          moment(startingDay).add(1, "weeks").isBefore(moment())
        ) {
          const startDay = moment(startingDay).format("MMM DD, YYYY");
          const endDay = startingDay.add(6, "days").format("MMM DD, YYYY");
          const lastStartDay = moment(endDay)
            .add(1, "day")
            .format("MMM DD, YYYY");

          periods.push({ startDay, endDay, lastStartDay });
        }

        // eslint-disable-next-line
        for (let [periodIndex, periodItem] of periods.entries()) {
          const periodData =
            periods[periodIndex] && typeof periods[periodIndex] !== "undefined"
              ? periods[periodIndex + 1]
              : periodItem;
          if (periodData) {
            periodData.startDay = periodItem.lastStartDay;
            periodData.endDay = moment(periodData.startDay)
              .add(6, "days")
              .format("MMM DD, YYYY");
            periodData.lastStartDay = moment(periodData.endDay)
              .add(1, "days")
              .format("MMM DD, YYYY");
          }

          const startDay = moment(periodItem.startDay).isBefore(moment());
          const endDay = moment(periodItem.endDay).isBefore(moment());

          if (startDay && endDay) {
            const period = `${periodItem.startDay} - ${periodItem.endDay}`;

            res.push({
              timePeriod: period,
              timePeriodDisplay: period,
              amount: this.rentAmount,
              selected: false,
            });
          }
        }

        this.rentsDue = res.reverse();
        this.saveCalculationData();
        return;
      } else if (this.case.rentCycle === "Semi-monthly") {
        const dates = this.case.rentDueBy;
        // console.log(dates);
        let startingMonth = moment(this.case.leaseStartDate).format("YYYY-MM");

        while (moment(startingMonth) <= moment()) {
          const startingDay1 = startingMonth + "-" + dates[0];
          const startingDay2 = startingMonth + "-" + dates[1];

          const nextStartingMonth = moment(startingMonth)
            .add(1, "months")
            .format("YYYY-MM");

          const nextStartingDay1 = nextStartingMonth + "-" + dates[0];

          let period =
            moment(startingDay1).format("MMM DD, YYYY") +
            " - " +
            moment(startingDay2).subtract(1, "days").format("MMM DD, YYYY");

          if (
            !moment(startingDay1).isBefore(this.case.leaseStartDate) &&
            moment(startingDay2).isBefore(moment())
          ) {
            res.push({
              timePeriod: period,
              timePeriodDisplay: period,
              amount: this.rentAmount,
              selected: false,
            });
          }

          period =
            moment(startingDay2).format("MMM DD, YYYY") +
            " - " +
            moment(nextStartingDay1).subtract(1, "days").format("MMM DD, YYYY");

          if (
            !moment(startingDay2).isBefore(this.case.leaseStartDate) &&
            moment(nextStartingDay1).isBefore(moment())
          ) {
            res.push({
              timePeriod: period,
              timePeriodDisplay: period,
              amount: this.rentAmount,
              selected: false,
            });
          }

          startingMonth = nextStartingMonth;
        }

        this.rentsDue = res.reverse();
        this.saveCalculationData();
        return;
      }

      if (this.case.rentCycle === "Monthly") {
        const dateAry = [
          moment(this.case.leaseStartDate).year(),
          moment(this.case.leaseStartDate).month() + 1,
          Number(this.case.rentDueBy),
        ];
        leasePeriodStart = dateAry.join("-");
        // } else if (this.rentCycle === "Weekly") {
      } else if (this.case.rentCycle === "Semi-monthly") {
        const dateAry = [
          moment(this.case.leaseStartDate).year(),
          moment(this.case.leaseStartDate).month() + 1,
          this.case.rentDueBy[0],
        ];
        leasePeriodStart = dateAry.join("-");
      }

      while (
        this.case.rentCycle === "Weekly"
          ? moment() >= moment(this.endLeaseCounter)
          : moment(this.lastPeriodEnd).isAfter(this.case.leaseStartDate)
      ) {
        this.addConsecutiveRentDue();
      }

      // console.log(leasePeriodStart, "leasePeriodStart");
      // console.log("this.case.leaseStartDate :>> ", this.case.leaseStartDate);
      if (moment(this.case.leaseStartDate).isAfter(leasePeriodStart)) {
        this.rentsDue.pop();
      }

      this.saveCalculationData();
    },
    addConsecutiveRentDue() {
      // this.rentsDue.push({
      //   timePeriod: this.calculateConsecutiveTimePeriod(),
      //   timePeriodDisplay: this.formatTimePeriod(
      //     this.calculateConsecutiveTimePeriod()
      //   ),
      //   amount: this.rentAmount,
      //   selected: false,
      // });
      const timePeriod = this.calculateConsecutiveTimePeriod();
      this.rentsDue.push({
        timePeriod,
        timePeriodDisplay: this.formatTimePeriod(timePeriod),
        amount: this.rentAmount,
        selected: false,
      });
    },
    calculateConsecutiveTimePeriod() {
      let nextDay, lastDay, lastStartDate, today;
      // const lastPeriod = moment(this.rentsDue[this.rentsDue.length-1].timePeriod)

      switch (this.case.rentCycle) {
        case "Monthly":
          if (this.rentsDue.length === 0) {
            // return this.$dayjs().format("MMMM YYYY");
            return this.$dayjs().format("MM-DD-YYYY");
          }
          return (
            this.$dayjs(this.rentsDue[this.rentsDue.length - 1].timePeriod)
              .subtract(1, "months")
              // .format("MMMM YYYY");
              .format("MM-DD-YYYY")
          );
        // case "Weekly":
        //   if (this.rentsDue.length === 0) {
        //     nextDay = this.getNextDayOfTheWeek(this.case.rentDueBy);
        //   } else {
        //     nextDay = this.$dayjs(
        //       this.rentsDue[this.rentsDue.length - 1].timePeriod[1]
        //     ).add(1, "days");
        //   }
        //   this.endLeaseCounter = nextDay.add(6, "days").format("MMMM D, YYYY");

        //   return [
        //     nextDay.format("MMMM D, YYYY"),
        //     nextDay.add(6, "days").format("MMMM D, YYYY"),
        //   ];
        case "Semi-monthly":
          today = this.$dayjs();

          if (this.rentsDue.length === 0) {
            if (today.date() < parseFloat(this.case.rentDueBy[0])) {
              today = today.add(1, "months");
              lastStartDate = this.$dayjs([
                today.year(),
                today.month(),
                parseFloat(this.case.rentDueBy[1]),
              ]);
            } else if (today.date() < parseFloat(this.case.rentDueBy[1])) {
              today = today.add(1, "months");
              lastStartDate = this.$dayjs([
                today.year(),
                today.month(),
                parseFloat(this.case.rentDueBy[1]),
              ]);
            } else if (today.date() > parseFloat(this.case.rentDueBy[1])) {
              today = today.add(2, "months");
              lastStartDate = this.$dayjs([
                today.year(),
                today.month(),
                parseFloat(this.case.rentDueBy[0]),
              ]);
            }
          } else {
            lastStartDate = this.$dayjs(
              this.rentsDue[this.rentsDue.length - 1].timePeriod[0]
            );
          }

          switch (lastStartDate.date()) {
            case parseFloat(this.case.rentDueBy[0]):
              nextDay = lastStartDate
                .subtract(1, "months")
                .date(parseFloat(this.case.rentDueBy[1]))
                .format("MMMM D, YYYY");
              lastDay = lastStartDate
                .subtract(1, "days")
                .format("MMMM D, YYYY");
              break;
            case parseFloat(this.case.rentDueBy[1]):
              nextDay = lastStartDate
                .date(parseFloat(this.case.rentDueBy[0]))
                .format("MMMM D, YYYY");
              lastDay = lastStartDate
                .subtract(1, "days")
                .format("MMMM D, YYYY");
              break;
            default:
              nextDay = "";
              lastDay = "";
              break;
          }
          return [nextDay, lastDay];
        default:
          return "";
      }
    },
    getNextDayOfTheWeek(
      dayName,
      excludeToday = false,
      refDate = this.$dayjs(this.leaseStartDate)
    ) {
      const addedDays =
        +excludeToday +
        ((this.dayToNumber(dayName) + 7 - refDate.day() - +excludeToday) % 7);
      return refDate.add(addedDays, "days");
    },
    dayToNumber(day) {
      switch (day) {
        case "Sunday":
          return 0;
        case "Monday":
          return 1;
        case "Tuesday":
          return 2;
        case "Wednesday":
          return 3;
        case "Thursday":
          return 4;
        case "Friday":
          return 5;
        case "Saturday":
          return 6;
      }
    },
    saveData() {
      // if (this.useNext) return;
      if (!this.valid) return;

      this.$store.dispatch("eviction/updateCase", {
        caseData: {
          pastDueRent: this.rentsDue,
        },
        // lastStep: "Additional Charges",
        status: "pastDueRent",
        logMessage: "PastDueRent.vue:635",
      });
    },
    saveCalculationData() {
      // this.$store.dispatch("eviction/updateCase", {
      //   caseData: {
      //     pastDueRent: this.rentsDue,
      //   },
      //   status: "pastDueRent",
      //   logMessage: "PastDueRent.vue:647",
      // });
      this.saveData();
    },

    next() {
      // this.useNext = true;
      if (!this.valid) return;
      this.$router.push({
        // name: this.case.section8 ? "vc-confirmation" : "vc-additional-charges",
        name: "vc-additional-charges",
      });
    },
    formatTimePeriod(timePeriod) {
      if (this.case.rentCycle === "Monthly") {
        // let firstDay = this.$dayjs(timePeriod).date(parseFloat(this.case.rentDueBy))
        // let lastDay = this.$dayjs(timePeriod).date(parseFloat(this.case.rentDueBy)).add(1, 'months').subtract(1,"days")
        // return `${firstDay.format('MM/DD/YYYY')} - ${lastDay.format('MM/DD/YYYY')}`
        return this.$dayjs(timePeriod).format("MMMM YYYY");
      } else {
        if (!timePeriod[0]) return "";
        const firstDay = this.$dayjs(timePeriod[0]).format("MMMM YYYY");
        const lastDay = this.$dayjs(timePeriod[1]).format("MMMM YYYY");
        // return `${timePeriod[0]} - ${timePeriod[1]}`;
        return `${firstDay} - ${lastDay}`;
      }
    },
    // changeDisplay(row) {
    //   row.timePeriodDisplay = this.formatTimePeriod(row.timePeriod);
    // },
  },
};
</script>

<style scoped>
.rent-item {
  /* background: green; */
  height: 105px;
  padding: 24px;
  padding-left: 50px;
  margin-bottom: 10px;
  margin-right: 20px;
}

.__vuescroll >>> .__panel {
  overscroll-behavior: contain;
}
</style>
