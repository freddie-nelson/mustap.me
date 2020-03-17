<template>
  <div class="search-box">
      <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="none">
        <path fill-rule="evenodd" d="M18.406 16.624l6.725 6.725a1.26 1.26 0 0 1-.001 1.783 1.26 1.26 0 0 1-1.783-.001l-6.725-6.725a10 10 0 0 1-13.627-1.295 10 10 0 0 1 .432-13.682 10 10 0 0 1 13.681-.432 10 10 0 0 1 1.296 13.627h.001zM10.5 18a7.5 7.5 0 0 0 7.5-7.5A7.5 7.5 0 0 0 10.5 3 7.5 7.5 0 0 0 3 10.5a7.5 7.5 0 0 0 7.5 7.5z" fill="#fff"/>
      </svg>
      <div class="search-box__seperator"></div>
      <input type="text" placeholder="Enter your playlist link here">
  </div>
</template>

<script>
export default {
    name: 'Searchbox'
}
</script>

<style lang="scss">
    .search-box {
        display: flex;
        align-items: center;
        
        svg {
          cursor: pointer;
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
            font-size: 32px;
            outline: none !important;
            color: white;
        }
    }
</style>