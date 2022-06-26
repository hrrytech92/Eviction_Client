<template>
  <div>
    <LoadingOverlay active />
  </div>
</template>

<script>
export default {
  created() {
    // console.log("this.$route :>> ", this.$route);
    // return;
    // if (this.$route.name === "logout")
    //   this.$auth.logout({
    //     returnTo: window.location.origin + "/login",
    //   });
    // else
    this.$auth.loginWithRedirect();
  },
};
</script>
