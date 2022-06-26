<template>
  <v-card class="secondary--text">
    <div class="pa-12">
      <div class="mb-4 headline secondary--text font-weight-medium">
        Upload Documents
      </div>

      <DocumentUploadV2
        is-lease
        :case-id="caseId"
        :isInCaseView="isInCaseView"
        :isOpen="isOpen"
      />
    </div>
    <v-card-actions
      style="background-color: #fafbfc; border-radius: 0px 0px 10px 10px"
      class="justify-end py-4 pr-12"
    >
      <v-btn
        rounded
        color="accent_light"
        class="mb-2 mt-4 btn--plain capital--btn"
        small
        text
        @click="$emit('close')"
      >
        Cancel
      </v-btn>
      <v-btn
        rounded
        color="accent_light"
        class="px-8 mb-2 mt-4 white--text capital--btn"
        small
        depressed
        @click="$emit('update')"
      >
        Update
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import DocumentUploadV2 from "@/components/DocumentUploadV2.vue";

export default {
  name: "NewDocumentDialog",
  components: {
    DocumentUploadV2,
  },
  props: {
    caseId: {
      type: Number,
      default: 0,
    },
    isInCaseView: {
      type: Boolean,
      default: false,
    },
    isOpen: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {};
  },
  methods: {
    // submit() {
    //   this.$emit("add:files", this.uploadedFiles);
    //   this.uploadedFiles = [];
    // },
    // uploadManual() {
    //   this.$refs.dropzone.processQueue();
    //   if (!(this.addedFile.name in this.uploadingFiles)) {
    //     this.$set(this.uploadingFiles, this.addedFile.name, {
    //       uploadingFileName: this.addedFile.name,
    //       uploadingDocumentName: this.documentName,
    //       uploadProgressNumber: 0,
    //       uploadProgressBytes: 0,
    //     });
    //   }
    //   this.uploading = true;
    //   this.addedFile = {};
    // },
    // uploadProgress(file, progress, bytesSent) {
    //   this.uploadingFiles[file.name].uploadProgressNumber = progress;
    //   // convert bytes to MB
    //   this.uploadingFiles[file.name].uploadProgressBytes =
    //     Math.round((bytesSent / 1048576 + Number.EPSILON) * 100) / 100;
    // },
    // fileAdded(file) {
    //   this.addedFile = file;
    // },
    // sendingEvent(file, xhr, formData) {
    //   formData.append("caseId", this.caseId);
    //   formData.append("docName", this.documentName);
    // },
    // uploaded(files, response) {
    //   console.log(files);
    //   console.log(response);
    // },
    // dropzoneComplete() {
    //   this.uploading = false;
    //   for (const file in this.uploadingFiles) {
    //     if (!this.uploadedFiles.includes(file)) {
    //       this.uploadedFiles.push({
    //         name: this.uploadingFiles[file].uploadingDocumentName,
    //         fileName: this.uploadingFiles[file].uploadingFileName,
    //       });
    //       this.$delete(this.uploadingFiles, file);
    //     }
    //   }
    // },
    // fileExtension(fileName) {
    //   const fileExt = fileName.split(".")[1];
    //   switch (fileExt) {
    //     case "doc":
    //     case "docx":
    //       return "word";
    //     case "pdf":
    //       return "pdf";
    //     case "csv":
    //     case "xlsx":
    //       return "spreadsheet";
    //     case "png":
    //     case "jpg":
    //     case "jpeg":
    //     case "img":
    //       return "image";
    //     default:
    //       return "text";
    //   }
    // },
    // template() {
    //   return `<div></div>`;
    // },
    // removeFile() {
    //   this.$refs.dropzone.removeAllFiles(true);
    //   this.addedFile = {};
    // },
  },
};
</script>

<style></style>
