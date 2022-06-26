<template>
  <div class="ev-time-picker-container d-flex justify-center align-center">
    <v-container>
      <v-row>
        <v-col cols="4">
          <v-row align="center" justify="center">
            <v-btn icon color="primary" plain @click="incrementHour">
              <v-icon>mdi-chevron-up</v-icon>
            </v-btn>
          </v-row>

          <v-row align="center" justify="center">
            <v-text-field
              v-model="selectedHour"
              rounded
              solo
              flat
              dense
              hide-details
              background-color="#F0F5F6"
              class="text-field-center"
            />
          </v-row>

          <v-row align="center" justify="center">
            <v-btn icon color="primary" plain @click="decrementHour">
              <v-icon>mdi-chevron-down</v-icon>
            </v-btn>
          </v-row>
        </v-col>

        <v-col cols="1" class="d-flex justify-center align-center">
          <div>:</div>
        </v-col>

        <v-col cols="4">
          <v-row align="center" justify="center">
            <v-btn icon color="primary" plain @click="incrementMinute">
              <v-icon>mdi-chevron-up</v-icon>
            </v-btn>
          </v-row>

          <v-row align="center" justify="center">
            <v-text-field
              v-model="selectedMinute"
              rounded
              solo
              flat
              dense
              hide-details
              background-color="#F0F5F6"
              class="text-field-center"
            />
          </v-row>

          <v-row align="center" justify="center">
            <v-btn icon color="primary" plain @click="decrementMinute">
              <v-icon>mdi-chevron-down</v-icon>
            </v-btn>
          </v-row>
        </v-col>

        <v-col cols="2" class="ml-3">
          <v-row style="margin-top: 1px">
            <v-btn
              fab
              small
              depressed
              :outlined="!am"
              color="primary"
              @click="optionClicked('am')"
            >
              AM
            </v-btn>
          </v-row>
          <v-row class="mt-4">
            <v-btn
              fab
              small
              depressed
              :outlined="!pm"
              color="primary"
              @click="optionClicked('pm')"
            >
              PM
            </v-btn>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { generateNumbers } from "@/utils";

export default {
  name: "EVTimePicker",
  data: () => ({
    hours: generateNumbers(13),
    minutes: generateNumbers(60),
    selectedHour: "08",
    selectedMinute: "00",
    am: null,
    pm: null,
  }),
  methods: {
    incrementHour() {
      const findHourIndex = this.hours.findIndex(
        (number) => number === this.selectedHour
      );

      const index = findHourIndex !== 12 ? findHourIndex + 1 : findHourIndex;

      this.selectedHour = this.hours[index];
    },
    incrementMinute() {
      const findMinuteIndex = this.minutes.findIndex(
        (number) => number === this.selectedMinute
      );

      const index =
        findMinuteIndex !== 59 ? findMinuteIndex + 1 : findMinuteIndex;

      this.selectedMinute = this.minutes[index];
    },
    decrementHour() {
      const findHourIndex = this.hours.findIndex(
        (number) => number === this.selectedHour
      );

      const index = findHourIndex !== 0 ? findHourIndex - 1 : findHourIndex;

      this.selectedHour = this.hours[index];
    },
    decrementMinute() {
      const findMinuteIndex = this.minutes.findIndex(
        (number) => number === this.selectedMinute
      );

      const index =
        findMinuteIndex !== 0 ? findMinuteIndex - 1 : findMinuteIndex;

      this.selectedMinute = this.minutes[index];
    },
    optionClicked(keyTime) {
      if (keyTime === "am") {
        this.am = true;
        this.pm = false;
      } else {
        this.am = false;
        this.pm = true;
      }

      const selectedMeridiem = this.am === true ? "AM" : "PM";

      this.$emit(
        "meridiemClicked",
        `${this.selectedHour}:${this.selectedMinute} ${selectedMeridiem}`
      );
    },
  },
};
</script>

<style scoped>
.ev-time-picker-container {
  z-index: 99;
  background-color: white;
  padding: 20px;
  min-height: 155.5px;
}
</style>
