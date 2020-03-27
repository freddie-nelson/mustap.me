<template>
  <div class="table" id="table">
    <DataTableCell v-for="(data, index) in array" :data="data" :key="index" @clicked="formatDataSongs" :index="index + 1" />
    <backBtn @back="back" />
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
          this.$emit('back')
          this.formatDataPlaylists()
        }
      },
      currentPlayingChanged() {
        const { remote } = require('electron');

        const currentPlaying = this.$store.state.currentPlaying;
        currentPlaying.sound.src = 'file://' + remote.app.getPath('documents') + '/mustap/songs/' + currentPlaying.filename;

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
        }, 100)
    },
    formatDataSongs(e) {
      if (!this.forPlaylistsBool) {
        const song = this.playlist[e - 1];
        const currentPlaying = this.$store.state.currentPlaying;

        currentPlaying.thumbnail = song.thumbnailUrl;
        currentPlaying.title = song.title.length > 18 ? song.title.split('').slice(0, 18).join('') + '...' : song.title;
        currentPlaying.artist = song.artist;
        currentPlaying.duration = song.duration;
        currentPlaying.currentTime = '0:00';
        currentPlaying.lengthSeconds = song.duration[0] * 60 + Number.parseInt(song.duration.split(':')[1]);
        currentPlaying.filename = song.filename;
        currentPlaying.playing = song.thmbnailUrl === currentPlaying.thumbnail ? currentPlaying.playing = !currentPlaying.playing : currentPlaying.playing = true;
        currentPlaying.index = e - 1;

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

        this.$store.state.currentPlaylist = index;

        this.array = array;
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
    background: rgb(31, 31, 31);
    border-radius: 20px;
  }

  ::-webkit-scrollbar-corner {
    display: none;
  }

  .table {
    max-width: 680px;
    margin-left: 60px;
    width: 100%;
    height: 100%;
    overflow: scroll;
    padding-right: 8px;
    overflow-x: hidden;
  }
</style>