<template>
  <div style="display: inline-block;">
    <button
      @click="modalPopup ? (!disabled ? (modalShow = true) : null) : !disabled ? $emit('clicked') : null"
      :class="{ filled: filled || false, disabled: disabled || false }"
      :style="{ fontSize: `${fontSize}px` }"
    >
      {{ text }}
    </button>
    <transition name="fade">
      <div
        v-if="modalShow"
        class="modal-container"
      >
        <div class="modal">
          <p><span v-html="modalTextFormatted" /></p>
          <input
            v-if="modalInputBox || false"
            type="text"
            name="playlist-name"
            v-model="playlistName"
          >
          <div class="modal__button-container">
            <Button
              @clicked="modalShow = false"
              class="button"
              :filled="false"
              :text="'Cancel'"
              :font-size="14"
            />
            <Button
              @clicked="
                () => {
                  $emit('clicked');
                  modalShow = false;
                }
              "
              class="button"
              :filled="true"
              :text="modalButtonText"
              :font-size="14"
            />
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: "Button",
  data() {
    return {
      modalShow: false,
      modalTextFormatted: this.modalText ? this.modalText.replace(/\n/g, "<br>") : null
    };
  },
  props: {
    text: String,
    fontSize: Number,
    filled: Boolean,
    disabled: Boolean,
    modalPopup: Boolean,
    modalText: String,
    modalInputBox: Boolean,
    modalInputBoxLabel: String,
    modalButtonText: String
  }
};
</script>

<style scoped lang="scss">
button {
  background: none;
  color: var(--accent-color-secondary);
  border: none;
  outline: none !important;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: color ease-in 0.3s;

  &:hover {
    color: var(--accent-color);
  }
}

.filled {
  background-color: var(--accent-color-secondary);
  transition: background-color ease-in 0.7s;
  color: white;
  padding: 8px;

  &:hover {
    color: white;
    background-color: var(--accent-color);
  }
}

.disabled {
  color: gray !important;

  &.filled {
    background-color: gray !important;
    color: lightgray !important;
  }
}

.modal-container {
  position: absolute;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  top: 0;
  left: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal {
  background-color: var(--main-bg);
  padding: 20px;
  border-radius: 10px;
  max-width: 600px;

  p {
    margin-bottom: 5px;
    opacity: 0.7;
    color: var(--primary-text);
  }

  input {
    background: var(--lighter-bg);
    border: none;
    outline: none !important;
    font-size: 16px;
    border-radius: 5px;
    color: white;
    padding: 4px;
    display: block;
  }

  &__button-container {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
    margin-top: 10px;

    div:first-of-type {
      margin-right: 15px;
    }
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
