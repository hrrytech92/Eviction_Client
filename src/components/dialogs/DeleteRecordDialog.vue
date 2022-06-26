<template>
  <v-card
    class="d-flex flex-column secondary--text justify-center"
    min-height="550"
  >
    <div
      class="pa-10 d-flex flex-column align-center"
      style="min-height: 500px"
    >
      <i :class="`icofont-exclamation-circle icofont-6x accent--text`" />

      <div
        class="mb-4 custom-title secondary--text font-weight-medium text-center"
      >
        Delete this record?
      </div>
      <div class="text-center">This process can not be undone.</div>
    </div>
    <div>
      <v-btn
        depressed
        tile
        style="width: 50%"
        class="white--text text-center pa-8 font-weight-medium mt-auto capital--btn accent_light"
        @click="$emit('close')"
      >
        <span class="" style="font-weight: 600 !important">NO, CANCEL</span>
      </v-btn>
      <v-btn
        depressed
        tile
        style="width: 50%"
        class="white--text text-center pa-8 font-weight-medium mt-auto capital--btn accent"
        @click="$emit('submit')"
      >
        <span class="" style="font-weight: 600 !important">YES, DELETE</span>
      </v-btn>
    </div>
  </v-card>
</template>

<script>
export default {
  name: "DeleteRecordDialog",
  components: {},
  props: {},
  data() {
    return {};
  },
  methods: {
    close() {
      this.$emit("close:dialog");
    },
  },
};
</script>

<style></style>
