<template>
  <div class="settings-container">
    <main class="settings">
      <h1>Settings</h1>
      <section class="settings__main">
        <SettingCategory
          v-for="(category, index) in Object.keys(settings)"
          :key="index"
          :title="category"
          :data="settings[category]"
          class="settings__category"
          @clicked-option="clickedOption({ category: category, ...$event })"
          @checked="checked({ category: category, ...$event })"
        />
      </section>
    </main>
  </div>
</template>

<script>
import SettingCategory from "./components/SettingCategory";

export default {
  name: "Settings",
  components: {
    SettingCategory
  },
  data() {
    return {
      settings: {
        Volume: {
          volume: 0.5
        },
        Appearance: {
          fonts: {
            description: "Controls the default font family.",
            selected: 0,
            options: ["Poppins", "Arial", "sans-serif"]
          },
          themes: {
            description: "Controls the default application theme.",
            selected: 0,
            options: ["Default"]
          }
        },
        Other: {
          "auto Sign In": {
            description: "Controls wether you are automatically signed in.",
            options: true
          },
          "page Displayed On Launch": {
            description: "Controls what page is displayed when the app is opened.",
            selected: 0,
            options: ["Home", "Library"]
          }
        }
      }
    };
  },
  methods: {
    clickedOption(e) {
      const { category, setting, index } = e;
      this.settings[category][setting].selected = index;
    },
    checked(e) {
      const { category, setting, value } = e;
      this.settings[category][setting].options = value;
    }
  }
};
</script>

<style lang="scss">
.settings-container {
  width: 100%;
  height: 100%;
  padding: 5px 5px 5px 0;
}

.settings {
  width: 100%;
  height: 100%;
  color: var(--primary-text);
  overflow-y: scroll;

  h1 {
    font-size: 36px;
    margin: 60px 0 5px 60px;
    font-weight: 600;
  }

  &__main {
    display: flex;
    width: 100%;
    padding: 5px 60px 35px 60px;
    flex-direction: column;
  }

  &__category {
    margin-left: 20px;

    &:not(:first-of-type) {
      margin-top: 20px;
    }

    h2 {
      font-size: 24px;
      font-weight: 500;
      margin-bottom: 15px;
    }

    .category {
      &__setting {
        max-width: 600px;
        width: 100%;
        margin-bottom: 20px;
        margin-left: 20px;

        h3 {
          font-size: 18px;
          font-weight: 500;
        }

        p {
          font-size: 14px;
          color: var(--secondary-text);
        }
      }
    }
  }
}
</style>
