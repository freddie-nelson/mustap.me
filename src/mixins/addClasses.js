export default {
  methods: {
    addClasses(delay = 250) {
      if (this.$store.state.playlists.currentPlaylistViewing === this.$store.state.playlists.currentPlaylist) {
        /* check for missing songs once the table has loaded, also apply the clicked class to a song if it is playing and then scroll it into view as well */
        setTimeout(() => {
          const fs = require("fs");

          const table = document.getElementById("table");
          const children = table.children;
          const songsPath = this.$store.state.documentsPath + "/mustap/songs/";
          const state = this.$store.state;

          const deletedPlaylist = state.playlists.deletedPlaylists.filter(
            playlist => playlist.name === this.$store.getters.currentPlaylistViewing.name + "__deleted__"
          );

          console.log(deletedPlaylist);

          this.$store.dispatch("setProp", { prop: "missingSongsCount", data: 0 });
          this.$store.dispatch("setProp", { prop: "deletedSongsCount", data: 0 });
          this.$store.dispatch("setProp", { prop: "deletedSongs", data: [] });

          /* apply classes to cells */
          for (let i = 0; i < children.length; i++) {
            const song = this.$store.getters.currentPlaylistViewing.data[i];

            const filename = songsPath + song.filename;

            if (song && !fs.existsSync(filename)) {
              this.$store.dispatch("increment", "missingSongsCount");
              song.missing = true;
            }

            const currentPlaying = state.currentPlaying;

            if (currentPlaying.title !== "N / A") {
              const tableContainer = document.getElementById("tableContainer");

              if (table && !this.forPlaylists && state.currentPlaying.index === i) {
                const children = table.children;
                const clickedEle = children[i];

                const distanceToBottom =
                  clickedEle.getBoundingClientRect().bottom - tableContainer.clientHeight - tableContainer.offsetTop;
                const distanceToTop = clickedEle.getBoundingClientRect().top - tableContainer.offsetTop;

                if (distanceToTop < 0 || distanceToBottom > 0) {
                  table.scrollTo({
                    top: clickedEle.offsetTop - tableContainer.offsetTop,
                    behavior: "smooth"
                  });
                }
              }
            }

            if (deletedPlaylist[0]) {
              const deletedPlaylistData = deletedPlaylist[0].data;
              console.log(deletedPlaylistData);

              for (let j = 0; j < deletedPlaylistData.length; j++) {
                if (song.title === deletedPlaylistData[j].title) {
                  this.$store.dispatch("increment", "deletedSongsCount");
                  this.$store.dispatch("pushDeletedSong", {
                    song: deletedPlaylistData[j],
                    index: i
                  });

                  song.deleted = true;
                }
              }
            }
          }
        }, delay);
      }
    }
  }
};
