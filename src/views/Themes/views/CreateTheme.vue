<template>
  <div class="createTheme">
    <div class="createTheme__preview">
      <ThemeItem
        :colors="colors"
        :preview="true"
        :refresh="refresh"
      />
    </div>
    <color-picker
      class="createTheme__color-picker"
      id="colorPicker"
      v-model="color"
    />
  </div>
</template>

<script>
import ThemeItem from "../components/ThemeItem";
import { Chrome } from "vue-color";

export default {
    name: "CreateTheme",
    components: {
      ThemeItem,
      "color-picker": Chrome
    },
    data() {
      return {
        colors: {},
        color: "#FFF",
        refresh: false
      }
    },
    mounted() {
      const fs = require("fs");
      const path = this.$store.state.documentsPath + "/mustap/themes/currentTheme.json";

      fs.promises.readFile(path)
        .then(data => {
          this.colors = JSON.parse(data).colors;
          this.refresh = true;
        })
        .catch(err => console.log(err));
    }
}
</script>

<style lang="scss">
  .createTheme {
    display: flex;
    padding: 60px;

    &__preview {
      position: relative;
      width: 420px;
      height: 357px;
      margin-right: 40px;

      > div {
        transform-origin: top left;
        transform: scale(1.4);
      }
    }

    &__color-picker#colorPicker {
      border-radius: 10px;
      background-color: var(--lighter-bg);
      box-shadow: none;
      height: 260px;

      .vc-chrome-saturation-wrap {
        border-radius: 10px 10px 0 0;
      }

      .vc-chrome-body {
        background-color: var(--lighter-bg);

        .vc-chrome-color-wrap .vc-checkerboard {
          border: 1px solid var(--lighter-bg);
          border-radius: 15px;
        }

        .vc-hue, .vc-alpha-checkboard-wrap, .vc-alpha-gradient, .vc-alpha-container, .vc-alpha, .vc-checkerboard {
          border-radius: 7px;
        }

        input {
          background-color: var(--main-bg);
          box-shadow: none;
          border-radius: 7px;
          color: var(--secondary-text);
        }

        .vc-chrome-toggle-icon {
          path {
            fill: var(--primary-text);
            opacity: 0.2;
            transition: opacity 0.3s ease-out;
          }

          &:hover {
            path {
              opacity: 0.6;
            }
          }
        }

        .vc-chrome-toggle-icon-highlight {
          background: none;
          display: none;
        }
      }
    }
  }
</style>