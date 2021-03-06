import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const discordRPC = {
  state: {
    details: "The better way to enjoy your music",
    state: "Browsing Songs...",
    startTimestamp: new Date().getTime(),
    endTimestamp: new Date().getTime(),
    largeImageKey: "512x512",
    instance: false
  },
};

const currentPlaying = {
  state: {
    sound: new Audio(),
    title: "N / A",
    artist: "N / A",
    thumbnail: "N / A",
    duration: "0:00",
    currentTime: "0:00",
    currentTimeSeconds: 0,
    progress: "0%",
    lengthSeconds: 0,
    filename: "",
    playing: false,
    index: -1,
    volume: 1,
    missing: false
  },
  mutations: {
    SET_CURRENT_PLAYING_MULTIPLE(state, payload) {
      Object.keys(payload).forEach(prop => {
        Vue.set(state, prop, payload[prop]);
      });
    },
    SET_CURRENT_PLAYING_PROP(state, payload) {
      Vue.set(state, payload.prop, payload.data);
    },
    SET_CURRENT_PLAYING_SRC(state, path) {
      Vue.set(state.sound, "src", path);
      state.sound.load();
    },
    SET_CURRENT_PLAYING_CURRENT_TIME(state, { currentTime, progress }) {
      Vue.set(state, "currentTime", currentTime);
      Vue.set(state, "progress", progress);
    },
    SET_CURRENT_PLAYING_SOUND_CURRENT_TIME(state, payload) {
      Vue.set(state.sound, "currentTime", payload);
    },
    CHANGE_VOLUME(state, payload) {
      Vue.set(state, "volume", payload);
      Vue.set(state.sound, "volume", payload);
    }
  },
  actions: {
    setCurrentPlayingMultiple({ commit }, payload) {
      commit("SET_CURRENT_PLAYING_MULTIPLE", payload);
    },
    setCurrentPlayingProp({ commit }, payload) {
      commit("SET_CURRENT_PLAYING_PROP", payload);
    },
    setCurrentPlayingSrc({ commit, state, rootState }, payload) {
      state.sound.pause();
      commit("SET_CURRENT_PLAYING_SRC", "");

      if (payload === "") {
        commit("SET_CURRENT_PLAYING_SRC", payload);
      } else {
        const dataurl = require("dataurl");
        const fs = require("fs");

        const convertSong = filePath => {
          const songPromise = new Promise((resolve, reject) => {
            fs.readFile(filePath, (err, data) => {
              if (err) {
                reject(err);
              }
              resolve(
                dataurl.convert({
                  data,
                  mimetype: "audio/mp3"
                })
              );
            });
          });
          return songPromise;
        };

        const path =
          rootState.documentsPath + "/mustap/songs/" + state.filename;
        convertSong(path)
          .then(dataURL => {
            commit("SET_CURRENT_PLAYING_SRC", dataURL);
            state.sound
              .play()
              .catch(() => null)
          })
          .catch(err => {
            commit("ADD_ALERT", {
              text: `Sorry that song could not be played. Error: ${err}`,
              type: "warning"
            });
          });
      }
    },
    setCurrentPlayingCurrentTime({ commit, state }) {
      if (state.currentTimeSeconds === Math.ceil(state.sound.currentTime)) {
        return;
      } else {
        commit("SET_CURRENT_PLAYING_PROP", {
          prop: "currentTimeSeconds",
          data: Math.ceil(state.sound.currentTime)
        });
        

        const hours = Math.floor(state.currentTimeSeconds / 3600);
        const secondsMod = state.currentTimeSeconds % 3600;
        let minutes = Math.floor(state.currentTimeSeconds / 60);
        let seconds = secondsMod % 60;

        let currentTime;
        
        if (hours > 0) {
          minutes -= 60;

          if (minutes < 10) {
            minutes = "0" + minutes;
          }

          if (seconds < 10) {
            seconds = "0" + seconds;
          }

          currentTime = `${hours}:${minutes}:${seconds}`
        } else {
          if (seconds < 10) {
            seconds = "0" + seconds;
          }

          currentTime = `${minutes}:${seconds}`;
        }

        const progress = ((state.currentTimeSeconds / state.lengthSeconds) * 100).toFixed(2) + "%";

        commit("SET_CURRENT_PLAYING_CURRENT_TIME", {
          currentTime: currentTime,
          progress: progress
        });
      }
    },
    setCurrentPlayingSoundCurrentTime({ commit }, val) {
      commit("SET_CURRENT_PLAYING_SOUND_CURRENT_TIME", val);
    },
    changeVolume({ commit, state }, { num, minus }) {
      let newVolume = minus
        ? state.sound.volume - num
        : state.sound.volume + num;

      Math.round((newVolume + Number.EPSILON) * 100) / 100;

      if (newVolume > 1) {
        newVolume = 1;
      } else if (newVolume < 0) {
        newVolume = 0;
      }

      commit("CHANGE_VOLUME", newVolume);
    },
    changeVolumeSlider({ commit }, volume) {
      commit("CHANGE_VOLUME", volume);
    }
  },
  getters: {
    soundCurrentTime: state => {
      return Math.ceil(state.sound.currentTime);
    },
    soundVolume: state => {
      return state.volume;
    }
  }
};

const currentDownload = {
  state: {
    playlistPath: "",
    playlistLink: "",
    playlistName: "",
    downloadNow: false,
    currentProcess: "N / A",
    currentDownloadTitle: "N / A",
    progress: 0,
    index: 0,
    totalQueueSize: 0,
    currentlyDownloading: false,
    stream: null,
    path: "",
    stopAll: false,
  },
  mutations: {
    SET_CURRENT_DOWNLOAD_MULTIPLE(state, payload) {
      Object.keys(payload).forEach((prop) => {
        Vue.set(state, prop, payload[prop]);
      });
    },
    SET_CURRENT_DOWNLOAD_PROP(state, payload) {
      Vue.set(state, payload.prop, payload.data);
    },
  },
  actions: {
    setCurrentDownloadMultiple({ commit }, payload) {
      commit("SET_CURRENT_DOWNLOAD_MULTIPLE", payload);
    },
    setCurrentDownloadProp({ commit }, payload) {
      commit("SET_CURRENT_DOWNLOAD_PROP", payload);
    },
  },
};

const playlists = {
  state: {
    playlists: [],
    deletedPlaylists: [],
    formattedPlaylist: [],
    formattedPlaylistIndex: -1,
    orderChanged: false,
    currentPlaylist: -1,
    currentPlaylistViewing: -1,
    currentPlaylistName: "",
    repeatSong: false,
    shufflePlaylist: false,
    updatingPlaylist: {
      updatePlaylist: false,
      name: "",
      link: ""
    }
  },
  mutations: {
    CHANGE_PLAYLISTS(state, payload) {
      Vue.set(state, "playlists", payload);
    },
    PUSH_PLAYLIST(state, payload) {
      Vue.set(state, "playlists", payload);
    },
    PUSH_DELETED_PLAYLIST(state, payload) {
      Vue.set(state, "deletedPlaylists", payload);
    },
    SET_SONG_PROPERTY(state, { songIndex, prop, data }) {
      const playlist = state.playlists[state.currentPlaylistViewing];
      const song = playlist.data[songIndex];
      Vue.set(song, prop, data);
    },
    SET_UPDATING_PLAYLIST(state, payload) {
      Object.keys(payload).forEach(prop => {
        Vue.set(state.updatingPlaylist, prop, payload[prop]);
      });
    },
    SET_PLAYLISTS_PROP(state, payload) {
      Vue.set(state, payload.prop, payload.data);
    },
    SET_PLAYLISTS_MULTIPLE(state, payload) {
      Object.keys(payload).forEach(prop => {
        Vue.set(state, prop, payload[prop]);
      });
    },
    SET_CURRENT_PLAYLIST_DETAILS(state) {
      Vue.set(state, "currentPlaylist", state.currentPlaylistViewing);
      Vue.set(
        state,
        "currentPlaylistName",
        state.playlists[state.currentPlaylistViewing].name
      );
    },
    SET_DELETED_PLAYLIST_DATA(state, { array, index }) {
      Vue.set(state.deletedPlaylists, index, array);
    },
    DRAG_FINISHED(state, payload) {
      const arr = state.playlists[state.currentPlaylistViewing];
      Vue.set(arr, "data", payload);
      Vue.set(state, "orderChanged", true);
    }
  },
  actions: {
    changePlaylists({ commit }, payload) {
      commit("CHANGE_PLAYLISTS", payload);
    },
    pushPlaylist({ commit, state }, payload) {
      commit("PUSH_PLAYLIST", [...state.playlists, payload]);
    },
    pushDeletedPlaylist({ commit, state }, payload) {
      commit("PUSH_DELETED_PLAYLIST", [...state.deletedPlaylists, payload]);
    },
    setSongProperty({ commit }, payload) {
      commit("SET_SONG_PROPERTY", payload);
    },
    setUpdatingPlaylist({ commit }, payload) {
      commit("SET_UPDATING_PLAYLIST", payload);
    },
    setPlaylistsProp({ commit }, payload) {
      commit("SET_PLAYLISTS_PROP", payload);
    },
    setPlaylistsMultiple({ commit }, payload) {
      commit("SET_PLAYLISTS_MULTIPLE", payload);
    },
    setCurrentPlaylistDetails({ commit }) {
      commit("SET_CURRENT_PLAYLIST_DETAILS");
    },
    setDeletedPlaylistData({ commit, state, getters, rootState }) {
      let deletedPlaylistIndex;

      state.deletedPlaylists.forEach((playlist, i) => {
        if (
          playlist.name ===
          getters.currentPlaylistViewing.name + "__deleted__"
        ) {
          deletedPlaylistIndex = i;
        }
      });

      commit("SET_DELETED_PLAYLIST_DATA", {
        array: rootState.deletedSongs,
        index: deletedPlaylistIndex
      });
    },
    dragFinished({ commit, getters, rootState }, [oldIndex, newIndex]) {
      let array = [...getters.currentPlaylistViewing.data];
      array.splice(newIndex, 0, array.splice(oldIndex, 1)[0]);

      const currentIndex = rootState.currentPlaying.index;

      if (currentIndex > -1) {
        if (oldIndex > currentIndex && newIndex < currentIndex) {
          commit(
            "SET_CURRENT_PLAYING_PROP",
            { prop: "index", data: currentIndex + 1 },
            { root: true }
          );
        } else if (oldIndex < currentIndex && newIndex > currentIndex) {
          commit(
            "SET_CURRENT_PLAYING_PROP",
            { prop: "index", data: currentIndex - 1 },
            { root: true }
          );
        } else if (newIndex === currentIndex && oldIndex < currentIndex) {
          commit(
            "SET_CURRENT_PLAYING_PROP",
            { prop: "index", data: currentIndex - 1 },
            { root: true }
          );
        } else if (newIndex === currentIndex && oldIndex > currentIndex) {
          commit(
            "SET_CURRENT_PLAYING_PROP",
            { prop: "index", data: currentIndex + 1 },
            { root: true }
          );
        } else if (oldIndex === currentIndex) {
          commit(
            "SET_CURRENT_PLAYING_PROP",
            { prop: "index", data: newIndex },
            { root: true }
          );
        }
      }

      commit("DRAG_FINISHED", array);
    }
  },
  getters: {
    playlistNames: state => {
      return state.playlists.map(playlist => playlist.name);
    },
    playlistsData: state => {
      return state.playlists.map(playlist => playlist.data);
    },
    playlistDatesAdded: state => {
      return state.playlists.map(playlist => playlist.added);
    },
    currentPlaylistViewing: state => {
      if (state.currentPlaylistViewing !== -1) {
        return state.playlists[state.currentPlaylistViewing];
      } else {
        return undefined;
      }
    },
    currentPlaylist: state => {
      if (state.currentPlaylist !== -1) {
        return state.playlists[state.currentPlaylist];
      } else {
        return undefined;
      }
    }
  }
};

const profile = {
  state: {
    displayName: "",
    email: "",
    uid: "",
    emailVerified: false,
    signedIn: false
  },
  mutations: {
    SET_PROFILE_PROP(state, payload) {
      Vue.set(state, payload.prop, payload.data);
    },
    SET_PROFILE_MULTIPLE(state, payload) {
      Object.keys(payload).forEach(prop => {
        Vue.set(state, prop, payload[prop]);
      });
    }
  },
  actions: {
    setProfileProp({ commit }, payload) {
      commit("SET_PROFILE_PROP", payload);
    },
    setProfileMultiple({ commit }, payload) {
      commit("SET_PROFILE_MULTIPLE", payload);
    }
  }
};

export default new Vuex.Store({
  state: {
    mountedTrackControlsCount: 0,
    missingSongsCount: 0,
    deletedSongsCount: 0,
    deletedSongs: [],
    documentsPath: "",
    alerts: [],
    imageFilter: "",
    navbarSmall: true,
    navbarWidth: 60,
    webOnly: false,
    settings: {}
  },
  mutations: {
    ADD_ALERT(state, payload) {
      state.alerts = [payload, ...state.alerts];
    },
    CLOSE_ALERT(state, index) {
      state.alerts = state.alerts.filter((alert, i) => i !== index);
    },
    SET_DOCUMENTS_PATH(state, path) {
      state.documentsPath = path;
    },
    SET_PROP(state, obj) {
      Vue.set(state, obj.prop, obj.data);
    },
    DECREMENT(state, prop) {
      state[prop]--;
    },
    INCREMENT(state, prop) {
      state[prop]++;
    },
    PUSH_DELETED_SONG(state, payload) {
      if (!state.deletedSongs) {
        Vue.set(state, "deletedSongs", [payload]);
      } else {
        Vue.set(state, "deletedSongs", [payload, ...state.deletedSongs]);
      }
    },
    NAVBAR_CHANGED(state, payload) {
      Vue.set(state, "navbarSmall", payload);
    }
  },
  actions: {
    addAlert({ commit }, payload) {
      commit("ADD_ALERT", payload);
    },
    closeAlert({ commit }, index) {
      commit("CLOSE_ALERT", index);
    },
    setDocumentsPath({ commit }, path) {
      commit("SET_DOCUMENTS_PATH", path);
    },
    setProp({ commit }, obj) {
      commit("SET_PROP", obj);
    },
    decrement({ commit }, prop) {
      commit("DECREMENT", prop);
    },
    increment({ commit }, prop) {
      commit("INCREMENT", prop);
    },
    pushDeletedSong({ commit }, payload) {
      commit("PUSH_DELETED_SONG", payload);
    },
    navbarChanged({ commit }, payload) {
      commit("NAVBAR_CHANGED", payload);
    }
  },
  modules: {
    currentPlaying: currentPlaying,
    currentDownload: currentDownload,
    playlists: playlists,
    profile: profile,
    discordRPC: discordRPC
  },
  getters: {
    imageFilter: state => {
      if (!state.imageFilter) return "";
      
      const filter = state.imageFilter.split(":")[1];
      return filter.slice(0, filter.length - 1);
    },
    navbarSmall: state => {
      return state.navbarSmall;
    }
  }
});
