import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    currentDownload: {
      currentProcess: '',
      currentDownloadTitle: '',
      progress: 0,
      index: 0,
      totalQueueSize: 0
    }
  },
  mutations: {
  },
  actions: {
  },
  modules: {
  }
})
