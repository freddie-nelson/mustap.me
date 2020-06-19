<template>
  <header class="titlebar-container">
    <div class="titlebar">
      <RouterNavButtons />
      <p class="titlebar__title">
        {{ this.title }}
      </p>
      <div class="titlebar__buttons">
        <v-icon
          name="minimize-2"
          class="titlebar__button"
          @click.native="minimize"
        />
        <v-icon
          name="maximize"
          class="titlebar__button"
          @click.native="maximize"
        />
        <v-icon
          name="x"
          class="titlebar__button"
          @click.native="close"
        />
      </div>
    </div>
  </header>
</template>

<script>
import RouterNavButtons from "./RouterNavButtons";
const { remote } = require('electron');
let win = remote.BrowserWindow.getFocusedWindow();

export default {
  name: "TitleBar",
  components: {
    RouterNavButtons
  },
  props: {
    title: {
      type: String,
      default: ""
    }
  },
  methods: {
    close() {
      if (!win) {
        const { remote } = require('electron');
        win = remote.BrowserWindow.getFocusedWindow();
      }

      win.close();
    },
    minimize() {
      if (!win) {
        const { remote } = require('electron');
        win = remote.BrowserWindow.getFocusedWindow();
      }

      win.minimize()
    },
    maximize() {
      if (!win) {
        const { remote } = require('electron');
        win = remote.BrowserWindow.getFocusedWindow();
      }

      if (win.isMaximized()) {
        win.unmaximize()
      } else {
        win.maximize();
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.titlebar-container {
  padding: 2px;
  width: 100vw;
  height: 40px;
  background-color: var(--dark-bg);
}

.titlebar {
  -webkit-user-select: none;
  -webkit-app-region: drag;
  height: 100%;
  position: relative;
  z-index: 999;
  display: grid;
  grid-template-columns: repeat(3, 1fr);

  &__title {
    color: var(--secondary-text);
    font-weight: 400;
    margin: auto;
    font-size: 14px;
  }

  &__buttons {
    justify-self: flex-end;
    margin-right: 10px;
    width: 105px;
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    -webkit-app-region: no-drag;
  }

  &__button {
    transform-origin: center;
    transform: scale(.95);
    cursor: pointer;
    color: var(--icon-color);
    opacity: 0.7;
    width: 18px;
    height: 18px;
    -webkit-app-region: no-drag;

      &:hover {
        opacity: 1;
      }

    &:last-of-type {
      width: 22px;
      height: 22px;

      &:hover {
        color: var(--accent-color);
      }
    }
  }
}
</style>