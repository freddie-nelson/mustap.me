<template>
    <div class="controls" :style="{ padding: `0 ${ padding }px` }">

          <div class="controls__volume-buttons" :style="{ padding: `0 ${ padding }px 0 0` }">
            <div 
              class="volume-buttons__audio-controller" 
              v-if="showVolumeControls" ref="music-volume-controller" 
              :style="{ margin: `0 ${ padding }px 0 0`, backgroundColor: `var(${ bgColor })` }">
                <vue-range-slider 
                  ref="volume-slider" 
                  @slide-end="calcVolumeControlsSrc"
                  v-model="$store.state.currentPlaying.sound.volume" 
                  :max="1" 
                  :min="0" 
                  :step="0.01" 
                  :direction="'vertical'" 
                  :tooltip="false" 
                  :dot-size="12" 
                  :height="130" 
                  :width="8" 
                  style="display: block; margin: auto;"
                ></vue-range-slider>
            </div>

            <img 
              v-if="volumeControlsBtn === 1"
              alt="" 
              src="../assets/svg/volume/volume-none.svg"
              @click="showVolumeControls = !showVolumeControls" 
              class="volume-buttons__controls-volume-none volume-buttons__button"
            >

            <img 
              v-else-if="volumeControlsBtn === 2"
              alt="" 
              src="../assets/svg/volume/volume-one.svg"
              @click="showVolumeControls = !showVolumeControls" 
              class="volume-buttons__controls-volume-one volume-buttons__button"
            >

            <img 
              v-else
              alt="" 
              src="../assets/svg/volume/volume-full.svg"
              @click="showVolumeControls = !showVolumeControls" 
              class="volume-buttons__controls-volume-full volume-buttons__button"
            >

          </div>

          <vue-range-slider @slide-end="changeCurrentPlayingTime" :value="currentTime" :max="$store.state.currentPlaying.lengthSeconds" :min="0" :step="1" :direction="'horizontal'" :tooltip="false" :dot-size="16" :height="10" style="display: block; padding: 0; margin: 0; cursor: pointer;"></vue-range-slider>
          <div class="controls__buttons">

            <img
              src="../assets/svg/controls/repeat.svg" 
              :style="{ opacity: $store.state.repeatPlaylist ? '1' : '.7' }"
              alt="" 
              @click="$store.state.repeatPlaylist = !$store.state.repeatPlaylist" 
              class="controls__buttons-repeat"
            >

            <img 
              src="../assets/svg/controls/next.svg" 
              alt="" 
              @click="nextBack(-1)" 
              class="controls__buttons-button back-btn"
            >

            <img
              v-if="!this.$store.state.currentPlaying.playing"
              src="../assets/svg/controls/play.svg" 
              alt="" 
              @click="playPause" 
              class="controls__buttons-button-play"
            >

            <img
              v-else
              src="../assets/svg/controls/pause.svg" 
              alt="" 
              @click="playPause" 
              class="controls__buttons-button-pause"
            >

            <img 
              src="../assets/svg/controls/next.svg" 
              alt="" 
              @click="nextBack(1)" 
              class="controls__buttons-button skip-btn"
            >

            <img
              src="../assets/svg/controls/shuffle.svg" 
              :style="{ opacity: $store.state.shufflePlaylist ? '1' : '.7' }"
              alt="" 
              @click="$store.state.shufflePlaylist = !$store.state.shufflePlaylist" 
              class="controls__buttons-shuffle"
            >

        </div>
    </div>
</template>

<script>
export default {
  name: 'TrackControls',
  data() {
    return {
      showVolumeControls: false,
      volumeControlsBtn: 3
    }
  },
  props: {
      currentTime: Number,
      padding: Number,
      bgColor: String,
  },
  methods: {
    calcVolumeControlsSrc() {
      const volume = this.$store.state.currentPlaying.sound.volume;

      if (volume === 0) {
        this.volumeControlsBtn = 1;
      } else if (volume <= 0.5) {
        this.volumeControlsBtn = 2;
      } else {
        this.volumeControlsBtn = 3;
      }
    },
    changeCurrentPlayingTime(val) {
      this.$store.state.currentPlaying.sound.currentTime = val;
    },
    async currentPlayingChanged() {
      const dataurl = require('dataurl');
      const fs = require('fs');

      const convertSong = (filePath) => {
        const songPromise = new Promise((resolve, reject) => {
          fs.readFile(filePath, (err, data) => {
            if (err) { reject(err); }
            resolve(dataurl.convert({ data, mimetype: 'audio/mp3' }));
          });
        });
        return songPromise;
      };

      const currentPlaying = this.$store.state.currentPlaying;

      const filename = await convertSong(this.$store.state.documentsPath + '/mustap/songs/' + currentPlaying.filename);

      currentPlaying.sound.src = filename;

      setTimeout(() => currentPlaying.sound.play(), 500);
    },
    playPause() {
      if (this.$store.state.currentPlaying.title != 'N / A') {
        const currentPlaying = this.$store.state.currentPlaying;
        currentPlaying.playing = !currentPlaying.playing;

        if (currentPlaying.playing) {
          currentPlaying.sound.play();
        } else {
          currentPlaying.sound.pause()
        }
      }
    },
    nextBack(num, caller) {
      if (this.$store.state.currentPlaying.title != 'N / A') {

        const currentPlaying = this.$store.state.currentPlaying;
        let index = currentPlaying.index + num;
        const playlistLength = this.$store.state.playlists[this.$store.state.currentPlaylist].data.length;

        const indexForScroll = currentPlaying.index;
        
        if (!caller) {
          if (this.$store.state.shufflePlaylist) {
            let randomIndex;

            do {
              randomIndex = Math.floor(Math.random() * playlistLength);
            } while (randomIndex == currentPlaying.index);

            index = randomIndex;
          }

          if (index >= playlistLength || index < 0) {
            if (this.$store.state.repeatPlaylist) {
              if (index < 0) {
                index = playlistLength - 1;
              } else {
                index = 0;
              }
            } else {
              return
            }
          }
        } else {
          index = num;
        }

        const fs = require('fs');

        const currentPlaylist = this.$store.state.playlists[this.$store.state.currentPlaylist].data;
        const songsPath = this.$store.state.documentsPath + '/mustap/songs/';    
        const filename = songsPath + currentPlaylist[index].filename;

        if (!fs.existsSync(filename)) {
          
          if (this.$store.state.shufflePlaylist) {
            this.nextBack(num);

          } else {

            if (num === 1 && index + 1 <= currentPlaylist.length - 1) {
              let filenameAlt;

              do {
                index++;
                filenameAlt = songsPath + currentPlaylist[index].filename;
              } while (!fs.existsSync(filenameAlt));

            } else if (num === -1 && index - 1 >= 0) {
              let filenameAlt;

              do {
                index--;
                filenameAlt = songsPath + currentPlaylist[index].filename;
              } while (!fs.existsSync(filenameAlt));

            } else {
              return
            }

          }

        }
        
        if (this.$store.state.currentPlaying.title === 'N / A') {
          return
        } else {
          const song = currentPlaylist[index];

          if (song.missing) {
            return
          }

          currentPlaying.sound.pause();
          
          currentPlaying.thumbnail = song.thumbnailUrl;
          currentPlaying.title = song.title;
          currentPlaying.artist = song.artist;
          currentPlaying.duration = song.duration;
          currentPlaying.currentTime = '0:00';
          currentPlaying.lengthSeconds = song.duration.split(':')[0] * 60 + Number.parseInt(song.duration.split(':')[1]);
          currentPlaying.filename = song.filename;
          currentPlaying.playing = song.title !== undefined ? true : false;
          currentPlaying.index = index;

          console.log(currentPlaying.index);

          if (this.$store.state.currentPlaylist == this.$store.state.currentPlaylistViewing) {
            if (document.getElementById('table') && !document.getElementById('table').classList.contains('forPlaylists')) {
              if (document.getElementById('table').children[index]) {
                const children = document.getElementById('table').children;
                const clickedEle = children[index];

                for (let i = 0; i < children.length; i++) {
                  const element = children[i];

                  if (element.classList.contains('clicked')) {
                    element.classList.remove('clicked');
                    break;
                  }
                }

                clickedEle.classList.add('clicked');

                if (index > indexForScroll) {
                  if (clickedEle.getBoundingClientRect().top - clickedEle.parentElement.offsetTop <= 64 || clickedEle.getBoundingClientRect().top - clickedEle.parentElement.offsetTop >= document.getElementById('table').clientHeight - 64) {
                    document.getElementById('table').scrollTo({top: clickedEle.offsetTop - clickedEle.parentElement.offsetTop, behavior: 'smooth'});
                  }
                } else {
                  if (clickedEle.getBoundingClientRect().bottom - clickedEle.parentElement.offsetTop <= 64 || clickedEle.getBoundingClientRect().bottom - clickedEle.parentElement.offsetTop >= 0) {
                    document.getElementById('table').scrollTo({top: clickedEle.offsetTop - clickedEle.parentElement.offsetTop, behavior: 'smooth'});
                  }
                }
                
              }
            }
          }

          this.currentPlayingChanged()
        }
      }
    }
  },
  mounted() {
    this.calcVolumeControlsSrc()

    if (this.$store.state.mountedTrackControlsCount === 0) {
      this.$store.state.mountedTrackControlsCount = 1;
      console.log('registering keys')

      const { remote } = require('electron')
      const globalShortcut = remote.globalShortcut;

      globalShortcut.unregisterAll();

      const mediaKeys = [
        { name: 'Alt+P', label: 'play-pause', function: () => this.playPause() },
        { name: 'Alt+]', label: 'next-track', function: () => this.nextBack(1) },
        { name: 'Alt+[', label: 'previous-track', function: () => this.nextBack(-1) },
        { name: 'Alt+I', label: 'repeat-playlist', function: () => this.$store.state.repeatPlaylist = !this.$store.state.repeatPlaylist },
        { name: 'Alt+O', label: 'shuffle-playlist', function: () => this.$store.state.shufflePlaylist = !this.$store.state.shufflePlaylist },
        { name: 'Alt+-', label: 'volume-down', function: () => this.$store.state.currentPlaying.sound.volume - 0.1 < 0 ? this.$store.state.currentPlaying.sound.volume = 0 : this.$store.state.currentPlaying.sound.volume -= 0.1 },
        { name: 'Alt+=', label: 'volume-up', function: () => this.$store.state.currentPlaying.sound.volume + 0.1 > 1 ? this.$store.state.currentPlaying.sound.volume = 1 : this.$store.state.currentPlaying.sound.volume += 0.1 },
      ];

      mediaKeys.forEach(key => {
        if (!globalShortcut.isRegistered(key.name)) {
          const ret = globalShortcut.register(key.name, () => {
            key.function()
          })

          if (!ret) {
            this.$store.state.alerts.push({ text: `${ key.name } (${ key.label }) registration failed. Another app must be using this key.`, type: 'alert' });
          }
        }
      });
    }
  }
}
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
              transition: transform .2s ease-out;
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
                cursor: pointer
            }

            &-button-pause {
                margin: 0 35px;
                cursor: pointer
            }

            .skip-btn {
                transform: rotate(180deg);
                margin-right: 25px;
                cursor: pointer
            }

            .back-btn {
                margin-left: 25px;
                cursor: pointer
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