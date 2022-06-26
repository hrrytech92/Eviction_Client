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
        <v-spacer />
        <v-btn
          v-if="hasChildren(item)"
          :color="iconColor(item)"
          class="btn--plain"
          icon
          @click.stop="showChildProperties(item)"
        >
          <v-icon>mdi-chevron-{{ direction(item.showChildren) }}</v-icon>
        </v-btn>
      </v-list-item>
      <v-expand-transition>
        <div v-if="item.showChildren" class="side-list-subchild">
          <div v-for="(child, key) in item.children" :key="child.label">
            <v-list-item
              v-if="child.status !== 'hidden'"
              class="py-1 pl-6"
              :class="
                $route.name === child.routeName ? 'property-item-selected' : ''
              "
              :inactive="child.status !== 'completed'"
              @click="goToPropertyPage(child)"
            >
              <div class="secondary--text">
                <v-icon color="primary" class="pr-2">
                  mdi-{{
                    child.status === "completed" || isPropertyStepCompleted(key)
                      ? "check-circle"
                      : "checkbox-blank-circle-outline"
                  }}
                </v-icon>
                {{ child.label }}
              </div>
            </v-list-item>
          </div>
        </div>
      </v-expand-transition>
    </div>
  </v-list>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "SideList",
  computed: {
    ...mapGetters({
      currentCase: "eviction/currentCase",
      property: "property/currentProperty",
      currentPropertyId: "property/currentPropertyId",
      propertySteps: "property/propertySteps",
      caseSteps: "eviction/caseSteps",
      // isLeaseDetailsDataValid: "eviction/isLeaseDetailsDataValid",
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
      // if (name === this.$route.name) return;
      if (name === "select-property") {
        this.showChildProperties();
        return;
      }

      let routeName = name;
      if (
        name === "vc-additional-charges" &&
        this.currentCase.additionalChargesPermitted
      )
        routeName = "vc-additional-charges-extended";

      if (routeName === this.$route.name) return;
      const propParams = { id: this.currentCase.id || "new" };
      this.$router.push({
        name: routeName,
        params: propParams,
      });
    },
    goToPropertyPage(child) {
      // this.$router.push({
      //   name: "vc-client-contact",
      //   params: { id: this.case.id },
      //   query: { status: this.currentProperty.status }
      // })
      // console.log(child.routeName, "child");
      if (child.routeName === this.$route.name) return;
      if (child.routeName && child.status === "completed") {
        this.$router.push({
          name: child.routeName,
          params: { id: this.currentCase.id || "new" },
          // query: { status: this.property.status },
        });
      }
    },
    isPropertyStepCompleted(key) {
      return this.caseSteps.property.children[key].status === "completed";
    },
    isCompleted(key) {
      return this.propertySteps[key] === "completed";
    },
    showChildProperties() {
      const { caseSteps } = this;
      caseSteps.property.showChildren = !caseSteps.property.showChildren;
      this.$store.commit("eviction/update_steps", caseSteps);
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
