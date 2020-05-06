<template>
  <div class="settings-container">
    <main class="settings">
      <div class="settings__header">
        <h1>Settings</h1>
        <Button
          text="Apply Settings"
          :filled="true"
          :font-size="15"
          @clicked="applySettings"
        />
      </div>
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
import Button from "@/components/Button"

export default {
  name: "Settings",
  components: {
    SettingCategory,
    Button
  },
  data() {
    return {
      settings: {}
    };
  },
  methods: {
    clickedOption(e) {
      const { category, setting, index } = e;
      this.settings[category][setting].selected = index;
      this.$store.dispatch("setProp", { prop: "settings", data: { ...this.settings } })
    },
    checked(e) {
      const { category, setting, value } = e;
      this.settings[category][setting].options = value;
      this.$store.dispatch("setProp", { prop: "settings", data: { ...this.settings } })
    },
    applySettings() {
      const { remote } = require("electron");
      const win = remote.getCurrentWindow();

      win.reload();
    }
  },
  mounted() {
    this.settings = { ...this.$store.state.settings }
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

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 60px 60px 5px 60px;

    h1 {
      font-size: 36px;
      font-weight: 600;
    }
    
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
