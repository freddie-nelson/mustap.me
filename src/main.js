import Vue from "vue";
import App from "./App.vue";
import store from "./store";
import router from "./router";

// import feather icon setnpm 
import feather from "vue-icon";
Vue.use(feather, "v-icon");

// load fonts
import "typeface-poppins";
// import "typeface-roboto";

Vue.config.productionTip = false;

// import the router transition component
import VuePageTransition from "vue-page-transition";
Vue.use(VuePageTransition);

// import range slider and it's css
import "vue-range-component/dist/vue-range-slider.css";
import VueRangeSlider from "vue-range-component";
Vue.use(VueRangeSlider);

// import the youtube player
// import VueYoutubeEmbed from "vue-youtube-embed";
// Vue.use(VueYoutubeEmbed);


// import firebase and the config
import firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from "./firebaseConfig";

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
