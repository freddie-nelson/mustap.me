<template>
    <div class="current-playing-details-container">
        
        <h2 class="current-playing-details-container__heading">Currently Playing:</h2>
        <div class="current-playing-details">

            <div class="current-playing-details__image" :style="{ backgroundImage: `url(${this.$store.state.currentPlaying.thumbnail})` }" alt="Album Cover / Song Art"></div>
            <div class="current-playing-details__text">
                <p class="current-playing-details__title">{{ this.$store.state.currentPlaying.title }}</p>
                <p>{{ this.$store.state.currentPlaying.artist }}</p>
                <p>{{ this.$store.state.currentPlaying.currentTime }} / {{ this.$store.state.currentPlaying.duration }}</p>
            </div>

        </div>

         <TrackControls :currentTime="$store.state.currentPlaying.sound.currentTime" :padding="0" :bgColor="'--lighter-bg'" />
    </div>
</template>

<script>
import TrackControls from '@/components/TrackControls'

export default {
    name: 'CurrentPlaying',
    components: {
        TrackControls
    }
}
</script>

<style lang="scss">

    .current-playing-details-container {
        margin-left: 50px;
        width: 100%;
        max-width: 760px;

        h2.current-playing-details-container__heading {
            margin: 0 0 30px 0;
            font-size: 32px;
        }
    }

    .current-playing-details {

        &__image {
            width: 250px;
            height: 250px;
            background-size: 240%;
            background-position: center;
            border-radius: 12px;
            display: inline-block;
        }

        &__text {
            display: inline-flex;
            height: 250px;
            vertical-align: top;
            flex-direction: column;
            justify-content: center;
            margin-left: 40px;
            width: calc(100% - 290px);
            min-width: 165px;
        }

        p {
            font-size: 30px;
            font-weight: 500;
            color: var(--secondary-text);
            line-height: 30px;
            margin-top: 15px;
        }

        &__title {
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            color: var(--primary-text) !important;
            margin-top: 0 !important;
        }
    }
</style>