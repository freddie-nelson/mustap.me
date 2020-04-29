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
import loadTheme from "@/mixins/loadTheme";

export default {
  name: "App",
  components: {
    Navbar,
    Alert
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
