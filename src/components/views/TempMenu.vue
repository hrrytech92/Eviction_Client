<template>
  <div class="pa-6 d-flex">
    <v-card
      v-for="item in menu_items"
      :key="item.text"
      class="pa-4 ma-4 text-center"
      style="width: 200px; height: 200px"
      color="primary"
      @click="$router.push(item.link)"
    >
      <div class="white--text font-weight-medium text-uppercase">
        {{ item.text }}
      </div>
    </v-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      menu_items: [
        {
          text: "Verified Complaint",
          link: { name: "vc-select-property" },
        },
        // {
        //     text: 'Landlord Certification',
        //     link: { path: '/landlord-certification', query: { attorney: false, service: 'A la Carte'}}
        // }
      ],
    };
  },
};
</script>

<style></style>
