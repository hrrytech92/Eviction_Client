<template>
  <v-card
    class="secondary--text mt-8 pa-8"
    style="
      box-shadow: 15px 15px 40px #00000029;
      border-radius: 20px;
      min-width: 300px;
    "
  >
    <v-card-title class="pa-0 mb-6">
      <div class="ml-2">Order Details</div>
    </v-card-title>
    <div v-for="item in caseOrders" :key="item.id">
      <div class="order-details ml-2 mb-3">
        <div class="d-flex justify-space-between align-center">
          <p
            class="font-weight-medium mb-0"
            style="cursor: pointer"
            @click="redirectToOrderDetails(item)"
          >
            #{{ item.orderNumber }}
          </p>
          <p class="font-weight-medium mb-0">
            ${{ item.cost.toFixed(2) }}
            <!-- ${{ costSum(orderDetails.items) }} -->
          </p>
        </div>
        <div class="d-flex justify-space-between align-center">
          <p
            class="mb-0 mr-1"
            style="color: #53809d; font-size: 16px; align-self: self-start"
          >
            {{ item.title }}
          </p>
          <p class="mb-0" style="font-size: 16px">
            {{ $dayjs(date).format("MM.DD.YYYY") }}
          </p>
        </div>
      </div>
      <hr class="mb-2" style="border: 1px solid #dae3e9" />
    </div>
  </v-card>
</template>

<script>
import { mapGetters } from "vuex";
import ViewSupport from "@/mixins/view-support";

export default {
  name: "OrderDetailsCard",
  mixins: [ViewSupport],
  props: {
    date: {
      type: String,
      default: "",
    },
  },
  computed: {
    ...mapGetters({
      currentCase: "eviction/currentCase",
      caseOrders: "eviction/caseOrders",
    }),
    // orderDetailsItems() {
    //   return this.orderDetails.items?.map((value) => ({
    //     ...value,
    //     viewType:
    //       value.title === "Certification of Lease and Registration Statement"
    //         ? 2
    //         : 1,
    //   }));
    // },
  },

  methods: {
    redirectToOrderDetails(item) {
      this.$store.commit("eviction/set_current_order", item);
      this.$router.push({
        name: item.flowType !== '03' ? "vc-order-details" : "wor-order-details",
        // params: { orderDetailsProp: item },
        params: { landedFromCaseView: true },
      });
    },
    // costSum(items) {
    //   let sum = 0;

    //   for (let i = 0; i < items.length; i++) {
    //     sum += items[i].cost;
    //   }

    //   return sum.toFixed(2);
    // },
  },
};
</script>

<style></style>
