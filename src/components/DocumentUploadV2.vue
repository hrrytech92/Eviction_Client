<template>
  <div class="mt-4">
    <v-container class="pb-0">
      <v-row align-content="center">
        <v-col :cols="cols" class="pt-0">
          <vue-dropzone
            id="custom-dropzone"
            ref="dropzone"
            class="custom-dropzone"
            :options="dropzoneOptions"
            :use-custom-slot="true"
            @vdropzone-upload-progress="uploadProgress"
            @vdropzone-file-added="vdropzoneFileAdded"
            @vdropzone-complete="dropzoneComplete"
            @vdropzone-sending="sendingEvent"
            @vdropzone-success="uploaded"
            @vdropzone-error="vdropzoneError"
          >
            <div class="dropzone-custom-content">
              <i
                class="icofont-cloud-upload icofont-3x primary--text pa-0"
                style="line-height: normal"
              />
              <div
                class="secondary--text"
                style="font-family: 'futura-pt', sans-serif !important"
              >
                Drag file to upload or
                <span class="font-weight-medium primary--text">browse</span>.
              </div>
            </div>
          </vue-dropzone>
        </v-col>

        <v-col>
          <div class="dropzone-previews new-preview-zone">
            <div v-for="(item, index) in uploadedFiles" :key="item.id">
              <div class="d-flex mb-4">
                <i
                  :class="`icofont-file-${fileExtension(
                    item.filename
                  )} icofont-2x mr-4 uploaded-file-icon`"
                  style="cursor: pointer"
                  @click="viewFile(item)"
                />
                <div class="full-width">
                  <div class="d-flex justify-space-between">
                    <div
                      class="font-weight-medium"
                      style="cursor: pointer"
                      @click="viewFile(item)"
                    >
                      {{ item[ducumentNameAlias] }}
                    </div>
                    <v-icon
                      x-small
                      color="info"
                      @click="
                        removeFile({ file: item, index, type: 'uploaded' })
                      "
                    >
                      mdi-close
                    </v-icon>
                  </div>

                  <div
                    class="d-flex justify-space-between info--text"
                    style="font-size: 0.9rem"
                  >
                    <div>{{ item.filename }}</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- new fils -->
            <div v-for="(file, index) in uploadingFiles" :key="index">
              <div class="d-flex mb-4">
                <i
                  :class="`icofont-file-${fileExtension(
                    file.uploadingFileName
                  )} icofont-2x mr-4 uploaded-file-icon`"
                  style="cursor: pointer"
                  @click="viewFile(file)"
                />
                <div class="full-width">
                  <div class="d-flex justify-space-between">
                    <div
                      class="font-weight-medium"
                      style="cursor: pointer"
                      @click="viewFile(file)"
                    >
                      {{ file.uploadingDocumentName }}
                    </div>
                    <v-icon
                      x-small
                      color="info"
                      @click="removeFile({ file, index, type: 'uploading' })"
                    >
                      mdi-close
                    </v-icon>
                  </div>
                  <v-progress-linear
                    background-color="#F0F5F6"
                    color="primary"
                    :value="file.uploadProgressNumber"
                    class="my-1"
                    rounded
                  />
                  <div
                    class="d-flex justify-space-between info--text"
                    style="font-size: 0.9rem"
                  >
                    <div>{{ file.uploadingFileName }}</div>

                    <div>{{ file.uploadProgressBytes }} MB</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-container>

    <v-dialog v-model="addDocumentOpen" persistent value="''" max-width="700">
      <DocumentInfoDialogV2
        :show-filed-date="isRegistration"
        :document="addedFile"
        :handleCancel="handleCancel"
        @close:dialog="handleClose"
        @add="uploadManual"
      />
    </v-dialog>
  </div>
</template>

<script>
import vueDropzone from "vue2-dropzone";
import useRequest from "@/utils/useRequest";
import openSecuredFile from "@/utils/openSecuredFile";

export default {
  name: "DocumentUploadV2",
  components: {
    vueDropzone,
    DocumentInfoDialogV2: () =>
      import("@/components/dialogs/DocumentInfoDialogV2"),
  },
  props: {
    isRegistration: Boolean,
    // isLease: Boolean,
    // isLeaseRegistration: Boolean,
    isInCaseView: Boolean,
    isOpen: Boolean,
    updateRegistrationFiledDate: Boolean,
  },
  data() {
    return {
      documentName: "",
      filedDate: "",
      menu: false,
      uploading: false,
      addDocumentOpen: false,
      addedFile: {},
      uploadingFiles: {},
      // uploadedFiles: [],
      dropzoneOptions: {
        url: `${process.env.VUE_APP_URL}/${
          this.$auth.isAuthenticated ? "upload" : "uploadGuest"
        }`,
        parallelUploads: 1,
        uploadMultiple: false,
        previewTemplate: this.template(),
        previewsContainer: ".new-preview-zone",
        autoProcessQueue: false,
        headers: {
          Authorization: this.$http.defaults.headers.common.Authorization,
        },
        acceptedFiles: "image/*,application/pdf,.docx,.xlsx",
      },
      periodError: false,
    };
  },
  watch: {
    isOpen(open) {
      if (!open) this.uploadingFiles = {};
    },
  },
  computed: {
    property() {
      return this.$store.getters["property/currentProperty"];
    },
    case() {
      return this.$store.getters["eviction/currentCase"];
    },
    clientId() {
      return this.$store.getters.client.id;
    },
    isAuthenticated() {
      return this.$auth.isAuthenticated;
    },
    // addedFileName() {
    //   return this.addedFile.name;
    // },
    dateConverted() {
      return this.convertDateWithSlashes(this.filedDate);
    },
    cols() {
      return Object.keys(this.uploadingFiles).length > 0 ||
        this.uploadedFiles.length
        ? 6
        : 12;
    },
    uploadedFiles() {
      if (this.isInCaseView) return [];
      if (this.isRegistration) return this.property.registrationFiles || [];
      return this.case.documents || [];
    },
    ducumentNameAlias() {
      return this.isRegistration ? "documentName" : "name";
    },
  },
  activated() {
    if (this.isRegistration)
      this.$store.dispatch("property/getRegistrationDocs", {
        propertyId: this.property.propertyId,
      });
    else
      this.$store.dispatch("eviction/loadDocuments", {
        caseId: this.case.id,
      });
  },

  deactivated() {
    if (!this.$auth.isAuthenticated) this.saveGuestFiles();
    this.uploadingFiles = {};
  },
  methods: {
    async viewFile(file) {
      if (!this.isAuthenticated) {
        const { filename, documentUrl, type } = file;
        const newTab = window.open(filename);
        newTab.document.write(
          `<title>${filename}</title><style>body{margin:0;padding:0;overflow:hidden;}</style>`
        );
        if (type === "pdf")
          newTab.document.write(
            "<iframe width='100%' height='100%' src=" +
              documentUrl +
              "></iframe>"
          );
        else newTab.document.write(`<img alt=${filename} src=${documentUrl}>`);
        return;
      }
      await openSecuredFile({
        id: file.id,
        filename: file.filename,
        folder: this.isRegistration ? "registrations" : "documents",
        documentUrl: file.documentUrl,
      });
    },
    handleClose() {
      this.addDocumentOpen = false;
    },
    handleCancel() {
      this.$refs.dropzone.removeFile(this.addedFile);
      this.addDocumentOpen = false;
    },
    uploadManual(file) {
      if (this.isRegistration) {
        const prevFileId = Object.keys(this.uploadingFiles)[0];
        this.$store.commit("property/update_current_property", {
          registrationFiles: [],
        });
        if (prevFileId) {
          // this.$delete(this.uploadedFiles, 0);
          this.$delete(this.uploadingFiles, prevFileId);
        }
      }

      this.$set(this.uploadingFiles, file.fileName, {
        uploadingFileName: file.fileName,
        uploadingDocumentName: file.documentName,
        uploadingfiledDate: file.filedDate,
        uploadProgressNumber: 0,
        uploadProgressBytes: 0,
      });
      this.$refs.dropzone.processQueue();
      this.uploading = true;
      this.addedFile = {};
    },
    uploadProgress(file, progress, bytesSent) {
      this.uploadingFiles[file.name].uploadProgressNumber = progress;
      // convert bytes to MB
      this.uploadingFiles[file.name].uploadProgressBytes =
        Math.round((bytesSent / 1048576 + Number.EPSILON) * 100) / 100;
    },
    vdropzoneFileAdded(file) {
      this.addedFile = file;
      this.addDocumentOpen = true;
    },
    vdropzoneError(file, message, xhr) {
      console.log("vdropzoneError:", { file, message, xhr });
    },
    sendingEvent(file, xhr, formData) {
      const { uploadingDocumentName, uploadingfiledDate } =
        this.uploadingFiles[file.name];
      // uploadingFilesObj[file.name];
      formData.append("caseId", this.case.id);
      formData.append("docName", uploadingDocumentName);
      // formData.append("documentType", this.isLease ? 1 : 2);
      if (uploadingfiledDate) {
        if (this.updateRegistrationFiledDate) {
          this.$store.dispatch("property/saveProperty", {
            propertyData: {
              registrationFiled: 1,
            },
          });
        }

        formData.append("filedDate", uploadingfiledDate);
        formData.append("propertyId", this.property.propertyId);
      }
      // formData.append(
      //   "isUserAuthenticated",
      //   this.$store.getters.isAuthenticated
      // );
    },
    uploaded(file, response) {
      const id = response.newDocumentId;
      const updatedFile = {
        ...this.uploadingFiles[file.name],
        id,
        documentUrl: response.newDocumentUrl, //file.dataURL,
        docId: id,
        type: response.type,
        name: response.name,
        filename: file.name,
      };

      if (this.isAuthenticated) {
        this.$delete(this.uploadingFiles, file.name);
        this.$set(this.uploadingFiles, id, updatedFile);
      } else {
        this.$set(this.uploadingFiles, file.name, updatedFile);
      }
    },
    dropzoneComplete() {
      this.uploading = false;
      // for (var file in this.uploadingFiles) {
      //   if (!this.uploadedFiles.includes(file)) {
      //     this.uploadedFiles.push({
      //       name: this.uploadingFiles[file].uploadingDocumentName,
      //       fileName: this.uploadingFiles[file].uploadingFileName,
      //     });
      //     this.$delete(this.uploadingFiles, file);
      //   }
      // }
    },
    template() {
      return `<div></div>`;
    },
    async removeFile({ file, index, type }) {
      if (type === "uploading") {
        this.$delete(this.uploadingFiles, index);
        return;
      }
      if (!this.isAuthenticated) {
        const url = this.uploadedFiles[index].documentUrl;
        console.info("Todo delete file from s3 :>> ", url);
        if (this.isRegistration) {
          this.$store.commit("property/update_current_property", {
            registrationFiles: [],
          });
        } else {
          const documents = this.uploadedFiles.filter(
            (uploadedFile) => uploadedFile.id !== file.id
          );
          this.$store.commit("eviction/update_current_case", {
            documents,
          });
        }
        return;
      }
      if (this.isRegistration) {
        await useRequest({
          path: `registration`,
          method: "delete",
          data: {
            propertyId: this.property.propertyId,
            documentId: parseInt(file.id),
          },
        });
        this.$store.commit("property/update_current_property", {
          registrationFiles: [],
        });
      } else {
        let idx = index;
        // this.$delete(this.uploadingFiles, idx);

        if (Array.isArray(this.uploadedFiles) && this.uploadedFiles.length) {
          idx = this.uploadedFiles[index].id;
          const currentCase = this.case;
          currentCase.documents.splice(index, 1);
          this.$store.commit("eviction/update_current_case", currentCase);
        }

        await useRequest({ path: `upload/${parseInt(idx)}`, method: "delete" });
      }
    },
    saveGuestFiles() {
      const guestFilesToSave = Object.keys(this.uploadingFiles).map((key) => {
        const { name, filename, documentUrl, type, uploadingfiledDate } =
          this.uploadingFiles[key];
        if (documentUrl)
          return {
            name,
            type,
            filename,
            documentUrl,
            documentName: name,
            filedDate: uploadingfiledDate,
          };
      });
      // console.log("guestFilesToSave :>> ", guestFilesToSave);
      // this.uploadingFiles = {};
      if (!guestFilesToSave.length) return;
      if (this.isRegistration) {
        this.$store.commit("property/update_current_property", {
          registrationFiles: [guestFilesToSave[0]],
        });
      } else {
        const updatedDocs = [...this.uploadedFiles, ...guestFilesToSave];
        this.$store.commit("eviction/update_current_case", {
          documents: updatedDocs,
        });
      }
    },
  },
};
</script>

<style></style>
