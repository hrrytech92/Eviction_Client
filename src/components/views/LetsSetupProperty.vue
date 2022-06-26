<template>
  <div>
    <v-card
      class="pa-6 secondary--text mx-auto my-12 text-center"
      width="50%"
      tile
      style="font-size: 0.9rem"
    >
      <div class="d-flex flex-column align-center mx-auto" style="width: 80%">
        <div class="mb-1 display-1 secondary--text font-weight-medium mt-12">
          Let's set up your property.
        </div>
        <div class="secondary--text py-4">
          We’ll need some basic information about the property to get started.
          This includes address, owner information, and registration status.
          Ready?
        </div>
        <v-btn
          rounded
          color="accent"
          class="px-12 mx-auto my-10"
          small
          depressed
          @click="submit"
        >
          go
        </v-btn>
      </div>
    </v-card>
  </div>
</template>

<script>
export default {
  name: "LetsSetupProperty",
  data() {
    return {};
  },
  computed: {},
  methods: {
    submit() {
      this.$router.push("/properties/new");
    },
  },
};
</script>

<style></style>
