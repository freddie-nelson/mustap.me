<template>
  <main
    class="library"
    :style="{ maxWidth: computedWidth }"
  >
    <div
      v-if="deletedSongsModal"
      class="deleted-songs-modal"
    >
      <div class="modal">
        <p>Please choose what you would like to do with the songs below.</p>
        <div class="modal__list-container">
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
                    @clicked="deleteSong(i, index)"
                    :filled="false"
                    :text="'🗑'"
                    :font-size="15"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal__button-container">
          <Button
            @clicked="deletedSongsModal = false"
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
      <div style="margin: 3px 0 0 60px; position: absolute;">
        <transition-group name="fade">
          <Button
            v-if="this.$store.state.missingSongsCount > 0 && !this.forPlaylists"
            style="margin-right: 20px;"
            @clicked="updatePlaylist"
            :text="
              `🛈 ${this.$store.state.missingSongsCount} missing songs - Click to download`
            "
            :filled="false"
            :font-size="16"
            :key="0"
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
            :key="1"
          />
        </transition-group>
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
        :style="{ width: hideCurrentPlaying ? '100%' : null }"
      >
        <router-view
          ref="dataTable"
          @delete-song="$refs.currentPlaying.search()"
          :style="{ paddingRight: hideCurrentPlaying ? '0px' : null }"
        />
      </vue-page-transition>
      <CurrentPlaying
        ref="currentPlaying"
        @update-playlist="updatePlaylist"
        @delete-playlist="deletePlaylist"
        class="library__current-playing"
        :for-playlists="forPlaylists"
        :style="{ display: hideCurrentPlaying ? 'none' : null }"
      />
    </section>
  </main>
</template>

<script>
import CurrentPlaying from "./components/CurrentPlaying";
import Button from "@/components/Button";
import setCurrentPlaying from "@/mixins/setCurrentPlaying";
import addClasses from "@/mixins/addClasses";

export default {
  name: "Library",
  components: {
    CurrentPlaying,
    Button
  },
  mixins: [setCurrentPlaying, addClasses],
  data() {
    return {
      deletedSongsModal: false,
      headerHeight: 172,
      appWidth: 0
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
    },
    computedWidth() {
      return this.$store.getters.navbarSmall ? 'calc(100vw - 80px)' : '';
    },
    hideCurrentPlaying() {
      return !this.$store.getters.navbarSmall && this.appWidth < 1240 ? true : false
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

      const playlist = {...this.$store.getters.currentPlaylistViewing};
      const playlistData = [...playlist.data];

      playlistData[index].deleted = false;
      playlist.data = playlistData;

      this.$store.dispatch("setSongProperty", { songIndex: index, prop: "deleted", data: false })
      console.log(this.$store.getters.currentPlaylistViewing.data);

      const fs = require("fs");
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

      this.addClasses(0, 0, false);
    },
    deleteSong(i, index) {
      const fs = require("fs");

      this.$store.dispatch("setProp", {
        prop: "deletedSongs",
        data: this.$store.state.deletedSongs.filter(
          (song, index) => index !== i
        )
      });

      const playlistName = this.$store.getters.currentPlaylistViewing.name;
      const deletedPlaylistName = this.$store.state.documentsPath + playlistName + "__deleted__.json";

      if (!this.$store.state.deletedSongs.length > 1) {
        fs.promises.unlink(deletedPlaylistName)
          .catch(err => console.log(err));
      } else {
        fs.promises.writeFile(deletedPlaylistName, JSON.stringify(this.$store.state.deletedSongs))
        .catch(err => console.log(err))
      }

      this.$store.dispatch("decrement", "deletedSongsCount");
      this.$refs.dataTable.deleteSong(index + 1, true);
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

      this.$store.dispatch("setCurrentDownloadProp", {
        prop: "currentlyDownloading",
        data: true
      });

      if (this.$store.state.playlists.currentPlaylistViewing === this.$store.state.playlists.currentPlaylist) {
        this.$store.dispatch("setPlaylistsMultiple", {
          currentPlaylist: -1,
          currentPlaylistViewing: -1
        });

        this.setCurrentPlaying(false, "");
      } else {
        this.$store.dispatch("setPlaylistsProp", { prop: "currentPlaylistViewing", data: -1 })
      }
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
      const filenames = playlistData.map(obj => obj.filename);

      // filter filenames so it only contains the songs that aren't in any other playlist
      // const timer = console.time();

      const filenamesFiltered = filenames.filter(file => {
        let foundMatch;

        for (let i = 0; i < playlists.length; i++) {
          let otherFilenames = playlists[i].data;

          otherFilenames = otherFilenames.map(obj => obj.filename);

          foundMatch = false;

          for (let j = 0; j < otherFilenames.length; j++) {
            const otherFile = otherFilenames[j];

            if (file === otherFile) {
              foundMatch = true;
            }
          }

          if (foundMatch) {
            break;
          }

          // console.log(foundMatch, file)
        }

        if (!foundMatch) {
            return songsPath + file;
          }
      });

      // console.timeEnd(timer);
      // console.log(filenamesFiltered);

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
          if (!fs.existsSync(file)) {
            return;
          }

          fs.promises
            .unlink(file)
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
          })
          .catch(err =>
            state.alerts.push({
              text: `Playlist '${playlist.name}' could not be deleted. Error: ${err}`,
              type: "warning"
            })
          );
      }
    }
  },
  mounted() {
    const headerObserver = new ResizeObserver(entries => {
      this.headerHeight = entries[0].contentRect.height;
    });

    const appObserver = new ResizeObserver(entries => {
      this.appWidth = entries[0].contentRect.width;
    });

    headerObserver.observe(this.$refs.libraryHeader);
    appObserver.observe(this.$root.$el);
  }
};
</script>

<style lang="scss">

.nav.small {
  .library {
    max-width: calc(100vw - 80px);
  }
}

.library {
  display: flex;
  width: 100%;
  height: 100%;
  color: var(--primary-text);
  flex-direction: column;
  overflow-y: hidden;
  position: relative;
  max-width: calc(100vw - 300px);
  transition: max-width .2s ease;

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

    &__list-container {
      padding: 8px 4px;
      background: var(--lighter-bg);
      border-radius: 8px;
      margin: 15px 0;
    }

    &__list {
      width: 100%;
      padding: 5px 6px;
      max-height: 300px;
      overflow-y: scroll;

      &::-webkit-scrollbar-thumb {
        background-color: var(--dark-bg);
      }

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

@media screen and (max-width: 1150px) {
  .library {
    &__current-playing {
      margin-left: 30px;
      width: calc(50% - 40px);
    }
  }
}
</style>
