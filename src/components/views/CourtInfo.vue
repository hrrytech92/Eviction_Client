<template>
  <div class="mx-auto">
    <v-btn
      color="info"
      icon
      class="float-right ma-8 btn--plain"
      @click="$emit('close:form')"
    >
      <v-icon>mdi-close</v-icon>
    </v-btn>

    <v-form
      ref="form"
      v-model="valid"
      style="width: 70%"
      class="px-8 pt-10 pb-4 mx-auto text-left"
    >
      <div class="custom-title py-8">Lease Details</div>
      <div class="text-left">
        <div class="font-weight-medium secondary--text pb-2">
          Lease Start Date
        </div>
        <v-menu
          v-model="menu"
          :close-on-content-click="false"
          :nudge-right="40"
          transition="scale-transition"
          offset-y
          min-width="290px"
        >
          <template v-slot:activator="{ on }">
            <v-text-field
              v-model="leaseStartDateConverted"
              append-icon="$calendar"
              color="accent"
              readonly
              rounded
              solo
              flat
              dense
              background-color="#F0F5F6"
              v-on="on"
              @click:append="menu = true"
            />
          </template>
          <v-date-picker
            v-model="leaseStartDate"
            no-title
            :show-current="false"
            color="primary"
            class="custom-date"
            @input="menu = false"
          />
        </v-menu>

        <div class="font-weight-medium secondary--text pb-2">Rent Cycle</div>
        <v-select
          v-model="rentCycle"
          rounded
          solo
          flat
          dense
          background-color="#F0F5F6"
          :items="rentCycles"
          @change="
            () => {
              if (rentCycle === 'Semi-monthly') {
                rentDueBy = [];
              }
            }
          "
        >
          <v-icon slot="append" medium color="accent">
            mdi-chevron-down
          </v-icon>
        </v-select>

        <div class="font-weight-medium secondary--text pb-2">Rent Due By</div>
        <v-select
          v-model="rentDueBy"
          rounded
          :multiple="rentCycle === 'Semi-monthly'"
          solo
          flat
          dense
          background-color="#F0F5F6"
          :items="rentDueByItems"
          @input="limiter"
        >
          <v-icon slot="append" medium color="accent">
            mdi-chevron-down
          </v-icon>
        </v-select>

        <div class="font-weight-medium secondary--text pb-2">
          Rent Amount
          <!-- <v-btn fab color="primary" x-small height="18" width="18" class="ml-2"><v-icon x-small>mdi-help</v-icon></v-btn> -->
        </div>
        <v-text-field
          v-model="rentAmount"
          rounded
          type="number"
          solo
          flat
          dense
          background-color="#F0F5F6"
        >
          <div slot="prepend-inner">$</div>
        </v-text-field>

        <div class="font-weight-medium secondary--text pb-2">Lease Type</div>
        <v-menu v-model="showMenu" offset-y>
          <template v-slot:activator="{ on }">
            <v-text-field
              v-model="leaseTypeDisplay"
              rounded
              solo
              flat
              dense
              background-color="#F0F5F6"
              readonly
            >
              <v-icon slot="append" medium color="accent" v-on="on">
                mdi-chevron-down
              </v-icon>
            </v-text-field>
          </template>

          <v-list dense>
            <template v-for="item in leaseTypes">
              <v-subheader
                v-if="item.header"
                :key="item.header"
                class="info--text font-weight-bold"
                v-text="item.header"
              />
              <v-list-item
                v-else
                :key="item.title + item.category"
                @click="updateType(item)"
              >
                <v-list-item-title>{{ item.title }}</v-list-item-title>
              </v-list-item>
            </template>
          </v-list>
        </v-menu>

        <div class="font-weight-medium secondary--text pb-2">
          Section 8 Voucher
          <!-- <v-btn fab color="primary" x-small height="18" width="18" class="ml-2"><v-icon x-small>mdi-help</v-icon></v-btn> -->
        </div>
        <v-select
          v-model="section8"
          rounded
          solo
          flat
          dense
          background-color="#F0F5F6"
          :items="['Yes', 'No']"
        >
          <v-icon slot="append" medium color="accent">
            mdi-chevron-down
          </v-icon>
        </v-select>

        <div
          v-if="section8 === 'Yes' && socialServicesOffice.housingAuthority"
          class="d-flex align-center justify-center selection-box mt-2"
          style="width: 100%"
        >
          <v-container>
            <v-row no-gutters align="center">
              <v-col
                cols="7"
                class="secondary--text"
                style="font-size: 0.85rem"
              >
                <div class="font-weight-medium">
                  {{ socialServicesOffice.housingAuthority }}
                </div>
                <div>{{ socialServicesOffice.address }}</div>
              </v-col>
              <v-spacer />
              <v-col cols="2">
                <v-btn
                  color="accent_light"
                  class="btn--plain text-left"
                  text
                  @click="verifySocialServicesDialogOpen = true"
                >
                  view
                </v-btn>
              </v-col>
              <v-col cols="1">
                <v-btn
                  color="accent_light"
                  class="btn--plain"
                  icon
                  small
                  @click="ssDialogOpen = true"
                >
                  <v-icon small> $pencil </v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
        </div>
        <div
          v-else-if="section8 === 'Yes'"
          class="d-flex align-center justify-center selection mt-2"
          style="width: 100%"
          @click="ssDialogOpen = true"
        >
          <span class="font-weight-medium" style="letter-spacing: 1.68px"
            >SELECT OFFICE</span
          >
        </div>
      </div>
    </v-form>

    <v-card-actions
      style="background-color: #fafbfc; border-radius: 0px 0px 10px 10px"
      class="justify-end py-4 pr-12 mt-12"
    >
      <v-btn
        rounded
        color="accent_light"
        class="mb-2 mt-4 btn--plain capital--btn"
        text
        @click="back"
      >
        go back
      </v-btn>
      <v-btn
        rounded
        color="accent_light"
        class="px-8 mb-2 mt-4 white--text capital--btn"
        depressed
        :disabled="!valid"
        @click="next"
      >
        continue
      </v-btn>
    </v-card-actions>
    <v-dialog v-model="ssDialogOpen" persistent value="''" max-width="800">
      <socialServicesDialog
        @close:dialog="closeDialog"
        @open-ss-dialog="openSSDialog"
        @update:office="updateOffice"
      />
    </v-dialog>
    <v-dialog
      v-model="verifySocialServicesDialogOpen"
      value="''"
      max-width="800"
    >
      <verifySocialServicesDialog
        :office="socialServicesOffice"
        @close:dialog="verifySocialServicesDialogOpen = false"
        @open-ss-dialog="openSSDialog"
      />
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: "CourtInfo",
  components: {},
  props: {},
  data() {
    return {};
  },
  computed: {
    leaseStartDateConverted() {
      return this.convertDateWithSlashes(this.leaseStartDate);
    },
  },
  methods: {},
};
</script>

<style></style>
