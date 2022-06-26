<template>
  <v-card class="secondary--text pa-6 d-flex flex-column" @close-dialog="close">
    <v-btn
      color="info"
      icon
      class="align-self-end pa-6 btn--plain"
      @click="close"
    >
      <v-icon>mdi-close</v-icon>
    </v-btn>
    <v-form ref="form" v-model="valid">
      <div class="headline font-weight-medium py-4 text-center">
        Select the property with an eviction in progress.
      </div>
      <v-autocomplete
        v-if="!choseCase"
        v-model="eviction"
        :items="evictions"
        :search-input.sync="search"
        hide-selected
        :loading="loading"
        :item-text="displayPropertyInfo"
        item-value="id"
        placeholder="Start typing to search"
        return-object
        class="pb-6 pt-2"
        rounded
        solo
        flat
        dense
        background-color="#F0F5F6"
        :rules="[(v) => !!v || 'Item is required']"
      >
        <!-- If no properties -->
        <template v-slot:no-data>
          <span class="secondary--text pl-4">No evictions on file</span>
        </template>
        <!-- if properties -->
        <template slot="selection" slot-scope="data">
          <span class="secondary--text">{{
            displayPropertyInfo(data.item)
          }}</span>
        </template>
        <template slot="item" slot-scope="data">
          <span class="secondary--text">{{
            displayPropertyInfo(data.item)
          }}</span>
        </template>
        <v-icon slot="append" medium color="accent"> mdi-chevron-down </v-icon>
      </v-autocomplete>
    </v-form>

    <v-card-actions class="justify-center">
      <v-btn
        rounded
        color="primary"
        class="px-12 mb-10 mt-6"
        small
        depressed
        :disabled="!eviction"
        @click="submit"
      >
        submit
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: "ChooseCaseDialog",
  components: {},
  data() {
    return {
      eviction: {},
      evictions: [],
    };
  },
  created() {
    this.$http
      .get(`${process.env.VUE_APP_URL}/client/cases`, {
        params: {
          clientId: this.$store.getters.client.id,
        },
      })
      .then((r) => r.data)
      .then((data) => {
        this.evictions = data;
      });
  },
  methods: {
    close() {
      this.$emit("close-dialog");
    },
    submit() {
      this.$emit("choose:case", this.eviction);
    },
    displayPropertyInfo(property) {
      return `${property.streetAddress}, ${property.city}, ${property.state} ${property.zipcode}`;
    },
  },
};
</script>

<style></style>
