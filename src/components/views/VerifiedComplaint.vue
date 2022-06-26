<template>
  <div style="padding: 0 30px; max-width: 1200px; margin: 0 auto">
    <!-- <v-container> -->
    <v-row>
      <!-- <v-col cols="2" /> -->
      <v-col cols="9" class="pr-8">
        <v-card class="my-12 text-center" style="border-radius: 10px">
          <!-- Inactive components will be cached! -->
          <keep-alive>
            <router-view
              v-bind="{ ...this.case }"
              :pdf="pdf"
              @close:form="cancel"
              @update:property="updateProperty"
              @property:completed="propertyCompleted"
              @preview="preview"
              @submit="submit"
            />
          </keep-alive>
        </v-card>
      </v-col>
      <v-col cols="3" class="my-10 pl-10">
        <p class="overline info--text font-weight-bold mb-0">
          NON-PAYMENT OF RENT
        </p>
        <p class="spaced-text secondary--text mb-6">Complaint & Summons</p>
        <SideList :items="steps" @update:property="updateProperty" />
      </v-col>
    </v-row>
    <v-dialog v-model="previewDialog" value="''" max-width="900">
      <dialog-template @close="previewDialog = false">
        <pdf-viewer :src="pdf" />
      </dialog-template>
    </v-dialog>

    <v-dialog v-model="cancelDialog" persistent value="''" max-width="600">
      <CancelDialog @close="cancelDialog = false" @submit="cancelForm" />
    </v-dialog>
    <!-- <bottom-bar :progress="progress" @preview="preview" v-if="step !== 0" /> -->
  </div>
</template>

<script>
import SideList from "@/components/SideList.vue";
// import BottomBar from "@/components/BottomBar";
import moment from "moment";
import DialogTemplate from "../dialogs/DialogTemplate.vue";
import CancelDialog from "@/components/dialogs/CancelDialog.vue";
import PdfViewer from "../PdfViewer.vue";
import { mapGetters } from "vuex";

export default {
  name: "VerifiedComplaint",
  components: {
    // BottomBar,
    DialogTemplate,
    PdfViewer,
    SideList,
    CancelDialog,
  },
  data() {
    return {
      step: 0,
      progress: 0,
      previewDialog: false,
      cancelDialog: false,
      oldTemplateData: "",
      pdf: "",
      bottomNav: true,
      attorney: {},
    };
  },
  computed: {
    ...mapGetters({
      currentProperty: "property/currentProperty",
      case: "eviction/currentCase",
      courtInfo: "eviction/courtInfo",
      isAuthenticated: "isAuthenticated",
      continueWithoutLogin: "continueWithoutLogin",
      client: "client",
      steps: "eviction/caseSteps",
    }),
    totalComputed() {
      return this.case.feesTotal;
    },
  },
  watch: {
    // async client(val) {
    //   if (val) {
    //     const caseId = this.$route.params.id;
    //     await this.$store.dispatch("eviction/loadCase", {
    //       caseId,
    //       logMessage: "VerifiedComplaint.vue at line 285",
    //     });
    //   }
    // },
    "case.attorneyId": function (val) {
      if (!val) return;
      console.log("case.attorneyId :>> ", val);
      this.$http
        .get(`${process.env.VUE_APP_URL}/attorneys/${val}/info`)
        .then((r) => r.data)
        .then((data) => {
          this.attorney = data;
        });
    },
    "case.createPropertyType": function (val) {
      if (val === "Add new Property") {
        this.steps.property.displayChildren = true;
        this.steps.property.showChildren = true;
      }
    },
  },
  mounted: async function () {
    if (!this.$auth.isAuthenticated) return;
    const {
      params: { id: caseId },
    } = this.$route;
    if (caseId === "new") {
      // this.$store.commit("eviction/init_steps");
      return;
    }

    this.$bus.on("open-cancel-dialog-verified-complaint", () => {
      this.cancelDialog = true;
    });

    if (this.$store.getters.isAuthenticated && this.$route.query.propertyId) {
      if (this.currentProperty) {
        this.propertyCompleted(this.currentProperty);
      }
    }

    if (caseId) await this.loadData(caseId);
  },
  methods: {
    // next() {
    //   this.progress = this.progress + 100 / 12;
    //   this.step++;
    //   this.$router.push({ name: this.currentComponent.name });
    //   if (this.$store.getters.isAuthenticated) {
    //     this.save();
    //   }
    // },
    cancel() {
      this.cancelDialog = true;
    },
    cancelForm() {
      this.cancelDialog = false;
      if (!this.$auth.isAuthenticated) {
        //* guest user canceled, clearing sessionStorage");
        sessionStorage.clear();
        return this.$auth.loginWithRedirect();
      }
      this.$router.push("/");
    },
    async loadData(caseId) {
      await this.$store.dispatch("eviction/loadCase", {
        caseId,
        logMessage: "VerifiedComplaint.vue at line 157",
      });
      if (this.$route.name === "vc-property-type") {
        const routeToBe =
          this.steps.property.children[this.currentProperty.status].routeName;
        if (routeToBe && this.$route.name !== routeToBe)
          await this.$router.push({
            name: routeToBe,
          });
      }
    },
    propertyCompleted(property) {
      this.$store.commit("eviction/update_current_case", {
        property,
        propertyId: property.propertyId,
      });
    },
    async updateProperty({ steps, showChildren }) {
      console.info("You called VeryfiedComplaint.updateProperty()");
      return;
      // if (this.$store.getters.isAuthenticated) {
      //   if (!this.currentProperty) return;
      //   try {
      //     const { data } = await this.$http.post(
      //       `${process.env.VUE_APP_URL}/properties/save`,
      //       {
      //         property: this.currentProperty,
      //         clientId: this.client.id,
      //       }
      //     );

      //     if (data.propertyId)
      //       this.$store.commit("property/update_current_property", {
      //         propertyId: data.propertyId,
      //       });

      //     // if user had not filled out their information yet and they agreed to save to profile, save to profile
      //     if (!this.client.firstName && this.saveInfoToProfile) {
      //       const result = await this.$http.post(
      //         `${process.env.VUE_APP_URL}/client/update`,
      //         {
      //           clientInfo: this.clientInfo,
      //           userId: this.client.userId,
      //         }
      //       );
      //       this.$store.commit("set_client", result.data);
      //     }
      //   } catch (e) {
      //     console.log(e);
      //   }
      // } else {
      //   // save to localStorage for when user creates account
      //   sessionStorage.setItem("property", JSON.stringify(this.property));
      //   // save client information
      //   if (this.saveInfoToProfile) {
      //     sessionStorage.setItem("client", JSON.stringify(this.clientInfo));
      //   }
      // }

      // for (const key in steps) {
      //   this.steps.property.children[key].status = steps[key];
      // }
      // if (this.currentProperty.propertyType === "Commercial") {
      //   this.steps.property.children.registration.status = "hidden";
      // }

      // this.steps.property.showChildren = showChildren;
    },
    submit() {
      // save to api
      // if no account, save and redirect to login
      // this.save(true);
      // this.createComplaint();
    },
    save() {},
    // saveStatus() {
    //   this.saving = true;
    //   let lastStep = {};
    //   Object.keys(this.steps).forEach((key, index) => {
    //     if (this.steps[key].status === "completed") {
    //       lastStep = this.steps[Object.keys(this.steps)[index]];
    //     }
    //   });

    //   console.log("save status", this.case, lastStep);

    //   if (this.$store.getters.isAuthenticated) {
    //     if (this.case.id) {
    //       // if already created
    //       this.$http
    //         .post(`${process.env.VUE_APP_URL}/case/${this.case.id}`, {
    //           caseInfo: {
    //             ...this.case,
    //             statusDate: moment().format("MM.DD.YY"),
    //           },
    //           clientId: this.client.id,
    //           submitted: false,
    //           status: lastStep ? lastStep.text : null,
    //         })
    //         .then((r) => r.data)
    //         .then((data) => {
    //           console.log("successfully saved caseId:", data);
    //           this.saving = false;
    //         });
    //     }
    //   }
    // },
    createComplaint(preview = false, showDialog = false) {
      console.log("called createComplaint()");
      // setTimeout(() => {
      //   console.log(", VerifiedComplaint:466");

      //   const templateName = `verified_complaint_nonpayment`;
      //   this.renderTemplate(
      //     this.getTemplateData(),
      //     templateName,
      //     preview,
      //     showDialog
      //   );
      // }, 2500);
    },
    async renderTemplate(
      templateData,
      templateName,
      preview,
      showDialog = false
    ) {
      console.log("called renderTemplate()");
      // if (
      //   !this.preview ||
      //   !this.compareObjects(this.oldTemplateData, templateData)
      // ) {
      //   // if template data is the not same as the last time, we will create a new pdf
      //   const { data: response } = await useRequest({
      //     path: "render_template",
      //     data: {
      //       templateData: templateData,
      //       templateName: templateName,
      //       watermark: preview,
      //     },
      //   });
      //   if (!response.data) throw new Error("no data");
      //   const linkSource = `data:application/pdf;base64,${response.data}`;
      //   this.pdf = linkSource;
      //   this.oldTemplateData = templateData;
      //   if (preview && showDialog) {
      //     // if preview
      //     this.previewDialog = true;
      //   } else if (!preview) {
      //     this.createLink(linkSource);
      //   }
      // } else if (showDialog) {
      //   // if template data is the not same as the last time, we will preview and will show old pdf
      //   this.previewDialog = true;
      // }
    },
    createLink(linkSource, fileName = "file.pdf", downloadOnly = false) {
      const link = document.createElement("a");
      // const fileName = `${templateName}.pdf`;
      link.href = linkSource;
      if (downloadOnly) {
        link.download = fileName;
      }
      link.click();
    },
    // compareObjects(oldObj, newObj) {
    //   if (!oldObj) return false; // if there was no previous version

    //   for (const p in oldObj) {
    //     if (Object.prototype.hasOwnProperty.call(oldObj, p)) {
    //       if (oldObj[p] !== newObj[p]) {
    //         // if p is an empty array, it will be an observable in oldObj and break the tests
    //         if (Array.isArray(oldObj[p])) continue;
    //         return false;
    //       }
    //     }
    //   }
    //   return true;
    // },
    // back() {
    //   this.step--;
    //   this.$router.push({ name: this.currentComponent.name });
    // },
    dayToNumber(day) {
      switch (day) {
        case "Sunday":
          return 0;
        case "Monday":
          return 1;
        case "Tuesday":
          return 2;
        case "Wednesday":
          return 3;
        case "Thursday":
          return 4;
        case "Friday":
          return 5;
        case "Saturday":
          return 6;
      }
    },
    getNextDayOfTheWeek(dayName, excludeToday = true, refDate = moment()) {
      const addedDays =
        +excludeToday +
        ((this.dayToNumber(dayName) + 7 - refDate.day() - +excludeToday) % 7);
      return refDate.add(addedDays, "days");
    },
    updateData(newData) {
      this.$store.commit("eviction/update_current_case", newData);
    },
    // async createPreview() {
    //   await this.createComplaint(true);
    // },
    async preview() {
      console.log("called preview()");
      // await this.createComplaint(true, true);
    },
    parseDate(date) {
      return moment(date, "YYYY-MM-DD").format("MM/DD/YYYY");
    },
    headingAddress() {
      if (this.case.attorneyId) {
        return [
          `Law Office of ${this.attorney.firstName} ${this.attorney.lastName}`,
          `Attorney ID # ${this.attorney.stateId}`,
          this.attorney.address,
          `${this.attorney.city}, ${this.attorney.state} ${this.attorney.zipcode}`,
          this.attorney.phone,
          {
            stack: [
              {
                text: `Attorney for Plaintiff`,
                margin: [0, 10, 0, 30],
              },
            ],
          },
        ];
      } else {
        return [
          `${this.client.firstName} ${this.client.lastName}`,
          this.client.address,
          `${this.client.city}, ${this.client.state} ${this.client.zipcode}`,
          this.client.phone,
          {
            stack: [
              {
                text: [`Appearing `, { text: `Pro Se`, italics: true }],
                margin: [0, 10, 0, 30],
              },
            ],
          },
        ];
      }
    },
    signerType() {
      if (this.case.attorneyId) {
        return "Attorney for Plaintiff";
      } else if (this.currentProperty.clientType === "owner") {
        return "Owner";
      } else if (
        this.currentProperty.ownershipType === "Sole Proprietor" ||
        this.currentProperty.ownershipType ===
          "General Partner of the partnership"
      ) {
        return `${this.client.firstName} ${
          this.client.lastName
        }, Agent of the Owner, ${this.ownerOfRecord()}`;
      } else if (
        this.currentProperty.ownershipType ===
          "Limited Liability Company (LLC)" ||
        this.currentProperty.ownershipType === "Corporation"
      ) {
        return `${this.client.firstName} ${
          this.client.lastName
        }, Agent of ${this.ownerOfRecord()}`;
      }
      return "";
    },
    firstDayOfMonth(day, month, year) {
      // day = 0-Sunday -> 6-Saturday
      return 1 + ((day - moment([year, month]).day() + 7) % 7);
    },

    total(items) {
      return items.reduce((total, item) => {
        return (total += parseFloat(item.cost));
      }, 0);
    },
    compareDateRange(dateRange1, dateRange2) {
      const date1 = moment(dateRange1.slice(0, 8));
      const date2 = moment(dateRange2.slice(0, 8));
      if (date1.isSame(date2)) {
        const date3 = moment(dateRange1.slice(11, 19));
        const date4 = moment(dateRange2.slice(11, 19));
        if (date3.isSame(date4)) {
          return 0;
        } else if (date3.isBefore(date4)) {
          return -1;
        }
        return 1;
      } else if (date1.isBefore(date2)) {
        return -1;
      }
      return 1;
    },

    async createPDF(watermarkBool) {
      //   // load courtInfo for PDF
      //   await this.$http
      //     .get(`${process.env.VUE_APP_URL}/courtServiceInfo`, {
      //       params: {
      //         countyName: this.currentProperty.county,
      //       },
      //     })
      //     .then((r) => r.data)
      //     .then((data) => {
      //       this.courtInfo = data;
      //     });
      //   const docDefinition = {
      //     info: {
      //       title: "Verified Complaint",
      //     },
      //     pageSize: "LETTER",
      //     defaultStyle: {
      //       font: "TimesNewRoman",
      //     },
      //     watermark: {
      //       text: watermarkBool ? "Easy Evictions NJ LLC" : "",
      //       opacity: 0.1,
      //     },
      //     content: [
      //       {
      //         columns: [
      //           {
      //             stack: [
      //               { stack: this.headingAddress(), lineHeight: 1 },
      //               {
      //                 stack: [
      //                   {
      //                     text: `${this.client.firstName.toUpperCase()} ${this.client.lastName.toUpperCase()}`,
      //                     bold: true,
      //                   },
      //                   {
      //                     text: `Plaintiff(s)`,
      //                     italics: true,
      //                     style: "indented",
      //                   },
      //                 ],
      //                 lineHeight: 1,
      //               },
      //               { stack: ["vs."], margin: [0, 20, 0, 20], lineHeight: 1 },
      //               {
      //                 stack: [
      //                   {
      //                     text: `${this.compileTenants().toUpperCase()}`,
      //                     bold: true,
      //                   },
      //                   {
      //                     text: `Defendant(s)`,
      //                     italics: true,
      //                     style: "indented",
      //                   },
      //                 ],
      //                 lineHeight: 1,
      //               },
      //             ],
      //             width: "*",
      //           },
      //           {
      //             stack: [
      //               {
      //                 stack: [
      //                   `SUPERIOR COURT OF NEW JERSEY`,
      //                   "Law Division, Special Civil Part",
      //                   `${this.currentProperty.county} County`,
      //                   this.courtInfo.superiorCourtStreet,
      //                   `${this.courtInfo.superiorCourtCity}, ${this.courtInfo.superiorCourtState} ${this.courtInfo.superiorCourtZipcode}`,
      //                 ],
      //                 lineHeight: 1,
      //               },
      //               {
      //                 stack: [
      //                   {
      //                     text: `Docket No.: LT-_______________`,
      //                     margin: [0, 30, 0, 30],
      //                   },
      //                 ],
      //               },
      //               `CIVIL ACTION`,
      //               {
      //                 stack: [
      //                   {
      //                     text: "VERIFIED COMPLAINT LANDLORD/TENANT",
      //                     bold: true,
      //                   },
      //                   `${
      //                     this.case.complaint === "Non-Payment of Rent"
      //                       ? "Non-Payment of Rent"
      //                       : "Other"
      //                   }`,
      //                 ],
      //                 lineHeight: 1,
      //               },
      //             ],
      //             width: "55%",
      //             lineHeight: 2,
      //           },
      //         ],
      //         columnGap: 20,
      //         style: "text",
      //       },
      //       {
      //         stack: [
      //           `Address of Rental Premises: ${
      //             this.currentProperty.streetAddress
      //           }, ${
      //             this.case.buildingNo ? `Unit ${this.case.buildingNo},` : ``
      //           } ${this.currentProperty.city.name}, ${
      //             this.currentProperty.state
      //           } ${this.currentProperty.zipcode}`,
      //           `Tenant's Phone Number: ${
      //             this.case.tenantPhone
      //               ? this.case.tenantPhone
      //               : this.case.tenants[0].phone
      //           }`,
      //         ],
      //         style: "text",
      //         margin: [0, 30, 0, 30],
      //       },
      //       {
      //         table: {
      //           widths: [30, "*"],
      //           body: [
      //             ["1.", `The owner of record is ${this.ownerOfRecord()}.`],
      //             [
      //               "2.",
      //               `Plaintiff is the ${
      //                 this.currentProperty.clientType === "owner"
      //                   ? "OWNER"
      //                   : "AGENT OF THE OWNER"
      //               }.`,
      //             ],
      //             [
      //               "3.",
      //               `The landlord ${
      //                 this.case.confirmation.ownership.confirmed
      //                   ? "DID"
      //                   : "DID NOT"
      //               } acquire ownership of the property from the tenant(s).`,
      //             ],
      //             [
      //               "4.",
      //               `The landlord ${
      //                 this.case.confirmation.option_to_purchase.confirmed
      //                   ? "HAS"
      //                   : "HAS NOT"
      //               } given the tenant(s) an option to purchase the property.`,
      //             ],
      //             [
      //               "5.",
      //               {
      //                 text: [
      //                   `The tenant(s) now reside(s) in and has (have) been in possession of these premises since `,
      //                   {
      //                     text: `${this.parseDate(this.case.leaseStartDate)}`,
      //                     bold: true,
      //                   },
      //                   `, under ${this.case.leaseTypeCategory.toUpperCase()} agreement.`,
      //                 ],
      //               },
      //             ],
      //             [
      //               "6.",
      //               `The tenancy ${
      //                 this.case.section8 === "Yes" ? "IS" : "IS NOT"
      //               } subsidized pursuant to either a federal or state program or the rental unit is public housing.`,
      //             ],
      //             [
      //               "7.",
      //               `The landlord has registered the leasehold and notified the tenant(s) as required by N.J.S.A. 46:8-27.`,
      //             ],
      //             [
      //               "8.",
      //               {
      //                 text: [
      //                   `The amount that must be paid by the tenant(s) for these premises is `,
      //                   {
      //                     text: `${this.convertToCurrency(
      //                       this.case.rentAmount
      //                     )} `,
      //                     bold: true,
      //                   },
      //                   `payable `,
      //                   { text: `${this.formatRentCycle()}.`, bold: true },
      //                 ],
      //               },
      //             ],
      //             [
      //               "9A.",
      //               {
      //                 stack: [
      //                   `There is due, unpaid and owing from tenant(s) to Plaintiff/Landlord rent as follows:`,
      //                   {
      //                     table: {
      //                       headerRows: 1,
      //                       keepWithHeaderRows: 1,
      //                       widths: ["auto", "*", "auto"],
      //                       body: this.compileAmountsOwed(),
      //                     },
      //                     layout: {
      //                       hLineColor: function () {
      //                         return "#d0d0d0";
      //                       },
      //                       vLineColor: function () {
      //                         return "#d0d0d0";
      //                       },
      //                     },
      //                     margin: [0, 20, 0, 20],
      //                   },
      //                   `* The late charges, attorney fees and other charges are permitted to be charged as rent for purposes of this action by federal, state and local law (including rent control and rent leveling) and by the lease.`,
      //                 ],
      //               },
      //             ],
      //             [
      //               "9B.",
      //               {
      //                 stack: [
      //                   {
      //                     text: [
      //                       `The date that the next rent is due is: `,
      //                       { text: `${this.nextRentDue()}.`, bold: true },
      //                     ],
      //                   },
      //                   {
      //                     text: [
      //                       `If this case is scheduled for trial before that date, the total amount you must pay to have this complaint dismissed is: `,
      //                       {
      //                         text: `$${this.case.feesTotal.toFixed(2)}.`,
      //                         bold: true,
      //                       },
      //                       ` This is the total from line 9A.`,
      //                     ],
      //                   },
      //                   {
      //                     text: [
      //                       `If this case is scheduled for trial on or after that date, the total amount you must pay to have this complaint dismissed is: `,
      //                       {
      //                         text: `$${(
      //                           this.case.feesTotal +
      //                           parseFloat(this.case.rentAmount)
      //                         ).toFixed(2)}.`,
      //                         bold: true,
      //                       },
      //                       ` This is the total from line 9A plus the amount of the next rent due.`,
      //                     ],
      //                   },
      //                   `These amounts do not include late fees or attorney fees for Section 8 and public housing tenants. Payment may be made to the landlord or the clerk of the court at any time before the trial date, but on the trial date payment must be made by 4:30 p.m. to get the case dismissed.`,
      //                 ],
      //               },
      //             ],
      //             [
      //               "10.",
      //               `Landlord DOES NOT seek a judgment for possession for the additional or alternative reasons.`,
      //             ],
      //             [
      //               "11.",
      //               `The tenant(s) ${
      //                 this.case.confirmation.tenant_continues_possession.confirmed
      //                   ? "HAVE NOT"
      //                   : "HAVE"
      //               } surrendered possession of the premises and tenant(s) hold over and continues in possession without consent of landlord.`,
      //             ],
      //             [
      //               "",
      //               {
      //                 stack: [
      //                   "",
      //                   {
      //                     text: [
      //                       { text: `WHEREFORE, `, bold: true },
      //                       `Plaintiff/Landlord demands judgment for possession against the tenant(s) listed above, together with costs.`,
      //                     ],
      //                   },
      //                 ],
      //                 margin: [0, 25, 0, 10],
      //               },
      //             ],
      //             [
      //               "",
      //               {
      //                 columns: [
      //                   {
      //                     stack: [
      //                       this.case.attorneyId || !this.case.signature
      //                         ? `DATED: ___________________`
      //                         : {
      //                             text: [
      //                               `DATED:`,
      //                               {
      //                                 text: `           ${moment().format(
      //                                   "MM/DD/YYYY"
      //                                 )}             `,
      //                                 decoration: "underline",
      //                               },
      //                             ],
      //                           },
      //                     ],
      //                     // auto-sized columns have their widths based on their content
      //                     width: "45%",
      //                     lineHeight: 1,
      //                     margin: [0, 23, 0, 0],
      //                   },
      //                   { width: "*", text: "" },
      //                   {
      //                     stack: [
      //                       this.case.attorneyId || !this.case.signature
      //                         ? {
      //                             canvas: [
      //                               {
      //                                 type: "rect",
      //                                 x: 0,
      //                                 y: 0,
      //                                 w: 215,
      //                                 h: 34,
      //                                 r: 5,
      //                                 // lineWidth: 10,
      //                                 lineColor: "white",
      //                               },
      //                             ],
      //                           }
      //                         : {
      //                             image: this.case.signature,
      //                             width: 215,
      //                           },
      //                       {
      //                         table: {
      //                           heights: 1,
      //                           widths: ["*"],
      //                           body: [
      //                             [
      //                               {
      //                                 border: [false, true, false, false],
      //                                 text: "",
      //                               },
      //                             ],
      //                           ],
      //                         },
      //                         layout: {
      //                           hLineWidth: function () {
      //                             return 0.5;
      //                           },
      //                         },
      //                       },
      //                       this.case.attorneyId
      //                         ? `${this.attorney.firstName.toUpperCase()} ${this.attorney.lastName.toUpperCase()}`
      //                         : `${this.client.firstName.toUpperCase()} ${this.client.lastName.toUpperCase()}`,
      //                       { text: `${this.signerType()}`, italics: true },
      //                     ],
      //                     lineHeight: 1,
      //                     width: "50%",
      //                   },
      //                 ],
      //                 // optional space between columns
      //                 columnGap: 30,
      //                 style: "text",
      //               },
      //             ],
      //           ],
      //         },
      //         style: "text",
      //         layout: "noBorders",
      //       },
      //       {
      //         text: "LANDLORD VERIFICATION",
      //         style: "title_no_underline",
      //         pageBreak: "before",
      //       },
      //       {
      //         table: {
      //           widths: [30, "*"],
      //           body: [
      //             [
      //               "1.",
      //               `I certify that I am the ${this.clientTypeExtended()} that owns the premised in which tenant(s) reside(s).`,
      //             ],
      //             [
      //               "2.",
      //               `I have read the verified complaint and the information contained in it is true and based upon my personal knowledge.`,
      //             ],
      //             [
      //               "3.",
      //               `The matter in controversy ${
      //                 this.case.verification.another_court_subject.confirmed
      //                   ? "IS NOT"
      //                   : "IS"
      //               } the subject of another court action or arbitration now pending or contemplated and no other parties should be joined in this action${
      //                 !this.case.verification.another_party.confirmed
      //                   ? ""
      //                   : ` except ${this.case.verification.another_party.party}`
      //               }. ${
      //                 this.case.verification.another_court_subject.confirmed
      //                   ? ""
      //                   : "DESCRIBE COURT ACTION PENDING"
      //               }`,
      //             ],
      //             [
      //               "4.",
      //               `I certify that confidential personal identifiers have been redacted from documents now submitted to the court, and will be redacted from all documents submitted in the future in accordance with Rule 1:38-7(b).`,
      //             ],
      //             [
      //               "5.",
      //               `The foregoing statements made by me are true and I am aware that if any of the foregoing statements made by me are willfully false, I am subject to punishment.`,
      //             ],
      //             [
      //               "",
      //               `At the trial, Plaintiff ${
      //                 this.case.verification.interpreter.confirmed
      //                   ? "WILL"
      //                   : "WILL NOT"
      //               } require ${
      //                 this.case.verification.interpreter.confirmed
      //                   ? `an ${this.case.verification.interpreter.language}`
      //                   : "an"
      //               } interpreter. Further, Plaintiff ${
      //                 this.case.verification.disability.confirmed
      //                   ? "WILL"
      //                   : "WILL NOT"
      //               } require an accommodation for a disability${
      //                 this.case.verification.disability.confirmed
      //                   ? `: ${this.case.verification.disability.accommodation}`
      //                   : ""
      //               }.`,
      //             ],
      //           ],
      //         },
      //         style: "text",
      //         layout: "noBorders",
      //       },
      //       {
      //         columns: [
      //           {
      //             stack: [
      //               !this.case.signature
      //                 ? `DATED: ___________________`
      //                 : {
      //                     text: [
      //                       `DATED:`,
      //                       {
      //                         text: `           ${moment().format(
      //                           "MM/DD/YYYY"
      //                         )}             `,
      //                         decoration: "underline",
      //                       },
      //                     ],
      //                   },
      //             ],
      //             // auto-sized columns have their widths based on their content
      //             width: "45%",
      //             lineHeight: 1,
      //             margin: [0, 23, 0, 0],
      //           },
      //           { width: "*", text: "" },
      //           {
      //             stack: [
      //               !this.case.signature
      //                 ? {
      //                     canvas: [
      //                       {
      //                         type: "rect",
      //                         x: 0,
      //                         y: 0,
      //                         w: 215,
      //                         h: 34,
      //                         r: 5,
      //                         // lineWidth: 10,
      //                         lineColor: "white",
      //                       },
      //                     ],
      //                   }
      //                 : {
      //                     image: this.case.signature,
      //                     width: 215,
      //                   },
      //               {
      //                 table: {
      //                   heights: 1,
      //                   widths: ["*"],
      //                   body: [
      //                     [
      //                       {
      //                         border: [false, true, false, false],
      //                         text: "",
      //                       },
      //                     ],
      //                   ],
      //                 },
      //                 layout: {
      //                   hLineWidth: function () {
      //                     return 0.5;
      //                   },
      //                 },
      //               },
      //               `${this.client.firstName.toUpperCase()} ${this.client.lastName.toUpperCase()}`,
      //               { text: `${this.clientType()}`, italics: true },
      //             ],
      //             lineHeight: 1,
      //             width: "48%",
      //           },
      //         ],
      //         // optional space between columns
      //         columnGap: 30,
      //         style: "text",
      //       },
      //     ],
      //     styles: {
      //       title: {
      //         fontSize: 11,
      //         alignment: "center",
      //         bold: true,
      //         margin: 5,
      //         decoration: "underline",
      //       },
      //       title_no_underline: {
      //         fontSize: 11,
      //         alignment: "center",
      //         bold: true,
      //         margin: 5,
      //       },
      //       text: {
      //         margin: [5, 5],
      //         alignment: "justify",
      //         lineHeight: 1.5,
      //       },
      //       indented: {
      //         margin: [20, 0, 20, 0],
      //         alignment: "justify",
      //       },
      //     },
      //   };
      //   this.$pdfmake.createPdf(docDefinition).open();
    },
  },
};
</script>

<style>
.v-timeline-item__divider {
  min-width: 60px;
}

.v-application--is-ltr .v-timeline--dense:not(.v-timeline--reverse):before {
  left: calc(66px - 1px);
  right: initial;
}
/* .vc-timeline {
    position: absolute;
    right: 0;
} */
</style>
