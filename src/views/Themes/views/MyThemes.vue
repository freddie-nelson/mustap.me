<template>
  <div class="theme-item-container">
    <ThemeItem
      class="theme-item"
      v-for="(theme, index) in themes"
      :key="index"
      :downloaded-prop="true"
      :colors="theme.colors"
      :name="theme.name"
      :creator="theme.creator"
      :deleteable="true"
      @deleted-theme="getMyThemes"
    />
  </div>
</template>

<script>
import ThemeItem from "../components/ThemeItem";

export default {
    name: "MyThemes",
    components: {
        ThemeItem
    },
    data() {
        return {
            themes: []
        }
    },
    methods: {
        readTheme(themesPath, files, index) {
        if (index >= files.length) return;

        const fs = require("fs");

        fs.promises.readFile(themesPath + files[index])
            .then(data => {
                this.themes = [ ...this.themes, JSON.parse(data) ]
                this.readTheme(themesPath, files, index + 1);
            })
            .catch(err => console.log(err))
        },
        getMyThemes() {
            const fs = require("fs")
            const themesPath = this.$store.state.documentsPath + "/mustap/themes/";

            this.themes = [];
            
            fs.promises.readdir(themesPath)
                .then(res => {
                    const files = res.filter(file => file !== "currentTheme.json")
                    this.readTheme(themesPath, files, 0)
                })
                .catch(err => {
                    console.log(err);
                });
        }
    },
    mounted() {
        this.getMyThemes();
    }
}
</script>

<style>

</style>