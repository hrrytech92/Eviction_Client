<template>
  <div class="py-4 px-12 mx-4">
    <div class="d-flex align-center justify-space-between mt-6 mb-12">
      <div class="secondary--text custom-heading mr-12">
        Case File Pleadings
      </div>
      <div class="d-flex align-center">
        <i class="icofont-home icofont-2x mr-4" style="color: #c3d1d2" />
        <div class="spaced-text secondary--text" style="font-size: 1.2rem">
          {{ property.streetAddress.toUpperCase() }}
        </div>
      </div>
    </div>

    <SubTopNav :value="2" />
    <pleadings-table />
  </div>
</template>

<script>
import SubTopNav from "@/components/SubTopNav.vue";
import PleadingsTable from "../tables/PleadingsTable.vue";
export default {
  name: "CaseFilePleadings",
  components: {
    SubTopNav,
    PleadingsTable,
  },
  data() {
    return {
      btns: [
        {
          title: "ADD NEW",
          icon: "building-alt",
          onclick: () => this.$router.push("/properties/new"),
        },
        { title: "ADD UNIT", icon: "close-circled", onclick: "" },
      ],
    };
  },
  computed: {
    property() {
      return this.$store.getters["property/currentProperty"];
    },
  },
  async mounted() {
    window.scrollTo(0, 0);
    await this.$store.dispatch("eviction/loadCase", {
      caseId: this.$route.params.id,
      logMessage: "CaseFilePleadings.vue at line 50",
    });
  },
};
</script>

<style></style>
