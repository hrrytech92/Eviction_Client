<template>
  <v-menu v-model="showMenu" offset-y>
    <template v-slot:activator="{ on }">
      <v-text-field
        v-model="field1"
        rounded
        hide-details
        solo
        flat
        dense
        background-color="#F0F5F6"
        readonly
      >
        <v-icon slot="append" medium color="accent" v-on="on">
          mdi-chevron-down
        </v-icon>
      </v-text-field>
    </template>

    <v-row>
      <v-col>
        <v-list dense>
          <template v-for="item in items1">
            <v-list-item :key="item" @click="field1 = item">
              <v-list-item-title>{{ item }}</v-list-item-title>
            </v-list-item>
          </template>
        </v-list>
      </v-col>
      <v-col>
        <v-list dense>
          <template v-for="item in items1">
            <v-list-item :key="item" @click="field1 = item">
              <v-list-item-title>{{ item }}</v-list-item-title>
            </v-list-item>
          </template>
        </v-list>
      </v-col>
    </v-row>
  </v-menu>
</template>

<script>
export default {
  name: "ScrollDoubleSelect",
  props: { showMenu: Boolean },
  data() {
    return {
      field1: "",
      field2: "",
      items1: ["first", "second", "third"],
    };
  },
};
</script>

<style></style>
