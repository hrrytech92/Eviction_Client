<template>
  <div class="mx-8 secondary--text">
    <div
      class="text-uppercase info--text py-2 px-6"
      style="
        font-size: 0.8rem;
        font-weight: 600;
        border-bottom: 2px solid #4dccc4;
        display: inline-block;
      "
    >
      Pre-court Assessment
    </div>
    <div class="headline font-weight-medium pt-10 pb-4">
      When is the trial date?
    </div>

    <v-date-picker
      v-model="trialDate"
      no-title
      :show-current="false"
      color="primary"
      class="custom-date pb-4 mt-4"
    />
  </div>
</template>

<script>
export default {
  name: "TrialDate",
  props: {},
  data() {
    return {
      trialDate: "",
    };
  },
  computed: {
    // finalTotal(){
    //   return this.categories.reduce((total,category) =>{
    //     return total += parseFloat(this.total(category.costs))
    //   },0).toFixed(2)
    // }
  },
  mounted() {
    window.scrollTo(0, 0);
  },
  methods: {
    next() {
      this.$emit("update:data", {
        trialDate: this.trialDate,
      });
      this.$emit("next");
    },
  },
};
</script>

<style></style>
