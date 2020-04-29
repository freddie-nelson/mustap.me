<template>
  <transition name="fade">
    <div
      class="theme__item"
      ref="themeItem"
    >
      <transition name="fade">
        <div
          class="item__overlay"
          v-if="showOverlay"
        >
          <p class="name">
            {{ this.name }}
          </p>
          <p>by {{ this.creator }}</p>
          <Button
            text="Download Theme"
            v-if="!downloaded"
            :filled="false"
            @clicked="enableOrDownloadTheme"
          />
          <Button
            text="Enable Theme"
            v-else
            :filled="false"
            :font-size="16"
            @clicked="enableOrDownloadTheme(true)"
          />
        </div>
      </transition>
      <Button
        class="item__button"
        text="View Theme"
        :filled="true"
        :font-size="12"
        @clicked="showOverlay = true"
        v-if="!preview"
      />
      <DataTable
        :for-playlists="true"
        :formatted-array="array"
        @clicked-cell="clickedCell"
        ref="table"
      />
      <div class="item__controls">
        <vue-range-slider
          :tooltip="false"
          :height="8"
          :value="35"
        />

        <div class="item__controls-buttons">
          <img
            :style="{ opacity: repeat ? 1 : 0.7 }"
            @click="repeat = !repeat"
            src="@/assets/svg/controls/repeat.svg"
            alt=""
          >
          <img
            @click="nextBack(-1)"
            src="@/assets/svg/controls/next.svg"
            alt=""
          >
          <img
            v-if="play"
            @click="play = !play"
            src="@/assets/svg/controls/play.svg"
            alt=""
          >
          <img
            v-else
            @click="play = !play"
            src="@/assets/svg/controls/pause.svg"
            alt=""
          >
          <img
            @click="nextBack(1)"
            style="transform: rotate(180deg) scale(0.9)"
            src="@/assets/svg/controls/next.svg"
            alt=""
          >
          <img
            :style="{ opacity: shuffle ? 1 : 0.7 }"
            @click="shuffle = !shuffle"
            src="@/assets/svg/controls/shuffle.svg"
            alt=""
          >
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import DataTable from "@/views/Library/components/DataTable";
import Button from "@/components/Button";
import loadTheme from "@/mixins/loadTheme";

export default {
  name: "ThemeItem",
  components: {
    DataTable,
    Button
  },
  mixins: [ loadTheme ],
  data() {
    return {
      array: [
        {
          leftTop: "Song Name",
          leftBottom: "Artist Name",
          rightTop: "0:00",
          index: 0
        },
        {
          leftTop: "Song Name",
          leftBottom: "Artist Name",
          rightTop: "0:00",
          index: 1
        },
        {
          leftTop: "Song Name",
          leftBottom: "Artist Name",
          rightTop: "0:00",
          index: 2
        }
      ],
      play: true,
      shuffle: true,
      repeat: true,
      index: 0,
      showOverlay: false
    };
  },
  props: {
    colors: Object,
    downloaded: {
      type: Boolean,
      default: false
    },
    name: String,
    creator: String,
    preview: Boolean,
    refresh: Boolean
  },
  watch: {
    refresh() {
      this.applyColors();
    }
  },
  methods: {
    clickedCell(e) {
      const index = e - 1;
      this.index = index;
      this.addClasses(index);
    },
    addClasses(index) {
      try {
        const children = this.$refs.table.$el.children;
        const cell = children[index].children[0];

        children.forEach(container => {
          const element = container.children[0];

          if (element.classList.contains("clicked")) {
            element.classList.remove("clicked");
          }
        });

        cell.classList.add("clicked");
      } catch (e) {
        console.log(e);
      }
    },
    nextBack(num) {
      const newIndex = this.index + num;

      if (newIndex === -1) {
        this.index = 2;
      } else if (newIndex === 3) {
        this.index = 0;
      } else {
        this.index = newIndex;
      }

      this.addClasses(this.index);
    },
    enableOrDownloadTheme(enable) {
      const fs = require("fs");
      const themesPath = this.$store.state.documentsPath + "/mustap/themes/";

      const fileName = enable ? "currentTheme.json" : this.name + ".json";

      this.showOverlay = false;

      const theme = {
        colors: this.colors,
        name: this.name,
        creator: this.creator
      }

      
      fs.promises.writeFile(themesPath + fileName, JSON.stringify(theme))
        .then(() => this.loadTheme())
        .catch(err => console.log(err));
    },
    applyColors() {
      const el = this.$refs.themeItem.style;

      const propNames = [
        "--dark-bg",
        "--main-bg",
        "--lighter-bg",
        "--primary-text",
        "--secondary-text",
        "--accent-color",
        "--accent-color-secondary",
        "--navbar-logo-bg",
        "--alert-hover-color",
        "--filter"
      ];

      const colorsPropNames = [
        "darkBg",
        "mainBg",
        "lighterBg",
        "primaryText",
        "secondaryText",
        "accentColor",
        "accentColorSecondary",
        "navbarLogoBg",
        "alertHoverColor",
        "filter"
      ];

      propNames.forEach((val, index) =>
        el.setProperty(val, this.colors[colorsPropNames[index]])
      );

      const images = document.querySelectorAll(".item__controls-buttons>img");
      images.forEach(element => {
        element.style.cssText += this.colors[colorsPropNames[9]];
      });

      setTimeout(() => this.addClasses(0), 100)
    }
  },
  mounted() {
    if (!this.colors) return
    this.applyColors()
  }
};
</script>

<style lang="scss">
.theme__item {
  --dark-bg: rgb(16, 17, 22);
  --main-bg: rgb(25, 26, 34);
  --lighter-bg: #242631;
  --primary-text: rgb(255, 255, 255);
  --secondary-text: rgba(145, 145, 145, 0.7);
  --accent-color: #F775C1;
  --accent-color-secondary: rgb(103, 207, 255);
  --navbar-logo-bg: #fff;
  --alert-hover-color: #353535;
  --filter: brightness(0) saturation(100%);

  width: 300px;
  height: 255px;
  background-color: var(--main-bg);
  border: 3px solid var(--lighter-bg);
  border-radius: 15px;
  position: relative;

  &:hover {
    .item__button {
      opacity: 1;
    }
  }

  .item__overlay {
    position: absolute;
    z-index: 6;
    width: calc(100% + 6px);
    height: calc(100% + 6px);
    margin: -3px 0 0 -3px;
    background-color: var(--lighter-bg);
    border-radius: 15px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    p {
      font-size: 18px;
      color: var(--secondary-text);
      margin-bottom: 5px;

      &.name {
        font-weight: 500;
        color: var(--primary-text);
        margin-bottom: 0;
      }
    }
  }

  .item__button {
    position: absolute;
    bottom: 8px;
    right: 8px;
    z-index: 2;
    opacity: 0;
    transition: opacity 0.5s ease-in;
  }

  .table {
    padding-right: 0px;
    height: 73%;
    width: 95%;
    position: absolute;
    margin-left: 12px;
    margin-top: 8px;

    .cell {
      height: 50px;
      margin-bottom: 6px;

      .cell__index {
        font-size: 15px;
      }

      .cell__left-text-top {
        color: var(--primary-text);
        transition: color 0.3s ease-in;
        font-size: 14px;
      }

      &.clicked .cell__left-text-top {
        color: var(--accent-color);
      }

      .cell__left-text-bottom {
        font-size: 12px;
      }

      .cell__right-text-top {
        font-size: 14px;
      }
    }
  }

  .item__controls {
    position: absolute;
    bottom: 6px;
    width: 95%;
    margin-left: 7px;

    &-buttons {
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 4px;

      img {
        cursor: pointer;
        transform: scale(0.9);
        margin: 0px 8px 3px 8px;
      }
    }
  }
}
</style>