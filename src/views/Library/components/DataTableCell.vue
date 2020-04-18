<template>
  <div v-if="show" class="cell created" :id="id" @click="clicked">
    <span class="cell__index">{{ index }}</span>
    <div class="cell__left-text">
      <p class="cell__left-text-top">{{ data.leftTop }}</p>
      <p class="cell__left-text-bottom">{{ data.leftBottom }}</p>
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
      <Button
        @clicked="
          () => {
            $emit('deleteSong', index);
            this.$store.state.deleteClickedIndex = index;
          }
        "
        class="cell__right-text-bottom"
        :text="'🗑'"
        v-if="!this.forPlaylists"
      />
    </div>
  </div>
</template>

<script>
import { v4 as uuidv4 } from "uuid";
import Button from "@/components/Button";

export default {
  name: "DataTableCell",
  components: {
    Button
  },
  data() {
    return {
      id: uuidv4(),
      deleteClicked: false,
      show: false
    };
  },
  props: {
    data: Object,
    forPlaylists: Boolean,
    index: Number
  },
  watch: {
    show: function() {
      if (
        this.$store.state.playlists.currentPlaylistViewing >= 0 &&
        this.index >= this.$store.getters.currentPlaylistViewing.data.length
      ) {
        this.$emit("loaded-cells");
      }
    }
  },
  methods: {
    clicked() {
      setTimeout(() => {
        if (this.$store.state.deleteClickedIndex === this.index) {
          return;
        }
        if (
          (this.forPlaylists ? true : this.$store.state.currentPlaylistViewing !== -1) &&
          (this.forPlaylists || !this.$store.getters.currentPlaylistViewing.data[this.index - 1].missing)
        ) {
          this.$emit("clicked", this.index);
        }
      }, 100);
    }
  },
  mounted() {
    if (this.index >= 50) {
      setTimeout(() => {
        this.show = true;
      }, 100);
    } else {
      this.show = true;
    }
  }
};
</script>

<style lang="scss">
.cell {
  max-width: 100%;
  height: 64px;
  margin: 12px 0;
  background-color: var(--main-bg);
  border-radius: 10px;
  display: flex;
  cursor: pointer;
  transition: background-color 0.3s ease-in, color 0.2s ease-in, transform 0.4s ease-out, opacity 0.4s ease-out;
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

  &:hover {
    background-color: var(--lighter-bg);

    .cell__right-text-bottom {
      opacity: 1 !important;
    }
  }

  &__index {
    margin: auto 0;
    font-family: helvetica;
    font-size: 16px;
    color: var(--primary-text);
    opacity: 0.3;
    width: 40px;
    text-align: center;
  }

  &__left-text {
    font-weight: 500;
    margin: auto 0;
    max-width: 70%;

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
    }

    &-bottom {
      opacity: 0 !important;
      transition: opacity 0.3s ease-in;
    }
  }
}
</style>
