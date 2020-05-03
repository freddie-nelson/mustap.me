<template>
  <div
    id="app"
    ref="app"
  >
    <Navbar
      ref="navbar"
    />
    <vue-page-transition
      name="fade-in-right"
      class="transition"
    >
      <router-view ref="app" />
    </vue-page-transition>
    <div class="alerts-container">
      <transition-group name="fade">
        <Alert
          v-for="(alert, index) in this.$store.state.alerts"
          @close="closeAlert(index)"
          :key="index"
          :alert="alert.type === 'alert' ? true : false"
          :warning="alert.type === 'warning' ? true : false"
          :text="alert.text"
          :auto-close="alert.autoClose ? alert.autoClose : false"
        />
      </transition-group>
    </div>
    <!-- <CurrentlyPlayingBar /> -->
  </div>
</template>

<script>
import Navbar from "./components/TheNavbar";
import Alert from "./components/Alert";
// import CurrentlyPlayingBar from "./components/CurrentlyPlayingBar";
import convertColorToFilter from "@/mixins/convertColorToFilter";
import loadTheme from "@/mixins/loadTheme";

export default {
  name: "App",
  components: {
    Navbar,
    Alert,
    // CurrentlyPlayingBar
  },
  mixins: [convertColorToFilter, loadTheme],
  methods: {
    closeAlert(index) {
      this.$store.dispatch("closeAlert", index);
    }
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
@import url("https://fonts.googleapis.com/css?family=Poppins:300,400,500,600,700&display=swap");

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
}

.slider-dot-handle {
  background-color: var(--primary-text) !important;
  box-shadow: none !important;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Poppins";
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

#app {
  // display: grid;
  display: flex;
  width: 100vw;
  height: 100vh;
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
