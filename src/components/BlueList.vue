<template>
  <draggable
    v-model="items"
    group="people"
    @start="drag = true"
    @end="drag = false"
  >
    <div v-for="item in items" :key="item.title" class="blue-list">
      <v-checkbox
        v-model="item.checked"
        dense
        on-icon="mdi-checkbox-blank-circle"
        off-icon="mdi-checkbox-blank-circle-outline"
        hide-details
      >
        <template slot="label">
          <div class="d-flex justify-space-between" style="width: 100%">
            {{ item.title }}
            <v-icon color="#1E5273"> mdi-drag-horizontal-variant </v-icon>
          </div>
        </template>
      </v-checkbox>
    </div>
  </draggable>
</template>

<script>
import draggable from "vuedraggable";
export default {
  name: "BlueList",
  components: {
    draggable,
  },
  props: {
    items: {
      type: Array,
      default: () => [],
    },
  },
};
</script>

<style>
.blue-list label.v-label.theme--light {
  background-color: #f0f5f6;
  padding: 0.5em 2em;
  border-radius: 23px;
  color: #1e5273;
}

.blue-list .v-input--selection-controls {
  margin-top: 0px;
  padding-top: 7px;
}
</style>
