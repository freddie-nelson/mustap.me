<template>
  <main class="profile">
    <vue-page-transition
      name="fade-in-right"
      class="profile-transition"
    >
      <router-view />
    </vue-page-transition>
  </main>
</template>

<script>
import firebase from "firebase/app";
import "firebase/auth";

export default {
    name: 'Profile',
    mounted() {
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          // User is signed in.
          this.$store.dispatch("setProfileMultiple", { 
            email: user.email,
            emailVerified: user.emailVerified,
            uid: user.uid,
            displayName: user.displayName || user.email.split("@")[0] 
          })

          if (this.$route.name !== "MyProfile") {
            this.$router.push({ name: "MyProfile" })
          }
        } else {
          // User is signed out.
          if (this.$route.name !== "SignIn") {
            this.$router.push({ name: "SignIn" })
          }
        }
      });
    }
}
</script>

<style lang="scss">
    .profile {
        width: 100%;
        height: 100%;

        &-transition {
          width: 100%;
          height: 100%;
          display: flex;
        }
    }
</style>