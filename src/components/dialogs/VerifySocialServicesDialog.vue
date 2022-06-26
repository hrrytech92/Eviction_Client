<template>
  <v-card class="secondary--text rounded-card" @close-dialog="close">
    <v-btn
      color="info"
      icon
      class="btn--plain close-icon"
      @click="$emit('close:dialog')"
    >
      <v-icon>mdi-close</v-icon>
    </v-btn>
    <v-card-text class="pa-10">
      <div>
        <div class="headline font-weight-medium pt-4 secondary--text text-left">
          Is this your Public Housing office?
        </div>
        <div class="secondary--text my-2">
          You are required to mail a copy of the
          <span class="font-weight-medium">Verified Complaint</span> to the
          Public Housing office. If this is not the correct address, select “No”
          and we’ll provide you with a list of offices to select from.
        </div>
        <div class="pa-6 mt-12 rounded-card mx-auto" style="width: 450px">
          <div class="mx-auto pa-6 custom-address-card">
            <div
              class="font-weight-bold primary--text mb-2"
              style="font-size: 25px"
            >
              {{ office.housingAuthority }}
            </div>
            <!-- <div class="secondary--text">
              {{ office.address }}
            </div> -->
            <div>{{ office.address }}</div>
            <div>{{ office.address2 }}</div>
            <div>
              {{ office.city }},
              {{ office.state }}
              {{ office.zipcode }}
            </div>
            <div class="secondary--text">
              <v-icon v-if="office.phone" color="primary" small>
                mdi-cellphone
              </v-icon>
              {{ office.phone }}
            </div>
            <div>
              <v-icon v-if="office.email" color="primary" small>
                $email
              </v-icon>
              {{ office.email }}
            </div>
            <div
              class="font-italic pt-10 secondary--text"
              style="font-size: 0.9rem"
            >
              Address to:
            </div>
            <v-text-field
              v-model="to"
              rounded
              hide-details="auto"
              solo
              flat
              dense
              background-color="#F0F5F6"
              class="pb-4"
              placeholder="First and Last Name"
            />
          </div>
          <div class="mt-6">
            <v-btn
              rounded
              :color="confirmYes === false ? 'primary' : 'grey_light'"
              class="px-8 mx-4"
              medium
              depressed
              @click="confirmYes = false"
            >
              No
            </v-btn>
            <v-btn
              rounded
              class="px-8 mx-4"
              medium
              depressed
              :color="confirmYes === true ? 'primary' : 'grey_light'"
              @click="confirmYes = true"
            >
              Yes
            </v-btn>
          </div>
        </div>
      </div>
    </v-card-text>
    <v-card-actions class="pa-6 justify-end">
      <v-btn
        rounded
        color="accent_light"
        class="mb-2 mt-4 btn--plain capital--btn"
        text
        @click="close"
      >
        Cancel
      </v-btn>
      <v-btn
        rounded
        class="px-8 mx-4"
        medium
        depressed
        color="accent_light"
        @click="update"
      >
        Update
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: "VerifySocialServicesDialog",
  props: {
    office: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      to: "",
      confirmYes: false,
    };
  },
  mounted() {},
  methods: {
    close() {
      this.$emit("close:dialog");
    },
    update() {
      if (this.confirmYes) {
        this.$emit("update:office", {
          ...this.office,
          to: this.to,
        });
      } else {
        this.close();
      }
    },
  },
};
</script>

<style>
.custom-address-card {
  background-color: #fafbfc;
  border-radius: 20px;
}

.close-icon {
  position: absolute;
  top: 20px;
  right: 20px;
}

.v-card__actions {
  background-color: #fafbfc;
}

.v-btn.accent_light {
  color: white;
}
</style>
