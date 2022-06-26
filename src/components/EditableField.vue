<template>
  <div class="editable-field">
    <span v-if="!editing" @click="toggleIsEditing" :style="valueStyles">
      {{ value }}
    </span>
    <input
      ref="input"
      v-else
      :value="value"
      type="text"
      @input="$emit('input', $event.target.value)"
      @keydown.enter="editing = false"
      :style="inputStyles"
    />
    <v-btn class="pl-3 btn--plain" icon @click="toggleIsEditing">
      <!-- <v-icon v-if="editing" size="20" color="#FF854E">
        mdi-content-save
      </v-icon> -->
      <span v-if="editing" style="color: #ff854e">save</span>
      <v-icon v-else size="18"> $pencil </v-icon>
    </v-btn>
  </div>
</template>

<script>
export default {
  name: "EditableField",
  props: {
    value: {
      type: [Number, String],
      default: 0,
    },
    valueStyles: {
      type: String,
      default: "",
    },
    inputStyles: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      editing: false,
    };
  },
  methods: {
    toggleIsEditing() {
      this.editing = !this.editing;
      if (this.editing) {
        this.$nextTick(() => {
          this.editing && this.$refs.input.focus();
        });
      } else this.$emit("save", this.value);
    },
  },
};
</script>

<style lang="scss">
.editable-field {
  // width: 100%;
  display: grid;
  grid-gap: 10px;
  grid-template-columns: auto 50px;
  align-items: center;
  input {
    padding: 0;
    // background: white;
    background: #f0f0f0;
    border-radius: 5px;
    &:focus {
      outline: none;
    }
  }
}
</style>
