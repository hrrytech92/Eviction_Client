<template>
  <v-card class="secondary--text rounded-card" @close:dialog="close">
    <v-btn color="info" icon class="float-right ma-3 btn--plain" @click="close">
      <v-icon>mdi-close</v-icon>
    </v-btn>
    <div class="pa-10">
      <div class="headline font-weight-medium text-center pt-10">
        Public Housing Offices
      </div>
      <v-card-text class="pa-0">
        <div class="secondary--text font-weight-medium my-2 text-center">
          Select the Public Housing office for this property.
        </div>

        <div class="d-flex justify-space-between">
          <div
            v-for="n in 26"
            :key="n"
            class="letter-btn pa-2 font-weight-medium"
            :class="n === letter ? 'primary--text' : 'info--text'"
            @click="clickLetter(n)"
          >
            {{ String.fromCharCode(64 + n) }}
          </div>
        </div>

        <v-container class="pa-4">
          <v-radio-group
            v-model="selectedOffice"
            class="my-0 primary-radio-group"
            hide-details
            row
            @change="isSelected = true"
          >
            <v-row>
              <v-col
                v-for="office in letterOffices"
                :key="office.socialServiceAddresseId"
                cols="6"
                class="secondary--text py-2 d-flex align-start"
              >
                <v-radio
                  :value="office"
                  on-icon="mdi-checkbox-blank-circle"
                  class="ml-4 mt-1"
                />
                <div>
                  <div class="font-weight-bold">
                    {{ office.housingAuthority }}
                  </div>
                  <div>{{ office.address }}</div>
                  <div>{{ office.address2 }}</div>
                  <div>
                    {{ office.city }},
                    {{ office.state }}
                    {{ office.zipcode }}
                  </div>
                  <div>
                    <v-icon v-if="office.phone" color="primary" x-small>
                      <!-- mdi-cellphone-iphone </v-icon -->
                      mdi-cellphone</v-icon
                    >
                    {{ office.phone }}
                  </div>
                  <div>
                    <v-icon v-if="office.email" color="primary" x-small>
                      $email
                    </v-icon>
                    {{ office.email }}
                  </div>
                  <div
                    v-if="
                      office.housingAuthority ===
                      selectedOffice.housingAuthority
                    "
                  >
                    <div class="font-italic py-2">Address to:</div>
                    <v-text-field
                      v-model="selectedOffice.to"
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
                </div>
              </v-col>
            </v-row>
          </v-radio-group>
        </v-container>
      </v-card-text>
    </div>
    <v-card-actions class="justify-end py-6 px-12">
      <v-btn color="accent_light" text class="btn--plain" @click="close">
        cancel
      </v-btn>
      <v-btn
        rounded
        color="accent_light"
        class="px-8 white--text capital--btn"
        depressed
        :disabled="!valid"
        @click="submit"
      >
        continue
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: "SocialServicesDialog",
  props: {
    dialogCase: {
      type: Object,
      default: () => ({}),
    },
    dialogAction: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      allOffices: [],
      letterOffices: [],
      selectedOffice: {},
      isSelected: false,
      letter: 1,
    };
  },
  computed: {
    valid() {
      return this.isSelected;
    },
  },
  created() {
    this.$http
      .get(`${process.env.VUE_APP_URL}/socialServiceOffices`)
      .then((r) => r.data)
      .then((data) => {
        this.allOffices = data;
        this.letterOffices = this.allOffices.filter(
          (o) => o.housingAuthority && o.housingAuthority.startsWith("A")
        );
      });
  },
  methods: {
    clickLetter(n) {
      const letter = String.fromCharCode(64 + n);
      this.letter = n;
      this.letterOffices = this.allOffices.filter(
        (o) => o.housingAuthority && o.housingAuthority.startsWith(letter)
      );
    },
    submit() {
      this.$emit("update:office", this.selectedOffice);
    },
    close() {
      this.$emit("close:dialog");
    },
  },
};
</script>

<style>
.letter-btn:hover {
  cursor: pointer;
}
</style>
