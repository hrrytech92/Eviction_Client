<template>
  <v-progress-linear
    v-if="isPdfLoading"
    id="myProgress"
    color="#4dccc4"
    v-model="percent"
    height="25"
  >
    <strong>Generating...</strong>
    <!-- <strong>{{ percent }}%</strong> -->
  </v-progress-linear>
</template>

<script>
export default {
  data: () => ({
    percent: 0,
  }),
  props: {
    isPdfLoading: Boolean,
  },
  watch: {
    isPdfLoading(bool) {
      if (bool) {
        this.percent = 0;
        this.interval = setInterval(() => {
          this.percent++;
          if (this.percent === 100) {
            clearInterval(this.interval);
          }
        }, 120);
      } else {
        clearInterval(this.interval);
      }
    },
  },
};
</script>

<style scoped>
#myProgress {
  width: 50%;
  position: absolute;
  bottom: 50%;
  left: 25%;
  border-radius: 10px;
  color: white;
}
</style>
