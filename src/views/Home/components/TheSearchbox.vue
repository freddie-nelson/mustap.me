<template>
    <div class="container-searchbox">
        <div class="search-box">
            <svg @click="searched" xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="none">
                <path fill-rule="evenodd" d="M18.406 16.624l6.725 6.725a1.26 1.26 0 0 1-.001 1.783 1.26 1.26 0 0 1-1.783-.001l-6.725-6.725a10 10 0 0 1-13.627-1.295 10 10 0 0 1 .432-13.682 10 10 0 0 1 13.681-.432 10 10 0 0 1 1.296 13.627h.001zM10.5 18a7.5 7.5 0 0 0 7.5-7.5A7.5 7.5 0 0 0 10.5 3 7.5 7.5 0 0 0 3 10.5a7.5 7.5 0 0 0 7.5 7.5z" fill="#fff"/>
            </svg>
            <div class="search-box__seperator"></div>
            <input id="playlist-url" v-model="link" @keyup.enter="searched" type="text" value="" placeholder="Enter your playlist link here">
        </div>
        <div class="search-box__options">
            <div class="search-box__options-input-container">
                <input type="text" v-model="playlistName" id="playlist-name" placeholder="Playlist name...">
            </div>
            <div class="search-box__options-input-container">
                <input type="text" v-model="downloadLimit" id="download-limit" placeholder="Download limit...">
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Searchbox',
    data() {
        return {
            link: '',
            playlistName: '',
            downloadLimit: 0,
        }
    },
    methods: {
        searched() {
            if (!this.link || !this.playlistName || !this.downloadLimit|| isNaN(this.downloadLimit)) {
                return;
            } else {
                this.$emit('searched', [this.link, this.playlistName, this.downloadLimit])
            }
        } 
    }
}
</script>

<style lang="scss">
    .container-searchbox {
        display: flex;
        flex-direction: column;
        margin-top: auto;
    }

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

        #playlist-url {
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

        &__options {
            width: 100%;
            max-width: 500px;
            margin: 35px auto;
            display: flex;
            justify-content: space-between;

            &-input-container {
                position: relative;
                margin: 0 10px;

                // &::after {
                //     content: '';
                //     position: absolute;
                //     display: block;
                //     width: 100%;
                //     height: 2px;
                //     background-color: rgba(255, 255, 255, 0.219);
                //     bottom: 0;
                // }

                // &::after {
                //     content: '';
                //     position: absolute;
                //     display: block;
                //     width: 4px;
                //     height: 100%;
                //     background: linear-gradient(to bottom, #E91E63, #E91EA4);
                //     bottom: 0;
                //     border-radius: 2px;
                //     left: -10px;
                // }

                &::after {
                    content: '';
                    position: absolute;
                    display: block;
                    width: 100%;
                    height: 2px;
                    background: linear-gradient(to right, #E91E63, #E91EA4);
                    opacity: .6;
                    bottom: -3px;
                    border-radius: 2px;
                    left: 0;
                    transition: opacity .3s ease-in;
                }

                &:focus-within {
                    &::after {
                        opacity: 1;
                    }
                }
            }

            input {
                color: white;
                font-weight: 500;
                font-size: 16px;
                background: none;
                border: none;
                width: 150px;
                height: 30px;
                border-radius: 8px;
                outline: none !important;

                &:focus::placeholder {
                    opacity: 0;
                }

                &::placeholder {
                    transition: opacity .4s ease-in;
                    color: rgba(255, 255, 255, 0.185);
                }
            }
        }
    }
</style>