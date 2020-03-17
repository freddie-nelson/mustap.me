<template>
  <main class="home">
      <Searchbox class="home__searchbox" />
      <DownloadStatus class="home__downloadstatus" />
  </main>
</template>

<script>
import Searchbox from './components/TheSearchbox'
import DownloadStatus from './components/TheDownloadStatus'

export default {
  name: 'Home',
  components: {
    Searchbox,
    DownloadStatus
  }
}
</script>

<style lang="scss">
  .home {
    display: flex;
    width: 100%;
    height: 100%;

    &__searchbox {
      margin: auto;
      width: 100%;
      max-width: 500px;
      height: 50px;
      opacity: 0;
      display: none;
    }

    &__downloadstatus {
      width: 100%;
      margin: auto;
      max-width: 500px;
      height: 160px;
      z-index: 2;
    }
  }
</style>