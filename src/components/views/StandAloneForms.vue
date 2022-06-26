<template>
  <div style="padding: 0 30px; max-width: 1200px; margin: 0 auto">
    <v-row align="center" justify="center">
      <v-col cols="8" class="pr-8">
        <v-card class="my-12 text-center" style="border-radius: 10px">
          <keep-alive>
            <router-view />
          </keep-alive>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog v-model="cancelDialog" persistent value="''" max-width="600">
      <CancelDialog @close="cancelDialog = false" @submit="cancelForm" />
    </v-dialog>

    <StickyBottomBar
      v-if="typeof $router.currentRoute.meta.withStickyBar === 'undefined'"
    >
      <v-container fluid ma-0 pa-0 fill-height>
        <v-row align="center" justify="center" class="h-full">
          <v-col cols="7">
            <v-progress-linear
              color="#4DCCC4"
              background-color="#F0F5F6"
              :value="$store.state.global.standAloneFormsProgressValue"
              height="9"
              rounded
            />
          </v-col>
        </v-row>
      </v-container>
    </StickyBottomBar>
  </div>
</template>

<script>
import CancelDialog from "@components/dialogs/CancelDialog";
import StickyBottomBar from "@components/StickyBottomBar";

export default {
  name: "StandAloneForms",
  components: { StickyBottomBar, CancelDialog },
  data: () => ({
    cancelDialog: false,
  }),
  async mounted() {
    this.$bus.on("open-cancel-dialog-verified-complaint", () => {
      this.cancelDialog = true;
    });

    // const {
    //   params: { id: caseId },
    // } = this.$route;

    // await this.$store.dispatch("eviction/loadCase", {
    //   caseId,
    //   logMessage: "StandAloneForm.vue at line 58",
    // });
  },
  methods: {
    cancelForm() {
      this.cancelDialog = false;
      this.$router.push("/");
    },
  },
};
</script>

<style scoped></style>
