<template>
  <div class="cell-container">
    <div
      v-if="show"
      class="cell created"
      :class="computedClasses"
      @click="clicked"
    >
      <span class="cell__index">{{ index }}</span>
      <div class="cell__left-text">
        <p class="cell__left-text-top">
          {{ data.leftTop }}
        </p>
        <p class="cell__left-text-bottom">
          {{ data.leftBottom }}
        </p>
      </div>

      <div class="cell__right-text">
        <p class="cell__right-text-top">
          {{
            this.$store.state.currentPlaying.index === index - 1 &&
              !this.forPlaylists &&
              this.$store.state.playlists.currentPlaylist === this.$store.state.playlists.currentPlaylistViewing
              ? this.$store.state.currentPlaying.currentTime
              : false || data.rightTop
          }}
        </p>
      </div>
    </div>

    <Button
      @clicked="
        () => {
          $emit('deleteSong', index);
        }
      "
      class="cell__right-text-bottom"
      icon="trash-2"
      v-if="!this.forPlaylists"
    />
  </div>
</template>

<script>
import Button from "@/components/Button";

export default {
  name: "DataTableCell",
  components: {
    Button
  },
  data() {
    return {
      deleteClicked: false,
      show: true
    };
  },
  props: {
    data: Object,
    forPlaylists: Boolean,
    index: Number
  },
  computed: {
    computedClasses() {
      try {
        if (!this.forPlaylists) {
          const song = this.$store.getters.currentPlaylistViewing.data[
            this.index - 1
          ];
          const currentPlayingIndex = this.$store.state.currentPlaying.index;
          let applyClicked = false;

          if (currentPlayingIndex === this.index - 1 && this.$store.state.playlists.currentPlaylistViewing === this.$store.state.playlists.currentPlaylist) {
            applyClicked = true;
          }

          return {
            clicked: applyClicked,
            missing: song.missing,
            deleted: song.deleted
          };
        } else {
          return {};
        }
      } catch {
        return {};
      }
    }
  },
  methods: {
    clicked() {
      if (
        (this.forPlaylists
          ? true
          : this.$store.state.currentPlaylistViewing !== -1) &&
        (this.forPlaylists ||
          !this.$store.getters.currentPlaylistViewing.data[this.index - 1]
            .missing)
      ) {
        this.$emit("clicked", this.index);
      }
    }
  }
};
</script>

<style lang="scss">
.cell-container {
  position: relative;

  &:hover {
    .cell {
      background-color: var(--lighter-bg);
    }

    .cell__right-text-bottom {
      opacity: 1 !important;
    }
  }
}

.cell {
  max-width: 100%;
  height: 64px;
  margin: 12px 0;
  background-color: var(--main-bg);
  border-radius: 10px;
  display: flex;
  cursor: pointer;
  transition: background-color 0.3s ease-in, color 0.3s ease-in,
    transform 0.4s ease-out, opacity 0.4s ease-out;
  transform: translateX(0);
  opacity: 1;

  &.clicked {
    color: var(--accent-color);

    & .cell__right-text-top {
      color: var(--accent-color);
    }
  }

  &.missing {
    background-color: #dc35462a !important;
  }

  &.deleted {
    background-color: #dcd1352a !important;
  }

  &:first-of-type {
    margin-top: 0px !important;
  }

  &__index {
    margin: auto 0;
    font-family: helvetica;
    font-size: 16px;
    color: var(--primary-text);
    opacity: 0.3;
    min-width: 40px;
    text-align: center;
  }

  &__left-text {
    font-weight: 500;
    margin: auto 0;
    max-width: 55%;

    &-top {
      font-size: 18px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    &-bottom {
      font-size: 14px;
      color: var(--secondary-text);
      margin-top: -2px;
    }
  }

  &__right-text {
    font-weight: 400;
    margin: 8px 12px 0 auto;
    text-align: right;

    &-top {
      font-size: 16px;
      color: var(--secondary-text);
      transition: color 0.3s ease-in;
      white-space: nowrap;
    }

    &-bottom {
      opacity: 0;
      transition: opacity 0.3s ease-in;
      position: absolute;
      bottom: 6px;
      right: 12px;
    }
  }
}
</style>
