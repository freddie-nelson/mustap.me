<template>
  <main class="home">
    <div class="home__header">
      <h1>{{ this.title }}</h1>
    </div> 
    <div class="home__grid">
      <div class="home__changes grid-cell">
        <h1>Recent Changes</h1>
        <h2>1.0.0</h2>
        <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Repellendus ipsum similique repudiandae voluptate nihil inventore quos tenetur illo optio, distinctio, iste vel, natus quibusdam? Officia eaque perspiciatis impedit quas nihil?</p>
        <Button
          class="changes__btn"
          text="See more"
          :font-size="15"
        />
      </div>
      <Playlists class="home__playlists" />
      <div class="home__donate grid-cell">
        <h1>Support Mustap</h1>
        <p>Hey, I'm Freddie! Mustap is a passion project of mine and I would greatly appreciate it if you could help support it's development.</p>
        <Button
          class="donate__btn"
          text="Thank you ♥"
          :filled="true"
          :font-size="15"
        />
      </div>
    </div>
  </main>
</template>

<script>
import Playlists from "./components/Playlists";
import Button from "@/components/Button";
import firebase from "firebase/app";
import "firebase/auth";

export default {
    name: "Home",
    components: {
        Playlists,
        Button
    },
    computed: {
        title() {
            const auth = firebase.auth();

            if (auth.currentUser) {
                return `Welcome back ${this.$store.state.profile.displayName }`
            } else {
                return "Welcome to Mustap"
            }
        }
    }
}
</script>

<style lang="scss">
.home {
    width: 100%;
    height: 100vh;
    padding: 60px;
    overflow-y: scroll;

    &__header {
        margin-bottom: 25px;
        
        h1 {
            color: var(--primary-text);
            font-weight: 600;
            font-size: 36px;
        }
    }

    &__grid {
        display: grid;
        height: calc(100% - 85px);
        grid-template-columns: repeat(12, 1fr);
        grid-template-rows: repeat(4, 1fr);
        grid-template-areas: "c c c c c c c p p p p p"
                             ". . . . . . . p p p p p"
                             ". . . . . . . . . . . ."
                             ". . . . . . . . d d d d";
        grid-gap: 15px;

        @media screen and (max-width: 1100px) {
            grid-template-areas: "c c c c c c p p p p p p"
                                 ". . . . . . p p p p p p"
                                 ". . . . . . . . . . . ."
                                 ". . . . . . d d d d d d";
        }
    }

    .grid-cell {
        background-color: var(--lighter-bg);
        border-radius: 8px;
        color: var(--primary-text);

        h1 {
            font-weight: 600;
            font-size: 28px;
            margin-bottom: 3px;
        }

        h2 {
            font-weight: 500;
            font-size: 22px;
            line-height: 25px;
            margin-bottom: 3px;
            margin-top: -5px;
        }

        p {
            font-weight: 300;
            color: var(--secondary-text);
            font-size: 14px;
            line-height: 21px;
        }
    }

    &__changes {
        grid-area: c;
        padding: 10px 20px;
        position: relative;

        p {
            text-overflow: ellipsis;
            overflow: hidden;
            -webkit-line-clamp: 4;
            -webkit-box-orient: vertical;
            display: -webkit-box;
        }

        .changes__btn {
            float: right;
            margin-top: 5px;
        }

    }

    &__playlists {
        grid-area: p;
    }

    &__donate {
        grid-area: d;
        padding: 10px 20px;

        .donate__btn {
            margin-top: 10px;
        }
    }
}
</style>