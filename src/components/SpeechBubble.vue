<template>
  <div :class="`speech-bubble pa-6 ${textColor}--text d-flex`">
    <i class="icofont-info-square icofont-2x mx-6" />
    <div>
      <div :class="`custom-subtitle ${textColor}--text mb-4`">
        {{ title }}
      </div>
      <slot name="htmlBody" />
      <!-- <div style="font-size: 0.9rem; line-height: 1.45">
        {{ body }}
      </div> -->
    </div>
  </div>
</template>

<script>
export default {
  name: "SpeechBubble",
  props: {
    title: {
      type: String,
      default: "Not sure what this means?",
    },
    textColor: {
      type: String,
      default: "white",
    },
    // body: {
    //   type: String,
    //   default: "",
    // },
  },
};
</script>

<style>
.speech-bubble {
  position: relative;
  background: #6a7fdb;
  border-radius: 0.4em;
  max-width: 500px;
}

.speech-bubble:after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 52%;
  width: 0;
  height: 0;
  border: 20px solid transparent;
  border-top-color: #6a7fdb;
  border-bottom: 0;
  border-left: 0;
  margin-left: -10px;
  margin-bottom: -20px;
}
</style>
