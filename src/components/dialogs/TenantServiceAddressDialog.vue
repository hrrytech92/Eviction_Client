<template>
  <v-card class="secondary--text" @close-dialog="close">
    <v-btn
      color="info"
      icon
      class="float-right pa-10 btn--plain"
      @click="$emit('close:dialog')"
    >
      <v-icon>mdi-close</v-icon>
    </v-btn>
    <v-form
      ref="form"
      v-model="valid"
      style="width: 70%"
      class="px-8 pt-10 pb-4 mx-auto text-left"
    >
      <div class="custom-title py-10">Tenant Mailing Address</div>

      <div class="font-weight-medium secondary--text pb-2">Street Address</div>
      <v-text-field
        v-model="property.address"
        rounded
        solo
        flat
        dense
        background-color="#F0F5F6"
      />

      <div class="font-weight-medium secondary--text pb-2 pt-4">Unit/Apt</div>
      <v-text-field
        v-model="property.unit"
        rounded
        solo
        flat
        dense
        background-color="#F0F5F6"
      />
      <div class="font-weight-medium secondary--text pb-2 pt-4">City</div>
      <v-text-field
        v-model="property.city"
        rounded
        solo
        flat
        dense
        background-color="#F0F5F6"
      />

      <div class="font-weight-medium secondary--text pb-2 pt-4">State</div>
      <v-select
        v-model="property.state"
        item-color="#F6F9FA"
        rounded
        solo
        flat
        dense
        background-color="#F0F5F6"
        :items="states"
      >
        <v-icon slot="append" medium color="accent"> mdi-chevron-down </v-icon>
      </v-select>

      <div class="font-weight-medium secondary--text pb-2 pt-4">Zip Code</div>
      <v-text-field
        v-model="property.zipcode"
        rounded
        solo
        flat
        dense
        background-color="#F0F5F6"
      />
      <div v-if="hasTenantsReside" />
      <div v-else>
        <div class="mb-5">
          Confirm each of the following tenants reside at the above stated
          address.
        </div>
        <div v-for="(tenant, index) in tenants" :key="index" class="mt-3">
          <div style="display: flex !important">
            <Checkbox v-model="tenantsCheckBoxList[index]" />
            <span class="pl-8">{{ tenant.name }}</span>
          </div>
        </div>
      </div>
    </v-form>
    <v-card-actions
      style="background-color: #fafbfc; border-radius: 0px 0px 10px 10px"
      class="justify-end py-4 pr-12 mt-12"
    >
      <v-btn
        rounded
        color="accent_light"
        class="mb-2 mt-4 btn--plain capital--btn"
        text
        @click="close"
      >
        go back
      </v-btn>
      <v-btn
        rounded
        color="accent_light"
        class="px-8 mb-2 mt-4 white--text capital--btn"
        depressed
        :disabled="!valid"
        @click="add"
      >
        add
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import Checkbox from "../Checkbox.vue";
import { states } from "@/resources/index.js";

export default {
  name: "TenantServiceAddressDialog",
  components: { Checkbox },
  props: {
    title: {
      type: String,
      default: "",
    },
    hasTenantsReside: {
      type: Boolean,
      default: false,
    },
    tenants: {
      // type: String,
      // default: "",
      type: [String, Array],
      default: () => [],
    },
    mailingAddress: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      property: {
        address: "",
        unit: "",
        city: "",
        state: "",
        zipcode: "",
      },
      valid: true,
      states,
      currentTenant: {},
      tenantsCheckBoxList: new Array(this.tenants.length).fill(false),
    };
  },
  mounted() {
    if (this.mailingAddress) {
      this.property = this.mailingAddress;
    }
  },
  methods: {
    add() {
      this.valid = this.$refs.form.validate();
      if (this.valid) {
        this.$emit("add", this.property);
      }
    },
    close() {
      this.$emit("close:dialog");
    },
  },
};
</script>

<style></style>
