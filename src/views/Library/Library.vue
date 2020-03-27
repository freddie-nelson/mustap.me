<template>
  <main class="library">
    <h1>Your Library</h1>
    <h2>Select a playlist</h2>
    <div class="container">
        <DataTable :playlistsProp="playlists" :forPlaylists="true" />
    </div>
  </main>
</template>

<script>
import DataTable from './components/DataTable'

export default {
    name: 'Library',
    components: {
        DataTable
    },
    data() {
        return {
            playlists: [],
        }
    },
    methods: {
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
                            .then(data => playlists.push({ name: file.split('.')[0], data: JSON.parse(data) }))
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
        color: white;
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

        .container {
            height: 80%;
            overflow: hidden;
            margin-top: 40px;
            margin-bottom: 40px;
        }
    }
</style>