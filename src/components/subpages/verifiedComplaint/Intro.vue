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
      <div class="custom-title pt-8 pb-4">Let's start with your property.</div>
      <div class="pb-12">
        We’ll need some basic information about the property to get started.
        This includes address, owner information, and registration status.
        Ready?
      </div>

      <div
        v-for="btn in btns"
        :key="btn.text"
        class="d-flex align-center justify-center my-6"
        :class="[selected === btn.text ? 'selection-selected' : 'selection']"
        style="width: 100%"
        @click="typeClicked(btn)"
      >
        <span class="font-weight-medium" style="letter-spacing: 1.68px">{{
          btn.text.toUpperCase()
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
        @click="cancel"
      >
        cancel
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
export default {
  name: "ChargeTypes",
  data() {
    return {
      selected: "",
      btns: [
        {
          text: "Select existing Property",
          route: { name: `vc-select-property` },
        },
        {
          text: "Add unit to existing Property",
          route: { name: `vc-select-property`, query: { addUnit: true } },
        },
        {
          text: "Add new Property",
          route: { name: `vc-property-type` },
        },
      ],
    };
  },
  computed: {
    ...mapGetters({
      currentProperty: "property/currentProperty",
      caseSteps: "eviction/caseSteps",
    }),
    valid() {
      return this.selected;
    },
  },
  activated() {
    window.scrollTo(0, 0);
  },
  methods: {
    next() {
      // this.$emit("update", {
      //   data: { createPropertyType: this.selected.text },
      //   steps: { property: "completed" },
      // });
      if (this.selected.text === "Add new Property") {
        this.$store.commit("property/init_property");
        const a = this.caseSteps;
        a.property.showChildren = true;
        a.property.children.type.status = "completed";
        this.$store.commit("eviction/update_steps", a);
      }

      this.$router.push(this.selected.route);
    },
    cancel() {
      this.$router.push("/");
    },
    typeClicked(item) {
      //   if(!this.charges.includes(item)){
      //     this.charges.push(item)
      //   }
      //   else{
      //       this.charges = this.charges.filter(i => i !== item)
      //   }
      this.selected = item;
      this.next();
    },
  },
};
</script>

<style></style>
