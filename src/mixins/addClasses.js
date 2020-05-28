export default {
  methods: {
    addClasses(delay, tries = 0, scroll = true) {
      console.log("yo");
      /* check for missing songs once the table has loaded, also apply the clicked class to a song if it is playing and then scroll it into view as well */
      if (delay > 0) {
        this.$store.dispatch("setProp", { prop: "missingSongsCount", data: 0 });
        this.$store.dispatch("setProp", { prop: "deletedSongsCount", data: 0 });
        this.$store.dispatch("setProp", { prop: "deletedSongs", data: [] });
      }

      setTimeout(() => {
        const fs = require("fs");

        const table = document.getElementById("table");
        const children = table.children;
        const songsPath = this.$store.state.documentsPath + "/mustap/songs/";
        const state = this.$store.state;

        const deletedPlaylist = state.playlists.deletedPlaylists.filter(
          playlist => playlist.name === this.$store.getters.currentPlaylistViewing.name + "__deleted__"
        );

        /* apply classes to cells */
        for (let i = 0; i < children.length; i++) {
          let song;

          if (!this.$store.getters.currentPlaylistViewing) {
            if (tries >= 3) return;

            setTimeout(() => this.addClasses(1, tries + 1), 500)
            break;
          } else {
            song = this.$store.getters.currentPlaylistViewing.data[i];
          }

          if (deletedPlaylist[0] && delay > 0) {
            const deletedPlaylistData = deletedPlaylist[0].data;

            for (let j = 0; j < deletedPlaylistData.length; j++) {
              if (song.videoId === deletedPlaylistData[j].videoId) {
                this.$store.dispatch("increment", "deletedSongsCount");
                this.$store.dispatch("pushDeletedSong", {
                  song: deletedPlaylistData[j],
                  index: i
                });

                this.$store.dispatch("setSongProperty", { songIndex: i, prop: "deleted", data: true })
              } else {
                this.$store.dispatch("setSongProperty", { songIndex: i, prop: "deleted", data: false })
              }
            }
          }

          const filename = songsPath + song.filename;

          if (song && !fs.existsSync(filename) && delay > 0) {
            this.$store.dispatch("increment", "missingSongsCount");
            this.$store.dispatch("setSongProperty", { songIndex: i, prop: "missing", data: true })
          } else if (song) {
            this.$store.dispatch("setSongProperty", { songIndex: i, prop: "missing", data: false })
          }

          const currentPlaying = state.currentPlaying;

          if (currentPlaying.title !== "N / A" && this.$store.state.playlists.currentPlaylistViewing === this.$store.state.playlists.currentPlaylist) {
            const tableContainer = document.getElementById("tableContainer");

            if (table && !this.forPlaylists && state.currentPlaying.index === i && scroll === true) {
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
        }
      }, delay);
    }
  }
};
