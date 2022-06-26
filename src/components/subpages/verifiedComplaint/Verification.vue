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
      <div class="custom-title pt-8 pb-4">Landlord Verification</div>
      <div class="pb-6">
        The statements below were pre-selected for the most common scenarios.
        Review each and deselect as applicable, so that the statements below
        match your specific situation.
      </div>

      <v-row class="my-4">
        <v-col cols="1" class="pa-0">
          <div class="caption info--text font-weight-medium">TRUE</div>
        </v-col>
        <v-col cols="1" class="pa-0">
          <div class="caption info--text font-weight-medium">FALSE</div>
        </v-col>
      </v-row>
      <div v-for="(statement, name) in statements" :key="statement.text">
        <v-row class="mb-4">
          <v-col cols="2" class="pa-0">
            <v-radio-group
              v-model="statement.confirmed"
              class="my-0 primary-radio-group"
              :mandatory="true"
              hide-details
              row
            >
              <!-- <v-col cols="2"> -->
              <v-radio
                :value="true"
                on-icon="mdi-checkbox-blank-circle"
                class="ml-4"
              />
              <!-- </v-col>
                         <v-col cols="2"> -->
              <v-radio
                color="primary"
                :value="false"
                on-icon="mdi-checkbox-blank-circle"
                class="pa-0 mr-0 ml-1"
              />
              <!-- </v-col> -->
            </v-radio-group>
          </v-col>
          <v-col class="pt-0">
            <div
              class="secondary--text text-left"
              style="font-size: 0.9rem; display: inline"
              v-html="statement.text"
            />
            <v-tooltip
              v-if="statement.info"
              v-model="statement.info.show"
              top
              :open-on-hover="false"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  icon
                  v-bind="attrs"
                  retain-focus-on-click
                  class="ml-1"
                  style="display: inline-block"
                  @click="handleTooltip(statement.info)"
                  @blur="on.blur"
                >
                  <i class="icofont-question-circle accent2--text" />
                </v-btn>
              </template>
              <!-- <speech-bubble
                :body="statement.info.text"
                :title="statement.info.title"
              /> -->
              <speech-bubble :title="statement.info.title">
                <span slot="htmlBody" v-html="statement.info.text" />
              </speech-bubble>
            </v-tooltip>
          </v-col>
        </v-row>
        <v-row
          v-if="name === 'another_court_subject' && !statement.confirmed"
          class="mb-4"
        >
          <v-col cols="2" />
          <v-col class="pa-4 d-flex" cols="9" style="margin-top: -16px">
            <div class="side-border" />
            <div class="py-2 pl-4 flex-grow-1">
              <div
                class="font-weight-medium secondary--text text-left pb-2"
                style="font-size: 0.9rem"
              >
                Name of the other party
              </div>

              <v-text-field
                v-model="statement.party"
                rounded
                hide-details
                solo
                flat
                dense
                background-color="#F0F5F6"
              />
            </div>
          </v-col>
        </v-row>
        <v-row
          v-if="name === 'interpreter' && statement.confirmed"
          class="mb-4"
        >
          <v-col cols="2" />
          <v-col class="pa-4 d-flex" cols="9" style="margin-top: -16px">
            <div class="side-border" />
            <div class="py-2 pl-4 flex-grow-1">
              <div
                class="font-weight-medium secondary--text text-left pb-2"
                style="font-size: 0.9rem"
              >
                Indicate language.
              </div>

              <v-text-field
                v-model="statement.language"
                rounded
                hide-details
                solo
                flat
                dense
                background-color="#F0F5F6"
              />
            </div>
          </v-col>
        </v-row>
        <v-row v-if="name === 'disability' && statement.confirmed" class="mb-4">
          <v-col cols="2" />
          <v-col class="pa-4 d-flex" cols="9" style="margin-top: -16px">
            <div class="side-border" />
            <div class="py-2 pl-4 flex-grow-1">
              <div
                class="font-weight-medium secondary--text text-left pb-2"
                style="font-size: 0.9rem"
              >
                State the required accommodation.
              </div>

              <v-text-field
                v-model="statement.accommodation"
                rounded
                hide-details
                solo
                flat
                dense
                background-color="#F0F5F6"
              />
            </div>
          </v-col>
        </v-row>
      </div>
      <div class="d-flex align-center py-4">
        <div class="font-weight-medium mr-8">Confirm</div>
        <v-divider />
      </div>
      <div class="d-flex align-center my-2">
        <v-switch
          v-model="confirmed"
          class="px-4 custom-switch"
          color="primary"
        />
        <span style="font-size: 18px"
          >I have read each of the above statements and my responses are correct
          and true, to the best of my knowledge.</span
        >
      </div>
    </div>
    <!--<v-dialog-->
    <!--  v-model="showShouldLoginDialog"-->
    <!--  :max-width="500"-->
    <!--&gt;-->
    <!--  <should-login-dialog-->
    <!--    @close:dialog="showShouldLoginDialog = false"-->
    <!--  />-->
    <!--</v-dialog>-->
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
        :disabled="!valid"
        @click="next"
      >
        continue
      </v-btn>
    </v-card-actions>
  </div>
</template>

<script>
import SpeechBubble from "../../SpeechBubble.vue";
import { mapGetters } from "vuex";

export default {
  name: "Verification",
  components: { SpeechBubble },
  data() {
    return {
      confirmed: false,
      statements: {},
      showShouldLoginDialog: false,
    };
  },
  computed: {
    ...mapGetters({
      currentCase: "eviction/currentCase",
    }),
    valid() {
      return this.confirmed;
    },
    client() {
      return this.$store.getters.client;
    },
  },

  activated() {
    window.scrollTo(0, 0);
    this.initializeStatements();
  },
  deactivated() {
    this.saveData();
  },
  methods: {
    initializeStatements() {
      const clientData = this.$auth.isAuthenticated
        ? this.client
        : JSON.parse(sessionStorage.getItem("userData"));

      const { verification } = this.currentCase;
      const {
        read_info_true,
        not_another_court_subject,
        another_court_party,
        confidential_personal_removed,
        statements_true,
      } = verification;

      this.statements = {
        read_info_true: {
          text: "I have read the verified complaint and the information contained in it is true and based upon my personal knowledge.",
          confirmed: read_info_true ?? true,
        },
        another_court_subject: {
          text: "The matter in controversy is not the subject of another court action or arbitration now pending or contemplated and no other parties should be joined in this action.",
          confirmed: not_another_court_subject ?? true,
          party: another_court_party,
          action: "",
          info: {
            id: "another_court_subject",
            show: false,
            text: "In this scenario, the “matter in controversy” is the rental property. Select “False” if there is another suit pending, wherein the rental property is a part of said suit (i.e. Bankruptcy, Divorce). If there is no suit pending, but arbitration is scheduled or in the process of being scheduled, select “False” as well. Otherwise, select “True.”",
          },
        },
        confidential_personal_removed: {
          text: 'I certify that confidential personal identifiers have been redacted from documents now submitted to the court, and will be redacted from all documents submitted in the future in accordance with <a href="https://www.njcourts.gov/attorneys/assets/rules/r1-38.pdf" target="_blank" style="color: #6a7fdb; display: inline">Rule 1:38-7(b)</a>.',
          confirmed: confidential_personal_removed ?? true,
          info: {
            id: "confidential_personal_removed",
            show: false,
            text: "Review the pleadings being filed, and documents you are presenting to the Court, to ensure that any and all personal identifying information have been removed or redacted. This includes, but is not limited to: drivers license number, social security numbers, vehicle plate numbers, insurance policy numbers, active financial account numbers, active credit card numbers.",
          },
        },
        statements_true: {
          text: "The foregoing statements made by me are true and I am aware that if any of the foregoing statements made by me are willfully false, I am subject to punishment.",
          confirmed: statements_true ?? true,
        },
        interpreter: {
          text: "At the trial, Plaintiff will require an interpreter.",
          confirmed: !!clientData.interpreter,
          language: clientData.language,
        },
        disability: {
          text: "At the trial, Plaintiff will require an accommodation for a disability.",
          confirmed: !!clientData.disability,
          accommodation: clientData.accommodation,
        },
      };
    },
    saveData() {
      if (!this.confirmed) return;
      const { statements } = this;
      const { interpreter, disability, another_court_subject } = statements;
      const not_another_court_subject = another_court_subject.confirmed;
      const verification = {
        read_info_true: statements.read_info_true.confirmed,
        not_another_court_subject,
        another_court_party: !not_another_court_subject
          ? another_court_subject.party
          : "",
        confidential_personal_removed:
          statements.confidential_personal_removed.confirmed,
        statements_true: statements.statements_true.confirmed,
        interpreter: interpreter.confirmed ? interpreter.language : "",
        disability: disability.confirmed ? disability.accommodation : "",
      };

      this.$store.dispatch("eviction/updateCase", {
        caseData: {
          verification,
        },
        // lastStep: "Verification",
        status: "verification",
      });

      const userData = {
        interpreter: verification.interpreter ? 1 : 0,
        language: verification.interpreter,
        disability: verification.disability ? 1 : 0,
        accommodation: verification.disability,
      };

      this.$store.dispatch("updateUser", userData);
    },
    next() {
      this.$router.push({ name: "vc-certification" });
    },
    back() {
      this.$router.push({ name: "vc-confirmation" });
    },
    handleTooltip(params) {
      const key = params.id;
      this.statements = {
        ...this.statements,
        [key]: {
          ...this.statements[key],
          info: {
            ...this.statements[key].info,
            show: !this.statements[key].info.show,
          },
        },
      };
    },
  },
};
</script>

<style>
.primary-radio-group i.v-icon.notranslate.mdi.mdi-radiobox-blank.theme--light {
  color: #4dccc4;
}
.side-border {
  background-color: #4dccc4;
  border-radius: 30px;
  opacity: 1;
  width: 5px;
}
</style>
