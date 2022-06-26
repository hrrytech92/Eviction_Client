<template>
  <div class="evictions-table">
    <v-data-table
      v-if="pleadings.length > 0"
      v-model="selected"
      :headers="headers"
      :header-props="{ 'sort-icon': 'mdi-menu-up' }"
      :items="pleadings"
      :expanded="pleadings"
      item-key="ID"
      :items-per-page="itemsPerPage"
      :footer-props="{
        showFirstLastPage: true,
        firstIcon: 'mdi-skip-previous',
        lastIcon: 'mdi-skip-next',
        prevIcon: 'mdi-menu-left',
        nextIcon: 'mdi-menu-right',
        itemsPerPageText: 'Number of files to display',
        pageText: pageText,
      }"
      class="cell-height expanded-table rounded-table pa-4 myTable"
      @page-count="pageCount = $event"
      @update:options="updateOptions"
    >
      <template v-slot:[`item.name`]="{ item }">
        <div class="d-flex pl-4 py-4">
          <i
            :class="`icofont-file-pdf icofont-2x uploaded-file-icon`"
            @click="handleView({ item })"
          />
          <div class="secondary--text ml-3">
            <div
              class="font-weight-medium uploaded-file-title mt-3"
              @click="handleView({ item })"
            >
              {{ item.name }}
            </div>
            <!-- <div>{{ item.templateName }}.pdf</div> -->
          </div>
        </div>
      </template>

      <template v-slot:[`item.status`]>
        <v-icon color="primary"> mdi-check-circle </v-icon>
      </template>

      <template v-slot:[`item.drafted`]="{ item }">
        <div class="secondary--text">
          {{ fixDate(item.drafted) }}
        </div>
      </template>

      <template v-slot:[`item.updated`]="{ item }">
        <div class="secondary--text">
          {{ fixDate(item.updated) }}
        </div>
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
              v-for="(btn, i) in btns"
              :key="i"
              @click="handleView({ btn, item })"
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
    </v-data-table>
  </div>
</template>

<script>
import getPleadingMixin from "@/mixins/get-pleading";

export default {
  name: "PleadingsTable",
  components: {},
  mixins: [getPleadingMixin],
  props: {
    tableFilters: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      search: "",
      headers: [
        {
          text: "DOCUMENT",
          value: "name",
          class: "header-text secondary--text font-weight-medium",
          align: "left",
          width: "50%",
          sortable: false,
        },
        {
          text: "STATUS",
          value: "status",
          class: "header-text secondary--text font-weight-medium",
          align: "left",
          width: "15%",
          sortable: false,
        },
        {
          text: "DRAFTED",
          value: "drafted",
          class: "header-text secondary--text font-weight-medium",
          align: "left",
          width: "15%",
        },
        {
          text: "UPDATED",
          value: "updated",
          class: "header-text secondary--text font-weight-medium",
          align: "left",
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
      selected: [],
      itemsPerPage: 5,
      pageCount: 0,
      page: 1,
      btns: [
        // { title: "EDIT", icon: "pencil" },
        { title: "VIEW", icon: "search-document" },
        { title: "DOWNLOAD", icon: "cloud-download" },
        // { title: "DELETE", icon: "close-circled", onclick: "" },
      ],
    };
  },
  computed: {
    pleadings() {
      return this.$store.getters["eviction/pleadings"];
    },
    pageText() {
      return "Pages " + this.page + ` / ` + this.pageCount;
    },
  },
  mounted() {
    this.$store.dispatch("eviction/loadPleadings");
  },
  methods: {
    updateOptions(option) {
      this.page = option.page;
    },
    async handleView({ btn, item }) {
      await this.getPleading({
        templateName: item.templateName,
        inNewTab: btn?.title === "VIEW",
      });
    },

    fixDate(date) {
      if (date) {
        const d = new Date(Date.parse(date));
        let day = d.getDate();
        let month = d.getMonth() + 1; // months are counted starting from 0
        if (month < 10) {
          month = "0" + month.toString();
        }
        if (day < 10) {
          day = "0" + day.toString();
        }
        const yr = d.getFullYear();
        return `${month}.${day}.${yr}`;
      }
      return "";
    },
  },
};
</script>
