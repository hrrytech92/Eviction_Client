<template>
  <div class="py-6 d-flex justify-center">
    <div
      v-for="step in steps"
      :key="step"
      class="nav-line mx-1"
      :style="`background-color: ${
        step === current ? '#4dccc4' : '#DAE3E9'
      }; border-color: ${step === current ? '#4dccc4' : '#DAE3E9'}`"
      @click="$emit('step:clicked', step)"
    />
  </div>
</template>

<script>
export default {
  name: "LineNavigation",
  props: {
    steps: {
      type: Number,
      default: 0,
    },
    current: {
      type: Number,
      default: 0,
    },
  },
};
</script>

<style>
.nav-line {
  border: 1px solid;
  border-radius: 14px;
  opacity: 1;
  width: 65px;
  height: 7px;
  cursor: pointer;
}
</style>
