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
        <div class="createTheme__colors">
          <div
            class="color"
            v-for="(colorSquare, index) in Object.keys(colors).filter(color => color !== 'filter')"
            :key="index"
            :style="{ backgroundColor: colors[colorSquare] }"
            @click="() => { color = colors[colorSquare]; currentlyChanging = colorSquare; }"
          />
        </div>
        <p class="createTheme__currentlyChanging">
          Changing {{ this.currentlyChangingUserFriendly }}
        </p>
      </div>
      <div>
        <color-picker
          class="createTheme__color-picker"
          id="colorPicker"
          :value="color"
          @input="updateColors"
        />
        <div class="createTheme__buttons">
          <Button
            text="Generate Theme"
            :filled="true"
            @clicked="generateTheme"
          />
        </div>
      </div>
    </div>
    <div class="createTheme__bottom" />
  </div>
</template>

<script>
import convertColorToFilter from "@/mixins/convertColorToFilter"
import ThemeItem from "../components/ThemeItem";
import InputBox from "@/components/InputBox";
import Dropdown from "@/components/Dropdown";
import Button from "@/components/Button";
import { Chrome } from "vue-color";
import firebase from "firebase/app";
import "firebase/firestore";

export default {
    name: "CreateTheme",
    mixins: [convertColorToFilter],
    components: {
      ThemeItem,
      InputBox,
      Dropdown,
      Button,
      "color-picker": Chrome
    },
    data() {
      return {
        colors: {},
        color: "#FFF",
        refresh: false,
        themeName: "",
        themeDescription: "",
        themeTypeOptions: [ "Dark", "Light" ],
        themeType: "Dark",
        currentlyChanging: ""
      }
    },
    computed: {
      currentlyChangingUserFriendly() {
        switch (this.currentlyChanging) {
          case "darkBg":
            return "Dark Background"
          case "mainBg":
            return "Main Background"
          case "lighterBg":
            return "Light Background"
          case "primaryText":
            return "Primary Text"
          case "secondaryText":
            return "Secondary Text"
          case "accentColor":
            return "Accent Color"
          case "accentColorSecondary":
            return "Accent Color Two"
          case "navbarLogoBg":
            return "Navbar Logo"
          case "alertHoverColor":
            return "Alert Hover Color"
          case "iconColor":
            return "Icon Color"
          default:
            return ""
        }
      }
    },
    methods: {
      updateColors(e) {
        if (!this.currentlyChanging) return;
        
        if (this.currentlyChanging === "iconColor") {
          const filter = this.convertColorToFilter(e.hex);
          this.$set(this.colors, "filter", filter);
        }

        this.$set(this.colors, this.currentlyChanging, e.hex8);
        this.refresh = !this.refresh;
      },
      generateTheme() {
        const regex = /^[a-zA-Z0-9 ]*$/;

        if (!this.themeName || !this.themeDescription) {
          this.$store.dispatch('addAlert', { text: "All fields are required to generate the theme.", type: "warning", autoClose: true })
          return;
        } else if (!regex.test(this.themeName) || !regex.test(this.description)) {
          this.$store.dispatch('addAlert', { text: "Only characters A-Z and 0-9 are allowed in the theme name and description.", type: "warning", autoClose: true })
          return;
        }
        
        const theme = {
          name: this.themeName,
          description: this.themeDescription,
          creator: "Mustap",
          type: this.themeType,
          colors: this.colors
        }

        this.publishTheme(theme);
      },
      publishTheme(theme) {
        const firestore = firebase.firestore();
        const themesCollection = firestore.collection("themes");

        const docName = theme.name.toLowerCase().split(" ").filter(text => text !== " ").join("_");
        const docRef = themesCollection.doc(docName);
        
        docRef.get()
          .then(doc => {
            if (doc.exists) {
              this.$store.dispatch('addAlert', { text: "Sorry that name is already taken.", type: "alert", autoClose: true })
              return
            } else {
              docRef.set(theme)
                .then(() => {
                  this.$store.dispatch('addAlert', { text: "Theme successfully published!", type: "alert", autoClose: true })
                })
                .catch(err => {
                  this.$store.dispatch('addAlert', { text: "Sorry your theme could not be published at this time. Error: " + err, type: "warning", autoClose: true })
                })
            }
          })
        
      },
      fixColorsOrder(colors) {
        const fixedColors = {
          darkBg: colors.darkBg,
          mainBg: colors.mainBg,
          lighterBg: colors.lighterBg,
          primaryText: colors.primaryText,
          secondaryText: colors.secondaryText,
          accentColor: colors.accentColor,
          accentColorSecondary: colors.accentColorSecondary,
          iconColor: colors.iconColor,
          alertHoverColor: colors.alertHoverColor,
          navbarLogoBg: colors.navbarLogoBg,
          filter: colors.filter
        }

        return fixedColors
      }
    },
    mounted() {
      const fs = require("fs");
      const path = this.$store.state.documentsPath + "/mustap/themes/currentTheme.json";

      fs.promises.readFile(path)
        .then(data => {
          const colors =  JSON.parse(data).colors;
          this.colors = this.fixColorsOrder(colors);
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

    &__top {
      display: flex;
      flex-wrap: wrap;

      @media screen and (max-width: 1119px) {
        justify-content: space-around;
      }
    }

    &__bottom {
      margin-top: 40px;
    }

    &__preview {
      position: relative;
      width: 420px;
      height: 357px;
      margin-right: 30px;
      margin-bottom: 30px;

      > div {
        transform-origin: top left;
        transform: scale(1.4);
      }
    }

    &__input-fields {
      margin-right: 30px;

      @media screen and (max-width: 1340px) {
        margin-right: 0;
      }
    }

    &__input-field {
      margin-top: 15px;

      &:first-of-type {
        margin-top: 0px;
      }
    }

    &__colors {
      width: 230px;
      margin-top: 15px;
      display: grid;
      grid-template-columns: repeat(5, 35px);
      grid-template-rows: repeat(2, 35px);
      grid-gap: 14px;
      background-color: #ffffff38;
      box-sizing: content-box;
      padding: 10px;
      border-radius: 10px;

      .color {
        width: 35px;
        height: 35px;
        border-radius: 6px;
        background: white;
        cursor: pointer;
      }
    }

    &__currentlyChanging {
      margin-top: 5px;
      color: var(--secondary-text);
    }

    &__buttons {
      display: flex;
      margin-top: 10px;
      justify-content: flex-end;
    }

    &__color-picker#colorPicker {
      border-radius: 10px;
      background-color: var(--lighter-bg);
      box-shadow: none;
      height: 287px;

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