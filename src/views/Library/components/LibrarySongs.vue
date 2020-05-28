<template>
  <DataTable
    ref="dataTable"
    :for-playlists="false"
    @drag-end="dragEnd($event)"
    @clicked-cell="setCurrentPlaying($event, false, true)"
    @delete-playlist="$emit('delete-playlist', $event)"
    @delete-song="deleteSong($event)"
  />
</template>

<script>
import DataTable from "./DataTable";
import addClasses from "@/mixins/addClasses";
import setCurrentPlaying from "@/mixins/setCurrentPlaying";

export default {
  name: "LibrarySongs",
  components: {
    DataTable
  },
  mixins: [addClasses, setCurrentPlaying],
  data() {
    return {
      playlist: [],
      array: [],
      playlistIndex: null
    };
  },
  methods: {
    dragEnd(e) {
      const { oldIndex, newIndex } = e.moved;

      console.log(oldIndex, newIndex);

      this.$store.dispatch("dragFinished", [oldIndex, newIndex]);
    },
    back() {
      this.$refs.dataTable.back();
    },
    fixCurrentPlayingIndex() {},
    deleteSong(index, noWriteJSON = false) {
      // correct off by one error on index
      const i = index - 1;
      const fs = require("fs");

      // initialise all needed variables
      const playlist = this.$store.getters.currentPlaylistViewing;
      const playlists = this.$store.state.playlists.playlists.filter(obj => obj.name !== playlist.name);

      // get path of the playlists and its deleted songs counterpart
      const playlistPath = this.$store.state.documentsPath + "/mustap/playlists/" + playlist.name + ".json";
      const deletedPlaylistPath = this.$store.state.documentsPath + "/mustap/playlists/" + playlist.name + "__deleted__.json";

      // get the song we are deleting and everything to do with it
      const song = playlist.data[i];
      const songTitle = song.title[0] === " " ? song.title.slice(1, song.title.length) : song.title; // if the song has a space at the start remove it
      const songsPath = this.$store.state.documentsPath + "/mustap/songs/";
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

        otherFilenames = otherFilenames.map(obj => songsPath + obj.filename);

        let foundMatch = false;

        for (let j = 0; j < otherFilenames.length; j++) {
          const otherFile = otherFilenames[j];

          if (path === otherFile) {
            foundMatch = true;
          }
        }

        if (foundMatch) {
          file = path;
        }
      }
      // --- end of checking the other playlists

      if (!noWriteJSON) {
        // if the nowriteJSON function is passed into the function then don't write to the json

        // check if the deletePlaylistPath file exists and if it does then push the song onto it and rewrite it
        if (fs.existsSync(deletedPlaylistPath)) {
          const data = JSON.parse(fs.readFileSync(deletedPlaylistPath));
          data.push(song);

          fs.promises.writeFile(deletedPlaylistPath, JSON.stringify(data));
        } else {
          // fif the deletePlaylistPath file has never been made then start it with the song incased in an array so we can later push to it
          fs.promises.writeFile(deletedPlaylistPath, JSON.stringify([song]));
        }
      }

      // --- refresh the data in the table
      this.array = playlist.data.map(song => {
        return {
          leftTop: song.title,
          leftBottom: song.artist,
          rightTop: song.duration
        };
      });

      const originalIndex = this.$store.state.currentPlaying.index;

      if (
        this.$store.state.playlists.currentPlaylistViewing === this.$store.state.playlists.currentPlaylist &&
        this.$store.state.currentPlaying.index > -1
      ) {
        if (this.$store.state.currentPlaying.index > index) {
          this.$store.dispatch("setCurrentPlayingProp", { prop: "index", data: this.$store.state.currentPlaying.index - 1 });
        }
      }

      this.$store.dispatch("setPlaylistsProp", { prop: "formattedPlaylist", data: this.array });
      // --- end of refreshing the data in the table

      if (!file) {
        // if the file is needed in other playlists don't delete it

        if (!deleteSong) {
          // delete the song then alert the user through the alert component
          fs.promises
            .unlink(path)
            .then(() => {
              this.$store.dispatch("addAlert", {
                text: `'${songTitle}' has been deleted from playlist '${playlist.name}' and from the file system.`,
                type: "alert"
              });
            })
            .catch(err => {
              this.$store.dispatch("addAlert", {
                text: `'${songTitle}' could not be delete from playlist '${playlist.name}'. Error: ${err}`,
                type: "warning"
              });
            });
        }
      } else {
        this.$store.dispatch("addAlert", {
          text: `'${songTitle}' has been deleted from playlist '${playlist.name}'.`,
          type: "alert"
        });
      }

      // if the song that was deleted is the one that's currently playing then reset all the currentPlaying properties
      if (originalIndex === i) {
        this.setCurrentPlaying(i + 1, "");
      }

      if (playlist.data.length !== 0) {
        fs.promises.writeFile(playlistPath, JSON.stringify(playlist.data));
        // this.addClasses(0, 0, false);
        this.$emit("delete-song");
      } else {
        // if the playlist has 0 songs left in it delete it altogther
        this.$emit("delete-playlist");
      }
    },
    formatDataSongs(e) {
      /* open the playlist that was clicked on */
      this.$emit("for-playlists-changed", false);
      this.$emit("clicked-playlist");
      const index = e;

      this.array = this.playlist.map(song => {
        return {
          leftTop: song.title,
          leftBottom: song.artist,
          rightTop: song.duration
        };
      });

      this.$store.dispatch("setPlaylistsMultiple", {
        formattedPlaylist: this.array,
        formattedPlaylistIndex: this.playlistIndex
      });

      /* set the playlist that was clicked as the one we are viewing in vuex */
      this.$store.dispatch("setPlaylistsProp", {
        prop: "currentPlaylistViewing",
        data: index
      });

      if (this.$store.state.currentPlaying.title == "N / A" && this.$store.state.playlists.currentPlaylist === -1) {
        this.$store.dispatch("setCurrentPlaylistDetails"); // if we aren't playing from any other playlist then set the currentPlaylist to the one we are viewing
        const index = 0;
        let song = this.playlist[index];

        /* check if the song we are trying to play is missing and if it is then loop until we find a song */
        if (song.missing) {
          do {
            song = this.playlist[index + 1];
          } while (song.missing);
        }

        this.setCurrentPlaying(index + 1, false, true);
      }
    }
  },
  mounted() {
    if (this.$store.state.playlists.currentPlaylistViewing === -1) {
      this.$store.dispatch("setPlaylistsProp", {
        prop: "currentPlaylistViewing",
        data: this.$store.state.playlists.formattedPlaylistIndex
      });
    }

    this.playlistIndex = this.$store.state.playlists.currentPlaylistViewing;
    this.playlist = this.$store.getters.currentPlaylistViewing.data;
    this.formatDataSongs(this.playlistIndex);
    // this.addClasses(400);
  },
  beforeDestroy() {
    if (this.$store.state.playlists.orderChanged) {
      const fs = require("fs");
      const currentPlaylistViewing = this.$store.getters.currentPlaylistViewing;
      const playlistPath = this.$store.state.documentsPath + "/mustap/playlists/" + currentPlaylistViewing.name + ".json";

      fs.promises
        .writeFile(playlistPath, JSON.stringify(currentPlaylistViewing.data))
        .then(() => {
          this.$store.dispatch("addAlert", { text: "Your new order has been saved.", type: "alert", autoClose: true });
        })
        .catch(err => {
          this.$store.dispatch("addAlert", { text: `Your new order could not be saved. Error: ${err}`, type: "warning" });
        });
    }

    // set the currentPlaylistViewing back to -1 so that other components know that we don't have a playlist open anymore
    this.$store.dispatch("setPlaylistsMultiple", {
      currentPlaylistViewing: -1,
      orderChanged: false
    });

    this.playlist.length = 0;
    this.array.length = 0;
  }
};
</script>

<style></style>
