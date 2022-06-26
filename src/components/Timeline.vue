<template>
  <v-timeline dense align-top class="timeline-custom secondary--text">
    <v-timeline-item
      v-for="item in completed"
      :key="item.id"
      color="primary"
      small
      fill-dot
      class="done-dot pb-4"
    >
      <div class="font-weight-bold">
        {{ item.step }}
      </div>
      <span>{{ item.subtitle }}</span>
      <v-divider class="mt-2 mr-6" />
    </v-timeline-item>

    <v-timeline-item
      v-for="item in noncompleted"
      :key="item.id"
      color="#F0F5F6"
      small
    >
      <div class="font-weight-bold">
        {{ item.step }}
      </div>
      <span class="font-small">{{ item.subtitle }}</span>
      <v-divider class="mt-2 mr-6" />
    </v-timeline-item>
  </v-timeline>
</template>

<script>
export default {
  name: "Timeline",
  props: {
    currentStep: {
      type: Number,
      default: 0,
    },
    timelineItems: {
      type: Array,
      default: () => [],
    },
  },
  data: () => ({}),
  computed: {
    completed() {
      return this.timelineItems.slice(0, this.currentStep);
    },
    noncompleted() {
      return this.timelineItems.slice(this.currentStep);
    },
  },
};
</script>

<style>
.v-timeline {
  padding-top: 0px;
  margin-left: -1.5em;
}
/* .v-timeline::before {
display: inline-block;
content: '';
width: 5px;
height: 100%;
border-left: 2px solid rgb(177, 23, 23);
} */
.v-timeline-item__body {
  font-size: small;
}
.v-timeline-item__dot--small .v-timeline-item__inner-dot {
  height: 20px;
  margin: 2px;
  width: 20px;
}

.font-small {
  font-size: 0.7rem;
}

.theme--light.v-timeline .v-timeline-item__dot {
  background: #4dccc4;
  box-shadow: none;
  -webkit-box-shadow: none;
}

/* .theme--light.v-timeline::before {
    background: #4dccc4;
} */
</style>
