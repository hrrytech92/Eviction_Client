<template>
  <div>
    <div
      v-for="btn in btns"
      :key="btn"
      class="d-flex align-center justify-center my-6"
      :class="[btn === value ? 'selection-selected' : 'selection']"
      style="width: 100%"
      @click="typeClicked(btn)"
    >
      <span class="font-weight-medium" style="letter-spacing: 1.68px">{{
        btn.toUpperCase()
      }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "Selection",
  props: {
    value: {
      type: String,
      default: "",
    },
    btns: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    typeClicked(item) {
      this.$emit("input", item);
    },
  },
};
</script>

<style></style>
