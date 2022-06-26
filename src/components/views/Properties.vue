<template>
  <div class="px-12 py-4 mx-4">
    <div class="d-flex align-center justify-space-between my-12">
      <div class="secondary--text custom-heading mr-12">Properties</div>
      <div class="table-custom-search">
        <i class="icofont-search-1" />
        <input v-model="search" type="text" placeholder="Search Properties" />
      </div>
    </div>

    <PropertyTable
      :items="properties"
      :search="search"
      :loading="loading && isAuthenticated"
    />
  </div>
</template>

<script>
// import PropertyTable from '../tables/PropertyTable2.vue'
import PropertyTable from "../tables/PropertyTable.vue";
import { mapGetters } from "vuex";

export default {
  name: "Properties",
  components: {
    PropertyTable,
  },
  data() {
    return {
      search: "",
    };
  },
  computed: {
    ...mapGetters({
      properties: "property/properties",
      loading: "property/loading",
      isAuthenticated: "isAuthenticated",
    }),
    client() {
      return this.$store.getters.client;
    },
  },
  mounted() {
    this.$store.dispatch("property/loadProperties");
  },
  methods: {
    addNew() {
      this.$router.push("/properties/new");
    },
    addUnit() {
      this.$router.push({
        name: `vc-select-property`,
        query: { addUnit: true, standalone: true },
      });
    },
  },
};
</script>

<style></style>
