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
      :style="{ width: `${width}px`, fontSize: `${fontSize}px`, height: `${height}px` }"
      :type="typeData"
      class="input-box"
      :placeholder="placeholder === '.' ? '' : placeholder"
      v-model="input"
      @input="$emit('input', input)"
      @focus="focused = true"
      @blur="input.length > 0 ? null : focused = false"
      :maxlength="maxLength"
    >
    <img
      v-if="type === 'password'"
      :src="typeData === 'password' ? require('@/assets/svg/hide.svg') : require('@/assets/svg/show.svg')"
      @click="typeData === 'password' ? typeData = 'text' : typeData = 'password'"
      alt="Show password"
      class="password-show-btn"
      :style="{ filter: this.$store.getters.imageFilter, 
                width: typeData === 'password' ? '16px' : '18px', 
                marginLeft: typeData === 'password' ? '5px' : '4px',
                paddingTop: typeData === 'password' ? '19px' : '20px' }"
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
        maxLength: Number,
        fontSize: Number,
        height: {
          type: Number,
          default: 30
        },
        type: {
          type: String,
          default: "text"
        }
    },
    data() {
        return {
            focused: false,
            input: "",
            typeData: this.type
        }
    }
}
</script>

<style scoped lang="scss">
    .container {
        height: 45px;
        padding-top: 15px;
        position: relative;
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

    .password-show-btn {
      position: absolute;
      margin: auto 0;
      padding-top: 15px;
      margin-left: 3px;
      width: 18px;
      top: 0;
      bottom: 0;
      cursor: pointer;
      opacity: .5;
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