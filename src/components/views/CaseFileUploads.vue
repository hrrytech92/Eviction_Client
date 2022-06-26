<template>
  <div class="py-4 px-12 mx-4">
    <div class="d-flex align-center justify-space-between mt-6 mb-12">
      <div class="d-flex align-center">
        <div class="secondary--text custom-heading mr-12">
          Case File Uploads
        </div>

        <v-btn
          fab
          depressed
          color="primary"
          height="45"
          width="45"
          @click="showDocumentDialog"
        >
          <span class="white--text font-weight-regular" style="font-size: 50px">
            +
          </span>
        </v-btn>
      </div>
      <div class="d-flex align-center">
        <i class="icofont-home icofont-2x mr-4" style="color: #c3d1d2" />
        <div class="spaced-text secondary--text" style="font-size: 1.2rem">
          {{ currentProperty.streetAddress.toUpperCase() }}
        </div>
      </div>
    </div>
    <SubTopNav :value="1" />

    <uploads-table
      :case="currentCase"
      :documents="currentCase.documents"
      :show-document-dialog="showDocumentDialog"
    />

    <v-dialog v-model="documentDialog" value="''" max-width="700px">
      <!--<new-document-dialog-->
      <!--  :case-id="currentCase.id"-->
      <!--  @close="documentDialog = false"-->
      <!--  @update="update"-->
      <!--  isInCaseView-->
      <!--  :isOpen="documentDialog"-->
      <!--/>-->
      <NewDocumentDialogV2
        :case-id="currentCase.id"
        @close="documentDialog = false"
        @update="update"
        isInCaseView
        :isOpen="documentDialog"
      />
    </v-dialog>
  </div>
</template>

<script>
import SubTopNav from "@/components/SubTopNav.vue";
import UploadsTable from "../tables/UploadsTable.vue";
// import NewDocumentDialog from "@/components/dialogs/NewDocumentDialog";
import NewDocumentDialogV2 from "@/components/dialogs/NewDocumentDialogV2";
import { mapGetters } from "vuex";

export default {
  name: "CaseFileUploads",
  components: {
    SubTopNav,
    UploadsTable,
    // NewDocumentDialog,
    NewDocumentDialogV2,
  },
  data() {
    return {
      documentDialog: false,
      btns: [
        {
          title: "ADD NEW",
          icon: "building-alt",
          onclick: () => this.$router.push("/properties/new"),
        },
        { title: "ADD UNIT", icon: "close-circled", onclick: "" },
      ],
    };
  },
  computed: {
    ...mapGetters({
      currentCase: "eviction/currentCase",
      currentProperty: "property/currentProperty",
    }),
    client() {
      return this.$store.getters.client;
    },
  },
  async mounted() {
    window.scrollTo(0, 0);

    await this.$store.dispatch("eviction/loadCase", {
      // caseId: this.$route.params.id,
      caseId: this.currentCase.id,
      logMessage: "CaseFileUploads.vue at line 91",
    });

    await this.$store.dispatch("eviction/loadDocuments", {
      caseId: this.currentCase.id,
      // documentType: 1,
    });
  },
  methods: {
    update() {
      // this.$store.dispatch("eviction/loadCase", {
      //   caseId: this.$route.params.id,
      // });
      this.$store.dispatch("eviction/loadDocuments", {
        caseId: this.currentCase.id,
        documentType: 1,
      });
      this.documentDialog = false;
    },
    showDocumentDialog() {
      this.documentDialog = true;
    },
  },
};
</script>

<style></style>
