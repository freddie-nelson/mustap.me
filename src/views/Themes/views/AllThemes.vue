<template>
  <div class="theme-item-container">
    <ThemeItem
      class="theme-item"
      v-for="(theme, index) in themes"
      :key="index"
      :colors="theme"
      :downloaded="false"
    />
  </div>
</template>

<script>
import ThemeItem from "../components/ThemeItem";
import firebase from "firebase";

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
    }
  },
  mounted() {
    // this.getThemes()
  }
}
</script>

<style>

</style>