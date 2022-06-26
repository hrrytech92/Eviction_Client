<template>
  <v-list class="py-0 side-list">
    <div v-for="item in caseSteps" :key="item.label">
      <v-list-item
        v-if="item.status !== 'hidden'"
        class="py-1 d-flex justify-space-between"
        :class="[
          item.status === 'completed'
            ? 'side-list-complete'
            : 'side-list-incomplete',
          $route.name === item.routeName ? 'item-selected' : '',
        ]"
        :style="item.hide ? 'display: none !important;' : ''"
        @click="goToCasePage(item.routeName)"
      >
        <div :class="textColor(item)">
          <v-icon :color="iconColor(item)" class="pr-2">
            mdi-{{
              item.status === "completed"
                ? "check-circle"
                : "checkbox-blank-circle-outline"
            }}
          </v-icon>
          {{ item.label }}
        </div>
      </v-list-item>
    </div>
  </v-list>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "WorSideList",
  computed: {
    ...mapGetters({
      currentCase: "eviction/currentCase",
      caseSteps: "eviction/worSteps",
    }),
    direction() {
      return (name) => (name ? "up" : "down");
    },
  },
  methods: {
    hasChildren(item) {
      return item.children;
    },
    textColor({ status, routeName }) {
      if (status === "completed" || routeName === this.$route.name)
        return "white--text";
      if (status === "disabled") return "info--text";
      return "secondary--text";
    },
    iconColor({ status, routeName }) {
      if (status === "completed" || routeName === this.$route.name)
        return "white";
      if (status === "disabled") return "info";
      return "primary";
    },
    goToCasePage(name) {
      const routeName = name;
      
      if (routeName === this.$route.name) return;
      const propParams = { id: this.currentCase.id || "new" };
      this.$router.push({
        name: routeName,
        params: propParams,
      });
    },
  },
};
</script>

<style>
.side-list {
  border-radius: 10px;
  min-width: 260px;
}

.side-list > div:first-child > div {
  border-radius: 10px 10px 0 0;
}

.side-list > div:last-child > div {
  border-radius: 0 0 10px 10px;
}

.side-list-incomplete {
  background-color: white;
  pointer-events: none;
  opacity: 1;
}

.side-list-complete {
  background-color: #4dccc4;
  /* border-radius: 20px; */
}

.item-selected {
  background-color: rgba(77, 204, 196, 0.7);
}
.property-item-selected {
  background-color: #eff1f2;
}

.side-list-subchild {
  background-color: rgb(248, 250, 251);
  border-radius: 0% !important;
}
</style>
