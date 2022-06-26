<template>
  <div class="mx-8 secondary--text">
    <div
      class="text-uppercase info--text py-2 px-6"
      style="
        font-size: 0.8rem;
        font-weight: 600;
        border-bottom: 2px solid #4dccc4;
        display: inline-block;
      "
    >
      Certification by Landlord
    </div>
    <div class="headline font-weight-medium pt-10 pb-4">Have a look!</div>
    <div class="pb-4" style="font-size: 0.9rem">
      We’ve pulled together all of the information you have provided us with.
      Preview the
      <span class="font-weight-medium">Certification by Landlord</span> and
      confirm all is correct. If everything looks good, click “sign” to execute
      the form.
    </div>

    <div class="py-4">
      <v-btn
        rounded
        color="primary"
        small
        dark
        class="px-9"
        depressed
        @click="
          () => {
            legalFeesPermitted = 'no';
            next();
          }
        "
      >
        preview
      </v-btn>
      <v-btn
        rounded
        color="accent"
        small
        dark
        class="px-12 ml-4"
        depressed
        @click="sign = true"
      >
        sign
      </v-btn>
    </div>

    <div v-if="sign">
      <VueSignaturePad
        ref="signaturePad"
        width="100%"
        height="200px"
        class="signature-pad mx-auto mt-6"
      />
      <div style="margin-top: -40px" class="float-right">
        <v-btn text class="btn--plain" color="#8BA4B4" @click="clear">
          Clear
        </v-btn>
        <v-btn text class="btn--plain" color="#8BA4B4" @click="undo">
          Undo
        </v-btn>
      </div>
      <div
        v-if="service !== 'Complete'"
        style="font-size: 0.9rem; width: 90%"
        class="mt-4 text-left mx-auto"
      >
        <span class="font-weight-medium">Heads up:</span> You may move on to the
        next screen if you prefer to provide an original signature.
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "PreviewSign",
  props: {
    service: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      sign: false,
    };
  },
  computed: {
    // finalTotal(){
    //   return this.categories.reduce((total,category) =>{
    //     return total += parseFloat(this.total(category.costs))
    //   },0).toFixed(2)
    // }
  },
  mounted() {
    window.scrollTo(0, 0);
  },
  methods: {
    undo() {
      this.$refs.signaturePad.undoSignature();
    },
    clear() {
      this.$refs.signaturePad.clearSignature();
    },
    save() {
      const { isEmpty, data } = this.$refs.signaturePad.saveSignature();
      console.log(isEmpty);
      console.log(data);
    },
    next() {
      this.$emit("update:data", {
        legalFeesPermitted: this.legalFeesPermitted,
        legalFees: this.legalFees,
      });
      this.$emit("next");
    },
    // total(items){
    //   return items.reduce((total, item)=>{
    //     return total += parseFloat(item.cost)
    //   }, 0).toFixed(2)
    // },
  },
};
</script>

<style></style>
