<template>
  <v-btn
    v-if="actionRouteName"
    color="accent_light"
    class="px-10 white--text"
    rounded
    depressed
    @click="handleClick"
  >
    next step
  </v-btn>
  <v-btn
    v-else
    color="accent_light"
    class="px-10 white--text"
    rounded
    depressed
    disabled
  >
    pending
  </v-btn>
</template>
<script>
export default {
  name: "EvictionTableNextStepBtn",
  props: {
    caseData: {
      type: Object,
      required: true,
    },
    actionRouteName: {
      type: String,
      required: true,
    },
  },
  data() {
    return {};
  },
  computed: {},
  // created() {
  //   console.log(
  //     "actionRouteName - case:" + this.caseData.id,
  //     this.actionRouteName
  //   );
  // },
  methods: {
    async handleClick() {
      if (!this.actionRouteName)
        return console.error("actionRouteName is required");

      const caseId = this.caseData.id;
      await this.$store.dispatch("eviction/loadCase", {
        caseId,
        logMessage: "EvictionTableNextStepBtn.vue at line 54",
        forceLoad: true,
      });
      return this.$router.push({
        name: this.actionRouteName,
        params: { id: caseId },
      });
    },
  },
};
</script>
<style></style>
