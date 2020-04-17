<template>
  <main class="home">
    <Searchbox @searched="searched" v-if="!searchboxDisplayNone" :class="{ home__searchbox: true, hidden: searchboxHidden }" />
    <DownloadStatus v-if="!downloadDisplayNone" :class="{ home__downloadstatus: true, show: downloadShow }" />
    <backBtn v-if="onDownloadView" @back="back" />
  </main>
</template>
<script>
import Searchbox from "./components/TheSearchbox";
import DownloadStatus from "./components/TheDownloadStatus";
import BackBtn from "../../components/BackBtn";
import { Stream } from "stream";

export default {
  name: "Home",
  components: {
    Searchbox,
    DownloadStatus,
    BackBtn
  },
  data() {
    return {
      searchboxHidden: false,
      searchboxDisplayNone: false,
      downloadShow: false,
      downloadDisplayNone: true,
      currentDownloadStream: Stream,
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
    playlistDownloader(arr) {
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
      const util = require("util");
      const ytpl = require("ytpl");
      const readdir = util.promisify(fs.readdir);

      /* environment variables */
      const documentsPath = this.$store.state.documentsPath;
      const songsPath = documentsPath + "/mustap/songs/";

      this.$store.dispatch("setCurrentDownloadProp", {
        prop: "playlistPath",
        data: documentsPath + "/mustap/playlists/" + playlistName + ".json"
      });

      let playlist = [];

      const removeArtist = (title, artist, symbol = "-", tries = 0) => {
        let name = title;

        if (tries === 5) {
          return title;
        }

        if (tries < 5) {
          name = title.split(symbol)[1];

          if (name && artist && name.toLowerCase() === artist.toLowerCase()) {
            name = title.split(symbol)[0];

            if (!name || name.length === 1 || name.length === 0) {
              name = title;
            }
          }

          if (!name) {
            if (tries === 1) {
              removeArtist(title, artist, "–", tries + 1);
            } else if (tries === 2) {
              removeArtist(title, artist, "~", tries + 1);
            } else if (tries === 3) {
              removeArtist(title, artist, "--", tries + 1);
            } else if (tries === 4) {
              removeArtist(title, artist, "—", tries + 1);
            } else {
              name = title;
            }
          }
        }

        if (name.indexOf("ft.") > -1) {
          const start = name.split("ft.")[0];
          start.indexOf("ft.") > -1 ? (name = name.split("ft.")[1]) : (name = start);
        } else if (name.indexOf("feat.") > -1) {
          const start = name.split("feat.")[0];
          start.indexOf("feat.") > -1 ? (name = name.split("feat.")[1]) : (name = start);
        }

        if (name[0] === " ") {
          name = name.slice(1, name.length);
        }

        return name;
      };

      // const findFeatures = (artist, title) => {
      //   let match = title.match();
      // }

      console.log("Fetching metadata...");
      this.$store.dispatch("setCurrentDownloadProp", {
        prop: "currentProcess",
        data: "Fetching metadata..."
      });

      // Get playlist metadata
      ytpl(url, {
        limit: 0
      })
        .then(res => {
          console.log(res);
          playlist = res.items.map(song => {
            /* map is the best way to do this as it allows us to take in all the songs from the playlist, change them, and put them back in all in one*/
            /* Take the data we want and format it nicely */
            if (song.duration === null) {
              return;
            } else {
              return {
                videoId: song.id,
                url: song.url,
                title: removeArtist(
                  song.title.replace(/ *\([^)]*\) */g, "").replace(/\[.*?\]/g, "") || song.title,
                  song.author.name
                ),
                filename: song.title.replace(/[/\\?%*:|"<>]/g, "") + ".mp3",
                artist: song.author.name,
                thumbnailUrl: song.thumbnail.replace("hqdefault", "0"),
                duration: song.duration,
                playlistLink: url
              };
            }
          });

          playlist = playlist.filter(obj => obj !== undefined); /* get rid of any songs that weren't found*/
          console.log(playlist);

          // console.log(playlist);
          console.log("Fetched all metadata.");
          this.$store.dispatch("setCurrentDownloadProp", {
            prop: "currentProcess",
            data: "Fetched all metadata."
          });
        })
        .then(async () => {
          this.$store.dispatch("setCurrentDownloadProp", {
            prop: "currentProcess",
            data: "Saving metadata..."
          });

          /* saving playlist to documents as json file */
          const jsonPlaylist = JSON.stringify(playlist);
          await fs.promises
            .mkdir(documentsPath + "/mustap/playlists/", { recursive: true })
            .then(async () => {
              await fs.promises.writeFile(documentsPath + `/mustap/playlists/${playlistName}.json`, jsonPlaylist);
            })
            .catch(err => console.log(err));

          this.$store.dispatch("setCurrentDownloadProp", {
            prop: "currentProcess",
            data: "Saved metadata."
          });
          this.$store.dispatch("setCurrentDownloadProp", {
            prop: "currentProcess",
            data: "Creating songs save location..."
          });

          await fs.promises.mkdir(songsPath, { recursive: true }).catch(err => console.log(err));

          this.$store.dispatch("setCurrentDownloadProp", {
            prop: "currentProcess",
            data: "Created songs save location."
          });

          console.log("Removing all previously installed songs...");
          this.$store.dispatch("setCurrentDownloadProp", {
            prop: "currentProcess",
            data: "Removing all previously installed songs..."
          });

          let files = await readdir(songsPath).catch(err => console.log(err));

          if (!files) {
            console.log("No songs to remove.");
            this.$store.dispatch("setCurrentDownloadProp", {
              prop: "currentProcess",
              data: "No songs to remove."
            });
          } else {
            for (let i = playlist.length - 1; i >= 0; i--) {
              if (playlist[i] === undefined) {
                break;
              }

              const songFilename = playlist[i].filename;

              for (let index = 0; index < files.length; index++) {
                const file = files[index];

                if (file === songFilename) {
                  playlist.splice(i, 1);
                }
              }
            }

            console.log("All previously installed songs removed from download queue.");
            this.$store.dispatch("setCurrentDownloadProp", {
              prop: "currentProcess",
              data: "All previously installed songs removed from download queue."
            });
          }

          if (playlist === []) {
            console.log("You already have all these songs downloaded.");
            this.$store.dispatch("setCurrentDownloadProp", {
              prop: "currentProcess",
              data: "You already have all these songs downloaded."
            });
          } else {
            /* start downloading the songs */
            console.log("Starting download...");

            this.$store.dispatch("setCurrentDownloadMultiple", {
              currentProcess: "Starting download...",
              totalQueueSize: playlist.length
            });

            this.downloadSongs(0, 0, songsPath, playlist);
          }
        })
        .catch(err => {
          console.log("An error has occured --- " + err);
          this.$store.dispatch("setCurrentDownloadMultiple", {
            currentProcess: err,
            currentlyDownloading: false
          });
        });
    },
    async downloadSongs(i, tries, songsPath, playlist) {
      const fs = require("fs");
      const ytdl = require("ytdl-core");
      const progress = require("progress-stream");
      const index = i;
      const songInfo = playlist[index];

      /* check if the playlist is finished downloading*/
      if (index > playlist.length - 1) {
        console.log("----- Finished downloading all songs. -----");

        this.$store.dispatch("setCurrentDownloadMultiple", {
          currentProcess: "Finished downloading all songs.",
          currentlyDownloading: false,
          currentDownloadTitle: "N / A",
          index: 0,
          stream: null,
          playlistPath: ""
        });

        return;
      }

      this.$store.dispatch("setCurrentDownloadMultiple", {
        currentlyDownloading: true,
        currentDownloadTitle: songInfo.title,
        index: i + 1,
        currentProcess: "Downloading...",
        path: songsPath + songInfo.filename
      });

      const estimatedSize =
        (Number.parseInt(songInfo.duration.split(":")[0] * 60) + Number.parseInt(songInfo.duration.split(":")[1])) * 144000;

      if (tries === 2) {
        console.log(
          `Sorry the download of ${songInfo.title} has been attempted 3 times and has failed. This song cannot be downloaded.`
        );
        this.$store.dispatch("setCurrentDownloadProp", {
          prop: "currentProcess",
          data: "Sorry this song could not be downloaded."
        });
        this.downloadSongs(i + 1, 0, songsPath, playlist);
      }

      /* calculate the progress on the download */
      let str = progress({
        length: estimatedSize,
        time: 100 /* ms */
      });

      str.on("progress", progress => {
        this.$store.dispatch("setCurrentDownloadProp", {
          prop: "progress",
          data: Math.round(progress.percentage)
        });
        if (this.$store.state.currentDownload.progress >= 100) {
          this.$store.dispatch("setCurrentDownloadProp", {
            prop: "progress",
            data: 100
          });
        }
      });
      /* calculate the progress on the download */

      this.$store.state.currentDownload.stream = ytdl(songInfo.url, {
        quality: "highestaudio",
        filter: "audioonly"
      })
        .on("error", err => {
          console.log(" Failed to download. Retrying...", err);
          this.$store.dispatch("setCurrentDownloadProp", {
            prop: "currentProcess",
            data: "Failed to download, retrying..."
          });
          this.downloadSongs(index, tries + 1, songsPath, playlist);
        })
        .pipe(str)
        .pipe(
          fs
            .createWriteStream(songsPath + songInfo.filename)
            .on("close", () => {
              /* once the song is finished downloading call the function again for the next song in the array*/
              console.log("stream closed");
              this.downloadSongs(index + 1, 0, songsPath, playlist);
            })
            .on("error", err => console.log(err))
        );
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
      console.log("No playlist to update.");
    }
  }
};
</script>

<style lang="scss">
.home {
  display: flex;
  width: 100%;
  height: 100%;

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

  &__back-btn {
    position: absolute;
    background: transparent;
    border: none;
    color: rgba(255, 255, 255, 0.253);
    font-size: 18px;
    font-weight: 500;
    top: 15px;
    left: 316px;
    cursor: pointer;
    opacity: 0.2;
    transition: opacity 0.4s ease-in;
    outline: none !important;

    &.opacityNone {
      opacity: 0;
    }

    &:hover {
      opacity: 1;
    }
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
