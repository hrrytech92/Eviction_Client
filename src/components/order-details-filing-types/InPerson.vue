<template>
  <div>
    <div class="d-flex pb-12">
      <div class="pr-8">
        <i class="icofont-copy-invert icofont-2x info--text" />
      </div>
      <div>
        <div
          class="text-left font-weight-medium info--text text-uppercase pb-2"
        >
          COPIES
        </div>
        <div>
          <!-- Include the original executed copy of the
          <span class="font-weight-bold">Verified Complaint</span> and
          <span class="font-weight-bold">Tenant Summons</span>. Sign the
          <span class="font-weight-bold">Verified Complaint</span> in ink. Make
          two (2) copies of the pleadings for each tenant listed as a defendant.
          Do not staple the
          <span class="font-weight-bold">Verified Complaint</span> and
          <span class="font-weight-bold">Tenant Summons</span>
          together, staple them individually. -->
          Sign all documents in ink, where indicated. Make two (2) copies of the
          pleadings for each tenant listed as a defendant. Do not staple all of
          the documents together as one; you may staple each pleading
          individually. Be sure to include the Cover Letter and Landlord Case
          Information Statement.
        </div>
      </div>
    </div>
    <div class="d-flex pb-12">
      <div class="pr-8">
        <i class="icofont-document-folder icofont-2x info--text" />
      </div>
      <div>
        <div
          class="text-left font-weight-medium info--text text-uppercase pb-2"
        >
          FILING
        </div>
        <div class="pb-4">
          Pleadings <u>must</u> be filed with the court. You may submit your
          pleadings in person of the following location.
        </div>
        <div>{{ courtAddress.county }} County Courthouse</div>
        <div>
          {{ courtAddress.street }}
        </div>
        <div>
          {{ courtAddress.city }},
          {{ courtAddress.state }}
          {{ courtAddress.zipcode }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "InPerson",
  computed: {
    ...mapGetters({
      // mileage: "eviction/mileage",
      courtAddress: "eviction/courtInfo",
    }),
  },
};
</script>

<style></style>
