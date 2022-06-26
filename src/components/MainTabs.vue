<template>
  <v-tabs grow hide-slider height="70px" active-class="primary white--text">
    <v-tab v-for="item in tabs" :key="item.name">
      <span class="title">{{ item.name }}</span>
    </v-tab>

    <v-tab-item v-for="item in items" :key="item">
      <v-card color="basil" flat>
        <v-card-text>{{ text }}</v-card-text>
      </v-card>
    </v-tab-item>
  </v-tabs>
</template>

<script>
export default {
  name: "MainTabs",
  data() {
    return {};
  },
};
</script>

<style></style>
