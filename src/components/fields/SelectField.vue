<template>
  <div>
    <div class="font-weight-medium secondary--text pb-2">
      {{ title }}
    </div>
    <v-select
      v-model="value"
      item-color="#F6F9FA"
      rounded
      :rules="rules"
      solo
      flat
      dense
      background-color="#F0F5F6"
      :items="items"
      class="pb-2"
    >
      <v-icon slot="append" medium color="accent"> mdi-chevron-down </v-icon>
    </v-select>
  </div>
</template>

<script>
export default {
  name: "SelectField",
  props: {
    field: {
      type: [String, Number],
      default: 0,
    },
    title: {
      type: String,
      default: "",
    },
    items: {
      type: Array,
      default: () => [],
    },
    rulesType: {
      type: String,
      default: "",
    },
  },
  computed: {
    value: {
      get: function () {
        return this.field;
      },
      set: function (newValue) {
        this.$emit("update:field", newValue);
      },
    },
    rules() {
      switch (this.rulesType) {
        case "none":
          return [];
        case "required":
        default:
          return [(v) => !!v || "Item is required"];
      }
    },
  },
};
</script>

<style></style>
