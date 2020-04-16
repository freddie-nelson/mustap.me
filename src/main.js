import Vue from "vue";
import App from "./App.vue";
import store from "./store";
import router from "./router";
import VuePageTransition from "vue-page-transition";
import "vue-range-component/dist/vue-range-slider.css";
import VueRangeSlider from "vue-range-component";

Vue.config.productionTip = false;
Vue.use(VuePageTransition);
Vue.use(VueRangeSlider);

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount("#app");