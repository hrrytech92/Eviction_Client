<template>
  <div class="mx-8 secondary--text">
    <div class="headline font-weight-medium pt-8 pb-4">Representation</div>
    <div class="pb-4" style="font-size: 0.8rem">
      Would you like to have an attorney represent you in this suit?
    </div>
    <div class="py-4">
      <v-btn
        rounded
        color="primary"
        small
        dark
        class="px-12"
        :class="{ faded: representation === 'yes' }"
        depressed
        @click="
          () => {
            representation = 'no';
            service = 'Self-File';
          }
        "
      >
        no
      </v-btn>
      <v-btn
        rounded
        color="accent"
        small
        dark
        class="px-12 ml-4"
        :class="{ faded: representation === 'no' }"
        depressed
        @click="representation = 'yes'"
      >
        yes
      </v-btn>
    </div>

    <div v-if="representation === 'no'">
      <div class="headline font-weight-medium pt-8 pb-4">Court Filing</div>
      <div class="secondary--text pb-4" style="font-size: 0.8rem">
        How would you like to have the
        <span class="font-weight-medium">Verified Complaint</span> filed with
        the court?
      </div>
      <v-radio-group
        v-model="filingPlan"
        class="my-0 info-radio"
        :mandatory="true"
        hide-details
      >
        <v-card
          outlined
          class="my-4 pa-1 rounded-card secondary--text"
          :class="{
            'primary-border': filingPlan === 'Easy Evictions Filing',
            'info-border': filingPlan !== 'Easy Evictions Filing',
          }"
          @click="filingPlan = 'Easy Evictions Filing'"
        >
          <v-row align="center">
            <v-col cols="1">
              <v-radio
                :value="'Easy Evictions Filing'"
                on-icon="mdi-checkbox-blank-circle"
                class="ml-4"
              />
            </v-col>
            <v-col class="secondary--text text-left mx-2">
              <div class="font-weight-medium" style="font-size: 1rem">
                Easy Evictions Filing
              </div>
              <div style="font-size: 0.8rem">
                Complaint & Summons will be properly submitted with the court,
                along with the correct number of copies and fees. Fees will be
                calculated and added at checkout. Does not include attorney
                review or representation.
              </div>
            </v-col>
            <v-col cols="2">
              <div class="headline font-weight-medium pb-1">$20</div>
              <div
                class="info--text font-weight-medium"
                style="font-size: 0.7rem"
              >
                SERVICE FEE
              </div>
            </v-col>
          </v-row>
        </v-card>

        <v-card
          outlined
          class="my-4 pa-1 rounded-card secondary--text"
          :class="{
            'primary-border': service === 'Self File',
            'info-border': service !== 'Self File',
          }"
          @click="service = 'Self File'"
        >
          <v-row align="center">
            <v-col cols="1">
              <v-radio
                :value="'Self File'"
                on-icon="mdi-checkbox-blank-circle"
                class="ml-4"
              />
            </v-col>
            <v-col class="secondary--text text-left mx-2">
              <div class="font-weight-medium" style="font-size: 1rem">
                Self-File
              </div>
              <div style="font-size: 0.8rem">
                Once you click submit and complete the purchase, download your
                pleadings. We’ll provide you with the information you’ll need to
                self-file with the court, including the proper number of copies
                and correct fee amount.
              </div>
            </v-col>
            <v-col cols="2">
              <div class="headline font-weight-medium pb-1">Free</div>
              <div
                class="info--text font-weight-medium"
                style="font-size: 0.7rem"
              >
                SERVICE FEE
              </div>
            </v-col>
          </v-row>
        </v-card>
      </v-radio-group>
    </div>

    <div v-if="representation === 'yes'">
      <v-form ref="form" v-model="valid">
        <div class="headline font-weight-medium pt-8 pb-4">
          Select Your Attorney
        </div>
        <div class="secondary--text caption pb-4">
          These are the attorneys available in your county. Select one. You may
          view their profile before making your selection. If the attorney is
          not available or able to take your case, we’ll let you know and help
          you select another attorney.
        </div>

        <v-slide-group
          v-model="model"
          style="background-color: #fafbfc"
          class="mx-auto"
        >
          <v-slide-item
            v-for="n in 4"
            :key="n"
            v-slot:default="{ active, toggle }"
          >
            <v-card
              :color="active ? 'white' : '#FAFBFC'"
              :flat="active ? false : true"
              class="ma-4 d-flex flex-column align-center"
              height="210"
              width="190"
              @click="
                () => {
                  toggle();
                  attorneyId = 31;
                  noAttorneyError = false;
                }
              "
            >
              <v-btn
                x-small
                icon
                :class="{ 'hidden-item': !active }"
                class="align-self-end mt-2 mr-2"
                color="accent"
              >
                <i class="icofont-search-job accent--text icofont-2x" />
              </v-btn>
              <v-avatar style="border-radius: 50%" size="85">
                <img src="@/assets/Lawyer.png" />
              </v-avatar>
              <div class="font-weight-medium secondary--text pt-2 mx-2">
                Kimberly Swanson
              </div>
              <div class="info--text">Bar No. 1234567</div>
            </v-card>
          </v-slide-item>
        </v-slide-group>
        <div v-if="noAttorneyError" class="error-message text-left">
          You must select an attorney.
        </div>

        <div class="mt-4 d-flex align-center">
          <div id="triangle-topright" />
          <v-checkbox
            v-model="accept"
            class="ml-6 mb-5"
            off-icon="mdi-checkbox-blank-circle-outline"
            on-icon="mdi-checkbox-blank-circle"
          />
          <div style="font-size: 0.7rem">
            I've reviewed the
            <v-btn
              small
              text
              class="accent--text btn--plain pa-0 mb-1 revert--btn"
              @click.stop="dialogOpen = true"
            >
              Terms and Conditions of the Attorney Client Relationship </v-btn
            >, and agree to the terms.
          </div>
        </div>
        <div v-if="acceptError" class="error-message text-left">
          You must accept the terms to continue.
        </div>

        <div v-if="accept && attorneyId">
          <div class="headline font-weight-medium pt-8 pb-4">
            Select Your Service
          </div>
          <div class="secondary--text caption pb-4">
            What type of service would you like the attorney to perform?
          </div>

          <div class="d-flex justify-space-around my-8">
            <v-card
              elevation="6"
              class="rounded-card secondary--text px-8 pt-8 pb-4"
              width="300"
            >
              <div class="font-weight-medium" style="font-size: 0.9rem">
                A LA CARTE
              </div>
              <div class="display-2 font-weight-medium pb-6">$99</div>
              <div
                class="left-semi-circle"
                style="position: absolute; left: 0; bottom: 100px"
              />
              <div
                v-for="item in aLaCarteItems"
                :key="item"
                class="d-flex align-center pa-2"
              >
                <div class="triangle-small mr-2" />
                <div style="font-size: 0.9rem">
                  {{ item }}
                </div>
              </div>
              <v-btn
                rounded
                color="primary"
                small
                dark
                class="px-10 mx-auto"
                :class="{ faded: service === 'Complete' }"
                depressed
                style="position: absolute; bottom: 57px; left: calc(50% - 60px)"
                @click="service = 'a La Carte'"
              >
                select
              </v-btn>
              <div
                class="font-weight-medium info--text text-uppercase caption mt-2"
                style="position: absolute; bottom: 24px; left: calc(50% - 40px)"
              >
                MORE INFO
              </div>
            </v-card>
            <v-card
              elevation="6"
              class="rounded-card secondary--text px-8 pt-8 pb-6"
              width="300"
            >
              <div class="font-weight-medium" style="font-size: 0.9rem">
                COMPLETE EVICTION
              </div>
              <div class="display-2 font-weight-medium pb-6">$499</div>
              <div class="triangle-top-left" />
              <div
                id="corner-triangle-text"
                class="white--text caption font-weight-medium"
              >
                BEST
              </div>
              <div
                v-for="item in completeEvictionItems"
                :key="item"
                class="d-flex align-center pa-2"
              >
                <div class="triangle-small mr-2" />
                <div style="font-size: 0.9rem">
                  {{ item }}
                </div>
              </div>
              <v-btn
                rounded
                color="primary"
                small
                dark
                class="px-10 mt-6"
                :class="{ faded: service === 'a La Carte' }"
                depressed
                @click="service = 'Complete'"
              >
                select
              </v-btn>
              <div
                class="font-weight-medium info--text text-uppercase caption mt-2"
              >
                MORE INFO
              </div>
              <div
                class="semi-circle"
                style="position: absolute; right: 0; top: 50px"
              />
              <div />
            </v-card>
          </div>
          <div v-if="noServiceError" class="error-message text-left">
            Select a service.
          </div>
        </div>
      </v-form>
    </div>

    <div v-if="representation !== ''">
      <v-card-actions
        style="background-color: #fafbfc; border-radius: 0px 0px 10px 10px"
        class="justify-end py-4 pr-12"
      >
        <v-btn
          rounded
          color="accent_light"
          class="mb-2 mt-4 btn--plain"
          small
          text
          @click="$emit('back')"
        >
          go back
        </v-btn>
        <v-btn
          rounded
          color="accent_light"
          class="px-8 mb-2 mt-4 white--text"
          small
          depressed
          @click="next"
        >
          continue
        </v-btn>
      </v-card-actions>
    </div>

    <v-dialog v-model="dialogOpen" value="''" :max-width="700">
      <terms-dialog @accept="acceptTerms" @decline="declineTerms" />
    </v-dialog>
  </div>
</template>

<script>
import TermsDialog from "@/components/dialogs/TermsDialog";
export default {
  name: "Representation",
  components: {
    TermsDialog,
    // VDaterange
  },
  data() {
    return {
      valid: true,
      acceptError: false,
      noAttorneyError: false,
      noServiceError: false,
      representation: "",
      attorneyId: "",
      service: "",
      filingPlan: "",
      aLaCarteItems: [
        "Complaint & Summons",
        "Attorney Document Review",
        "Self-manage process",
      ],
      completeEvictionItems: [
        "Attorney Representation",
        "Complaint & Summons",
        "Court Fees",
        "Court Appearance (1)",
        "Managed Process",
      ],
      dialogOpen: false,
      accept: false,
    };
  },
  computed: {},
  watch: {
    accept: function (newVal) {
      if (newVal) {
        this.acceptError = false;
      }
    },
    service: function (newVal) {
      if (newVal) {
        this.noServiceError = false;
      }
    },
  },
  activated() {
    window.scrollTo(0, 0);
  },
  deactivated() {
    if (this.valid) {
      this.$emit("update:data", {
        attorneyId: this.attorneyId,
        service: this.service,
        filingPlan: this.filingPlan,
      });
      this.$emit("next");
    }
  },
  methods: {
    validate() {
      if (this.representation === "yes" && !this.accept) {
        this.acceptError = true;
      }
      if (this.representation === "yes" && !this.attorneyId) {
        this.noAttorneyError = true;
      }
      if (this.representation === "yes" && !this.service) {
        this.noServiceError = true;
      }
      return !this.acceptError && !this.noAttorneyError && !this.noServiceError;
    },
    next() {
      this.valid = this.validate();
      if (this.valid) {
        this.$emit("update:data", {
          attorneyId: this.attorneyId,
          service: this.service,
          filingPlan: this.filingPlan,
        });
        this.$emit("next");
      }
    },
    acceptTerms() {
      this.accept = true;
      this.dialogOpen = false;
    },
    declineTerms() {
      this.accept = false;
      this.dialogOpen = false;
    },
  },
};
</script>

<style>
.v-card--link:focus:before {
  opacity: 0;
}

#triangle-topright {
  width: 0;
  height: 0;
  border-top: 40px solid transparent;
  border-bottom: 40px solid transparent;
  margin-left: -64px;

  border-left: 40px solid #4dccc4;
}

.triangle-small {
  width: 0;
  height: 0;
  border-top: 10px solid transparent;
  border-bottom: 10px solid transparent;

  border-left: 10px solid #4dccc4;
}

.semi-circle {
  height: 100px;
  width: 50px;
  background: #4dccc4 0% 0% no-repeat padding-box;
  border-radius: 100px 0px 0px 100px;
  opacity: 0.13;
}
.left-semi-circle {
  height: 100px;
  width: 50px;
  background: #4dccc4 0% 0% no-repeat padding-box;
  border-radius: 0px 100px 100px 0px;
  opacity: 0.13;
}

.triangle-top-left {
  position: absolute;
  top: 0;
  left: 0;
  width: 30%;
  padding-bottom: 30%;
  border-radius: 20px 0 0;
  overflow: hidden;
  transform-origin: 100% 0;
}
.triangle-top-left:after {
  content: "";
  position: absolute;
  top: 0;
  right: 8px;
  width: 100%;
  height: 141%;
  transform-origin: inherit;
  transform: rotate(45deg);
  background: #4dccc4;
}

#corner-triangle-text {
  position: absolute;
  top: 15px;
  left: 11px;
  transform: rotate(-45deg);
  z-index: 3;
}

.primary-border {
  border: solid 2px #4dccc4 !important;
}

.info-border {
  border: solid 2px #afc2ce !important;
}

.info-radio .theme--light.v-icon {
  color: #afc2ce;
}

.revert--btn > span.v-btn__content {
  text-transform: none;
}
</style>
