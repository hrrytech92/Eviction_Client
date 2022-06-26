<template>
  <StandardDialog
    title="Add Payments"
    cancelBtnText="go back"
    saveBtnText="add"
    :cancelFunction="close"
    :saveFunction="complete"
    contentWidth="70%"
    customHeight="70vh"
  >
    <div class="utilities-dialog">
      <v-form
        ref="formRange"
        v-model="formValid"
        class="utilities-dialog__form px-8 pt-10 pb-4 mx-auto text-left"
      >
        <div class="font-weight-medium secondary--text pb-2">Amount paid</div>
        <v-text-field
          v-model="amount"
          rounded
          type="number"
          solo
          flat
          dense
          background-color="#F0F5F6"
        >
          <div slot="prepend-inner">$</div>
        </v-text-field>

        <div class="font-weight-medium secondary--text pb-2">Date paid</div>
        <v-menu
          v-model="payDateMenu"
          :close-on-content-click="false"
          :nudge-right="40"
          transition="scale-transition"
          offset-y
          min-width="290px"
        >
          <template v-slot:activator="{ on }">
            <v-text-field
              v-model="payDate"
              append-icon="$calendar"
              color="accent"
              readonly
              rounded
              solo
              flat
              dense
              background-color="#F0F5F6"
              v-on="on"
              @click:append="payDateMenu = true"
              :rules="[(v) => !!v || 'Item is required']"
            />
          </template>
          <v-date-picker
            v-model="selectedPayDate"
            no-title
            :show-current="false"
            color="primary"
            class="custom-date"
            @input="closedPayDateMenu"
          />
        </v-menu>

      </v-form>

      <v-alert
        v-if="showWarn"
        dense
        outlined
        type="error"
        class="pb-4"
      >
        You should not accept any partial payments after receipt of Judgment,
        as it may be deemed by the court a relinquishment of the Judgment.
      </v-alert>
    </div>
  </StandardDialog>
</template>

<script>
import StandardDialog from "./StandardDialog.vue";
import { mapGetters } from "vuex";

export default {
  name: "AddPayDialog",
  components: {
    StandardDialog,
  },
  data() {
    return {
      amount: "",
      formValid: true,
      payDate: null,
      selectedPayDate: null,
      payDateMenu: false,
      showWarn: false,
    };
  },
  computed: {
    ...mapGetters({
      case: "eviction/currentCase",
    }),
  },
  methods: {
    initialization() {
      this.amount = "";
      this.payDate = " ";
      this.selectedPayDate = null;
      this.showWarn = false;
    },
    close() {
      this.$emit("close:dialog");
      this.initialization();
    },
    complete() {
      if (!this.showWarn) {
        const payment = {
          amount: this.amount,
          payDate: this.selectedPayDate,
        };
        this.$emit("add", payment);
        this.initialization();
        // this.close();
      }
    },
    closedPayDateMenu(data) {
      this.selectedPayDate = data;
      this.payDate = this.$dayjs(data).format("MMMM DD, YYYY");
      this.payDateMenu = false;
      if (data > this.case.trialDate) {
        this.showWarn = true;
      } else {
        this.showWarn = false;
      }
    },
  },
};
</script>

<style lang="scss">
.utilities-dialog {
  &__form {
    // width: 70%;

    &-add-action {
      margin-top: -20px;
    }

    &-divider {
      margin: 24px auto;
    }
  }
}
</style>
