<template>
  <div class="table" id="table" :class="{ forPlaylists: forPlaylistsBool }">
    <DataTableCell v-for="(data, index) in array" :data="data" :key="index" @clicked="formatDataSongs" :index="index + 1" :forPlaylists="forPlaylistsBool" />
    <backBtn v-if="!this.forPlaylistsBool" @back="back" />
  </div>
</template>

<script>
import DataTableCell from './DataTableCell'
import BackBtn from '../../../components/BackBtn'

export default {
    name: 'DataTable',
    components: {
      DataTableCell,
      BackBtn
    },
    data() {
      return {
        array: [],
        forPlaylistsBool: this.forPlaylists,
        playlist: [],
        playlists: [],
        playlistNames: [],
        datesAdded: []
      }
    },
    props: {
      playlistsProp: Array,
      forPlaylists: Boolean
    },
    methods: {
      back() {
        if (this.forPlaylistsBool) {
            return
        } else {
          this.forPlaylistsBool = true;
          this.$emit('for-playlists-changed', true)

          const children = document.getElementById('table').children;
          
          for (let i = 0; i < children.length; i++) {
            const element = children[i];

            if (element.classList.contains('missing')) {
              element.classList.remove('missing')
            }

            if (element.classList.contains('clicked')) {
              element.classList.remove('clicked');
              break;
            }
          }

          this.$emit('back')
          this.formatDataPlaylists()
        }
      },
      async currentPlayingChanged() {
        const { remote } = require('electron');

        const currentPlaying = this.$store.state.currentPlaying;
        const filename = 'file://' + remote.app.getPath('documents') + '/mustap/songs/' + currentPlaying.filename;
        currentPlaying.sound.src = filename;
        
        setTimeout(() => currentPlaying.sound.play(), 500);
      },
      formatDataPlaylists() {
        setTimeout(() => {
          let array = []
          let obj = {};

          this.playlists = this.playlistsProp.map(playlist => playlist.data)
          this.playlistNames = this.playlistsProp.map(playlist => playlist.name)
          this.datesAdded = this.playlistsProp.map(playlist => playlist.added)

          this.playlists.forEach((arr, index) => {
            obj.leftTop = this.playlistNames[index];
            obj.leftBottom = this.datesAdded[index];
            obj.rightTop = arr.length + ' Songs';

            array.push(obj);
            obj = {};
          });

          this.array = array;
          window.console.log(array);
        }, 200)
    },
    formatDataSongs(e) {
      if (!this.forPlaylistsBool) {
        const index = e - 1;
        const song = this.playlist[index];
        const currentPlaying = this.$store.state.currentPlaying;

        this.$store.state.currentPlaylist = this.$store.state.currentPlaylistViewing;

        currentPlaying.thumbnail = song.thumbnailUrl.replace('hqdefault', 'maxresdefault');
        currentPlaying.title = song.title;
        currentPlaying.artist = song.artist;
        currentPlaying.duration = song.duration;
        currentPlaying.currentTime = '0:00';
        currentPlaying.lengthSeconds = song.duration.split(':')[0] * 60 + Number.parseInt(song.duration.split(':')[1]);
        currentPlaying.filename = song.filename;
        currentPlaying.playing = song.thmbnailUrl === currentPlaying.thumbnail ? currentPlaying.playing = !currentPlaying.playing : currentPlaying.playing = true;
        currentPlaying.index = index;

        const children = document.getElementById('table').children;
        const clickedEle = children[currentPlaying.index];

        for (let i = 0; i < children.length; i++) {
          const element = children[i];

          if (element.classList.contains('clicked')) {
            element.classList.remove('clicked');
            break;
          }
        }

        clickedEle.classList.add('clicked');
        this.currentPlayingChanged();
      } else {
        this.forPlaylistsBool = false;
        this.$emit('for-playlists-changed', false)
        this.$emit('clicked-playlist')
        const index = e - 1;
        this.playlist = this.playlists[index];
        let array = [];
        let obj = {};
        
        this.playlist.forEach(song => {
          obj.leftTop = song.title;
          obj.leftBottom = song.artist;
          obj.rightTop = song.duration;

          array.push(obj);
          obj = {};
        })

        this.$store.state.currentPlaylistViewing = index;

        console.log(this.$store.state.currentPlaylist)
        
        if (this.$store.state.currentPlaying.title == 'N / A' && this.$store.state.currentPlaylist === -1) {
          this.$store.state.currentPlaylist = index;
          const index = 0;
          let song = this.playlist[index];
          const currentPlaying = this.$store.state.currentPlaying;

          if (song.missing) {
            do {
              song = this.playlist[index + 1];
            } while (song.missing);
          }

          this.$store.state.currentPlaylist = this.$store.state.currentPlaylistViewing;

          currentPlaying.thumbnail = song.thumbnailUrl.replace('hqdefault', 'maxresdefault');
          currentPlaying.title = song.title;
          currentPlaying.artist = song.artist;
          currentPlaying.duration = song.duration;
          currentPlaying.currentTime = '0:00';
          currentPlaying.lengthSeconds = song.duration.split(':')[0] * 60 + Number.parseInt(song.duration.split(':')[1]);
          currentPlaying.filename = song.filename;
          currentPlaying.playing = song.thmbnailUrl === currentPlaying.thumbnail ? currentPlaying.playing = !currentPlaying.playing : currentPlaying.playing = true;
          currentPlaying.index = index;

          this.currentPlayingChanged()
        }

        this.array = array;

        setTimeout(() => {
          const { remote } = require('electron');
          const fs = require('fs');

          const children = document.getElementById('table').children;
          const songsPath = remote.app.getPath('documents') + '/mustap/songs/';

          this.$store.state.missingSongsCount = 0;

          for (let i = 0; i < children.length - 1; i++) {
            const element = children[i];
            
            const filename = songsPath + this.$store.state.playlists[this.$store.state.currentPlaylistViewing].data[i].filename;

            if (!fs.existsSync(filename)) {
              element.classList.add('missing')
              this.$store.state.missingSongsCount++;
              this.$store.state.playlists[this.$store.state.currentPlaylistViewing].data[i].missing = true;
            }
          }
        
          if (this.$store.state.currentPlaylist == this.$store.state.currentPlaylistViewing) {
            const currentPlaying = this.$store.state.currentPlaying;

            if (currentPlaying.title != 'N / A') {
              const elements = document.querySelectorAll('p.cell__left-text-top');
              for (let i = 0; i < elements.length; i++) {
                const ele = elements[i];

                let title = currentPlaying.title;

                if (title[0] == ' ') {
                  title = title.slice(1, title.length);
                }

                if (ele.innerText == title) {
                  const clickedEle = document.getElementById('table').children[i];
                  clickedEle.classList.add('clicked');
                  if (i > 0) {
                    if (clickedEle.getBoundingClientRect().top - clickedEle.parentElement.offsetTop >= document.getElementById('table').clientHeight - 64) {
                      document.getElementById('table').scrollTo({top: clickedEle.offsetTop - clickedEle.parentElement.offsetTop, behavior: 'smooth'});
                    }
                  } else {
                    if (clickedEle.getBoundingClientRect().bottom - clickedEle.parentElement.offsetTop <= 0) {
                      document.getElementById('table').scrollTo({top: clickedEle.offsetTop - clickedEle.parentElement.offsetTop, behavior: 'smooth'});
                    }
                  }
                  break;
                }
              }
            }
          }

        }, 100);

      }
    }
  },
  mounted() {
    this.formatDataPlaylists()
  }
}
</script>

<style lang="scss">
  ::-webkit-scrollbar {
    background: transparent;
    width: 12px;
  }

  ::-webkit-scrollbar-thumb {
    background: var(--lighter-bg);
    border-radius: 20px;
  }

  ::-webkit-scrollbar-corner {
    display: none;
  }

  .table {
    width: 100%;
    height: 100%;
    overflow: scroll;
    padding-right: 8px;
    overflow-x: hidden;
  }
</style>