<template>
    <div class="searchbox-container">
        <div class="searchbox">
            <svg @click="link.length !== 0 ? showOptionsBox = true : null" xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="none">
                <path fill-rule="evenodd" d="M18.406 16.624l6.725 6.725a1.26 1.26 0 0 1-.001 1.783 1.26 1.26 0 0 1-1.783-.001l-6.725-6.725a10 10 0 0 1-13.627-1.295 10 10 0 0 1 .432-13.682 10 10 0 0 1 13.681-.432 10 10 0 0 1 1.296 13.627h.001zM10.5 18a7.5 7.5 0 0 0 7.5-7.5A7.5 7.5 0 0 0 10.5 3 7.5 7.5 0 0 0 3 10.5a7.5 7.5 0 0 0 7.5 7.5z" fill="#fff"/>
            </svg>
            <div class="searchbox__seperator"></div>
            <input id="playlist-url" v-model="link" @keyup.enter="link.length !== 0 ? showOptionsBox = true : null" type="text" placeholder="Enter your playlist link here">
        </div>
        <div v-if="showOptionsBox" class="searchbox-options">
            <div class="searchbox-options__modal">
                <p>Playlist name:</p>
                <input type="text" name="playlist-name" v-model="playlistName">
                <Button @clicked="playlistName.length !== 0 ? searched() : null" class="button" :filled="false" :text="'Next ➜'" :fontSize="15" />
            </div>
        </div>
    </div>
</template>

<script>
import Button from '@/components/Button.vue'

export default {
    name: 'Searchbox',
    components: {
        Button
    },
    data() {
        return {
            link: '',
            playlistName: '',
            showOptionsBox: false
        }
    },
    methods: {
        searched() {
            this.$emit('searched', [this.link, this.playlistName])

            setTimeout(() => this.showOptionsBox = false, 750)
        } 
    }
}
</script>

<style lang="scss">

    .searchbox-container {
            display: flex;
            flex-direction: column;
            margin-top: auto;
    }
    
    .searchbox {
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
            background: var(--accent-color);
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
    }

    .searchbox-options {
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

        &__modal {
            background: var(--main-bg);
            padding: 20px;
            border-radius: 10px;

            p {
                margin-bottom: 5px;
                opacity: .6;
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

            .button {
                float: right;
                margin-top: 8px;
            }
        }
    }

    @keyframes searchbox-options-anim {
        from {
            opacity: 0;
        }
        
        to {
            opacity: 1;
        }
    }
</style>