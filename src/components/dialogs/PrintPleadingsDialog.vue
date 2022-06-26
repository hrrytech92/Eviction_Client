<template>
  <StandardDialog
    title="Download & Print"
    cancelBtnText="Cancel"
    saveBtnText="Done"
    :cancelFunction="close"
    :saveFunction="close"
    contentWidth="75%"
  >
    <div v-if="currentCase.filingPlan === 'E-FILE'" class="pb-6">
      When submitting your documents through the Court's e-filing
      system—Judiciary Electronic Document Submission (JEDS)—you'll be asked to
      upload the
      <span class="font-weight-bold">Verified Complaint</span>,
      <span class="font-weight-bold">Tenant Summons</span> and
      <span class="font-weight-bold">Landlord case information statement</span>
      separately. It is recommended to upload the
      <span class="font-weight-bold">Cover Letter</span> as a supporting
      document. Do NOT upload the instructions. Those are exclusively for you.
      Download the files you need.
    </div>
    <div v-else class="pb-6">
      Print all documents. Provide the court with the Cover Letter along with
      the
      <span class="font-weight-bold">Verified Complaint</span>,
      <span class="font-weight-bold">Tenant Summons</span> and
      <span class="font-weight-bold">Landlord case information statement</span>.
      Do NOT submit the instructions. Those are exclusively for you.
    </div>

    <div
      v-for="(fileType, index) in fileList"
      :key="index"
      :class="
        fileType.icon_class === 'grey--text'
          ? 'letter-item-border-greyed-out'
          : 'letter-item-border'
      "
      :style="fileType.hide ? 'display: none' : ''"
      class="letter-item"
      style="background: #fafbfc"
      @click="printPleading(fileType)"
    >
      <v-row style="flex-wrap: nowrap">
        <v-col cols="10" style="display: flex; align-items: center">
          <i
            :class="[fileType.icon_class, fileType.icon]"
            class="icofont-2x mr-3"
          />
          <span
            :class="fileType.icon_class"
            style="position: relative; display: inline-block"
          >
            {{ fileType.name }}
          </span>
        </v-col>

        <v-col>
          <i
            :class="fileType.icon_class"
            class="icofont-print icofont-2x mr-5"
          />
        </v-col>
      </v-row>
    </div>
  </StandardDialog>
</template>

<script>
import { mapGetters } from "vuex";
// import ViewSupport from "@/mixins/view-support";
import getPleadingMixin from "@/mixins/get-pleading";
import StandardDialog from "./StandardDialog.vue";

export default {
  data() {
    return {
      fileList: [
        {
          icon: "icofont-file-pdf",
          icon_class: "accent2--text",
          name: "Instructions",
          templateName: "instructions",
          hide: false,
        },
        {
          // icon: "icofont-file-word",
          icon: "icofont-file-pdf",
          icon_class: "accent2--text",
          name: "Cover Letter",
          templateName: "cover_letter",
          hide: false,
        },
        {
          icon: "icofont-file-pdf",
          icon_class: "accent2--text",
          name: "Verified Complaint",
          templateName: "verified_complaint",
          hide: false,
        },
        {
          icon: "icofont-file-pdf",
          icon_class: "accent2--text",
          name: "Tenant Summons",
          templateName: "tenant_summons",
          hide: false,
        },
        {
          icon: "icofont-file-pdf",
          icon_class: "accent2--text",
          name: "Landlord Case Information Statement",
          templateName: "lcis",
          hide: false,
        },
        {
          icon: "icofont-file-pdf",
          icon_class: "accent2--text",
          name: "Certification of Lease and Registration Statement",
          templateName: "clrs_form",
          hide: true,
        },
        {
          icon: "icofont-file-pdf",
          icon_class: "grey--text",
          name: "Print all",
          templateName: "print_all",
          hide: false,
        },
        {
          icon: "icofont-file-pdf",
          icon_class: "grey--text",
          name: "Print all (individual)",
          templateName: "print_all_individual",
          hide: false,
        },
        {
          icon: "icofont-file-pdf",
          icon_class: "accent2--text",
          name: "Certification by Landlord",
          templateName: "certification_by_landlord",
          hide: true,
        },
        {
          icon: "icofont-file-pdf",
          icon_class: "accent2--text",
          name: "Request for Warrant of Removal",
          templateName: "wor_request",
          hide: true,
        },
      ],
    };
  },
  name: "PrintPleadingsDialog",
  mixins: [getPleadingMixin],
  components: { StandardDialog },
  props: {
    isCLRSInFlow: Boolean,
    isWORFlow: Boolean,
  },
  computed: {
    ...mapGetters({
      currentCase: "eviction/currentCase",
    }),
  },
  mounted() {
    console.log("this.isCLRSInFlow :>> ", this.isCLRSInFlow);
    if (this.isCLRSInFlow) this.fileList[5].hide = false;
    if (this.isWORFlow) {
      for (let i = 0; i < 10; i++) {
        if (i < 8)
          this.fileList[i].hide = true;
        else
          this.fileList[i].hide = false;
      }
    }
  },
  methods: {
    close() {
      this.$emit("close:dialog");
    },
    async printPleading(fileType) {
      // const data = {
      //   fileType: fileType.name,
      //   templateName: fileType.templateName,
      //   // data: await this.getOrderDetailsTemplateData(),
      // };
      await this.getPleading({ templateName: fileType.templateName });
    },
  },
};
</script>

<style lang="scss">
.letter-item {
  padding: 5px 40px 5px 40px;
  margin: 20px 0 20px 0;
  border-radius: 9px !important;
  cursor: pointer;
}

.letter-item-border {
  border: 3px solid #6a7fdb !important;
}

.letter-item-border-greyed-out {
  padding: 5px 40px 5px 40px;
  margin: 20px 0 20px 0;
  border: 3px solid #9e9e9e !important;
  border-radius: 9px !important;
  cursor: pointer;
}
</style>
