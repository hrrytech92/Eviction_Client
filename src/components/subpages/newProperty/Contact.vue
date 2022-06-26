<template>
  <div class="mx-auto">
    <v-btn
      color="info"
      icon
      class="float-right ma-8 btn--plain"
      @click="$emit('close:form')"
    >
      <v-icon>mdi-close</v-icon>
    </v-btn>

    <v-form
      ref="form"
      v-model="valid"
      style="width: 80%"
      class="pt-10 pb-4 mx-auto text-left"
    >
      <div class="custom-title pt-8 pb-4">Contact Information</div>

      <p class="mb-12">
        <span v-if="showContactsList"
          >Confirm your contact information. Your selection will appear on your
          court pleadings.</span
        >
        <span v-else
          >We need a bit more information about you. This will appear on your
          court pleadings as your contact information.</span
        >
      </p>

      <!-- CONTACT INFO BOXES -->
      <div v-if="showContactsList">
        <v-radio-group
          v-model="contactInfo"
          style="font-size: 1rem"
          class="secondary--text mb-8"
          hide-details
        >
          <div
            v-for="info in contactInfos"
            :key="info.id"
            class="d-flex justify-center selection-box my-2 py-4"
            :class="[
              contactInfo.id === info.id ? 'selection-selected' : 'selection',
            ]"
            style="width: 100%; height: auto"
          >
            <v-container>
              <v-row no-gutters align="center">
                <v-col cols="2" class="d-flex justify-center">
                  <v-radio
                    :value="info"
                    on-icon="mdi-check-circle"
                    off-icon="mdi-check-circle-outline"
                  />
                </v-col>
                <v-col cols="7" class="secondary--text">
                  <div>{{ info.firstName }} {{ info.lastName }}</div>
                  <div class="font-weight-medium">
                    {{ info.company }}
                  </div>
                  <div>
                    {{ info.streetAddress
                    }}<span v-if="info.unitNo">, {{ info.unitNo }}</span>
                  </div>
                  <div>
                    {{ info.city }}, {{ info.state }} {{ info.zipcode }}
                  </div>
                  <div>
                    {{ info.phone }}{{ info.ext ? " Ext." + info.ext : "" }}
                  </div>
                  <div>{{ info.cell }}</div>
                  <div>{{ info.email }}</div>
                </v-col>
                <v-spacer />
                <v-col cols="1" align-self="end">
                  <v-btn
                    color="primary"
                    class="btn--plain"
                    icon
                    small
                    @click="showContactInfoEditModal(info)"
                  >
                    <v-icon small> $pencil </v-icon>
                  </v-btn>
                </v-col>
              </v-row>
            </v-container>
          </div>
        </v-radio-group>
        <v-btn
          fab
          depressed
          color="primary"
          height="45"
          width="45"
          @click="toggleForm"
        >
          <span class="white--text font-weight-regular" style="font-size: 50px"
            >+</span
          >
        </v-btn>
      </div>

      <!-- CONTACT FORM -->
      <div v-if="!showContactsList" class="text-left">
        <TextField title="First Name" :field.sync="contactInfo.firstName" />
        <TextField title="Last Name" :field.sync="contactInfo.lastName" />
        <TextField
          title="Company Name"
          :field.sync="contactInfo.company"
          rules-type="none"
        />
        <TextField
          title="Street Address"
          :field.sync="contactInfo.streetAddress"
        />
        <TextField
          title="Apt/Unit"
          :field.sync="contactInfo.unitNo"
          rules-type="none"
        />
        <TextField title="City" :field.sync="contactInfo.city" />
        <SelectField
          title="State"
          :field.sync="contactInfo.state"
          :items="states"
        />
        <TextField title="Zip Code" :field.sync="contactInfo.zipcode" />
        <PhoneField
          title="Mobile Phone"
          :field.sync="contactInfo.cell"
          icon="$cellphone"
          rules-type="none"
        />
        <div class="phone-with-ext">
          <PhoneField
            title="Home/Office Phone"
            :field.sync="contactInfo.phone"
            icon="$phone"
            rules-type="none"
          />
          <TextField
            title="Ext"
            :field.sync="contactInfo.ext"
            rules-type="none"
          />
        </div>
        <!-- <p
          v-if="isPhoneMissing"
          style="margin-top: -20px; font-size: 18px; color: #ff5252"
        >
          At leas one phone number required
        </p> -->
        <TextField
          title="Email Address"
          :field.sync="contactInfo.email"
          rules-type="email-required"
        />
      </div>
    </v-form>

    <v-card-actions
      v-if="!showContactsList"
      style="background-color: #fafbfc; border-radius: 0px 0px 10px 10px"
      class="justify-end py-4 pr-12 mt-12"
    >
      <v-btn
        rounded
        color="accent_light"
        class="mb-2 mt-4 btn--plain capital--btn"
        text
        @click="goToContactList"
      >
        go back
      </v-btn>
      <v-btn
        rounded
        color="accent_light"
        class="px-8 mb-2 mt-4 white--text capital--btn"
        depressed
        :disabled="!valid"
        @click="saveNewContact"
      >
        continue
      </v-btn>
    </v-card-actions>

    <v-card-actions
      v-if="showContactsList"
      style="background-color: #fafbfc; border-radius: 0px 0px 10px 10px"
      class="justify-end py-4 pr-12 mt-12"
    >
      <v-btn
        rounded
        color="accent_light"
        class="mb-2 mt-4 btn--plain capital--btn"
        text
        @click="back"
      >
        go back
      </v-btn>
      <v-btn
        rounded
        color="accent_light"
        class="px-8 mb-2 mt-4 white--text capital--btn"
        depressed
        :disabled="!contactInfo.id"
        @click="next"
      >
        continue
      </v-btn>
    </v-card-actions>

    <v-dialog v-model="showSuccessDialog" persistent value="''" max-width="500">
      <InfoDialog
        title="Success!"
        color="primary"
        type="success"
        text="Your records have been updated. Head on over to your Property List to view and manage your properties."
        btn-text="ALL DONE"
        @submit="$router.push(`/properties`)"
      />
    </v-dialog>
    <v-dialog v-model="contactInfoEditDialog" persistent max-width="700">
      <ContactInfoEditDialog
        mode="edit"
        :contact-info="selectedContactInfo"
        @close="contactInfoEditDialog = false"
        @updateContactInfo="updateContactInfo"
      />
    </v-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { states } from "@/resources/index.js";
import ContactInfoEditDialog from "@/components/dialogs/ContactInfoEditDialog";
import useRequest from "@/utils/useRequest";

export default {
  name: "PropertyAddress",
  components: {
    ContactInfoEditDialog,
  },
  data() {
    return {
      valid: true,
      showContactsList: true,
      isPhoneMissing: false,
      contactInfo: {
        id: "",
        firstName: "",
        lastName: "",
        company: "",
        streetAddress: "",
        unitNo: "",
        city: "",
        state: "New Jersey",
        zipcode: "",
        phone: "",
        phoneType: "office",
        ext: "",
        cell: "",
        email: "",
      },
      contactInfos: [],
      states,
      // TODO: Edit contact information dialog.
      contactInfoEditDialog: false,
      showSuccessDialog: false,
      selectedContactInfo: {},
      alreadySaved: false,
    };
  },
  computed: {
    ...mapGetters({
      currentProperty: "property/currentProperty",
      caseSteps: "eviction/caseSteps",
      client: "client",
    }),
  },
  watch: {
    showContactsList(bool) {
      console.log("Show contacts list: ", bool);
      if (!bool) window.scrollTo(0, 0);
    },
  },
  async activated() {
    window.scrollTo(0, 0);
    // const isInVC = this.$route.name.includes("vc");
    // const isNewProperty = !isInVC && this.$route.params.id === "new"

    if (!this.$auth.isAuthenticated) {
      this.showContactsList = false;
      const { contactInfo } = this.currentProperty;
      if (contactInfo) this.contactInfo = contactInfo;
      return;
    }

    const selectedContactId =
      this.currentProperty.contactInfoId || this.client.defaultContactInfoId;
    await this.getAllContactInfos(selectedContactId);
  },
  async deactivated() {
    // if (this.alreadySaved) return;
    await this.saveData();
  },
  methods: {
    async saveData() {
      // console.log("saveData was called");
      this.alreadySaved = true;

      const propertyData = {
        contactInfoId: this.contactInfo.id,
        status: "contact",
        completed: true,
      };
      await this.$store.dispatch("property/saveProperty", {
        propertyData,
        steps: {
          type: "completed",
          address: "completed",
          registration: "completed",
          owner: "completed",
          associationToOwner: "completed",
          contact: "completed",
        },
      });
      // if (this.isInVC && this.$route.params.id !== "new") {
      //   //* Not a new case, but might be a new property
      //   this.$store.commit("eviction/update_current_case", {
      //     propertyId: this.currentProperty.propertyId,
      //   });
      // }
      // this.showSuccessDialog = true;
    },
    setPhoneType(type) {
      this.$set(this.contactInfo, "phoneType", type);
    },
    async next() {
      this.$router.push({ name: "vc-tenants" });
    },
    async saveNewContact() {
      if (!this.valid) return;

      // const { phone, cell } = this.contactInfo;
      // if (!phone && !cell) {
      //   this.isPhoneMissing = true;
      //   // this.$refs.form.validate();
      //   return;
      // } else this.isPhoneMissing = false;

      if (!this.$auth.isAuthenticated) {
        this.$store.commit("property/update_current_property", {
          contactInfo: this.contactInfo,
        });
        this.$router.push({ name: "vc-tenants" });
        return;
      }

      /** Store contact information in database */
      try {
        const saveAsDefault = !this.contactInfos.length;
        const { data: newContactInfoId } = await useRequest({
          method: "post",
          path: "contactInfo",
          data: {
            contactInfo: this.contactInfo,
            saveAsDefault,
          },
          showLoading: true,
          throwError: true,
        });
        if (saveAsDefault) {
          const updateClient = {
            ...this.client,
            defaultContactInfoId: newContactInfoId,
            ...this.contactInfo,
          };
          this.$store.commit("set_client", updateClient);
        }

        await this.getAllContactInfos(newContactInfoId);
      } catch (e) {
        console.log("saveNewContact() error:", e);
      }
    },
    back() {
      this.$router.push({
        name: `${
          this.$route.name.includes("vc") ? "vc-" : ""
        }property-association-to-owner`,
      });
    },
    goToContactList() {
      if (!this.$auth.isAuthenticated) return this.back();

      this.showContactsList = true;
    },
    toggleForm() {
      this.showContactsList = false;

      this.contactInfo = {
        id: "",
        firstName: "",
        lastName: "",
        company: "",
        streetAddress: "",
        unitNo: "",
        city: "",
        state: "New Jersey",
        zipcode: "",
        phone: "",
        ext: "",
        cell: "",
        email: "",
      };
    },
    showContactInfoEditModal(info) {
      this.contactInfoEditDialog = true;
      this.selectedContactInfo = info;
    },
    async updateContactInfo() {
      this.contactInfoEditDialog = false;
      await useRequest({
        method: "post",
        path: "contactInfo",
        data: { contactInfo: this.selectedContactInfo },
        showLoading: true,
      });

      this.getAllContactInfos();
    },
    async getAllContactInfos(defaultContactId) {
      const { data } = await useRequest({
        path: `contactInfos`,
      });
      if (!data?.length) {
        this.showContactsList = false;
        return;
      }
      this.showContactsList = true;
      this.contactInfos = data;

      if (defaultContactId) {
        const contactInfo =
          data.find((info) => info.id === defaultContactId) || data[0];

        //* i'm doing this becaus the field would be invalid if the value is null.
        Object.keys(contactInfo).forEach((key) => {
          if (contactInfo[key] === null) {
            contactInfo[key] = "";
          }
        });
        if (!contactInfo.state) contactInfo.state = "New Jersey";
        this.contactInfo = contactInfo;
      }
    },
  },
};
</script>
<style>
.phone-with-ext {
  display: grid;
  grid-template-columns: 2fr 1fr;
  grid-gap: 20px;
}
</style>
