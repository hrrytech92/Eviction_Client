<template>
  <div>
    <blue-list :items="columnList" />
  </div>
</template>

<script>
import BlueList from "@/components/BlueList";
export default {
  name: "ColumnDialog",
  components: {
    BlueList,
  },
  data() {
    return {
      columnList: [
        {
          title: "Client",
          checked: true,
        },
        {
          title: "Service Type",
          checked: true,
        },
        {
          title: "Submitted",
          checked: false,
        },
        {
          title: "Ground",
          checked: false,
        },
        {
          title: "Address",
          checked: true,
        },
        {
          title: "Parties",
          checked: true,
        },
        {
          title: "County",
          checked: true,
        },
        {
          title: "Hearing",
          checked: true,
        },
        {
          title: "Status",
          checked: true,
        },
        {
          title: "Action",
          checked: true,
        },
        {
          title: "Message",
          checked: true,
        },
        {
          title: "Case",
          checked: true,
        },
      ],
    };
  },
};
</script>

<style></style>
