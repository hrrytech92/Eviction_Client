<template>
  <div>
    <v-btn
      rounded
      color="accent_light"
      class="mb-2 mt-4 btn--plain capital--btn"
      text
      @click="cancelFunction"
    >
      {{ cancelBtnText }}
    </v-btn>
    <v-btn
      rounded
      color="accent_light"
      class="px-8 mb-2 mt-4 white--text capital--btn"
      depressed
      @click="saveFunction"
    >
      {{ saveBtnText }}
    </v-btn>
  </div>
</template>

<script>
export default {
  name: "CardActions",
  props: {
    cancelBtnText: {
      type: String,
      default: "Cancel",
    },
    saveBtnText: {
      type: String,
      default: "Save",
    },
    cancelFunction: {
      type: Function,
      default: () => {},
    },
    saveFunction: {
      type: Function,
      default: () => {},
    },
  },
  //   mounted() {
  //     console.log("CardActions mounted");
  //     console.log("cancelBtnText:", this.cancelBtnText);
  //   },
};
</script>

<style scoped>
div {
  position: absolute;
  width: 100%;
  bottom: 0;
  background: #fafbfc;
  /* background: #c0cbd6; */
  padding: 20px;
  padding-right: 48px;
  padding-top: 16px;
  padding-bottom: 16px;
  display: flex;
  justify-content: flex-end;
  z-index: 15;
}
</style>
