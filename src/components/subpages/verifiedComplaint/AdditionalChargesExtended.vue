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

    <div style="width: 90%" class="pt-10 pb-4 mx-auto text-left">
      <div class="custom-title pt-8 pb-4">Add Additional fees & Charges</div>
      <div class="pb-4">
        Add all applicable fees that are currently due.
        <!-- Should you need more
        information on what types of newFees and charges may be allowable, visit
        our Legal Encyclopedia. -->
      </div>

      <div class="d-flex align-center mt-3 mb-3">
        <div
          v-if="checklist.newLateCharges"
          class="ml-1 info--text text-uppercase"
        >
          <v-btn
            v-if="checklist.newLateCharges"
            class="btn--plain"
            color="accent"
            icon
            tile
            @click="lateChargesOpen = true"
          >
            <v-icon style="font-size: 28px"> mdi-plus-circle-outline </v-icon>
          </v-btn>
          Add {{ newLateCharges.length > 0 ? "additional" : "" }}
          <span v-if="newLateCharges.length > 0"
            ><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span
          >LATE CHARGES
        </div>

        <div
          v-if="checklist.newUtilities"
          class="ml-3 info--text text-uppercase"
        >
          <v-btn
            v-if="checklist.newUtilities"
            class="btn--plain"
            color="accent"
            icon
            tile
            @click="utilitiesOpen = true"
          >
            <v-icon style="font-size: 28px"> mdi-plus-circle-outline </v-icon>
          </v-btn>
          Add {{ newUtilities.length > 0 ? "additional" : "" }}
          <span v-if="newUtilities.length > 0"
            ><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span
          >UTILITIES
        </div>

        <div v-if="checklist.newFees" class="ml-3 info--text text-uppercase">
          <v-btn
            v-if="checklist.newFees"
            class="btn--plain"
            color="accent"
            icon
            tile
            @click="feesOpen = true"
          >
            <v-icon style="font-size: 28px"> mdi-plus-circle-outline </v-icon>
          </v-btn>
          Add {{ newFees.length > 0 ? "additional" : "" }}
          <span v-if="newFees.length > 0"
            ><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span
          >Fees
        </div>
      </div>

      <div style="height: 420px; overflow: auto">
        <vue-scroll :ops="ops">
          <!-- <div> -->
          <v-data-table
            :headers="headers"
            :items="charges"
            class="elevation-1"
            hide-default-footer
            disable-pagination
            disable-sort
          >
            <template v-slot:item.amountDue="props">
              <div v-if="props.item.details == 'Rent'">
                {{ convertToCurrency(props.item.amountDue) }}
              </div>
              <v-edit-dialog
                v-if="props.item.details != 'Rent'"
                :return-value.sync="props.item.amountDue"
                large
                persistent
                @save="saveAmount(props.item)"
              >
                <div>
                  {{ convertToCurrency(props.item.amountDue) }}
                  <v-icon size="14" color="#4dccc4" class="ml-1">
                    $pencil
                  </v-icon>
                </div>
                <template v-slot:input>
                  <div class="mt-4">Change amount</div>
                  <v-text-field
                    v-model="props.item.amountDue"
                    label="Edit"
                    single-line
                    autofocus
                    type="number"
                  ></v-text-field>
                </template>
              </v-edit-dialog>
            </template>
            <template v-slot:item.totalBalance="props">
              {{ convertToCurrency(props.item.totalBalance) }}
            </template>
            <template v-slot:top>
              <v-dialog v-model="dialogDelete" max-width="500px">
                <v-card>
                  <v-card-title class="text-h5"
                    >Are you sure you want to delete this item?</v-card-title
                  >
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="closeDelete"
                      >Cancel</v-btn
                    >
                    <v-btn color="blue darken-1" text @click="deleteItemConfirm"
                      >OK</v-btn
                    >
                    <v-spacer></v-spacer>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </template>
            <template v-slot:item.actions="{ item }">
              <v-icon
                v-if="item.details != 'Rent'"
                small
                @click="deleteItem(item)"
              >
                mdi-delete
              </v-icon>
            </template>
          </v-data-table>
        </vue-scroll>
      </div>

      <div v-if="checklist.newLateCharges">
        <v-dialog
          v-model="lateChargesOpen"
          value="''"
          max-width="900"
          persistent
        >
          <LateChargesDialog
            @close:dialog="lateChargesOpen = false"
            @add="addLateCharge"
            dialogHeight="700px"
          />
        </v-dialog>
      </div>

      <div v-if="checklist.newUtilities">
        <v-dialog v-model="utilitiesOpen" persistent value="''" max-width="900">
          <UtilitiesAndFeesDialog
            title="Utilities"
            :types="utilityTypes"
            @close:dialog="utilitiesOpen = false"
            @add="addUtility"
            dialogHeight="800px"
          />
        </v-dialog>
      </div>

      <div v-if="checklist.newFees">
        <v-dialog v-model="feesOpen" persistent value="''" max-width="900">
          <UtilitiesAndFeesDialog
            title="Fees"
            :types="feeTypes"
            @close:dialog="feesOpen = false"
            @add="addFee"
            dialogHeight="800px"
          />
        </v-dialog>
      </div>

      <h2 class="text-right mt-3">
        Total due: {{ convertToCurrency(suitAmount) }}
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
        @click="$router.push({ name: 'vc-additional-charges' })"
      >
        go back
      </v-btn>
      <v-btn
        rounded
        color="accent_light"
        class="px-8 mb-2 mt-4 white--text capital--btn"
        depressed
        @click="next"
      >
        continue
      </v-btn>
    </v-card-actions>
  </div>
</template>

<script>
// import DateRange from "@/components/DateRange";
// import Checkbox from "@/components/Checkbox";
import LateChargesDialog from "@/components/dialogs/lateChargesDialog.vue";
// import OtherFeesDialog from "@/components/dialogs/FeesDialog.vue";
import UtilitiesAndFeesDialog from "@/components/dialogs/UtilitiesAndFeesDialog.vue";
// import EditableField from "@/components/EditableField.vue";

import { mapGetters } from "vuex";

export default {
  name: "AdditionalCharges",
  components: {
    // VDaterange
    // DateRange,
    // Checkbox,
    LateChargesDialog,
    // OtherFeesDialog,
    // EditableField,
    UtilitiesAndFeesDialog,
  },
  props: {},
  data() {
    return {
      headers: [
        {
          text: "Period",
          align: "start",
          value: "period",
        },
        { text: "Details", value: "details" },
        { text: "Amount Due", value: "amountDue" },
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
      dialogDelete: false,
      editedIndex: -1,
      editedItem: {
        period: "",
        details: "",
        amountDue: 0,
        totalBalance: 0,
      },
      defaultItem: {
        period: "",
        details: "",
        amountDue: 0,
        totalBalance: 0,
      },
      additionalCharges: "",
      lateChargesOpen: false,
      utilitiesOpen: false,
      feesOpen: false,
      checklist: {
        newLateCharges: true,
        newUtilities: true,
        newFees: true,
      },
      utilityTypes: [
        "Water",
        "Sewer",
        "Water & Sewer",
        "Gas",
        "Electricity",
        "Cable",
        "Garbage",
        "Parking",
      ],
      feeTypes: [
        "Bounced/Returned Check",
        "Certified letter reminder of late rent",
        "Municipal Violations",
        "Parking Fee",
        "Unauthorized Parking Fee",
        "Pet Fees",
        "Unauthorized Pet Fee",
        "Garbage Fee",
        "Storage Fees",
        "Garage Rent",
        "Pool Use Fee",
        "Gym Use Fee",
        "Home Owner’s Associations Fee",
        "Administrative fees",
        "Service charges",
        "Property Management Fees",
        "Other",
      ],
      newLateCharges: [],
      newUtilities: [],
      newFees: [],
      useNext: false,
    };
  },

  computed: {
    ...mapGetters({
      case: "eviction/currentCase",
    }),
    valid() {
      return this.additionalCharges;
    },

    suitAmount() {
      return this.charges.reduce((acc, cur) => {
        return acc + parseFloat(cur.amountDue);
      }, 0);
    },
  },

  watch: {
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },

  activated() {
    window.scrollTo(0, 0);
    this.useNext = false;

    if (this.case.section8) this.checklist.newLateCharges = false;
    else this.checklist.newLateCharges = true;
    // this.checklist.other = false;

    this.newLateCharges = this.case.lateCharges || [];
    this.newUtilities = this.case.utilities || [];
    this.newFees = this.case.fees || [];

    /* add data to table - START */
    this.charges = [];
    let totalBalance = 0;

    for (const element of this.case.pastDueRent.filter(
      (value) => value.selected
    )) {
      const chargeItem = {
        period: element.timePeriodDisplay,
        timePeriod: element.timePeriod,
      };
      totalBalance += parseFloat(element.amount);
      chargeItem.details = "Rent";
      chargeItem.amountDue = parseFloat(element.amount).toFixed(2);
      chargeItem.totalBalance = totalBalance.toFixed(2);
      this.charges.push(chargeItem);
    }

    if (this.checklist.newLateCharges) {
      this.addTableItem(this.newLateCharges, 1);
    }
    this.addTableItem(this.newUtilities, 2);
    this.addTableItem(this.newFees, 3);
    /* add data to table - END */
  },
  deactivated() {
    this.saveData();
  },

  methods: {
    saveAmount(item) {
      const feeType = item.feeType;
      const index = item.indexInDB;
      switch (feeType) {
        case 1:
          this.newLateCharges[index].amount = item.amountDue;
          break;
        case 2:
          this.newUtilities[index].amount = item.amountDue;
          break;
        case 3:
          this.newFees[index].amount = item.amountDue;
          break;
      }
      const chargeIndex = this.charges.indexOf(item);
      const tempArray = this.charges.slice();
      for (let i = chargeIndex; i < tempArray.length; i++) {
        tempArray[i].totalBalance = (
          parseFloat(tempArray[i - 1].totalBalance) +
          parseFloat(tempArray[i].amountDue)
        ).toFixed(2);
      }
      this.charges = tempArray;
    },
    deleteItem(item) {
      this.editedIndex = this.charges.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },
    deleteItemConfirm() {
      const feeType = this.charges[this.editedIndex].feeType;
      const index = this.charges[this.editedIndex].indexInDB;
      const otherItemToDelete = this.charges.filter(item => item.period == this.charges[index].period && item.details == this.charges[index].details);
      switch (feeType) {
        case 1:
          this.newLateCharges.splice(index, 1);
          if (otherItemToDelete.length) {
            this.newLateCharges.splice(this.charges.indexOf(otherItemToDelete[0]), 1);
          }
          break;
        case 2:
          this.newUtilities.splice(index, 1);
          if (otherItemToDelete.length) {
            this.newUtilities.splice(this.charges.indexOf(otherItemToDelete[0]), 1);
          }
          break;
        case 3:
          this.newFees.splice(index, 1);
          if (otherItemToDelete.length) {
            this.newFees.splice(this.charges.indexOf(otherItemToDelete[0]), 1);
          }
          break;
      }
      const backupAmount = this.charges[this.editedIndex].amountDue;
      this.charges.splice(this.editedIndex, 1);
      const tempArray = this.charges.slice();
      for (let i = this.editedIndex; i < tempArray.length; i++) {
        tempArray[i].totalBalance = (
          parseFloat(tempArray[i].totalBalance) - parseFloat(backupAmount)
        ).toFixed(2);
      }
      this.charges = tempArray;
      this.closeDelete();
    },
    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    getDateCountByMonth(startDate, endDate) {
      const dates = [];
      let currentDate = startDate;
      const addDays = function (days) {
        const date = new Date(this.valueOf());
        date.setDate(date.getDate() + days);
        return date;
      };
      let dateCount = 0;
      let tmpMonth = "";
      let itemMonth = {};
      while (currentDate <= endDate) {
        tmpMonth = currentDate.getMonth();
        currentDate = addDays.call(currentDate, 1);
        dateCount++;
        if (currentDate.getMonth() != tmpMonth) {
          itemMonth = {};
          itemMonth.month = tmpMonth + 1;
          itemMonth.dateCount = dateCount - 1;
          if (itemMonth.dateCount != 0)
            dates.push(itemMonth);
          dateCount = 1;
        }
      }
      tmpMonth = currentDate.getMonth();
      itemMonth = {};
      itemMonth.month = tmpMonth + 1;
      itemMonth.dateCount = dateCount;
      dates.push(itemMonth);
      return dates;
    },
    addTableItem(items, feeType) {
      let monthArray;
      items.map((item, idx) => {
        // if late charges, utilities or fees were added
        monthArray = []; // ex: [{month: 5, dateCount: 7}, {month: 6, dateCount: 8}]
        if (Array.isArray(item.timePeriod))
          monthArray = this.getDateCountByMonth(
            new Date(item.timePeriod[0]),
            new Date(item.timePeriod[1])
          );
        else {
          monthArray[0] = {};
          monthArray[0].month = parseInt(item.timePeriod.split("-")[1]);
          monthArray[0].dateCount = -1;
        }

        if (!Array.isArray(item.timePeriod))
          switch (feeType) {
            case 1:
              if (this.newLateCharges.indexOf(item) == -1)
                this.newLateCharges.push(item);
              break;
            case 2:
              if (this.newUtilities.indexOf(item) == -1)
                this.newUtilities.push(item);
              break; // = [...this.newUtilities, ...itemToPush]; break;
            case 3:
              if (this.newFees.indexOf(item) == -1) 
                this.newFees.push(item);
              break; // = [...this.newFees, ...itemToPush]; break;
            default:
              break;
          }
        if (monthArray.length == 1) {
          // if selected date period month count is 1
          const monthlyCharges = this.charges.filter(
            (charge) =>
              parseInt(charge.timePeriod.split("-")[0]) == monthArray[0].month
          );
          if (monthlyCharges.length) {
            if (Array.isArray(item.timePeriod)) {
              item.timePeriod =
                item.timePeriod[0].split("-")[0] +
                "-" +
                item.timePeriod[0].split("-")[1];
              item.timePeriodDisplay = monthlyCharges[0].period;
              switch (feeType) {
                case 1:
                  if (this.newLateCharges.indexOf(item) == -1)
                    this.newLateCharges.push(item);
                  break;
                case 2:
                  if (this.newUtilities.indexOf(item) == -1)
                    this.newUtilities.push(item);
                  break; // = [...this.newUtilities, ...itemToPush]; break;
                case 3:
                  if (this.newFees.indexOf(item) == -1)
                    this.newFees.push(item);
                  break; // = [...this.newFees, ...itemToPush]; break;
                default:
                  break;
              }
            }
            const isItemExist = monthlyCharges.filter(
              (charge) => charge.details == item.type
            );
            if (isItemExist.length) {
              const index = this.charges.indexOf(isItemExist[0]);
              const tempArray = this.charges.slice();
              tempArray[index].amountDue = (
                parseFloat(tempArray[index].amountDue) +
                parseFloat(item.amount)
              ).toFixed(2);
              for (let i = index; i < tempArray.length; i++) {
                tempArray[i].totalBalance = (
                  parseFloat(tempArray[i].totalBalance) +
                  parseFloat(item.amount)
                ).toFixed(2);
              }
              this.charges = tempArray;
            } else {
              const chargeItem = {
                feeType: feeType,
                indexInDB: idx,
                timePeriod: monthlyCharges[0].timePeriod,
                period: monthlyCharges[0].period,
                details: item.type,
                amountDue: parseFloat(item.amount).toFixed(2),
                totalBalance: 0,
              };
              const insertAt =
                this.charges.indexOf(
                  monthlyCharges[monthlyCharges.length - 1]
                ) + 1;
              chargeItem.totalBalance = (
                parseFloat(this.charges[insertAt - 1].totalBalance) +
                parseFloat(item.amount)
              ).toFixed(2);
              this.charges.splice(insertAt, 0, chargeItem);
              const tempArray = this.charges.slice();
              for (let i = insertAt + 1; i < tempArray.length; i++) {
                tempArray[i].totalBalance = (
                  parseFloat(tempArray[i].totalBalance) +
                  parseFloat(item.amount)
                ).toFixed(2);
              }
              this.charges = tempArray;
            }
          }
        } else {
          // if selected date period month count is more than 1
          let totalDateCount = 0;
          monthArray.map((month) => {
            totalDateCount += month.dateCount;
          });
          let itemToPush = {};
          monthArray.map((monthItem, mIndex) => {
            const monthlyCharges = this.charges.filter(
              (charge) =>
                parseInt(charge.timePeriod.split("-")[0]) == monthItem.month
            );
            const amount =
              (item.amount * monthItem.dateCount) / totalDateCount;
            itemToPush = { ...item };
            itemToPush.timePeriod =
              item.timePeriod[0].split("-")[0] +
              "-" +
              (parseInt(item.timePeriod[0].split("-")[1]) <= 9 ? "0" : "") +
              (parseInt(item.timePeriod[0].split("-")[1]) + parseInt(mIndex));
            itemToPush.amount = amount;
            itemToPush.month = monthItem.month;
            itemToPush.timePeriodDisplay = monthlyCharges[0].period;
            switch (feeType) {
              case 1:
                if (this.newLateCharges.indexOf(itemToPush) == -1)
                  this.newLateCharges.push(itemToPush);
                break;
              case 2:
                if (this.newUtilities.indexOf(itemToPush) == -1)
                  this.newUtilities.push(itemToPush);
                break; // = [...this.newUtilities, ...itemToPush]; break;
              case 3:
                if (this.newFees.indexOf(itemToPush) == -1)
                  this.newFees.push(itemToPush);
                break; // = [...this.newFees, ...itemToPush]; break;
              default:
                break;
            }
            const isItemExist = monthlyCharges.filter(
              (charge) => charge.details == item.type
            );
            if (isItemExist.length) {
              const index = this.charges.indexOf(isItemExist[0]);
              const tempArray = this.charges.slice();
              tempArray[index].amountDue = (
                parseFloat(tempArray[index].amountDue) + parseFloat(amount)
              ).toFixed(2);
              for (let i = index; i < tempArray.length; i++) {
                tempArray[i].totalBalance = (
                  parseFloat(tempArray[i].totalBalance) + parseFloat(amount)
                ).toFixed(2);
              }
              this.charges = tempArray;
            } else {
              const chargeItem = {
                feeType: feeType,
                indexInDB: idx,
                timePeriod: monthlyCharges[0].timePeriod,
                period: monthlyCharges[0].period,
                details: item.type,
                amountDue: parseFloat(amount).toFixed(2),
                totalBalance: 0,
              };
              const insertAt =
                this.charges.indexOf(
                  monthlyCharges[monthlyCharges.length - 1]
                ) + 1;
              chargeItem.totalBalance = (
                parseFloat(this.charges[insertAt - 1].totalBalance) +
                parseFloat(amount)
              ).toFixed(2);
              this.charges.splice(insertAt, 0, chargeItem);
              const tempArray = this.charges.slice();
              for (let i = insertAt + 1; i < tempArray.length; i++) {
                tempArray[i].totalBalance = (
                  parseFloat(tempArray[i].totalBalance) + parseFloat(amount)
                ).toFixed(2);
              }
              this.charges = tempArray;
            }
          });
        }
      });
    },
    addLateCharge(fee) {
      this.lateChargesOpen = false;
      this.addTableItem(fee, 1);
    },
    addUtility(fee) {
      this.utilitiesOpen = false;
      this.addTableItem(fee, 2);
    },
    addFee(fee) {
      this.feesOpen = false;
      this.addTableItem(fee, 3);
    },
    updateDates(dates, row) {
      row.timePeriod = dates;
      row.timePeriodDisplay = this.formatDates(dates);
    },
    formatDates(dates) {
      if (Array.isArray(dates)) {
        const [year1, month1, day1] = dates[0].split("-");
        const [year2, month2, day2] = dates[1].split("-");
        return `${month1}/${day1}/${year1} - ${month2}/${day2}/${year2}`;
      }
      const [year1, month1, day1] = dates.split("-");
      return `${month1}/${day1}/${year1}`;
    },

    saveData() {
      if (this.useNext) return;
      this.$store.dispatch("eviction/updateCase", {
        caseData: {
          lateCharges: this.newLateCharges,
          utilities: this.newUtilities,
          fees: this.newFees,
        },
        status: this.case.section8 ? "confirmation" : "legalFees",
      });
    },
    next() {
      this.saveData();
      this.useNext = true;
      this.$router.push({
        name: this.case.section8 ? "vc-confirmation" : "vc-legal-fees",
      });
    },
  },
};
</script>

<style scoped>
.text-uppercase {
  text-transform: uppercase;
}
.__vuescroll >>> .__panel {
  overscroll-behavior: contain;
}
</style>
