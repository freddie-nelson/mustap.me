<template>
  <div class="table" id="table" :class="{ forPlaylists: forPlaylistsBool }">
    <DataTableCell v-for="(data, index) in array" :data="data" :key="index" @clicked="formatDataSongs" @deleteSong="deleteSong" :index="index + 1" :forPlaylists="forPlaylistsBool" />
    <backBtn style="left: 16px" v-if="!this.forPlaylistsBool" @back="back" />
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
        forPlaylistsBool: true,
        playlist: [],
        playlists: [],
        playlistNames: [],
        datesAdded: []
      }
    },
    props: {
      playlistsProp: Array,
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
      deleteSong(index) {
        this.$store.state.deleteClickedIndex = -1;
        console.log(this.$store.state.deleteClickedIndex);
        const i = index - 1;
        const fs = require('fs');

        const playlist = this.$store.state.playlists[this.$store.state.currentPlaylistViewing]; 
        const song = playlist.data[i];
        const path = this.$store.state.documentsPath + '/mustap/songs/' + song.filename;
        const playlistPath = this.$store.state.documentsPath + '/mustap/playlists/' + playlist.name + '.json';
        const deletedPlaylistPath = this.$store.state.documentsPath + '/mustap/playlists/' + playlist.name + '__deleted__.json'

        playlist.data = playlist.data.filter((song, index) => index !== i);
        this.playlist = playlist.data;

        fs.promises.writeFile(playlistPath, JSON.stringify(playlist.data));

        if (fs.existsSync(deletedPlaylistPath)) {
          const data = JSON.parse(fs.readFileSync(deletedPlaylistPath));
          data.push(song);

          fs.promises.writeFile(deletedPlaylistPath, JSON.stringify(data))
        } else {
          fs.promises.writeFile(deletedPlaylistPath, JSON.stringify([ song ]))
        }
        
        let array = [];
        let obj = {};
        
        playlist.data.forEach(song => {
          obj.leftTop = song.title;
          obj.leftBottom = song.artist;
          obj.rightTop = song.duration;

          array.push(obj);
          obj = {};
        });

        this.array = array;

        fs.promises.unlink(path)
          .then(() => {
            this.$store.state.alerts.push({ text: `${ song.title } has been deleted from playlist '${ playlist.name }'.`, type: 'alert' })
          })
          .catch(err => {
            this.$store.state.alerts.push({ text: `${ song.title } has been could not be delete from playlist '${ playlist.name }'. Error: ${ err }`, type: 'warning' })
          });

        if (this.$store.state.currentPlaying.index === i) {
          document.getElementById('table').children[i].classList.remove('clicked');
          const currentPlaying = this.$store.state.currentPlaying;

          currentPlaying.sound.pause();

          currentPlaying.thumbnail = 'N / A';
          currentPlaying.title = 'N / A';
          currentPlaying.artist = 'N / A';
          currentPlaying.duration = '0:00';
          currentPlaying.currentTime = '0:00';
          currentPlaying.lengthSeconds = 0;
          currentPlaying.filename = '';
          currentPlaying.playing = false;
          currentPlaying.index = 0;
          currentPlaying.sound.src = '';
          currentPlaying.currentTimeSeconds = 0;
        }

        this.addClasses()
        this.playlist = playlist.data;
      },
      async currentPlayingChanged() {
        const { remote } = require('electron');

        const currentPlaying = this.$store.state.currentPlaying;
        const filename = 'file://' + remote.app.getPath('documents') + '/mustap/songs/' + currentPlaying.filename;
        currentPlaying.sound.src = filename;
        
        setTimeout(() => currentPlaying.sound.play(), 500);
      },
      formatDataPlaylists() {
        let array = []
        let obj = {};

        const playlistsFiltered = this.playlistsProp.filter(playlist => playlist.name.indexOf('__deleted__') === -1)
        console.log(playlistsFiltered);

        this.playlists = playlistsFiltered.map(playlist => playlist.data)
        this.playlistNames = playlistsFiltered.map(playlist => playlist.name)
        this.datesAdded = playlistsFiltered.map(playlist => playlist.added)

        this.playlists.forEach((arr, index) => {
          obj.leftTop = this.playlistNames[index];
          obj.leftBottom = this.datesAdded[index];
          obj.rightTop = arr.length + ' Songs';

          array.push(obj);
          obj = {};
        });

        this.array = array;
    },
    formatDataSongs(e) {
      if (!this.forPlaylistsBool) {
        /* Get the song that the user clicked on */
        const index = e - 1;
        const song = this.playlist[index];
        const currentPlaying = this.$store.state.currentPlaying;

        this.$store.state.currentPlaylist = this.$store.state.currentPlaylistViewing;

        /* setting all the properties of the song that is going to be played (the first song) */
        currentPlaying.thumbnail = song.thumbnailUrl.replace('hqdefault', 'maxresdefault');
        currentPlaying.title = song.title;
        currentPlaying.artist = song.artist;
        currentPlaying.duration = song.duration;
        currentPlaying.currentTime = '0:00';
        currentPlaying.lengthSeconds = song.duration.split(':')[0] * 60 + Number.parseInt(song.duration.split(':')[1]);
        currentPlaying.filename = song.filename;
        currentPlaying.playing = true;
        currentPlaying.index = index;


        /* remove the clicked class from all elements in the table and apply the clicked class to the song thats playing */
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
        /* open the playlist that was clicked on */
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

        /* set the playlist that was clicked as the one we are viewing in vuex */
        this.$store.state.currentPlaylistViewing = index;
        
        if (this.$store.state.currentPlaying.title == 'N / A' && this.$store.state.currentPlaylist === -1) {
          this.$store.state.currentPlaylist = index;
          const index = 0;
          let song = this.playlist[index];
          const currentPlaying = this.$store.state.currentPlaying;

          /* check if the song we are trying to play is missing and if it is then loop until we find a song */
          if (song.missing) {
            do {
              song = this.playlist[index + 1];
            } while (song.missing);
          }

          this.$store.state.currentPlaylist = this.$store.state.currentPlaylistViewing; // if we aren't playing from any other playlist then set the currentPlaylist to the one we are viewing

          /* setting all the properties of the song that is going to be played */
          currentPlaying.thumbnail = song.thumbnailUrl.replace('hqdefault', 'maxresdefault');
          currentPlaying.title = song.title;
          currentPlaying.artist = song.artist;
          currentPlaying.duration = song.duration;
          currentPlaying.currentTime = '0:00';
          currentPlaying.lengthSeconds = song.duration.split(':')[0] * 60 + Number.parseInt(song.duration.split(':')[1]);
          currentPlaying.filename = song.filename;
          currentPlaying.playing = song.title !== undefined ? true : false;
          currentPlaying.index = index;

          this.currentPlayingChanged()
        }

        this.array = array;
        this.addClasses()

      }
    },
    addClasses() {
      /* check for missing songs once the table has loaded, also apply the clicked class to a song if it is playing and then scroll it into view as well */
      setTimeout(() => {
        const fs = require('fs');

        const children = document.getElementById('table').children;
        const songsPath = this.$store.state.documentsPath + '/mustap/songs/';

        this.$store.state.missingSongsCount = 0;
        
        /* check for missing songs and apply the missing class to the ones found */
        for (let i = 0; i < children.length - 1; i++) {
          const element = children[i];

          const song = this.$store.state.playlists[this.$store.state.currentPlaylistViewing].data[i];
          
          const filename = songsPath + song.filename;

          element.classList.remove('missing');
          element.classList.remove('clicked');

          if (!fs.existsSync(filename)) {
            element.classList.add('missing')
            this.$store.state.missingSongsCount++;
            this.$store.state.playlists[this.$store.state.currentPlaylistViewing].data[i].missing = true;
          }
        }

        /* if this is the currentplaylist that we are playing from check for the playing song and apply the clicked class to it */
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
                const clickedEle = children[i];
                if (!clickedEle.classList.contains('missing')) {
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
                }
                break;
              }
            }
          }
        }
        
        const deletedPlaylist = this.$store.state.playlists.filter(playlist => playlist.name === this.$store.state.playlists[this.$store.state.currentPlaylistViewing].name + '__deleted__');
        const deletedPlaylistData = deletedPlaylist[0].data;
        console.log(deletedPlaylistData)

        for (let i = 0; i < this.playlist.length; i++) {
          const song = this.playlist[i];
          
          for (let j = 0; j < deletedPlaylistData.length; j++) { 
            if (song.title === deletedPlaylistData[j].title) {
              children[i].classList.add('deleted')
            }
          }
        }

      }, 100);
    }
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