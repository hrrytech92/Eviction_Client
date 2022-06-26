<template>
  <StandardDialog
    :title="title"
    cancelBtnText="go back"
    saveBtnText="add"
    :cancelFunction="close"
    :saveFunction="complete"
    contentWidth="70%"
    :customHeight="dialogHeight"
  >
    <div class="utilities-dialog">
      <v-form
        ref="formRange"
        v-model="formValid"
        class="utilities-dialog__form mx-auto text-left"
      >
        <div class="font-weight-medium secondary--text pb-2">Type</div>
        <v-select
          v-model="type"
          rounded
          solo
          flat
          dense
          background-color="#F0F5F6"
          :items="types"
        >
          <v-icon slot="append" medium color="accent">
            mdi-chevron-down
          </v-icon>
        </v-select>
        <div
          v-if="type === 'Other'"
          class="font-weight-medium secondary--text pb-2"
        >
          Specify Other Fee
          <v-text-field
            v-model="other"
            rounded
            solo
            flat
            dense
            background-color="#F0F5F6"
          />
        </div>

        <div class="font-weight-medium secondary--text pb-3">
          Date(s) Incurred
        </div>
        <div class="d-flex align-center justify-start pb-2">
          <div
            v-for="(pickerType, tIndex) in pickerTypes"
            :key="pickerType.label"
            class="d-flex align-center"
          >
            <Checkbox
              v-model="pickerType.selected"
              class="d-flex pr-3"
              @input="datesPickerOptionChecked(pickerType, tIndex)"
            />
            {{ pickerType.label }}
            <v-divider v-if="tIndex !== 1" vertical class="my-2 mx-5" />
          </div>
        </div>

        <v-menu
          v-model="singleDatesIncurred.menu"
          :close-on-content-click="false"
          :nudge-right="40"
          :nudge-top="23"
          transition="scale-transition"
          offset-y
          min-width="290px"
        >
          <template v-slot:activator="{ on }">
            <v-text-field
              v-model="singleDatesIncurred.timePeriodDisplay"
              append-icon="$calendar"
              color="accent"
              readonly
              rounded
              solo
              flat
              dense
              background-color="#F0F5F6"
              class=""
              :placeholder="placeholderText(-1)"
              v-on="on"
              @click:append="singleDatesIncurred.menu = true"
            />
          </template>

          <date-range
            :key="currentPickerType()"
            :max="new Date().toISOString().slice(0, 10)"
            :type="currentPickerType()"
            :multi-picker="false"
            :parent-index="0"
            @update:dates="fillDatesInSingleDatesIncurred"
          />
        </v-menu>

        <div class="font-weight-medium secondary--text pb-2">Amount</div>
        <v-text-field
          v-model="singleDatesIncurred.amount"
          rounded
          type="number"
          solo
          flat
          dense
          background-color="#F0F5F6"
        >
          <div slot="prepend-inner">$</div>
        </v-text-field>

        <div
          v-if="!areThereAnyAdditionalForm"
          class="utilities-dialog__form-add-action d-flex align-center"
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
            {{
              title === "Utilities"
                ? "ADD ADDITIONAL UTILITY"
                : "ADD ADDITIONAL FEE"
            }}
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
      >
        <div v-for="(fee, index) in datesIncurredFees" :key="index">
          <div class="font-weight-medium secondary--text pb-3">
            Date(s) Incurred
          </div>
          <div class="d-flex align-center justify-start pb-2">
            <div
              v-for="(pickerType, tIndex) in dateTypes[index]"
              :key="pickerType.label"
              class="d-flex align-center"
            >
              <Checkbox
                v-model="pickerType.selected"
                class="d-flex pr-3"
                @input="additionalDatesPickerOptionChecked(index, pickerType.value, tIndex)"
              />
              {{ pickerType.label }}
              <v-divider v-if="tIndex !== 1" vertical class="my-2 mx-5" />
            </div>
          </div>

          <v-menu
            v-model="fee.menu"
            :close-on-content-click="false"
            :nudge-right="40"
            :nudge-top="23"
            transition="scale-transition"
            offset-y
            min-width="290px"
          >
            <template v-slot:activator="{ on }">
              <v-text-field
                v-model="fee.timePeriodDisplay"
                append-icon="$calendar"
                color="accent"
                readonly
                rounded
                solo
                flat
                dense
                background-color="#F0F5F6"
                class=""
                :placeholder="placeholderText(index)"
                v-on="on"
                @click:append="fee.menu = true"
              />
            </template>

            <date-range
              :key="Array.isArray(fee.timePeriod) ? 'range' : 'month'"
              :max="new Date().toISOString().slice(0, 10)"
              :type="Array.isArray(fee.timePeriod) ? 'range' : 'month'"
              :multi-picker="false"
              :parent-index="index"
              :fee-type="
                Array.isArray(fee.timePeriod) ? 'datesIncurred' : 'month'
              "
              @update:dates="updateDates"
            />
          </v-menu>

          <div class="font-weight-medium secondary--text pb-2">Amount</div>
          <v-text-field
            v-model="fee.amount"
            rounded
            type="number"
            solo
            flat
            dense
            background-color="#F0F5F6"
            style="height: 45px"
          >
            <div slot="prepend-inner">$</div>
          </v-text-field>

          <div class="d-flex justify-end">
            <span
              class="body-2"
              style="color: #fa8b5c; cursor: pointer"
              @click="deleteDateFees(index)"
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
            {{
              title === "Utilities"
                ? "ADD ADDITIONAL UTILITY"
                : "ADD ADDITIONAL FEE"
            }}
          </div>
        </div>
      </v-form>
    </div>
  </StandardDialog>
</template>

<script>
import DateRange from "@/components/DateRange.vue";
import Checkbox from "@/components/Checkbox.vue";
import StandardDialog from "./StandardDialog.vue";

export default {
  name: "UtilitiesAndFeesDialog",
  components: {
    DateRange,
    Checkbox,
    StandardDialog,
  },
  props: {
    types: {
      type: Array,
      default: () => [],
    },
    title: {
      type: String,
      default: "",
    },
    dialogHeight: {
      type: String,
      default: "90vh",
    },
  },
  data() {
    return {
      type: "",
      other: "",
      amount: "",
      formValid: true,
      pickerTypes: [
        {
          label: "Month",
          value: "month",
          selected: true,
        },
        {
          label: "Date Range",
          value: "range",
          selected: false,
        },
      ],
      dateTypes: [],
      singleDatesIncurred: {
        amount: null,
        timePeriod: [],
        timePeriodDisplay: "",
        menu: false,
        selected: true,
        type: "",
      },
      datesIncurredFees: [],
      dateFees: [],
      selectedDatePickerType: "range",
    };
  },
  computed: {
    areThereAnyAdditionalForm() {
      return this.datesIncurredFees.length > 0;
    },
  },
  watch: {
    type(val) {
      if (val !== "Other") this.other = "";
    },
  },
  methods: {
    initialization() {
      this.type = "";
      this.amount = "";
      this.formValid = true;
      this.singleDatesIncurred = {
        amount: null,
        timePeriod: [],
        timePeriodDisplay: "",
        selected: true,
        type: "",
        other: "",
        menu: false,
      };
      this.datesIncurredFees = [];
      this.dateFees = [];
      this.selectedDatePickerType = "range";
      this.dateTypes = [];
    },
    currentPickerType() {
      let result = "";
      this.pickerTypes.map((item) => {
        if (item.selected === true) {
          result = item.value;
        }
      });

      return result;
    },
    placeholderText(index) {
      if (index == -1) {
        return this.currentPickerType() === "range"
          ? "MM/DD/YYYY - MM/DD/YYYY"
          : "MM/YYYY";
      } else {
        return Array.isArray(this.datesIncurredFees[index].timePeriod)
          ? "MM/DD/YYYY - MM/DD/YYYY"
          : "MM/YYYY";
      }
    },
    close() {
      this.$emit("close:dialog");
      this.initialization();
    },
    addAdditionalForm() {
      const pickerTypes = [
        {
          label: "Month",
          value: "month",
          selected: true,
        },
        {
          label: "Date Range",
          value: "range",
          selected: false,
        },
      ];
      this.dateTypes.push(pickerTypes);
      return this.add("month");
    },
    add(type) {
      this.datesIncurredFees.push({
        amount: null,
        timePeriod: type === "dateRange" ? [] : "",
        timePeriodDisplay: "",
        selected: true,
        type: "",
        other: "",
        menu: false,
      });
    },
    fillDatesInSingleDatesIncurred({ dates }) {
      this.singleDatesIncurred.timePeriod = dates;
      this.singleDatesIncurred.timePeriodDisplay = this.formatDates(
        dates,
        this.currentPickerType()
      );

      if (this.currentPickerType() === "month") {
        this.singleDatesIncurred.menu = false;
        this.$refs.formRange.inputs[2].focus();
      }
    },
    updateDates({ dates, index, feeType }) {
      if (feeType === "datesIncurred") {
        this.datesIncurredFees[index].timePeriod = dates;
        this.datesIncurredFees[index].timePeriodDisplay = this.formatDates(
          dates,
          "range"
        );
      } else {
        this.datesIncurredFees[index].timePeriod = dates;
        this.datesIncurredFees[index].timePeriodDisplay = this.formatDates(
          dates,
          "month"
        );
      }
    },
    formatDates(dates, pickerType) {
      if (pickerType === "range") {
        const date1 = this.$dayjs(dates[0]);
        const date2 = this.$dayjs(dates[1]);
        return `${date1.format("MMMM D, YYYY")} - ${date2.format(
          "MMMM D, YYYY"
        )}`;
      } else if (pickerType === "single") {
        return this.$dayjs(dates).format("MMMM D, YYYY");
      } else if (pickerType === "month") {
        return this.$dayjs(dates).format("MMMM YYYY");
      }
    },
    datesPickerOptionChecked(pickerType, index) {
      const pickerTypesInstance = [...this.pickerTypes];
      pickerTypesInstance.forEach(
        (pickerTypeObj, pickerTypeObjIndex) =>
          (pickerTypeObj.selected = pickerTypeObjIndex === index)
      );

      if (this.currentPickerType() === "month") {
        this.singleDatesIncurred.timePeriod = "";
        this.singleDatesIncurred.timePeriodDisplay = "";
      } else {
        this.singleDatesIncurred.timePeriod = [];
        this.singleDatesIncurred.timePeriodDisplay = "";
      }

      this.pickerTypes = [...pickerTypesInstance];
      this.datesIncurredFees = [];
    },
    additionalDatesPickerOptionChecked(index, pickerType, subIndex) {
      const pickerTypesInstance = [...this.dateTypes[index]];
      pickerTypesInstance.forEach(
        (pickerTypeObj, pickerTypeObjIndex) =>
          (pickerTypeObj.selected = pickerTypeObjIndex === subIndex)
      );

      if (pickerType === "month") {
        this.datesIncurredFees[index].timePeriod = "";
        this.datesIncurredFees[index].timePeriodDisplay = "";
      } else {
        this.datesIncurredFees[index].timePeriod = [];
        this.datesIncurredFees[index].timePeriodDisplay = "";
      }

      this.dateTypes[index] = [...pickerTypesInstance];
    },
    complete() {
      const data = [
        this.singleDatesIncurred,
        ...this.datesIncurredFees,
        ...this.dateFees,
      ];
      const newUtilities = data.reduce((result, fee) => {
        if (fee.amount && fee.timePeriod) {
          result = [
            ...result,
            {
              amount: fee.amount,
              timePeriod: fee.timePeriod,
              timePeriodDisplay: fee.timePeriodDisplay,
              selected: fee.selected,
              type: this.type,
              other: this.other,
            },
          ];
        }

        return result;
      }, []);
      this.$emit("add", newUtilities);
      this.close();
    },
    deleteDateFees(index) {
      this.$delete(this.datesIncurredFees, index);
    },
  },
};
</script>

<style lang="scss">
.utilities-dialog {
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
