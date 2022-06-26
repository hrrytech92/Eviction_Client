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
      v-model="isValid"
      style="width: 80%"
      class="pt-10 pb-4 mx-auto text-left"
    >
      <div class="custom-title py-8">Lease Details</div>
      <div class="text-left">
        <div v-if="isNotCorporation">
          <FormLabel>
            Subsidized Housing
            <!-- <v-btn fab color="primary" x-small height="18" width="18" class="ml-2"><v-icon x-small>mdi-help</v-icon></v-btn> -->
          </FormLabel>
          <v-select
            v-model="newSection8"
            rounded
            solo
            flat
            dense
            background-color="#F0F5F6"
            :items="sections"
            @change="newSection8ChangeEvt"
          >
            <v-icon slot="append" medium color="accent">
              mdi-chevron-down
            </v-icon>
          </v-select>

          <div v-if="newSection8">
            <FormLabel>
              Types of Subsidized Housing
              <!-- <v-btn fab color="primary" x-small height="18" width="18" class="ml-2"><v-icon x-small>mdi-help</v-icon></v-btn> -->
            </FormLabel>
            <v-select
              v-model="newSection8Type"
              rounded
              solo
              flat
              dense
              background-color="#F0F5F6"
              :items="typesOfSubsidizedHousings"
              @change="newSection8TypeChangeEvt"
            >
              <v-icon slot="append" medium color="accent">
                mdi-chevron-down
              </v-icon>
            </v-select>

            <div
              v-if="
                newSection8 &&
                newSection8Type === 2 &&
                socialServicesOffice.housingAuthority
              "
              class="d-flex align-center justify-center selection-box mt-4 mb-8"
              style="width: 100%"
            >
              <v-container>
                <v-row no-gutters align="center">
                  <v-col
                    cols="7"
                    class="secondary--text"
                    style="font-size: 0.85rem"
                  >
                    <div class="font-weight-medium">
                      {{ socialServicesOffice.housingAuthority }}
                    </div>
                    <div>
                      {{
                        socialServicesOffice.to &&
                        "Attn: " + socialServicesOffice.to
                      }}
                    </div>
                    <div>{{ socialServicesOffice.address }}</div>
                    <div>{{ socialServicesOffice.address2 }}</div>
                    <div>
                      {{ socialServicesOffice.city }},
                      {{ socialServicesOffice.state }}
                      {{ socialServicesOffice.zipcode }}
                    </div>
                  </v-col>
                  <v-spacer />
                  <v-col cols="2">
                    <v-btn
                      color="accent_light"
                      class="btn--plain text-left"
                      text
                      @click="viewSocialServiceDialogOpen = true"
                    >
                      view
                    </v-btn>
                  </v-col>
                  <v-col cols="1">
                    <v-btn
                      color="accent_light"
                      class="btn--plain"
                      icon
                      small
                      @click="ssDialogOpen = true"
                    >
                      <v-icon small> $pencil </v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
              </v-container>
            </div>
            <div
              v-else-if="
                newSection8 &&
                newSection8Type === 2 &&
                !socialServicesOffice.housingAuthority
              "
              class="d-flex align-center justify-center selection mt-4 mb-8"
              style="width: 100%"
              @click="ssDialogOpen = true"
            >
              <span class="font-weight-medium" style="letter-spacing: 1.68px">
                SELECT OFFICE
              </span>
            </div>
            <div
              v-if="showSelectOfficeRequired"
              class="error--text mt-n8 mb-2 ml-3 text--lg"
              style="font-size: 16px"
            >
              Item is required
            </div>
          </div>
        </div>
        <FormLabel> Lease Start Date </FormLabel>
        <div @click="hasSkippedSelectOffice = true">
          <v-menu
            v-model="menu"
            :close-on-content-click="false"
            :nudge-right="40"
            transition="scale-transition"
            offset-y
            min-width="290px"
          >
            <!--eslint-disable-next-line-->
            <template v-slot:activator="scope">
              <v-text-field
                v-model="leaseStartDateFormatted"
                append-icon="$calendar"
                color="accent"
                rounded
                solo
                flat
                dense
                :rules="[required]"
                background-color="#F0F5F6"
                placeholder="MM/DD/YYYY"
                @blur="newLeaseStartDate = parseDate(leaseStartDateFormatted)"
                @click:append="menu = true"
              />
            </template>
            <v-date-picker
              v-model="newLeaseStartDate"
              no-title
              :show-current="false"
              color="primary"
              class="custom-date"
              :masks="masks"
              @input="menu = false"
            />
          </v-menu>
        </div>

        <div>
          <FormLabel>Rent Cycle</FormLabel>
          <v-text-field
            item-color="#F6F9FA"
            label="Monthly"
            rounded
            solo
            flat
            dense
            disabled
            background-color="#F0F5F6"
            class="pb-2 rent-cycle"
          />
          <!-- <v-select
            v-else
            v-model="newRentCycle"
            rounded
            solo
            flat
            dense
            background-color="#F0F5F6"
            :items="rentCycles"
            @change="
              () => {
                if (newRentCycle === 'Semi-monthly') {
                  newRentDueBy = [];
                }
              }
            "
          >
            <v-icon slot="append" medium color="accent">
              mdi-chevron-down
            </v-icon>
          </v-select> -->
        </div>

        <FormLabel>Rent Due By</FormLabel>
        <v-select
          v-model="newRentDueBy"
          rounded
          :multiple="newRentCycle === 'Semi-monthly'"
          solo
          flat
          dense
          :rules="rentDueByRule"
          background-color="#F0F5F6"
          :items="rentDueByItems"
          @input="limiter"
        >
          <v-icon slot="append" medium color="accent">
            mdi-chevron-down
          </v-icon>
        </v-select>

        <div v-if="!isSection8">
          <FormLabel>Current Rent Amount</FormLabel>
          <!-- :rules="[(v) => !isSection8, (v) => !!v || 'Item is required']" -->
          <v-text-field
            v-model="newRentAmount"
            rounded
            type="number"
            :rules="[required]"
            solo
            flat
            dense
            background-color="#F0F5F6"
            @keydown="handleRentAmountType"
          >
            <div slot="prepend-inner">$</div>
          </v-text-field>
        </div>

        <div v-if="!isSection8">
          <FormLabel>Lease Type</FormLabel>
          <!-- <v-menu v-model="showMenu" offset-y>
          <template v-slot:activator="{ on }"> -->
          <v-text-field
            v-model="leaseTypeDisplay"
            rounded
            solo
            flat
            dense
            background-color="#F0F5F6"
            readonly
          >
            <!-- <v-icon medium slot="append" color="accent" v-on="on"
            >mdi-chevron-down</v-icon
          > -->
          </v-text-field>
        </div>

        <!-- </template>

          <v-list dense>
            <template v-for="item in leaseTypes">
              <v-subheader
                v-if="item.header"
                :key="item.header"
                v-text="item.header"
                class="info--text font-weight-bold"
              ></v-subheader>
              <v-list-item
                v-else
                :key="item.title + item.category"
                @click="updateType(item)"
              >
                <v-list-item-title>{{ item.title }}</v-list-item-title>
              </v-list-item>
            </template>
          </v-list>
        </v-menu>-->

        <div v-if="isSection8">
          <FormLabel>Full Rent Amount</FormLabel>
          <v-text-field
            v-model="newSection8Subsidy"
            rounded
            type="number"
            solo
            flat
            dense
            background-color="#F0F5F6"
            :rules="[required]"
          >
            <div slot="prepend-inner">$</div>
          </v-text-field>
        </div>

        <div v-if="isSection8">
          <FormLabel>Monthly Tenant Portion</FormLabel>
          <v-text-field
            v-model="newSection8TenantPortion"
            rounded
            type="number"
            solo
            flat
            dense
            background-color="#F0F5F6"
            :rules="[required]"
          >
            <div slot="prepend-inner">$</div>
          </v-text-field>
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
        @click="back"
      >
        go back
      </v-btn>
      <v-btn
        rounded
        color="accent_light"
        class="px-8 mb-2 mt-4 white--text capital--btn"
        depressed
        :disabled="!isFormValid"
        @click="next"
      >
        continue
      </v-btn>
    </v-card-actions>
    <v-dialog v-model="ssDialogOpen" persistent value="''" max-width="800">
      <socialServicesDialog
        @close:dialog="closeSSDialog"
        @open-ss-dialog="openSSDialog"
        @update:office="updateOffice"
      />
    </v-dialog>
    <v-dialog
      v-model="verifySocialServicesDialogOpen"
      value="''"
      max-width="800"
    >
      <verifySocialServicesDialog
        :office="socialServicesOffice"
        @close:dialog="openSSDialog"
        @update:office="verifyOffice"
      />
    </v-dialog>
    <v-dialog v-model="viewSocialServiceDialogOpen" value="''" max-width="800">
      <viewSocialServiceDialog
        :office="socialServicesOffice"
        @close:dialog="viewSocialServiceDialogOpen = false"
        @open-ss-dialog="openSSDialog"
      />
    </v-dialog>
    <v-dialog v-model="section8UpcomingDialog" value="''" max-width="600">
      <CommonWarningDialog
        :dialog-data="dialogData"
        @close="section8UpcomingDialog = false"
        @submit="$router.push('/')"
      >
        <template v-slot:additional-content>
          <div style="margin-top: 20px; margin-bottom: 30px">
            How would you like to proceed?
          </div>
        </template>
      </CommonWarningDialog>
    </v-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import SocialServicesDialog from "@/components/dialogs/SocialServicesDialog";
import verifySocialServicesDialog from "@/components/dialogs/VerifySocialServicesDialog";
import viewSocialServiceDialog from "@/components/dialogs/ViewSocialServiceDialog";
import CommonWarningDialog from "@/components/dialogs/CommonWarningDialog";
export default {
  name: "LeaseDetails",
  components: {
    SocialServicesDialog,
    verifySocialServicesDialog,
    viewSocialServiceDialog,
    CommonWarningDialog,
  },
  data() {
    return {
      valid: false,
      isValid: false,
      section8UpcomingDialog: false,
      dialogData: {
        headerText: "Upcoming Feature",
        contentText:
          "We are currently working to support other types of Subsidized Housing. At this time, you may proceed only if the tenant is enrolled in the Section 8 Housing Voucher program.",
        confirmText: "Quit Form.",
        cancelText: "Continue",
      },
      typesOfSubsidizedHousings: [
        { text: "Public Housing", value: 1 },
        { text: "Section 8 Voucher", value: 2 },
        { text: "Section 8 HAP Contract", value: 3 },
        { text: "Other Subsidy Program", value: 4 },
      ],
      leaseTypes: [
        { header: "WRITTEN LEASE" },
        { title: "Residential", category: "Written" },
        { title: "Commercial", category: "Written" },
        { header: "ORAL LEASE" },
        { title: "Residential", category: "Oral" },
        { title: "Commercial", category: "Oral" },
      ],
      rentCycles: ["Monthly", "Weekly", "Semi-monthly"],
      alreadySaved: false,
      leaseTypeDisplay: "Written",
      leaseType: {
        title:
          this.case && this.case.leaseTypeTitle
            ? this.case.leaseTypeTitle
            : "Residential",
        category:
          this.case && this.case.leaseTypeCategory
            ? this.leaseTypeCategory
            : "Written",
      },
      newLeaseStartDate: "",
      newSection8: false,
      newSection8Type: 2,
      newRentCycle: "Monthly", // needs to be preset because does not appear for newSection8
      newRentDueBy: "",
      newRentAmount: null,
      newSection8Subsidy: null,
      newSection8TenantPortion: null,
      socialServicesOffice: {
        id: "",
        name: "",
        address: "",
        phone: "",
        email: "",
      },
      menu: false,
      showMenu: false,
      ssDialogOpen: false,
      verifySocialServicesDialogOpen: false,
      viewSocialServiceDialogOpen: false,
      allOffices: [],
      masks: {
        input: "MM/DD/YYYY",
      },
      leaseStartDateFormatted: "",
      required: (
        value //* 0's are fine
      ) => {
        if (value === 0) {
          return true;
        }
        return !!value || "Item is required";
      },
      hasSkippedSelectOffice: false,
    };
  },
  computed: {
    ...mapGetters({
      currentProperty: "property/currentProperty",
      case: "eviction/currentCase",
      caseSteps: "eviction/caseSteps",
    }),
    sections() {
      return [
        { text: "Yes", value: true },
        { text: "No", value: false },
      ];
    },
    rentDueByItems() {
      if (
        this.newRentCycle === "Monthly" ||
        this.newRentCycle === "Semi-monthly"
      ) {
        const result = [
          { text: "1st", value: 1 },
          { text: "2nd", value: 2 },
          { text: "3rd", value: 3 },
        ];
        for (let i = 4; i <= 20; i++) {
          result.push({ text: i + "th", value: i });
        }
        result.push({ text: "21st", value: 21 });
        result.push({ text: "22nd", value: 22 });
        result.push({ text: "23rd", value: 23 });
        for (let i = 24; i <= 30; i++) {
          result.push({ text: i + "th", value: i });
        }
        result.push({ text: "31st", value: 31 });

        return result;
      } else if (
        this.newRentCycle === "Weekly" ||
        this.newRentCycle === "Bi-weekly"
      ) {
        return [
          { text: "Sunday", value: 0 },
          { text: "Monday", value: 1 },
          { text: "Tuesday", value: 2 },
          { text: "Wednesday", value: 3 },
          { text: "Thursday", value: 4 },
          { text: "Friday", value: 5 },
          { text: "Saturday", value: 6 },
        ];
      } else return [];
    },
    isSection8() {
      return this.newSection8 === true;
    },
    isSection8VoucherType() {
      return this.newSection8Type === 2;
    },
    isIndividual() {
      return this.case && this.case.tenantType.toLowerCase() === "individual";
    },
    isNotCorporation() {
      if (typeof this.case.tenantType === "undefined") return false;

      return this.case && this.case.tenantType.toLowerCase() !== "corporation";
    },
    rentDueByRule() {
      if (this.newRentCycle === "Monthly") return [this.required];

      const rules = [];
      // console.log("newRentCycle :>> ", this.newRentCycle);
      if (
        this.newRentCycle === "Semi-monthly" &&
        Array.isArray(this.newRentDueBy) &&
        this.newRentDueBy.length > 0
      ) {
        const rule = (v) =>
          (v || "").length === 2 || "Please select two (2) dates.";
        rules.push(rule);
      }

      return rules;
    },
    isFormValid() {
      if (!this.newSection8) return this.isValid;
      return this.isValid && this.socialServicesOffice.address;
    },
    showSelectOfficeRequired() {
      return !this.socialServicesOffice.address && this.hasSkippedSelectOffice;
    },
  },
  watch: {
    // newRentDueBy(val) {
    //   if (Array.isArray(val) && !val.length) this.valid = false;
    // },
    newLeaseStartDate() {
      this.leaseStartDateFormatted = this.formatDate(this.newLeaseStartDate);
      this.hasSkippedSelectOffice = true;
    },
    newSection8(val) {
      this.$refs.form.resetValidation();
      if (val === true) {
        this.newRentCycle = "Monthly";
      }
      if (
        (this.newSection8Type === 1 ||
          this.newSection8Type === 3 ||
          this.newSection8Type === 4) &&
        val
      ) {
        this.section8UpcomingDialog = true;
      }
    },
    newSection8Type(val) {
      if ((val === 1 || val === 3 || val === 4) && this.newSection8) {
        this.section8UpcomingDialog = true;
      }
    },
    // $data: {
    //   handler: function (val) {
    //     if (
    //       (val.newSection8Type === 1 ||
    //         val.newSection8Type === 3 ||
    //         val.newSection8Type === 4) &&
    //       val.newSection8
    //     ) {
    //       this.valid = false;
    //       this.$store.commit("eviction/set_is_lease_details_data_valid", false);
    //     } else {
    //       if (val.newSection8Type === 2 && val.newSection8) {
    //         this.$store.commit(
    //           "eviction/set_is_lease_details_data_valid",
    //           true
    //         );
    //         this.valid = true;
    //       }
    //     }
    //   },
    //   deep: true,
    // },
  },
  async activated() {
    window.scrollTo(0, 0);
    // this.useNext = false;

    if (!this.allOffices.length) {
      const { data } = await this.$http.get(
        `${process.env.VUE_APP_URL}/socialServiceOffices`
      );
      this.allOffices = data;
    }
    this.fillData();
  },
  deactivated() {
    // if (!this.alreadySaved)
    this.saveData();
  },
  methods: {
    handleRentAmountType(e) {
      if (
        e.code === "Minus" ||
        (e.keyCode === 187 && e.shiftKey) ||
        e.keyCode === 188
      )
        e.preventDefault();
    },
    initSection8Data() {
      // this.newSection8Subsidy = "";
      // this.newSection8TenantPortion = "";
      // this.newSection8Type = this.case.section8Type || 2;
      // this.socialServicesOffice = this.case.publicHousingOfficeSection8 || {
      //   id: "",
      //   name: "",
      //   address: "",
      //   phone: "",
      //   email: "",
      // };
    },
    fillData() {
      const { leaseStartDate, rentDueBy, rentCycle } = this.case;
      if (leaseStartDate) {
        this.leaseStartDateFormatted =
          this.formatDate(leaseStartDate.slice(0, 10)) || "";
        this.newLeaseStartDate = leaseStartDate.slice(0, 10) || "";
      }

      if (rentDueBy) {
        if (typeof rentDueBy === "string")
          this.newRentDueBy = parseInt(rentDueBy);
        else this.newRentDueBy = rentDueBy;
      }

      this.newRentCycle = rentCycle || "Monthly";
      if (this.newRentCycle === "Semi-monthly")
        this.newRentDueBy = this.newRentDueBy.map((item) => Number(item));

      this.newRentAmount = this.case.rentAmount;
      this.newSection8 = !!this.case.section8;
      this.newSection8Type = this.case.section8Type || 2;
      this.newSection8Subsidy = this.case.section8Subsidy;
      this.newSection8TenantPortion = this.case.section8TenantPortion;
      if (this.case.publicHousingOfficeSection8)
        this.socialServicesOffice = this.case.publicHousingOfficeSection8;
    },
    newSection8ChangeEvt(val) {
      if (val) {
        if (this.newSection8Type === 2) {
          const currentCaseSteps = Object.assign({}, this.caseSteps);
          currentCaseSteps.legalFees.hide = true;
          // currentCaseSteps.additionalCharges.hide = true;
          this.$store.commit("eviction/update_steps", currentCaseSteps);
        }

        if (this.case.publicHousingOfficeSection8) return;
      } else {
        this.initSection8Data();

        const currentCaseSteps = Object.assign({}, this.caseSteps);
        currentCaseSteps.legalFees.hide = false;
        // currentCaseSteps.additionalCharges.hide = false;
        this.$store.commit("eviction/update_steps", currentCaseSteps);
      }
    },
    newSection8TypeChangeEvt(val) {
      if (this.newSection8 && val === 2) {
        const currentCaseSteps = Object.assign({}, this.caseSteps);
        currentCaseSteps.legalFees.hide = true;
        // currentCaseSteps.additionalCharges.hide = true;
        this.$store.commit("eviction/update_steps", currentCaseSteps);

        return;
      }

      const currentCaseSteps = Object.assign({}, this.caseSteps);
      currentCaseSteps.legalFees.hide = false;
      // currentCaseSteps.additionalCharges.hide = false;
      this.$store.commit("eviction/update_steps", currentCaseSteps);
    },
    openSSDialog() {
      this.viewSocialServiceDialogOpen = false;
      this.verifySocialServicesDialogOpen = false;
      this.ssDialogOpen = true;
    },
    updateType(item) {
      this.leaseType = item;
      this.leaseTypeDisplay = `${item.category}: ${item.title}`;
    },
    parseDate(date) {
      if (!date) return null;

      const [month, day, year] = date.split("/");
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    },
    formatDate(date) {
      if (!date) return null;

      const [year, month, day] = date.split("-");
      return `${month}/${day}/${year}`;
    },
    limiter(e) {
      Array.isArray(e) && e.length > 2 && e.pop();
    },
    async saveData() {
      if (!this.isValid) return;
      const leaseDetailsObj = {
        leaseTypeTitle: this.leaseType.title,
        leaseTypeCategory: this.leaseType.category,
        leaseStartDate: this.newLeaseStartDate,
        section8: this.newSection8,
        section8Type: this.newSection8Type,
        rentCycle: this.newRentCycle,
        rentDueBy: this.newRentDueBy,
        rentAmount: this.newRentAmount ?? null,
        section8Subsidy: this.newSection8Subsidy ?? null,
        section8TenantPortion: this.newSection8TenantPortion ?? null,
        publicHousingOfficeSection8: this.socialServicesOffice,
      };
      await this.$store.dispatch("eviction/updateCase", {
        caseData: leaseDetailsObj,
        submitted: false,
        logMessage: "LeaseDetails.vue:786",
        status: "leaseDetails",
      });
    },
    async next() {
      if (!this.isValid) return;
      // await this.saveData();
      this.$router.push({
        name: "vc-past-due-rent",
        params: { resetDataFromLeaseDetails: true },
      });
    },
    back() {
      this.$router.push({ name: "vc-tenants" });
    },
    closeDialog() {
      this.verifySocialServicesDialogOpen = false;
      this.viewSocialServiceDialogOpen = false;
    },
    updateOffice(office) {
      this.socialServicesOffice = office;
      this.ssDialogOpen = false;
    },
    verifyOffice(office) {
      this.socialServicesOffice = office;
      this.verifySocialServicesDialogOpen = false;
    },
    closeSSDialog() {
      this.ssDialogOpen = false;
    },
  },
};
</script>

<style>
.rent-cycle label {
  color: #003a60 !important;
}
</style>
