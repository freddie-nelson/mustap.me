<template>
  <section class="my-profile">
    <header class="my-profile__header">
      <div>
        <h1 class="my-profile__heading">
          My Profile
        </h1>
        <h2 class="my-profile__sub-heading">
          {{ this.$store.state.profile.displayName }}
        </h2>
      </div>
      <Button
        text="Sign Out"
        :filled="true"
        @clicked="signOut"
      />
    </header>
  </section>
</template>

<script>
import Button from "@/components/Button";
import firebase from "firebase/app";
import "firebase/auth";

export default {
    name: "MyProfile",
    components: {
        Button
    },
    methods: {
        signOut() {
            firebase.auth().signOut()
                .catch((err) => {
                    this.$store.dispatch("addAlert", { text: "Could not sign out. Error: " + err.message })
                });
        }
    }
}
</script>

<style lang="scss">
.my-profile {
    padding: 60px;
    width: 100%;

    &__header {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    &__heading {
        font-size: 36px;
        color: var(--primary-text);
        font-weight: 600;
    }

    &__sub-heading {
        @extend .my-profile__heading;
        font-size: 26px;
        font-weight: 500;
    }
}
</style>