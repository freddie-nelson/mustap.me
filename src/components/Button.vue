<template>
  <button @click="$emit('clicked')" :class="{ filled: filled || false }" :style="{ fontSize: `${ fontSize }px` }">
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

        .filled {
            background-color: var(--accent-color-secondary);
            transition: background-color ease-in .7s;
            color: white;
            padding: 7px 8px;

            &:hover {
                background-color: var(--accent-color);
            }
        }
    }
</style>