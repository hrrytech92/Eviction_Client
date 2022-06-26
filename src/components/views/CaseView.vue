<template>
  <div class="py-4 px-12 mx-4">
    <div class="d-flex align-center mt-6 mb-12 justify-space-between">
      <div class="secondary--text custom-heading mr-12">Case File</div>
      <div class="d-flex align-center">
        <i class="icofont-home icofont-2x mr-4" style="color: #c3d1d2" />
        <div class="spaced-text secondary--text" style="font-size: 1.2rem">
          {{
            typeof currentProperty.streetAddress !== "undefined" &&
            currentProperty.streetAddress.toUpperCase()
          }}
        </div>
      </div>
    </div>

    <SubTopNav :value="0" />

    <v-container fluid class="case-view">
      <v-row>
        <v-col class="pl-6 pt-0 flex-grow-1 flex-shrink-0" cols="9">
          <!-- <v-col class="pl-6 pt-0"> -->
          <v-row class="mb-6">
            <!-- <v-col cols="4">
                <client-info-card :clientId="currentCase.clientId"/>
            </v-col> -->
            <v-col>
              <CaseOverviewCard
                :current-case="currentCase"
                :currentProperty="currentProperty"
                :courtAddress="courtAddress"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <DocListCard title="Uploads" :documents="currentCase.documents" />
            </v-col>
            <v-col>
              <doc-list-card title="Pleadings" :documents="pleadingDocuments" />
            </v-col>
          </v-row>
          <!-- <PageNavBar :caseId="currentCase.id"/> -->
          <router-view />
        </v-col>
        <v-col class="flex-grow-0 flex-shrink-1" cols="3">
          <div>
            <NextStep />
            <OrderDetailsCard :date="currentCase.statusDate" />
            <CaseProgressCard :currCase="currentCase" />
          </div>
        </v-col>
      </v-row>
    </v-container>
    <!-- <InfoBar :items="items"/> -->
    <!-- <nav-bottom :value="0" /> -->
  </div>
</template>

<script>
import NextStep from "@/components/NextStep";
import CaseOverviewCard from "@/components/CaseOverviewCard";
import DocListCard from "../DocListCard.vue";
import OrderDetailsCard from "@/components/CaseViewOrderDetailsCard";
import CaseProgressCard from "@/components/CaseProgressCard";
import SubTopNav from "../SubTopNav.vue";
import { mapGetters } from "vuex";

export default {
  name: "CaseView",
  components: {
    NextStep,
    CaseOverviewCard,
    DocListCard,
    SubTopNav,
    OrderDetailsCard,
    CaseProgressCard,
  },
  data() {
    return {
      value: 0,
    };
  },
  computed: {
    ...mapGetters({
      currentCase: "eviction/currentCase",
      currentProperty: "property/currentProperty",
      courtAddress: "eviction/courtInfo",
      pleadingDocuments: "eviction/pleadings",
    }),
  },
  async mounted() {
    //this.$store.commit("eviction/init_case");
    await this.$store.dispatch("eviction/loadCase", {
      caseId: this.$route.params.id,
      logMessage: "CaseView.vue at line 93",
    });
    await this.$store.dispatch("eviction/loadDocuments", {
      caseId: this.currentCase.id,
      documentType: 1,
    });
    await this.$store.dispatch("eviction/getCaseOrders", {
      caseId: this.$route.params.id,
      logMessage: "CaseView.vue at line 101",
    });
    await this.$store.dispatch("eviction/loadPleadings");
    await this.$store.dispatch("eviction/loadCourtInfo");
  },
};
</script>

<style>
.rounded-card.v-card.v-sheet.theme--light {
  border-radius: 20px;
}
.active-bottom-btn {
  color: white !important;
  background-color: #4dccc4 !important;
}
</style>
