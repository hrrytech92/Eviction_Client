<template>
  <div class="mx-8 secondary--text">
    <i class="icofont-check-circled icofont-2x primary--text pt-8 pb-2" />
    <div class="headline font-weight-medium pb-4">All Done!</div>
    <div v-if="service === 'Complete'" class="pb-4" style="font-size: 0.9rem">
      This is all of the information we need for now. Once you click “submit,”
      your attorney will receive a copy of the
      <span class="font-weight-medium font-italic"
        >Certification by Landlord</span
      >
      and review the
      <span class="font-weight-medium font-italic">Pre-Court Assessment</span>.
    </div>
    <div v-else class="pb-4" style="font-size: 0.9rem">
      This is all of the information we need for now. Click “submit” and print
      the
      <span class="font-weight-medium font-italic"
        >Certification by Landlord</span
      >. Be sure to file this document with the court.
    </div>

    <v-card-actions class="justify-center">
      <v-btn
        rounded
        color="accent"
        class="px-10 mb-6 mt-4"
        small
        depressed
        @click="$emit('submit')"
      >
        submit
      </v-btn>
    </v-card-actions>
  </div>
</template>

<script>
export default {
  name: "Done",
  components: {
    // VDaterange
    // VSignaturePad
  },
  props: {
    service: {
      type: String,
      default: "",
    },
  },
  data() {
    return {};
  },
  computed: {},
  created() {},
  methods: {},
};
</script>

<style></style>
