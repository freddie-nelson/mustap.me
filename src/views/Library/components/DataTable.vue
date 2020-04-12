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
          this.$emit('for-playlists-changed', true);

          // set the currentPlaylistViewing back to -1 so that other components know that we don't have a playlist open anymore
          this.$store.state.currentPlaylistViewing = -1;

          // get all the dataTableCell elements
          const children = document.getElementById('table').children;
          
          // remove all their extra classes so they don't appear on the playlists view
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

          // tell library that we have went back
          this.$emit('back')

          // set deleteClickedIndex back to -1 so that the cell we clicked on can be clicked again
          this.$store.state.deleteClickedIndex = -1;

          // get the playlists again to put in the table
          this.formatDataPlaylists()
        }
      },
      deleteSong(index, noWriteJSON = false) {
        // set deleteClickedIndex back to -1 so that the cell we clicked on can be clicked again
        this.$store.state.deleteClickedIndex = -1;
        
        // correct off by one error on index
        const i = index - 1;
        const fs = require('fs');

        // initialise all needed variables
        const playlist = this.$store.state.playlists[this.$store.state.currentPlaylistViewing];
        const playlists = this.$store.state.playlists.filter(obj => obj.name !== playlist.name);

        // get path of the playlists and its deleted songs counterpart
        const playlistPath = this.$store.state.documentsPath + '/mustap/playlists/' + playlist.name + '.json';
        const deletedPlaylistPath = this.$store.state.documentsPath + '/mustap/playlists/' + playlist.name + '__deleted__.json';

        // get the song we are deleting and everything to do with it
        const song = playlist.data[i];
        const songTitle = song.title[0] === ' ' ? song.title.slice(1, song.title.length) : song.title; // if the song has a space at the start remove it
        const songsPath = this.$store.state.documentsPath + '/mustap/songs/';
        const deleteSong = playlist.data[i].missing; // boolean that will make sure we don't try to delete the song if it doesn't exist
        const path = songsPath + song.filename; // song full path

        // get rid of the song we are deleting from the playlist data
        playlist.data = playlist.data.filter((song, index) => index !== i);
        this.playlist = playlist.data;

        // --- check every other playlist to see if we need the song in another one
        // if we do then don't delete it
        let file;

        for (let i = 0; i < playlists.length; i++) {
          let otherFilenames = playlists[i].data;

          otherFilenames = otherFilenames.map(obj => songsPath + obj.filename)

          let foundMatch = false;

          for (let j = 0; j < otherFilenames.length; j++) {
            const otherFile = otherFilenames[j];

            if (path === otherFile) {
                foundMatch = true;
            }
          }
          
          if (!foundMatch) {
            file = path;
          }
        }
        // --- end of checking the other playlists
        
        if (!noWriteJSON) { // if the nowriteJSON function is passed into the function then don't write to the json

          // check if the deletePlaylistPath file exists and if it does then push the song onto it and rewrite it
          if (fs.existsSync(deletedPlaylistPath)) {
            const data = JSON.parse(fs.readFileSync(deletedPlaylistPath));
            data.push(song);

            fs.promises.writeFile(deletedPlaylistPath, JSON.stringify(data))
          } else {
            // fif the deletePlaylistPath file has never been made then start it with the song incased in an array so we can later push to it
            fs.promises.writeFile(deletedPlaylistPath, JSON.stringify([ song ]))
          }   

        }

        // --- refresh the data in the table
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
        // --- end of refreshing the data in the table

        if (file) { // if the file is needed in other playlists don't delete it

          if (!deleteSong) {
            
            // delete the song then alert the user through the alert component
            fs.promises.unlink(file)
              .then(() => {
                this.$store.state.alerts.push({ text: `'${ songTitle }' has been deleted from playlist '${ playlist.name }'.`, type: 'alert' })
              })
              .catch(err => {
                this.$store.state.alerts.push({ text: `'${ songTitle }' has been could not be delete from playlist '${ playlist.name }'. Error: ${ err }`, type: 'warning' })
              });

          }

        } else {
          this.$store.state.alerts.push({ text: `'${ songTitle }' has been deleted from playlist '${ playlist.name }'.`, type: 'alert' })
        }


        // if the song that was deleted is the one that's currently playing then reset all the currentPlaying properties
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
          currentPlaying.index = -1;
          currentPlaying.sound.src = '';
          currentPlaying.currentTimeSeconds = 0;
        }

        this.playlist = playlist.data;

        if (playlist.data.length !== 0) {

          fs.promises.writeFile(playlistPath, JSON.stringify(playlist.data));
          this.addClasses();
          this.$emit('deleted-song', true);

        } else {
          // if the playlist has 0 songs left in it delete it altogther
          this.$emit('delete-playlist')
        }
      },
      async currentPlayingChanged() {
        const currentPlaying = this.$store.state.currentPlaying;
        const filename = 'file://' + this.$store.state.documentsPath + '/mustap/songs/' + currentPlaying.filename;
        currentPlaying.sound.src = filename;
        
        setTimeout(() => currentPlaying.sound.play(), 500);
      },
      formatDataPlaylists() {
        let array = []
        let obj = {};

        const playlists = this.$store.state.playlists;

        this.playlists = playlists.map(playlist => playlist.data)
        this.playlistNames = playlists.map(playlist => playlist.name)
        this.datesAdded = playlists.map(playlist => playlist.added)

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

        this.$store.state.deletedSongsCount = 0;
        this.$store.state.deletedSongs = [];
        
        const deletedPlaylist = this.$store.state.playlists.filter(playlist => playlist.name === this.$store.state.playlists[this.$store.state.currentPlaylistViewing].name + '__deleted__');
        if (deletedPlaylist[0]) {
          const deletedPlaylistData = deletedPlaylist[0].data;

          for (let i = 0; i < this.playlist.length; i++) {
            const song = this.playlist[i];
            
            for (let j = 0; j < deletedPlaylistData.length; j++) { 
              if (song.title === deletedPlaylistData[j].title) {
                this.$store.state.deletedSongsCount++;
                this.$store.state.deletedSongs.push({ song: deletedPlaylistData[j], index: i })
                children[i].classList.add('deleted')
              }
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