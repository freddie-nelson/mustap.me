<template>
  <div class="router-nav">
    <button
      @click="$router.go(-1)"
      class="btn"
    >
      <v-icon name="chevron-left" />
    </button>
    <button
      @click="$router.go(1)"
      class="btn"
    >
      <v-icon name="chevron-right" />
    </button>
  </div>
</template>

<script>
export default {
  name: "RouterNavButtons"
};
</script>

<style lang="scss" scoped>
  .router-nav {
    margin: auto 0px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 28px;
    width: 60px;
    -webkit-app-region: no-drag;
  }

  .btn {
    background: transparent;
    border: none;
    color: rgb(255, 255, 255);
    font-size: 18px;
    font-weight: 500;
    cursor: pointer;
    opacity: .7;
    outline: none !important;
    width: 25px;

    > div {
      height: 25px;
    }

    &:hover {
      opacity: 1;
    }
  }
</style>
