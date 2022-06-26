<template>
  <v-card>
    <v-card-title class="my-2 display-1 secondary--text font-weight-medium">
      Filter
    </v-card-title>
    <!-- <v-card-subtitle v-if="subtitle"><span class="font-weight-medium">Note:</span> {{subtitle}} </v-card-subtitle> -->
    <v-card-text>
      <v-container>
        <div v-for="filter in filters" :key="filter.filter1">
          <v-row align-content="center">
            <v-col>
              <v-select
                v-model="filter.filter1"
                rounded
                solo
                flat
                dense
                hide-details
                background-color="#F0F5F6"
                :items="['Client', 'Service', 'County', 'Hearing', 'Status']"
                label="Select Criteria"
              >
                <v-icon slot="append" medium color="accent">
                  mdi-chevron-down
                </v-icon>
              </v-select>
            </v-col>
            <v-col cols="1">
              <div class="font-weight-medium subtitle-1 text-center">is</div>
            </v-col>
            <v-col>
              <v-text-field
                v-model="filter.filter2"
                rounded
                solo
                flat
                dense
                hide-details
                background-color="#F0F5F6"
                label="Enter Value"
              />
            </v-col>
            <v-col cols="1">
              <v-btn icon color="info">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </div>

        <v-row>
          <v-btn large color="accent" class="mx-6" text @click="addFilter">
            <v-icon left> mdi-plus-circle-outline </v-icon> add filter
          </v-btn>
        </v-row>
      </v-container>
    </v-card-text>

    <v-card-actions>
      <v-spacer />

      <v-btn color="accent" text @click="() => this.$emit('change:dialog', '')">
        cancel
      </v-btn>

      <v-btn rounded color="accent" dark class="px-8" depressed @click="submit">
        apply filter
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: "FilterDialog",
  data() {
    return {
      filters: [
        {
          filter1: "",
          filter2: "",
        },
      ],
    };
  },
  methods: {
    submit() {
      this.$emit("update:filters", this.filters);
      this.$emit("change:dialog", "");
    },
    addFilter() {
      this.filters.push({
        filter1: "",
        filter2: "",
      });
    },
  },
};
</script>

<style></style>
