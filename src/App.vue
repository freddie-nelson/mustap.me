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
  },
  mounted() {
    for (let i = 0; i < 1000; i++) {
      clearInterval(i);   
    }
    setInterval(() => {
      console.log('Interval ran')
      const currentPlaying = this.$store.state.currentPlaying;
      currentPlaying.currentTimeSeconds = Math.ceil(currentPlaying.sound.currentTime);
      currentPlaying.progress = (currentPlaying.currentTimeSeconds / currentPlaying.lengthSeconds * 100).toFixed(2) + '%';
      console.log(currentPlaying.progress, currentPlaying.currentTimeSeconds)
    }, 1000)
  }
}
</script>

<style lang="scss">
  @import url('https://fonts.googleapis.com/css?family=Poppins:400,500,600,700&display=swap');

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
    background-color: #121212;
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
