<template>
  <div>
    <!-- <button @click="sendOrderDetailsEmail" style="color: red">
      Test Email
    </button> -->
    <div
      v-if="showWarningMessage"
      class="eviction-banner custom-banner"
      style="width: 80%; margin: 40px auto 0"
    >
      <v-icon
        class="accent--text close-icon"
        @click="showWarningMessage = false"
      >
        mdi-close
      </v-icon>
      <i class="icofont-exclamation-circle icofont-2x accent--text" />
      <div class="text-part">
        <h4 class="accent--text banner-title">YOUR NEXT STEPS</h4>
        <p class="ma-0 secondary--text">
          After you file, the court will send you a notification that includes
          the case number and instructions for your next steps. In a few days,
          we'll follow up with you to add this information to your case file.
          This will help keep track of your case. For any questions pertaining
          to your proceeding, contact the court or seek legal counsel.
        </p>
      </div>
    </div>

    <div class="mx-auto secondary--text" style="width: 60%; margin-top: 40px">
      <div class="custom-title pt-8 pb-4">
        {{ title }}
      </div>
      <div class="pb-6">
        <div>
          Thank you for using File Eviction. We’ll email you a copy of your
          invoice and<span v-if="isCLRSOnlyOrder">
            the Certification for Lease and Registration Statement for your
            records. You may access this from your dashboard at any time.</span
          ><span v-else>
            invoice and documents for your records. Access them any time from
            your dashboard.</span
          >
          While you’re here,
          <span
            style="color: #6a7fdb; cursor: pointer"
            @click="
              $smoothScroll({
                scrollTo: $refs.instructionsSection,
                duration: 1000,
                offset: -50,
              })
            "
          >
            scroll down
          </span>
          to access the document and view filing instructions.
          <span v-if="!isCLRSOnlyOrder"
            >As a reminder, you are responsible for ensuring that the documents
            are true and correct, and that you follow the courts’ procedures
            when you file them with the court and initiate the eviction
            suit.</span
          >
        </div>
      </div>
      <div style="padding-bottom: 40px">
        NOTE: <u>You</u> are responsible for filing with the court.
      </div>

      <div />
      <v-container fluid class="pa-0 mb-4">
        <v-row no-gutters justify-center>
          <v-col cols="12">
            <v-container>
              <v-row>
                <div
                  class="order-detail-upper-bar align-center d-flex"
                  style="padding: 40px"
                >
                  <v-col>
                    <v-row class="pt-0 pb-0">
                      <v-col class="pt-0 pb-0">
                        <span
                          class="font-weight-medium info--text text-uppercase"
                          >ORDER</span
                        >
                      </v-col>
                    </v-row>
                    <v-row class="pt-0 pb-0">
                      <v-col class="pt-0 pb-0">
                        {{ currentOrder.orderNumber }}
                      </v-col>
                    </v-row>
                  </v-col>
                  <v-col>
                    <v-row class="pt-0 pb-0">
                      <v-col class="pt-0 pb-0">
                        <span
                          class="font-weight-medium info--text text-uppercase"
                          >DATE</span
                        >
                      </v-col>
                    </v-row>
                    <v-row class="pt-0 pb-0">
                      <v-col class="pt-0 pb-0">
                        {{ getOrderDate }}
                      </v-col>
                    </v-row>
                  </v-col>
                  <v-col>
                    <v-row class="pt-0 pb-0">
                      <v-col class="pt-0 pb-0">
                        <span
                          class="font-weight-medium info--text text-uppercase"
                          >PRINT INVOICE</span
                        >
                      </v-col>
                    </v-row>
                    <v-row class="pt-0 pb-0 pl-10">
                      <v-col class="pt-0 pb-0">
                        <i
                          class="icofont-file-pdf icofont-lg accent2--text"
                          style="cursor: pointer"
                          @click="printInvoice"
                        />
                      </v-col>
                    </v-row>
                  </v-col>
                </div>
              </v-row>
            </v-container>
          </v-col>
        </v-row>
      </v-container>

      <v-container fluid class="pa-0" style="height: 60px">
        <v-row no-gutters justify-center>
          <v-container>
            <v-row>
              <v-col cols="7">
                <span class="pl-8 font-weight-medium info--text text-uppercase"
                  >ITEM</span
                >
              </v-col>
              <v-col
                ><span class="pl-8 font-weight-medium info--text text-uppercase"
                  >PRICE</span
                ></v-col
              >
            </v-row>
          </v-container>
        </v-row>
      </v-container>
      <v-container
        v-for="(item, index) in items"
        :key="item.id"
        fluid
        class="pa-0 mb-4"
      >
        <v-row no-gutters justify-center>
          <v-col cols="12">
            <v-container>
              <v-row style="position: relative">
                <div
                  class="elevated-bar align-center d-flex"
                  @click="toggleComplaintsAndSummons({ item, index })"
                >
                  <v-col cols="7" style="padding: 30px">
                    <div class="text-left pl-8">
                      {{ item.title }}
                    </div>
                    <div
                      class="text-left pl-8 font-weight-light"
                      style="font-size: 20px"
                    >
                      {{ currentProperty.streetAddress
                      }}{{ getUnitNoString(currentProperty.unitNo) }},
                      {{ currentProperty.city }}, {{ currentProperty.state }}
                      {{ currentProperty.zipcode }}
                    </div>
                  </v-col>
                  <v-col cols="2">
                    <div class="text-left pl-8 primary--text">
                      ${{ item.cost }}
                    </div>
                  </v-col>
                  <v-col
                    style="height: 100%"
                    cols="3"
                    class="pa-0 d-flex justify-end"
                  >
                    <div
                      class="elevated-bar-btn d-flex align-center justify-center"
                    >
                      <v-icon
                        style="font-size: 75px; color: #93aebf; height: 100%"
                      >
                        mdi-menu-{{ item.opened ? "up" : "down" }}
                      </v-icon>
                    </div>
                  </v-col>
                </div>
              </v-row>
              <v-row v-if="item.opened" class="mt-4">
                <v-col cols="7">
                  <div
                    class="text-left pl-8 font-weight-medium"
                    style="font-size: 26px"
                  >
                    Includes
                  </div>
                </v-col>
                <v-col cols="2">
                  <div
                    class="text-left pl-8 font-weight-medium"
                    style="font-size: 26px"
                  >
                    $0.00
                  </div>
                </v-col>
                <v-col cols="3">
                  <div
                    class="text-left pl-8 font-weight-medium info--text"
                    style="font-size: 26px"
                  >
                    —
                  </div>
                </v-col>
              </v-row>
              <div v-if="item.opened">
                <v-row
                  v-for="(
                    complaintsAndSummon, complaintIndex
                  ) in complaintsAndSummonsDocumentList"
                  :key="complaintIndex"
                >
                  <v-col style="padding-top: 0; padding-bottom: 0">
                    <div class="text-left pl-8" style="font-size: 22px">
                      {{ complaintsAndSummon }}
                    </div>
                  </v-col>
                </v-row>
              </div>

              <v-row v-if="item.opened" style="margin-top: 70px">
                <hr class="ml-10" style="width: 80%" />
              </v-row>

              <v-row v-if="item.opened" class="mt-4">
                <v-col cols="7">
                  <div
                    class="text-left pl-8 font-weight-medium"
                    style="font-size: 26px"
                  >
                    Software
                  </div>
                </v-col>
                <v-col cols="5">
                  <div
                    class="text-left pl-8 font-weight-medium"
                    style="font-size: 26px"
                  >
                    $0.00
                  </div>
                </v-col>
              </v-row>
            </v-container>
          </v-col>
        </v-row>
      </v-container>

      <v-container fluid class="pa-0 mb-4 mt-12">
        <v-row justify-center style="width: 90%">
          <v-col
            v-for="(totalPriceItem, index) in totalPriceItems"
            :key="index"
            cols="4"
          >
            <v-card
              elevation="0"
              class="order-detail-upper-bar d-flex justify-center align-center flex-column"
              :class="[
                totalPriceItem.header_tag === 'Total' ? 'total-box-style' : '',
              ]"
            >
              <div>
                <div
                  :class="
                    totalPriceItem.header_tag === 'Total'
                      ? 'white--text'
                      : 'grey--eviction-text'
                  "
                  class="font-weight-medium text-uppercase"
                >
                  {{ totalPriceItem.header_tag }}
                </div>
                <div
                  :class="
                    totalPriceItem.header_tag === 'Total'
                      ? 'white--text'
                      : 'price--text'
                  "
                  class="font-weight-bold text-uppercase"
                  style="font-size: 26px; margin-top: 7px"
                >
                  ${{ totalPriceItem.price }}
                </div>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-container>

      <div ref="instructionsSection" class="custom-title pt-8 pb-10">
        Instructions
      </div>

      <div class="d-flex pb-12">
        <div class="pr-8">
          <i
            :class="isEfile ? 'icofont-cloud-download' : 'icofont-print'"
            class="icofont-2x info--text"
          />
        </div>
        <div>
          <div
            class="text-left font-weight-medium info--text text-uppercase pb-2"
          >
            {{ isEfile ? "Download" : "Print" }}
          </div>
          <div v-if="isCLRSOnlyOrder">
            Click to download <span v-if="isEfile">and print </span>your
            document and filing instructions.
          </div>
          <div v-else>
            Click to download and
            <span v-if="isEfile">and print </span> pleadings, other court
            documents, and filing instructions.
          </div>
          <v-btn
            color="accent2"
            depressed
            class="white--text mt-4 px-12"
            rounded
            @click="printPleadingsBtnAction"
          >
            {{ isEfile ? "Download" : "print" }}
          </v-btn>
        </div>
      </div>

      <div class="d-flex pb-12">
        <div class="pr-8">
          <i class="icofont-bill-alt icofont-2x info--text" />
        </div>
        <div>
          <div
            class="text-left font-weight-medium info--text text-uppercase pb-2"
          >
            FILING FEE
          </div>
          <div v-if="isCLRSOnlyOrder">
            There is no fee associated with filing this document.
          </div>
          <div v-else>
            Submit payment in the amount of
            <span class="font-weight-bold">${{ courtFee }}</span
            ><span>. This includes a $50.00 filing fee</span
            ><span v-if="!additionalTenants"> and a $7.00 mileage fee.</span>
            <span v-else
              >, a $7.00 mileage fee, and $5.00 for each additional defendant
              ({{ additionalTenants }}).
            </span>
            <span v-if="!isEfile">
              Checks and money orders should be payable to the
              <span class="font-weight-bold font-italic">
                Treasurer, State of New Jersey</span
              >.
            </span>
          </div>
        </div>
      </div>

      <!-- Other Components here -->
      <EFile v-if="isEfile" :isCLRSOnlyOrder="isCLRSOnlyOrder" />
      <MailIn v-else-if="currentCase.filingPlan === 'MAIL IN'" />
      <InPerson v-else />
      <!-- Court Information -->
      <!-- <div class="d-flex pb-12">
        <div class="pr-8">
          <i class="icofont-court icofont-2x info--text" />
        </div>
        <div>
          <div
            class="text-left font-weight-medium info--text text-uppercase pb-2"
          >
            Court Information
          </div>
          <div class="font-weight-bold">
            {{ courtInfo.county }} County Courthouse
          </div>
          <div>
            {{ courtInfo.street }}
          </div>
          <div>
            {{ courtInfo.city }}, {{ courtInfo.state }} {{ courtInfo.zipcode }}
          </div>
        </div>
      </div> -->
      <!--Section 8  -->
      <div v-if="currentCase.section8 && !isCLRSOnlyOrder" class="d-flex pb-12">
        <div class="pr-8">
          <i class="icofont-building-alt icofont-2x info--text" />
        </div>
        <div>
          <div
            class="text-left font-weight-medium info--text text-uppercase pb-2"
          >
            SECTION 8
          </div>
          <div class="pb-2">
            Mail a copy of the
            <span class="font-weight-bold">Verified Complaint</span> to the
            Public Housing Office.
          </div>
          <div class="font-weight-bold">
            {{ section8Office.housingAuthority }}
          </div>
          <!-- <div>
            {{ section8Office.address }}
          </div> -->

          {{ section8Office.to && "Attn: " + section8Office.to }}
          <div>{{ section8Office.address }}</div>
          <div>{{ section8Office.address2 }}</div>
          <div>
            {{ section8Office.city }},
            {{ section8Office.state }}
            {{ section8Office.zipcode }}
          </div>
          <div>
            {{ section8Office.phone }}
          </div>
          <div>
            {{ section8Office.email }}
          </div>
          <div></div>
        </div>
      </div>

      <!-- Past Due Rent Calculations  -->
      <OrderDetailsPasdDueRentCalcs v-if="!isCLRSOnlyOrder" />
      <!-- <OrderDetailsPasdDueRentCalcsOld v-if="!isCLRSOnlyOrder" /> -->

      <!--Questions  -->
      <div class="d-flex" style="padding-bottom: 70px">
        <div class="pr-8">
          <i class="icofont-question-circle icofont-2x info--text" />
        </div>
        <div>
          <div
            class="text-left font-weight-medium info--text text-uppercase pb-2"
          >
            QUESTIONS
          </div>
          <div class="pb-4">
            For questions pertaining to filing, or issues concerning clerical
            errors on the form, contact:
          </div>
          <div>Special Civil Part</div>
          <div class="font-weight-bold">
            {{ courtInfo.county }} County Courthouse
          </div>
          <div class="pb-12">
            {{ courtInfo.phone }}
          </div>
          <div class="pb-4">
            For questions pertaining to filing fee, contact:
          </div>
          <div>Treasury Department</div>
          <div class="font-weight-bold">
            {{ courtInfo.county }} County Courthouse
          </div>
          <div class="pb-12">
            {{ courtInfo.phone }}
          </div>
        </div>
      </div>
    </div>

    <div class="mx-auto secondary--text" style="width: 85%">
      <v-container fluid class="container-order-details-redirect mt-5">
        <v-row align="center" justify="center" class="h-full">
          <v-col cols="6">
            <v-row
              style="font-size: 28px"
              class="font-weight-medium"
              align="center"
              justify="center"
            >
              You’re all set. Where would you like to go?
            </v-row>
            <v-row
              style="font-size: 28px"
              class="font-weight-medium mt-10"
              align="center"
              justify="center"
            >
              <v-btn
                rounded
                dark
                class="px-12 capital--btn mr-7 order-details-bottom-button"
                depressed
                outlined
                color="primary"
                style="border: 3px solid #4dccc4; padding: 20px !important"
                @click="
                  $router.push({
                    name: isCLRSOnlyOrder ? 'saf-signature' : 'vc-signature',
                  })
                "
              >
                go back
              </v-btn>
              <v-btn
                rounded
                :color="'primary'"
                dark
                class="px-12 capital--btn order-details-bottom-button"
                depressed
                style="padding: 23px !important"
                @click="$router.push({ name: 'main' })"
              >
                dashboard
              </v-btn>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </div>

    <v-dialog v-model="printPleadingsDialog" value="''" max-width="900">
      <PrintPleadingsDialog
        :isCLRSInFlow="isCLRSInFlow"
        @close:dialog="printPleadingsDialog = false"
      />
    </v-dialog>
  </div>
</template>

<script>
import EFile from "@/components/order-details-filing-types/EFile";
import InPerson from "@/components/order-details-filing-types/InPerson";
import MailIn from "@/components/order-details-filing-types/MailIn";
import PrintPleadingsDialog from "@/components/dialogs/PrintPleadingsDialog";
import getPleadingMixin from "@/mixins/get-pleading";
import ViewSupport from "@/mixins/view-support";
import { mapGetters } from "vuex";
import OrderDetailsPasdDueRentCalcs from "../OrderDetailsPasdDueRentCalcs.vue";
// import OrderDetailsPasdDueRentCalcsOld from "../OrderDetailsPasdDueRentCalcsOld.vue";

// eslint-disable-next-line
export default {
  props: {
    // orderDetailsProp: Object,
    landedFromCaseView: Boolean,
  },
  name: "OrderDetails",
  components: {
    PrintPleadingsDialog,
    EFile,
    InPerson,
    MailIn,
    OrderDetailsPasdDueRentCalcs,
    // OrderDetailsPasdDueRentCalcsOld,
  },
  mixins: [ViewSupport, getPleadingMixin],
  data() {
    return {
      showWarningMessage: false,
      printPleadingsDialog: false,
      open: "Full Eviction: Self-File",
      title: "Order Details",
      items: [],
      isCLRSOnlyOrder: false,
      orderInfo: {},
      // docs: "Verified Complaint and Tenant Summons",
      complaintsAndSummons: [
        "Verified Complaint",
        "Landlord Verification",
        "Tenant Summons",
        "Cover Letters",
        "Landlord Case Information Statement",
      ],
      totalPriceItems: [
        {
          header_tag: "Discount",
          price: "0.00",
        },
        {
          header_tag: "Subtotal",
          price: "0.00",
        },
        {
          header_tag: "Total",
          price: "0.00",
        },
      ],
    };
  },
  computed: {
    ...mapGetters({
      currentCase: "eviction/currentCase",
      currentProperty: "property/currentProperty",
      courtInfo: "eviction/courtInfo",
      currentOrder: "eviction/currentOrder",
      client: "client",
    }),
    direction() {
      return (name) => (name === this.open ? "up" : "down");
    },
    isEfile() {
      return this.currentCase.filingPlan === "E-FILE";
    },
    getOrderDate() {
      // const createdAt =
      //   this.orderDetailsProp &&
      //   typeof this.orderDetailsProp.created_at !== "undefined"
      //     ? this.orderDetailsProp.created_at
      //     : this.orderDetails.created_at;

      // return this.$dayjs(createdAt).format("MM/DD/YYYY");
      return this.$dayjs(this.currentOrder.created_at).format("MM/DD/YYYY");
    },
    section8Office() {
      return this.currentCase.section8
        ? this.currentCase.publicHousingOfficeSection8
        : {};
    },
    additionalTenants() {
      return this.currentCase.tenants?.length - 1;
    },
    // findOrderNumberFromOrderDetailsItems() {
    //   return this.orderDetails.items?.find(
    //     (item) => item.orderNumber === this.orderNumber
    //   );
    // },
    complaintsAndSummonsDocumentList() {
      // if (this.currentCase.isClrsStandaloneFormTouched === 1) {
      if (this.isCLRSOnlyOrder) {
        return ["Certification of Lease and Registration Statement"];
      }

      const complaintsAndSummons = [
        "Verified Complaint",
        "Landlord Verification",
        "Tenant Summons",
        "Cover Letters",
        "Landlord Case Information Statement",
      ];

      // if (this.findOrderNumberFromOrderDetailsItems) {
      //   if (
      //     this.findOrderNumberFromOrderDetailsItems.orderDocumentListType === 2
      //   ) {
      //     complaintsAndSummons.push(
      //       "Certification of Lease and Registration Statement"
      //     );
      //   }
      // }
      if (this.isCLRSInFlow)
        complaintsAndSummons.push(
          "Certification of Lease and Registration Statement"
        );

      return complaintsAndSummons;
    },
    courtFee() {
      const calculateTotalCourtFee =
        50 + 7 + 5 * (this.currentCase.tenants?.length - 1);
      return parseFloat(calculateTotalCourtFee).toFixed(2);
    },
  },
  async mounted() {
    window.scrollTo(0, 0);
    // console.log("this.landedFromCaseView :>> ", this.landedFromCaseView);
    await this.$store.dispatch("eviction/loadCourtInfo");

    if (!this.landedFromCaseView) {
      let flowType = "01";
      if (this.$router.currentRoute.meta === "single") flowType = "02";
      await this.$store.dispatch("eviction/getCaseOrders", {
        caseId: this.currentCase.id,
        flowType,
        logMessage: "OrderDetails.vue at line 729",
      });
    }

    // this.getOrderNumber();
    // if (this.orderDetailsProp) {
    //   const viewType = this.orderDetailsProp.viewType === 2 ? 1 : 0;
    //   this.$store.commit("eviction/update_current_case", {
    //     isClrsStandaloneFormTouched: viewType,
    //   });
    // }

    // if (
    //   this.findOrderNumberFromOrderDetailsItems &&
    //   this.findOrderNumberFromOrderDetailsItems.orderDocumentListType === 2
    // ) {
    //   this.fileList[5].hide = false;
    // }

    if (this.currentOrder.flowType === "02") this.isCLRSOnlyOrder = true;
    else this.showWarningMessage = true;
    // this.isCLRSOnlyOrder = this.currentOrder.flowType === "02";
    // this.showWarningMessage = !this.isCLRSOnlyOrder;
    // console.log("this.isCLRSOnlyOrder :>> ", this.isCLRSOnlyOrder);

    // if (this.isCLRSInFlow) this.fileList[5].hide = false;

    this.items = [
      {
        // ...this.orderDetails.items[this.isCLRSOnlyOrder ? 1 : 0],
        ...this.currentOrder,
        opened: false,
      },
    ];

    // if (this.currentCase.orderDetailsEmailSent > 0) return;

    // if (process.env.VUE_APP_EMAIL_ENV === "development") {
    //   setTimeout(async () => {
    //     const { data } = await useRequest({
    //       method: "post",
    //       path: `send-case-test-email/${this.currentCase.id}`,
    //       data: {
    //         documentName: "case-info",
    //       },
    //     });
    //   }, 60000);
    // }

    // await this.sendOrderDetailsEmail();
  },
  methods: {
    //TODO: This should really be triggered from the server...
    // async sendOrderDetailsEmail() {
    //   const caseId = this.currentCase.id;
    //   const templateData = await this.getOrderDetailsTemplateData();

    //   const data = {
    //     data: templateData,
    //   };
    //   await useRequest({
    //     method: "post",
    //     path: `send-order-details-email-notification/${caseId}`,
    //     data,
    //     onSuccess: (response) =>
    //       console.log(
    //         "send-order-details-email-notification response",
    //         response
    //       ),
    //   });
    // },
    // getOrderNumber() {
    //   this.orderNumber =
    //     this.orderDetailsProp?.orderNumber || this.orderDetails.orderNumber;
    // },
    async printPleadingsBtnAction() {
      if (this.isCLRSOnlyOrder) {
        await this.getPleading({ templateName: "clrs_form" });
        return;
      }
      this.printPleadingsDialog = true;
    },
    toggleComplaintsAndSummons({ item, index }) {
      item.opened = !item.opened;
      this.$set(this.items, index, item);
    },
    async printInvoice() {
      const data = {
        templateName: this.isCLRSOnlyOrder
          ? "order_details_clrs_only"
          : "order_details",
        isCLRSOnly: this.isCLRSOnlyOrder,
        orderId: this.currentOrder.id,
        // fileType: "Order Details",
        // caseId: this.currentCase.id,
        // data: await this.getOrderDetailsTemplateData(),
      };
      await this.getPleading(data);
    },
  },
};
</script>

<style scoped>
.hamburger-utility-button {
  position: absolute;
  top: 50px;
  right: -50px;
}

.grey--eviction-text {
  color: #93aebf;
}

.order-detail-upper-bar {
  background-color: #f0f5f6;
  border-radius: 10px;
  height: 136px;
  width: 100%;
}

.total-box-style {
  background: #4dccc4 0% 0% no-repeat padding-box;
  box-shadow: 15px 15px 40px #0000001f !important;
}

.price--text {
  color: #53809d;
}

.container-order-details-redirect {
  margin-bottom: 40px;
  padding-left: 0;
  padding-right: 0;
}

.order-details-bottom-button {
  font-size: 22px;
}
</style>
