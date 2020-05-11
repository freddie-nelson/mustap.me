import Vue from "vue";
import App from "./App.vue";
import store from "./store";
import router from "./router";
import VuePageTransition from "vue-page-transition";
import "vue-range-component/dist/vue-range-slider.css";
import VueRangeSlider from "vue-range-component";
import firebase from "firebase/app";
import "firebase/auth"
import firebaseConfig from "./firebaseConfig";

// load fonts
import "typeface-poppins";
import "typeface-roboto";

Vue.config.productionTip = false;
Vue.use(VuePageTransition);
Vue.use(VueRangeSlider);

// start firebase with config
firebase.initializeApp(firebaseConfig);

// set auth so user stays logged
firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
  .catch((error) => {
    console.log(error.code + " " + error.message);
  });

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount("#app");
