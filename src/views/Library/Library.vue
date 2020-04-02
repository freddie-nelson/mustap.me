<template>
  <main class="library">
    <h1>{{ mainTitle }}</h1>
    <h2>{{ subTitle }}</h2>
    <section class="library__main-container">
        <div class="container">
            <DataTable @back="changeTitles" @clicked-playlist="changeTitles" :playlistsProp="playlists" :forPlaylists="true" />
        </div>
        <CurrentPlaying />
    </section>
  </main>
</template>

<script>
import DataTable from './components/DataTable'
import CurrentPlaying from './components/CurrentPlaying'

export default {
    name: 'Library',
    components: {
        DataTable,
        CurrentPlaying
    },
    data() {
        return {
            playlists: [],
            mainTitle: 'Your Library',
            subTitle: 'Select a playlist'
        }
    },
    methods: {
        changeTitles() {
            setTimeout(() => {
                if (this.mainTitle == 'Your Library') {
                    this.mainTitle = 'Currently Playing From'
                    const currentPlaylist = this.$store.state.playlists[this.$store.state.currentPlaylist];
                    this.subTitle = `${currentPlaylist.name} - ${currentPlaylist.data.length} tracks`
                } else {
                    this.mainTitle = 'Your Library';
                    this.subTitle = 'Select a playlist';
                }
            }, 100)
        },
        async getPlaylists() {
            const fs = require('fs');
            const { remote } = require('electron');

            const documents = remote.app.getPath('documents');
            const playlistsLocation = documents + '/mustap/playlists';

            let playlists = [];

            await fs.promises.readdir(playlistsLocation)
                .then(arr => {
                    arr.forEach(async file => {
                        fs.promises.readFile(playlistsLocation + '/' + file)
                            .then(data => {
                                const date = new Date(fs.statSync(playlistsLocation + '/' + file).mtimeMs);
                                const day = ("0" + date.getDate()).slice(-2);
                                const month = ("0" + (date.getMonth() + 1)).slice(-2);
                                const year = date.getFullYear();
                                playlists.push({ name: file.split('.')[0], data: JSON.parse(data), added: `${day}/${month}/${year}` })
                            })
                            .catch(err => window.console.log(err));
                    });
                })
                .catch(err => window.console.log(err))

            window.console.log(playlists,)

            this.playlists = playlists;

            this.$store.state.playlists = this.playlists;
        }
    },
    mounted() {
        this.getPlaylists()
    }
}
</script>

<style lang="scss">
    .library {
        display: flex;
        width: 100%;
        height: 100%;
        color: var(--primary-text);
        flex-direction: column;
        overflow-y: hidden;

        h1 {
            font-size: 36px;
            margin: 60px 0 5px 60px;
            font-weight: 600;
        }

        h2 {
            font-size: 28px;
            font-weight: 500;
            margin-left: 60px
        }

        &__main-container {
            display: flex;
            flex-direction: row;
            height: calc(100% - 162px);
            padding: 40px 60px;
        }

        .container {
            height: 100%;
            width: 680px;
            min-width: 600px;
            overflow: hidden;
        }
    }
</style>