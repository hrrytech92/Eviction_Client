<template>
  <div class="py-4 px-12 mx-4">
    <div v-if="showEvictionBanner" class="eviction-banner custom-banner mt-12">
      <v-icon class="accent--text close-icon" @click="closeEvictionBanner">
        mdi-close
      </v-icon>
      <i class="icofont-exclamation-circle icofont-2x accent--text" />
      <div class="text-part">
        <h4 class="accent--text banner-title">EVICTION MORATORIUM</h4>
        <p class="ma-0 secondary--text">
          As of January 1, 2022, all previous New Jersey state moratoriums
          enacted due to COVID-19 are lifted, and tenants may be evicted for any
          rent that becomes due and owing as of January 1, 2022. Tenants that
          have filed a Certification of Low Income may still be protected for
          rents that accrued between March 2020 and December 2021, under
          specific conditions.
          <a
            href="https://fileevictions.com/new-jersey-eviction-moratorium/"
            class="accent--text"
            target="_blank"
          >
            Read additional information
          </a>
        </p>
      </div>
    </div>

    <div v-if="showUpcomingBanner" class="upcoming-banner custom-banner mt-6">
      <v-icon class="accent2--text close-icon" @click="closeUpcomingBanner">
        mdi-close
      </v-icon>
      <i class="icofont-exclamation-circle icofont-2x accent2--text" />
      <div class="text-part">
        <h4 class="accent2--text banner-title">UPCOMING FEATURES</h4>
        <p class="ma-0 secondary--text">
          Although you may use our software to go through the legal process to
          evict a tenant due to non-payment of rent, there are a few things we
          are not quite yet ready for, but will support in the future. To view a
          list of our upcoming features,
          <a
            href="https://fileevictions.com/upcoming-features/"
            class="accent2--text"
            target="_blank"
          >
            click here.
          </a>
        </p>
      </div>
    </div>

    <!--<v-dialog-->
    <!--  v-model="showShouldLoginDialog"-->
    <!--  :max-width="375"-->
    <!--  style="border-radius: 20px"-->
    <!--&gt;-->
    <!--  <should-login-dialog-->
    <!--    @close:dialog="showShouldLoginDialog = false"-->
    <!--  />-->
    <!--</v-dialog>-->

    <div class="d-flex align-center justify-space-between my-12">
      <div class="d-flex align-center">
        <div class="secondary--text custom-heading mr-12">Evictions</div>
        <v-btn
          fab
          depressed
          color="primary"
          height="45"
          width="45"
          @click="$router.push('/verified-complaint/new')"
        >
          <span class="white--text font-weight-regular" style="font-size: 50px"
            >+</span
          >
        </v-btn>
      </div>
      <div class="table-custom-search">
        <i class="icofont-search-1" />
        <input v-model="search" type="text" placeholder="Search Cases" />
      </div>
    </div>

    <!-- <div class=" px-12 pt-10 d-flex justify-space-between"> -->
    <!-- <toggle v-model="evictionTable" onValue="evictions" offValue="delinquents"/> -->
    <!-- <toggle v-model="evictionTable" onValue="start eviction" offValue="new letter"/> -->
    <!-- </div> -->

    <!-- <div class="d-flex justify-end mt-4">
     <v-btn icon class="mr-2"><i style="font-size: 16px;" :class="`icofont-search font-weight-bold info--text pr-1`"></i></v-btn>
    <v-btn small @click="btn.onclick" color="white" rounded v-for="btn in tableButtons" :key="btn.title" class="mr-2 font-weight-regular px-4"><i style="font-size: 16px; color: #DAE3E9;" :class="`icofont-${btn.icon} pr-1`"></i> {{ btn.title }}</v-btn>
  </div> -->

    <div v-if="cases.length > 0" class="d-flex">
      <span class="secondary--text">Sort By:</span>
      <span class="mx-3 secondary--text font-weight-medium"
        >Recent Activity</span
      >
      <div class="d-flex info--text sort-actions">
        <span
          class="custom-sort-icon"
          :class="`${sortDirection === 'desc' ? 'active' : ''}`"
          @click="sortDescCases"
        >
          <arrow-up />
        </span>
        <span
          class="custom-sort-icon"
          :class="`${sortDirection === 'asc' ? 'active' : ''}`"
          @click="sortAscCases"
        >
          <arrow-down />
        </span>
        <!-- <i 
          class="icofont-long-arrow-up"
          :class="`${sortDirection === 'desc' ? 'active' : ''}`"
          @click="sortDescCases"
        />
        <i 
          class="icofont-long-arrow-down" 
          :class="`${sortDirection === 'asc' ? 'active' : ''}`"
          @click="sortAscCases" 
        /> -->
      </div>
    </div>

    <div>
      <eviction-table :search="search" />
    </div>
  </div>
</template>

<script>
import EvictionTable from "@/components/tables/EvictionTable";
import ArrowUp from "@/components/icons/ArrowUp.vue";
import ArrowDown from "@/components/icons/ArrowDown.vue";
import { differenceInCalendarDays } from "date-fns";
import { mapGetters } from "vuex";

// import ShouldLoginDialog from "@/components/dialogs/ShouldLoginDialog";

export default {
  name: "Main",
  components: {
    EvictionTable,
    ArrowUp,
    ArrowDown,
    // ShouldLoginDialog
  },
  data() {
    return {
      // showShouldLoginDialog: false,
      showUpcomingBanner: false,
      showEvictionBanner: false,
      search: "",
      sortDirection: "asc",
      tabs: [
        {
          name: "Evictions",
          component: "eviction-table",
        },
        {
          name: "Delinquent",
          component: "delinquent-table",
          items: [],
        },
        {
          name: "Notices",
          component: "eviction-table",
        },
      ],
      tableButtons: [
        {
          title: "export",
          icon: "download",
          onclick: () => {
            console.log("clicked");
          },
        },
        {
          title: "filter",
          icon: "filter",
          onclick: () => {
            this.filterDialogOpen = true;
          },
        },
      ],
      infoBar: {
        evictions: {
          number: 150,
          dataNum: 5,
          direction: "up",
        },
        delinquency: {
          number: "3.2%",
          dataNum: 7,
          direction: "up",
        },
        owed: {
          number: "$10,000",
          dataNum: 7,
          direction: "down",
        },
        collected: {
          number: "$12,000",
          dataNum: 7,
          direction: "up",
        },
      },
      evictionTable: true,
      filterDialogOpen: false,
    };
  },
  computed: {
    // ...mapGetters({
    //   caseSteps: "eviction/caseSteps",
    //   currentProperty: "property/currentProperty",
    // }),
    // tableDisplay() {
    //   return this.evictionTable
    //     ? {
    //         name: "Evictions",
    //         component: "eviction-table",
    //       }
    //     : {
    //         name: "Delinquent",
    //         component: "delinquent-table",
    //         items: [],
    //       };
    // },
    ...mapGetters({
      cases: "eviction/cases",
    }),
  },
  created() {
    if (!this.$auth.isAuthenticated) return this.$auth.loginWithRedirect();

    this.$store.dispatch("eviction/loadCases");

    //   const redirect_url = localStorage.getItem("redirect_url") || "";
    //   if (redirect_url) {
    //     this.$store.commit("set_loading", true);
    //     localStorage.removeItem("redirect_url");
    //     this.$auth.loginWithRedirect();
    //     return;
    //   }

    //   const isAuthParams = this.$route.query.authchecked;
    //   console.log("isAuthParams", isAuthParams);
    //   if (isAuthParams !== null && isAuthParams !== undefined) {
    //     if (!authenticated) {
    //       this.$auth.loginWithRedirect();
    //     } else {
    //       this.$router.push("/");
    //     }
    //   }
    this.showUpcomingBanner = !this.$store.getters.client.closedUpcomingBanner;
    const closedEvictionBannerTime =
      this.$store.getters.client.closedEvictionBannerTime;
    if (!closedEvictionBannerTime) this.showEvictionBanner = true;
    else {
      const diffInDays = differenceInCalendarDays(
        new Date(),
        new Date(closedEvictionBannerTime)
      );
      if (diffInDays >= 7) {
        this.showEvictionBanner = true;
      }
    }
  },
  methods: {
    closeUpcomingBanner() {
      this.showUpcomingBanner = false;
      this.$store.dispatch("updateUser", { closedUpcomingBanner: 1 });
    },
    closeEvictionBanner() {
      this.showEvictionBanner = false;
      const today = new Date().toISOString().slice(0, 10);
      this.$store.dispatch("updateUser", { closedEvictionBannerTime: today });
    },
    sortDescCases() {
      this.sortDirection = "desc";
      this.$store.dispatch("eviction/sortCases", this.sortDirection);
    },
    sortAscCases() {
      this.sortDirection = "asc";
      this.$store.dispatch("eviction/sortCases", this.sortDirection);
    },
  },
};
</script>

<style>
.custom-banner {
  position: relative;
  padding: 20px 30px 30px;
  border-radius: 15px;
  display: flex;
  align-items: baseline;
}

.eviction-banner {
  background: #ff854e39 0% 0%;
  border: 6px solid #ff854e;
}

.custom-banner .close-icon {
  position: absolute;
  cursor: pointer;
}

.custom-banner .text-part {
  margin-left: 20px;
}

.banner-title {
  font-size: 30px;
  line-height: 26px;
  font-weight: 500;
  margin-bottom: 16px;
}

.banner-description {
  margin: 0;
}

.upcoming-banner {
  background: #6a7fdb38;
  border: 6px solid #6a7fdb;
}

/* Table Search section style */
.table-custom-search i {
  color: #8ba4b4;
  margin-right: 20px;
}

.table-custom-search input {
  outline: none;
  color: #8ba4b4;
  font-size: 18px;
}

.table-custom-search input::placeholder {
  color: #8ba4b4;
}

.sort-actions i {
  cursor: pointer;
  width: 10px;
}

.sort-actions .custom-sort-icon {
  color: #8ba4b4;
  cursor: pointer;
}

.sort-actions .custom-sort-icon.active {
  color: #4dccc4;
}
</style>
