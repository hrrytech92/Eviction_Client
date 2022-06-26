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

      <TextField title="Document Name" :field.sync="documentName" />
      <span v-if="showFiledDate">
        <DateField title="Date Filed" :field.sync="filedDate" />
      </span>
    </v-form>
    <v-card-actions
      style="background-color: #fafbfc; border-radius: 0px 0px 10px 10px"
      class="justify-end py-4 pr-12 mt-12"
    >
      <v-btn
        rounded
        color="accent_light"
        class="mb-2 mt-4 mr-5 btn--plain capital--btn"
        text
        @click="handleCancel"
      >
        cancel
      </v-btn>
      <v-btn
        rounded
        color="accent_light"
        class="px-8 mb-2 mt-4 white--text capital--btn"
        depressed
        @click="add"
        :disabled="!valid"
      >
        upload
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: "DocumentInfoDialogV2",
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
