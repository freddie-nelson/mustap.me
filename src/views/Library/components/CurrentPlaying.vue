<template>
  <div class="current-playing-details-container">
    <h2 class="current-playing-details-container__heading">
      Currently Playing:
    </h2>
    <div class="current-playing-details">
      <div
        class="current-playing-details__image"
        :style="{
          backgroundImage: `url(${this.$store.state.currentPlaying.thumbnail})`
        }"
        alt="Album Cover / Song Art"
      ></div>
      <div class="current-playing-details__text">
        <p class="current-playing-details__title">
          {{ this.$store.state.currentPlaying.title }}
        </p>
        <p>{{ this.$store.state.currentPlaying.artist }}</p>
        <p>
          {{ this.$store.state.currentPlaying.currentTime }} /
          {{ this.$store.state.currentPlaying.duration }}
        </p>
      </div>
    </div>

    <TrackControls
      ref="trackControls"
      :currentTime="$store.state.currentPlaying.sound.currentTime"
      :padding="0"
      :bgColor="'--lighter-bg'"
    />
    <Button
      style="margin-right: 30px;"
      @clicked="$emit('update-playlist')"
      :disabled="this.forPlaylists"
      :text="'Update Playlist'"
      :filled="false"
      :fontSize="15"
    />
    <Button
      @clicked="$emit('delete-playlist')"
      :disabled="this.forPlaylists"
      :text="'Delete Playlist'"
      :filled="true"
      :fontSize="15"
      :modalPopup="true"
      :modalText="'Are you sure you want to delete this playlist?'"
      :modalButtonText="'Yes, I\'m sure.'"
    />
    <input
      @keyup="search"
      v-model="filter"
      class="current-playing-details-container__searchbox"
      type="text"
      placeholder="Search..."
    />
    <div class="matches-list">
      <div v-if="!this.forPlaylists">
        <div class="matches-list__match" v-for="(match, i) in matches" :key="i" @click="searchResultClicked(match.index)">
          <span>{{ match.title }} by {{ match.artist }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TrackControls from "@/components/TrackControls";
import Button from "@/components/Button";

export default {
  name: "CurrentPlaying",
  components: {
    TrackControls,
    Button
  },
  data() {
    return {
      matches: [],
      filter: ""
    };
  },
  props: {
    forPlaylists: Boolean
  },
  methods: {
    search() {
      if (this.forPlaylists) {
        this.matches = [];
        return;
      }

      const titleElements = Array.from(document.querySelectorAll("p.cell__left-text-top"));
      const artistElements = Array.from(document.querySelectorAll("p.cell__left-text-bottom"));

      this.matches = [];

      const titles = titleElements.map(ele => {
        let title = ele.textContent || ele.innerText;

        if (title[0] == " ") {
          title = title.slice(1, title.length);
        }

        return title;
      });

      const artists = artistElements.map(ele => {
        let artist = ele.textContent || ele.innerText;

        if (artist[0] == " ") {
          artist = artist.slice(1, artist.length);
        }

        return artist;
      });

      for (let i = 0; i < titleElements.length; i++) {
        const title = titles[i];
        if (title.toUpperCase().indexOf(this.filter.toUpperCase()) > -1) {
          this.matches.push({ title: titles[i], artist: artists[i], index: i });
        }
      }

      this.matches = this.matches.slice(0, 16);
    },
    searchResultClicked(index) {
      if (this.forPlaylists) {
        this.matches = [];
        return;
      }
      this.$store.dispatch("setCurrentPlaylistDetails");
      this.$refs.trackControls.nextBack(index, "CurrentPlaying");
    }
  }
};
</script>

<style lang="scss">
.current-playing-details-container {
  margin-left: 50px;
  max-width: 760px;

  h2.current-playing-details-container__heading {
    margin: 0 0 30px 0;
    font-size: 32px;
  }

  &__searchbox {
    background: var(--lighter-bg);
    border: none;
    border-radius: 6px 6px 0 0;
    font-size: 16px;
    width: 300px;
    margin-top: 30px;
    outline: none !important;
    padding: 5px 10px;
    color: white;
    display: block;
  }
}

.current-playing-details {
  &__image {
    width: 220px;
    height: 220px;
    background-size: 240%;
    background-position: center;
    border-radius: 12px;
    display: inline-flex;

    &::after {
      content: "No image found";
      display: flex;
      color: var(--secondary-text);
      justify-content: center;
      align-items: center;
      z-index: -1;
      width: 100%;
      height: 100%;
      background-color: var(--lighter-bg);
      border-radius: 12px;
    }
  }

  &__text {
    display: inline-flex;
    height: 220px;
    vertical-align: top;
    flex-direction: column;
    justify-content: center;
    margin-left: 40px;
    width: calc(40% - 30px);
  }

  p {
    font-size: 30px;
    font-weight: 500;
    color: var(--secondary-text);
    line-height: 30px;
    margin-top: 15px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;

    &:last-of-type {
      text-overflow: clip;
    }
  }

  &__title {
    color: var(--primary-text) !important;
    margin-top: 0 !important;
  }
}

.matches-list {
  width: 300px;
  background-color: var(--lighter-bg);
  border-top: rgba(255, 255, 255, 0.1) 1.5px solid;
  border-radius: 0 0 6px 6px;
  display: flex;
  flex-direction: column;
  overflow: scroll;
  max-height: 140px;

  &::-webkit-scrollbar-thumb {
    background: var(--main-bg);
  }

  &__match {
    height: 30px;
    display: flex;
    padding: 5px 10px;
    align-items: center;
    color: var(--secondary-text);
    line-height: 16px;
    border-radius: 4px;
    margin: 4px;
    cursor: pointer;
    transition: background 0.3s ease-in;

    span {
      width: 100%;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    &:hover {
      background: rgba(255, 255, 255, 0.144);
    }
  }
}

@media screen and (max-width: 1525px) {
  .current-playing-details {
    &__image {
      width: 175px;
      height: 175px;
    }

    &__text {
      height: 175px;
      margin-left: 20px;

      p {
        font-size: 26px;
        line-height: 26px;
        margin-top: 10px;
      }
    }
  }
}
</style>
