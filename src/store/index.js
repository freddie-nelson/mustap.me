import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

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
    },
    SET_CURRENT_PLAYING_CURRENT_TIME(state, { currentTime, progress }) {
      Vue.set(state, "currentTime", currentTime);
      Vue.set(state, "progress", progress);
    },
    SET_CURRENT_PLAYING_SOUND_CURRENT_TIME(state, payload) {
      Vue.set(state.sound, "currentTime", payload);
    },
    CHANGE_VOLUME(state, payload) {
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
    async setCurrentPlayingSrc({ commit, state, rootState }, payload) {
      if (payload) {
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

        const path = rootState.documentsPath + "/mustap/songs/" + state.filename;
        const dataURL = await convertSong(path);

        commit("SET_CURRENT_PLAYING_SRC", dataURL);
      }
    },
    setCurrentPlayingCurrentTime({ commit, state }) {
      if (state.currentTimeSeconds === Math.ceil(state.sound.currentTime)) {
        return;
      } else {
        commit("SET_CURRENT_PLAYING_PROP", { prop: "currentTimeSeconds", data: Math.ceil(state.sound.currentTime) });

        const num = state.currentTimeSeconds % 60 < 10 ? "0" + (state.currentTimeSeconds % 60) : state.currentTimeSeconds % 60;
        const currentTime = Math.floor(state.currentTimeSeconds / 60) + ":" + num;
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
      let newVolume = minus ? state.sound.volume - num : state.sound.volume + num;

      Math.round((newVolume + Number.EPSILON) * 100) / 100;

      if (newVolume > 1) {
        newVolume = 1;
      } else if (newVolume < 0) {
        newVolume = 0;
      }

      commit("CHANGE_VOLUME", newVolume);
    }
  },
  getters: {
    soundCurrentTime: state => {
      return Math.ceil(state.sound.currentTime);
    }
  }
};

const currentDownload = {
  state: {
    playlistPath: "",
    currentProcess: "N / A",
    currentDownloadTitle: "N / A",
    progress: 0,
    index: 0,
    totalQueueSize: 0,
    currentlyDownloading: false,
    stream: null,
    path: ""
  },
  mutations: {
    SET_CURRENT_DOWNLOAD_MULTIPLE(state, payload) {
      Object.keys(payload).forEach(prop => {
        Vue.set(state, prop, payload[prop]);
      });
    },
    SET_CURRENT_DOWNLOAD_PROP(state, payload) {
      Vue.set(state, payload.prop, payload.data);
    }
  },
  actions: {
    setCurrentDownloadMultiple({ commit }, payload) {
      commit("SET_CURRENT_DOWNLOAD_MULTIPLE", payload);
    },
    setCurrentDownloadProp({ commit }, payload) {
      commit("SET_CURRENT_DOWNLOAD_PROP", payload);
    }
  }
};

const playlists = {
  state: {
    playlists: [],
    deletedPlaylists: [],
    currentPlaylist: -1,
    currentPlaylistViewing: -1,
    currentPlaylistName: "",
    repeatPlaylist: true,
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
    SET_UPDATING_PLAYLIST(state, payload) {
      Object.keys(payload).forEach(prop => {
        Vue.set(state.updatingPlaylist, prop, payload[prop]);
      });
    },
    SET_PLAYLISTS_PROP(state, payload) {
      Vue.set(state, payload.prop, payload.data);
    },
    SET_CURRENT_PLAYLIST_DETAILS(state) {
      Vue.set(state, "currentPlaylist", state.currentPlaylistViewing);
      Vue.set(state, "currentPlaylistName", state.playlists[state.currentPlaylistViewing].name);
    },
    SET_DELETED_PLAYLIST_DATA(state, { array, index }) {
      Vue.set(state.deletedPlaylists, index, array);
    }
  },
  actions: {
    changePlaylists({ commit }, payload) {
      commit("CHANGE_PLAYLISTS", payload);
    },
    setUpdatingPlaylist({ commit }, payload) {
      commit("SET_UPDATING_PLAYLIST", payload);
    },
    setPlaylistsProp({ commit }, payload) {
      commit("SET_PLAYLISTS_PROP", payload);
    },
    setCurrentPlaylistDetails({ commit }) {
      commit("SET_CURRENT_PLAYLIST_DETAILS");
    },
    setDeletedPlaylistData({ commit, state, getters, rootState }) {
      let deletedPlaylistIndex;

      state.deletedPlaylists.forEach((playlist, i) => {
        if (playlist.name === getters.currentPlaylistViewing.name + "__deleted__") {
          deletedPlaylistIndex = i;
        }
      });

      commit("SET_DELETED_PLAYLIST_DATA", { array: rootState.deletedSongs, index: deletedPlaylistIndex });
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

export default new Vuex.Store({
  state: {
    mountedTrackControlsCount: 0,
    missingSongsCount: 0,
    deletedSongsCount: 0,
    deletedSongs: [],
    documentsPath: "",
    alerts: [],
    deleteClickedIndex: -1
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
    RESET_DELETE_CLICKED_INDEX(state) {
      state.deleteClickedIndex = -1;
    },
    PUSH_DELETED_SONG(state, payload) {
      if (!state.deletedSongs) {
        Vue.set(state, "deletedSongs", [payload]);
      } else {
        Vue.set(state, "deletedSongs", [payload, ...state.deletedSongs]);
      }
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
    resetDeleteClickedIndex({ commit }) {
      commit("RESET_DELETE_CLICKED_INDEX");
    },
    pushDeletedSong({ commit }, payload) {
      commit("PUSH_DELETED_SONG", payload);
    }
  },
  modules: {
    currentPlaying: currentPlaying,
    currentDownload: currentDownload,
    playlists: playlists
  },
  getters: {}
});
