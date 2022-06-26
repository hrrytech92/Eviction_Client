<template>
  <VerifiedComplaintBox
    :continue-btn-disabled="!valid"
    :vc-cancel-btn-props="{
      btnText: 'cancel',
    }"
    :vc-continue-btn-props="{
      btnText: 'Update',
    }"
    @vcBoxContinue="handleContinue"
    @vcBoxCancel="$router.push({ name: 'case-view-overview' })"
  >
    <div class="custom-title pt-8 pb-4">Court Information</div>
    <div class="pb-4">
      Enter the information below as it appears on the notice provided to you by
      the court. This will help you stay on track with your case, so you don’t
      miss an important step or event.
    </div>

    <v-form ref="form" v-model="valid" class="pt-10 pb-4 text-left">
      <div class="text-left">
        <div class="font-weight-medium secondary--text pb-2">Docket No.</div>
        <v-text-field
          v-model="docketNo"
          rounded
          solo
          flat
          dense
          background-color="#F0F5F6"
          :rules="[(v) => !!v || 'Item is required']"
        />

        <div class="font-weight-medium secondary--text pb-2">
          Case Management Conference
        </div>
        <div class="dateAndTime">
          <v-menu
            v-model="manageConfMenu"
            :close-on-content-click="false"
            :nudge-right="40"
            transition="scale-transition"
            offset-y
            min-width="290px"
          >
            <template v-slot:activator="{ on }">
              <v-text-field
                v-model="manageConf"
                append-icon="$calendar"
                color="accent"
                readonly
                rounded
                solo
                flat
                dense
                background-color="#F0F5F6"
                v-on="on"
                @click:append="manageConfMenu = true"
                :rules="[(v) => !!v || 'Item is required']"
              />
            </template>
            <v-date-picker
              v-model="selectedManageConf"
              no-title
              :show-current="false"
              color="primary"
              class="custom-date"
              @input="closedManageConfMenu"
            />
          </v-menu>
          <v-menu
            v-model="courtInfoTimeMenu"
            transition="scale-transition"
            offset-y
            max-width="300px"
            :close-on-content-click="false"
            :nudge-right="10"
            :nudge-top="25"
            rounded="xl"
          >
            <template v-slot:activator="{ on }">
              <v-text-field
                v-model="courtInfoTime"
                append-icon="mdi-clock-time-nine-outline"
                color="accent"
                readonly
                rounded
                solo
                flat
                dense
                background-color="#F0F5F6"
                v-on="on"
                @click:append="courtInfoTimeMenu = true"
              />
            </template>

            <EVTimePicker @meridiemClicked="evTimePickerSelected" />
          </v-menu>
        </div>

        <div class="font-weight-medium secondary--text pb-2">Trial</div>
        <div class="dateAndTime">
          <v-menu
            v-model="trialDateMenuOpen"
            :close-on-content-click="false"
            :nudge-right="40"
            transition="scale-transition"
            offset-y
            min-width="290px"
          >
            <template v-slot:activator="{ on }">
              <v-text-field
                v-model="trialDate"
                append-icon="$calendar"
                color="accent"
                readonly
                rounded
                solo
                flat
                dense
                background-color="#F0F5F6"
                v-on="on"
                @click:append="trialDateMenuOpen = true"
                :rules="[(v) => !!v || 'Item is required']"
              />
            </template>
            <v-date-picker
              v-model="selectedTrialDate"
              no-title
              :show-current="false"
              color="primary"
              class="custom-date"
              @input="closedTrialDateMenu"
            />
          </v-menu>
          <v-menu
            v-model="trialTimeMenuOpen"
            transition="scale-transition"
            offset-y
            max-width="300px"
            :close-on-content-click="false"
            :nudge-right="10"
            :nudge-top="25"
            rounded="xl"
          >
            <template v-slot:activator="{ on }">
              <v-text-field
                v-model="trialTime"
                append-icon="mdi-clock-time-nine-outline"
                color="accent"
                readonly
                rounded
                solo
                flat
                dense
                background-color="#F0F5F6"
                v-on="on"
                @click:append="trialTimeMenuOpen = true"
              />
            </template>

            <EVTimePicker @meridiemClicked="trialTimePickerSelected" />
          </v-menu>
        </div>
      </div>
    </v-form>

    <v-dialog v-model="successDialog" persistent value="''" max-width="500">
      <InfoDialog
        color="primary"
        title="Success!"
        type="success"
        text="The case information has been updated."
        btn-text="VIEW CASE FILE"
        @submit="submit"
      />
    </v-dialog>
  </VerifiedComplaintBox>
</template>

<script>
import { mapGetters } from "vuex";
import VerifiedComplaintBox from "@components/VerifiedComplaintBox";
import EVTimePicker from "@components/eviction/EVTimePicker";

export default {
  name: "CourtInformation",
  components: { EVTimePicker, VerifiedComplaintBox },
  data: () => ({
    valid: true,
    docketNo: null,
    manageConf: null,
    selectedManageConf: null,
    manageConfMenu: false,
    trialDate: null,
    selectedTrialDate: null,
    trialDateMenuOpen: false,
    courtInfoTime: null,
    courtInfoTimeMenu: false,
    trialTime: null,
    trialTimeMenuOpen: false,
    successDialog: false,
  }),
  computed: {
    ...mapGetters({
      currentCase: "eviction/currentCase",
    }),
  },
  activated() {
    window.scrollTo(0, 0);
    this.docketNo = this.currentCase.docketNo;
    this.selectedManageConf = this.currentCase.manageConf ?? null;
    this.manageConf = this.selectedManageConf ? this.$dayjs(this.selectedManageConf).format("MMMM DD, YYYY") : " ";
    this.courtInfoTime = this.currentCase.courtInfoTime ?? null;
    this.selectedTrialDate = this.currentCase.trialDate ?? null;
    this.trialDate = this.selectedTrialDate ? this.$dayjs(this.selectedTrialDate).format("MMMM DD, YYYY") : " ";
    this.trialTime = this.currentCase.trialTime ?? null;
  },
  methods: {
    handleContinue() {
      this.successDialog = true;
    },
    async submit() {
      const today =
        this.currentCase.vcDateFiled || this.$dayjs().format("YYYY-MM-DD");
        // this.currentCase.vcDateFiled || this.$dayjs().format("MM.DD.YY");
      const caseData = {
        docketNo: this.docketNo ?? null,
        manageConf: this.selectedManageConf,
        courtInfoTime: this.courtInfoTime,
        trialDate: this.selectedTrialDate,
        trialTime: this.trialTime,
        vcDateFiled: today,
        statusDate: today,
      };

      // if (this.currentCase.includeClrsDocument === false) {
      //   caseData.clrsEmailSendingDate = 1;
      // }

      await this.$store.dispatch("eviction/updateCase", {
        caseData,
        // submitted: false,
        logMessage: "CourtInformation.vue:178",
      });

      // if (process.env.VUE_APP_EMAIL_ENV === "development") {
      //   if (this.currentCase.includeClrsDocument === false) {
      //     const { data: response } = await useRequest({
      //       method: "post",
      //       path: `send-case-test-email/${this.currentCase.id}`,
      //       data: {
      //         documentName: "case-overview",
      //       },
      //     });

      //     console.log("send-clrs-email", response);
      //   }
      // }

      this.$router.push({ name: "case-view-overview" });
    },
    evTimePickerSelected(data) {
      this.courtInfoTime = data;
      this.courtInfoTimeMenu = false;
    },
    trialTimePickerSelected(data) {
      this.trialTime = data;
      this.trialTimeMenuOpen = false;
    },
    closedManageConfMenu(data) {
      this.selectedManageConf = data;
      this.manageConf = this.$dayjs(this.selectedManageConf).format("MMMM DD, YYYY");
      this.manageConfMenu = false;
    },
    closedTrialDateMenu(data) {
      this.selectedTrialDate = data;
      this.trialDate = this.$dayjs(this.selectedTrialDate).format("MMMM DD, YYYY");
      this.trialDateMenuOpen = false;
    },
  },
};
</script>

<style scoped>
.dateAndTime {
  display: flex;
  gap: 20px;
}
</style>
