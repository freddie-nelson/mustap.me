<template>
  <button @click="$emit('back')" class="home__back-btn" :class="{ opacityNone: backBtnHide }">
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="28" viewBox="0 0 32 28" fill="none">
      <path
        d="M15.6985 1.20413C16.7577 2.22147 16.8409 3.6378 15.6985 4.88147L6.79936 14.0001L15.6985 23.1188C16.8409 24.3625 16.7577 25.7811 15.6985 26.7915C14.6416 27.8088 12.8556 27.7435 11.8629 26.7915C10.8701 25.8441 1.17061 15.8365 1.17061 15.8365C0.919205 15.5982 0.719253 15.3125 0.582684 14.9966C0.446116 14.6807 0.375732 14.341 0.375732 13.9978C0.375732 13.6546 0.446116 13.3149 0.582684 12.999C0.719253 12.6831 0.919205 12.3974 1.17061 12.1591C1.17061 12.1591 10.8701 2.15613 11.8629 1.20413C12.8556 0.249799 14.6416 0.186799 15.6985 1.20413Z"
        fill="white"
      />
      <rect x="5" y="12" width="27" height="4" rx="2" fill="white" />
    </svg>
  </button>
</template>

<script>
export default {
  name: "BackBtn",
  data() {
    return {
      backBtnHide: true
    };
  },
  mounted() {
    setTimeout(() => (this.backBtnHide = false), 1000);
  }
};
</script>

<style></style>
