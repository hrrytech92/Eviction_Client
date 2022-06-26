<template>
  <div class="d-flex pb-12">
    <div class="pr-8">
      <i class="icofont-document-folder icofont-2x info--text" />
    </div>
    <div>
      <div class="text-left font-weight-medium info--text text-uppercase pb-2">
        ELECTRONIC FILE (E-FILE)
      </div>
      <div v-if="isCLRSOnlyOrder">
        Review instructions prior to filing, if you are not familiar with the
        process. When you are ready, click “e-File” to be directed to New
        Jersey’s Judiciary Electronic Document Submission (JEDS) system to
        submit your document(s) to the court. This screen will open in a new
        window. You may also file by mail. The court address has been provided
        below.
      </div>
      <div v-else>
        Review instructions prior to e-filing if you are not familiar with the
        process. When you are ready, click "e-File" to be directed to New
        Jersey's Judiciary Electronic Document Submission (JEDS) to submit your
        pleadings to the court. This screen will open in a new window.
      </div>
      <!-- <v-btn
        color="indigo"
        depressed
        outlined
        class="mt-4 px-12 mr-3 b-2px"
        rounded
        @click="instructions"
      >
        Instructions
      </v-btn> -->
      <v-btn
        color="indigo"
        depressed
        outlined
        class="mt-4 px-12 mr-3 b-2px"
        rounded
        :href="instructionsLink"
        target="_blank"
      >
        Instructions
      </v-btn>

      <v-btn
        color="accent2"
        depressed
        class="white--text mt-4 px-12"
        rounded
        href="https://portalefile-cloud.njcourts.gov/prweb/PRAuth/EFILESAMLAuth?AppName=EFILE"
        target="_blank"
      >
        e-File
      </v-btn>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    isCLRSOnlyOrder: {
      type: Boolean,
      default: false,
    },
  },
  name: "EFile",
  computed: {
    instructionsLink() {
      return this.isCLRSOnlyOrder
        ? "https://fileevictions.com/help-how-to-efile-the-certification-of-lease-and-registration-statement"
        : "https://fileevictions.com/help-how-to-efile-a-complaint-and-summons";
    },
  },
  // methods: {
  //   instructions() {
  //     window.open(
  //       "https://fileevictions.com/help-how-to-efile-a-complaint-and-summons",
  //       "_blank"
  //     );
  //   },
  //   eFile() {
  //     window.open(
  //       "https://portalefile-cloud.njcourts.gov/prweb/PRAuth/EFILESAMLAuth?AppName=EFILE",
  //       "_blank"
  //     );
  //   },
  // },
};
</script>

<style scoped>
.b-2px {
  border: 2px solid currentColor;
}
</style>
