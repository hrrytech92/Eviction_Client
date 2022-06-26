<template>
  <div class="evictions-table">
    <v-data-table
      v-if="documents.length > 0"
      v-model="selected"
      :headers="headers"
      :header-props="{ 'sort-icon': 'mdi-menu-up' }"
      :items="documents"
      :expanded="documents"
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
      class="cell-height expanded-table rounded-table pa-4"
      @page-count="pageCount = $event"
      @update:options="updateOptions"
    >
      <template v-slot:[`item.name`]="{ item }">
        <div class="d-flex pl-4 py-4">
          <i
            :class="`icofont-file-${fileExtension(
              item.filename
            )} icofont-2x uploaded-file-icon`"
            @click="handleFileView(item)"
          />
          <div class="secondary--text ml-3">
            <div
              class="font-weight-medium uploaded-file-title"
              @click="handleFileView(item)"
            >
              {{ item.name }}
            </div>
            <div>{{ item.filename }}</div>
          </div>
        </div>
      </template>

      <template v-slot:[`item.created_at`]="{ item }">
        <div class="secondary--text">
          {{ fixDate(item.created_at) }}
        </div>
      </template>

      <template v-slot:[`item.menu`]="{ item }">
        <v-menu offset-y bottom right open-on-hover>
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
      </template>

      <!-- Add File Row -->
      <template v-if="documents.length !== 0" slot="body.append">
        <tr>
          <td :colspan="headers.length">
            <div class="extra-row d-flex justify-end align-center">
              <div class="secondary--text mr-10 font-weight-medium">
                UPLOAD DOCUMENT
              </div>
              <v-btn
                fab
                depressed
                color="primary"
                height="45"
                width="45"
                @click="showDocumentDialog"
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
    </v-data-table>

    <div
      v-if="documents.length === 0"
      class="d-flex justify-center align-center flex-column no-data-table-inner pa-12"
    >
      <i class="icofont-cloud-upload primary--text" style="font-size: 5rem" />
      <h5 class="secondary--text custom-subtitle">Add your first document.</h5>
      <p class="slim--text">
        Everything in one place. Upload required and relevant documents to the
        case file for easy access.
      </p>
      <v-btn
        rounded
        color="primary"
        class="px-8 mb-2 mt-4 white--text capital--btn"
        @click="showDocumentDialog"
      >
        Upload Document
      </v-btn>
    </div>

    <v-dialog
      v-model="showDeleteRecordDialog"
      persistent
      value="''"
      max-width="600"
    >
      <DeleteRecordDialog
        @close="showDeleteRecordDialog = false"
        @submit="deleteDocument"
      />
    </v-dialog>
  </div>
</template>

<script>
import DeleteRecordDialog from "@/components/dialogs/DeleteRecordDialog";
import { mapGetters } from "vuex";
import openSecuredFile from "@/utils/openSecuredFile";
import useRequest from "@/utils/useRequest";
export default {
  name: "UploadsTable",
  components: {
    DeleteRecordDialog,
  },
  props: {
    case: {
      type: Object,
      default: () => ({}),
    },
    documents: {
      type: Array,
      default: () => [],
    },
    showDocumentDialog: {
      type: Function,
      default: () => "",
    },
  },
  data() {
    return {
      showDeleteRecordDialog: false,
      selectedDocument: {},
      headers: [
        {
          text: "DOCUMENT",
          value: "name",
          class: "header-text secondary--text font-weight-medium",
          align: "left",
          width: "80%",
          sortable: false,
        },
        {
          text: "UPLOADED",
          value: "created_at",
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
    ...mapGetters({
      currentCase: "eviction/currentCase",
    }),
    pageText() {
      return "Pages " + this.page + ` / ` + this.pageCount;
    },
  },
  methods: {
    updateOptions(option) {
      this.page = option.page;
    },
    fileExtension(fileName) {
      const fileExt = fileName.split(".")[1];
      switch (fileExt) {
        case "doc":
        case "docx":
          return "word";
        case "pdf":
          return "pdf";
        case "csv":
        case "xlsx":
          return "spreadsheet";
        case "png":
        case "jpg":
        case "jpeg":
        case "img":
          return "image";
        default:
          return "text";
      }
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
    showDeleteDialog(item) {
      this.showDeleteRecordDialog = true;
      this.selectedDocument = item;
    },
    async deleteDocument() {
      await useRequest({
        path: "upload/" + this.selectedDocument.id,
        method: "DELETE",
      });
      this.$store.dispatch("eviction/loadDocuments", {
        caseId: this.currentCase.id,
      });
      this.showDeleteRecordDialog = false;
    },
    async handleFileView(document) {
      await openSecuredFile({
        id: document.id,
        filename: document.filename,
        folder: "documents",
      });
      return;
    },
  },
};
</script>

<style>
.upload-files-table .v-data-table__wrapper {
  padding: 0 48px 50px;
}

/* Table header style */
.upload-files-table .v-data-table thead tr th {
  border-bottom: none !important;
}

.upload-files-table .theme--light.v-data-table tbody {
  box-shadow: 15px 15px 40px #00000029;
}

.upload-files-table
  .theme--light.v-data-table
  tbody
  tr:first-child
  td:first-child {
  border-top-left-radius: 20px;
}
.upload-files-table
  .theme--light.v-data-table
  tbody
  tr:first-child:hover
  td:first-child {
  border-top-left-radius: 20px !important;
}

.upload-files-table
  .theme--light.v-data-table
  tbody
  tr:first-child
  td:last-child {
  border-top-right-radius: 20px;
}
.upload-files-table
  .theme--light.v-data-table
  tbody
  tr:first-child:hover
  td:last-child {
  border-top-right-radius: 20px !important;
}

.upload-files-table .v-data-footer__icons-before i,
.upload-files-table .v-data-footer__icons-after i {
  color: #ff854e !important;
}

.evictions-table .v-data-footer__icons-before i,
.evictions-table .v-data-footer__icons-after i {
  color: #ff854e !important;
}

.upload-files-table .mdi-menu-left,
.upload-files-table .mdi-menu-right {
  font-size: 33px !important;
}

.uploaded-file-title {
  cursor: pointer;
}
</style>
