<template>
  <v-card class="contact-info-edit-modal" style="border-radius: 20px" tile>
    <div class="pa-12">
      <v-row>
        <v-col cols="6">
          <TextField title="First Name" :field.sync="contactInfo.firstName" />
        </v-col>
        <v-col cols="6">
          <TextField title="Last Name" :field.sync="contactInfo.lastName" />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="6">
          <TextField
            title="Company Name"
            :field.sync="contactInfo.company"
            rules-type="none"
          />
        </v-col>
        <v-col cols="6">
          <TextField
            title="Street Address"
            :field.sync="contactInfo.streetAddress"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="6">
          <TextField
            title="Apt/Unit"
            :field.sync="contactInfo.unitNo"
            rules-type="none"
          />
        </v-col>
        <v-col cols="6">
          <TextField title="City" :field.sync="contactInfo.city" />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="6">
          <SelectField
            title="State"
            :field.sync="contactInfo.state"
            :items="states"
          />
        </v-col>
        <v-col cols="6">
          <TextField title="Zip Code" :field.sync="contactInfo.zipcode" />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="6">
          <PhoneField title="Mobile Number" :field.sync="contactInfo.cell" />
        </v-col>
        <v-col cols="6">
          <div class="phone-with-ext">
            <PhoneField
              title="Home/Office Phone"
              :field.sync="contactInfo.phone"
            />
            <TextField title="Ext" :field.sync="contactInfo.ext" />
          </div>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="6">
          <TextField
            title="Email Address"
            :field.sync="contactInfo.email"
            rules-type="email-required"
          />
        </v-col>
      </v-row>
    </div>
    <v-card-actions class="px-12 py-5 d-flex align-center justify-end">
      <v-btn
        rounded
        color="accent_light"
        class="mb-2 mt-4 btn--plain capital--btn"
        text
        @click="$emit('close')"
      >
        Cancel
      </v-btn>
      <v-btn
        v-if="mode === 'create'"
        rounded
        color="accent_light"
        class="px-8 mb-2 mt-4 white--text capital--btn"
        depressed
        @click="$emit('saveNewContactInfo')"
      >
        Add
      </v-btn>
      <v-btn
        v-if="mode === 'edit'"
        rounded
        color="accent_light"
        class="px-8 mb-2 mt-4 white--text capital--btn"
        depressed
        @click="$emit('updateContactInfo')"
      >
        Update
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
<script>
import { states } from "@/resources/index.js";
export default {
  name: "ContactInfoEditDialog",
  props: {
    contactInfo: {
      type: Object,
      default: () => ({}),
    },
    mode: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      states,
    };
  },
};
</script>
<style>
.contact-info-edit-modal .v-text-field__details {
  display: none;
}
</style>
