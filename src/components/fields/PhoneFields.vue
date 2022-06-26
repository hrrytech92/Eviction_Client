<template>
  <div>
    <div class="d-flex iconMenu">
      <v-menu>
        <template v-slot:activator="{ on, attrs }">
          <v-icon class="icon" v-bind="attrs" v-on="on">{{
            selectedIcon
          }}</v-icon>
        </template>
        <v-list>
          <v-list-item
            v-for="(item, index) in items"
            :key="index"
            @click="handleSelect(index)"
          >
            <v-icon style="margin-right: 10px">{{ item.icon }}</v-icon>
            <v-list-item-title>{{ item.label }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
      <v-text-field
        v-model="phoneField"
        rounded
        :rules="rules"
        solo
        flat
        dense
        background-color="#F0F5F6"
        class="pb-2 phoneInput"
      />
      <v-text-field
        v-if="phoneType !== 'home'"
        v-model="extField"
        rounded
        solo
        flat
        dense
        background-color="#F0F5F6"
        class="pb-2 extInput"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: "PhoneFields",
  props: {
    phone: {
      type: String,
      default: "",
    },
    phoneType: {
      type: String,
      default: "",
    },
    ext: {
      type: String,
      default: "",
    },
    rulesType: {
      type: String,
      default: "",
    },
    setPhoneType: {
      type: Function,
      default: () => {},
    },
  },
  data() {
    return {
      items: [
        // { label: "Mobile", icon: "$cellphone", type: "mobile" },
        { label: "Home", icon: "mdi-home", type: "home" },
        { label: "Office", icon: "$office", type: "office" },
      ],
      // selectedLebel: "Mobile",
      selectedIcon: "$office",
    };
  },
  activated() {
    const phoneType = this.phoneType || "office";
    const selectedIndex = this.items.findIndex(
      (item) => item.type === phoneType
    );
    console.log(
      "this.items[selectedIndex].icon :>> ",
      this.items[selectedIndex].icon
    );
    this.selectedIcon = this.items[selectedIndex].icon;
  },
  computed: {
    rules() {
      if (this.rulesType === "none") return [];
      return [(v) => !!v || "Item is required"];
    },
    phoneField: {
      get() {
        return this.phone;
      },
      set(value) {
        this.$emit("update:phone", this.formatPhone(value));
      },
    },
    extField: {
      get() {
        return this.ext;
      },
      set(value) {
        this.$emit("update:ext", value);
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
    handleSelect(index) {
      const { icon, type } = this.items[index];
      this.selectedIcon = icon;
      this.setPhoneType(type);
    },
  },
};
</script>

<style scoped>
.icon {
  background-color: #f0f5f6;
  border-top-left-radius: 28px;
  border-bottom-left-radius: 28px;
  width: 45px;
  height: 38px;
  border-right: 1px solid lightgrey;
  padding-left: 15px;
  padding-right: 10px;
}
.phoneInput {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}

.extInput > .v-input__slot ::before {
  content: "ext.";
  margin-right: 10px;
}
</style>
