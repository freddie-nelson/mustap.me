<template>
    <div style="display: inline-block;">
        <button @click="modalPopup ? !disabled ? modalShow = true : null : !disabled ? $emit('clicked'): null" :class="{ filled: filled || false, disabled: disabled || false }" :style="{ fontSize: `${ fontSize }px` }">
            {{ text }}
        </button>
        <div v-if="modalShow" class="modal-container">
            <div class="modal">
                <p>{{ modalText }}</p>
                <input v-if="modalInputBox || false"  type="text" name="playlist-name" v-model="playlistName">
                <div class="modal__button-container">
                    <Button @clicked="modalShow = false" class="button" :filled="false" :text="'Cancel'" :fontSize="14" />
                    <Button @clicked="() => { $emit('clicked'); modalShow = false }" class="button" :filled="true" :text="modalButtonText" :fontSize="14" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Button',
    data() {
        return {
            modalShow: false
        }
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
}
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
        transition: color ease-in .3s;

        &:hover {
            color: var(--accent-color);
        }
    }

    .filled {
        background-color: var(--accent-color-secondary);
        transition: background-color ease-in .7s;
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
        width: calc(100% - 300px);
        height: 100%;
        background: rgba(0, 0, 0, .7);
        top: 0;
        left: 300px;
        z-index: 100;
        display: flex;
        align-items: center;
        justify-content: center;
        animation: searchbox-options-anim 1s ease-in;
        animation-fill-mode: forwards;
    }

    .modal {
        background-color: var(--main-bg);
        padding: 20px;
        border-radius: 10px;

        p {
            margin-bottom: 5px;
            opacity: .7;
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
</style>