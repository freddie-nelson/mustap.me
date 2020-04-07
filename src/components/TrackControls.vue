<template>
    <div class="controls" :style="{ padding: `0 ${ padding }px` }">

          <div class="controls__volume-buttons" :style="{ padding: `0 ${ padding }px 0 0` }">
            <div class="volume-buttons__audio-controller" v-if="showVolumeControls" ref="music-volume-controller" :style="{ margin: `0 ${ padding }px 0 0`, backgroundColor: `var(${ bgColor })` }">
                <vue-range-slider ref="volume-slider" v-model="$store.state.currentPlaying.sound.volume" :max="1" :min="0" :step="0.01" :direction="'vertical'" :tooltip="false" :dot-size="12" :height="130" :width="8" style="display: block; margin: auto;"></vue-range-slider>
            </div>

            <svg v-if="$store.state.currentPlaying.sound.volume > 0.4" @click="showVolumeControls = !showVolumeControls" class="volume-buttons__controls-volume-full volume-buttons__button" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none">
              <path d="M7.84 2.065L4.596 5.4H.875C.392 5.4 0 5.803 0 6.3v5.4c0 .497.392.9.875.9h3.72l3.244 3.335c.548.564 1.494.168 1.494-.636V2.7c0-.805-.946-1.2-1.494-.636zM17.5 9c0-2.382-1.17-4.573-3.127-5.86-.408-.268-.95-.143-1.207.28s-.138.983.27 1.25c1.45.952 2.314 2.57 2.314 4.328s-.865 3.376-2.314 4.328c-.408.268-.53.828-.27 1.25.237.39.77.568 1.207.28C16.33 13.572 17.5 11.382 17.5 9zm-5.17-2.882c-.422-.237-.955-.08-1.19.354s-.08.982.345 1.223c.47.266.763.766.763 1.305s-.292 1.04-.763 1.305c-.423.24-.577.787-.344 1.223s.767.592 1.19.354C13.36 11.3 14 10.195 14 9a3.31 3.31 0 0 0-1.669-2.882z" fill="#fff"/>
            </svg>

            <svg v-if="$store.state.currentPlaying.sound.volume <= 0.4 && $store.state.currentPlaying.sound.volume > 0" @click="showVolumeControls = !showVolumeControls" class="volume-buttons__controls-volume-one volume-buttons__button" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none">
              <path d="M7.84 2.065L4.596 5.4H.875C.392 5.4 0 5.803 0 6.3v5.4c0 .497.392.9.875.9h3.72l3.244 3.335c.548.564 1.494.168 1.494-.636V2.7c0-.805-.946-1.2-1.494-.636zm4.492 4.053c-.422-.237-.955-.08-1.19.354s-.08.982.345 1.223c.47.266.763.766.763 1.305s-.292 1.04-.763 1.305c-.423.24-.577.787-.344 1.223s.767.592 1.19.354C13.36 11.3 14 10.195 14 9a3.31 3.31 0 0 0-1.669-2.882z" fill="#fff"/>
            </svg>

            <svg v-if="$store.state.currentPlaying.sound.volume == 0" @click="showVolumeControls = !showVolumeControls" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" class="volume-buttons__controls-volume-none volume-buttons__button">
              <path d="M7.84 2.065L4.596 5.4H.875C.392 5.4 0 5.803 0 6.3v5.4c0 .497.392.9.875.9h3.72l3.244 3.335c.548.564 1.494.168 1.494-.636V2.7c0-.805-.946-1.2-1.494-.636z" fill="#fff"/>
            </svg>
          </div>

          <vue-range-slider @slide-end="changeCurrentPlayingTime" :value="currentTime" :max="$store.state.currentPlaying.lengthSeconds" :min="0" :step="1" :direction="'horizontal'" :tooltip="false" :dot-size="16" :height="10" style="display: block; padding: 0; margin: 0; cursor: pointer;"></vue-range-slider>
          <div class="controls__buttons">
            
            <svg @click="$store.state.repeatPlaylist = !$store.state.repeatPlaylist" class="controls__buttons-repeat" xmlns="http://www.w3.org/2000/svg" width="20" height="15" fill="none"><g clip-path="url(#B)">
              <path :fill-opacity="$store.state.repeatPlaylist ? '1' : '.7'" d="M.001 7.25c0-1.592.614-3.086 1.73-4.21a5.84 5.84 0 0 1 4.177-1.745h6.54V-.834l6.443 3.75-6.443 3.75V4.54h-6.54c-1.48 0-2.684 1.214-2.684 2.707l.008.218-2.918 1.7a5.97 5.97 0 0 1-.313-1.918zm18.27 4.71c-.546.554-1.197.994-1.915 1.294s-1.488.454-2.266.452H7.56v2.13l-6.45-3.754 6.45-3.754v2.13h6.527c1.482 0 2.688-1.217 2.688-2.71l-.008-.206 2.925-1.703c.203.608.308 1.25.308 1.9 0 1.593-.615 3.09-1.73 4.215z" fill="#fff" stroke="#242424"/></g>
              <defs><clipPath id="B"><path fill="#fff" d="M0 0h20v15H0z"/></clipPath></defs>
            </svg>

            <svg @click="nextBack(-1)" class="controls__buttons-button back-btn" xmlns="http://www.w3.org/2000/svg" width="22" height="20" fill="none"><g clip-path="url(#A)">
              <path d="M4.948 8.385L19.09.257C20.24-.404 22 .237 22 1.87v16.254c0 1.465-1.635 2.348-2.91 1.613L4.948 11.612c-1.262-.723-1.266-2.504 0-3.227z" fill="#fff"/></g>
              <rect width="3" height="20" rx="1" transform="matrix(-1 0 0 1 3 0)" fill="#fff"/>
              <defs><clipPath id="A"><path transform="matrix(-1 0 0 1 22 0)" fill="#fff" d="M0 0h18v20H0z"/></clipPath></defs>
            </svg>

            <svg class="controls__buttons-button-play" @click="playPause" v-if="!this.$store.state.currentPlaying.playing" xmlns="http://www.w3.org/2000/svg" width="34" height="36" fill="none">
              <path d="M32.2 15.093L5.495.462C3.324-.726 0 .427 0 3.366V32.62c0 2.637 3.09 4.226 5.495 2.904L32.2 20.9c2.383-1.3 2.39-4.507 0-5.808z" fill="#fff"/>
            </svg>

            <svg class="controls__buttons-button-pause" @click="playPause" v-if="this.$store.state.currentPlaying.playing" xmlns="http://www.w3.org/2000/svg" width="34" height="36" viewBox="0 0 34 36" fill="none">
              <g clip-path="url(#clip0)">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M10.2436 33.5C10.2436 34.1851 9.88764 34.8422 9.25411 35.3267C8.62057 35.8111 7.76131 36.0833 6.86536 36.0833H3.48715C2.5912 36.0833 1.73194 35.8111 1.0984 35.3267C0.464865 34.8422 0.108948 34.1851 0.108948 33.5V2.49996C0.108948 1.81482 0.464865 1.15774 1.0984 0.673267C1.73194 0.188798 2.5912 -0.083374 3.48715 -0.083374H6.86536C7.76131 -0.083374 8.62057 0.188798 9.25411 0.673267C9.88764 1.15774 10.2436 1.81482 10.2436 2.49996V33.5ZM33.891 33.5C33.891 34.1851 33.5351 34.8422 32.9015 35.3267C32.268 35.8111 31.4087 36.0833 30.5128 36.0833H27.1346C26.2386 36.0833 25.3794 35.8111 24.7458 35.3267C24.1123 34.8422 23.7564 34.1851 23.7564 33.5V2.49996C23.7564 1.81482 24.1123 1.15774 24.7458 0.673267C25.3794 0.188798 26.2386 -0.083374 27.1346 -0.083374H30.5128C31.4087 -0.083374 32.268 0.188798 32.9015 0.673267C33.5351 1.15774 33.891 1.81482 33.891 2.49996V33.5Z" fill="white"/>
              </g>
              <defs>
                <clipPath id="clip0">
                  <rect width="34" height="36" fill="white"/>
                </clipPath>
              </defs>
            </svg>

            <svg @click="nextBack(1)" class="controls__buttons-button skip-btn" xmlns="http://www.w3.org/2000/svg" width="22" height="20" fill="none"><g clip-path="url(#A)">
              <path d="M4.948 8.385L19.09.257C20.24-.404 22 .237 22 1.87v16.254c0 1.465-1.635 2.348-2.91 1.613L4.948 11.612c-1.262-.723-1.266-2.504 0-3.227z" fill="#fff"/></g>
              <rect width="3" height="20" rx="1" transform="matrix(-1 0 0 1 3 0)" fill="#fff"/>
              <defs><clipPath id="A"><path transform="matrix(-1 0 0 1 22 0)" fill="#fff" d="M0 0h18v20H0z"/></clipPath></defs>
            </svg>

            <svg @click="$store.state.shufflePlaylist = !$store.state.shufflePlaylist" xmlns="http://www.w3.org/2000/svg" class="controls__buttons-shuffle" width="17" height="15" fill="none"> 
              <path :fill-opacity="$store.state.shufflePlaylist ? '1' : '.7'" d="M12.83 4.64h.782v2.477L17 3.633 13.6.15v2.066h-.782c-3.14 0-4.9 2.37-6.472 4.458-1.404 1.88-2.618 3.504-4.578 3.504H0V12.6h1.78c3.14 0 4.9-2.368 6.472-4.46C9.655 6.262 10.87 4.64 12.83 4.64h0zM4.6 6.166l.405-.54 1.064-1.38C4.944 3.177 3.6 2.4 1.78 2.4H0v2.422h1.78c1.128 0 2.008.54 2.82 1.353zM13.6 10.35h-.782c-1.196 0-2.114-.607-2.967-1.504l-.258.344-1.223 1.573c1.153 1.146 2.55 2.01 4.447 2.01h.782v2.075L17 11.367l-3.4-3.483v2.467z" fill="#fff"/>
            </svg>

        </div>
    </div>
</template>

<script>
export default {
  name: 'TrackControls',
  data() {
    return {
      showVolumeControls: false,
    }
  },
  props: {
      currentTime: Number,
      padding: Number,
      bgColor: String
  },
  methods: {
    changeCurrentPlayingTime(val) {
      this.$store.state.currentPlaying.sound.currentTime = val;
    },
    currentPlayingChanged() {
      const { remote } = require('electron');

      const currentPlaying = this.$store.state.currentPlaying;
      currentPlaying.sound.src = 'file://' + remote.app.getPath('documents') + '/mustap/songs/' + currentPlaying.filename;

      setTimeout(() => currentPlaying.sound.play(), 500);
    },
    playPause() {
      if (this.$store.state.currentPlaying.title != 'N / A') {
        const currentPlaying = this.$store.state.currentPlaying;
        currentPlaying.playing = !currentPlaying.playing;
        console.log(currentPlaying.sound)

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
              index = 0;
            } else {
              return
            }
          }
        } else {
          index = num;
        }

        const { remote } = require('electron');
        const fs = require('fs');

        const currentPlaylist = this.$store.state.playlists[this.$store.state.currentPlaylist].data;
        const songsPath = remote.app.getPath('documents') + '/mustap/songs/';    
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
          currentPlaying.playing = song.thmbnailUrl === currentPlaying.thumbnail ? currentPlaying.playing = !currentPlaying.playing : currentPlaying.playing = true;
          currentPlaying.index = index;

          console.log(currentPlaying.index);

          console.log(currentPlaying.filename, song.filename);

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
                  if (clickedEle.getBoundingClientRect().top - clickedEle.parentElement.offsetTop >= document.getElementById('table').clientHeight - 64) {
                    document.getElementById('table').scrollTo({top: clickedEle.offsetTop - clickedEle.parentElement.offsetTop, behavior: 'smooth'});
                  }
                } else {
                  if (clickedEle.getBoundingClientRect().bottom - clickedEle.parentElement.offsetTop <= 0) {
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
    if (this.$store.state.mountedTrackControlsCount === 0) {
      this.$store.state.mountedTrackControlsCount = 1;
      console.log('registering keys')

      const { remote } = require('electron')
      const globalShortcut = remote.globalShortcut;

      globalShortcut.unregisterAll();

      const mediaKeys = [
        { name: 'Alt+P', function: () => this.playPause() },
        { name: 'Alt+]', function: () => this.nextBack(1) },
        { name: 'Alt+[', function: () => this.nextBack(-1) },
        { name: 'Alt+I', function: () => this.$store.state.repeatPlaylist = !this.$store.state.repeatPlaylist },
        { name: 'Alt+O', function: () => this.$store.state.shufflePlaylist = !this.$store.state.shufflePlaylist },
        { name: 'Alt+-', function: () => this.$store.state.currentPlaying.sound.volume - 0.1 < 0 ? this.$store.state.currentPlaying.sound.volume = 0 : this.$store.state.currentPlaying.sound.volume -= 0.1 },
        { name: 'Alt+=', function: () => this.$store.state.currentPlaying.sound.volume + 0.1 > 1 ? this.$store.state.currentPlaying.sound.volume = 1 : this.$store.state.currentPlaying.sound.volume += 0.1 },
      ];

      mediaKeys.forEach(key => {
        if (!globalShortcut.isRegistered(key.name)) {
          const ret = globalShortcut.register(key.name, () => {
            key.function()
          })

          if (!ret) {
            console.log(`${ key.name } registration failed. Another app must be using this key.`)
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

            &-button {
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