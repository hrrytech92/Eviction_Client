<template>
  <v-card class="pa-6 secondary--text">
    <v-card-title class="my-2 headline secondary--text font-weight-medium">
      terms of attorney-client relationship
    </v-card-title>
    <v-card-subtitle class="font-weight-medium overline info--text">
      LAST UPDATED ON AUGUST 1, 2020
    </v-card-subtitle>
    <v-card-text style="height: 50vh">
      <vue-scroll :ops="ops">
        <div class="pr-6">
          Sed ut perspiciatis unde omnis iste natus error sit voluptatem
          accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae
          ab illo inventore veritatis et quasi architecto beatae vitae dicta
          sunt explicabo. Sed ut perspiciatis unde omnis iste natus error sit
          voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque
          ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae
          dicta sunt explicabo. Sed ut perspiciatis unde omnis iste natus error
          sit voluptatem accusantium doloremque laudantium, totam rem aperiam,
          eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae
          vitae dicta sunt explicabo. Sed ut perspiciatis unde omnis iste natus
          error sit voluptatem accusantium doloremque laudantium, totam rem
          aperiam, eaque ipsa quae ab illo inventore veritatis et quasi
          architecto beatae vitae dicta sunt explicabo. Sed ut perspiciatis unde
          omnis iste natus error sit voluptatem accusantium doloremque
          laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore
          veritatis et quasi architecto beatae vitae dicta sunt explicabo. Sed
          ut perspiciatis unde omnis iste natus error sit voluptatem accusantium
          doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo
          inventore veritatis et quasi architecto beatae vitae dicta sunt
          explicabo. Sed ut perspiciatis unde omnis iste natus error sit
          voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque
          ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae
          dicta sunt explicabo. Sed ut perspiciatis unde omnis iste natus error
          sit voluptatem accusantium doloremque laudantium, totam rem aperiam,
          eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae
          vitae dicta sunt explicabo.
        </div>
      </vue-scroll>
    </v-card-text>
    <v-card-actions class="justify-center">
      <v-btn
        rounded
        color="primary"
        dark
        class="mr-4 accept--btn"
        :small="$mq | mq({ mobile: true, tablet: false })"
        outlined
        depressed
        @click="$emit('close-dialog')"
      >
        decline
      </v-btn>
      <v-btn
        rounded
        color="primary"
        dark
        class="mr-4 accept--btn"
        :small="$mq | mq({ mobile: true, tablet: false })"
        depressed
        @click="$emit('accept')"
      >
        accept
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: "TermsDialog",
  data() {
    return {
      ops: {
        vuescroll: {},
        scrollPanel: {},
        rail: {
          background: "#EAEBEB",
          opacity: 1,
          size: "5px",
          specifyBorderRadius: false,
          gutterOfEnds: null,
          gutterOfSide: "0px",
        },
        bar: {
          onlyShowBarOnScroll: false,
          keepShow: true,
          background: "#4DCCC4",
          opacity: 1,
          size: "6px",
        },
      },
    };
  },
};
</script>

<style>
@media only screen and (min-width: 450px) {
  .accept--btn {
    padding: 0px 48px !important;
  }
}

@media only screen and (max-width: 450px) {
  .accept--btn {
    padding: 0px 24px !important;
  }
}
</style>
