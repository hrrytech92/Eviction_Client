<template>
  <div>
    <v-card
      class="rounded-card"
      style="
        box-shadow: 15px 15px 40px #00000029;
        border-radius: 20px;
        min-width: 320px;
      "
    >
      <div
        class="next-step-header d-flex justify-space-between align-center px-10 py-6"
        :class="currentStep === 'step3' ? 'court-completed' : ''"
      >
        <p class="font-weight-medium">Next Step</p>
        <v-icon large color="white"> mdi-bell </v-icon>
      </div>
      <div class="next-step-content px-10">
        <div class="d-flex align-center my-3" v-if="currentStep === 'step2'">
          <i
            class="icofont-clock-time grey--text"
            style="font-size: 1rem; line-height: 1"
          ></i>
          <span class="ml-3 grey--text">
            {{ getFivePriorDays(currentCase.manageConf) }}
          </span>
        </div>
        <p class="secondary--text font-weight-bold">{{ title }}</p>
        <p class="secondary--text pb-5">
          {{ description }}
        </p>
        <div class="d-flex my-3" v-if="currentStep === 'step1'">
          <v-icon color="accent_light">mdi-checkbox-blank-circle</v-icon>
          <span class="ml-3 secondary--text">Medium Priority</span>
        </div>
        <div class="d-flex my-3" v-if="currentStep === 'step2'">
          <v-icon color="red">mdi-checkbox-blank-circle</v-icon>
          <span class="ml-3 secondary--text">High Priority</span>
        </div>
      </div>
      <div class="next-step-footer px-10 py-6">
        <v-btn
          v-if="currentStep === 'step1'"
          color="accent_light"
          class="px-4 white--text"
          rounded
          depressed
          @click="
            $router.push(
              `/verified-complaint/${$route.params.id}/single/court-information/`
            )
          "
        >
          Start Now
        </v-btn>
        <v-btn
          v-if="currentStep === 'step2'"
          color="accent_light"
          class="px-4 white--text"
          rounded
          depressed
          @click="
            $router.push(`/verified-complaint/${$route.params.id}/single/lease`)
          "
        >
          Start Now
        </v-btn>
        <div v-if="currentStep === 'step3'">
          <!-- <div class="step-status">pending</div> -->
          <h3 class="mb-2" style="color: #53809d">Court Pending</h3>
          <v-btn
            color="secondary_light"
            class="px-4 white--text"
            rounded
            depressed
            @click="
              $router.push(
                `/verified-complaint/${$route.params.id}/single/court-information/`
              )
            "
          >
            Reschedule/Edit Court Info
          </v-btn>
        </div>
      </div>
    </v-card>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "NextStep",
  data() {
    return {
      title: "",
      description: "",
      priority: "",
      isCourtInformationCompleted: false,
      currentStep: "",
    };
  },
  computed: {
    ...mapGetters({
      currentCase: "eviction/currentCase",
    }),
  },
  methods: {
    getFivePriorDays(date) {
      const confDate = new Date(date);
      const priorFiveDay = new Date(confDate - 7 * 24 * 60 * 60 * 1000);

      return this.$dayjs(priorFiveDay).format("MM/DD/YYYY");
      // const finalDate =
      //   priorFiveDay.getDate() +
      //   "." +
      //   (priorFiveDay.getMonth() + 1) +
      //   "." +
      //   priorFiveDay.getFullYear();
      // return finalDate;
    },
  },
  async created() {
    if (
      this.currentCase.manageConf === null &&
      this.currentCase.docketNo === null
    ) {
      this.title = "Enter Court Information";
      this.description =
        "Update the Case File with the information the court has provided you with in the notice.";
      this.priority = "medium";
      this.currentStep = "step1";
    } else {
      this.isCourtInformationCompleted = true;
      if (!this.currentCase.clrsSubmission && !this.currentCase.clrsExemption) {
        this.title =
          "Complete Certification of Lease and Registration Statement";
        this.description =
          "This document must be filed with the court no later than five(5) days prior to your case management conference.";
        this.priority = "red";
        this.currentStep = "step2";
      } else {
        this.title = "Your Next Steps";
        this.description =
          "In the future, we'll guide you all the way through to the end. For now, be sure to contact the court or seek legal counsel for any questions pertaining to your proceeding and your next steps.";
        this.priority = "none";
        this.currentStep = "step3";
      }
    }
  },
};
</script>

<style>
.next-step-header {
  background-color: #ff854e;
}
.next-step-header.court-completed {
  background-color: #4dccc4;
}
.next-step-header p {
  color: white !important;
  margin: 0;
  font-size: 1.25rem;
}
.next-step-header i {
  transform: rotate(20deg);
}
.next-step-content {
  padding: 40px 0 10px 0;
}
.next-step-footer {
  background-color: #f8fafb;
}

.bullet-priority {
  width: 16px;
  height: 16px;
  background: #ff854e;
  border: 1px solid #ff854e;
  border-radius: 50%;
  margin-right: 6px;
  align-self: center;
}

.step-status {
  text-align: center;
  padding: 5px 20px;
  width: 130px;
  border-radius: 23px;
  background-color: #dae3e9;
  font-size: 18px;
  color: #8ba4b4;
  font-style: italic;
}
</style>
