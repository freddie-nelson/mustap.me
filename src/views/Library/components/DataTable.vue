<template>
  <div class="table" id="table">
    <DataTableCell v-for="(data, index) in array" :data="data" :key="index" @clicked="formatDataSongs" :index="index + 1" />
  </div>
</template>

<script>
import DataTableCell from './DataTableCell'

export default {
    name: 'DataTable',
    components: {
      DataTableCell
    },
    data() {
      return {
        array: [],
        forPlaylistsBool: this.forPlaylists,
        playlist: []
      }
    },
    props: {
      playlists: Array,
      playlistNames: Array,
      forPlaylists: Boolean
    },
    methods: {
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

          this.playlists.forEach((arr, index) => {
            obj.leftTop = this.playlistNames[index];
            let views = JSON.stringify(arr.reduce((objA, objB) => Number.parseInt(objA.views) + Number.parseInt(objB.views)));
            let viewsLength = views.length;
            obj.leftBottom = views.slice(0, 2) + '0'.repeat(viewsLength - 2) + '+ views';
            obj.rightTop = arr.length + ' Songs';

            array.push(obj);
            obj = {};
          });

          this.array = array;
          window.console.log(array);
        }, 50)
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

        this.array = array.slice(0, 50);
      }
    }
  },
  mounted() {
    this.formatDataPlaylists()
  }
}
</script>

<style lang="scss">
  .table {
    max-width: 680px;
    margin-left: 60px;
    margin-top: 40px;
    width: 100%;
    height: 100%;
  }
</style>