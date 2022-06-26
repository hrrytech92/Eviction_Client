<template>
  <div class="evictions-table">
    <v-data-table
      v-if="cases.length > 0"
      v-model="selected"
      :headers="headers"
      :header-props="{ 'sort-icon': 'mdi-menu-up' }"
      :must-sort="true"
      :items="cases"
      :search="search"
      :expanded="cases"
      :custom-filter="customFilter"
      item-key="ID"
      class="cell-height expanded-table rounded-tables"
      :items-per-page="itemsPerPage"
      :footer-props="{
        showFirstLastPage: true,
        firstIcon: 'mdi-skip-previous',
        lastIcon: 'mdi-skip-next',
        prevIcon: 'mdi-menu-left',
        nextIcon: 'mdi-menu-right',
        itemsPerPageText: 'Number of cases to display',
        pageText: pageText,
      }"
      @page-count="pageCount = $event"
      @update:options="updateOptions"
    >
      <!-- Cell Top Section items -->

      <template v-slot:[`item.deedNames`]="{ item }">
        <div class="pl-4">{{ item.deedNames }}</div>
      </template>

      <template v-slot:[`item.streetAddress`]="{ item }">
        <div>{{ item.streetAddress }}{{ getUnitNoString(item.unitNo) }}</div>
        <div>
          {{ item.city }}, {{ getStateCode(item.state) }} {{ item.zipcode }}
        </div>
      </template>

      <template v-slot:[`item.tenant`]="{ item }">
        <div v-if="expandTenants && selectedItem.id === item.id">
          <div v-for="(tenant, index) in item.tenants" :key="index">
            {{ tenant.name }}
          </div>
          <v-btn
            v-if="item.tenants.length > 2"
            text
            color="accent"
            class="font-weight-regular btn--plain pa-0 ma-0"
            style="height: 20px; min-width: 0"
            @click="hideTenantList(item)"
          >
            less
          </v-btn>
        </div>
        <div v-else>
          <div v-for="(tenant, index) in item.tenants.slice(0, 2)" :key="index">
            {{ tenant.name }}
          </div>
          <v-btn
            v-if="item.tenants.length > 2"
            text
            color="accent"
            class="font-weight-regular btn--plain pa-0 ma-0"
            style="height: 20px; min-width: 0"
            @click="showTenantList(item)"
          >
            more
          </v-btn>
        </div>
      </template>

      <template v-slot:[`item.county`]="{ item }">
        <div>{{ item.county }}</div>
        <div
          class="accent--text"
          @click="viewCase(item)"
          style="cursor: pointer"
        >
          {{ item.docketNo }}
        </div>
      </template>

      <template v-slot:[`item.hearingDate`]="{}">
        <div style="color: #808080">
          {{ "Pending" }}
        </div>
        <!--  need to change in production -->
      </template>

      <template v-slot:[`item.suit`]="{ item }">
        <div>
          <span class="font-weight-medium">Initial: </span>
          <!-- {{ changeNumToCurrency(item.initialSuitAmount) }} -->
          {{ getInitialSuitAmount(item) }}
        </div>
        <div>
          <span class="font-weight-medium">Current: </span>
          {{ getInitialSuitAmount(item) }}
        </div>
      </template>

      <template v-slot:[`item.representation`]="{ item }">
        <v-avatar size="30" class="mr-2">
          <v-img v-if="item.attorneyAvatar" :src="item.attorneyAvatar" />
          <v-avatar v-else color="secondary_light">
            <span v-if="item.attorneyFirstName" class="white--text"
              >{{ item.attorneyFirstName.charAt(0)
              }}{{ item.attorneyLastName.charAt(0) }}</span
            >
            <span v-else class="white--text">PR</span>
          </v-avatar>
        </v-avatar>
        <span v-if="item.attorneyId"
          >{{ item.attorneyfirstName.charAt(0) }}.
          {{ item.attorneylastName }}</span
        >
        <span v-else>Pro Se</span>
      </template>

      <template v-slot:[`item.menu`]="{ item }">
        <v-menu offset-y bottom right open-on-hover content-class="mt-n1">
          <template v-slot:activator="{ on }">
            <v-btn small icon color="primary" class="btn--plain" v-on="on">
              <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
          </template>

          <v-list dense>
            <v-list-item
              v-if="isShowViewCaseBtn(item.actions)"
              @click="viewCase(item)"
            >
              <v-list-item-title class="overline info--text">
                <i
                  style="font-size: 20px"
                  :class="`icofont-search-document pr-4`"
                />
                VIEW CASE
              </v-list-item-title>
            </v-list-item>
            <v-list-item
              v-for="(btn, i) in btns"
              :key="i"
              @click="btn.onclick(item)"
            >
              <v-list-item-title class="overline info--text">
                <i
                  style="font-size: 20px"
                  :class="`icofont-${btn.icon} pr-4`"
                />
                {{ btn.title }}
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </template>

      <!-- Cell Bottom Section items -->

      <!-- <template v-slot:[`item.planDescription`]="{ item }">
        <div>{{ item.planDescription }}</div>
      </template> -->

      <!-- <template v-slot:[`item.status`]="{ item }">
        <div>v{{ item.status }}</div>
        <div v-if="item.subStatus" class="font-italic">
          {{ item.subStatus }}
        </div>
        <div class="lighter-blue">
          {{ fixDate(item.statusDate) }}
        </div>
      </template> -->

      <!-- <template v-slot:[`item.action`]="{ item }">
        <span v-for="action in item.actions" :key="action.actionId">
          <div>
            <a href="#" @click.stop="actionDecision(action, item)">{{
              action.Name
            }}</a>
          </div>
        </span> -->

      <!-- <div class="lighter-blue">Due: {{item.action.date}}</div> -->
      <!-- </template> -->

      <!-- Add Property Row -->
      <template v-if="cases.length !== 0" slot="body.append">
        <tr>
          <td :colspan="headers.length">
            <div class="extra-row d-flex justify-end align-center">
              <div class="secondary--text mr-10 font-weight-medium">
                Start New Eviction
              </div>
              <v-btn
                fab
                depressed
                color="primary"
                height="45"
                width="45"
                @click="$router.push('/verified-complaint/new')"
              >
                <span
                  class="white--text font-weight-regular"
                  style="font-size: 40px"
                  >+</span
                >
              </v-btn>
            </div>
          </td>
        </tr>
      </template>

      <!-- NO data available -->
      <!-- <template v-slot:no-data></template> -->

      <!-- TODO : Check item.actions and uncomment it later -->
      <!--eslint-disable vue/no-template-shadow-->
      <template
        v-slot:expanded-item="{ headers, item }"
        class="custom-expanded-row"
      >
        <!--eslint-enable-->
        <td
          class="custom-expanded-row secondary--text"
          :colspan="headers.length"
        >
          <v-row no-gutters class="pt-4 mb-5 px-4">
            <v-col cols="5" class="d-flex align-center">
              <div class="primary--text caption font-weight-bold pr-4">
                STATUS
              </div>
              <div class="font-weight-medium pr-2">
                {{ statusLabel(item) }}
              </div>
            </v-col>
            <v-col cols="5" class="d-flex align-center">
              <div class="primary--text caption font-weight-bold pr-4">
                ACTION
              </div>
              <div class="font-weight-medium pr-2">
                {{ getCaseActionLabel(item) }}
                <!-- <span v-if="isCompletedCase(item) && !item.manageConf">
                  Enter Court Information
                </span>
                <span
                  v-else-if="
                    isCompletedCase(item) && item.manageConf && !item.clrsDraft
                  "
                >
                  Certification of Lease and Registration Statement
                </span>
                <span
                  v-else-if="
                    isCompletedCase(item) &&
                    !item.isClrsStandaloneFormTouched &&
                    isCLRSCase(item)
                  "
                >
                  Follow-up with Court
                </span>
                <span v-else>
                  {{
                    item.actions && item.actions.length && item.actions[0]
                      ? item.actions[0].name
                      : ""
                  }}
                </span> -->
              </div>
            </v-col>
            <v-col>
              <NextStepBtn
                :caseData="item"
                :actionRouteName="getActionRouteName(item)"
              />
              <!-- <v-btn
                v-if="item.actions[0] && item.actions[0].type !== 'complete'"
                color="#FEE440"
                class="px-10 white--text"
                small
                rounded
                depressed
                @click="actionDecision(item, item.actions[0])"
              >
                complete
              </v-btn> -->

              <!-- <v-btn
                v-if="item.actions && item.actions.length && item.actions[0]"
                color="accent_light"
                class="px-10 white--text"
                small
                rounded
                depressed
                :disabled="!item.actions[0]"
                @click="actionDecision(item)"
              >
                next step 1
              </v-btn>
              <v-btn
                v-if="!item.actions[0] && !item.manageConf"
                color="accent_light"
                class="px-10 white--text"
                small
                rounded
                depressed
                @click="
                  $router.push(
                    `/verified-complaint/${item.id}/single/court-information/`
                  )
                "
              >
                next step 2
              </v-btn>
              <v-btn
                v-if="
                  !item.actions[0] &&
                  item.manageConf &&
                  !item.clrsDraft &&
                  !item.clrsSubmission
                "
                color="accent_light"
                class="px-10 white--text"
                small
                rounded
                depressed
                @click="
                  $router.push(`/verified-complaint/${item.id}/single/lease`)
                "
              >
                next step 3
              </v-btn>
              <v-btn
                v-if="
                  !item.actions[0] &&
                  item.manageConf &&
                  item.clrsDraft &&
                  !item.clrsSubmission
                "
                color="accent_light"
                class="px-10 white--text"
                small
                rounded
                depressed
                @click="
                  $router.push(`/verified-complaint/${item.id}/single/lease`)
                "
              >
                next step 4
              </v-btn> -->
              <!-- <v-btn
                v-else
                
                color="accent_light"
                class="px-10 white--text"
                small
                rounded
                depressed
                disabled
              >
                pending
              </v-btn> -->
            </v-col>
          </v-row>
        </td>
      </template>

      <template v-slot:[`item.data-table-select`]="{ isSelected, select }">
        <v-simple-checkbox
          color="primary"
          on-icon="mdi-checkbox-blank-circle"
          off-icon="mdi-checkbox-blank-circle-outline"
          :value="isSelected"
          @input="select($event)"
        />
      </template>

      <!-- <template v-slot:header.data-table-select="{ isSelected, select }"><v-simple-checkbox color="primary" on-icon="mdi-checkbox-blank-circle"
                off-icon="mdi-checkbox-blank-circle-outline" :value="isSelected" @input="select($event)"></v-simple-checkbox>
      </template> -->

      <template v-slot:[`header.data-table-select`]="{ on, props }">
        <v-simple-checkbox
          color="primary"
          on-icon="mdi-checkbox-blank-circle"
          off-icon="mdi-checkbox-blank-circle-outline"
          indeterminate-icon="mdi-checkbox-blank-circle-outline"
          v-bind="props"
          v-on="on"
        />
      </template>
    </v-data-table>

    <div
      v-if="cases.length === 0"
      class="d-flex justify-center align-center flex-column no-data-table-inner pa-12"
    >
      <i
        class="icofont-ui-folder primary--text"
        style="font-size: 5rem; line-height: 1"
      />
      <h5 class="secondary--text custom-subtitle">Begin your first case.</h5>
      <p class="slim--text">
        Looks like you have not initiated an eviction. Start drafting your
        pleadings. All of your case records will appear right here.
      </p>
      <v-btn
        rounded
        color="primary"
        class="px-8 mb-2 mt-4 white--text capital--btn"
        @click="$router.push('/verified-complaint/new')"
      >
        Start Eviction
      </v-btn>
    </div>

    <v-dialog v-model="dialogOpen" value="''" :max-width="maxWidth">
      <component
        :is="dynamicDialog"
        :dialog-case="dialogCase"
        :dialog-action="dialogAction"
        @change:dialog="changeDialog"
      />
    </v-dialog>

    <v-dialog
      v-model="showDeleteRecordDialog"
      persistent
      value="''"
      max-width="600"
    >
      <DeleteRecordDialog
        @close="showDeleteRecordDialog = false"
        @submit="deleteRecord"
      />
    </v-dialog>
  </div>
</template>

<script>
import DeleteRecordDialog from "@/components/dialogs/DeleteRecordDialog";
import { evictionHeaders } from "@/resources/index.js";
import NextStepBtn from "@/components/EvictionTableNextStepBtn";
import { mapGetters } from "vuex";
import useRequest from "@/utils/useRequest";
import getCaseStatusLabel from "@/utils/getCaseStatusLabel";

export default {
  name: "EvictionTable",
  components: {
    DeleteRecordDialog,
    NextStepBtn,
  },
  props: {
    search: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      showDeleteRecordDialog: false,
      selectedItem: {},
      headers: [
        {
          text: "Owner",
          value: "deedNames",
          class: "header-text secondary--text font-weight-medium",
          align: "left",
        },
        {
          text: "Property",
          value: "streetAddress",
          class: "header-text secondary--text font-weight-medium",
          align: "left",
          sortable: false,
        },
        {
          text: "Tenants",
          value: "tenant",
          class: "header-text secondary--text font-weight-medium",
          align: "left",
          sortable: false,
        },
        {
          text: "County",
          value: "county",
          class: "header-text secondary--text font-weight-medium",
          align: "left",
        },
        // {
        //   text: "Hearing",
        //   value: "hearingDate",
        //   class: "header-text secondary--text font-weight-medium",
        //   align: "left",
        // },
        {
          text: "Suit Amount",
          value: "suit",
          class: "header-text secondary--text font-weight-medium",
          align: "left",
          sortable: false,
        },
        {
          text: "Representation",
          value: "representation",
          class: "header-text secondary--text font-weight-medium",
          align: "center",
          sortable: false,
        },
        {
          text: "",
          value: "menu",
          class: "header-text secondary--text font-weight-medium",
          align: "center",
          sortable: false,
        },
      ],
      dialogName: "",
      dialogOpen: false,
      dialogCase: {},
      dialogAction: {},
      expandTenants: false,
      selected: [],
      btns: [
        {
          title: "DELETE",
          icon: "close-circled",
          onclick: (item) => this.showDeleteDialog(item),
        },
      ],
      itemsPerPage: 5,
      pageCount: 0,
      page: 1,
      mapCaseStatusToRoute: {
        Property: "vc-property-type",
        "Tenant Information": "vc-tenants",
        "Lease Details": "vc-lease-details",
        "Past Due Rent": "vc-past-due-rent",
        "Additional Charges": "vc-additional-charges",
        "Legal Fees": "vc-legal-fees",
        Confirmation: "vc-confirmation",
        Verification: "vc-verification",
        Certification: "vc-certification",
        Lease: "vc-lease",
        Registration: "vc-registration",
        "Summary of Suit Amount": "vc-suit-summary",
        Filing: "vc-filing",
        "Review & Sign": "vc-signature",
      },
    };
  },
  computed: {
    ...mapGetters({
      cases: "eviction/cases",
      isAuthenticated: "isAuthenticated",
    }),
    userHeaders() {
      return evictionHeaders;
    },
    computedHeaders() {
      return this.headers.filter((header) =>
        this.userHeaders.includes(header.value)
      );
    },
    dynamicDialog() {
      return this.dialogName;
    },
    maxWidth() {
      if (this.dialogName === "fileSCDialog") {
        return 800;
      }
      return 600;
    },
    pageText() {
      return "Pages " + this.page + ` / ` + this.pageCount;
    },
  },
  methods: {
    customFilter(value, search, items) {
      const isExistTenants =
        items.tenants.length > 0
          ? !(
              Object.keys(items.tenants)
                .map((key) => {
                  const item = items.tenants[key];
                  return item.name !== null
                    ? item.name
                        .toString()
                        .toLowerCase()
                        .includes(search.toLowerCase())
                    : false;
                })
                .filter((bool) => !bool).length > 0
            )
          : false;

      return (
        (value !== null &&
          search !== null &&
          typeof value === "string" &&
          items.deedNames
            .toString()
            .toLowerCase()
            .includes(search.toString().toLowerCase())) ||
        (items.streetAddress !== null
          ? items.streetAddress
              .toString()
              .toLowerCase()
              .includes(search.toLowerCase())
          : false) ||
        (items.unitNo !== null
          ? items.unitNo.toString().toLowerCase().includes(search.toLowerCase())
          : false) ||
        (items.city !== null
          ? items.city.toString().toLowerCase().includes(search.toLowerCase())
          : false) ||
        (items.county !== null
          ? items.county.toString().toLowerCase().includes(search.toLowerCase())
          : false) ||
        (items.zipcode !== null
          ? items.zipcode
              .toString()
              .toLowerCase()
              .includes(search.toLowerCase())
          : false) ||
        isExistTenants
      );
    },
    updateOptions(option) {
      this.page = option.page;
    },
    // isCompletedCase(item) {
    //   return item.status === "Verified Complaint Complete";
    // },
    // isCLRSCase(item) {
    //   const { clrsDraft, clrsUploadRegistration, clrsExemption } = item;

    //   if (clrsDraft) {
    //     if (clrsUploadRegistration !== null || clrsExemption) {
    //       return true;
    //     } else {
    //       if (clrsExemption === false) {
    //         return false;
    //       }
    //     }
    //   }

    //   return false;
    // },
    getActionRouteName(item) {
      const { status, actions } = item;
      const { clientRouteName, actionId } = actions[0] || {};
      if (actionId === 181)
        //Complete Document
        return this.mapCaseStatusToRoute[status];
      return clientRouteName || "";
    },
    // actionDecision(item, action) {
    // const routeName = this.mapCaseStatusToRoute[item.status];
    // return this.$router.push({
    //   name: routeName,
    //   params: { id: item.id },
    // });
    //   if (item.status === "Property") {
    //     return this.$router.push({
    //       name: "vc-property-type",
    //       params: { id: item.id },
    //       // query: { status: item.status },
    //       query: { status: "Property" },
    //     });
    //   }
    //   if (item.status !== "Verified Complaint in Progress")
    //     return this.$router.push({
    //       name: "verified-complaint",
    //       params: { id: item.id },
    //       query: { status: item.status },
    //     });

    //   if (action && action?.type === "complete")
    //     this.$router.push({
    //       name: JSON.parse(action.details).route,
    //       params: { id: item.id },
    //       query: { status: "started" },
    //     });

    //    else {
    //     this.dialogCase = item;
    //     this.dialogAction = item.action;
    //     this.dialogName = `${item.action?.api}Dialog`;
    //     this.dialogOpen = true;
    //   }
    // },
    changeDialog(dialogName) {
      this.$store.commit("setDialog", dialogName);
      this.dialogOpen = false;
    },
    viewCase(item) {
      this.$router.push(`case-view/${item.id}/overview`);
    },
    changeNumToCurrency(num) {
      if (!num) return "$0.00";
      return `$${parseFloat(num)
        .toFixed(2)
        .replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, "$1,")}`;
    },

    calculateTotal(arr) {
      let total = 0;
      arr.forEach((item) => {
        if (item.amount && item.selected) {
          total += parseFloat(item.amount);
        }
      });
      return total;
    },
    getInitialSuitAmount(item) {
      let totalMoney = 0;
      [
        "lateCharges",
        "utilities",
        "fees",
        "otherCharges",
        "pastDueRent",
        "legalFees",
      ].forEach((property) => {
        try {
          if (item[property] === null || item[property] === undefined) return;
          totalMoney += this.calculateTotal(JSON.parse(item[property]));
        } catch (e) {
          return e;
        }
      });

      return this.changeNumToCurrency(totalMoney);
    },
    showDeleteDialog(item) {
      this.showDeleteRecordDialog = true;
      this.selectedItem = item;
    },
    async deleteRecord() {
      this.showDeleteRecordDialog = false;
      useRequest({
        path: `api/case/${this.selectedItem.id}`,
        method: "DELETE",
      }).then(() => {
        this.$store.dispatch("eviction/loadCases");
      });
    },
    hideTenantList(item) {
      this.selectedItem = item;
      this.expandTenants = false;
    },
    showTenantList(item) {
      this.selectedItem = item;
      this.expandTenants = true;
    },
    getCaseActionLabel(caseLine) {
      return caseLine.actions[0]?.name || "Follow-up with Court";
    },
    statusLabel(caseLine) {
      return getCaseStatusLabel(caseLine);
    },
    isShowViewCaseBtn(actions) {
      return actions[0]?.actionId !== 181;
    },
  },
};
</script>

<style>
.evictions-table .v-data-table__wrapper {
  padding: 30px 48px 50px;
}
.evictions-table .v-data-table__wrapper > table {
  box-shadow: 15px 15px 40px #00000029;
  border-radius: 20px;
}
.evictions-table
  .theme--light.v-data-table
  > .v-data-table__wrapper
  > table
  > thead
  > tr
  > th {
  height: 65px !important;
  background-color: white;
  text-transform: uppercase;
}
/* .expanded-table.v-data-table td {
  padding: 40px 16px;
} */
.v-data-table.rounded-table.theme--light {
  border-radius: 20px;
}
.v-data-table td.custom-expanded-row {
  background-color: #f8fafb;
  padding: 4px 16px;
}
.v-data-table tbody tr.v-data-table__expanded__content {
  box-shadow: none !important;
  -webkit-box-shadow: none !important;
}

.v-data-table thead th.active.asc .v-data-table-header__icon {
  opacity: 1 !important;
}

.v-data-table thead th.active.desc .v-data-table-header__icon {
  opacity: 1 !important;
}

.v-data-table-header__icon {
  opacity: 1 !important;
}
.v-data-table-header tr th:first-child {
  padding-left: 36px !important;
}
</style>
