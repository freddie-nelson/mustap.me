<template>
  <button
    ref="dropdown"
    class="dropdown"
    @click="show"
    @blur="blur"
  >
    <div
      class="dropdown__btn"
    >
      <div />
      <div />
      <div />
    </div>

    <div
      class="dropdown__menu"
      :style="{ top: menuY, left: menuX }"
      v-if="showMenu"
    >
      <Button
        class="dropdown__link"
        @clicked="$emit('update-playlist')"
        text="Update Playlist"
        style="display: block; text-align: left;"
        :font-size="16"
        :modal-popup="true"
        modal-text="Updating this playlist will reset it's order. If you wish to keep the current order you can add new songs manually."
        modal-button-text="Update Playlist"
      />
      <Button
        class="dropdown__link"
        @clicked="$emit('delete-playlist')"
        :text="'Delete Playlist'"
        style="display: block; text-align: left;"
        :font-size="16"
        :modal-popup="true"
        :modal-text="'Are you sure you want to delete this playlist?'"
        :modal-button-text="'Yes, I\'m sure.'"
      />
    </div>
  </button>
</template>

<script>
import Button from "@/components/Button";

export default {
    name: "DropdownMenu",
    components: {
        Button
    },
    data() {
        return {
            showMenu: false,
            menuX: 0,
            menuY: 0
        }
    },
    props: {
        data: Array
    },
    methods: {
        blur(e) {
            if (e.relatedTarget === null) {
                this.showMenu = false;
            } else {
                this.$refs.dropdown.focus();
            }
        },
        show(e) {
            this.showMenu = true;

            if (e.target.classList.contains("dropdown__btn")) {
                this.menuX = e.layerX + 2 + "px";
                this.menuY = e.layerY + 2 + "px";
            }
        }
    }
}
</script>

<style lang="scss">
.dropdown {
    background: none;
    border: none;
    outline: none !important;
    position: relative;

    &__btn {
        --btn-height: 6px;
        height: var(--btn-height);
        width: 30px;
        display: flex;
        justify-content: space-between;
        cursor: pointer;
        padding: 5px;
        box-sizing: content-box;
        opacity: 0.5;
        transition: opacity .3 ease-out;

        &:hover {
            opacity: 0.7;
        }

        div {
            width: var(--btn-height);
            height: var(--btn-height);
            background-color: var(--primary-text);
            border-radius: 10px;
        }
    }

    &__menu {
        position: absolute;
        background-color: var(--alert-hover-color);
        min-width: 180px;
        min-height: 50px;
        z-index: 10;
        border-radius: 8px;
        padding: 5px;
    }

    &__link {
        width: calc(100% - 4px);
        margin: 2px;
        padding: 3px 4px;
        border-radius: 6px;
        opacity: .7;
        cursor: pointer;
        transition: all .3s ease;

        &:hover {
            opacity: 1;
            background-color: rgba(255, 255, 255, 0.1);
        }

        button {
            color: var(--primary-text) !important;
            font-weight: 400;
        }
    }
}
</style>