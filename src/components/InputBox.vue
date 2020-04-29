<template>
  <div
    class="container"
    :style="{ display: displayMode }"
  >
    <label
      for="input-box"
      class="label"
      :class="{ focused: focused || placeholder }"
      v-if="label"
    >{{ this.label }}</label>
    <input
      :style="{ width: `${width}px` }"
      type="text"
      class="input-box"
      :placeholder="placeholder === '.' ? '' : placeholder"
      v-model="input"
      @input="$emit('input', input)"
      @focus="focused = true"
      @blur="input.length > 0 ? null : focused = false"
      :maxlength="maxLength"
    >
  </div>
</template>

<script>
export default {
    name: "InputBox",
    props: {
        label: String,
        placeholder: String,
        width: Number,
        displayMode: String,
        maxLength: Number
    },
    data() {
        return {
            focused: false,
            input: ""
        }
    }
}
</script>

<style scoped lang="scss">
    .container {
        height: 45px;
        padding-top: 15px;
    }

    .label {
        font-size: 13px;
        color: var(--primary-text);
        position: absolute;
        margin-top: 4.5px;
        margin-left: 8px;
        transition: transform .3s ease, opacity .3s ease;
        opacity: 0.3;

        &.focused {
            transform: translateY(-24px) translateX(-8px);
            opacity: 0.6;
        }
    }

    .input-box {
        min-width: 100px;
        max-width: 300px;
        height: 30px;
        color: var(--primary-text);
        border-radius: 5px;
        padding: 5px 8px;
        padding-bottom: 6px;
        background-color: var(--lighter-bg);
        border: none;
        outline: none !important;
        font-size: 14px;

        &::placeholder {
            color: var(--primary-text);
            font-size: 13px;
            opacity: 0.2;
        }
    }
</style>