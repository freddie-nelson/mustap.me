<template>
  <main class="library">
    <div v-if="deletedSongsModal"
class="deleted-songs-modal">
      <div class="modal">
        <p>Please choose what you would like to do with the songs below.</p>
        <div class="modal__list">
          <div>
            <div
              class="modal__list-cell"
              v-for="({ song, index }, i) in $store.state.deletedSongs"
              :key="i"
            >
              <div class="modal__list-cell-left-text">
                <div>{{ song.title }}</div>
                <div>{{ song.artist }}</div>
              </div>

              <div class="modal__list-cell-right">
                <Button
                  @clicked="keepSong(i, index)"
                  :filled="false"
                  :text="'Keep'"
                  :font-size="15"
                />
                <Button
                  style="margin-left: 20px;"
                  @clicked="deleteSong(index)"
                  :filled="false"
                  :text="'🗑'"
                  :font-size="15"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="modal__button-container">
          <Button
            @clicked="
              () => {
                deletedSongsModal = false;
                $refs.dataTable.addClasses(0);
              }
            "
            class="button"
            :filled="true"
            :text="'Done'"
            :font-size="16"
          />
        </div>
      </div>
    </div>

    <header ref="libraryHeader">
      <h1>{{ mainTitle }}</h1>
      <h2>{{ subTitle }}</h2>
      <div style="margin: 10px 0 0 60px;">
        <Button
          v-if="this.$store.state.missingSongsCount > 0 && !this.forPlaylists"
          style="margin-right: 20px;"
          @clicked="updatePlaylist"
          :text="
            `🛈 ${this.$store.state.missingSongsCount} missing songs - Click to download`
          "
          :filled="false"
          :font-size="16"
        />
        <Button
          v-if="this.$store.state.deletedSongsCount > 0 && !this.forPlaylists"
          style="text-align: left !important;"
          @clicked="deletedSongsModal = true"
          :text="
            `🛈 ${this.$store.state.deletedSongsCount} songs have been found that have been previously deleted - Click to view`
          "
          :filled="false"
          :font-size="16"
        />
      </div>
    </header>
    <section
      class="library__main-container"
      :style="{ height: `calc(100% - ${this.headerHeight}px)` }"
    >
      <vue-page-transition
        name="fade-in-right"
        id="tableContainer"
        class="container"
      >
        <router-view
          ref="dataTable"
          @delete-song="$refs.currentPlaying.search()"
        />
      </vue-page-transition>
      <CurrentPlaying
        ref="currentPlaying"
        @update-playlist="updatePlaylist"
        @delete-playlist="deletePlaylist"
        class="library__current-playing"
        :for-playlists="forPlaylists"
      />
    </section>
  </main>
</template>

<script>
import CurrentPlaying from "./components/CurrentPlaying";
import Button from "@/components/Button";
import setCurrentPlaying from "@/mixins/setCurrentPlaying";

export default {
  name: "Library",
  components: {
    CurrentPlaying,
    Button
  },
  mixins: [setCurrentPlaying],
  data() {
    return {
      deletedSongsModal: false,
      headerHeight: 172
    };
  },
  computed: {
    mainTitle() {
      return this.$store.state.playlists.currentPlaylistViewing === -1
        ? "Your Library"
        : `Currently Viewing`;
    },
    subTitle() {
      try {
        const playlist = this.$store.getters.currentPlaylistViewing;
        return this.$store.state.playlists.currentPlaylistViewing === -1
          ? "Select a playlist"
          : `${playlist.name} - ${playlist.data.length} tracks`;
      } catch (e) {
        console.log("Could not compute subtitle.");
        return "Select a playlist";
      }
    },
    forPlaylists() {
      return !this.$store.getters.currentPlaylistViewing ? true : false;
    }
  },
  methods: {
    keepSong(i, index) {
      this.$store.dispatch("setProp", {
        prop: "deletedSongs",
        data: this.$store.state.deletedSongs.filter(
          (song, index) => index !== i
        )
      });
      this.$store.dispatch("decrement", "deletedSongsCount");

      this.$store.dispatch("setDeletedPlaylistData");

      const fs = require("fs");
      const playlist = this.$store.getters.currentPlaylistViewing;
      const deletedPlaylistPath =
        this.$store.state.documentsPath +
        "/mustap/playlists/" +
        playlist.name +
        "__deleted__.json";

      document
        .getElementById("table")
        .children[index].classList.remove("deleted");

      if (this.$store.state.deletedSongs.length !== 0) {
        fs.writeFileSync(
          deletedPlaylistPath,
          this.$store.state.deletedSongs || []
        );
      } else {
        fs.unlinkSync(deletedPlaylistPath);
      }
    },
    updatePlaylist() {
      if (!this.forPlaylists) {
        if (this.$store.state.currentDownload.currentlyDownloading) {
          this.$store.dispatch("addAlert", {
            text:
              "You cannot update this playlist as another playlist is currently being updated or downloaded.",
            type: "alert"
          });
        } else {
          this.setUpdatePlaylistStoreValues();
          this.$router.push({ name: "Home" });
        }
      }
    },
    setUpdatePlaylistStoreValues() {
      const currentPlaylist = this.$store.getters.currentPlaylistViewing;

      this.$store.dispatch("setUpdatingPlaylist", {
        updatePlaylist: true,
        name: currentPlaylist.name,
        link: currentPlaylist.data[0].playlistLink
      });

      this.$store.dispatch("setPlaylistsMultiple", {
        currentPlaylist: -1,
        currentPlaylistViewing: -1
      });

      this.$store.dispatch("setCurrentDownloadProp", {
        prop: "currentlyDownloading",
        data: true
      });

      this.setCurrentPlaying(false, "");
    },
    async deletePlaylist() {
      const fs = require("fs");

      // initialise needed variables
      const state = this.$store.state;
      const playlist = this.$store.getters.currentPlaylistViewing;
      const playlistData = playlist.data;
      const playlists = state.playlists.playlists.filter(
        obj => obj.name !== playlist.name
      );

      const songsPath = state.documentsPath + "/mustap/songs/";
      const filenames = playlistData.map(obj => songsPath + obj.filename);

      // filter filenames so it only contains the songs that aren't in any other playlist
      const filenamesFiltered = filenames.filter(file => {
        for (let i = 0; i < playlists.length; i++) {
          let otherFilenames = playlists[i].data;

          otherFilenames = otherFilenames.map(obj => songsPath + obj.filename);

          let foundMatch = false;

          for (let j = 0; j < otherFilenames.length; j++) {
            const otherFile = otherFilenames[j];

            if (file === otherFile) {
              foundMatch = true;
            }
          }

          if (!foundMatch) {
            return file;
          }
        }
      });

      // get the path of the playlist we are deleting from and the __deleted__ version that contains the songs we have previously deleted
      const playlistPath =
        state.documentsPath + "/mustap/playlists/" + playlist.name + ".json";
      const deletedPlaylistPath =
        state.documentsPath +
        "/mustap/playlists/" +
        playlist.name +
        "__deleted__.json";

      if (
        this.$store.state.currentDownload.currentlyDownloading &&
        this.$store.state.currentDownload.playlistPath === playlistPath
      ) {
        this.$store.dispatch("addAlert", {
          text:
            "You cannot delete this playlist as it is currently being updated or downloaded.",
          type: "alert"
        });
      } else {
        // delete all the songs that we don't need in any other playlist
        filenamesFiltered.forEach(async file => {
          fs.promises
            .unlink(file)
            .then(e => {
              console.log(e);
            })
            .catch(e => console.log(e));
        });

        // if the deletedPlaylistsPath exists delete it since it isn't needed anymore
        if (fs.existsSync(deletedPlaylistPath)) {
          await fs.promises
            .unlink(deletedPlaylistPath)
            .then(e => console.log(e))
            .catch(e => console.log(e));
        }

        // wait for the playlist to be deleted then go back to the library home page and refresh the playlists
        await fs.promises
          .unlink(playlistPath)
          .then(() => {
            state.alerts.push({
              text: `Playlist '${playlist.name}' has been successfully deleted.`,
              type: "alert"
            });
            // set the currentPlaylist variables back to -1 so that we can keep track that we aren't viewing a playlist anymore and aren't playing from one
            if (
              state.playlists.currentPlaylist ===
              state.playlists.currentPlaylistViewing
            ) {
              this.$store.dispatch("setPlaylistsProp", {
                prop: "currentPlaylist",
                data: -1
              });

              const currentPlaying = this.$store.state.currentPlaying;

              currentPlaying.sound.pause();

              this.$store.dispatch("setCurrentPlayingMultiple", {
                thumbnail: "N / A",
                title: "N / A",
                artist: "N / A",
                duration: "0:00",
                currentTime: "0:00",
                currentTimeSeconds: 0,
                lengthSeconds: 0,
                filename: "",
                playing: false,
                index: -1
              });

              this.$store.dispatch("setCurrentPlayingSrc", "");
            }
            this.$store.dispatch("setPlaylistsProp", {
              prop: "currentPlaylistViewing",
              data: -1
            });
            this.$refs.dataTable.back();
            this.getPlaylists();
          })
          .catch(err =>
            state.alerts.push({
              text: `Playlist '${playlist.name}' could not be deleted. Error: ${err}`,
              type: "warning"
            })
          );
      }
    },
    async getPlaylists() {
      const fs = require("fs");

      const playlistsLocation =
        this.$store.state.documentsPath + "/mustap/playlists";
      let playlists = [];
      let deletedPlaylists = [];

      // read all json files in the playlists directory
      await fs.promises
        .readdir(playlistsLocation)
        .then(arr => {
          // a recursive style is used so that we read the files one by one and not all at the same time
          // this means that the playlists are always read and appear in the same order which gives a better UX

          readFile(0);
          function readFile(i) {
            // if the array has nothing left in it then stop the recursion
            if (!arr[i]) {
              return;
            }

            const file = arr[i];

            // read the file
            fs.promises
              .readFile(playlistsLocation + "/" + file)
              .then(data => {
                // get the date the file was created
                const date = new Date(
                  fs.statSync(playlistsLocation + "/" + file).mtimeMs
                );
                const day = ("0" + date.getDate()).slice(-2);
                const month = ("0" + (date.getMonth() + 1)).slice(-2);
                const year = date.getFullYear();

                // only push the data to the playlists array if it isn't one used to store deleted songs
                if (file.indexOf("__deleted__") === -1) {
                  playlists.push({
                    name: file.split(".")[0],
                    data: JSON.parse(data),
                    added: `${day}/${month}/${year}`
                  });
                } else {
                  deletedPlaylists.push({
                    name: file.split(".")[0],
                    data: JSON.parse(data),
                    added: `${day}/${month}/${year}`
                  });
                }

                // start the next read
                readFile(i + 1);
              })
              .catch(err => console.log(err));
          }
        })
        .catch(err => console.log(err));

      // store the playlists in vuex
      this.$store.dispatch("changePlaylists", playlists);
      this.$store.dispatch("setPlaylistsProp", {
        prop: "deletedPlaylists",
        data: deletedPlaylists
      });

      if (
        this.$store.state.playlists.currentPlaylist !== -1 &&
        this.$store.state.playlists.playlists !== []
      ) {
        this.$store.getters.playlistNames.forEach((name, i) => {
          name === this.$store.state.playlists.currentPlaylistName
            ? this.$store.dispatch("setProp", {
                prop: "currentPlaylist",
                payload: i
              })
            : null;
        });
      }
    }
  },
  mounted() {
    this.getPlaylists();

    const observer = new ResizeObserver(entries => {
      this.headerHeight = entries[0].contentRect.height;
    });

    observer.observe(this.$refs.libraryHeader);
  }
};
</script>

<style lang="scss">
.library {
  display: flex;
  width: 100%;
  height: 100%;
  color: var(--primary-text);
  flex-direction: column;
  overflow-y: hidden;
  width: calc(100vw - 300px);
  position: relative;

  h1 {
    font-size: 36px;
    margin: 60px 0 5px 60px;
    font-weight: 600;
  }

  h2 {
    font-size: 28px;
    font-weight: 500;
    margin-left: 60px;
  }

  &__main-container {
    display: flex;
    flex-direction: row;
    height: calc(100% - 200px);
    padding: 40px 60px;
  }

  .container {
    height: 100%;
    width: 50%;
    overflow: hidden;
  }

  .current-playing-details-container {
    width: calc(50% - 50px);
  }
}

.deleted-songs-modal {
  width: 100%;
  height: 100%;
  position: absolute;
  background: rgba(0, 0, 0, 0.7);
  z-index: 10;
  display: flex;
  justify-content: center;
  align-items: center;

  .modal {
    background-color: var(--main-bg);
    padding: 20px;
    border-radius: 10px;

    p {
      margin-bottom: 5px;
      opacity: 0.7;
      color: var(--primary-text);
    }

    &__list {
      width: 100%;
      background: var(--lighter-bg);
      border-radius: 6px;
      margin: 15px 0;
      padding: 10px;
      max-height: 350px;

      &-cell {
        width: 100%;
        padding: 4px 8px;
        display: flex;
        align-items: center;
        border-radius: 5px;
        transition: background-color 0.3s ease-in;
        margin-top: 5px;
        justify-content: space-between;

        &:first-of-type {
          margin-top: 0px;
        }

        &:hover {
          background-color: rgba(255, 255, 255, 0.1);
        }

        &-left-text {
          width: 100%;
          color: var(--secondary-text);
          font-size: 14px;
          max-width: 60%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;

          div:first-of-type {
            color: var(--primary-text);
            font-weight: 500;
            font-size: 16px;
          }
        }
      }
    }

    &__button-container {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-end;
      margin-top: 10px;

      div:first-of-type {
        margin-right: 15px;
      }
    }
  }
}

@media screen and (max-width: 1310px) {
  .library {
    &__current-playing {
      display: none;
    }

    .container {
      min-width: 240px;
      width: 100%;
    }
  }
}
</style>
