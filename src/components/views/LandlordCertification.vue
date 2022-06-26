<template>
  <div>
    <v-card
      class="mx-auto my-12 px-8 pt-12 pb-4 text-center overflow-y-auto"
      width="750px"
    >
      <!-- Inactive components will be cached! -->
      <keep-alive>
        <component
          :is="currentComponent.name"
          v-bind="{ ...currentComponent.props }"
          @update:data="updateData"
          @submit="submit"
        />
      </keep-alive>
      <line-navigation
        :steps="steps"
        :current="step"
        class="my-6"
        @step:clicked="stepClicked"
      />
    </v-card>

    <v-dialog v-model="chooseCaseDialog" value="''" max-width="600">
      <choose-case-dialog
        @close-dialog="closeDialog"
        @choose:case="chooseCase"
      />
    </v-dialog>
  </div>
</template>

<script>
import UpdateOwed from "@/components/subpages/landlordCertification/UpdateOwed";
import PreviewSign from "@/components/subpages/landlordCertification/PreviewSign";
import Precourt from "@/components/subpages/landlordCertification/PreCourt";
import RequestWor from "@/components/subpages/landlordCertification/RequestWor";
import TrialDate from "@/components/subpages/landlordCertification/TrialDate";
import Done from "@/components/subpages/landlordCertification/Done";
import LineNavigation from "@/components/LineNavigation";
import ChooseCaseDialog from "@/components/dialogs/ChooseCaseDialog";

export default {
  name: "LandlordCertification",
  components: {
    UpdateOwed,
    PreviewSign,
    Precourt,
    RequestWor,
    TrialDate,
    Done,
    LineNavigation,
    ChooseCaseDialog,
  },
  data() {
    return {
      step: 1,
      steps: 5,
      certification: {},
      attorney: false,
      service: "A la Carte",
      case: {},
      chooseCaseDialog: false,
      trialDate: "",
    };
  },
  computed: {
    currentComponent() {
      if (this.service === "Complete" && this.attorney) {
        switch (this.step) {
          case 1:
            return { name: "update-owed" };
          case 2:
            return { name: "preview-sign", props: { service: "Complete" } };
          case 3:
            return { name: "precourt" };
          case 4:
            return { name: "done", props: { service: "Complete" } };
          default:
            return { name: "" };
        }
      }
      if (this.service === "A la Carte" && this.attorney) {
        switch (this.step) {
          case 1:
            return { name: "update-owed" };
          case 2:
            return { name: "preview-sign", props: { service: "A la Carte" } };
          case 3:
            return { name: "precourt" };
          case 4:
            return { name: "request-wor", props: { attorney: true } };
          case 5:
            return { name: "done", props: { service: "A la Carte" } };
          default:
            return { name: "" };
        }
      }
      if (this.service === "A la Carte" && !this.attorney) {
        switch (this.step) {
          case 1:
            return { name: "update-owed" };
          case 2:
            return { name: "trial-date" };
          case 3:
            return { name: "preview-sign", props: { service: "A la Carte" } };
          case 4:
            return { name: "request-wor", props: { attorney: false } };
          case 5:
            return { name: "done", props: { service: "A la Carte" } };
          default:
            return { name: "" };
        }
      }
      return "";
    },
    client() {
      return this.$store.getters.client;
    },
  },
  mounted() {
    this.attorney = this.$route.query.attorney == "true";
    this.service = this.$route.query.service;
    this.steps = this.service === "A la Carte" ? 5 : 4;
    this.chooseCaseDialog = true;
  },
  methods: {
    updateData(newData) {
      for (const key in newData) {
        this.case[key] = newData[key];
      }
    },
    chooseCase(eviction) {
      this.case = eviction;
      this.closeDialog();
    },
    closeDialog() {
      this.chooseCaseDialog = false;
    },
    stepClicked(step) {
      this.step = step;
    },
    submit() {
      const templateData = {
        heading: {
          name: `${this.client.firstName} ${this.client.lastName}`,
          addressLine1: `${this.case.streetAddress}`,
        },
      };
      const templateName = "certification_by_landlord";
      this.renderTemplate(templateData, templateName);
      this.$router.push("/");
    },
    // renderTemplate is seperate function to allow for different templates if pro se or attorney
    renderTemplate(templateData, templateName) {
      this.$http
        .post(`${process.env.VUE_APP_URL}/render_template`, {
          templateData: templateData,
          templateName: templateName,
        })
        .then((response) => {
          const linkSource = `data:application/pdf;base64,${response.data}`;
          const downloadLink = document.createElement("a");
          const fileName = "certification_by_landlord.pdf";
          downloadLink.href = linkSource;
          downloadLink.download = fileName;
          downloadLink.click();
        });
    },
  },
};
</script>

<style></style>
