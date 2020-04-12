<template>
  <div id="app">
    <Navbar />
    <vue-page-transition name="fade-in-right" class="transition">
      <router-view></router-view>
    </vue-page-transition>
    <div class="alerts-container">
      <Alert v-for="(alert, index) in this.$store.state.alerts" 
        @close="closeAlert(index)"
        :key="index" 
        :alert="alert.type === 'alert' ? true : false" 
        :warning="alert.type === 'warning' ? true : false" 
        :text="alert.text"
      />
    </div>
  </div>
</template>

<script>
import Navbar from './components/TheNavbar'
import Alert from './components/Alert'

export default {
  name: 'App',
  components: {
    Navbar,
    Alert
  },
  methods: {
    closeAlert(index) {
      this.$store.state.alerts = this.$store.state.alerts.filter((alert, i) => i !== index)
    }
  },
  mounted() {
    console.log('----App Mounted----')
    const fs = require('fs');
    const { remote } = require('electron')

    this.$store.state.documentsPath = remote.app.getPath('userData');

    // Get all paths on the machine for needed themes
    const themesPath = this.$store.state.documentsPath + '/mustap/themes/';
    const defaultColorsPath = themesPath + 'default.json';
    const currentColorsPath = themesPath + 'currentTheme.json'
    
    // set colors of css variables based on the themes found
    if (fs.existsSync(defaultColorsPath)) {
      const currentColors = JSON.parse(fs.readFileSync(currentColorsPath))
      const root = document.documentElement.style;

      const propNames = [ '--dark-bg', '--main-bg', '--lighter-bg', '--primary-text', '--secondary-text', '--accent-color', '--accent-color-secondary', '--navbar-logo-bg', '--alert-hover-color' ];
      const currentColorsPropNames = [ 'darkBg', 'mainBg', 'lighterBg', 'primaryText', 'secondaryText', 'accentColor', 'accentColorSecondary', 'navbarLogoBg', 'alertHoverColor' ];

      propNames.forEach((val, index) => root.setProperty(val, currentColors[currentColorsPropNames[index]]));

    } else {
      // choses default values for colors that will be used if this is the first time the app has been loaded
      const defaultColors = {
        darkBg: '#000',
        mainBg: '#121212',
        lighterBg: '#242424',
        primaryText: '#FFF',
        secondaryText: 'rgba(255, 255, 255, 0.7)',
        accentColor: '#E91EA4',
        accentColorSecondary: '#E91E63',
        navbarLogoBg: '#FFF',
        alertHoverColor: '#353535' // a bit lighter than lighterBG
      }

      fs.promises.mkdir(themesPath, { recursive: true })
        .then(async () => {
            await fs.promises.writeFile(defaultColorsPath, JSON.stringify(defaultColors))
            await fs.promises.writeFile(currentColorsPath, JSON.stringify(defaultColors))
        })
        .catch(err => console.log(err));
    }

  }
}
</script>

<style lang="scss">
  @import url('https://fonts.googleapis.com/css?family=Poppins:400,500,600,700&display=swap');

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
    --primary-text: #FFF;
    --secondary-text: rgba(255, 255, 255, 0.7);
    --accent-color: #E91EA4;
    --accent-color-secondary: #E91E63;
    --navbar-logo-bg: #FFF;
    --alert-hover-color: #353535;
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
</style>
