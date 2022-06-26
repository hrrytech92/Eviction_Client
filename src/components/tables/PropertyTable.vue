<template>
  <div class="evictions-table">
    <LoadingOverlay :active="loading" />
    <v-data-table
      v-if="items.length > 0"
      v-model="selected"
      :headers="headers"
      :header-props="{ 'sort-icon': 'mdi-menu-up' }"
      :items="items"
      :search="search"
      :must-sort="true"
      :custom-filter="customFilter"
      item-key="ID"
      :items-per-page="itemsPerPage"
      :footer-props="{
        showFirstLastPage: true,
        firstIcon: 'mdi-skip-previous',
        lastIcon: 'mdi-skip-next',
        prevIcon: 'mdi-menu-left',
        nextIcon: 'mdi-menu-right',
        itemsPerPageText: 'Number of properties to display',
        pageText: pageText,
      }"
      class="cell-height expanded-table rounded-table pa-4"
      @page-count="pageCount = $event"
      @update:options="updateOptions"
    >
      <template v-slot:item="{ item }">
        <tr class="data-row">
          <td>
            <div class="pl-5">{{ item.deedNames }}</div>
          </td>

          <td>
            <div>
              {{ item.streetAddress }}{{ getUnitNoString(item.unitNo) }}
            </div>
            <div>
              {{ item.city }}, {{ getStateCode(item.state) }} {{ item.zipcode }}
            </div>
          </td>
          <td>
            <div>{{ item.county }}</div>
          </td>
          <td>
            <div v-if="item.registrationFiled">
              <v-icon color="primary" class="mr-2"> mdi-check-circle </v-icon>
              <span style="vertical-align: middle">{{
                item.registrationDocsFiledDate
              }}</span>
            </div>
          </td>
          <td>
            <v-menu offset-y bottom right open-on-hover content-class="mt-n1">
              <template v-slot:activator="{ on }">
                <v-btn small icon color="primary" class="btn--plain" v-on="on">
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
              </template>

              <v-list dense>
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
          </td>
        </tr>
      </template>

      <!-- Add Property Row -->
      <!-- <template 
        v-if="items.length !== 0" 
        slot="body.append"
      >
        <tr>
          <td :colspan="headers.length">
            <div class="extra-row d-flex justify-end align-center">
              <div class="secondary--text mr-10 font-weight-medium">
                ADD NEW
              </div>
              <v-btn
                fab
                depressed
                color="primary"
                height="45"
                width="45"
                @click="$router.push('/properties/new')"
              >
                <span
                  class="white--text font-weight-regular"
                  style="font-size: 40px"
                >+</span>
              </v-btn>
            </div>
          </td>
        </tr>
      </template> -->

      <!-- NO data available -->
      <!-- <template v-slot:no-data></template> -->
    </v-data-table>

    <div
      v-if="items.length === 0"
      class="d-flex justify-center align-center flex-column no-data-table-inner pa-12"
    >
      <i
        class="icofont-home primary--text"
        style="font-size: 5rem; line-height: 1"
      />
      <h5 class="secondary--text custom-subtitle">Set up a property.</h5>
      <p class="slim--text">
        Properties are added here when you draft your pleadings. Save time on
        future filings by selecting listed properties.
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
import useRequest from "@/utils/useRequest";
export default {
  name: "PropertyTable",
  components: {
    DeleteRecordDialog,
  },
  props: {
    items: {
      type: Array,
      default: () => [],
    },
    search: {
      type: String,
      default: "",
    },
    loading: {
      type: Boolean,
      default: false,
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
          width: "20%",
        },
        {
          text: "Property Address",
          value: "streetAddress",
          class: "header-text secondary--text font-weight-medium",
          align: "left",
          width: "20%",
          sortable: false,
        },
        {
          text: "County",
          value: "county",
          class: "header-text secondary--text font-weight-medium",
          align: "left",
          width: "20%",
        },
        {
          text: "Registration",
          value: "registrationFiled",
          class: "header-text secondary--text font-weight-medium",
          align: "center",
          sortable: false,
          width: "15%",
        },
        {
          text: "",
          value: "menu",
          class: "header-text secondary--text font-weight-medium",
          align: "center",
          sortable: false,
          width: "5%",
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
          title: "Delete",
          icon: "close-circled",
          onclick: (item) => this.showDeleteDialog(item),
        },
      ],
      itemsPerPage: 5,
      pageCount: 0,
      page: 1,
    };
  },
  computed: {
    userHeaders() {
      return this.$store.getters.propertyHeaders;
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
  mounted() {
    console.log("items", this.items);
  },
  methods: {
    customFilter(value, search, items) {
      return (
        (value !== null &&
          search !== null &&
          typeof value === "string" &&
          items.deedNames
            .toString()
            .toLowerCase()
            .includes(search.toString().toLowerCase())) ||
        (items.city !== null
          ? items.city.toString().toLowerCase().includes(search.toLowerCase())
          : false) ||
        (items.unitNo !== null
          ? items.unitNo.toString().toLowerCase().includes(search.toLowerCase())
          : false) ||
        (items.streetAddress !== null
          ? items.streetAddress
              .toString()
              .toLowerCase()
              .includes(search.toLowerCase())
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
        this.getStateCode(items.state)
          .toString()
          .toLowerCase()
          .includes(search.toLowerCase())
      );
    },
    updateOptions(option) {
      this.page = option.page;
    },
    actionDecision(item, action) {
      if (action.type === "complete") {
        this.$router.push({
          path: JSON.parse(action.details).route,
          query: { status: "started", caseId: item.id },
        });
      } else {
        this.dialogCase = item;
        this.dialogAction = item.action;
        this.dialogName = `${item.action.api}Dialog`;
        this.dialogOpen = true;
      }
    },
    changeDialog(dialogName) {
      this.$store.commit("setDialog", dialogName);
      this.dialogOpen = false;
    },
    changeNumToCurrency(num) {
      return `$${parseFloat(num)
        .toFixed(2)
        .replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, "$1,")}`;
    },
    fixDate(date) {
      if (date) {
        const d = new Date(Date.parse(date));
        const day = d.getDate();
        const month = d.getMonth() + 1; // months are counted starting from 0
        const yr = d.getFullYear();
        return `${month}.${day}.${yr}`;
      }
      return "";
    },
    showDeleteDialog(item) {
      this.showDeleteRecordDialog = true;
      this.selectedItem = item;
    },
    async deleteRecord() {
      await useRequest({
        path: `api/property/${this.selectedItem.propertyId}`,
        method: "DELETE",
        onSuccess: () => {
          this.$store.dispatch("property/loadProperties");
          this.showDeleteRecordDialog = false;
        },
      });
    },
  },
};
</script>

<style>
.theme--light.v-data-table {
  background-color: transparent;
}

.properties-table .v-data-table__wrapper {
  padding: 30px 48px 50px;
}

/* Table header style */
.properties-table .v-data-table thead tr th {
  border-bottom: none !important;
}

.theme--light.v-data-table thead tr th:first-child {
  border-top-left-radius: 20px;
}

.theme--light.v-data-table thead tr th:first-child {
  border-top-left-radius: 20px !important;
}

.theme--light.v-data-table thead tr th:last-child {
  border-top-right-radius: 20px;
}

.theme--light.v-data-table thead tr th:last-child {
  border-top-right-radius: 20px !important;
}

/* Table Body style */
.theme--light.v-data-table tbody {
  background-color: white;
  border-radius: 20px;
}

.properties-table .theme--light.v-data-table tbody {
  box-shadow: 15px 15px 40px #00000029;
}

/* Table Row style */
/* .v-data-table__wrapper table tr:not(.v-data-table__expanded__content) td {
  height: 100px !important;
} */

.v-data-table__wrapper table tr.v-data-table__expanded td {
  border: none !important;
}

.extra-row {
  width: 100%;
  height: 100px;
}

.properties-table
  .theme--light.v-data-table
  tbody
  tr:first-child
  td:first-child {
  border-top-left-radius: 20px;
}
.properties-table
  .theme--light.v-data-table
  tbody
  tr:first-child:hover
  td:first-child {
  border-top-left-radius: 20px !important;
}

.properties-table
  .theme--light.v-data-table
  tbody
  tr:first-child
  td:last-child {
  border-top-right-radius: 20px;
}
.properties-table
  .theme--light.v-data-table
  tbody
  tr:first-child:hover
  td:last-child {
  border-top-right-radius: 20px !important;
}

.theme--light.v-data-table tbody tr:last-child td:first-child {
  border-bottom-left-radius: 20px;
}
.theme--light.v-data-table tbody tr:last-child:hover td:first-child {
  border-bottom-left-radius: 20px !important;
}

.theme--light.v-data-table tbody tr:last-child td:last-child {
  border-bottom-right-radius: 20px;
}
.theme--light.v-data-table tbody tr:last-child:hover td:last-child {
  border-bottom-right-radius: 20px !important;
}

/* Table Footer style */
.theme--light.v-data-table .v-data-footer {
  border-top: none;
  justify-content: space-between;
  position: relative;
  padding: 0 60px;
}

.theme--light.v-data-table .v-data-footer .v-data-footer__select {
  margin-left: 0 !important;
  color: #1e5273;
}

.v-data-footer__pagination {
  position: absolute;
  right: 155px;
  margin: 0 !important;
  color: #003a60;
  font-size: 14px;
  font-weight: 600;
}

.v-data-footer__icons-before {
  position: absolute;
  right: 250px;
}

.properties-table .v-data-footer__icons-before i,
.properties-table .v-data-footer__icons-after i {
  color: #ff854e !important;
}

/* No Data */
.no-data-table-inner {
  border-radius: 20px;
  background: #ffffff;
  box-shadow: 15px 15px 40px #00000029;
}

.no-data-table-inner p {
  font-size: 17px;
  max-width: 450px;
  margin: 0 auto;
  text-align: center;
}

.border-bottom {
  border-bottom: 1px solid #ddd;
}

/* Pagination style */
.evictions-table .mdi-menu-left,
.evictions-table .mdi-menu-right {
  font-size: 33px !important;
}

/* Sort Icon */
.v-data-table-header__icon {
  color: #4dccc4 !important;
  font-size: 24px !important;
}
</style>

<style scoped>
.data-row > td {
  height: 100px !important;
  color: #003a60 !important;
}
</style>
