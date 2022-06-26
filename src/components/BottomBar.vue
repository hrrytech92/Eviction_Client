<template>
  <v-sheet height="55px" class="bottom-bar">
    <v-container fluid py-0>
      <v-row align="center">
        <v-col cols="1">
          <v-btn color="accent" text> cancel </v-btn>
        </v-col>
        <v-col cols="2" />
        <v-col cols="6">
          <v-progress-linear
            color="primary"
            background-color="info"
            :value="progress"
            height="6"
            rounded
          />
        </v-col>
        <v-col cols="3" class="d-flex justify-center">
          <v-btn
            rounded
            color="accent"
            class="px-8 mr-6"
            outlined
            small
            depressed
            @click="$emit('preview')"
          >
            preview
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-sheet>
</template>

<script>
export default {
  name: "BottomBar",
  props: {
    progress: {
      type: Number,
      default: 0,
    },
  },
};
</script>

<style>
.bottom-bar {
  background-color: white;
  overflow: hidden;
  position: fixed;
  bottom: 0;
  width: 100%;
  z-index: 10;
}
</style>
