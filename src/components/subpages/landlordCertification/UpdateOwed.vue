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
      Certification by Landlord
    </div>
    <div class="headline font-weight-medium pt-10 pb-4">
      Any updates on what is owed?
    </div>
    <div class="pb-4" style="font-size: 0.9rem">
      Let us know if the tenant has made any payments toward the balance of rent
      and charges owed, as stated in the Verified Complaint.
    </div>

    <v-container>
      <v-row v-for="category in categories" :key="category.title">
        <v-col>
          <v-sheet
            class="py-4 mb-2 font-weight-medium white--text d-flex flex-column"
            color="primary"
          >
            <div
              class="text-uppercase"
              style="font-size: 0.8rem; font-weight: 600"
            >
              {{ category.title }}
            </div>
            <div style="font-size: 2rem">${{ category.cost }}</div>
          </v-sheet>
        </v-col>
        <v-col>
          <v-sheet
            class="py-4 mb-2 font-weight-medium secondary--text"
            elevation="4"
            color="white"
            style="border: solid 1px ##afc2ce !important"
          >
            <div
              class="text-uppercase"
              style="font-size: 0.8rem; font-weight: 600"
            >
              Tenant has Paid
            </div>
            <!-- <div style="font-size: 2rem;width: 60%" class="d-flex justify-center align-center mx-auto"><span>$</span> -->
            <div>
              <currency-input
                v-model="category.tenantPaid"
                :css-class="`centered-input secondary--input pb-2`"
                :css-style="`font-size: 2rem;`"
              />
            </div>
            <!-- </div> -->
          </v-sheet>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import CurrencyInput from "@/components/CurrencyInput";
export default {
  name: "UpdateOwed",
  components: {
    CurrencyInput,
  },
  data() {
    return {
      categories: [
        {
          title: "Past Due Rent",
          cost: "3,600.00",
          tenantPaid: 0,
        },
        {
          title: "Late Charges",
          cost: "200.00",
          tenantPaid: 0,
        },
        {
          title: "Legal Fees",
          cost: "600.00",
          tenantPaid: 0,
        },
        {
          title: "Filing Fees",
          cost: "30.00",
          tenantPaid: 0,
        },
        {
          title: "Utilities",
          cost: "200.00",
          tenantPaid: 0,
        },
      ],
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

<style>
.secondary--input.v-text-field.v-text-field--solo .v-input__control input {
  color: #003a60;
}
</style>
