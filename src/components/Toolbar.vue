<template>
  <v-app-bar app min-height="84" height="84" class="custom-app-header">
    <v-btn
      text
      class="capital--btn btn--plain mr-8"
      @click="handleNavigationLink('home')"
    >
      <img src="/images/logo.svg" height="50" />
    </v-btn>

    <v-spacer />

    <!-- v-if="!isFormProgress && $auth.isAuthenticated" -->
    <v-btn
      v-if="$auth.isAuthenticated"
      text
      class="capital--btn btn--plain mr-8"
      @click="handleNavigationLink('home')"
    >
      DASHBOARD
    </v-btn>
    <v-btn
      v-if="$auth.isAuthenticated"
      text
      class="capital--btn btn--plain mr-8"
      @click="handleNavigationLink('properties')"
    >
      PROPERTIES
    </v-btn>
    <div v-if="!$auth.loading">
      <v-menu
        v-model="helpVal"
        offset-y
        offset-x
        nudge-left="145"
        nudge-bottom="13"
        bottom
        rounded="menu-dropdown"
      >
        <template v-slot:activator="{ on }">
          <v-btn class="btn--plain capital--btn mr-8" text v-on="on">
            <span class="px-2">HELP</span>
          </v-btn>
        </template>
        <v-alert
          class="py-0 my-0"
          border="bottom"
          color="accent_light"
          colored-border
          tile
        >
          <v-list flat>
            <template v-for="(item, i) in helpItems">
              <v-list-item :key="i" class="py-1">
                <a
                  class="d-flex"
                  :href="item.href"
                  :target="item.blank ? `_blank` : `_self`"
                >
                  <v-list-item-icon class="info--text">
                    <i
                      :class="`icofont-${item.icon}`"
                      style="font-size: 1rem"
                    />
                  </v-list-item-icon>

                  <v-list-item-content>
                    <v-list-item-title
                      class="info--text font-weight-medium info--text text-uppercase caption"
                    >
                      {{ item.title }}
                    </v-list-item-title>
                  </v-list-item-content>
                </a>
              </v-list-item>
              <v-divider v-if="i < items.length - 1" :key="i + 'divider'" />
            </template>
          </v-list>
        </v-alert>
      </v-menu>
      <v-btn
        v-if="!$auth.isAuthenticated"
        text
        class="capital--btn btn--plain mr-8"
        @click="handleNavigationLink('register')"
      >
        REGISTER
      </v-btn>

      <v-btn
        v-if="!$auth.isAuthenticated"
        text
        class="capital--btn btn--plain mr-8"
        @click="handleNavigationLink('login')"
      >
        SIGN IN
      </v-btn>
      <v-menu
        v-if="$auth.isAuthenticated"
        v-model="menuVal"
        offset-y
        offset-x
        nudge-left="5"
        nudge-bottom="13"
        bottom
        rounded="menu-dropdown"
      >
        <template v-slot:activator="{ on }">
          <v-btn class="btn--plain capital--btn" text v-on="on">
            <!-- <v-avatar
              size="40"
              class="white--text font-weight-medium"
              :color="avatarBackgroundColor"
            >      
              <img 
                v-if="client.avatar"
                :src="client.avatar" 
                alt="avatar"
              >
              <div 
                v-else-if="client.firstName && client.lastName"
              >
                {{ client.firstName ? client.firstName.slice(0, 1) : '' }}{{ client.lastName ? client.lastName.slice(0, 1) : '' }}
              </div>
            </v-avatar> -->
            <v-avatar v-if="client.avatar" size="40" class="mr-1">
              <v-img :src="client.avatar" />
            </v-avatar>
            <v-avatar
              v-else-if="client.firstName && client.lastName"
              size="40"
              class="white--text font-weight-medium"
              :color="avatarBackgroundColor"
            >
              {{ client.firstName.slice(0, 1)
              }}{{ client.lastName.slice(0, 1) }}
            </v-avatar>
            <span class="px-2"
              >Hello{{
                client.firstName ? ", " + client.firstName + "!" : "!"
              }}</span
            >
            <v-icon>mdi-menu-{{ menuVal ? "up" : "down" }}</v-icon>
          </v-btn>
        </template>
        <v-alert
          class="py-0 my-0"
          border="bottom"
          color="accent_light"
          colored-border
          tile
        >
          <v-list flat>
            <template v-for="(item, i) in items">
              <v-list-item
                v-if="item.type === 'inner_Link'"
                :key="i"
                class="py-1"
                @click="
                  () => {
                    item.onclick();
                  }
                "
              >
                <v-list-item-icon class="info--text">
                  <i :class="`icofont-${item.icon}`" style="font-size: 1rem" />
                </v-list-item-icon>

                <v-list-item-content>
                  <v-list-item-title
                    class="info--text font-weight-medium info--text text-uppercase caption"
                  >
                    {{ item.title }}
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item
                v-if="item.type === 'outer_Link'"
                :key="i"
                class="py-1"
              >
                <a
                  class="d-flex"
                  :href="item.href"
                  :target="item.blank ? `_blank` : `_self`"
                >
                  <v-list-item-icon class="info--text">
                    <i
                      :class="`icofont-${item.icon}`"
                      style="font-size: 1rem"
                    />
                  </v-list-item-icon>

                  <v-list-item-content>
                    <v-list-item-title
                      class="info--text font-weight-medium info--text text-uppercase caption"
                    >
                      {{ item.title }}
                    </v-list-item-title>
                  </v-list-item-content>
                </a>
              </v-list-item>
              <v-divider v-if="i < items.length - 1" :key="i + 'divider'" />
            </template>
          </v-list>
        </v-alert>
      </v-menu>
    </div>
    <v-dialog
      v-model="showChangePasswordDialog"
      persistent
      value="''"
      max-width="375"
      class="change-password-popup"
    >
      <ChangePasswordDialog @close:change-popup="closePopup" />
    </v-dialog>
    <v-dialog
      v-model="confirmLeaveDialog"
      persistent
      value="''"
      max-width="600"
    >
      <CancelDialog
        @close="confirmLeaveDialog = false"
        @submit="goToSpecificPage"
      />
    </v-dialog>
  </v-app-bar>
</template>

<script>
import ChangePasswordDialog from "@/components/dialogs/ChangePasswordDialog.vue";
import CancelDialog from "@/components/dialogs/CancelDialog.vue";
import { auth0OptionsHelper } from "@/utils";

export default {
  name: "Toolbar",
  components: {
    ChangePasswordDialog,
    CancelDialog,
  },
  props: {
    isFormProgress: Boolean,
  },
  data() {
    return {
      messages: 12,
      helpVal: false,
      menuVal: false,
      specificPage: "",
      helpItems: [
        {
          title: "Faq",
          icon: "question-circle",
          href: "https://fileevictions.com/self-file-eviction/",
          blank: true,
        },
        {
          title: "Resources",
          icon: "info-circle",
          href: "https://fileevictions.com/help-center/",
          blank: true,
        },
        {
          title: "Upcoming",
          icon: "megaphone-alt",
          href: "https://fileevictions.com/upcoming-features/",
          blank: true,
        },
        {
          title: "Email Us",
          icon: "email",
          href: "mailto:support@fileevictions.com",
        },
      ],
      items: [
        {
          title: "PROFILE",
          icon: "user-alt-7",
          onclick: () => {
            this.handleNavigationLink("profile");
          },
          type: "inner_Link",
        },
        {
          title: "Password",
          icon: "key",
          onclick: () => {
            this.handleNavigationLink("change-password");
          },
          type: "inner_Link",
        },
        {
          title: "Support",
          icon: "wrench",
          href: "mailto:support@fileevictions.com",
          blank: false,
          type: "outer_Link",
        },
        {
          title: "LOG OUT",
          icon: "sign-out",
          onclick: () => {
            this.handleNavigationLink("logout");
          },
          type: "inner_Link",
        },
      ],
      showChangePasswordDialog: false,
      confirmLeaveDialog: false,
    };
  },
  computed: {
    cart() {
      return this.$store.getters.cartTotal;
    },
    client() {
      return this.$store.getters.client;
    },
    userName() {
      return this.$store.getters.userName;
    },
    avatarBackgroundColor() {
      return this.createAvatarBackgroundColor(this.userName);
    },
  },
  methods: {
    logout() {
      // localStorage.setItem("redirect_url", this.$route.path);
      this.$auth.logout({
        returnTo: window.location.origin + "/login",
      });
    },
    closePopup() {
      this.showChangePasswordDialog = false;
    },
    handleNavigationLink(link) {
      const { path } = this.$route;
      // console.log({ link, path });
      if (
        path.includes("verified-complaint") &&
        !path.includes("order-details")
      ) {
        this.confirmLeaveDialog = true;
        this.specificPage = link;
        return;
      }

      if (`/${link}` === path) return;

      switch (link) {
        case "home":
          if (!this.$auth.isAuthenticated) this.$auth.loginWithRedirect();
          else path !== "/" && this.$router.push("/");
          break;
        case "login":
        case "register":
          this.$auth.loginWithRedirect(auth0OptionsHelper(link));
          break;
        case "change-password":
          this.showChangePasswordDialog = true;
          break;
        case "logout":
          this.logout();
          break;
        default:
          this.$router.push(`/${link}`);
      }

      //*For terms page
    },
    goToSpecificPage() {
      if (this.specificPage === "login" || this.specificPage === "register")
        return this.$auth.loginWithRedirect(
          auth0OptionsHelper(this.specificPage)
        );

      if (!this.$auth.isAuthenticated) return this.$auth.loginWithRedirect();

      if (this.specificPage === "home") {
        this.$router.push("/");
      } else if (this.specificPage === "profile") {
        this.$router.push("/profile");
      } else if (this.specificPage === "properties") {
        this.$router.push("/properties");
      } else if (this.specificPage === "change-password") {
        this.showChangePasswordDialog = true;
      } else if (this.specificPage === "logout") {
        this.logout();
      }
      this.confirmLeaveDialog = false;
    },
  },
};
</script>

<style>
.custom-app-header {
  background-color: white !important;
  box-shadow: none !important;
}

.rounded-menu-dropdown {
  border-radius: 10px !important;
  box-shadow: 8px 8px 20px #0000001f !important;
}

.toolbar {
  height: 40px;
}

.styled-input {
  transform: scale(0.7);
  transform-origin: left;
  margin-top: -12px;
  width: 10vw;
}

span.v-badge__badge.primary {
  height: 5px;
  font-size: 11px;
  padding: 0;
  min-width: 0;
}
</style>
