<template>
  <div id="app">
    <Navbar />
    <vue-page-transition
      name="fade-in-right"
      class="transition"
    >
      <router-view />
    </vue-page-transition>
    <div class="alerts-container">
      <Alert
        v-for="(alert, index) in this.$store.state.alerts"
        @close="closeAlert(index)"
        :key="index"
        :alert="alert.type === 'alert' ? true : false"
        :warning="alert.type === 'warning' ? true : false"
        :text="alert.text"
        :auto-close="alert.autoClose ? alert.autoClose : false"
      />
    </div>
  </div>
</template>

<script>
import Navbar from "./components/TheNavbar";
import Alert from "./components/Alert";
import convertColorToFilter from "@/mixins/convertColorToFilter";

export default {
  name: "App",
  components: {
    Navbar,
    Alert
  },
  mixins: [convertColorToFilter],
  methods: {
    closeAlert(index) {
      this.$store.dispatch("closeAlert", index);
    },
    loadTheme() {
      const fs = require("fs");
      const { remote } = require("electron");

      this.$store.dispatch("setDocumentsPath", remote.app.getPath("userData"));

      // Get all paths on the machine for needed themes
      const themesPath = this.$store.state.documentsPath + "/mustap/themes/";
      const defaultColorsPath = themesPath + "default.json";
      const currentColorsPath = themesPath + "currentTheme.json";

      // set colors of css variables based on the themes found
      if (fs.existsSync(defaultColorsPath)) {
        const currentColors = JSON.parse(fs.readFileSync(currentColorsPath));
        const root = document.documentElement.style;

        const propNames = [
          "--dark-bg",
          "--main-bg",
          "--lighter-bg",
          "--primary-text",
          "--secondary-text",
          "--accent-color",
          "--accent-color-secondary",
          "--navbar-logo-bg",
          "--alert-hover-color",
          "--filter"
        ];

        const currentColorsPropNames = [
          "darkBg",
          "mainBg",
          "lighterBg",
          "primaryText",
          "secondaryText",
          "accentColor",
          "accentColorSecondary",
          "navbarLogoBg",
          "alertHoverColor",
          "filter"
        ];

        propNames.forEach((val, index) => {
          root.setProperty(val, currentColors[currentColorsPropNames[index]]);
        });

        console.log(currentColors);

        this.$store.dispatch("setProp", {
          prop: "imageFilter",
          data: currentColors.filter
        });
      } else {
        // choses default values for colors that will be used if this is the first time the app has been loaded
        const defaultColors = {
          darkBg: "#000",
          mainBg: "#121212",
          lighterBg: "#242424",
          primaryText: "#FFF",
          secondaryText: "rgba(255, 255, 255, 0.7)",
          accentColor: "#E91EA4",
          accentColorSecondary: "#E91E63",
          navbarLogoBg: "#FFF",
          alertHoverColor: "#353535", // a bit lighter than lighterBG
          filter: this.convertColorToFilter("#FFF")
        };

        this.$store.dispatch("setProp", {
          prop: "imageFilter",
          data: defaultColors.filter
        });

        fs.promises
          .mkdir(themesPath, { recursive: true })
          .then(async () => {
            await fs.promises.writeFile(
              defaultColorsPath,
              JSON.stringify(defaultColors)
            );
            await fs.promises.writeFile(
              currentColorsPath,
              JSON.stringify(defaultColors)
            );
          })
          .catch(err => console.log(err));
      }
    },
  },
  mounted() {
    console.log("----App Mounted----");

    const that = this;

    this.$store.state.currentPlaying.sound.ontimeupdate = () => {
      that.$store.dispatch("setCurrentPlayingCurrentTime");
    };

   this.loadTheme();
  }
};
</script>

<style lang="scss">
@import url("https://fonts.googleapis.com/css?family=Poppins:400,500,600,700&display=swap");

.vue-range-slider > .slider {
  background-color: rgba(255, 255, 255, 0.15) !important;

  .slider-process {
    background-color: var(--accent-color) !important;
  }
}

:root {
  --dark-bg: #000;
  --main-bg: #121212;
  --lighter-bg: #242424;
  --primary-text: #fff;
  --secondary-text: rgba(255, 255, 255, 0.7);
  --accent-color: #e91ea4;
  --accent-color-secondary: #e91e63;
  --navbar-logo-bg: #fff;
  --alert-hover-color: #353535;
  --filter: invert(82%) sepia(0%) saturate(2767%) hue-rotate(314deg)
    brightness(116%) contrast(103%);
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Poppins";
  user-select: none;
}

body {
  width: 100%;
  height: 100vh;
  background-color: var(--main-bg);
  overflow: hidden;
}

#app {
  display: flex;
  width: 100vw;
  height: 100vh;
  flex-direction: row;
}

.transition {
  width: 100%;
}

.alerts-container {
  position: absolute;
  bottom: 10px;
  right: 10px;
  display: flex;
  flex-direction: column;
  width: 320px;
}

@keyframes fadeInRight {
from {
    transform: translate3d(40px, 0, 0);
}
to {
    transform: translate3d(0, 0, 0);
    opacity: 1;
}
}
.fade-in-right-leave-to[data-v-4c22b934] {
  opacity: 0;
  transition: opacity .3s;
}
.fade-in-right-enter[data-v-4c22b934] {
  opacity: 0;
  transform: translate3d(40px, 0, 0);
}
.fade-in-right-enter-to[data-v-4c22b934] {
  opacity: 0;
  animation-duration: .7s;
  animation-fill-mode: both;
  animation-name: fadeInRight;
}
</style>
