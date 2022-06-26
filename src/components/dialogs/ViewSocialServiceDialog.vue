<template>
  <v-card
    class="secondary--text d-flex flex-column align-center"
    @close-dialog="close"
  >
    <v-btn
      color="info"
      icon
      class="align-self-end pa-6 btn--plain"
      @click="$emit('close:dialog')"
    >
      <v-icon>mdi-close</v-icon>
    </v-btn>
    <div class="d-flex flex-column align-center">
      <div class="headline font-weight-medium pt-4">
        Your Public Housing Office...
      </div>
      <div
        class="py-12 my-12"
        style="
          background-color: #fafbfc;
          border-radius: 10px;
          line-height: 1.7rem;
          width: 450px;
        "
      >
        <div style="width: 80%" class="mx-auto">
          <div
            class="font-weight-bold primary--text mb-2"
            style="font-size: 1.1rem"
          >
            {{ office.housingAuthority }}
          </div>
          <div>{{ office.address }}</div>
          <div>{{ office.address2 }}</div>
          <div>
            {{ office.city }},
            {{ office.state }}
            {{ office.zipcode }}
          </div>
          <div>
            <v-icon v-if="office.phone" color="primary" small>
              mdi-cellphone</v-icon
            >
            {{ office.phone }}
          </div>
          <div>
            <v-icon v-if="office.email" color="primary" small> $email </v-icon>
            {{ office.email }}
          </div>
          <div class="font-italic pt-10" style="font-size: 0.9rem">
            Address to:
          </div>
          <div>{{ office.to }}</div>
        </div>
      </div>
    </div>
  </v-card>
</template>

<script>
export default {
  name: "VerifySocialServicesDialog",
  props: {
    office: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {};
  },
  methods: {
    close() {
      this.$emit("close-dialog");
    },
    verify() {
      this.$emit("close-dialog");
    },
  },
};
</script>

<style></style>
