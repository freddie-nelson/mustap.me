<template>
  <div class="modal-container">
    <div class="modal">
      <Button
        class="modal__button"
        @clicked="$emit('close')"
        icon="x"
        :icon-width="22"
      />
    </div>
  </div>
</template>

<script>
import Button from "@/components/Button";

export default {
    name: "AddSongModal",
    components: {
        Button
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
    max-width: 60%;
    width: 100%;
    max-height: 400px;
    height: 100%;
    background-color: var(--main-bg);
    z-index: 2;
    border-radius: 8px;
    position: relative;

    &__button {
        position: absolute;
        top: 1px;
        right: 1px;
        padding: 8px;
        box-sizing: content-box;
    }
}
</style>