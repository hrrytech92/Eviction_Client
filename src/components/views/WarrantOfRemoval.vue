<template>
  <div style="padding: 0 30px; max-width: 1400px; margin: 0 auto">
    <!-- <v-container> -->
    <v-row>
      <!-- <v-col cols="2" /> -->
      <v-col cols="8" class="pr-8">
        <v-card class="my-12 px-4 text-center" style="border-radius: 10px">
          <!-- Inactive components will be cached! -->
          <keep-alive>
            <router-view
              v-bind="{ ...this.case }"
              @close:form="cancel"
              @submit="submit"
            />
          </keep-alive>
        </v-card>
      </v-col>
      <v-col cols="4" class="my-10 pl-10">
        <p class="overline info--text font-weight-bold mb-0">
          NON-PAYMENT OF RENT
        </p>
        <p class="spaced-text secondary--text mb-6">Request for Warrant of Removal</p>
        <WorSideList :items="steps" />
      </v-col>
    </v-row>

    <v-dialog v-model="cancelDialog" persistent value="''" max-width="600">
      <CancelDialog @close="cancelDialog = false" @submit="cancelForm" />
    </v-dialog>
    <!-- <bottom-bar :progress="progress" @preview="preview" v-if="step !== 0" /> -->
  </div>
</template>

<script>
import WorSideList from "@/components/WorSideList.vue";
import CancelDialog from "@/components/dialogs/CancelDialog.vue";
import { mapGetters } from "vuex";

export default {
  name: "WarrantOfRemoval",
  components: {
    WorSideList,
    CancelDialog,
  },
  data() {
    return {
      // step: 0,
      // progress: 0,
      cancelDialog: false,
    };
  },
  computed: {
    ...mapGetters({
      case: "eviction/currentCase",
      isAuthenticated: "isAuthenticated",
      steps: "eviction/worSteps",
    }),
  },
  mounted: async function () {
    if (!this.$auth.isAuthenticated) return;
    const {
      params: { id: caseId },
    } = this.$route;
    if (caseId === "new") {
      // this.$store.commit("eviction/init_steps");
      return;
    }

    if (caseId) await this.loadData(caseId);
  },
  methods: {
    cancel() {
      this.cancelDialog = true;
    },
    cancelForm() {
      this.cancelDialog = false;
      if (!this.$auth.isAuthenticated) {
        //* guest user canceled, clearing sessionStorage");
        sessionStorage.clear();
        return this.$auth.loginWithRedirect();
      }
      this.$router.push("/");
    },
    async loadData(caseId) {
      await this.$store.dispatch("eviction/loadCase", {
        caseId,
        logMessage: "WarrantOfRemoval.vue at line 136",
      });
    },
    submit() {
      // save to api
      // if no account, save and redirect to login
      // this.save(true);
      // this.createComplaint();
    },
  },
};
</script>

<style>
.v-timeline-item__divider {
  min-width: 60px;
}

.v-application--is-ltr .v-timeline--dense:not(.v-timeline--reverse):before {
  left: calc(66px - 1px);
  right: initial;
}
</style>
