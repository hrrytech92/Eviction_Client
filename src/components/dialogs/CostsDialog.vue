<template>
  <v-card class="d-flex flex-column secondary--text">
    <v-btn
      color="info"
      icon
      class="align-self-end pa-6 btn--plain"
      @click="close"
    >
      <v-icon>mdi-close</v-icon>
    </v-btn>
    <div class="mb-4 headline secondary--text font-weight-medium text-center">
      {{ title }}
    </div>
    <div>
      <v-list>
        <div
          v-for="(item, index) in costs"
          :key="item.name"
          style="width: 80%"
          class="mx-auto"
        >
          <v-list-item class="">
            <v-row align="center">
              <v-col>
                <div
                  class="secondary--text font-weight-medium"
                  style="font-size: 0.9rem"
                >
                  {{ item.name }}
                </div>
                <div class="info--text" style="font-size: 0.9rem">
                  {{ item.timePeriodDisplay }}
                </div>
              </v-col>
              <v-col>
                <div class="secondary--text font-weight-medium text-right">
                  ${{ item.cost }}
                </div>
              </v-col>
            </v-row>
          </v-list-item>
          <v-divider
            v-if="index !== costs.length - 1"
            style="width: 90%"
            class="mx-auto"
          />
        </div>
      </v-list>
    </div>
    <div
      class="white--text text-right px-6 pa-2 font-weight-medium"
      style="background-color: #4dcccd"
    >
      <span class="pr-4 mb-2 caption" style="font-weight: 600 !important"
        >TOTAL</span
      >
      <span>${{ total }}</span>
    </div>
  </v-card>
</template>

<script>
export default {
  name: "CostsDialog",
  components: {},
  props: {
    title: {
      type: String,
      default: "",
    },
    costs: {
      type: Array,
      default: () => [],
    },
    total: {
      type: String,
      default: "",
    },
  },
  data() {
    return {};
  },
  methods: {
    close() {
      this.$emit("close-costs-dialog");
    },
  },
};
</script>

<style></style>
