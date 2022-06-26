<template>
  <div class="mx-auto secondary--text">
    <v-btn
      color="info"
      icon
      class="float-right ma-8 btn--plain"
      @click="$emit('close:form')"
    >
      <v-icon>mdi-close</v-icon>
    </v-btn>

    <div style="width: 80%" class="pt-10 pb-4 mx-auto text-left">
      <div class="custom-title pt-8 pb-4">Documents</div>
      <div class="pb-6">
        You may upload documents that will support your claim. This will allow
        you to keep all documents in this case in order. Select “No” to upload
        documents to your case file at a later time. Select “Yes” if you are
        ready to upload them now.
      </div>

      <div class="font-weight-medium mb-2">
        Example of types of documents to upload:
      </div>
      <div
        v-for="item in documentTypes"
        :key="item"
        class="d-flex align-center ml-6 pa-2"
      >
        <div class="triangle-small mr-2" />
        <div>{{ item }}</div>
      </div>

      <div class="py-4 pt-8">
        <v-btn
          rounded
          :color="uploadDocs === false ? 'primary' : 'info_light'"
          dark
          class="px-12 capital--btn"
          :class="{ 'secondary--text': uploadDocs !== false }"
          depressed
          @click="optionClicked(false)"
        >
          no
        </v-btn>
        <v-btn
          rounded
          :color="uploadDocs ? 'primary' : 'info_light'"
          dark
          class="px-12 ml-4 capital--btn"
          :class="{ 'secondary--text': uploadDocs !== true }"
          depressed
          @click="optionClicked(true)"
        >
          yes
        </v-btn>
      </div>
      <!-- <v-card v-for="document in documents" :key="document.fileName" outlined class="my-4 mx-12 pa-1 rounded-card">
                <v-row align="center">
                <v-col cols="2">
                <i :class="`info--text icofont-file-${fileExtension(document.fileName)} icofont-2x`"></i>
                </v-col>
                <v-col cols="7" class="secondary--text text-left">
                    <div class="font-weight-medium">{{document.name}}</div>
                    <div style="font-size: 0.8rem">{{document.fileName}}</div>
                </v-col>
                <v-col cols="1">
                <v-btn color="accent" class="btn--plain" text>view</v-btn>
                </v-col>
                <v-col cols="2">
                <v-btn color="accent" class="btn--plain" icon><i class="accent--text icofont-trash"></i></v-btn>
                </v-col>
                </v-row>
            </v-card> -->
    </div>

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
        :disabled="!valid"
        @click="next"
      >
        continue
      </v-btn>
    </v-card-actions>

    <v-dialog v-model="documentDialog" value="''" max-width="700px">
      <new-document-dialog @add:files="addFiles" />
    </v-dialog>
  </div>
</template>

<script>
import NewDocumentDialog from "@/components/dialogs/NewDocumentDialog";

export default {
  name: "Documents",
  components: {
    NewDocumentDialog,
  },
  data() {
    return {
      documents: [],
      documentTypes: ["Lease", "Ledger", "Landlord-Tenant Communication"],
      uploadDocs: null,
      documentDialog: false,
      useNext: false,
    };
  },
  computed: {
    valid() {
      return this.uploadDocs !== null;
    },
    case() {
      return this.$store.getters["eviction/currentCase"];
    },
  },
  // watch: {
  //   case: function (val) {
  //     this.uploadDocs = val.documentsUploadPermitted;
  //   },
  // },
  activated() {
    window.scrollTo(0, 0);
    this.useNext = false;
    this.uploadDocs = this.case.documentsUploadPermitted ?? null;
  },
  deactivated() {
    this.saveData();
  },
  mounted() {
    // this.uploadDocs =
    //   this.$store.getters["eviction/currentCase"].documentsUploadPermitted;
  },
  methods: {
    saveData() {
      // if (this.useNext) return;
      if (!this.valid) return;
      this.$store.dispatch("eviction/updateCase", {
        caseData: {
          documentsUploadPermitted: this.uploadDocs,
        },
        submitted: false,
        lastStep: this.uploadDocs ? "Documents" : "Confirmation",
      });
    },
    next() {
      if (this.uploadDocs) {
        this.$router.push({ name: "vc-upload-documents" });
      } else {
        this.$router.push({ name: "vc-confirmation" });
      }
    },
    back() {
      if (this.case.section8) {
        this.$router.push({ name: "vc-additional-charges" });
      } else {
        this.$router.push({ name: "vc-legal-fees" });
      }
    },
    optionClicked(bool) {
      this.uploadDocs = bool;
      this.next();
    },
    addFiles(files) {
      for (const file of files) {
        this.documents.push(file);
      }
      this.documentDialog = false;
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
  },
};
</script>

<style>
/* .right-arrow-menu {
  margin-top: 40px;
  contain: initial;
  overflow: visible;
}

.right-arrow-menu::before {
  position: absolute;
  content: "";
  top: 0;
  right: 10px;
  transform: translateY(-100%);
  width: 10px; 
  height: 13px; 
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-bottom: 13px solid #fff;
} */

.my-menu {
  margin-top: 36px;
  overflow: visible;
}

.my-menu .right-arrow-menu::before {
  right: 10px;
  top: -10px;
  position: absolute;
  content: "";
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 0 10px 10px 10px;
  border-color: transparent transparent #fff transparent;
}
</style>
