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
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: space-between;
    top: 10px;
    left: 70px;
    background: var(--lighter-bg);
    border-radius: 4px;
    height: 32px;
    width: 75px;
    z-index: 10;
  }

  .btn {
    background: transparent;
    border: none;
    color: rgb(255, 255, 255);
    font-size: 18px;
    font-weight: 500;
    cursor: pointer;
    opacity: .5;
    transition: opacity 0.2s ease;
    outline: none !important;
    width: 29px;

    > div {
      height: 29px;
    }

    &:hover {
      opacity: 1;
    }
  }
</style>
