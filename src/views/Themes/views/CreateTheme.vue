<template>
  <div class="createTheme">
    <ThemeItem
      class="createTheme__preview"
      :key="key"
      :colors="colors"
      :preview="true"
    />
  </div>
</template>

<script>
import ThemeItem from "../components/ThemeItem";

export default {
    name: "CreateTheme",
    components: {
      ThemeItem
    },
    data() {
      return {
        colors: {},
        key: 0
      }
    },
    mounted() {
      const fs = require("fs");
      const path = this.$store.state.documentsPath + "/mustap/themes/currentTheme.json";

      fs.promises.readFile(path)
        .then(data => {
          this.colors = JSON.parse(data).colors;
          this.key = 1;
        })
        .catch(err => console.log(err));
    }
}
</script>

<style lang="scss">
  .createTheme {
    display: flex;
    padding: 60px;

    &__preview {
      margin-top: 40px;
      margin-left: 60px;
      transform: scale(1.4);
    }
  }
</style>