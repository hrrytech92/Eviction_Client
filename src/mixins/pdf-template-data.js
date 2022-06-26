import moment from "moment";
import { capitalizeFirstLetter, getSignatureText } from "@/utils";
import ordinal from "ordinal";
import { mapGetters } from "vuex";
import calculateFees from "@/mixins/calculate-fees";
import ViewSupport from "@/mixins/view-support";
// import writtenNumber from "written-number";

export default {
  mixins: [calculateFees, ViewSupport],
  // data: () => ({
  //   feesTotal: 0,
  // }),

  computed: {
    ...mapGetters({
      currentProperty: "property/currentProperty",
      courtInfo: "eviction/courtInfo",
      currentOrder: "eviction/currentOrder",
    }),

    getCourtFee() {
      // const courtFee = this.currentCase.tenants.length === 3 ? 65 : 50;
      const calculateTotalCourtFee =
        // 50 + 5 * this.case.tenants.length + parseInt(this.getMileageFee);
        50 + 7 + 5 * (this.case.tenants?.length - 1);
      return parseFloat(calculateTotalCourtFee).toFixed(2);
    },
    // getMileageFee() {
    //   let mileageFeeAmount = "";
    //   this.currentCase.legalFees &&
    //     this.currentCase.legalFees.map((item) => {
    //       if (item.type === "Mileage Fee") {
    //         mileageFeeAmount = item.amount;
    //       }
    //     });

    //   return mileageFeeAmount || "0.00";
    // },
  },
  methods: {
    // async getOrderDetailsTemplateData() {
    //   const templateData = await this.getTemplateData();
    //   const { orderNumber, cost, title } = this.currentOrder;
    //   console.log("thos.currentOrder :>> ", this.currentOrder);

    //   // const getOrderItem = items.find((item) => {
    //   //   if (this.currentCase.isClrsStandaloneFormTouched) {
    //   //     return (
    //   //       item.title === "Certification of Lease and Registration Statement"
    //   //     );
    //   //   }
    //   //   return item.title === "Full Eviction: Self-File";
    //   // });

    //   const orderItems = [
    //     {
    //       // ...this.currentOrder,
    //       // propertyFullAddress: templateData.property.address,
    //       // orderNumber,
    //       cost: `$${cost.toFixed(2)}`,
    //       title,
    //     },
    //   ];

    //   return {
    //     ...templateData,
    //     orderNumber,
    //     orderItems,
    //     // orderSummaryItems: orderItems,
    //   };
    // },
    // async getTemplateData() {
    //   await this.$store.dispatch("eviction/loadCourtInfo");
    //   try {
    //     const {
    //       contactInfo,
    //       clientType,
    //       ownershipType,
    //       unitNo,
    //       streetAddress,
    //       city,
    //       state,
    //       zipcode,
    //       municipalCode,
    //       propertyType,
    //     } = this.currentProperty;
    //     if (!contactInfo) throw new Error("property.contactInfo is null");

    //     const { courtInfo } = this;
    //     if (!courtInfo) throw new Error("courtInfo is null");

    //     const { confirmation, verification, tenants, pastDueRent, section8 } =
    //       this.case;
    //     if (!pastDueRent.length) throw new Error("pastDueRent is empty");
    //     if (!tenants.length) throw new Error("tenants is empty");

    //     const firstTenant = tenants[0];
    //     const seletedMonths = pastDueRent.filter((month) => month.selected);
    //     const firstUnpaidMonth =
    //       seletedMonths[seletedMonths.length - 1].timePeriod;

    //     await this.initFeeData();

    //     const phoneOrCell = ({ phone, ext, cell }) =>
    //       phone ? phone + (ext ? ` ext. ${ext} ` : "") : cell;

    //     const cellOrPhone = ({ phone, ext, cell }) =>
    //       cell || phone + (ext ? ` ext. ${ext} ` : "");

    //     const getUnitNo = unitNo ? `, ${unitNo}` : "";
    //     const propertyFullAddress = `${streetAddress}${getUnitNo}, ${city}, ${state} ${zipcode}`;

    //     const signatureText = getSignatureText(this.currentProperty);
    //     const tenantsLength = tenants.length * 2;
    //     const tenantFullNames = tenants
    //       .map((tenant) => tenant.name.trim().toUpperCase())
    //       .join(", ");

    //     let entityTypeStatement = null;
    //     if (clientType === "agent" && ownershipType !== "Individual") {
    //       entityTypeStatement =
    //         "An attorney will be representing the Plaintiff at the hearing.";
    //     }
    //     const section8Office = section8
    //       ? this.case.publicHousingOfficeSection8
    //       : {};

    //     // return {
    //     //   caseId: this.case.id,
    //     //   clientDescription: this.clientTypeExtended(),
    //     //   tenantNames: this.compileTenants(),
    //     //   signatureText,
    //     //   courtFee: this.getCourtFee,
    //     //   rentCycleAndDueBy: this.formatRentCycle(),
    //     //   amounts: this.compileAmountsOwed(),
    //     //   total: this.dollarFormat(this.feesTotal),
    //     //   totalOwed: this.feesTotal,
    //     //   nextRentDueDate: this.nextRentDue(),
    //     //   nextAmount: this.calculateNextAmount(),
    //     //   fileCopyAmount: `${writtenNumber(tenantsLength)} (${tenantsLength})`,
    //     //   fileNameAddress: `${streetAddress}${getUnitNo}`,
    //     //   guestData: null,
    //     // };

    //     const returnData = {
    //       court: {
    //         address: courtInfo.street,
    //         city: courtInfo.city,
    //         name: courtInfo.name,
    //         phone: courtInfo.phone,
    //         state: courtInfo.state,
    //         zipcode: courtInfo.zipcode,
    //         county: courtInfo.county,
    //       },
    //       client: {
    //         name: `${contactInfo.firstName.trim()} ${contactInfo.lastName}`,
    //         company: contactInfo.company,
    //         addressLine1: contactInfo.streetAddress,
    //         addressLine2: `${contactInfo.city}, ${contactInfo.state} ${contactInfo.zipcode}`,
    //         phone: contactInfo.phone,
    //         ext: contactInfo.ext,
    //         cell: contactInfo.cell,
    //         phoneOrCell: phoneOrCell(contactInfo),
    //         email: contactInfo.email,
    //         type: clientType === "owner" ? "Owner" : "Agent",
    //         description: this.clientTypeExtended(),
    //       },
    //       property: {
    //         address: propertyFullAddress,
    //         municipalCode,
    //         propertyType,
    //       },
    //       propertyFullAddress,
    //       tenant: {
    //         names: this.compileTenants(),
    //         address: propertyFullAddress,
    //         phone: firstTenant.phone,
    //         ext: firstTenant.ext,
    //         cell: firstTenant.cell,
    //         phoneOrCell: cellOrPhone(firstTenant),
    //         email: this.case.tenantEmail,
    //         fullNames: tenantFullNames,
    //       },
    //       verification,
    //       confirmation,
    //       tenantFullNames,
    //       attorney: {},
    //       caseId: this.case.id,
    //       courtFee: this.getCourtFee,
    //       entityTypeStatement,
    //       ownerName: this.currentProperty.deedNames,
    //       docketNo: this.case.docketNo,
    //       clientSignatureTitle: ``,
    //       deedNames: this.ownerOfRecord(),
    //       propertyType,
    //       leaseStartDate: this.$dayjs(this.case.leaseStartDate).format(
    //         "MMM DD, YYYY"
    //       ),
    //       section8: this.case.section8,
    //       section8Office,
    //       housingAuthorityOffice: section8Office,
    //       rentAmount: this.case.section8
    //         ? this.convertToCurrency(this.case.section8TenantPortion)
    //         : this.convertToCurrency(this.case.rentAmount),
    //       rentCycleAndDueBy: this.formatRentCycle(),
    //       amounts: this.compileAmountsOwed(),
    //       total: this.dollarFormat(this.feesTotal),
    //       totalOwed: this.feesTotal,
    //       nextRentDueDate: this.nextRentDue(),
    //       nextAmount: this.calculateNextAmount(),
    //       unpaidMonths: seletedMonths.length,
    //       firstUnpaidMonth,
    //       // registeredLease: ``,
    //       clientDescription: this.clientTypeExtended(),
    //       // otherCourtAction: verification.another_court_subject.confirmed,
    //       // otherParty: verification.another_court_subject.party,
    //       // interpreter: verification.interpreter.language,
    //       // disability: verification.disability.accommodation,
    //       // ownership: confirmation.ownership.confirmed,
    //       // optionToPurchase: confirmation.option_to_purchase.confirmed,
    //       // isOwnerOccupied: confirmation.is_owner_occupied.confirmed,
    //       // municipalRentControl: confirmation.municipal_rent_control.confirmed,
    //       filingPlan: this.case.filingPlan,
    //       filingType: this.case.filingPlan,
    //       // signatureImage:
    //       //   this.case.signatureImage && this.case.filingPlan === "E-FILE"
    //       //     ? `https://fileevictions.nyc3.digitaloceanspaces.com/signatures/${this.case.signatureImage}`
    //       //     : "https://fileevictions.nyc3.digitaloceanspaces.com/e-signature-white.png",
    //       signatureImage: this.case.signatureImage,
    //       signatureImageClrs: this.case.signatureImageClrs,
    //       signatureImageBase64: this.case.signatureImageBase64,
    //       signatureText,
    //       signatureText1: signatureText.split(", ")[0].trim(),
    //       signatureText2: signatureText
    //         .split(", ")
    //         .filter((value, key) => key !== 0)
    //         .join(", ")
    //         .trim(),
    //       legalServicesTel: courtInfo.legalServices,
    //       lawyerReferralTel: courtInfo.lawyerReferral,
    //       welfareAgencyTel: courtInfo.housingServicePhone,
    //       welfareAgencyAddress: `${courtInfo.housingServiceStreet}, ${courtInfo.housingServiceCity}, ${courtInfo.housingServiceState} ${courtInfo.housingServiceZipcode}`,
    //       additionalDefendants: tenants.length - 1,
    //       // clrsExists: Boolean(
    //       //   this.case.clrsDraft !== null && this.case.clrsDraft === true
    //       // ),
    //       // clrsExists: this.isCLRSCase, // *from view-support.js
    //       clrsExists: this.isCLRSInFlow, // *from view-support.js
    //       clrsDocumentDetailDescription:
    //         this.getCLRSDocumentDetailDescription(),
    //       clrsStatement: this.getCLRSStatement(),
    //       fileNameAddress: `${streetAddress}${getUnitNo}`,
    //       fileCopyAmount: `${writtenNumber(tenantsLength)} (${tenantsLength})`,
    //       date: moment().format("MM/DD/YYYY"),
    //       exportDate: this.$dayjs().format("MMMM D, YYYY"),
    //       orderId: this.currentOrder.id,
    //     };
    //     return returnData;
    //   } catch (error) {
    //     console.error("getTemplateData error :>> ", error);
    //   }
    // },
    getCLRSDocumentDetailDescription() {
      // if (!this.isCLRSCase) return null;
      if (!this.isCLRSInFlow) return null;
      if (this.case.documentDetailType === null) {
        return null;
      }

      if (this.case.documentDetailType === 1) {
        return "attached in full.";
      }

      if (this.case.documentDetailType === 2) {
        return "attached in pertinent part and the full lease document is in excess of 10 pages.";
      }

      return "not the subject of a written agreement.";
    },
    getCLRSStatement() {
      // if (!this.isCLRSCase) return null;
      // if (this.case.clrsDraft === null) return null;
      if (!this.isCLRSInFlow) return null;
      const { clrsSubmission, clrsExemption } = this.case;
      if (!clrsSubmission && !clrsExemption) return null;
      if (clrsSubmission)
        return "I have attached a copy of any registration statement for the residential rental property required by the Landlord Registration Act N.J.S.A. 46:8-27.";
      return "The property is exempt from registration pursuant to N.J.S.A. 46:8-28.5(b).";
    },
    // getCourtStreetAddresses(street) {
    //   // console.log("street :>> ", street);
    //   const courtStreetAddress = street.split(",");
    //   const obj = {};
    //   courtStreetAddress.forEach((street, key) => {
    //     obj[`addressLine${key + 1}`] = street.trim();
    //   });

    //   return obj;
    // },
    compileTenants() {
      if (this.case.tenantCompanyName) {
        return this.case.tenantCompanyName;
      }

      const tenants = this.case.tenants;

      const lastKey = tenants.length - 1;

      let tenantNames = "";

      for (const [key, tenant] of tenants.entries()) {
        if (tenantNames !== "") {
          if (tenants.length === 2) {
            tenantNames += " and ";
          } else if (key === lastKey) {
            tenantNames += ", and ";
          } else {
            tenantNames += ", ";
          }
        }

        tenantNames += capitalizeFirstLetter(tenant.name);
      }

      return tenantNames;
    },
    ownerOfRecord() {
      // if empty, return empty string
      if (!this.currentProperty.deedNames) return "";
      // if DeedNames is from a saved property, the type will be string
      if (typeof this.currentProperty.deedNames === "string") {
        return this.currentProperty.deedNames;
      }
      // let deedNames = ''
      // for (const deedName of this.case.property.deedNames){
      //     if (deedNames !== ''){deedNames += ', '}
      //     deedNames += deedName
      // }
      return this.currentProperty.deedNames.join(", ");
    },
    clientType() {
      if (this.currentProperty.clientType === "owner") {
        return "Owner";
      }

      return "Agent";
    },
    formatRentCycle() {
      switch (this.case.rentCycle) {
        case "Monthly":
          return `on the ${ordinal(
            parseInt(this.case.rentDueBy)
          )} day of each month`;
        case "Weekly":
          return `every ${this.numberToDay(this.case.rentDueBy)}`;
        case "Bi-weekly":
          return `every other ${this.numberToDay(this.case.rentDueBy)}`;
        case "Semi-monthly":
          return `on the ${ordinal(
            parseInt(this.case.rentDueBy[0])
          )} and ${ordinal(parseInt(this.case.rentDueBy[1]))} of each month`;
        default:
          return "MISSING RENT DUE BY DAY";
      }
    },
    compileAmountsOwed() {
      const {
        pastDueRent,
        lateCharges = [],
        utilities = [],
        fees = [],
        otherCharges = [],
      } = this.case;
      // console.log({ pastDueRent, lateCharges, utilities, fees, otherCharges });
      // let total = 0;
      const amountsOwed = [];
      // let amountsOwed = [
      //                 [{text: 'PERIOD', bold: true}, {text: 'DESCRIPTION', bold: true}, {text: 'AMOUNT', bold: true}],
      //                 ]
      pastDueRent
        .filter((value) => value.selected)
        .forEach((fee) => {
          if (fee.amount) {
            amountsOwed.push({
              timeperiod: fee.timePeriodDisplay,
              description: "Rent",
              amount: `$${parseFloat(fee.amount).toFixed(2)}`,
            });
            // total += parseFloat(fee.amount);
          }
        });

      lateCharges.forEach((fee) => {
        if (fee.amount) {
          amountsOwed.push({
            timeperiod: fee.timePeriodDisplay,
            description: "Late Fee *",
            amount: `$${parseFloat(fee.amount).toFixed(2)}`,
          });
          // total += parseFloat(fee.calculatedAmount);
        }
      });

      utilities.forEach((fee) => {
        if (fee.amount) {
          amountsOwed.push({
            timeperiod: fee.timePeriodDisplay,
            description: `Utilities: ${fee.type} *`,
            amount: `$${parseFloat(fee.amount).toFixed(2)}`,
          });
          // total += parseFloat(fee.amount);
        }
      });

      fees.forEach((fee) => {
        if (fee.amount) {
          amountsOwed.push({
            timeperiod: fee.timePeriodDisplay,
            description: `${fee.type} *`,
            amount: `$${parseFloat(fee.amount).toFixed(2)}`,
          });
          // total += parseFloat(fee.amount);
        }
      });

      otherCharges.forEach((fee) => {
        if (fee.amount) {
          amountsOwed.push({
            timeperiod: fee.timePeriodDisplay,
            description: `${fee.type} *`,
            amount: `$${parseFloat(fee.amount).toFixed(2)}`,
          });
          // total += parseFloat(fee.amount);
        }
      });

      amountsOwed.sort((a, b) => {
        if (a.timeperiod && b.timeperiod) {
          return this.compareDateRange(a.timeperiod, b.timeperiod);
        }
      });
      // //once sorted, add header
      // amountsOwed.unshift(
      //                [{text: 'PERIOD', bold: true}, {text: 'DESCRIPTION', bold: true}, {text: 'AMOUNT', bold: true}],
      //                )
      // add legal fees to bottom
      if (this.case.legalFeesPermitted) {
        // let attorneyLegalFeesTotal =
        //   parseFloat(this.total(this.case.legalFees[0].costs)) +
        //   parseFloat(this.total(this.case.legalFees[2].costs)) +
        //   parseFloat(this.total(this.case.legalFees[3].costs));
        // amountsOwed.push({
        //   timeperiod: "",
        //   description: "Attorney Fees *",
        //   amount: `$${attorneyLegalFeesTotal.toFixed(2)}`,
        // });
        // total += attorneyLegalFeesTotal;
        // let courtFeesTotal = parseFloat(
        //   this.total(this.case.legalFees[1].costs)
        // );
        let courtFeesTotal = 0;

        this.case.legalFees &&
          this.case.legalFees.forEach((value) => {
            courtFeesTotal += parseInt(value.amount);
          });

        amountsOwed.push({
          timeperiod: "",
          description: "Court Fees *",
          amount: `$${courtFeesTotal.toFixed(2)}`,
        });

        // total += courtFeesTotal;
      }
      // amountsOwed.push(['', {text: 'TOTAL', bold: true}, {text: `$${total.toFixed(2)}`, bold: true}])
      // this.feesTotal = `$${total.toFixed(2)}`;
      return amountsOwed;
    },
    dollarFormat(number) {
      return `$${parseInt(number).toFixed(2)}`;
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
    nextRentDue() {
      const today = moment();
      let dueDate = "";
      switch (this.case.rentCycle) {
        case "Monthly":
          if (today.date() < parseFloat(this.case.rentDueBy)) {
            dueDate = moment([
              today.year(),
              today.month(),
              parseFloat(this.case.rentDueBy),
            ]);
            this.rentDueBeforeTrial = dueDate;
          } else {
            dueDate = moment([
              today.year(),
              today.add(1, "months").month(),
              parseFloat(this.case.rentDueBy),
            ]);
            this.rentDueBeforeTrial = dueDate;
          }
          return dueDate.format("MM/DD/YYYY");
        case "Weekly":
          return this.getNextDayOfTheWeek(
            this.case.rentDueBy,
            true,
            today
          ).format("MM/DD/YYYY");
        // case 'Bi-weekly':
        //     return `every other ${this.case.rentDueBy}`
        case "Semi-monthly":
          if (today.date() < parseFloat(this.case.rentDueBy[0])) {
            dueDate = moment([
              today.year(),
              today.month(),
              parseFloat(this.case.rentDueBy[0]),
            ]);
            this.rentDueBeforeTrial = dueDate;
          } else if (today.date() < parseFloat(this.case.rentDueBy[1])) {
            dueDate = moment([
              today.year(),
              today.month(),
              parseFloat(this.case.rentDueBy[1]),
            ]);
            this.rentDueBeforeTrial = dueDate;
          } else {
            dueDate = moment([
              today.year(),
              today.add(1, "months").month(),
              parseFloat(this.case.rentDueBy[0]),
            ]);
            this.rentDueBeforeTrial = dueDate;
          }
          return dueDate.format("MM/DD/YYYY");
        default:
          return "MISSING INFORMATION";
      }
    },
    getNextDayOfTheWeek(dayName, excludeToday = true, refDate = moment()) {
      const addedDays =
        +excludeToday +
        ((this.dayToNumber(dayName) + 7 - refDate.day() - +excludeToday) % 7);
      return refDate.add(addedDays, "days");
    },
    numberToDay(number) {
      switch (parseInt(number)) {
        case 0:
          return "Sunday";
        case 1:
          return "Monday";
        case 2:
          return "Tuesday";
        case 3:
          return "Wednesday";
        case 4:
          return "Thursday";
        case 5:
          return "Friday";
        case 6:
          return "Saturday";
      }
    },
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
    calculateNextAmount() {
      const calcTotal = this.feesTotal + this.case.rentAmount;

      return this.dollarFormat(calcTotal);
    },
    clientTypeExtended() {
      if (!this.currentProperty.contactInfo)
        return console.error("currentProperty.contactInfo is missing??");

      const { clientType, ownershipType } = this.currentProperty;

      switch (ownershipType) {
        case "Individual":
          if (clientType === "owner") return "the Landlord";
          return "an agent for the Owner";
        case "General Partnership":
          if (clientType === "owner")
            return "the General Partner of the Partnership";
          return "an agent of the General Partner of the Partnership";
        case "Corporation":
          if (clientType === "owner") return "a member of the corporation";
          return "an authorized officer of the corporation";
        case "Limited Liability Company":
          if (clientType === "owner")
            return "a member of the limited liability company";
          else return "an authorized officer of the limited liability company";
        default:
          return "";
      }
    },
  },
};
