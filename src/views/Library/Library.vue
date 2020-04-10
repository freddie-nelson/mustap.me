<template>
  <main class="library">
    <h1>{{ mainTitle }}</h1>
    <h2>{{ subTitle }} 
        <Button v-if="this.$store.state.missingSongsCount > 0 && !this.forPlaylists" style="margin-left: 20px;" @clicked="updatePlaylist" :text="`🛈 ${ this.$store.state.missingSongsCount } missing songs - Click to download`" :filled="false" :fontSize="16" />
    </h2>
    <section class="library__main-container">
        <div class="container">
            <DataTable ref="dataTable" @for-playlists-changed="forPlaylists = $event" @back="changeTitles" @clicked-playlist="changeTitles" :playlistsProp="this.$store.state.playlists" />
        </div>
        <CurrentPlaying @update-playlist="updatePlaylist" @delete-playlist="deletePlaylist" class="library__current-playing" :forPlaylists="forPlaylists" />
    </section>
  </main>
</template>

<script>
import DataTable from './components/DataTable'
import CurrentPlaying from './components/CurrentPlaying'
import Button from '@/components/Button'

export default {
    name: 'Library',
    components: {
        DataTable,
        CurrentPlaying,
        Button
    },
    data() {
        return {
            mainTitle: 'Your Library',
            subTitle: 'Select a playlist',
            forPlaylists: true
        }
    },
    methods: {
        updatePlaylist() {
            console.log(this.forPlaylists)
            if (!this.forPlaylists) {
                const currentPlaylist = this.$store.state.playlists[this.$store.state.currentPlaylistViewing]
                const updatingPlaylist = this.$store.state.updatingPlaylist;

                updatingPlaylist.updatePlaylist = true;
                updatingPlaylist.name = currentPlaylist.name;
                updatingPlaylist.link = currentPlaylist.data[0].playlistLink;

                this.$store.state.currentDownload.currentlyDownloading = true;

                this.$router.push({ name: 'Home' })
            }
        },
        async deletePlaylist() {
            const fs = require('fs');
            const { remote } = require('electron');

            const songsPath = remote.app.getPath('documents') + '/mustap/songs/';
            
            const state = this.$store.state;
            const playlist = state.playlists[state.currentPlaylistViewing];
            const playlistData = playlist.data;
            const playlists = state.playlists.filter(obj => obj.name !== playlist.name)

            console.log('Playlists: ', playlists)

            const filenames = playlistData.map(obj => songsPath + obj.filename);

            const filenamesFiltered = filenames.filter(file => {

                for (let i = 0; i < playlists.length; i++) {
                    let otherFilenames = playlists[i].data;

                    otherFilenames = otherFilenames.map(obj => songsPath + obj.filename)

                    let foundMatch = false;

                    for (let j = 0; j < otherFilenames.length; j++) {
                        const otherFile = otherFilenames[j];

                        if (file === otherFile) {
                            foundMatch = true;
                        }
                    }
                    
                    if (!foundMatch) {
                        return file;
                    }
                }

            });

            filenamesFiltered.forEach(async file => {
                    fs.promises.unlink(file)
                        .then(e => {
                            console.log(e);
                        })
                        .catch(e => console.log(e))
                });

            const playlistPath = remote.app.getPath('documents') + '/mustap/playlists/' + playlist.name + '.json';

            await fs.promises.unlink(playlistPath)
                .then(e => {
                    console.log(e);
                    this.$refs.dataTable.back()
                    this.getPlaylists()
                })
                .catch(e => console.log(e));
        },
        changeTitles() {
            setTimeout(() => {
                if (this.mainTitle == 'Your Library') {
                    this.mainTitle = 'Currently Viewing'
                    const currentPlaylist = this.$store.state.playlists[this.$store.state.currentPlaylistViewing];
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
                    console.log(arr);
                    readFile(0);
                    function readFile(i) {
                        if (!arr[i]) {
                            return
                        }

                        const file = arr[i];

                        fs.promises.readFile(playlistsLocation + '/' + file)
                        .then(data => {
                            const date = new Date(fs.statSync(playlistsLocation + '/' + file).mtimeMs);
                            const day = ("0" + date.getDate()).slice(-2);
                            const month = ("0" + (date.getMonth() + 1)).slice(-2);
                            const year = date.getFullYear();
                            playlists.push({ name: file.split('.')[0], data: JSON.parse(data), added: `${day}/${month}/${year}` })
                            readFile(i + 1);
                        })
                        .catch(err => window.console.log(err));
                    }
                })
                .catch(err => window.console.log(err))
            
            this.$store.state.playlists = playlists;
            
            setTimeout(() => this.$refs.dataTable.formatDataPlaylists(), 100)
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
        width: calc(100vw - 300px);
        position: relative;

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
            width: 50%;
            overflow: hidden;
        }

        .current-playing-details-container {
            width: calc(50% - 50px);
        }
    }

    @media screen and (max-width: 1310px) {
        .library {

            &__current-playing {
                display: none;
            }

            .container {
                min-width: 240px;
                width: 100%;
            }
        }
    } 
</style>