<template>
  <div>
    <div class="font-weight-medium secondary--text pb-2">
      {{ title }}
    </div>
    <v-text-field
      v-model="phone"
      rounded
      :rules="rules"
      solo
      flat
      dense
      background-color="#F0F5F6"
      class="pb-2"
      :prepend-inner-icon="icon"
      v-bind:class="{ hasIcon: icon }"
    />
  </div>
</template>

<script>
export default {
  name: "PhoneField",
  props: {
    field: {
      type: String,
      default: "",
    },
    title: {
      type: String,
      default: "",
    },
    rulesType: {
      type: String,
      default: "",
    },
    icon: {
      type: String,
      default: "",
    },
    allowTypeChange: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {};
  },
  computed: {
    rules() {
      if (this.rulesType === "none") return [];
      return [(v) => !!v || "Item is required"];
    },
    phone: {
      get() {
        return this.field;
      },
      set(value) {
        this.$emit("update:field", this.formatPhone(value));
      },
    },
  },
  methods: {
    formatPhone(phone) {
      const cleaned = ("" + phone).replace(/\D/g, "");
      const zip = cleaned.substring(0, 3);
      const mid = cleaned.substring(3, 6);
      const last = cleaned.substring(6, 10);
      if (cleaned.length > 6) return `(${zip}) ${mid}-${last}`;
      else if (cleaned.length > 3) return `(${zip}) ${mid}`;
      return `${zip}`;
    },
  },
};
</script>

<style>
.phone-icon {
  color: #8aa4b5;
}

.hasIcon.v-text-field--rounded > .v-input__control > .v-input__slot {
  padding-left: 20px;
}

.v-input__prepend-inner::after {
  content: "";
  border-right: 1px solid #c3d1d2;
  margin-left: 11px;
  margin-right: 7px;
}
</style>
