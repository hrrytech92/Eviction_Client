<template>
  <div class="pa-12">
    <!-- {{ client }} -->
    <div class="float-right">
      <p class="blue_grey--text ma-0 font-weight-medium overline">
        Member Since
      </p>
      <p class="secondary--text">
        {{ dateConverted }}
      </p>
    </div>
    <v-container>
      <div class="d-flex align-center">
        <v-avatar
          size="70"
          class="white--text font-weight-medium title profile-avatar"
          :color="avatarBackgroundColor"
        >
          <img v-if="client.avatar" :src="client.avatar" alt="avatar" />
          <div v-else>
            {{ client.firstName.slice(0, 1) }}{{ client.lastName.slice(0, 1) }}
          </div>
        </v-avatar>
        <div class="ml-3">
          <p class="custom-subtitle ma-0">
            {{ userName }}
          </p>
          <p class="secondary--text ma-0">
            {{ client.email }}
          </p>
        </div>
      </div>
      <div>
        <v-btn
          rounded
          color="accent_light"
          class="px-8 white--text capital--btn mt-4 edit-avatar"
          depressed
          :loading="isSelecting"
          @click="onButtonClick"
        >
          edit avatar
        </v-btn>
        <input
          ref="uploader"
          class="d-none"
          type="file"
          accept="image/*"
          @change="onFileChanged"
        />
      </div>
      <div class="d-flex align-center mt-6 mb-3">
        <div class="secondary--text custom-heading mr-12">Address(es)</div>
        <v-btn
          fab
          depressed
          color="primary"
          height="45"
          width="45"
          @click="createNewContactInfo"
        >
          <span class="white--text font-weight-regular" style="font-size: 50px"
            >+</span
          >
        </v-btn>
      </div>
      <div class="addresses">
        <div
          v-for="info in contactInfos"
          :key="info.id"
          class="d-flex align-center justify-center my-2 py-4"
          style="width: 100%; height: auto"
        >
          <v-container>
            <v-row
              class="secondary--text d-flex align-center justify-space-between main-info-box contact-item"
            >
              <v-col cols="4">
                <div class="company-name">
                  {{ info.company }}
                </div>
                <div class="user-name">
                  {{ info.firstName }} {{ info.lastName }}
                </div>
              </v-col>
              <v-col cols="4">
                <div>
                  {{ info.streetAddress
                  }}<span v-if="info.unitNo">, {{ info.unitNo }}</span>
                </div>
                <div>{{ info.city }}, {{ info.state }} {{ info.zipcode }}</div>
                <div>{{ info.phone }}</div>
                <div>{{ info.email }}</div>
              </v-col>
              <v-col cols="3">
                <v-btn
                  v-if="info.id === client.defaultContactInfoId"
                  rounded
                  color="accent_light"
                  class="px-8 white--text capital--btn profile-action-btn"
                  depressed
                >
                  default
                </v-btn>
                <v-btn
                  v-else
                  rounded
                  color="grey_light"
                  class="px-8 blue_grey--text capital--btn profile-action-btn"
                  depressed
                  @click="setDefaultContactInfo(info.id)"
                >
                  set as default
                </v-btn>
              </v-col>
              <v-col cols="1">
                <v-menu
                  offset-y
                  bottom
                  right
                  open-on-hover
                  content-class="mt-n1"
                >
                  <template v-slot:activator="{ on }">
                    <v-btn
                      small
                      icon
                      color="primary"
                      class="btn--plain"
                      v-on="on"
                    >
                      <v-icon>mdi-dots-vertical</v-icon>
                    </v-btn>
                  </template>

                  <v-list dense>
                    <v-list-item @click="showContactInfoEditModal(info)">
                      <v-list-item-title class="overline info--text">
                        <v-icon class="info--text mr-3">mdi-pencil</v-icon>
                        <span>Edit</span>
                      </v-list-item-title>
                    </v-list-item>
                    <v-list-item
                      v-if="info.id !== client.defaultContactInfoId"
                      @click="showDeleteInfoDialogModal(info)"
                    >
                      <v-list-item-title class="overline info--text">
                        <v-icon class="info--text mr-3">
                          mdi-close-circle-outline
                        </v-icon>
                        <span>Delete</span>
                      </v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </v-col>
            </v-row>
          </v-container>
        </div>
        <div>
          <div class="secondary--text custom-heading mt-12">Court Settings</div>
          <v-row align="center">
            <v-col cols="12">
              <div class="accommodations d-flex justify-space-between mt-5">
                <div
                  v-if="!editableInterpreter"
                  class="accommodation-card d-flex align-center justify-space-between"
                >
                  <div class="accommodation-text">
                    <p class="blue_grey--text text-uppercase title-text">
                      interpreter
                    </p>
                    <p class="secondary--text text-capitalize">
                      {{ client.interpreter ? client.language : "None" }}
                    </p>
                  </div>
                  <v-menu
                    offset-y
                    bottom
                    right
                    open-on-hover
                    content-class="mt-n1"
                  >
                    <template v-slot:activator="{ on }">
                      <v-btn
                        small
                        icon
                        color="primary"
                        class="btn--plain"
                        v-on="on"
                      >
                        <v-icon>mdi-dots-vertical</v-icon>
                      </v-btn>
                    </template>

                    <v-list dense>
                      <v-list-item @click="editableInterpreter = true">
                        <v-list-item-title class="overline info--text">
                          <v-icon class="info--text mr-3">mdi-pencil</v-icon>
                          <span>Edit</span>
                        </v-list-item-title>
                      </v-list-item>
                      <v-list-item @click="deleteClientInterpreter()">
                        <v-list-item-title class="overline info--text">
                          <v-icon class="info--text mr-3">
                            mdi-close-circle-outline
                          </v-icon>
                          <span>Delete</span>
                        </v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </div>
                <div
                  v-if="editableInterpreter"
                  class="accommodation-card d-flex align-center"
                >
                  <div class="accommodation-text w-full">
                    <TextField
                      title="INTERPRETER"
                      :field.sync="client.language"
                      placeholder="Indicate language"
                    />
                  </div>
                  <v-btn
                    text
                    color="accent_light"
                    @click="saveClientInterpreter"
                    class="mt-5"
                  >
                    Save
                  </v-btn>
                </div>
                <div
                  v-if="!editableAccommodation"
                  class="accommodation-card d-flex align-center justify-space-between"
                >
                  <div class="accommodation-text">
                    <p class="blue_grey--text text-uppercase title-text">
                      handicap
                    </p>
                    <p class="secondary--text text-capitalize">
                      {{ client.disability ? client.accommodation : "None" }}
                    </p>
                  </div>
                  <v-menu
                    offset-y
                    bottom
                    right
                    open-on-hover
                    content-class="mt-n1"
                  >
                    <template v-slot:activator="{ on }">
                      <v-btn
                        small
                        icon
                        color="primary"
                        class="btn--plain"
                        v-on="on"
                      >
                        <v-icon>mdi-dots-vertical</v-icon>
                      </v-btn>
                    </template>

                    <v-list dense>
                      <v-list-item @click="editableAccommodation = true">
                        <v-list-item-title class="overline info--text">
                          <v-icon class="info--text mr-3">mdi-pencil</v-icon>
                          <span>Edit</span>
                        </v-list-item-title>
                      </v-list-item>
                      <v-list-item @click="deleteClientAccommodation()">
                        <v-list-item-title class="overline info--text">
                          <v-icon class="info--text mr-3">
                            mdi-close-circle-outline
                          </v-icon>
                          <span>Delete</span>
                        </v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </div>
                <div
                  v-if="editableAccommodation"
                  class="accommodation-card d-flex align-center"
                >
                  <div class="accommodation-text w-full">
                    <TextField
                      title="HANDICAP"
                      :field.sync="client.accommodation"
                      placeholder="State required accommodation"
                    />
                  </div>
                  <v-btn
                    text
                    color="accent_light"
                    @click="saveClientAccommodation"
                    class="mt-5"
                  >
                    Save
                  </v-btn>
                </div>
              </div>
            </v-col>
          </v-row>
        </div>
      </div>
    </v-container>
    <v-dialog v-model="contactInfoEditDialog" persistent max-width="700">
      <ContactInfoEditDialog
        :mode="mode"
        :contact-info="selectedContactInfo"
        @close="closeDialog"
        @updateContactInfo="updateContactInfo"
        @saveNewContactInfo="saveNewContactInfo"
      />
    </v-dialog>
    <v-dialog v-model="showDeleteInfoDialog" persistent max-width="600">
      <DeleteContactInfoDialog
        @close="showDeleteInfoDialog = false"
        @submit="deleteContactInfo"
      />
    </v-dialog>
  </div>
</template>
<script>
import ContactInfoEditDialog from "@/components/dialogs/ContactInfoEditDialog";
import DeleteContactInfoDialog from "@/components/dialogs/DeleteContactInfoDialog";
import { mapGetters } from "vuex";
import useRequest from "@/utils/useRequest";
export default {
  name: "Profile",
  components: {
    ContactInfoEditDialog,
    DeleteContactInfoDialog,
  },
  data() {
    return {
      contactInfoEditDialog: false,
      showDeleteInfoDialog: false,
      selectedContactInfo: {
        id: "",
        firstName: "",
        lastName: "",
        company: "",
        streetAddress: "",
        unitNo: "",
        city: "",
        state: "New Jersey",
        zipcode: "",
        phone: "",
        email: "",
      },
      mode: "",
      selectedFile: null,
      isSelecting: false,
      editableInterpreter: false,
      editableAccommodation: false,
    };
  },
  computed: {
    ...mapGetters({
      contactInfos: "contactInfos",
    }),
    client() {
      return this.$store.getters.client;
    },
    userName() {
      return this.$store.getters.userName;
    },
    dateConverted() {
      return this.convertDateTextMonthNumberYear(this.client.created_at);
    },
    avatarBackgroundColor() {
      return this.createAvatarBackgroundColor(this.userName);
    },
  },
  // watch: {
  //   client(newVal) {
  //     return newVal;
  //   },
  // },
  created() {
    // console.log("Profile.vue created");
    this.$store.dispatch("loadContactInfos");

    // if (this.contactInfoId) {
    //   this.contactInfo.id = this.contactInfoId;
    // }
  },
  methods: {
    setDefaultContactInfo(infoId) {
      const selectedForDefault = this.contactInfos.find(
        (item) => item.id == infoId
      );
      console.log("selectedForDefault :>> ", selectedForDefault);
      const updateClient = {
        ...this.client,
        defaultContactInfoId: infoId,
        ...selectedForDefault,
      };
      //   const { defaultContactInfoId } = userData;
      // const updateClient = { ...getters.client, defaultContactInfoId };
      this.$store.commit("set_client", updateClient);

      const userData = {
        auth0Id: this.client.auth0Id,
        defaultContactInfoId: infoId,
      };
      this.$store.dispatch("updateUser", userData);
    },
    async deleteContactInfo() {
      await useRequest({
        path: `contactInfo/${this.selectedContactInfo.id}`,
        method: "DELETE",
        onSuccess: () => {
          this.$store.dispatch("loadContactInfos");
          this.showDeleteInfoDialog = false;
        },
      });
    },
    showDeleteInfoDialogModal(info) {
      this.showDeleteInfoDialog = true;
      this.selectedContactInfo = info;
    },
    showContactInfoEditModal(info) {
      this.mode = "edit";
      this.selectedContactInfo = info;
      this.contactInfoEditDialog = true;
    },
    async updateContactInfo() {
      this.contactInfoEditDialog = false;
      try {
        await useRequest({
          method: "post",
          path: "contactInfo",
          data: {
            contactInfo: this.selectedContactInfo,
          },
        });
        this.$store.dispatch("loadContactInfos");

        return;
      } catch (e) {
        console.log("updateContactInfo error:", e);
      }
    },
    createNewContactInfo() {
      this.mode = "create";
      this.contactInfoEditDialog = true;
      this.selectedContactInfo = {
        id: "",
        firstName: "",
        lastName: "",
        company: "",
        streetAddress: "",
        unitNo: "",
        city: "",
        state: "New Jersey",
        zipcode: "",
        phone: "",
        email: "",
      };
    },
    async saveNewContactInfo() {
      if (this.$store.getters.isAuthenticated) {
        await this.saveNewContact();
      }
      // else {
      //   localStorage.setItem("contactInfo", JSON.stringify(this.contactInfo));
      // }

      this.contactInfoEditDialog = false;
    },
    async saveNewContact() {
      try {
        const { data: newId } = await useRequest({
          path: "contactInfo",
          method: "post",
          data: { contactInfo: this.selectedContactInfo },
          throwError: true,
        });
        await this.$store.dispatch("loadContactInfos");
        this.contactInfos.length === 1 && this.setDefaultContactInfo(newId);
      } catch (e) {
        console.log("saveNewContact() error:", e);
      }
    },
    closeDialog() {
      this.$store.dispatch("loadContactInfos");
      this.contactInfoEditDialog = false;
    },
    onButtonClick() {
      this.isSelecting = true;
      window.addEventListener(
        "focus",
        () => {
          this.isSelecting = false;
        },
        { once: true }
      );

      this.$refs.uploader.click();
    },
    async onFileChanged(e) {
      try {
        // this.selectedFile = e.target.files[0]
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append("file", file);
        const { data: avatar } = await useRequest({
          path: "upload_avatar",
          method: "post",
          data: formData,
          throwError: true,
        });
        // const {data:avatar} = await axios.post(
        //   `${process.env.VUE_APP_URL}/upload_avatar`,
        //   formData,
        //   {
        //     headers: {
        //       "Content-Type": "multipart/form-data",
        //     },
        //   }
        // );
        const updatedClient = { ...this.client, avatar };
        this.$store.commit("set_client", updatedClient);
      } catch (error) {
        console.log(`error`, error);
      } finally {
        this.$refs.uploader.value = null;
      }
    },
    async saveClientInterpreter() {
      if (this.client.language === "") {
        this.deleteClientInterpreter();
      } else {
        const userData = {
          auth0Id: this.client.auth0Id,
          language: this.client.language,
          interpreter: true,
        };
        await this.$store.dispatch("updateUser", userData);
      }
      this.editableInterpreter = false;
    },
    async deleteClientInterpreter() {
      const userData = {
        auth0Id: this.client.auth0Id,
        language: "",
        interpreter: false,
      };
      await this.$store.dispatch("updateUser", userData);
    },
    async saveClientAccommodation() {
      if (this.client.accommodation === "") {
        this.deleteClientAccommodation();
      } else {
        const userData = {
          auth0Id: this.client.auth0Id,
          accommodation: this.client.accommodation,
          disability: true,
        };
        await this.$store.dispatch("updateUser", userData);
      }
      this.editableAccommodation = false;
    },
    async deleteClientAccommodation() {
      const userData = {
        auth0Id: this.client.auth0Id,
        accommodation: "",
        disability: false,
      };
      await this.$store.dispatch("updateUser", userData);
      this.editableAccommodation = false;
    },
  },
};
</script>
<style>
.main-info-box {
  background: #ffffff 0% 0% no-repeat padding-box;
  box-shadow: 15px 15px 40px #00000029;
  border-radius: 20px;
  padding: 20px 30px 20px 80px;
}

.v-avatar img {
  object-fit: cover;
}

.profile-avatar img {
  object-fit: cover;
}

.edit-avatar {
  margin-left: 82px;
}

.profile-action-btn {
  min-width: 174px;
  width: 174px;
}

.contact-item .company-name {
  font-size: 24px;
  line-height: 29px;
  font-weight: 500;
  font-family: "futura-pt";
  letter-spacing: 0.07px;
}

.contact-item .user-name {
  font-size: 22px;
  line-height: 29px;
  font-weight: 400;
  font-family: "futura-pt";
  letter-spacing: 0.07px;
}

.accommodations {
  gap: 38px;
}

.accommodations > * {
  flex-basis: 50%;
}

.accommodation-card {
  background: #ffffff 0% 0% no-repeat padding-box;
  box-shadow: 15px 15px 40px #00000029;
  border-radius: 20px;
  padding: 32px 42px;
}

.accommodation-text p {
  margin: 0;
}

.accommodation-text .v-text-field__details {
  display: none;
}

.accommodation-text .title-text {
  font-size: 20px;
  font-weight: 500;
}
</style>
