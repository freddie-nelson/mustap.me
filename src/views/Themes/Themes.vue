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
    <vue-page-transition
      class="themes__container"
      name="fade-in-right"
    >
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
    margin-right: 60px;

    @media screen and (max-width: 1081px) {
      font-size: 32px;
      margin-right: 40px;
    }

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

  &__container {
    margin: 30px 60px 0 60px;
    height: calc(100% - 140px);
    position: relative;
  }

  .theme-item-container {
    display: grid;
    grid-gap: 20px;
    grid-template-columns: repeat(auto-fill, 300px);
    grid-template-rows: repeat(auto-fill, 255px);
    height: 100%;
    padding-right: 20px;
    overflow: scroll;

    &::-webkit-scrollbar {
      margin-left: 10px;
    }

    @media screen and (max-width: 1175px) {
      grid-template-columns: repeat(auto-fill, 240px);
      grid-template-rows: repeat(auto-fill, 212px);
      padding-right: 15px;

      .theme-item {
        width: 240px;
        height: 212px;

        .item__controls {
          transform: scale(.8);
          bottom: 0 !important;
        }
        
        & .table {
          width: 110% !important;
          transform: scale(.85);
          margin-top: -10px !important;
          margin-left: -6px !important;
        }
      }
    }
  }
}
</style>
