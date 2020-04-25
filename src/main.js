import Vue from "vue";
import App from "./App.vue";
import store from "./store";
import router from "./router";
import VuePageTransition from "vue-page-transition";
import "vue-range-component/dist/vue-range-slider.css";
import VueRangeSlider from "vue-range-component";
import firebase from "firebase";

Vue.config.productionTip = false;
Vue.use(VuePageTransition);
Vue.use(VueRangeSlider);

const firebaseConfig = {
  apiKey: "AIzaSyA_IJI1oNzOzBTJaoG2vg-RD10IkLeD3Kc",
  authDomain: "mustap-5c29d.firebaseapp.com",
  databaseURL: "https://mustap-5c29d.firebaseio.com",
  projectId: "mustap-5c29d",
  storageBucket: "mustap-5c29d.appspot.com",
  messagingSenderId: "687097188594",
  appId: "1:687097188594:web:abd894c897c9aa0ca0006b",
  measurementId: "G-WB9DFSRNLH"
};

firebase.initializeApp(firebaseConfig);


new Vue({
  store,
  router,
  render: h => h(App)
}).$mount("#app");
