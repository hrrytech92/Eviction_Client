<template>
  <div class="d-flex" style="padding-bottom: 70px">
    <div class="pr-8">
      <i class="icofont-calculator icofont-2x info--text" />
    </div>
    <div>
      <div class="text-left font-weight-medium info--text text-uppercase pb-2">
        Past Due Rent Calculations (old)
      </div>
      <div class="pb-4">
        Due to various moratorium periods during COVID-19, the court may request
        a breakdown of the rent due and owing corresponding to those timeframes.
        Below, we've provided you with the calculations. Keep in mind, the last
        period reflects the current rents due and owing, and may require further
        adjustment as time elapses.
      </div>
      <div class="fee-grid">
        <div class="mr-14">
          <div class="font-weight-bold mb-2">Period Due</div>
          <div>Prior to March 01, 2020</div>
          <div>March 01, 2020 to August 31, 2021</div>
          <div>September 01, 2021 to December 31 2021</div>
          <div>January 01, 2022 to Current Date</div>
          <!-- <div>Without time period</div> -->
        </div>
        <div>
          <div class="font-weight-bold mb-2">Rent Owing</div>
          <!-- <div>{{ convertToCurrency(priorMarch2020.rent) }}</div> -->
          <div>{{ convertToCurrency(priorMarch2020.rent) }}</div>
          <div>{{ convertToCurrency(march2020toAugust2021.rent) }}</div>
          <div>{{ convertToCurrency(september2021toDecember2021.rent) }}</div>
          <div>{{ convertToCurrency(january2022toCurrentDate.rent) }}</div>
          <!-- <div>{{ convertToCurrency(withoutTimePeriod) }}</div> -->
        </div>
        <div>
          <div class="font-weight-bold mb-2">Other Fees</div>
          <div>{{ convertToCurrency(priorMarch2020.otherFee) }}</div>
          <div>{{ convertToCurrency(march2020toAugust2021.otherFee) }}</div>
          <div>
            {{ convertToCurrency(september2021toDecember2021.otherFee) }}
          </div>
          <div>{{ convertToCurrency(january2022toCurrentDate.otherFee) }}</div>
        </div>
        <div>
          <div class="font-weight-bold mb-2">Total Fees</div>
          <div style="font-weight: 600">
            <div>
              {{
                convertToCurrency(priorMarch2020.rent + priorMarch2020.otherFee)
              }}
            </div>
            <div>
              {{
                convertToCurrency(
                  march2020toAugust2021.rent + march2020toAugust2021.otherFee
                )
              }}
            </div>
            <div>
              {{
                convertToCurrency(
                  september2021toDecember2021.rent +
                    september2021toDecember2021.otherFee
                )
              }}
            </div>
            <div>
              {{
                convertToCurrency(
                  january2022toCurrentDate.rent +
                    january2022toCurrentDate.otherFee
                )
              }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import calculateFees from "../mixins/calculate-fees";
import useRequest from "../utils/useRequest";
dayjs.extend(isBetween);

export default {
  name: "OrderDetailsPasdDueRentCalcs",
  data() {
    return {
      priorMarch2020: {},
      march2020toAugust2021: {},
      september2021toDecember2021: {},
      january2022toCurrentDate: {},
      // withoutTimePeriod: 0,
    };
  },
  mixins: [calculateFees],
  computed: {
    caseData() {
      return this.$store.getters["eviction/currentCase"];
    },
  },
  mounted() {
    this.setRentCalculations();
  },

  methods: {
    setRentCalculations() {
      const { pastDueRent, utilities, fees, otherCharges, lateCharges } =
        this.caseData;

      const selectedRents = pastDueRent
        .filter((rent) => rent.selected)
        .map((rent) => ({ ...rent, type: "rent" }));
      // console.log("selectedRents :>> ", selectedRents);

      const allSelectedFees = [
        ...selectedRents,
        ...utilities,
        ...fees,
        ...otherCharges,
        ...lateCharges,
      ].filter((fee) => fee.selected);
      // console.log("allSelectedFees :>> ", allSelectedFees);

      const priorMarch2020Total = { rent: 0, otherFee: 0 };
      const march2020toAugust2021Total = { rent: 0, otherFee: 0 };
      const september2021toDecember2021Total = { rent: 0, otherFee: 0 };
      const january2022toCurrentDateTotal = { rent: 0, otherFee: 0 };
      let withoutTimePeriodTotal = 0;

      allSelectedFees.forEach((fee) => {
        const { timePeriod } = fee;
        const amount = parseFloat(fee.amount);
        if (!timePeriod) return (withoutTimePeriodTotal += amount);
        const monthDate = dayjs(
          typeof timePeriod === "string" ? timePeriod : timePeriod[1]
        );
        const type = fee.type === "rent" ? "rent" : "otherFee";
        if (monthDate.isBefore("2020-03-01")) {
          priorMarch2020Total[type] += amount;
        } else if (monthDate.isBetween("2020-03-01", "2021-08-31")) {
          march2020toAugust2021Total[type] += amount;
        } else if (monthDate.isBetween("2021-09-01", "2021-12-31")) {
          september2021toDecember2021Total[type] += amount;
        } else if (monthDate.isAfter("2021-12-31")) {
          january2022toCurrentDateTotal[type] += amount;
        }
      });

      //*Add court fee to last line
      if (this.case.legalFeesPermitted && !this.caseData.section8) {
        const courtFees = this.calculateCourtFees(this.caseData).reduce(
          (acc, fee) => {
            return (acc += parseFloat(fee.amount));
          },
          0
        );
        // console.log("courtFees :>> ", courtFees);
        january2022toCurrentDateTotal.otherFee += courtFees;
      }

      this.priorMarch2020 = priorMarch2020Total;
      this.march2020toAugust2021 = march2020toAugust2021Total;
      this.september2021toDecember2021 = september2021toDecember2021Total;
      this.january2022toCurrentDate = january2022toCurrentDateTotal;
      this.withoutTimePeriod = withoutTimePeriodTotal;
    },
  },
};
</script>

<style scoped>
.fee-grid {
  display: grid;
  grid-template-columns: 395px 1fr 1fr 1fr;
  gap: 10px;
}
</style>
