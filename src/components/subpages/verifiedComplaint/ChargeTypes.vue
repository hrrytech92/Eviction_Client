<template>
  <div class="mx-auto secondary--text">
    <v-btn
      color="info"
      icon
      class="float-right ma-8 btn--plain"
      @click="$emit('close:form')"
    >
      <v-icon>mdi-close</v-icon>
    </v-btn>
    <div style="width: 80%" class="pt-10 pb-4 mx-auto text-left">
      <div class="custom-title pt-8 pb-4">Select Type of Charge</div>
      <div class="pb-4">
        Select all of the types of charges you would like to add. We’ll take
        care of Legal Fees, if applicable, later.
      </div>

      <div
        v-for="btn in btns"
        :key="btn"
        class="d-flex align-center justify-center my-6"
        :class="[charges.includes(btn) ? 'selection-selected' : 'selection']"
        style="width: 100%"
        @click="typeClicked(btn)"
      >
        <span class="font-weight-medium" style="letter-spacing: 1.68px">{{
          btn.toUpperCase()
        }}</span>
      </div>
    </div>
    <v-card-actions
      style="background-color: #fafbfc; border-radius: 0px 0px 10px 10px"
      class="justify-end py-4 pr-12 mt-12"
    >
      <v-btn
        rounded
        color="accent_light"
        class="mb-2 mt-4 btn--plain capital--btn"
        text
        @click="$emit('back')"
      >
        go back
      </v-btn>
      <v-btn
        rounded
        color="accent_light"
        class="px-8 mb-2 mt-4 white--text capital--btn"
        depressed
        :disabled="!valid"
        @click="next"
      >
        continue
      </v-btn>
    </v-card-actions>
  </div>
</template>

<script>
export default {
  name: "ChargeTypes",
  data() {
    return {
      charges: [],
      btns: ["late charges", "utilities", "fees", "other"],
    };
  },
  computed: {
    valid() {
      return this.charges.length > 0;
    },
  },
  methods: {
    next() {
      this.$router.push({
        name: "vc-additional-charges-extended",
        params: { charges: JSON.stringify(this.btns) },
      });
    },
    typeClicked(item) {
      if (!this.charges.includes(item)) {
        this.charges.push(item);
      } else {
        this.charges = this.charges.filter((i) => i !== item);
      }
    },
  },
};
</script>

<style></style>
