<template>
  <div class="py-5">
    <v-btn
      rounded
      :color="cbValue === false ? 'primary' : 'info_light'"
      dark
      class="px-12 capital--btn"
      :class="{ 'secondary--text': cbValue !== false }"
      depressed
      @click="optionClicked(false)"
    >
      no
    </v-btn>
    <v-btn
      rounded
      :color="cbValue ? 'primary' : 'info_light'"
      dark
      class="px-12 ml-4 capital--btn"
      :class="{ 'secondary--text': cbValue !== true }"
      depressed
      @click="optionClicked(true)"
    >
      yes
    </v-btn>

    <div v-if="required" class="error--text mt-2">Required</div>
  </div>
</template>

<script>
export default {
  name: "ConfirmButton",
  props: {
    required: {
      type: Boolean,
      default: false,
    },
    cbValue: {
      type: Boolean,
      default: null,
    },
  },
  methods: {
    optionClicked(bool) {
      this.$emit("optionClicked", bool);
    },
  },
};
</script>

<style scoped></style>
