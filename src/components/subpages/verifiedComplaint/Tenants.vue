<template>
  <div class="secondary--text">
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
      <div class="custom-title pt-8">Tenant Information</div>

      <div class="custom-subtitle mb-4 mt-10">Tenant is a(n)...</div>
      <div class="pb-4">Select the option that best describes the tenant.</div>
      <div class="d-flex pt-6">
        <div
          class="d-flex align-center justify-center"
          :class="[
            tenantType === 'Individual' ? 'selection-selected' : 'selection',
          ]"
          @click="tenantType = 'Individual'"
        >
          <span class="font-weight-medium" style="letter-spacing: 1.68px"
            >INDIVIDUAL</span
          >
        </div>
        <div
          class="ml-8 d-flex align-center justify-center"
          :class="[
            tenantType === 'Corporation' ? 'selection-selected' : 'selection',
          ]"
          @click="tenantType = 'Corporation'"
        >
          <span class="font-weight-medium" style="letter-spacing: 1.68px"
            >CORPORATION</span
          >
        </div>
      </div>

      <div class="font-weight-medium mb-4 mt-12" style="font-size: 28px">
        Tenant <span v-if="tenantType !== 'Corporation'">Name</span>
      </div>
      <div v-show="tenantType !== 'Corporation'" class="pb-4">
        All persons on the lease, eighteen (18) years of age and older, must be
        added. They will be considered a Defendant in the suit. The court
        charges an additional fee for each Defendant after the first. We’ll
        calculate this for you. Add a line for each tenant.
      </div>
      <div v-show="tenantType === 'Corporation'" class="pb-4">
        Provide the name of the tenant's corporation, as it appears on the
        lease. Include tenant's DBA, if applicable.
      </div>

      <div class="font-weight-medium pb-2 pt-6">
        {{ tenantType === "Corporation" ? "Company" : "Full" }} Name
      </div>
      <div
        v-for="(tenant, index) in newTenants"
        :key="index"
        class="pb-2 d-flex"
      >
        <v-text-field
          v-model="tenant.name"
          rounded
          hide-details="auto"
          solo
          flat
          dense
          background-color="#F0F5F6"
          :rules="[(v) => !!v || 'Item is required']"
        />

        <div class="d-flex mb-4">
          <v-btn
            color="info"
            icon
            tile
            class="btn--plain"
            :class="{
              'hidden-item': index === 0,
            }"
            @click="deleteItem(index, tenant)"
          >
            <v-icon style="font-size: 28px"> mdi-close-circle-outline </v-icon>
          </v-btn>

          <v-btn
            color="accent"
            :class="{
              'hidden-item': index !== newTenants.length - 1,
            }"
            icon
            class="btn--plain"
            tile
            @click="addTenant"
          >
            <v-icon style="font-size: 28px"> mdi-plus-circle-outline </v-icon>
          </v-btn>
        </div>
      </div>

      <div class="custom-subtitle mb-4 mt-12">Contact Information</div>
      <div class="pb-4">
        The court may need to reach the tenant regarding this matter. Please
        provide the most recent contact information you have for the tenant.
      </div>

      <span v-if="tenantType === 'Corporation'">
        <div class="font-weight-medium py-2">Name</div>
        <v-text-field
          v-model="tenantContactName"
          rounded
          hide-details="auto"
          solo
          flat
          dense
          background-color="#F0F5F6"
          class="pb-4"
          :rules="[(v) => !!v || 'Item is required']"
        />
      </span>

      <TextField
        title="Email Address"
        :field.sync="tenantEmail"
        rules-type="none"
      />

      <!-- <div class="font-weight-medium py-2">Phone Number</div> -->
      <PhoneField
        title="Mobile Phone"
        :field.sync="tenantCell"
        icon="$cellphone"
        rules-type="none"
      />
      <div class="phone-with-ext">
        <PhoneField
          title="Home/Office Phone"
          :field.sync="tenantPhone"
          icon="$phone"
          rules-type="none"
        />
        <TextField title="Ext" :field.sync="tenantExt" rules-type="none" />
      </div>
      <!-- <PhoneFields
        rules-type="none"
        :phone.sync="tenantPhone"
        :phoneType.sync="tenantPhoneType"
        :ext.sync="tenantExt"
        :setPhoneType="setPhoneType"
      /> -->
      <div v-if="hasTenantsReside">
        <div class="custom-subtitle mb-4 mt-12">Mailing Address</div>
        <div class="pb-4">
          Provide the tenant’s mailing address. We’ve used the property address
          as the default; edit if not correct. This address will be used by the
          court for service, correspondence and other communication.
        </div>

        <div
          class="d-flex align-center justify-center selection-box mt-2"
          style="width: 100%"
        >
          <v-container class="px-8">
            <v-row no-gutters align="center">
              <v-col cols="7" class="secondary--text">
                <div>
                  {{ mailingAddress.address
                  }}{{ mailingAddress.unit ? `, ${mailingAddress.unit}` : "" }}
                </div>
                <div>
                  {{ mailingAddress.city }}, {{ mailingAddress.state }}
                  {{ mailingAddress.zipcode }}
                </div>
              </v-col>
              <v-spacer />
              <v-col cols="1" class="d-flex justify-end">
                <v-btn
                  color="accent_light"
                  class="btn--plain"
                  icon
                  small
                  @click="mailingDialogOpen = true"
                >
                  <v-icon small> $pencil </v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
        </div>
      </div>
      <div v-else>
        <div class="custom-subtitle mb-4 mt-12">Service Address</div>
        <div class="pb-4">
          Each person listed as a defendant in this suit must be served with a
          copy of the <strong>Verified Complaint</strong> and Tenant Summons.
          Please confirm all tenants reside at the following address, or update.
          If the address provided is not correct, the court may return the
          complaint to you.
        </div>

        <div
          class="d-flex align-center justify-center selection-box mt-2"
          style="width: 100%"
        >
          <v-container class="p-8">
            <v-row no-gutters align="center">
              <v-col cols="7" class="secondary--text">
                <div>
                  {{ mailingAddress.address
                  }}{{ mailingAddress.unit ? `, ${mailingAddress.unit}` : "" }}
                </div>
                <div>
                  {{ mailingAddress.city }}, {{ mailingAddress.state }}
                  {{ mailingAddress.zipcode }}
                </div>
              </v-col>
              <v-spacer />
              <v-col cols="1" class="d-flex justify-end">
                <v-btn
                  color="accent_light"
                  class="btn--plain"
                  icon
                  small
                  @click="editServiceAddress"
                >
                  <v-icon small> $pencil </v-icon>
                </v-btn>
              </v-col>
              <v-col cols="1" class="pr-2 d-flex justify-end">
                <Checkbox v-model="mailingAddress.checked" />
              </v-col>
            </v-row>
          </v-container>
        </div>
        <div class="d-flex mb-4 mt-12">
          <v-btn
            color="accent_light"
            class="btn--plain"
            icon
            small
            @click="addTenantAddress"
          >
            <v-icon middle color="primary"> mdi-plus-circle </v-icon>
          </v-btn>
          Additional tenant address
        </div>
      </div>
    </v-form>
    <v-dialog v-model="isUpcomingFeatureWarningOpen" :max-width="500">
      <UpcomingFeatureDialog
        :property="currentProperty"
        :bodyText="upcomingFeatureBodyText"
        @close:dialog="isUpcomingFeatureWarningOpen = false"
        @add="addTenantDialog"
      />
    </v-dialog>
    <v-dialog v-model="mailingDialogOpen" :max-width="800">
      <TenantServiceAddressDialog
        :has-tenants-reside="hasTenantsReside"
        :tenants="newTenants"
        :mailing-address="mailingAddress"
        @close:dialog="mailingDialogOpen = false"
        @add="addMailingAddress"
      />
    </v-dialog>
    <v-card-actions
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
        :disabled="!isValid"
        @click="next"
      >
        continue
      </v-btn>
    </v-card-actions>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import TenantServiceAddressDialog from "@/components/dialogs/TenantServiceAddressDialog";
import UpcomingFeatureDialog from "@/components/dialogs/UpcomingFeatureDialog";
import Checkbox from "@/components/Checkbox";
// import PhoneFields from "@/components/fields/PhoneFields";
export default {
  name: "Tenants",
  components: {
    TenantServiceAddressDialog,
    UpcomingFeatureDialog,
    Checkbox,
    // PhoneFields,
  },
  props: {},
  data() {
    return {
      mailingAddress: {},
      tenantsList: {},
      mailingDialogOpen: false,
      mailingAddressChanged: false,
      isUpcomingFeatureWarningOpen: false,
      tenantInfoCorrect: "",
      newTenants: [{ name: "" }],
      tenantType: "",
      tenantPhone: "",
      tenantExt: "",
      tenantPhoneType: "",
      tenantCell: "",
      tenantEmail: "",
      tenantContactName: "",
      tenantsSaved: true,
      tenantCompanyName: "",
      loading: false,
      tenantsOnFile: false,
      valid: false,
      emailRules: [
        (v) => !!v || "E-mail is required",
        (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
      ],
      useNext: false,
      upcomingFeatureBodyText: "",
    };
  },
  computed: {
    ...mapGetters({
      currentProperty: "property/currentProperty",
      case: "eviction/currentCase",
    }),
    tenantsRecorded() {
      return this.tenantsOnFile;
    },
    hasTenantsReside() {
      return this.tenantType === "Corporation";
    },
    isValid() {
      return this.valid && this.tenantType;
    },
  },
  // watch: {
  //   currentProperty() {
  //     if (!this.mailingAddress.streetAddress) {
  //       this.initialSetUp();
  //     }
  //   },
  // },
  // mounted() {
  //   this.initialSetUp();
  // },
  activated() {
    window.scrollTo(0, 0);
    this.useNext = false;
    this.initialSetUp();
    // if (this.case.status === "Property") {
    //   this.$store.dispatch("eviction/updateCase", {
    //     lastStep: "Tenant Information",
    //   });
    // }
  },
  deactivated() {
    this.saveData();
  },
  watch: {
    tenantType(type) {
      // console.log("type :>> ", type);
      if (type === "Corporation") {
        const firstTenant = this.case.tenants[0] || {};
        console.log("firstTenant :>> ", firstTenant);
        if (!firstTenant.mailingAddressStreet) return;
        this.mailingAddress = {
          address: firstTenant.mailingAddressStreet,
          unit: firstTenant.mailingAddressUnit,
          city: firstTenant.mailingAddressCity,
          state: firstTenant.mailingAddressState,
          zipcode: firstTenant.mailingAddressZip,
          checked: true,
        };
      } else {
        //Individual
        const property = this.currentProperty || {};
        this.mailingAddress = {
          address: property.streetAddress,
          unit: property.unitNo,
          city: property.city,
          state: property.state,
          zipcode: property.zipcode,
          checked: true,
        };
      }
    },
  },
  methods: {
    initialSetUp() {
      // console.log("this.case :>> ", this.case);
      const property = this.currentProperty || {};
      this.mailingAddress = {
        address: property.streetAddress,
        unit: property.unitNo,
        city: property.city,
        state: property.state,
        zipcode: property.zipcode,
        checked: true,
      };

      if (!this.case.tenants?.length) return;
      const {
        tenantEmail,
        tenantPhone,
        tenantPhoneType,
        tenantExt,
        tenantCell,
        tenantContactName,
        tenantType,
      } = this.case;

      this.tenantsOnFile = true;
      this.newTenants = this.case.tenants;
      this.tenantInfoCorrect = "yes";
      // All tentants should be the same contact informations
      this.tenantEmail = tenantEmail;
      this.tenantContactName = tenantContactName;
      this.tenantPhone = tenantPhone;
      this.tenantPhoneType = tenantPhoneType || "home";
      this.tenantExt = tenantExt;
      this.tenantCell = tenantCell;

      // Capitalize the first letter
      this.tenantType =
        tenantType.charAt(0).toUpperCase() + tenantType.slice(1);
    },
    setPhoneType(type) {
      this.tenantPhoneType = type;
    },
    addTenant() {
      this.newTenants.push({ name: "" });
    },
    addTenantDialog() {},
    async deleteItem(index, tenant) {
      this.$delete(this.newTenants, index);

      if (!this.$store.getters.isAuthenticated) {
        if (sessionStorage.getItem("case")) {
          sessionStorage.setItem(
            "case",
            JSON.stringify({
              ...JSON.parse(sessionStorage.getItem("case")),
              tenants: this.newTenants,
            })
          );
        }
        return;
      }
      if (typeof tenant.caseTenantId !== "undefined") {
        await this.$http.post(
          `${process.env.VUE_APP_URL}/api/delete-tenant-with-case-id-relation`,
          {
            caseTenantId: tenant.caseTenantId,
            caseId: this.case.id,
          }
        );
      }
      await this.saveData();
    },
    addMailingAddress(address) {
      this.mailingAddressChanged = true;
      this.mailingAddress = address;
      this.mailingDialogOpen = false;
    },
    async saveData() {
      if (this.useNext) return;
      if (!this.isValid) return;

      await this.$store.dispatch("eviction/updateCase", {
        caseData: {
          tenantInfoCorrect: this.tenantInfoCorrect,
          tenantsSaved: this.tenantsSaved,
          tenants: this.newTenants,
          tenantType: this.tenantType,
          tenantPhone: this.tenantPhone,
          tenantExt: this.tenantExt,
          tenantPhoneType: this.tenantPhoneType,
          tenantCell: this.tenantCell,
          tenantEmail: this.tenantEmail,
          tenantContactName: this.tenantContactName,
          tenantMailingAddress: this.getTenantMailingAddress(),
          tenantCompanyName: this.tenantCompanyName,
        },
        status: "tenant",
      });
    },
    getTenantMailingAddress() {
      let tenantMailingAddr;

      if (!this.$store.getters.isAuthenticated && this.mailingAddress.checked) {
        tenantMailingAddr = this.mailingAddress;
      } else {
        tenantMailingAddr =
          this.mailingAddressChanged && this.mailingAddress.checked
            ? this.mailingAddress
            : {};
      }

      return tenantMailingAddr;
    },
    addTenantAddress() {
      this.upcomingFeatureBodyText = `We are currently working on a feature that will allow you to proceed
        when defendants requiring service have a different residence. This is
        often the case with co-signers. At this time, you may proceed only if
        all defendants listed in this case reside in the same property.`;
      this.isUpcomingFeatureWarningOpen = true;
    },
    editServiceAddress() {
      // mailingDialogOpen = true
      this.upcomingFeatureBodyText = `We are currently working on a feature that will allow you to enter an address other than that of the rental property to serve the defendants. At this time, you may only proceed if all of the defendants listed in this case reside at the rental property.`;
      this.isUpcomingFeatureWarningOpen = true;
    },
    next() {
      this.saveData();
      this.useNext = true;

      // this.valid = this.$refs.form.validate();

      this.$router.push({ name: "vc-lease-details" });
    },
    back() {
      this.$router.push({
        name: "vc-client-contact",
        params: { id: this.case.id || "new" },
        // query: { status: this.currentProperty.status },
      });
    },
  },
};
</script>

<style>
.primary-input-field.theme--light.v-text-field--solo
  > .v-input__control
  > .v-input__slot {
  background-color: #4dccc4;
}
.primary-input-field.v-text-field.v-text-field--solo
  .v-input__control
  input::placeholder,
.primary-input-field.v-text-field.v-text-field--solo .v-input__control input {
  color: white;
  text-align: center;
}
</style>
