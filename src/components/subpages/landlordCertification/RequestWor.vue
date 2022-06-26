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
      Would you like to have a Warrant for Removal filed?
    </div>
    <div class="pb-4" style="font-size: 0.9rem">
      To avoid delay, you can have your request for a
      <span class="font-weight-medium">Warrant for Removal</span> ready for
      filing in the event any of the following are entered with the court:
      <span class="font-weight-medium"
        >Default Judgment, Judgement for Possession, Consent to Enter Judgment
        and Vacate</span
      >. Need to make changes based on the judgment rendered by the judge? Not a
      problem! You can make as many changes as necessary at no additional cost.
    </div>

    <div class="py-4">
      <v-btn
        rounded
        color="primary"
        small
        dark
        class="px-12"
        depressed
        @click="
          () => {
            wor = false;
            next();
          }
        "
      >
        no
      </v-btn>
      <v-btn
        rounded
        color="accent"
        small
        dark
        class="px-12 ml-4"
        depressed
        @click="wor = true"
      >
        yes
      </v-btn>
    </div>

    <div v-if="wor">
      <div class="headline font-weight-medium pt-10 pb-4">
        There is an additional fee for this service.
      </div>
      <v-card
        color="primary"
        class="pl-6 py-4 my-8 credit-card white--text mx-auto font-weight-medium text-left"
        elevation="7"
      >
        <div class="d-flex justify-space-between align-center mb-6">
          <div style="font-size: 2.5rem; font-weight: 600 !important">
            {{ worCost }}
          </div>
          <div class="credit-card-line" />
        </div>
        <div style="font-size: 1.3rem">Warrant for Removal</div>
        <div class="text-uppercase font-weight-medium caption">MORE INFO</div>
      </v-card>
      <div class="py-4">
        <v-btn
          rounded
          color="primary"
          small
          dark
          class="px-8"
          depressed
          @click="
            () => {
              wor = false;
              next();
            }
          "
        >
          never mind
        </v-btn>
        <v-btn
          rounded
          color="accent"
          small
          dark
          class="px-8 ml-4"
          depressed
          @click="wor = true"
        >
          add to cart
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "RequestWor",
  props: {
    attorney: Boolean,
  },
  data() {
    return {
      wor: false,
      worCost: "$50",
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
    this.worCost = this.attorney ? "$50" : "$30";
  },
  methods: {
    next() {
      this.$emit("update:data", {
        legalFeesPermitted: this.legalFeesPermitted,
        legalFees: this.legalFees,
      });
      this.$emit("next");
    },
    // total(items){
    //   return items.reduce((total, item)=>{
    //     return total += parseFloat(item.cost)
    //   }, 0).toFixed(2)
    // },
  },
};
</script>

<style>
.credit-card {
  width: 340px;
}
.credit-card-line {
  width: 152px;
  height: 60px;
  background: #ffffff 0% 0% no-repeat padding-box;
  border-radius: 100px 0px 0px 100px;
  opacity: 0.27;
}
</style>
