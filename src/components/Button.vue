<template>
  <button @click="$emit('clicked', e)" :class="{ filled: filled || false }" :style="{ fontSize: `${ fontSize }px` }">
      {{ text }}
  </button>
</template>

<script>
export default {
    name: 'Button',
    props: {
        text: String,
        fontSize: Number,
        filled: Boolean
    }
}
</script>

<style scoped lang="scss">
    button {
        background: none;
        color: $accent-color-secondary;
        border: none;
        outline: none !important;
        border-radius: 6px;
        font-weight: 500;
        cursor: pointer;
        transition: color ease-in .3s;

        &:hover {
            color: $accent-color;
        }

        .filled {
            background-color: $accent-color-secondary;
            transition: background-color ease-in .7s;
            color: white;
            padding: 7px 8px;

            &:hover {
                background-color: $accent-color;
            }
        }
    }
</style>