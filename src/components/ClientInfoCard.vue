<template>
  <v-card class="rounded-card pa-4 pl-6 pb-0 secondary--text">
    <div v-if="client.avatar" class="py-4">
      <v-avatar style="border-radius: 50%" size="55px">
        <img src="https://cdn.vuetifyjs.com/images/john.jpg" alt="John" />
      </v-avatar>
    </div>

    <div v-else class="py-4">
      <v-avatar color="#006E90">
        <v-icon dark> mdi-account-circle </v-icon>
      </v-avatar>
    </div>

    <div class="font-weight-bold headline">
      {{ client.firstname }} {{ client.lastname }}
    </div>
    <div class="font-weight-medium title">
      {{ client.jobTitle }}
    </div>
    <router-link class="accent--text" :to="{ name: 'main' }">
      all cases
    </router-link>

    <div id="client-info" class="py-6">
      <div>
        <p class="overline info--text font-weight-bold mb-1">phone</p>
        <p class="spaced-text">
          {{ client.phone }}
        </p>
      </div>
      <div>
        <p class="overline info--text font-weight-bold mb-1">email</p>
        <p class="spaced-text">
          {{ client.email }}
        </p>
      </div>
      <div>
        <p class="overline info--text font-weight-bold mb-1">address</p>
        <p class="spaced-text mb-0">{{ client.address }},</p>
        <p class="spaced-text">
          {{ client.city }}, {{ client.state }} {{ client.zipcode }}
        </p>
      </div>
    </div>
  </v-card>
</template>

<script>
export default {
  name: "ClientInfoCard",
  props: {
    clientId: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      client: {},
    };
  },
  created() {
    this.getClient();
  },
  methods: {
    async getClient() {
      await this.$http
        .get(`${process.env.VUE_APP_URL}/clients/${this.clientId}`)
        .then((r) => r.data)
        .then((data) => (this.client = data));
    },
  },
};
</script>

<style></style>
