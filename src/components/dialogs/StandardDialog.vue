<template>
  <!-- style="height: 90vh" -->
  <v-card
    class="secondary--text"
    :style="{ height: customHeight }"
    @close:dialog="cancelFunction"
  >
    <div class="close-btn">
      <v-btn color="info" icon @click="onCancel">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </div>
    <vue-scroll :ops="ops" ref="scrollRef">
      <!-- <div class="px-8 pt-10 pb-4 mx-auto text-left" style="width: 70%"> -->
      <div
        class="px-8 pt-10 pb-4 mx-auto text-left"
        :style="{ width: contentWidth }"
        style="margin-bottom: 140px"
      >
        <div class="custom-title py-8">{{ title }}</div>
        <slot></slot>
      </div>
    </vue-scroll>

    <CardActions
      :cancelBtnText="cancelBtnText"
      :saveBtnText="saveBtnText"
      :cancelFunction="onCancel"
      :saveFunction="onSave"
    />
  </v-card>
</template>

<script>
import CardActions from "../CardActions.vue";

export default {
  name: "StandardDialog",
  components: { CardActions },
  props: {
    title: {
      type: String,
      default: "",
    },
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
    contentWidth: {
      type: String,
      default: "80%",
    },
    customHeight: {
      type: String,
      default: "90vh",
    },
  },
  data() {
    return {
      ops: {
        vuescroll: {},
        scrollPanel: {},
        rail: {
          // background: '#EAEBEB',
          opacity: 0,
          size: "10px",
          specifyBorderRadius: false,
          gutterOfEnds: "85px",
          gutterOfSide: "0px",
        },
        bar: {
          onlyShowBarOnScroll: false,
          keepShow: true,
          background: "#4DCCC4",
          opacity: 1,
          size: "10px",
        },
      },
    };
  },
  methods: {
    onCancel() {
      this.cancelFunction();
      this.$refs.scrollRef.scrollTo({ x: 0, y: 0 }, 0);
    },
    onSave() {
      this.saveFunction();
      this.$refs.scrollRef.scrollTo({ x: 0, y: 0 }, 0);
    },
  },
};
</script>

<style scoped>
.__vuescroll >>> .__panel {
  overscroll-behavior: contain;
}

.close-btn {
  position: absolute;
  top: 25px;
  right: 25px;
  z-index: 1;
}
</style>
