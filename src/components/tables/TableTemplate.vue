<template>
  <v-card :tile="!rounded" :class="{ 'rounded-card': rounded }">
    <!-- <v-card-title class='secondary--text font-weight-bold d-flex flex-column align-start pl-12'> -->
    <!-- <div>{{title}}</div> -->
    <!-- <filter-area :button="filterAreaButton" :add-type="addType" @change:filters="changeFilters"/> -->
    <!-- </v-card-title> -->

    <slot name="data" :tableFilters="tableFilters" />
  </v-card>
</template>

<script>
export default {
  name: "TableTemplate",
  components: {},
  props: {
    title: {
      type: String,
      default: "",
    },
    rounded: {
      type: Boolean,
      default: false,
    },
    filterAreaButton: {
      type: String,
      default: "",
    },
    addType: {
      type: String,
      default: "",
    },
    tabs: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      tableFilters: {},
    };
  },
  methods: {
    changeFilters(filters) {
      this.tableFilters = filters;
    },
  },
};
</script>

<style>
/* thead.v-data-table-header {
    background-color: #4DCCC4;
} */
.header-text {
  font: Demi 18px/21px Futura PT;
  letter-spacing: 1.26px;
  color: #ffffff;
  text-transform: uppercase;
  opacity: 1;
  white-space: nowrap;
}
tr {
  color: #003a60;
}
.lighter-blue {
  color: #006e90;
}
</style>
