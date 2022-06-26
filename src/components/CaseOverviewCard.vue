<template>
  <v-card
    height="100%"
    style="box-shadow: 15px 15px 40px #00000029; border-radius: 20px"
  >
    <div class="pa-4 pl-8 secondary--text">
      <v-card-title class="font-weight-bold px-0">
        <div class="d-flex">Overview</div>
        <!-- <v-btn
          icon
          color="accent"
          class="btn--plain"
          @click="''"
        >
          <v-icon>mdi-pencil-outline</v-icon>
        </v-btn> -->
        <v-spacer />
        <div>
          <v-btn
            v-show="!showAll"
            icon
            color="primary"
            class="btn--plain"
            @click="showAll = true"
          >
            <v-icon large> mdi-menu-down </v-icon>
          </v-btn>
          <v-btn
            v-show="showAll"
            icon
            color="primary"
            class="btn--plain"
            @click="showAll = false"
          >
            <v-icon large> mdi-menu-up </v-icon>
          </v-btn>
        </div>
      </v-card-title>
      <v-container v-if="showAll" fluid class="pa-0">
        <v-row>
          <v-col>
            <div>
              <p class="overline info--text font-weight-bold mb-1">
                {{ currentCase.vcDateFiled ? "filed" : "drafted" }}
              </p>
              <p v-if="currentCase.vcDateFiled" class="spaced-text mb-0">
                {{ $dayjs(currentCase.vcDateFiled).format("MMMM DD, YYYY") }}
              </p>
              <p v-else class="spaced-text mb-0">
                <!-- {{ currentCase.statusDate }} -->
                {{ $dayjs(currentCase.statusDate).format("MMMM DD, YYYY") }}
              </p>
            </div>
          </v-col>
          <v-col>
            <div>
              <p class="overline info--text font-weight-bold mb-1">ground</p>
              <p class="spaced-text mb-0">Non-Payment of Rent</p>
            </div>
          </v-col>
          <v-col>
            <div>
              <p class="overline info--text font-weight-bold mb-1">judge</p>
              <p class="spaced-text mb-0" style="color: #8ba4b4">Pending</p>
            </div>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <div>
              <p class="overline info--text font-weight-bold mb-1">
                {{ currentCase.manageConf ? "conference" : "hearing" }}
              </p>
              <p
                v-if="currentCase.manageConf"
                class="spaced-text mb-0"
                style="color: #8ba4b4"
              >
                {{ currentCase.manageConf }}
              </p>
              <p v-else class="spaced-text" style="color: #8ba4b4">Pending</p>
            </div>
          </v-col>
          <v-col>
            <div>
              <p class="overline info--text font-weight-bold mb-1">
                suit amount
              </p>
              <p class="spaced-text mb-0">
                {{ getInitialSuitAmount(currentCase) }}
              </p>
            </div>
          </v-col>
          <v-col>
            <div>
              <p class="overline info--text font-weight-bold mb-1">county</p>
              <p class="spaced-text mb-0">
                {{ currentProperty.county }}
              </p>
            </div>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <div>
              <p class="overline info--text font-weight-bold mb-1">
                docket no.
              </p>
              <p class="spaced-text mb-0" style="color: #8ba4b4">
                {{ currentCase.docketNo ? currentCase.docketNo : "Pending" }}
              </p>
            </div>
          </v-col>
          <v-col>
            <div>
              <p class="overline info--text font-weight-bold mb-1">
                lease type
              </p>
              <p class="spaced-text mb-0">
                {{ currentCase.leaseTypeTitle }}
              </p>
            </div>
          </v-col>
          <v-col>
            <div>
              <p class="overline info--text font-weight-bold mb-1">
                court contact
              </p>
              <p class="spaced-text mb-0">
                {{ courtAddress.phone }}
                {{ courtAddress.ext }}
              </p>
            </div>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <div>
              <p class="overline info--text font-weight-bold mb-1">parties</p>
              <p class="spaced-text mb-0 pr-5">
                {{ currentProperty.deedNames }} vs.
                {{ compileTenants(currentCase.tenants) }}
              </p>
            </div>
          </v-col>
          <v-col>
            <div>
              <p class="overline info--text font-weight-bold mb-1">
                property address
              </p>
              <p class="spaced-text mb-0">
                {{ currentProperty.streetAddress
                }}<span v-if="currentProperty.unitNo"
                  >, {{ currentProperty.unitNo }}</span
                >
              </p>
              <p class="spaced-text mb-0">
                {{ currentProperty.city }},
                {{ currentProperty.state }}
                {{ currentProperty.zipcode }}
              </p>
            </div>
          </v-col>
          <v-col>
            <div>
              <p class="overline info--text font-weight-bold mb-1">
                court address
              </p>
              <p class="spaced-text mb-0">
                {{ courtAddress.county }} County Justice Center
              </p>
              <p class="spaced-text mb-0">
                {{ courtAddress.street }}
              </p>
              <p class="spaced-text mb-0">
                {{ courtAddress.city }},
                {{ courtAddress.state }}
                {{ courtAddress.zipcode }}
              </p>
              <!-- <p class="spaced-text mb-0">
                {{ courtAddress.phone }} ext.
                {{ courtAddress.ext }}
              </p> -->
            </div>
          </v-col>
        </v-row>
      </v-container>
    </div>
    <div class="card-action-bottom d-flex align-items-center">
      <h3 class="primary--text font-weight-medium mr-2">LATEST STATUS</h3>

      <span class="px-2 pt-1 secondary--text font-weight-medium">
        {{ latestStatusLabel }}
      </span>
    </div>
  </v-card>
</template>

<script>
import getCaseStatusLabel from "@/utils/getCaseStatusLabel";

export default {
  name: "CaseOverviewCard",
  props: {
    currentCase: {
      type: Object,
      default: () => {},
    },
    currentProperty: {
      type: Object,
      default: () => {},
    },
    courtAddress: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      courtInfo: {
        street: "1123 Broadway Ave.",
        city: "Newark",
        state: "NJ",
        zip: "99938",
        judge: "Hon. Walters",
      },
      showAll: true,
    };
  },
  computed: {
    latestStatusLabel() {
      return getCaseStatusLabel(this.currentCase);
    },
  },
  methods: {
    compileTenants(tenants) {
      let tenantsCompiled = "";
      if (!tenants) return "";
      // TODO: when pull data, check this works
      // if (tenants.tenantCompanyName) {
      //   return tenants.tenantCompanyName;
      // }
      if (this.currentCase.tenantCompanyName) {
        return this.currentCase.tenantCompanyName;
      }
      for (let i = 0; i < tenants.length; i++) {
        if (tenants.length - 2 === i) {
          tenantsCompiled += `${tenants[i].name} ` + `and `;
        } else if (tenants.length - 1 === i) {
          tenantsCompiled += tenants[i].name;
        } else {
          tenantsCompiled += `${tenants[i].name}` + `, `;
        }
      }
      return tenantsCompiled;
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
          totalMoney += this.calculateTotal(item[property]);
        } catch (e) {
          return e;
        }
      });
      return this.changeNumToCurrency(totalMoney);
    },
  },
};
</script>

<style></style>
