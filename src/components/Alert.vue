<template>
  <div class="alert">
    <div class="alert__text-container">
        <div v-if="warning" class="alert__text--warning">{{ this.icon }} </div>
        <div v-if="alert" class="alert__text--alert">{{ this.icon }} </div>
        <p class="alert__text">
        {{ this.text }}
        </p>
    </div>
    <Button @clicked="$emit('close')" class="alert__btn" :text="'Close'"/>
  </div>
</template>

<script>
import Button from './Button'

export default {
    name: 'Alert',
    components: {
        Button
    },
    props: {
        warning: Boolean,
        alert: Boolean,
        icon: String,
        text: String
    }
}
</script>

<style lang="scss">
    .alert {
        margin-top: 10px;
        display: flex;
        width: 320px;
        background-color: var(--lighter-bg);
        color: var(--secondary-text);
        font-size: 13px;
        font-weight: 300;
        padding: 10px;
        border-radius: 5px;
        flex-direction: column;
        cursor: pointer;
        transition: background-color .3s ease-in;

        &:hover {
            background-color: var(--alert-hover-color);
        }

        &:first-of-type {
            margin-top: 0px;
        }

        &__text-container {
            display: flex;
        }

        &__btn {
            align-self: flex-end;
        }

        &__text {
            margin-left: 5px;
            margin-top: -1px;

            &--warning {
                color: rgb(211, 21, 21);
            }

            &--alert {
                color: rgb(255, 238, 0);
            }
        }
        
    }
</style>