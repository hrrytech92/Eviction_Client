<template>
  <v-card-title>
    <v-img
      :src="require('@/assets/EasyEvictionsLogoBlue.png')"
      style="width: 70%"
    />

    <v-spacer />

    <v-menu bottom left>
      <template v-slot:activator="{ on, attrs }">
        <v-btn icon v-bind="attrs" color="secondary" large v-on="on">
          <v-icon>mdi-menu</v-icon>
        </v-btn>
      </template>

      <v-list>
        <v-list-item v-for="(item, i) in menuItems" :key="i">
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-card-title>
</template>

<script>
export default {
  name: "MobileMenu",
  data() {
    return {
      menuItems: [{ title: "Home" }, { title: "Help" }],
    };
  },
};
</script>

<style></style>
