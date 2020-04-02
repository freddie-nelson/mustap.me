<template>
  <div id="app">
    <Navbar />
    <vue-page-transition name="fade-in-right" class="transition">
      <router-view></router-view>
    </vue-page-transition>
  </div>
</template>

<script>
import Navbar from './components/TheNavbar/TheNavbar'

export default {
  name: 'App',
  components: {
    Navbar
  }
}
</script>

<style lang="scss">
  @import url('https://fonts.googleapis.com/css?family=Poppins:400,500,600,700&display=swap');

  .vue-range-slider > .slider {
    background-color: rgba(255, 255, 255, 0.15) !important;

    .slider-process {
      background-color: $accent-color !important;
    }
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Poppins';
    user-select: none;
  }

  body {
    width: 100%;
    height: 100vh;
    background-color: $main-bg;
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
</style>
