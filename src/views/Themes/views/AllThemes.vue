<template>
  <transition-group
    class="theme-item-container"
    name="fade"
  >
    <ThemeItem
      class="theme-item"
      v-for="(theme, index) in themes"
      :key="index"
      :colors="theme.colors"
      :name="theme.name"
      :creator="theme.creator"
      :downloaded-prop="theme.downloaded"
      @change-downloaded="changeDownloaded(index)"
    />
  </transition-group>
</template>

<script>
import ThemeItem from "../components/ThemeItem";
import firebase from "firebase/app";
import "firebase/firestore";

export default {
    name: "AllThemes",
    components: {
    ThemeItem
  },
  data() {
    return {
      themes: []
    };
  },
  methods: {
    getThemes() {
      const firestore = firebase.firestore();
      const themesCollection = firestore.collection("themes");

      themesCollection.get()
        .then(querySnapshot => {
          querySnapshot.forEach((doc) => {
            this.themes.push(doc.data());
          })
        })
        .catch(err => console.log(err))
    },
    changeDownloaded(index) {
      const themes = [...this.themes];
      themes[index].downloaded = true;

      this.themes = themes;
    }
  },
  mounted() {
    this.getThemes()
  }
}
</script>

<style>

</style>