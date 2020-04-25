<template>
  <main class="themes">
    <h1>My Themes</h1>
    <div class="theme-item-container">
      <ThemeItem
        class="theme-item"
        v-for="(theme, index) in themes"
        :key="index"
        :colors="theme"
      />
    </div>
  </main>
</template>

<script>
import ThemeItem from "./components/ThemeItem";
import firebase from "firebase";

export default {
  name: "Themes",
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
      const db = firebase.database();
      db.ref("/themes").once("value")
        .then(snapshot => {
          const result = snapshot.val()
  
          Object.keys(result).forEach(theme => {
            this.themes.push(result[theme])
          })

          console.log(result)
        })
        .catch(err => console.log(err))
    }
  },
  mounted() {
    this.getThemes()
  }
};
</script>

<style lang="scss">
.themes {
  width: 100%;
  height: 100%;
  color: var(--primary-text);

  h1 {
    font-size: 36px;
    margin: 60px 0 5px 60px;
    font-weight: 600;
  }

  .theme-item-container {
    margin: 30px 60px 0 60px;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;

    .theme-item {
      margin: 0 20px;
    }
  }
}
</style>
