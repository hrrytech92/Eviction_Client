<template>
  <v-container fluid class="pa-0">
    <v-row
      class="text-center header-text secondary--text font-weight-medium px-8"
      style="font-size: 0.75rem"
    >
      <v-col cols="3"> Owner </v-col>
      <v-col cols="3"> Property </v-col>
      <!-- <v-col cols="2">
        Tenants
      </v-col> -->
      <v-col cols="3"> County </v-col>
      <v-col cols="2"> Registration </v-col>
      <v-col cols="1" />
      <!-- <v-col cols="2">
        Action
      </v-col> -->
    </v-row>
    <LoadingOverlay :active="loading" />
    <div v-if="!loading">
      <div
        v-if="itemsAmount === 0 && !loading"
        class="no-data-table no-data-card my-5 d-flex justify-center align-center"
      >
        <div
          class="d-flex justify-center align-center flex-column no-data-table-inner px-15 py-15"
        >
          <i class="icofont-puzzle primary--text" style="font-size: 5rem" />
          <h5 class="secondary--text custom-subtitle">
            Oops. We don’t have your records.
          </h5>
          <p class="slim--text">
            Looks like you have not added any properties.
          </p>
          <v-btn
            rounded
            color="primary"
            class="px-8 mb-2 mt-4 white--text capital--btn"
            @click="$router.push('/properties/new')"
          >
            Add New
          </v-btn>
        </div>
      </div>
      <paginate
        v-else
        ref="paginator"
        :container="this"
        name="pagitems"
        :list="items"
        tag="div"
        :per="amountPerPg"
      >
        <v-card
          style="border-radius: 20px; box-shadow: 15px 15px 40px #00000029"
          class="mt-4"
        >
          <v-list class="pa-0">
            <v-list-item-group>
              <v-list-item
                v-for="item in paginated('pagitems')"
                :key="item.id"
                style="font-size: 0.875rem"
                class="py-8 px-8 border-bottom"
              >
                <v-row class="secondary--text text-center">
                  <v-col cols="3">
                    <div>{{ item.deedNames }}</div>
                  </v-col>

                  <v-col cols="3">
                    <div>{{ item.streetAddress }}</div>
                    <div>
                      {{ item.city }}, {{ getStateCode(item.state) }}
                      {{ item.zipcode }}
                    </div>
                  </v-col>

                  <!-- <v-col cols="2">
                    <div v-if="item.expandTenants">
                      <div
                        v-for="tenant in item.tenants"
                        :key="tenant.tenantId"
                      >
                        {{ tenant.name }}
                      </div>
                      <v-btn
                        v-if="item.tenants.length > 2"
                        text
                        color="accent"
                        class="font-weight-regular btn--plain pa-0 ma-0"
                        style="height: 20px; min-width: 0"
                        @click="
                          () => {
                            item.expandTenants = false;
                            $forceUpdate();
                          }
                        "
                      >
                        less
                      </v-btn>
                    </div>
                    <div v-else>
                      <div
                        v-for="tenant in item.tenants.slice(0, 2)"
                        :key="tenant.tenantId"
                      >
                        {{ tenant.name }}
                      </div>
                      <v-btn
                        v-if="item.tenants.length > 2"
                        text
                        color="accent"
                        class="font-weight-regular btn--plain pa-0 ma-0"
                        style="height: 20px; min-width: 0"
                        @click="
                          () => {
                            item.expandTenants = true;
                            $forceUpdate();
                          }
                        "
                      >
                        more
                      </v-btn>
                    </div>
                  </v-col> -->

                  <v-col cols="3">
                    <div>{{ item.county }}</div>
                    <div class="accent--text">
                      {{ item.docketNo }}
                    </div>
                  </v-col>

                  <v-col cols="3">
                    <div v-if="item.registrationFiled">
                      <v-icon color="primary"> mdi-check-circle </v-icon>
                      <span>{{ item.registrationFiledDate }}</span>
                    </div>
                  </v-col>

                  <!-- <v-col
                    cols="2"
                    class="d-flex justify-space-between"
                  >
                    <v-btn
                      v-if="!getEviction(item)"
                      small
                      rounded
                      depressed
                      color="accent_light"
                      class="white--text"
                      @click="startEviction(item)"
                    >
                      start eviction
                    </v-btn>

                    <v-btn
                      v-else
                      small
                      rounded
                      depressed
                      outlined
                      color="accent_light"
                      class="white--text px-4"
                      :to="{ path: `case-view/${getEviction(item).id}/overview` }"
                    >
                      in progress
                    </v-btn>

                    <v-menu
                      offset-y
                      bottom
                      left
                      open-on-hover
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
                        <v-list-item @click="view(item.id)">
                          <v-list-item-title class="overline info--text">
                            <i
                              style="font-size: 20px"
                              :class="`icofont-search-document pr-4`"
                            />
                            VIEW PROPERTY
                          </v-list-item-title>
                        </v-list-item>
                        <v-list-item
                          v-for="(btn, i) in btns"
                          :key="i"
                          @click="btn.onclick"
                        >
                          <v-list-item-title class="overline info--text">
                            <i
                              style="font-size: 20px"
                              :class="`icofont-${btn.icon} pr-4`"
                            />
                            {{ btn.title }}
                          </v-list-item-title>
                        </v-list-item>
                      </v-list>
                    </v-menu>
                  </v-col> -->
                </v-row>
              </v-list-item>
              <v-list-item class="py-8 px-8 d-flex justify-end align-center">
                <div class="secondary--text mr-12 font-weight-medium">
                  ADD NEW
                </div>
                <v-btn
                  fab
                  depressed
                  color="primary"
                  height="45"
                  width="45"
                  @click="$router.push('/properties/new')"
                >
                  <span
                    class="white--text font-weight-regular"
                    style="font-size: 40px"
                    >+</span
                  >
                </v-btn>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-card>
      </paginate>
      <div class="d-flex justify-space-between my-2">
        <div class="d-flex align-center">
          <div style="font-size: 0.75rem" class="secondary--text pr-2">
            Number of items to display
          </div>
          <v-text-field
            v-model="amountPerPage"
            rounded
            hide-details
            solo
            flat
            dense
            background-color="#F0F5F6"
            style="max-width: 70px"
          />
        </div>
        <div v-if="$refs.paginator">
          <v-btn
            icon
            color="accent"
            class="btn--plain pa-2"
            style="min-width: 5px"
            @click="$refs.paginator.goToPage(1)"
          >
            <v-icon>mdi-skip-previous</v-icon>
          </v-btn>
          <v-btn
            icon
            color="accent"
            class="btn--plain pa-2"
            style="min-width: 5px"
            :disabled="$refs.paginator.currentPage === 1"
            @click="$refs.paginator.goToPage($refs.paginator.currentPage - 1)"
          >
            <v-icon large> mdi-menu-left </v-icon>
          </v-btn>
          <v-btn
            v-for="item in $refs.paginator.lastPage"
            :key="item"
            text
            class="btn--plain pa-2"
            style="min-width: 5px"
            @click="$refs.paginator.goToPage(item)"
          >
            <span
              :class="{
                'accent--text': item - 1 === $refs.paginator.currentPage,
              }"
              >{{ item }}</span
            >
          </v-btn>
          <v-btn
            icon
            color="accent"
            class="btn--plain pa-2"
            style="min-width: 5px"
          >
            <v-icon large> mdi-menu-right </v-icon>
          </v-btn>
          <v-btn
            icon
            color="accent"
            class="btn--plain pa-2"
            style="min-width: 5px"
            @click="$refs.paginator.goToPage($refs.paginator.lastPage)"
          >
            <v-icon>mdi-skip-next</v-icon>
          </v-btn>
        </div>
      </div>
    </div>
    <!-- <paginate-links for="pagitems" :async="true" :show-step-links="true" class="d-flex"></paginate-links> -->
  </v-container>
</template>

<script>
export default {
  name: "PropertyTable2",
  props: {
    tableFilters: {
      type: Object,
      default: () => ({}),
    },
    items: {
      type: Array,
      default: () => [],
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      search: "",
      btns: [
        { title: "EDIT", icon: "pencil" },
        { title: "UPLOAD", icon: "cloud-upload", onclick: "" },
        { title: "DELETE", icon: "close-circled", onclick: "" },
      ],
      paginate: ["pagitems"],
      amountPerPage: 5,
    };
  },
  computed: {
    cases() {
      return this.$store.getters.cases;
    },
    client() {
      return this.$store.getters.client;
    },
    maxWidth() {
      if (this.dialogName === "fileSCDialog") {
        return 800;
      }
      return 600;
    },
    amountPerPg() {
      if (this.amountPerPage) return this.amountPerPage;
      return 1;
    },
    itemsAmount() {
      return this.items.length;
    },
  },
  methods: {
    startEviction(item) {
      // this.$store.commit("set_current_property", item);
      this.$router.push({
        path: "/verified-complaint",
        query: { propertyId: item.propertyId },
      });
    },
    view(id) {
      this.$router.push(`/properties/${id}`);
    },
    getEviction(item) {
      return this.cases.find((e) => e.propertyId === item.propertyId);
    },
  },
};
</script>

<style>
ul.d-flex.paginate-links.pagitems {
  width: 159px;
  list-style-type: none;
}
.paginate-list li {
  display: block;
}
</style>
