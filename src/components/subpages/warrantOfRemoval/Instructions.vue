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

    <div style="width: 80%" class="pt-15 pb-4 mx-auto text-left">
      <div class="custom-title pb-4">Let's Review...</div>
      <div class="pb-4">
        <p v-if="currentCase.courtOutcome.includes('Breach')">
          If the court has provided you with a <span class="font-weight-medium">Consent to Enter Judgment - Pay and
          <span v-if="currentCase.courtOutcome.includes('Stay')">Stay</span><span v-else>Vacate</span></span>, you can only file a request for Warrant of Removal
          if the tenant if the Tenant breaches the terms of the Consent Judgment. In the event of a breach, you need to file with the court a Certification by 
          Landlord of Breach and Request for Warrant of Removal <span style="text-decoration: underline">not later than 30 days</span> from the Date of the Breach.
        </p>
        <p v-else>
          If the court has provided you with a <span class="font-weight-medium">{{ currentCase.courtOutcome }}</span>, you need to file with the court a
          Certification by Landlord and Request for Warrant of Removal <span style="text-decoration: underline">not later than 30 days</span> from the Date of the 
          <span v-if="currentCase.courtOutcome.includes('Tenant Vacates')">Move Out Date</span><span v-else>Judgment</span>.
        </p>
        <p>Keep in mind that the Court cannot issue the Warrant of Removal to the Tenant sooner than 3 Business Days after the Trial Date,
          and cannot execute upon the Warrant of Removal sooner than 3 Business Days from when it was issued.</p>
      </div>
      <div class="custom-title pb-4">Certification by Landlord <span v-if="currentCase.courtOutcome.includes('Breach')">of Breach</span></div>
      <div class="pb-4">
        This document is required when filing a
        <span class="font-weight-medium">Request for Warrant of Removal</span>.
        It's an affidavit as required by
        <span class="indigo--text">NJ Court Rules 6:6-3(b)</span>: "The affidavit
        must state the facts establishing the jurisdictional good cause for
        eviction required by the applicable statute and that the charges and fees
        claimed to be due as rent, other than the base rent, are permitted to be
        charged as rent by the lease and by applicable federal, state, and local
        law." In the
        <span class="font-weight-medium">Certification by Landlord</span>, the
        Landlord re-affirms the current outstanding and owing payments from the
        tenant, which, in some cases, is the basis for pursuing eviction. The
        Landlord must also certify additional statements(<span
          class="font-weight-medium"
          >e.g.</span
        >
        property registration, tenant's military status).
      </div>
      <div class="custom-title pb-4">Request for Warrant of Removal</div>
      <div>
        A
        <span class="font-weight-medium">Request for Warrant of Removal</span> is
        a written request to the Court to appoint a Special Civil Part Officer to
        post a <span class="font-weight-medium">Warrant of Removal</span> on the
        Tenant's door, no sooner than three (3) business days from the date the
        Court issues the request. The
        <span class="font-weight-medium">Warrant of Removal</span> notifies the
        tenants that if they do not move out of the Premises within three (3)
        business days from when the
        <span class="font-weight-medium">Warrant of Removal</span> is served upon
        them, they will be removed from the Premises by the Special Civil Part
        Officer.
      </div>
    </div>

    <v-card-actions
      style="background-color: #fafbfc; border-radius: 0px 0px 10px 10px"
      class="justify-end py-4 pr-12 mt-12"
    >
      <v-btn
        rounded
        color="accent_light"
        class="mb-2 mt-4 btn--plain capital--btn"
        text
        @click="goBack"
      >
        Go Back
      </v-btn>
      <v-btn
        rounded
        color="accent_light"
        class="px-8 mb-2 mt-4 white--text capital--btn"
        depressed
        @click="next"
      >
        Next
      </v-btn>
    </v-card-actions>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import viewSupport from "@/mixins/view-support";

export default {
  name: "BackgroundInfo",
  mixins: [viewSupport],
  computed: {
    ...mapGetters({
      currentCase: "eviction/currentCase",
    }),
  },
  mounted() {
    window.scrollTo(0, 0);
    if (!this.$auth.isAuthenticated) return;
    // this.$store.commit("eviction/init_wor_steps");
  },
  methods: {
    next() {
      this.$router.push({ name: "wor-update-filing-info" });
    },
    goBack() {
      this.$router.push({ name: "wor-court-outcome" });
    },
  },
};
</script>

<style>
.btn-sign {
  background: #ffffff 0% 0% no-repeat padding-box;
  box-shadow: 0px 3px 6px #00000029;
  border-radius: 23px;
  opacity: 1;
}
</style>
