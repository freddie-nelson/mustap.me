<template>
  <div class="currently-playing-bar">
    <TrackControls
      :current-time="$store.state.currentPlaying.sound.currentTime"
      :padding="0"
      class="currently-playing-bar__track-controls"
    />
  </div>
</template>

<script>
import TrackControls from "./TrackControls";

export default {
    name: "CurrentlyPlayingBar",
    components: {
        TrackControls
    }
}
</script>

<style lang="scss">
    .currently-playing-bar {
        display: flex;
        justify-content: space-around;
        align-items: center;
        // border-top: 1px solid var(--dark-bg);
        background-color: var(--lighter-bg);
        grid-area: currently-playing-bar;

        .controls {
            margin: 40px 30px 0 30px;
            max-width: 60%;

            &__volume-buttons {
                display: none;
            }
        }
    }
</style>