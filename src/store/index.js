import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    currentDownload: {
      currentProcess: 'N / A',
      currentDownloadTitle: 'N / A',
      progress: 0,
      index: 0,
      totalQueueSize: 0,
      currentlyDownloading: false
    },
  },
  mutations: {
  },
  actions: {
  },
  modules: {
  }
})
