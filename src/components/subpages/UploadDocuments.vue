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
      <div class="custom-title pt-8 pb-4">Upload Documents</div>
      <document-upload />
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
        @click="next"
      >
        continue
      </v-btn>
    </v-card-actions>

    <v-dialog v-model="dialog" value="''" max-width="700px">
      <new-document-dialog @add:files="addFiles" />
    </v-dialog>
  </div>
</template>

<script>
import DocumentUpload from "@/components/DocumentUpload.vue";
import { mapGetters } from "vuex";

export default {
  name: "UploadDocuments",
  components: {
    DocumentUpload,
  },
  data() {
    return {
      documents: [],
      dialog: false,
      addFiles: [],
      useNext: false,
    };
  },
  computed: {
    ...mapGetters({
      currentCase: "eviction/currentCase",
    }),
  },
  watch: {},
  activated() {
    window.scrollTo(0, 0);
    this.useNext = false;

    this.$store.dispatch("eviction/loadDocuments", {
      caseId: this.currentCase.id,
    });
  },
  deactivated() {
    this.saveData();
  },
  methods: {
    saveData() {
      if (this.useNext) return;

      this.$store.dispatch("eviction/updateCase", {
        caseData: {},
        status: "confirmation",
      });
    },
    next() {
      this.useNext = true;
      this.$store.dispatch("eviction/updateCase", {
        caseData: {},
        status: "confirmation",
      });
      this.$router.push({ name: "vc-confirmation" });
    },
    back() {
      // TODO: remove doc from case?
      this.$router.push({
        name: "vc-documents",
      });
    },
  },
};
</script>

<style></style>
