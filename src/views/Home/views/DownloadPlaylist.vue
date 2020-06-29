<template>
  <main class="download">
    <Searchbox
      @searched="searched"
      v-if="!searchboxDisplayNone"
      :class="{ download__searchbox: true, hidden: searchboxHidden }"
    />
    <DownloadStatus
      v-if="!downloadDisplayNone"
      :class="{ download__downloadstatus: true, show: downloadShow }"
    />
  </main>
</template>
<script>
import Searchbox from "./components/TheSearchbox";
import DownloadStatus from "./components/TheDownloadStatus";
import formatPlaylist from "./scripts/formatPlaylist";
import savePlaylist from "./scripts/savePlaylist";
import downloadSong from "./scripts/downloadSong";

export default {
  name: "DownloadPlaylist",
  components: {
    Searchbox,
    DownloadStatus
  },
  data() {
    return {
      searchboxHidden: false,
      searchboxDisplayNone: false,
      downloadShow: false,
      downloadDisplayNone: true,
      onDownloadView: false
    };
  },
  methods: {
    searched(arr) {
      this.searchboxHidden = true;

      setTimeout(() => {
        this.searchboxDisplayNone = true;
        this.downloadDisplayNone = false;
      }, 720);

      setTimeout(() => {
        this.downloadShow = true;
        this.onDownloadView = true;
      }, 750);

      this.playlistDownloader(arr);
    },
    back() {
      if (!this.$store.state.currentDownload.currentlyDownloading) {
        this.downloadShow = false;

        setTimeout(() => {
          this.downloadDisplayNone = true;
          this.searchboxDisplayNone = false;
        }, 720);

        setTimeout(() => {
          this.searchboxHidden = false;
          this.onDownloadView = false;
        }, 750);
      }
    },
    async playlistDownloader(arr) {
      let [url, playlistName] = arr;

      this.$store.dispatch("setUpdatingPlaylist", {
        updatingPlaylist: false,
        link: "",
        name: ""
      });

      playlistName = playlistName.replace(/[/\\?%*:|"<>.]/g, "");

      if (url === "") {
        this.$store.dispatch("setCurrentDownloadProp", {
          prop: "currentProcess",
          data: "Please enter a playlist link."
        });
        return;
      }

      /* dependencies */
      const fs = require("fs");
      const ytpl = require("ytpl");

      /* system paths */
      const documentsPath = this.$store.state.documentsPath;
      const songsPath = documentsPath + "/mustap/songs/";

      this.$store.dispatch("setCurrentDownloadProp", {
        prop: "playlistPath",
        data: documentsPath + "/mustap/playlists/" + playlistName + ".json"
      });

      // console.log("Fetching metadata...");
      this.$store.dispatch("setCurrentDownloadProp", {
        prop: "currentProcess",
        data: "Fetching metadata..."
      });

      // Get playlist metadata
      let metadata;

      try {
        metadata = await ytpl(url, { limit: 0 });
      } catch {
        this.$store.dispatch("setCurrentDownloadMultiple", {
          currentProcess: "Failed to fetch playlist data.",
          currentlyDownloading: false
        });

        return;
      }
      
      const playlist = formatPlaylist(metadata, url);

      this.$store.dispatch("setCurrentDownloadProp", {
        prop: "currentProcess",
        data: "Saving metadata..."
      });

      // Get rid of any songs that appear twice

      // playlist.forEach(song => {
      //   let matches = 0;
      //   let indexes = [];

      //   playlist.forEach((innerSong, i) => {
      //     if (song.videoId === innerSong.videoId) {
      //       matches++;
      //     }

      //     if (matches > 1) {
      //       indexes.push(i);
      //     }
      //   });

      //   if (indexes.length > 0) {
      //     indexes.forEach(i => {
      //       playlist.splice(i, 1);
      //     });
      //   }
      // });

      // saving playlist to documents as json file
      savePlaylist(playlist, documentsPath, playlistName);

      // remove all songs already installed
      this.$store.dispatch("setCurrentDownloadProp", {
        prop: "currentProcess",
        data: "Removing previously downloaded songs..."
      });

      let files = await fs.promises.readdir(songsPath).catch(err => console.log(err));

      if (!files) {
        this.$store.dispatch("setCurrentDownloadProp", {
          prop: "currentProcess",
          data: "No songs to remove."
        });
      } else {
        for (let i = playlist.length - 1; i >= 0; i--) {
          const songFilename = playlist[i].filename;

          for (let index = 0; index < files.length; index++) {
            const file = files[index];

            if (file === songFilename) {
              playlist.splice(i, 1);
            }
          }
        }
      }

      if (playlist === []) {
        this.$store.dispatch("setCurrentDownloadMultiple", {
          currentProcess: "No songs to download.",
          currentlyDownloading: false,
          currentDownloadTitle: "N / A",
          index: 0,
          stream: null,
          playlistPath: ""
        });
      } else {
        this.$store.dispatch("setCurrentDownloadMultiple", {
          currentProcess: "Starting download...",
          totalQueueSize: playlist.length
        });

        this.downloadSongs(songsPath, playlist);
      }
    },
    async downloadSongs(songsPath, playlist) {
      for (let i = 0; i < playlist.length; i++) {
        const song = playlist[i];
        
        this.$store.dispatch("setCurrentDownloadMultiple", {
          currentlyDownloading: true,
          currentDownloadTitle: song.title,
          index: i + 1,
          currentProcess: "Downloading...",
          path: songsPath + song.filename,
          progress: 0
        });

        const download = await downloadSong(song, songsPath)
          .then(stop => {
            if (stop) {
              return "stop";
            }
          })
          .catch(() => {
            this.$store.dispatch("setCurrentDownloadProp", {
              prop: "currentProcess",
              data: "This song could not be downloaded."
            });
          })

        if (download === "stop") {
          return;
        }
      }

      this.$store.dispatch("setCurrentDownloadMultiple", {
        currentProcess: "Finished downloading all songs.",
        currentlyDownloading: false,
        currentDownloadTitle: "N / A",
        index: playlist.length,
        stream: null,
        playlistPath: "",
        path: "",
        progress: 0
      });
    }
  },
  mounted() {
    if (this.$store.state.currentDownload.currentlyDownloading) {
      this.searchboxHidden = true;
      this.searchboxDisplayNone = true;
      this.downloadDisplayNone = false;
      this.downloadShow = true;
    }

    try {
      const updatingPlaylist = this.$store.state.playlists.updatingPlaylist;

      if (updatingPlaylist.updatePlaylist) {
        this.playlistDownloader([updatingPlaylist.link, updatingPlaylist.name]);
      }
    } catch {
      // console.log("No playlist to update.");
    }
  }
};
</script>

<style lang="scss">
.download {
  display: flex;
  width: 100%;
  height: 100%;
  position: relative;

  &__searchbox {
    margin: auto;
    max-width: 455px;
    height: 40px;
    opacity: 1;
    display: flex;
    transition: opacity 0.7s ease-in;
  }

  &__downloadstatus {
    width: 100%;
    margin: auto;
    max-width: 500px;
    height: 160px;
    z-index: 2;
    opacity: 0;
    transition: opacity 0.7s ease-in;
  }
}

.hidden {
  opacity: 0 !important;
}

.show {
  opacity: 1 !important;
}

.displaynone {
  display: none !important;
}
</style>
