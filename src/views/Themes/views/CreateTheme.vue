<template>
  <div class="createTheme">
    <div class="createTheme__top">
      <div class="createTheme__preview">
        <ThemeItem
          :colors="colors"
          :preview="true"
          :refresh="refresh"
        />
      </div>
      <div class="createTheme__input-fields">
        <InputBox
          class="createTheme__input-field"
          label="Theme Name"
          :width="250"
          @input="themeName = $event"
          placeholder="Name..."
          :max-length="18"
        />
        <InputBox
          class="createTheme__input-field"
          label="Theme Description"
          :width="250"
          @input="themeDescription = $event"
          placeholder="Description..."
          :max-length="30"
        />
        <Dropdown
          style="margin-top: 9px"
          :options="themeTypeOptions"
          :selected="0"
          label="Theme Type"
          @clicked-option="themeType = themeTypeOptions[$event]"
        />
      </div>
    </div>
    <div class="createTheme__bottom">
      <color-picker
        class="createTheme__color-picker"
        id="colorPicker"
        v-model="color"
      />
    </div>
  </div>
</template>

<script>
import ThemeItem from "../components/ThemeItem";
import InputBox from "@/components/InputBox";
import Dropdown from "@/components/Dropdown";
import { Chrome } from "vue-color";

export default {
    name: "CreateTheme",
    components: {
      ThemeItem,
      InputBox,
      Dropdown,
      "color-picker": Chrome
    },
    data() {
      return {
        colors: {},
        color: "#FFF",
        refresh: false,
        themeName: "",
        themeTypeOptions: [ "Dark", "Light" ],
        themeType: "Dark"
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
    flex-direction: column;
    padding: 60px;

    &__top {
      display: flex;
    }

    &__bottom {
      margin-top: 40px;
    }

    &__preview {
      position: relative;
      width: 420px;
      height: 357px;
      margin-right: 30px;

      > div {
        transform-origin: top left;
        transform: scale(1.4);
      }
    }

    &__input-field {
      margin-top: 15px;

      &:first-of-type {
        margin-top: 0px;
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