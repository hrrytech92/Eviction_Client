<template>
  <v-card class="my-4 pa-2 rounded-card" color="#006E90">
    <div class="d-flex justify-space-between mx-2">
      <div v-for="item in items" :key="item.title">
        <page-nav-item
          :title="item.title"
          :icon="item.icon"
          :path="`${caseId}/${item.path}`"
        />
      </div>
    </div>
  </v-card>
</template>

<script>
import PageNavItem from "@/components/PageNavItem";
export default {
  name: "PageNavBar",
  components: {
    PageNavItem,
  },
  props: {
    caseId: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      items: [
        { title: "OVERVIEW", icon: "$searchFolder", path: "" },
        { title: "DOCUMENTS", icon: "$invoices", path: "documents" },
        { title: "CREATE FORM", icon: "$form", path: "" },
        { title: "REQUESTS", icon: "$download", path: "requests" },
        { title: "MESSAGE", icon: "$email", path: "" },
        { title: "NOTES", icon: "$documentFolder", path: "" },
        { title: "TASKS", icon: "$tasks", path: "tasks" },
        { title: "INVOICES", icon: "$bank", path: "" },
      ],
    };
  },
};
</script>
