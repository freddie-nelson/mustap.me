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
        />
        
        <InputBox
          class="modal__form-input"
          label="Playlist link or ID"
          placeholder="Playlist link or ID..."
          :full="true"
        />
        <p><span>Don't know where to find this? Click </span><a href="#">here</a><span> for help.</span></p>
        <Button
          text="Create Playlist"
          :filled="true"
          :font-size="14"
          style="float: right; margin-top: 2px;"
        />
        <Button
          text="Create Empty Playlist"
          style="float: right; margin-top: 7px; margin-right: 18px;"
          :font-size="14"
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

    &__button {
        position: absolute;
        top: 1px;
        right: 1px;
        padding: 8px;
        box-sizing: content-box;
    }
}
</style>