<template>
  <div>
    <v-text-field
      v-model="displayValue"
      hide-details
      solo
      flat
      :style="cssStyle"
      :class="cssClass"
      @blur="isInputActive = false"
      @focus="isInputActive = true"
    />
  </div>
</template>

<script>
export default {
  name: "CurrencyInput",
  props: {
    value: {
      type: Number,
      default: 0,
    },
    cssClass: {
      type: String,
      default: "",
    },
    cssStyle: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      isInputActive: false,
    };
  },
  computed: {
    displayValue: {
      get: function () {
        if (this.isInputActive) {
          // unformat for user input
          if (!this.value) {
            // if value was 0
            return "";
          }
          return this.value.toString();
        } else {
          // user not modifying. format display
          return (
            "$" +
            this.value.toFixed(2).replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, "$1,")
          );
        }
      },
      set: function (modifiedValue) {
        // calculate value and ignore if user inputted symbols
        let newValue = parseFloat(modifiedValue.replace(/[^\d.]/g, ""));
        // ensure that not NaN
        if (isNaN(newValue)) {
          newValue = 0;
        }
        // value is a prop so we pass to parent
        this.$emit("input", newValue);
      },
    },
  },
};
</script>

<style></style>
