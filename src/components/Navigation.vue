<template>
  <v-navigation-drawer
    v-model="drawer"
    app
    :mini-variant="mini"
    permanent
    color="#ffffff"
    class="elevation-6"
  >
    <v-list class="d-flex flex-column navlinks" flat>
      <v-list-item
        v-for="item in items"
        :key="item.title"
        :to="{ path: item.path }"
        link
        class="nav-link"
      >
        <v-list-item-icon>
          <!-- <v-icon color="info" size="x-large">{{ item.icon }}</v-icon> -->
          <i :class="`icofont-${item.icon}`" style="font-size: 1.4rem" />
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  name: "Navigation",
  data() {
    return {
      drawer: true,
      items: [
        { title: "Home", icon: "home", path: "/home" },
        { title: "Menu", icon: "attachment", path: "/" },
        // { title: 'Tasks', icon: 'tasks', path: '/tasks' },
        // { title: 'New Notice', icon: 'attachment', path: '/notice/new' },
        // { title: 'New Property', icon: 'building-alt', path: '/properties/new' },
        // { title: 'Properties', icon: 'industries-4', path: '/properties'},
        // { title: 'Invoices', icon: 'bill', path: '/invoices'},
        // { title: 'New Eviction', icon: 'notebook', path: '/eviction/new' },
        // { title: 'Mail', icon: 'email' , path: '/email'},
        // { title: 'Profile', icon: 'user-alt-7', path: '/profile' },
        // { title: 'Messages', icon: 'envelope-open', path: '/messages' },
        // { title: 'Files', icon: 'mdi-finance', path: '/summons_complaints' },
      ],
      mini: true,
    };
  },
};
</script>

<style scoped>
/* .navlinks{
  height: 100%;
} */
</style>
