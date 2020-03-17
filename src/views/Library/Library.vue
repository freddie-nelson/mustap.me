<template>
  <main class="library">
    <h1>Your Library</h1>
    <h2>Select a playlist</h2>
    <div class="container">
        <DataTable :playlists="playlists" :playlistNames="playlistNames" :forPlaylists="true" />
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
            playlistNames: []
        }
    },
    methods: {
        async getPlaylists() {
            const fs = require('fs');
            const { remote } = require('electron');

            const documents = remote.app.getPath('documents');
            const playlistsLocation = documents + '/mustap/playlists';

            let playlists = [];
            let playlistNames = [];

            await fs.promises.readdir(playlistsLocation)
                .then(arr => {
                    arr.forEach(async file => {
                        fs.promises.readFile(playlistsLocation + '/' + file)
                            .then(data => playlists.push(JSON.parse(data)))
                            .catch(err => window.console.log(err));
                    });

                    playlistNames = arr.map(name => name.split('.')[0]);
                })
                .catch(err => window.console.log(err))

            window.console.log(playlists, playlistNames)

            this.playlists = playlists;
            this.playlistNames = playlistNames;
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
    }
</style>