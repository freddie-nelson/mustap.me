<template>
  <div class="modal-container">
    <div class="modal">
      <Button
        class="modal__button"
        @clicked="$emit('close')"
        icon="x"
        :icon-width="22"
      />
      <h1
        class="modal__title"
        style="margin-bottom: 20px;"
      >
        Create a new playlist
      </h1>
      <div class="modal__form">
        <InputBox
          class="modal__form-input"
          label="Playlist name"
          placeholder="Name..."
          :full="true"
          :max-length="70"
          v-model="name"
        />
        <InputBox
          class="modal__form-input"
          label="Playlist link or ID"
          placeholder="Playlist link or ID..."
          :full="true"
          :max-length="1000"
          v-model="link"
        />
        <p><span>Don't know where to find this? Click </span><a href="#">here</a><span> for help.</span></p>
        <Button
          text="Create Playlist"
          :filled="true"
          :font-size="14"
          style="float: right; margin-top: 2px;"
          @clicked="createPlaylist"
        />
        <Button
          text="Create Empty Playlist"
          style="float: right; margin-top: 7px; margin-right: 18px;"
          :font-size="14"
          @clicked="createPlaylist(true)"
        />
      </div>

      <div
        class="modal__errors"
        v-if="errorMsg.length"
      >
        <div class="bg" />
        <h3>{{ errorMsg }}</h3>
        <v-icon
          name="x"
          class="modal__errors-close"
          @click.native="errorMsg = ''"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Button from "@/components/Button";
import InputBox from "@/components/InputBox";

export default {
  name: "AddPlaylistModal",
  components: {
    Button,
    InputBox
  },
  data() {
    return {
      name: "",
      link: "",
      errorMsg: ""
    }
  },
  methods: {
    validateName() {
      const name = this.name.replace(/[/\\?%*:|"<>.]/g, "");
      if (name.length === 0) {
        this.errorMsg = "No playlist name has been entered."
        return false;
      }

      const playlistNames = this.$store.getters.playlistNames;

      for (const playlistName of playlistNames) {
        if (name === playlistName) {
          this.errorMsg = "That name is already taken by another playlist."
          return false;
        }
      }

      this.errorMsg = "";
      return true;
    },
    validateLink() {
      if (this.link.length === 0) {
        this.errorMsg = "No playlist link or ID has been entered."
        return false;
      }

      const ytpl = require("ytpl");

      if (!ytpl.validateID(this.link)) {
        this.errorMsg = "The playlist link or ID entered is invalid.";
        return false;
      }

      this.errorMsg = "";
      return true;
    },
    createPlaylist(empty = false) {
      const valid = empty ? this.validateName() : this.validateName() && this.validateLink();
      
      if (!valid) return;

      if (empty) {
        this.$store.dispatch("setCurrentDownloadMultiple", {
          playlistName: this.name,
          downloadNow: true
        });
      } else {
        this.$store.dispatch("setCurrentDownloadMultiple", {
          playlistLink: this.link,
          playlistName: this.name,
          downloadNow: true
        });
      }

      this.$emit("close");
    }
  }
}
</script>

<style lang="scss" scoped>
.modal-container {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10;
    
    &::before {
        content: "";
        width: 100%;
        height: 100%;
        background-color: var(--dark-bg);
        position: absolute;
        opacity: 0.7;
    }
}

.modal {
    max-width: 750px;
    width: 80%;
    background-color: var(--main-bg);
    z-index: 2;
    border-radius: 8px;
    position: relative;
    padding: 20px;

    &__title {
      font-size: 2rem;
      color: var(--primary-text);
      margin: 0;
      line-height: 100%;
    }

    &__form {
      margin-top: 10px;

      &-input {
        margin-top: 18px;
      }

      p {
        color: var(--secondary-text);
        font-weight: 300;
        font-size: 12.5px;
        margin-top: 5px;

        span {
          opacity: 0.5;
        }

        >a {
          color: var(--accent-color);
          font-weight: 500;
          opacity: 0.8;
        }
      }
    }

    &__errors {
      height: 55px;
      margin-top: 60px;
      position: relative;
      display: flex;
      align-items: center;
      overflow: hidden;

      &:hover {
        .modal__errors-close {
          opacity: 1;
        }
      }
      
      &-close {
        content: "";
        color: var(--accent-color-secondary);
        filter: contrast(2);
        width: 20px;
        height: 20px;
        margin: auto 0;
        position: absolute;
        right: 15px;
        top: 0;
        bottom: 0;
        cursor: pointer;
        transition: opacity .2s ease-in;
        opacity: 0;
      }

      &::before {
        content: "";
        background-color: var(--accent-color-secondary);
        filter: contrast(2);
        width: 6px;
        height: 100%;
        border-radius: 6px 0 0 6px;
        position: absolute;
        left: 0;
        top: 0;
      }

      h3 {
        margin-left: 21px;
        font-size: 16px;
        font-weight: 500;
        margin-top: -1px;
        opacity: 1;
        color: var(--accent-color-secondary);
        filter: contrast(2)
      }

      .bg {
        background-color: var(--accent-color-secondary);
        width: 100%;
        height: 100%;
        position: absolute;
        z-index: -1;
        opacity: 0.12;
        border-radius: 8px;
      }
    }

    &__button {
        position: absolute;
        top: 1px;
        right: 1px;
        padding: 8px;
        box-sizing: content-box;
    }
}
</style>