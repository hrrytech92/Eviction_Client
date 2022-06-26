<template>
  <div>
    <!-- Inactive components will be cached! -->
    <keep-alive>
      <router-view
        @update:property="updateProperty"
        @update:steps="update"
        @save:property="save"
        @close:form="$emit('close:form')"
      />
    </keep-alive>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "NewPropertyForm",
  components: {},
  data() {
    return {
      currentstep: 1,
      requiredRules: [(v) => !!v || "Name is required"],
      notRegisteredDialog: false,
      successDialog: false,
      saving: false,
    };
  },
  computed: {
    ...mapGetters({
      currentProperty: "property/currentProperty",
    }),
    client() {
      return this.$store.getters.client;
    },
  },
  methods: {
    update(steps) {
      this.$emit("update:steps", steps);
    },
    updateProperty(payload) {
      console.log("updateProperty in NewPropertyForm", payload);
      // this.$emit(`update:property`, payload)
    },
    async save(propertyData) {
      console.log("you called NewPropertyForm.save()");
      return;
      // if (this.$store.getters.isAuthenticated) {
      //   if (!this.currentProperty) return;
      //   this.saving = true;
      //   try {
      //     const { data } = await this.$http.post(
      //       `${process.env.VUE_APP_URL}/properties/save`,
      //       {
      //         property: { ...this.currentProperty, ...propertyData },
      //         clientId: this.client.id,
      //       }
      //     );

      //     if (data.propertyId)
      //       this.$store.commit("property/update_current_property", {
      //         propertyId: data.propertyId,
      //       });

      //     // if user had not filled out their information yet and they agreed to save to profile, save to profile
      //     if (!this.client.firstName && this.saveInfoToProfile) {
      //       const result = await this.$http.post(
      //         `${process.env.VUE_APP_URL}/client/update`,
      //         {
      //           clientInfo: this.clientInfo,
      //           userId: this.client.userId,
      //         }
      //       );
      //       this.$store.commit("set_client", result.data);
      //     }
      //   } catch (e) {
      //     console.log(e);
      //   }
      //   this.saving = false;
      // } else {
      //   // save to localStorage for when user creates account
      //   sessionStorage.setItem("property", JSON.stringify(this.property));
      //   // save client information
      //   if (this.saveInfoToProfile) {
      //     sessionStorage.setItem("client", JSON.stringify(this.clientInfo));
      //   }
      // }
    },
  },
};
</script>

<style></style>
