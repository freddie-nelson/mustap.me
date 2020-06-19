<template>
  <div
    id="app"
    ref="app"
  >
    <div class="edges">
      <div />
      <div />
      <div />
    </div>
    <TitleBar />
    <section
      name="main"
      class="main"
    >
      <Navbar
        ref="navbar"
      />
      <vue-page-transition
        name="fade-in-right"
        class="transition"
      >
        <router-view
          ref="app"
          @loaded="doneLoading"
        />
      </vue-page-transition>
      <div class="alerts-container">
        <transition-group name="fade">
          <Alert
            v-for="(alert, index) in this.$store.state.alerts"
            @close="closeAlert(index)"
            :key="index"
            :alert="alert.type === 'alert' ? true : false"
            :warning="alert.type === 'warning' ? true : false"
            :success="alert.type === 'success' ? true : false"
            :text="alert.text"
            :auto-close="alert.autoClose ? alert.autoClose : false"
          />
        </transition-group>
      </div>
    <!-- <CurrentlyPlayingBar /> -->
    </section>
  </div>
</template>

<script>
import Navbar from "./components/TheNavbar";
import Alert from "./components/Alert";
import TitleBar from "./components/TitleBar";
// import CurrentlyPlayingBar from "./components/CurrentlyPlayingBar";
import convertColorToFilter from "@/mixins/convertColorToFilter";
import loadTheme from "@/mixins/loadTheme";

export default {
  name: "App",
  components: {
    Navbar,
    Alert,
    TitleBar
    // CurrentlyPlayingBar
  },
  mixins: [convertColorToFilter, loadTheme],
  methods: {
    doneLoading() {
      const spinner = document.getElementById("loading-spinner");
      
      if (!spinner) return;

      spinner.style.opacity = 0;
      setTimeout(() => spinner.remove(), 1000)
    },
    closeAlert(index) {
      this.$store.dispatch("closeAlert", index);
    },
    loadSettings() {
      const fs = require("fs");
      const settingsPath = this.$store.state.documentsPath + "/settings.json";

      if (!fs.existsSync(settingsPath)) {
        const { settings } = require("./settings");

        try {
          fs.writeFileSync(settingsPath, JSON.stringify(settings))
        } catch (e) {
          console.log(e);
        }
      }

      fs.promises.readFile(settingsPath)
        .then(res => JSON.parse(res))
        .then(data => {
          const { Volume, Appearance, Other } = data;

          // set volume
          this.$store.dispatch("changeVolumeSlider", Volume.volume)

          // set font-family
          document.documentElement.style.setProperty("--font", Appearance.fonts.options[Appearance.fonts.selected])

          // change view if needed
          const page = Other["page Displayed On Launch"];
          
          if (this.$route.name !== page.options[page.selected]) {
            this.$router.push({ name: page.options[page.selected] })
          }

          // set settings in vuex
          this.$store.dispatch("setProp", { prop: "settings", data: data })
        })
        .catch(err => console.log(err));

      window.addEventListener("beforeunload", () => {
        // Save settings before quitting 
        const settings = this.$store.state.settings;
        settings.Volume.volume = this.$store.state.currentPlaying.volume;

        fs.writeFileSync(settingsPath, JSON.stringify(settings));
      });
    }
  },
  mounted() {
    console.log("----App Mounted----");

    this.$root.$refs.app = this.$refs.app

    const that = this;

    this.$store.state.currentPlaying.sound.ontimeupdate = () => {
      that.$store.dispatch("setCurrentPlayingCurrentTime");
    };

   this.loadTheme();
   this.loadSettings();
  }
};
</script>

<style lang="scss">
.vue-range-slider > .slider {
  background-color: rgba(255, 255, 255, 0.15) !important;

  // &:hover {
  //   .slider-dot {
  //     opacity: 1;
  //   }
  // }

  // .slider-dot {
  //   opacity: 0;
  //   transition: opacity .3s ease-out;
  // }

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
  --font: "Poppins";
}

.slider-dot-handle {
  background-color: var(--primary-text) !important;
  box-shadow: none !important;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: var(--font);
  user-select: none;
  
  &::selection {
    background-color: var(--accent-color);
  }
}

img, a {
  -webkit-user-drag: none;
}

body {
  width: 100%;
  height: 100vh;
  background-color: var(--main-bg);
  overflow: hidden;
}

.main {
  // display: grid;
  position: relative;
  display: flex;
  width: 100vw;
  height: calc(100vh - 40px);
  flex-direction: row;
  // grid-template-rows: calc(100vh - 100px) 100px;
  // grid-template-rows: 1fr;
  // grid-template-columns: 80px 1fr;
  // transition: grid-template-columns .2s ease;
  // grid-template-areas: "navbar main"
                      //  "currently-playing-bar currently-playing-bar";
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
  z-index: 10;
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
