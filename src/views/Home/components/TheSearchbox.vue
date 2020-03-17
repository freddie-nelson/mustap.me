<template>
  <div class="search-box">
      <svg @click="searched" xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="none">
        <path fill-rule="evenodd" d="M18.406 16.624l6.725 6.725a1.26 1.26 0 0 1-.001 1.783 1.26 1.26 0 0 1-1.783-.001l-6.725-6.725a10 10 0 0 1-13.627-1.295 10 10 0 0 1 .432-13.682 10 10 0 0 1 13.681-.432 10 10 0 0 1 1.296 13.627h.001zM10.5 18a7.5 7.5 0 0 0 7.5-7.5A7.5 7.5 0 0 0 10.5 3 7.5 7.5 0 0 0 3 10.5a7.5 7.5 0 0 0 7.5 7.5z" fill="#fff"/>
      </svg>
      <div class="search-box__seperator"></div>
      <input id="playlist-url" type="text" placeholder="Enter your playlist link here">
  </div>
</template>

<script>
export default {
    name: 'Searchbox',
    methods: {
        searched() {
            const value = document.getElementById('playlist-url').value;
            this.$emit('searched', value)
        }
    }
}
</script>

<style lang="scss">
    .search-box {
        display: flex;
        align-items: center;
        
        svg {
            cursor: pointer;
            transition: all .2s ease-out;

            &:hover {
                transform: scale(1.1);
            }
        }

        &__seperator {
            width: 5px;
            height: 40px;
            background: linear-gradient(to bottom, #E91E63, #E91EA4);
            border-radius: 3px;
            margin-left: 15px;
            margin-right: 10px;
        }

        input {
            background: none;
            border: none;
            width: 100%;
            height: 40px;
            font-size: 30px;
            outline: none !important;
            color: white;

            &:focus::placeholder {
                opacity: 0;
            }

            &::placeholder {
                transition: opacity .4s ease-in;
                color: rgba(255, 255, 255, 0.185);
            }
        }
    }
</style>