<template>
  <div>
    <div class="font-weight-medium text-left">
      {{ title }}
    </div>
    <div>
      Indicate the <span class="font-weight-medium">minimum</span> and
      <span class="font-weight-medium">maximum</span> {{ text }}
    </div>
    <v-range-slider
      v-model="range"
      :max="max"
      :min="min"
      hide-details
      track-color="#F0F5F6"
      thumb-color="white"
      thumb-label="always"
      class="align-center custom-slider mt-12"
    >
      <template v-slot:thumb-label="{ value }">
        <span v-if="dollar">$</span>{{ value }}
      </template>
    </v-range-slider>
    <div class="d-flex justify-space-between">
      <div class="info--text pl-1"><span v-if="dollar">$</span>{{ min }}</div>
      <div class="info--text"><span v-if="dollar">$</span>{{ max }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "MinMax",
  props: {
    title: {
      type: String,
      default: "",
    },
    text: {
      type: String,
      default: "",
    },
    min: {
      type: Number,
      default: 0,
    },
    max: {
      type: Number,
      default: 0,
    },
    dollar: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      range: [this.min, this.max],
    };
  },
};
</script>

<style>
.custom-slider .v-slider--horizontal .v-slider__track-container {
  height: 11px;
  border-radius: 20px !important;
}
.custom-slider .v-slider__thumb {
  width: 18px;
  height: 18px;
  border: solid 2px #4dccc4 !important;
}

.custom-slider .v-slider__track-background,
.v-slider__track-fill {
  border-radius: 20px;
}

.custom-slider .v-slider__thumb-label div {
  transform: translateY(1px);
}
.custom-slider .v-slider__thumb-label {
  position: absolute;
  background-color: #4dccc4 !important;
  width: 65px !important;
  height: 26px !important;
  text-align: center;
  color: white;
  border-radius: 10px;
  display: inline-block;
  bottom: 175%;
  left: 0;
  transform: translateY(-20%) translateY(-12px) translateX(-50%) !important;
}
.custom-slider .v-slider__thumb-label::after {
  content: "";
  position: absolute;
  width: 0;
  height: 0;
  border-top: 10px solid #4dccc4;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  top: 100%;
  left: 50%;
  margin-left: -5px;
  margin-top: -1px;
}
</style>
