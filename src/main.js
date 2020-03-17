import Vue from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import VuePageTransition from 'vue-page-transition'

Vue.config.productionTip = false
Vue.use(VuePageTransition)

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')
