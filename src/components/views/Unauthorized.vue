<template>
  <div style="height: 100%" class="d-flex">
    <div
      style="background-color: white; width: 50%; height: 100vh"
      class="pa-12 text-center d-flex flex-column justify-center"
    >
      <div>
        <div class="mb-6 display-1 info--text font-weight-medium">Oops,</div>
        <div class="mb-6 display-1 info--text font-weight-medium">
          you aren't logged in...
        </div>
        <v-btn block color="accent" class="py-6 mb-4" @click="login">
          sign in
        </v-btn>
        <v-btn block color="primary" class="py-6 mb-4" @click="register">
          register
        </v-btn>
      </div>
    </div>
    <div
      style="background-color: #4dccc4; width: 50%; height: 100%"
      class="pa-12 text-center d-flex flex-column justify-center"
    >
      <div class="mb-6 display-1 white--text font-weight-medium">Continue</div>
      <v-btn color="accent" class="py-6 mb-4" @click="startForm">
        start form
      </v-btn>
    </div>
  </div>
</template>

<script>
export default {
  name: "Unauthorized",
  methods: {
    login() {
      this.$router.push("/login");
    },
    register() {
      this.$router.push("/register");
    },
    startForm() {
      this.$store.commit("set_cont_wo_login", true);
      this.$router.push(`/${this.$store.getters.redirect}`);
    },
  },
};
</script>

<style></style>
