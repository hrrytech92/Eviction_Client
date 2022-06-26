<template>
  <v-card class="pt-12 px-8 secondary--text" tile>
    <v-card-title class="my-2 display-1 secondary--text font-weight-medium">
      Add New Property
    </v-card-title>
    <v-card-subtitle class="secondary--text">
      <span class="font-weight-medium">Instructions:</span> Add your property
      information here. You may also integrate and import multiple properties
      here.
    </v-card-subtitle>
    <v-card-text>
      <v-row align-content="center">
        <v-col class="pt-0">
          <div class="font-weight-medium secondary--text pb-2">
            Property Type
          </div>
          <v-select
            v-model="property.propertyType"
            rounded
            hide-details
            solo
            flat
            dense
            background-color="#F0F5F6"
            :items="['Commercial', 'Building', 'Single Residence', 'Duplex']"
          >
            <v-icon slot="append" medium color="accent">
              mdi-chevron-down
            </v-icon>
          </v-select>
        </v-col>
        <v-col class="pt-0">
          <div class="font-weight-medium secondary--text pb-2">
            Type of Ownership
          </div>
          <v-select
            v-model="property.ownershipType"
            rounded
            hide-details
            solo
            flat
            dense
            background-color="#F0F5F6"
            :items="[
              'Sole Proprietor',
              'General Partner of the partnership',
              'Limited Liability Company (LLC)',
              'Corporation',
            ]"
          >
            <v-icon slot="append" medium color="accent">
              mdi-chevron-down
            </v-icon>
          </v-select>
        </v-col>
      </v-row>

      <div v-if="property.propertyType">
        <v-row
          v-if="
            property.propertyType === 'Commercial' ||
            property.propertyType === 'Building'
          "
          align-content="center"
        >
          <v-col>
            <div class="font-weight-medium secondary--text">Property Name</div>
            <div class="secondary--text pb-2">
              Helps identify property. For properties with multiple units, saves
              time on re-entering property information.
            </div>
            <v-text-field
              v-model="property.propertyName"
              rounded
              hide-details
              solo
              flat
              dense
              background-color="#F0F5F6"
            />
          </v-col>
        </v-row>

        <v-row align-content="center">
          <v-col cols="4">
            <div
              v-if="
                property.propertyType === 'Commercial' ||
                property.propertyType === 'Building'
              "
              class="font-weight-medium secondary--text pb-2"
            >
              Bldg #
            </div>
            <div v-else class="font-weight-medium secondary--text pb-2">
              House #
            </div>
            <v-text-field
              v-model="property.buildingNo"
              rounded
              hide-details
              solo
              flat
              dense
              background-color="#F0F5F6"
            />
          </v-col>
          <v-col cols="8">
            <div class="font-weight-medium secondary--text pb-2">
              Street Name
            </div>
            <v-text-field
              v-model="property.streetName"
              rounded
              hide-details
              solo
              flat
              dense
              background-color="#F0F5F6"
            />
          </v-col>
        </v-row>

        <v-row align-content="center">
          <v-col>
            <div class="font-weight-medium secondary--text pb-2">County</div>
            <v-text-field
              v-model="property.county"
              rounded
              hide-details
              solo
              flat
              dense
              background-color="#F0F5F6"
            />
          </v-col>
        </v-row>
        <v-col>
          <div class="font-weight-medium secondary--text pb-2">
            City/Municipality/Township
          </div>
          <v-text-field
            v-model="property.city"
            rounded
            hide-details
            solo
            flat
            dense
            background-color="#F0F5F6"
          />
        </v-col>

        <v-row align-content="center">
          <v-col>
            <div class="font-weight-medium secondary--text pb-2">State</div>
            <v-select
              v-model="property.state"
              rounded
              hide-details
              solo
              flat
              dense
              background-color="#F0F5F6"
              :items="states"
            >
              <v-icon slot="append" medium color="accent">
                mdi-chevron-down
              </v-icon>
            </v-select>
          </v-col>

          <v-col>
            <div class="font-weight-medium secondary--text pb-2">Zip Code</div>
            <v-text-field
              v-model="property.zipcode"
              rounded
              hide-details
              solo
              flat
              dense
              background-color="#F0F5F6"
            />
          </v-col>
        </v-row>
      </div>

      <div class="mb-3 mt-8 display-1 secondary--text font-weight-medium">
        Registration
      </div>
      <div class="secondary--text font-weight-medium">
        Landlord’s Registration or Certificate of Occupancy
      </div>
      <div class="secondary--text">
        Don’t have one? The courts require that rental properties in the state
        of New Jersey be registered. This link provides information how to
        obtain one. Do not delay.
      </div>
      <file-upload class="my-6" />
      <div class="secondary--text font-weight-medium">
        Expiration Date
        <v-btn fab color="primary" x-small height="18" width="18" class="ml-2">
          <v-icon x-small> mdi-help </v-icon>
        </v-btn>
      </div>
      <v-row>
        <v-col cols="5">
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
                v-model="registration.expirationDate"
                append-icon="$calendar"
                color="accent"
                readonly
                rounded
                hide-details
                solo
                flat
                dense
                background-color="#F0F5F6"
                @click:append="menu = true"
                v-on="on"
              />
            </template>
            <v-date-picker
              v-model="registration.expirationDate"
              @input="menu = false"
            />
          </v-menu>
        </v-col>
      </v-row>

      <div class="mb-3 mt-8 display-1 secondary--text font-weight-medium">
        Property Owner
      </div>
      <div class="secondary--text">
        <span class="font-weight-medium">Note: </span> The owner is the person
        that owns the property, not the person that manages it.
      </div>
      <div class="secondary--text font-weight-medium pt-6">
        Are you the Property Owner?
      </div>
      <v-row>
        <v-col cols="5">
          <v-select
            v-model="property.clientIsOwner"
            rounded
            hide-details
            solo
            flat
            dense
            background-color="#F0F5F6"
            :items="[
              { text: 'Yes', value: true },
              { text: 'No', value: false },
            ]"
          >
            <v-icon slot="append" medium color="accent">
              mdi-chevron-down
            </v-icon>
          </v-select>
        </v-col>
      </v-row>

      <div
        v-if="!property.clientIsOwner"
        class="mt-4 pa-6"
        style="background-color: #fafbfc"
      >
        <span
          v-if="
            property.ownershipType === 'Corporation' ||
            property.ownershipType === 'Limited Liability Company (LLC)'
          "
        >
          <div class="font-weight-medium secondary--text pb-2">
            Company Name
          </div>
          <v-text-field
            v-model="property.owner.company"
            rounded
            hide-details
            solo
            flat
            dense
            background-color="#F0F5F6"
            class="pb-4"
          />
        </span>
        <v-row align-content="center">
          <v-col class="pt-0">
            <div class="font-weight-medium secondary--text pb-2">
              First Name
            </div>
            <v-text-field
              v-model="property.owner.firstName"
              rounded
              hide-details
              solo
              flat
              dense
              background-color="#F0F5F6"
            />
          </v-col>
          <v-col class="pt-0">
            <div class="font-weight-medium secondary--text pb-2">
              Middle Name
            </div>
            <v-text-field
              v-model="property.owner.middleName"
              rounded
              hide-details
              solo
              flat
              dense
              background-color="#F0F5F6"
            />
          </v-col>
          <v-col class="pt-0">
            <div class="font-weight-medium secondary--text pb-2">Last Name</div>
            <v-text-field
              v-model="property.owner.lastName"
              rounded
              hide-details
              solo
              flat
              dense
              background-color="#F0F5F6"
            />
          </v-col>
        </v-row>
      </div>

      <div class="mb-3 mt-8 display-1 secondary--text font-weight-medium">
        Mailing Address
      </div>
      <div class="secondary--text">
        <span class="font-weight-medium">Instructions: </span> Unless otherwise
        indicated, all court correspondence will be sent to the address you have
        on your
        <router-link
          class="accent--text no-text-dec font-weight-medium"
          :to="{ name: 'profile' }"
          target="_blank"
        >
          Profile </router-link
        >. You may specify a different mailing address for this property.
      </div>
      <div class="secondary--text font-weight-medium pt-6">
        Use alternate address?
      </div>
      <v-row>
        <v-col cols="5">
          <v-select
            v-model="property.useAltAddress"
            rounded
            hide-details
            solo
            flat
            dense
            background-color="#F0F5F6"
            :items="[
              { text: 'Yes', value: true },
              { text: 'No', value: false },
            ]"
          >
            <v-icon slot="append" medium color="accent">
              mdi-chevron-down
            </v-icon>
          </v-select>
        </v-col>
      </v-row>

      <div
        v-if="useAltAddress"
        class="mt-4 pa-6 secondary--text"
        style="background-color: #fafbfc"
      >
        <div class="font-weight-medium secondary--text pb-1">
          Mailing Address
        </div>
        <div>
          Provide the address to which you would like to receive correspondence.
        </div>
        <div class="font-weight-medium secondary--text pt-4 pb-2">
          Street Address
        </div>
        <v-text-field
          v-model="property.altAddress.street"
          rounded
          hide-details
          solo
          flat
          dense
          background-color="#F0F5F6"
        />
        <v-row class="pt-4" align-content="center">
          <v-col class="pt-0">
            <div class="font-weight-medium secondary--text pb-2">City</div>
            <v-text-field
              v-model="property.altAddress.city"
              rounded
              hide-details
              solo
              flat
              dense
              background-color="#F0F5F6"
            />
          </v-col>
          <v-col class="pt-0">
            <div class="font-weight-medium secondary--text pb-2">State</div>
            <v-select
              v-model="property.altAddress.state"
              rounded
              hide-details
              solo
              flat
              dense
              background-color="#F0F5F6"
              :items="states"
            >
              <v-icon slot="append" medium color="accent">
                mdi-chevron-down
              </v-icon>
            </v-select>
          </v-col>
          <v-col class="pt-0">
            <div class="font-weight-medium secondary--text pb-2">Zip Code</div>
            <v-text-field
              v-model="property.altAddress.zipcode"
              rounded
              hide-details
              solo
              flat
              dense
              background-color="#F0F5F6"
            />
          </v-col>
        </v-row>
      </div>

      <div class="mb-3 mt-8 display-1 secondary--text font-weight-medium">
        Group Settings
      </div>
      <div class="secondary--text">
        Would you like to apply Group Settings to this property?
        <v-btn fab color="primary" x-small height="18" width="18" class="ml-2">
          <v-icon x-small> mdi-help </v-icon>
        </v-btn>
      </div>

      <v-row>
        <v-col cols="5">
          <v-select
            v-model="property.groupSettings"
            rounded
            hide-details
            solo
            flat
            dense
            background-color="#F0F5F6"
            :items="['Setting 1', 'Setting 2', 'Create New']"
          >
            <v-icon slot="append" medium color="accent">
              mdi-chevron-down
            </v-icon>
          </v-select>
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <!-- 
            <v-btn
                color="accent"
                text
                @click="()=>this.$emit('change:dialog', '')"
            >
                cancel
            </v-btn> -->

      <v-btn
        rounded
        color="accent"
        dark
        class="px-8"
        small
        depressed
        @click="submit"
      >
        Add
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import FileUpload from "@/components/FileUpload";
export default {
  name: "NewPropertyDialog",
  components: {
    FileUpload,
  },
  data() {
    return {
      property: {
        propertyType: "",
        ownershipType: "",
        buildingNo: "",
        streetName: "",
        city: "",
        state: "New Jersey",
        zipcode: "",
        county: "",
        clientIsOwner: true,
        owner: {
          company: "",
          firstName: "",
          middleName: "",
          lastName: "",
        },
        useAltAddress: false,
        altAddress: {
          street: "",
          city: "",
          state: "",
          zipcode: "",
        },
        groupSettings: "",
      },
      registration: {
        document: {},
        expirationDate: "",
      },
      states: [
        "Alabama",
        "Alaska",
        "Arizona",
        "Arkansas",
        "California",
        "Colorado",
        "Connecticut",
        "Delaware",
        "District of Columbia",
        "Florida",
        "Georgia",
        "Hawaii",
        "Idaho",
        "Illinois",
        "Indiana",
        "Iowa",
        "Kansas",
        "Kentucky",
        "Louisiana",
        "Maine",
        "Maryland",
        "Massachusetts",
        "Michigan",
        "Minnesota",
        "Mississippi",
        "Missouri",
        "Montana",
        "Nebraska",
        "Nevada",
        "New Hampshire",
        "New Jersey",
        "New Mexico",
        "New York",
        "North Carolina",
        "North Dakota",
        "Ohio",
        "Oklahoma",
        "Oregon",
        "Pennsylvania",
        "Rhode Island",
        "South Carolina",
        "South Dakota",
        "Tennessee",
        "Texas",
        "Utah",
        "Vermont",
        "Virginia",
        "Washington",
        "West Virginia",
        "Wisconsin",
        "Wyoming",
      ],
    };
  },
};
</script>

<style></style>
