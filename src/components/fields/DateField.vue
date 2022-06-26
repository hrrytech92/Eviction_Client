<template>
  <div>
    <div class="font-weight-medium secondary--text pb-2">
      {{ title }}
    </div>

    <v-menu
      v-model="menu"
      :close-on-content-click="false"
      :nudge-right="40"
      transition="scale-transition"
      offset-y
      min-width="290px"
    >
      <template v-slot:activator="{ on }">
        <v-text-field
          v-model="dateConverted"
          color="accent"
          rounded
          solo
          flat
          dense
          background-color="#F0F5F6"
          :rules="rules"
          :class="`pb-${bSpacing}`"
          @click:append="menu = true"
        >
          <template v-slot:append>
            <v-btn color="accent" icon class="btn--plain" v-on="on">
              <v-icon>$calendar</v-icon>
            </v-btn>
          </template>
        </v-text-field>
      </template>
      <v-date-picker
        :value="date"
        no-title
        :show-current="false"
        color="primary"
        class="custom-date"
        @input="updateDate"
      />
    </v-menu>
  </div>
</template>

<script>
export default {
  name: "DateField",
  props: {
    field: {
      type: [String, Number],
      default: 0,
    },
    title: {
      type: String,
      default: "",
    },
    rulesType: {
      type: String,
      default: "",
    },
    bSpacing: {
      type: Number,
      default: 2,
    },
  },
  data() {
    return {
      menu: false,
      date: "",
    };
  },
  computed: {
    rules() {
      switch (this.rulesType) {
        case "none":
          return [];
        case "required":
        default:
          return [
            (v) => !!v || "Item is required",
            (v) => this.validDate(v) || "Invalid date - use format MM/DD/YYYY",
          ];
      }
    },
    dateConverted: {
      get: function () {
        return this.convertDateWithSlashes(this.field);
      },
      set: function (newValue) {
        if (newValue.length < 10) {
          return newValue;
        }
        const d = new Date(newValue).toISOString();
        const d1 = d.split("T"); // spliting date from T
        this.$emit("update:field", d1[0]);
      },
    },
  },
  deactivated() {
    console.log("destroyed");
  },
  methods: {
    updateDate(input) {
      this.menu = false;
      this.$emit("update:field", input);
    },
    validDate(dtValue2) {
      // your desired pattern
      const pattern = /(0\d{1}|1[0-2])\/([0-2]\d{1}|3[0-1])\/(19|20)(\d{2})/;
      const m = dtValue2.match(pattern);
      if (!m) return false;
      const d = new Date(dtValue2);
      // Now let's ensure that the date is not out of index

      return (
        d.getMonth() + 1 === parseInt(m[1], 10) &&
        d.getDate() === parseInt(m[2], 10)
      );
    },
  },
};
</script>

<style></style>
