<template>
  <div
    class="controls"
    :style="{ padding: `0 ${padding}px` }"
  >
    <div
      class="controls__volume-buttons"
      :style="{ padding: `0 ${padding}px 0 0` }"
    >
      <div
        class="volume-buttons__audio-controller"
        v-if="showVolumeControls"
        ref="music-volume-controller"
        :style="{
          margin: `0 ${padding}px 0 0`,
          backgroundColor: `var(${bgColor})`
        }"
      >
        <vue-range-slider
          ref="volume-slider"
          @slide-end="changeVolume"
          :value="volume"
          :max="1"
          :min="0"
          :step="0.01"
          :direction="'vertical'"
          :tooltip="false"
          :dot-size="12"
          :height="130"
          :width="8"
          style="display: block; margin: auto;"
        />
      </div>

      <img
        v-if="volumeControlsBtn === 1"
        alt
        src="../assets/svg/volume/volume-none.svg"
        @click="showVolumeControls = !showVolumeControls"
        class="volume-buttons__controls-volume-none volume-buttons__button"
      >

      <img
        v-else-if="volumeControlsBtn === 2"
        alt
        src="../assets/svg/volume/volume-one.svg"
        @click="showVolumeControls = !showVolumeControls"
        class="volume-buttons__controls-volume-one volume-buttons__button"
      >

      <img
        v-else
        alt
        src="../assets/svg/volume/volume-full.svg"
        @click="showVolumeControls = !showVolumeControls"
        class="volume-buttons__controls-volume-full volume-buttons__button"
      >
    </div>

    <vue-range-slider
      @slide-end="$store.dispatch('setCurrentPlayingSoundCurrentTime', $event)"
      :value="currentTime > $store.state.currentPlaying.lengthSeconds ? 0 : currentTime"
      :max="$store.state.currentPlaying.lengthSeconds || 0"
      :min="0"
      :step="1"
      :direction="'horizontal'"
      :tooltip="false"
      :dot-size="16"
      :height="10"
      style="display: block; padding: 0; margin: 0; cursor: pointer;"
    />
    <div class="controls__buttons">
      <img
        src="../assets/svg/controls/repeat.svg"
        :style="{ opacity: $store.state.playlists.repeatSong ? '1' : '.7' }"
        alt
        @click="$store.dispatch('setPlaylistsProp', { prop: 'repeatSong', data: !$store.state.playlists.repeatSong })"
        class="controls__buttons-repeat"
      >

      <img
        src="../assets/svg/controls/next.svg"
        alt
        @click="nextBack(-1, true)"
        class="controls__buttons-button back-btn"
      >

      <img
        v-if="!this.$store.state.currentPlaying.playing"
        src="../assets/svg/controls/play.svg"
        alt
        @click="playPause"
        class="controls__buttons-button-play"
      >

      <img
        v-else
        src="../assets/svg/controls/pause.svg"
        alt
        @click="playPause"
        class="controls__buttons-button-pause"
      >

      <img
        src="../assets/svg/controls/next.svg"
        alt
        @click="nextBack(1, true)"
        class="controls__buttons-button skip-btn"
      >

      <img
        src="../assets/svg/controls/shuffle.svg"
        :style="{ opacity: $store.state.playlists.shufflePlaylist ? '1' : '.7' }"
        alt
        @click="$store.dispatch('setPlaylistsProp', { prop: 'shufflePlaylist', data: !$store.state.playlists.shufflePlaylist })"
        class="controls__buttons-shuffle"
      >
    </div>
  </div>
</template>

<script>
import addClasses from "@/mixins/addClasses";
import setCurrentPlaying from "@/mixins/setCurrentPlaying";

export default {
  name: "TrackControls",
  mixins: [addClasses, setCurrentPlaying],
  data() {
    return {
      showVolumeControls: false,
      volumeControlsBtn: 3
    };
  },
  props: {
    currentTime: Number,
    padding: Number,
    bgColor: String
  },
  computed: {
    volume() {
      return this.$store.getters.soundVolume;
    }
  },
  watch: {
    volume() {
      this.calcVolumeControlsSrc(this.$store.getters.soundVolume);
    }
  },
  methods: {
    changeVolume(e) {
      this.$store.dispatch("changeVolumeSlider", e);
      this.calcVolumeControlsSrc(e);
    },
    calcVolumeControlsSrc(volume) {
      if (volume === 0) {
        this.volumeControlsBtn = 1;
      } else if (volume <= 0.5) {
        this.volumeControlsBtn = 2;
      } else {
        this.volumeControlsBtn = 3;
      }
    },
    playPause() {
      if (this.$store.state.currentPlaying.title != "N / A") {
        const currentPlaying = this.$store.state.currentPlaying;
        this.$store.dispatch("setCurrentPlayingProp", {
          prop: "playing",
          data: !currentPlaying.playing
        });

        if (currentPlaying.playing) {
          currentPlaying.sound.play();
        } else {
          currentPlaying.sound.pause();
        }
      }
    },
    calcNewIndex(num, clicked) {
      const currentPlaying = this.$store.state.currentPlaying;
      const state = this.$store.state;
      let index = currentPlaying.index + num;
      const currentPlaylist = this.$store.getters.currentPlaylist.data;

      if (state.playlists.shufflePlaylist) {
        let randomIndex;

        do {
          randomIndex = Math.floor(Math.random() * currentPlaylist.length);
        } while (randomIndex === currentPlaying.index);

        index = randomIndex;
      }

      if (state.playlists.repeatSong && !clicked) {
        index = currentPlaying.index;
      } else if (state.playlists.repeatSong && clicked) {
        this.$store.dispatch("setPlaylistsProp", { prop: "repeatSong", data: false });
      }

      if (index >= currentPlaylist.length || index < 0) {
        if (index < 0) {
          index = currentPlaylist.length - 1;
        } else {
          index = 0;
        }
      }

      let song = currentPlaylist[index];

      if (song.missing) {
        while (song.missing) {
          index = num === 1 ? index + 1 : index - 1;
          index === currentPlaylist.length ? (song = currentPlaylist[index]) : null;
        }
      }

      return index;
    },
    nextBack(num, clicked) {
      if (this.$store.state.currentPlaying.title !== "N / A") {
        const index = this.calcNewIndex(num, clicked);
        this.setCurrentPlaying(index + 1);
        this.addClasses(0);
      }
    },
    registerKeys() {
      if (this.$store.state.mountedTrackControlsCount === 0) {
        this.$store.dispatch("setProp", {
          prop: "mountedTrackControlsCount",
          data: 1
        });

        const state = this.$store.state;

        const { remote } = require("electron");
        const globalShortcut = remote.globalShortcut;

        globalShortcut.unregisterAll();

        const mediaKeys = [
          {
            name: "Alt+P",
            label: "play-pause",
            function: () => this.playPause()
          },
          {
            name: "Alt+]",
            label: "next-track",
            function: () => this.nextBack(1, true)
          },
          {
            name: "Alt+[",
            label: "previous-track",
            function: () => this.nextBack(-1, true)
          },
          {
            name: "Alt+I",
            label: "repeat-playlist",
            function: () =>
              this.$store.dispatch("setPlaylistsProp", {
                prop: "repeatSong",
                data: !state.playlists.repeatSong
              })
          },
          {
            name: "Alt+O",
            label: "shuffle-playlist",
            function: () =>
              this.$store.dispatch("setPlaylistsProp", {
                prop: "shufflePlaylist",
                data: !state.playlists.shufflePlaylist
              })
          },
          {
            name: "Alt+-",
            label: "volume-down",
            function: () => {
              this.$store.dispatch("changeVolume", { num: 0.1, minus: true });
              this.calcVolumeControlsSrc();
            }
          },
          {
            name: "Alt+=",
            label: "volume-up",
            function: () => {
              this.$store.dispatch("changeVolume", { num: 0.1, minus: false });
              this.calcVolumeControlsSrc();
            }
          }
        ];

        mediaKeys.forEach(key => {
          if (!globalShortcut.isRegistered(key.name)) {
            const ret = globalShortcut.register(key.name, () => {
              key.function();
            });

            if (!ret) {
              this.$store.dispatch("addAlert", {
                text: `${key.name} (${key.label}) registration failed. Another app must be using this key.`,
                type: "alert"
              });
            }
          }
        });
      }
    }
  },
  mounted() {
    this.calcVolumeControlsSrc();
    this.registerKeys();
  }
};
</script>

<style scoped lang="scss">
.controls {
  margin-top: 20px;
  width: 100%;
  height: 100px;
  display: flex;
  flex-direction: column;
  position: relative;

  &__volume-buttons {
    position: absolute;
    top: -28px;
    right: 0;
    cursor: pointer;

    &:hover {
      & .volume-buttons__button {
        transform: rotate(-10deg);
      }
    }

    .volume-buttons__button {
      transition: transform 0.2s ease-out;
    }

    .volume-buttons__audio-controller {
      width: 30px;
      height: 140px;
      position: absolute;
      top: -145px;
      right: -6px;
      border-radius: 8px;
      display: flex;

      &__level-bar {
        appearance: none;
        width: 80px;
        height: 6px;
        outline: none !important;
        transform: rotate(-90deg);
        position: absolute;
      }
    }
  }

  &__buttons {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 15px;

    &-button-play {
      margin: 0 35px;
      cursor: pointer;
    }

    &-button-pause {
      margin: 0 35px;
      cursor: pointer;
    }

    .skip-btn {
      transform: rotate(180deg);
      margin-right: 25px;
      cursor: pointer;
    }

    .back-btn {
      margin-left: 25px;
      cursor: pointer;
    }

    &-shuffle {
      cursor: pointer;

      & path {
        fill: var(--primary-text);
      }
    }

    &-repeat {
      cursor: pointer;

      & path {
        fill: var(--primary-text);
      }
    }
  }
}
</style>
