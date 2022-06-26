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
    <div class="headline font-weight-medium pt-10 pb-4">Gear up for trial.</div>
    <div class="pb-4" style="font-size: 0.9rem">
      Read each option below and select how you would like your attorney to
      proceed in court, on your behalf.
    </div>
    <div class="font-weight-medium text-left pl-12">Select one.</div>
    <v-radio-group
      v-model="selected"
      class="my-0 primary-radio-group"
      hide-details
    >
      <div
        v-for="option in options"
        :key="option.id"
        class="secondary--text py-4 d-flex align-start"
        style="font-size: 0.9rem"
      >
        <v-radio
          :value="option"
          on-icon="mdi-checkbox-blank-circle"
          class="ml-4 mt-1"
        />
        <div>
          <div>{{ option.text }}</div>
          <div
            v-if="option.id === selected.id && selected.id <= 1"
            style="width: 95%; font-size: 0.85rem"
            class="float-right"
          >
            <div v-if="option.id === 0" class="my-2">
              <min-max
                v-for="item in ranges"
                :key="item.title"
                class="mt-10"
                :title="item.title"
                :text="item.text"
                :min="item.min"
                :max="item.max"
                :dollar="item.dollar"
              />
            </div>
            <div v-if="option.id === 1" class="my-2">
              <min-max
                v-for="item in ranges.slice(1)"
                :key="item.title"
                class="mt-10"
                :title="item.title"
                :text="item.text"
                :min="item.min"
                :max="item.max"
                :dollar="item.dollar"
              />
            </div>

            <div class="my-6">
              <div class="font-weight-medium text-left">Other Terms</div>
              <div>
                Specify any other terms you would like stipulated in the
                settlement agreement.
              </div>
              <v-textarea
                v-model="content"
                class="pt-4"
                hide-details
                solo
                flat
                dense
                background-color="#F0F5F6"
                rows="3"
              />
            </div>
            <div class="my-6">
              <div class="font-weight-medium text-left">Repairs</div>
              <div>
                If tenant(s) claims the reason for non-payment of rent is due to
                repairs not being made, please explain your position.
              </div>
              <v-textarea
                v-model="content"
                class="pt-4"
                hide-details
                solo
                flat
                dense
                background-color="#F0F5F6"
                rows="3"
              />
            </div>
          </div>
        </div>
      </div>
    </v-radio-group>

    <div
      style="background-color: #fafbfc; width: 80%; font-size: 0.9rem"
      class="pa-4 mx-auto"
    >
      <span class="font-weight-medium" style="border-bottom: solid 2px #4dccc4"
        >NOTE:</span
      >
      If an agreement is not reached with the tenant(s), and the case proceeds
      to trial, you will be required to appear in court.
    </div>
  </div>
</template>

<script>
import MinMax from "@/components/MinMax";
export default {
  name: "Precourt",
  components: {
    MinMax,
  },
  data() {
    return {
      selected: "",
      ranges: [
        {
          title: "Rent Due",
          text: "number of days you are willing to give the tenant to pay the full balance owed.",
          min: 0,
          max: 180,
        },
        {
          title: "Vacate",
          text: "number of days you are willing to give the tenant to vacate the property.",
          min: 0,
          max: 90,
        },
        {
          title: "Remain",
          text: "amount of past due rent tenant must pay monthly in order to remain in the property.",
          min: 0,
          max: 10000,
          dollar: true,
        },
        {
          title: "Lump Sum",
          text: "amount of past due rent tenant must pay before court to remain in the property.",
          min: 0,
          max: 10000,
          dollar: true,
        },
      ],
      options: [
        {
          id: 0,
          text: "Mediate and reach a settlement agreement wherein the tenant(s) have the right to remain in the property as long as they adhere to a payment plan for the balance owed. Absent an agreement, the attorney shall proceed with trial to request a Judgment for Possession.",
        },
        {
          id: 1,
          text: "Mediate and reach a settlement agreement wherein the tenant(s) vacate the property on specific terms. Absent an agreement, the attorney shall proceed with trial to request a Judgment for Possession.",
        },
        {
          id: 2,
          text: "Attorney shall proceed to trial and request that the court issue a Judgment for Possession.",
        },
        {
          id: 3,
          text: "Other.",
        },
      ],
      range: [0, 180],
      min: 0,
      max: 180,
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

<style></style>
