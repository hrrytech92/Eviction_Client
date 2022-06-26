<template>
  <v-card class="secondary--text" @close:dialog="close">
    <v-btn
      color="info"
      icon
      class="float-right pa-10 btn--plain"
      @click="close"
    >
      <v-icon>mdi-close</v-icon>
    </v-btn>
    <v-form
      ref="form"
      v-model="valid"
      style="width: 70%"
      class="px-8 pt-10 pb-4 mx-auto text-left"
    >
      <div class="custom-title py-8">Document Details</div>

      <!-- <v-divider />

       <v-container class="py-0">
        <v-row>
          <v-col
            cols="2"
            class=""
          >
            <i
              :class="`info--text icofont-file-${fileExtension(
                document.name
              )} icofont-2x`"
            />
          </v-col>
          <v-col
            cols="8"
            class="secondary--text text-left d-flex align-center"
          >
            <div style="font-size: 0.8rem">
              {{ document.name }}
            </div>
          </v-col>
        </v-row>
      </v-container>

      <v-divider class="mb-8" /> -->

      <TextField title="Document Name" :field.sync="documentName" />
      <span v-if="showFiledDate">
        <DateField title="Date Filed" :field.sync="filedDate" />
      </span>
      <div class="my-6">
        <v-btn
          rounded
          color="primary"
          class="px-10 mx-2 white--text capital--btn"
          depressed
          @click="add"
        >
          Upload
        </v-btn>
        <v-btn
          rounded
          color="#1E5273"
          class="btn--plain capital--btn"
          text
          @click="handleCancel"
        >
          Cancel
        </v-btn>
      </div>
    </v-form>
  </v-card>
</template>

<script>
// import DateRange from "@/components/DateRange.vue";
export default {
  name: "DocumentInfoDialog",
  components: {
    // DateRange,
  },
  props: {
    showFiledDate: {
      type: Boolean,
      default: false,
    },
    document: {
      type: [Object, File],
      default: () => ({}),
    },
    handleCancel: {
      type: Function,
      default: () => {},
    },
  },
  data() {
    return {
      documentName: "",
      filedDate: "",
      valid: true,
    };
  },
  // mounted() {
  //   console.log("mounted");
  // },
  // activated() {
  //   console.log("activated");
  // },
  methods: {
    close() {
      this.$emit("close:dialog");
      this.documentName = "";
      this.filedDate = "";
    },
    add() {
      this.valid = this.$refs.form.validate();

      if (!this.valid) return;
      this.$emit("add", {
        documentName: this.documentName,
        filedDate: this.filedDate,
        fileName: this.document.name,
      });
      this.close();
    },
  },
};
</script>

<style></style>
