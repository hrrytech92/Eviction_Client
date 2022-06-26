<template>
  <li :class="indicatorclass" @click="$emit('change-step', step.id)">
    <!-- <div class="step"><v-icon color="white">{{step.icon}}</v-icon></div> -->
    <div class="step">
      <i :class="`icofont-${step.icon} icofont-2x`" />
    </div>
    <div class="caption">
      {{ step.title }}
    </div>
  </li>
</template>

<script>
export default {
  name: "StepNavigationStep",
  props: {
    step: {
      type: [String, Number],
      default: "",
    },
    currentstep: {
      type: [String, Number],
      default: "",
    },
  },
  computed: {
    indicatorclass() {
      return {
        active: this.step.id === this.currentstep,
        complete: this.currentstep > this.step.id,
      };
    },
  },
};
</script>

<style></style>
