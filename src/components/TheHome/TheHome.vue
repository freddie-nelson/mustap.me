<template>
  <main class="home">
      <Searchbox class="home__searchbox" />
  </main>
</template>

<script>
import Searchbox from './components/TheSearchbox'

export default {
  name: 'Home',
  components: {
    Searchbox
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
    }
  }
</style>