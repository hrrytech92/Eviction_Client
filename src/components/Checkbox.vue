<template>
  <div
    class="checkbox d-flex justify-center align-center"
    style="cursor: pointer"
    @click="updateCheck"
  >
    <v-icon :color="color" :size="size"> mdi-{{ icon }} </v-icon>
  </div>
</template>

<script>
export default {
  name: "Checkbox",
  props: {
    value: {
      type: Boolean || Number,
      default: false,
    },
    checkboxKey: {
      type: Number,
      default: undefined,
    },
    size: {
      type: String,
      default: "24",
    },
  },
  computed: {
    icon() {
      return this.value ? "check-circle" : "check-circle-outline";
    },
    color() {
      return this.value ? "primary" : "info";
    },
  },
  methods: {
    updateCheck() {
      if (this.checkboxKey !== undefined) {
        this.$emit("change", this.checkboxKey);
      } else {
        this.$emit("input", !this.value);
      }
    },
  },
};
</script>

<style></style>
