<template>
  <v-card
    class="secondary--text"
    height="100%"
    style="box-shadow: 15px 15px 40px #00000029; border-radius: 20px"
  >
    <v-card-title class="font-weight-bold mx-4 pt-8">
      <div>{{ title }}</div>
    </v-card-title>
    <div style="height: 250px">
      <vue-scroll :ops="ops">
        <div v-for="document in documents" :key="document.id" class="mx-4">
          <v-container class="py-0">
            <v-row align="center">
              <v-col cols="2">
                <i
                  :class="`icofont-file-${fileExtension(
                    document.filename
                  )} icofont-2x uploaded-file-icon`"
                  @click="handleFileView(document)"
                />
              </v-col>
              <v-col cols="8" class="secondary--text text-left">
                <div
                  class="font-weight-medium"
                  style="cursor: pointer"
                  @click="handleFileView(document)"
                >
                  {{ document.name }}
                </div>
                <div style="font-size: 0.8rem">
                  Submitted: {{ formatDate(document.created_at) }}
                </div>
              </v-col>
            </v-row>
          </v-container>
        </div>
      </vue-scroll>
    </div>
    <div class="card-action-bottom">
      <v-btn
        v-if="documents.length"
        color="accent_light"
        class="px-4 white--text"
        rounded
        depressed
        @click="
          $router.push(`/case-view/${$route.params.id}/${title.toLowerCase()}`)
        "
      >
        View All
      </v-btn>
      <div v-else style="margin-top: 6px">There are no documents.</div>
    </div>
  </v-card>
</template>

<script>
import moment from "moment";
import { mapGetters } from "vuex";
import openSecuredFile from "../utils/openSecuredFile";
import getPleadingMixin from "@/mixins/get-pleading";

export default {
  name: "DocListCard",
  mixins: [getPleadingMixin],
  props: {
    title: {
      type: String,
      default: "",
    },
    documents: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      ops: {
        vuescroll: {},
        scrollPanel: {},
        rail: {
          // background: '#EAEBEB',
          opacity: 0,
          size: "5px",
          specifyBorderRadius: false,
          gutterOfEnds: null,
          gutterOfSide: "0px",
        },
        bar: {
          onlyShowBarOnScroll: false,
          keepShow: true,
          background: "#4DCCC4",
          opacity: 1,
          size: "6px",
        },
      },
      serverURL: process.env.VUE_APP_URL,
    };
  },
  computed: {
    ...mapGetters({
      currentCase: "eviction/currentCase",
      case: "eviction/currentCase",
      currentProperty: "property/currentProperty",
      courtInfo: "eviction/courtInfo",
      client: "client",
    }),
  },
  methods: {
    fileExtension(fileName) {
      if (this.title === "Pleadings") return "pdf";
      const fileExt = fileName.split(".")[1];
      switch (fileExt) {
        case "doc":
        case "docx":
          return "word";
        case "pdf":
          return "pdf";
        case "csv":
        case "xlsx":
          return "excel";
        case "png":
        case "jpg":
        case "jpeg":
        case "img":
          return "image";
        default:
          return "text";
      }
    },
    async handleFileView(document) {
      if (this.title === "Pleadings") {
        return this.handlePleadingView(document);
      }
      await openSecuredFile({
        id: document.id,
        filename: document.filename,
        folder: "documents",
      });
    },
    async handlePleadingView(document) {
      const fileName = document.templateName || document.filename.split(".")[0];

      // const data = {
      //   fileType: document.name.trim(),
      //   templateName: fileName,
      //   pleadings: 1,
      // };

      await this.getPleading({
        templateName: fileName,
        inNewTab: document.filename === "clrs_form.pdf",
      });
    },
    formatDate(date) {
      return moment(date).format("MM.DD.YY");
    },
  },
};
</script>

<style>
.card-action-bottom {
  padding: 25px 30px;
  background: #f8fafb;
}
.uploaded-file-icon {
  color: #afc2ce;
  cursor: pointer;
}
.uploaded-file-icon:hover {
  color: #4dccc4 !important;
}
</style>
