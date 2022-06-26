<template>
  <form enctype="multipart/form-data" novalidate>
    <div class="d-flex align-center">
      <input
        id="file"
        type="file"
        multiple
        :name="uploadFieldName"
        :disabled="isSaving"
        class="input-file"
        @change="
          filesChange($event.target.name, $event.target.files);
          fileCount = $event.target.files.length;
        "
      />
      <label for="file" class="file-upload-button-label px-5"
        >choose file</label
      >
      <div class="pl-2 font-italic">
        <p v-if="isInitial" class="ma-0">No file chosen.</p>
        <p v-if="isUploading" class="ma-0">Uploading ...</p>
        <p v-if="isSuccess" class="ma-0">
          {{ fileName }}
        </p>
      </div>
    </div>
  </form>
</template>

<script>
const STATUS_INITIAL = 0;
const STATUS_UPLOADING = 1;
const STATUS_SUCCESS = 2;
const STATUS_FAILED = 3;
export default {
  name: "FileUpload",
  data() {
    return {
      uploadedFiles: [],
      uploadError: null,
      currentStatus: null,
      uploadFieldName: "registration",
      fileName: "",
    };
  },
  computed: {
    isInitial() {
      return this.currentStatus === STATUS_INITIAL;
    },
    isUploading() {
      return this.currentStatus === STATUS_UPLOADING;
    },
    isSuccess() {
      return this.currentStatus === STATUS_SUCCESS;
    },
    isFailed() {
      return this.currentStatus === STATUS_FAILED;
    },
  },
  mounted() {
    this.reset();
  },
  methods: {
    reset() {
      this.currentStatus = STATUS_INITIAL;
      this.uploadedFiles = [];
      this.uploadError = null;
    },
    save(formData) {
      // // upload to server
      // this.currentStatus = STATUS_UPLOADING
      // upload(formData)
      //   .then(x => {
      //     this.uploadedFiles = [].concat(x);
      //     this.currentStatus = STATUS_SUCCESS;
      //   })
      //   .catch(err => {
      //     this.uploadError = err.response;
      //     this.currentStatus = STATUS_FAILED;
      //   });
      console.log("formData", formData);
      this.currentStatus = STATUS_SUCCESS;
    },
    filesChange(fieldName, fileList) {
      const formData = new FormData();
      if (!fileList.length) return;

      // append the files to FormData
      Array.from(Array(fileList.length).keys()).map((x) => {
        formData.append(fieldName, fileList[x], fileList[x].name);
      });

      this.fileName = formData.get("registration").name;
      this.save(formData);
    },
  },
};
</script>

<style>
.file-upload-button-label {
  background: #4dccc4 0% 0% no-repeat padding-box;
  border-radius: 17px;
  opacity: 1;
  color: white;
  cursor: pointer;
}

.file-upload-button-label:hover {
  opacity: 0.75;
}

.file-upload-button-label:focus {
  outline: 1px dotted #000;
  outline: -webkit-focus-ring-color auto 5px;
}

.input-file {
  width: 0.1px;
  height: 0.1px;
  opacity: 0;
  overflow: hidden;
  position: absolute;
  z-index: -1;
}
</style>
