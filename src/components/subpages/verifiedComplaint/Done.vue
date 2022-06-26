<template>
  <div class="mx-8 secondary--text">
    <i class="icofont-check-circled icofont-2x primary--text pt-8 pb-2" />
    <div class="headline font-weight-medium pb-4">All Done!</div>
    <div class="pb-4" style="font-size: 0.8rem">
      This is all of the information we need for now. Be sure to review your
      form carefully before submitting.
    </div>

    <v-card-actions class="justify-center">
      <v-btn
        rounded
        color="info"
        class="px-10 mb-6 mt-4"
        outlined
        small
        depressed
        @click="$emit('back')"
      >
        Back
      </v-btn>
      <v-btn
        rounded
        color="primary"
        class="px-8 mb-6 mt-4"
        small
        depressed
        @click="$emit('preview')"
      >
        preview
      </v-btn>
      <v-btn
        rounded
        color="accent"
        class="px-9 mb-6 mt-4"
        small
        depressed
        @click="$emit('submit')"
      >
        submit
      </v-btn>
      <v-btn
        rounded
        color="accent"
        class="px-9 mb-6 mt-4"
        small
        depressed
        @click="$emit('submit:summons')"
      >
        download summons
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
  data() {
    return {};
  },
  computed: {},
  created() {},
  methods: {},
};
</script>

<style></style>
