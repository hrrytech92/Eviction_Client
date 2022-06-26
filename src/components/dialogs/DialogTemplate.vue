<template>
  <!-- you will need to put a dialog: false in data of parent container and a trigger -->
  <v-card class="">
    <v-btn color="info" icon class="float-right pa-6 btn--plain" @click="close">
      <v-icon>mdi-close</v-icon>
    </v-btn>
    <div class="">
      <v-card-title class="pt-12 display-1 secondary--text font-weight-medium">
        {{ title }}
      </v-card-title>
      <v-card-subtitle v-if="subtitleWithNote">
        <span class="font-weight-medium">Note:</span> {{ subtitleWithNote }}
      </v-card-subtitle>
      <v-card-subtitle v-if="subtitle" class="py-4 secondary--text">
        {{ subtitle }}
      </v-card-subtitle>
      <v-divider v-if="divider" class="mx-4 mb-6" />
      <!-- <v-card-text> -->
      <slot />
      <!-- </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            color="accent_light"
            text
            @click="close"
            class="btn--plain"
          >
            cancel
          </v-btn>

          <v-btn small rounded color="accent_light" dark class="px-8" depressed @click="submit()">{{submitText}}</v-btn>
        </v-card-actions> -->
    </div>
  </v-card>
</template>

<script>
export default {
  name: "DialogTemplate",
  props: {
    submitText: {
      type: String,
      default: "",
    },
    title: {
      type: String,
      default: "",
    },
    subtitle: {
      type: String,
      default: "",
    },
    divider: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    changeDialog() {},
    close() {
      this.$emit("close");
    },
  },
};
</script>

<style></style>
