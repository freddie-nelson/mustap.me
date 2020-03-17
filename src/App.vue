<template>
  <div id="app">
    <Navbar />
    <Home />
  </div>
</template>

<script>
import Navbar from './components/TheNavbar/TheNavbar'
import Home from './components/TheHome/TheHome'

export default {
  name: 'App',
  components: {
    Navbar,
    Home
  },
}
</script>

<style lang="scss">
  @import url('https://fonts.googleapis.com/css?family=Poppins:400,500,600,700&display=swap');

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Poppins'
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
</style>
