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
      <div class="custom-title pt-8 pb-4">Additional Charges</div>
      <div v-if="this.case.section8">
        <p class="pb-4">
          According to your previous selection, the tenant is enrolled in the
          Section 8 Voucher program. There may be limitations to the additional
          charges you may claim in this suit. For more information, see
          <a
            href="https://codes.findlaw.com/us/title-42-the-public-health-and-welfare/42-usc-sect-1437a.html"
            target="_blank"
            style="color: #6a7fdb; display: inline"
          >
            42 U.S.C.A. § 1437a(a)(1);
          </a>
          and the
          <a
            href="https://caselaw.findlaw.com/nj-supreme-court/1488547.html"
            target="_blank"
            style="color: #6a7fdb; display: inline"
          >
            Brooke Amendment Restoration Act.
          </a>
        </p>
      </div>
      <div v-else>
        <p class="pb-4">
          Depending on the terms of your lease or rental agreement, you may
          pursue the non-payment of other charges. Review the terms and verify
          if it specifies other charges (ex: utilities, late fees, etc.) as
          “additional rent.” For more information, see
          <a
            href="https://www.njcourts.gov/notices/2021/n210715b.pdf"
            target="_blank"
            style="color: #6a7fdb; display: inline"
          >
            <span>njcourts.gov/notices/2021/n210715b.pdf.</span>
          </a>
        </p>
      </div>
      <div class="pb-4 font-weight-medium">
        Would you like to add utilities and/or additional fees?
      </div>
      <div class="py-4">
        <v-btn
          rounded
          :color="additionalCharges === false ? 'primary' : 'info_light'"
          dark
          class="px-12 capital--btn"
          :class="{ 'secondary--text': additionalCharges !== false }"
          depressed
          @click="optionClicked(false)"
        >
          no
        </v-btn>
        <v-btn
          rounded
          :color="additionalCharges ? 'primary' : 'info_light'"
          dark
          class="px-12 ml-4 capital--btn"
          :class="{ 'secondary--text': additionalCharges !== true }"
          depressed
          @click="optionClicked(true)"
        >
          yes
        </v-btn>
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
        @click="$router.push({ name: 'vc-past-due-rent' })"
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
import { mapGetters } from "vuex";
// import DateRange from "@/components/DateRange";
export default {
  name: "AdditionalCharges",
  components: {
    // VDaterange
    // DateRange,
  },
  props: {},
  data() {
    return {
      additionalCharges: null,
      useNext: false,
    };
  },
  computed: {
    ...mapGetters({
      case: "eviction/currentCase",
    }),
    valid() {
      return this.additionalCharges !== null;
    },
  },
  activated() {
    window.scrollTo(0, 0);
    this.useNext = false;

    this.additionalCharges = this.case.additionalChargesPermitted ?? null; //for guest;
  },
  deactivated() {
    this.saveData();
  },
  methods: {
    async saveData() {
      // if (this.useNext) return;
      if (!this.valid) return;
      this.$store.dispatch("eviction/updateCase", {
        caseData: {
          additionalChargesPermitted: this.additionalCharges,
        },
        submitted: false,
        // lastStep: this.additionalCharges
        //   ? "Additional Charges"
        //   : this.case.section8
        //   ? "Confirmation"
        //   : "Legal Fees",
        status: "additionalCharges",
      });
    },
    next() {
      const nextPathName = this.additionalCharges
        ? "vc-additional-charges-extended"
        : this.case.section8
        ? "vc-confirmation"
        : "vc-legal-fees";

      this.$router.push({ name: nextPathName });
    },
    optionClicked(bool) {
      this.additionalCharges = bool;
      this.next();
    },
  },
};
</script>

<style></style>
