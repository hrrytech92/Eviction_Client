<template>
  <v-card class="py-6 px-6 secondary--text">
    <v-card-title class="py-6 display-1 secondary--text font-weight-medium">
      One Last Step...
    </v-card-title>
    <!-- <v-card-subtitle v-if="subtitle"><span class="font-weight-medium">Note:</span> {{subtitle}} </v-card-subtitle> -->
    <v-card-text>
      <div class="secondary--text font-weight-medium my-2 subtitle-1">
        Lease Provisions
      </div>
      <div class="secondary--text my-2 body-2">Confirm the following:</div>
      <div class="ml-4">
        <v-checkbox
          v-model="writtenLease"
          hide-details
          off-icon="mdi-checkbox-blank-circle-outline"
          on-icon="mdi-checkbox-blank-circle"
        >
          <div slot="label" class="secondary--text">
            You have a
            <span class="font-weight-medium">written lease</span> with the
            tenant.
          </div>
        </v-checkbox>

        <v-checkbox
          v-model="rightReentry"
          hide-details
          off-icon="mdi-checkbox-blank-circle-outline"
          on-icon="mdi-checkbox-blank-circle"
        >
          <div slot="label" class="secondary--text">
            There is a provision in your written lease that states you have “the
            <span class="font-weight-medium">right of re-entry</span>.”
          </div>
        </v-checkbox>
      </div>

      <div class="secondary--text font-weight-medium my-2 subtitle-1">
        {{ noticeReason }}
      </div>

      <div class="mt-4 pa-4" style="background-color: #fafbfc">
        <div class="secondary--text mb-2">
          According to the New Jersey Eviction Law, New Jersey Stat. Ann. § §
          2A:18-61.1(d) and (e) and New Jersey Stat. Ann. § 2A:18-61.2(b), in
          order to evict a tenant for violating the lease, you must:
        </div>
        <div class="secondary--text mb-2 d-flex">
          <div>{{ bullet }}</div>
          <div class="secondary--text ml-2">
            Serve a Notice to Cease notifying the Tenant;
          </div>
        </div>
        <div class="secondary--text mb-2 d-flex">
          <div>{{ bullet }}</div>
          <div class="secondary--text ml-2">
            If the Tenant continues to violate the terms of the
            <span class="font-weight-medium">Notice to Cease</span>, the
            landlord must serve the Tenant a
            <span class="font-weight-medium">Notice to Quit</span>, informing
            the Tenant that due to the lease violation, the rental agreement
            will be terminated within thirty (30) days and an eviction proceed
            will follow.
          </div>
        </div>
        <div class="secondary--text mb-2">
          An eviction process may be filed with the Court after the thirty (30)
          days after the
          <span class="font-weight-medium">Notice to Quit</span> has been served
          on the Tenant.
        </div>
      </div>
      <div class="secondary--text my-2 body-2">Confirm:</div>
      <div class="ml-4">
        <v-checkbox
          v-model="serveNotice"
          hide-details
          off-icon="mdi-checkbox-blank-circle-outline"
          on-icon="mdi-checkbox-blank-circle"
        >
          <div slot="label" class="secondary--text">
            I would like to serve a
            <span class="font-weight-medium">Notice to Cease</span> as the first
            step in the process.
          </div>
        </v-checkbox>

        <v-checkbox
          v-model="sendEmail"
          hide-details
          off-icon="mdi-checkbox-blank-circle-outline"
          on-icon="mdi-checkbox-blank-circle"
        >
          <div slot="label" class="secondary--text">
            I would like to receive an email reminder three (3) days after the
            Tenant has been served with a
            <span class="font-weight-medium">Notice to Cease</span> to file a
            <span class="font-weight-medium">Notice to Quit</span>, in the event
            the violation continues.
          </div>
        </v-checkbox>
      </div>
    </v-card-text>
    <v-card-actions>
      <v-spacer />

      <v-btn
        :disabled="!writtenLease || !rightReentry || !serveNotice"
        rounded
        color="accent"
        class="px-8"
        small
        depressed
        @click="submit"
      >
        Submit
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: "ConfirmationPopupNotice",
  props: {
    noticeReason: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      writtenLease: "",
      rightReentry: "",
      serveNotice: "",
      sendEmail: "",
      bullet: "\u2022",
    };
  },
  computed: {},
  methods: {
    sub() {
      // console.log('di', this.dialogAction)
    },
    submit() {},
  },
};
</script>

<style></style>
