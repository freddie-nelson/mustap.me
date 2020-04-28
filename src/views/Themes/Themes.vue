<template>
  <main class="themes">
    <div class="themes__links">
      <router-link
        class="router-link"
        to="/Themes/"
        :class="{ selected: $route.name === 'Themes' ? true : false }"
      >
        My Themes
      </router-link>
      <router-link
        class="router-link"
        to="/Themes/AllThemes"
        :class="{ selected: $route.name === 'AllThemes' ? true : false }"
      >
        All Themes
      </router-link>
      <Button
        text="+ Create Theme"
        :filled="true"
        :font-size="15"
        class="themes__button"
        @clicked="changeToCreateThemeView"
      />
    </div>
    <vue-page-transition name="fade-in-right">
      <router-view />
    </vue-page-transition>
  </main>
</template>

<script>
import Button from "@/components/Button"

export default {
  name: "Themes",
  components: {
    Button
  },
  methods: {
    changeToCreateThemeView() {
      if (this.$route.name === "CreateTheme") return

      this.$router.push({ name: "CreateTheme" })
    }
  }
};
</script>

<style lang="scss">
.themes {
  width: 100%;
  height: 100%;
  color: var(--primary-text);

  .router-link {
    text-decoration: none;
    color: var(--secondary-text);
    transition: color .3s ease-out;
    margin-right: 40px;

    &.selected {
      color: var(--primary-text);
    }

    &:hover {
      color: var(--primary-text);
    }
  }

  &__links {
    font-size: 36px;
    margin: 60px 60px 5px 60px;
    font-weight: 600;
    display: flex;
  }

  &__button {
    margin-left: auto;
    display: flex !important;
    height: 39px;
    align-self: center;
  }

  .theme-item-container {
    margin: 10px 60px 0 60px;
    display: flex;
    flex-wrap: wrap;

    .theme-item {
      margin: 20px;
    }
  }
}
</style>
