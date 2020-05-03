<template>
  <div class="sign-in-form">
    <img
      src="@/assets/svg/profile.svg"
      alt="Profile Icon"
      class="sign-in-form__icon"
      :style="{ filter: $store.getters.imageFilter }"
    >
    <div class="sign-in-form__inputs">
      <InputBox
        v-model="email"
        placeholder="Email..."
        :height="35"
      />
      <InputBox
        v-model="password"
        placeholder="Password..."
        :max-length="30"
        :height="35"
        type="password"
      />
    </div>
    <div class="sign-in-form__btn-container">
      <Button
        text="Sign up"
        :filled="true"
        @clicked="signUp"
      />
      <Button
        text="Sign in"
        :filled="true"
        @clicked="signIn"
      />
    </div>
  </div>
</template>

<script>
import InputBox from "@/components/InputBox";
import Button from "@/components/Button";
import firebase from "firebase/app";
import "firebase/auth";

export default {
    name: "SignInForm",
    components: {
      InputBox,
      Button
    },
    data() {
      return {
        email: "",
        password: ""
      }
    },
    methods: {
      validateInputs() {
        const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
        const passwordRegex = /(?=.{8,})/;

        if (!emailRegex.test(this.email) || !this.email) {
          this.$store.dispatch("addAlert", { text: "Invalid email, please try again.", type: "warning" })
          this.email = "";
          return false;
        }

        if (!passwordRegex.test(this.password) || !this.password) {
          this.$store.dispatch("addAlert", { text: "Password must be at least 8 characters long.", type: "warning" })
          this.password = "";
          return false;
        }

        return true;
      },
      signUp() {
        if (!this.validateInputs()) {
          return
        }

        const auth = firebase.auth();

        auth.createUserWithEmailAndPassword(this.email, this.password)
          .then(() => {
            this.$store.dispatch("addAlert", { text: "User created successfully!", type: "alert" });
            const user = firebase.auth().currentUser;

            user.sendEmailVerification()
              .then(() => {
                this.$store.dispatch("addAlert", { text: "Please verify your email address by clicking the link you have recieved from noreply@mustap.me", type: "alert" })
              })
              .catch(() => {
                this.$store.dispatch("addAlert", { text: "Verification email could not be sent.", type: "warning" })
              })
          })
          .catch(err => {
            const errorMessage = err.message;

            this.$store.dispatch("addAlert", { text: "User could not be created. Error: " + errorMessage, type: "warning" });
          })

      },
      signIn() {
        if (!this.validateInputs()) {
          return
        }

        const auth = firebase.auth();

        auth.signInWithEmailAndPassword(this.email, this.password)
          .catch((err) => {
            this.$store.dispatch("addAlert", { text: "Sorry you could not be signed in. Error: " + err.message, type: "warning" });
          })

      }
    }
}
</script>

<style lang="scss">
  .sign-in-form {
    margin: auto;
    display: flex;
    flex-direction: column;
    align-items: center;

    &__icon {
      width: 70px;
    }

    &__btn-container {
      margin-top: 15px;
      align-self: flex-end;

      div:first-of-type {
        margin-right: 15px;
      }
    }
  }
</style>