<template>
  <div class="mb-10 d-flex">
    <div
      class="case-nav mr-10 d-flex align-center"
      :class="{ active: value === 0 }"
      @click="$router.push(`/case-view/${$route.params.id}/overview`)"
    >
      <i
        class="icofont-search-folder secondary--text mr-4"
        style="font-size: 1.5rem"
      />
      <span class="overline font-weight-medium secondary--text">OVERVIEW</span>
    </div>

    <div
      class="case-nav mr-10 d-flex align-center"
      :class="{ active: value === 1 }"
      @click="$router.push(`/case-view/${$route.params.id}/uploads`)"
    >
      <i
        class="icofont-copy-invert secondary--text mr-4"
        style="font-size: 1.5rem"
      />
      <span class="overline font-weight-medium secondary--text">UPLOADS</span>
    </div>

    <div
      class="case-nav d-flex align-center"
      :class="{ active: value === 2 }"
      @click="$router.push(`/case-view/${$route.params.id}/pleadings`)"
    >
      <i class="icofont-gavel secondary--text mr-4" style="font-size: 1.5rem" />
      <span class="overline font-weight-medium secondary--text">PLEADINGS</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "NavBottom",
  props: {
    value: {
      type: Number,
      default: 0,
    },
  },
};
</script>

<style>
.case-nav {
  padding: 2px 0;
  cursor: pointer;
}

.case-nav span {
  padding: 3px 0;
}

.case-nav:hover span {
  border-bottom: 3px solid #4dccc4;
  padding: 3px 0 0;
}

.case-nav.active span {
  border-bottom: 3px solid #4dccc4;
  padding: 3px 0 0;
}
</style>
