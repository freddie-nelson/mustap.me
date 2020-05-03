<template>
  <div class="dropdown">
    <label
      class="dropdown__label"
      for="dropdown"
      v-if="label"
    >{{ this.label }}</label>
    <div
      :style="{ marginTop: label ? 0 : '5px' }"
      class="dropdown__selected"
      @click="dropdown = !dropdown"
    >
      {{ this.options[this.selectedNum] }}
      <img
        src="../assets/svg/chevron-down.svg"
        alt=""
        :class="{ flip: dropdown }"
        :style="{ filter: $store.getters.imageFilter }"
      >
    </div>
    <div
      class="dropdown__options"
      :class="{ show: dropdown }"
    >
      <div
        class="dropdown__option"
        v-for="(option, i) in options"
        @click="clickedOption(i)"
        :key="i"
      >
        {{ option }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Dropdown",
  data() {
    return {
      dropdown: false,
      selectedNum: this.selected
    };
  },
  props: {
    options: Array,
    selected: Number,
    label: String
  },
  methods: {
    clickedOption(i) {
      this.selectedNum = i;
      this.dropdown = false;
      this.$emit("clicked-option", i);
    }
  }
};
</script>

<style lang="scss" scoped>
.dropdown {
  width: 250px;
  color: var(--secondary-text);
  position: relative;

  &__label {
    font-size: 13px;
    color: var(--primary-text);
    opacity: 0.6;
    }

  &__selected {
    color: var(--primary-text);
    width: 100%;
    display: flex;
    padding: 2px 10px;
    background: var(--lighter-bg);
    margin-top: 5px;
    border-radius: 5px;
    position: relative;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    z-index: 1;

    img {
      height: 7px;
      transform: scale(1.1);
      transform-origin: center;

      &.flip {
        transform: scale(1.1) rotate(180deg);
      }
    }
  }

  &__options {
    position: absolute;
    padding: 5px;
    padding-top: 10px;
    margin-top: -5px;
    border-radius: 0px 0px 5px 5px;
    width: 250px;
    background-color: var(--lighter-bg);
    transition: transform 0.2s ease-out;
    transform-origin: top center;
    transform: scaleY(0);
    z-index: 2;

    &.show {
      transform: scaleY(1);
    }
  }

  &__option {
    padding: 2px 6px;
    width: 100%;
    margin-top: 3px;
    transition: background-color 0.3s ease-in;
    border-radius: 5px;
    cursor: pointer;

    &:first-of-type {
      margin-top: 0;
    }

    &:hover {
      background-color: rgba(255, 255, 255, 0.1);
      color: var(--primary-text);
    }
  }
}
</style>
