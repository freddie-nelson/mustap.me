<template>
  <main class="library">
    <div v-if="deletedSongsModal" class="deleted-songs-modal">
        <div class="modal">
            <p>Please choose what you would like to do with the songs below.</p>
            <div class="modal__list">
                <div>
                    <div 
                        class="modal__list-cell" 
                        v-for="({ song, index }, i) in $store.state.deletedSongs" 
                        :key="i" 
                    >

                        <div class="modal__list-cell-left-text">
                            <div>{{ song.title }}</div>
                            <div>{{ song.artist }}</div>
                        </div>

                        <div class="modal__list-cell-right">
                            <Button @clicked="keepSong(i)" :filled="false" :text="'Keep'" :fontSize="15" />
                            <Button style="margin-left: 20px;" @clicked="deleteSong(index)" :filled="false" :text="'🗑'" :fontSize="15" />
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal__button-container">
                <Button @clicked="() => { deletedSongsModal = false; $refs.dataTable.addClasses() }" class="button" :filled="true" :text="'Done'" :fontSize="16" />
            </div>
        </div>
    </div>

    <header ref="libraryHeader">
        <h1>{{ mainTitle }}</h1>
        <h2>{{ subTitle }}</h2>
        <div style="margin: 10px 0 0 60px;">
            <Button v-if="this.$store.state.missingSongsCount > 0 && !this.forPlaylists" style="margin-right: 20px;" @clicked="updatePlaylist" :text="`🛈 ${ this.$store.state.missingSongsCount } missing songs - Click to download`" :filled="false" :fontSize="16" />
            <Button 
                v-if="this.$store.state.deletedSongsCount > 0 && !this.forPlaylists"
                style="text-align: left !important;" 
                @clicked="deletedSongsModal = true" 
                :text="`🛈 ${ this.$store.state.deletedSongsCount } songs have been found that have been previously deleted - Click to view`" 
                :filled="false" 
                :fontSize="16" 
            />
        </div>
    </header>  
    <section 
        class="library__main-container" 
        :style="{ height: `calc(100% - ${ this.calcHeight() }px)` }"
    >
        <div class="container">
            <DataTable ref="dataTable" @for-playlists-changed="forPlaylists = $event" @back="changeTitles" @clicked-playlist="changeTitles" @deleted-song="changeTitles($event)" :playlistsProp="this.$store.state.playlists" />
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
            forPlaylists: true,
            deletedSongsModal: false
        }
    },
    methods: {
        calcHeight() {
            return this.$refs.libraryHeader ? this.$refs.libraryHeader.clientHeight : 200;
        },
        keepSong(i) {
            this.$store.state.deletedSongs = this.$store.state.deletedSongs.filter((song, index) => index !== i)
            this.$store.state.deletedSongsCount--;

            const fs = require('fs');
            const playlist = this.$store.state.playlists[this.$store.state.currentPlaylistViewing]; 
            const deletedPlaylistPath = this.$store.state.documentsPath + '/mustap/playlists/' + playlist.name + '__deleted__.json';

            fs.writeFileSync(deletedPlaylistPath, this.$store.state.deletedSongs || []);
            
        },
        deleteSong(i) {
            this.$refs.dataTable.deleteSong(i + 1, true);
        },
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

            const songsPath = this.$store.state.documentsPath + '/mustap/songs/';
            
            const state = this.$store.state;
            const playlist = state.playlistsFiltered[state.currentPlaylistViewing];
            const playlistData = playlist.data;
            const playlists = state.playlistsFiltered.filter(obj => obj.name !== playlist.name)

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

            const playlistPath = this.$store.state.documentsPath + '/mustap/playlists/' + playlist.name + '.json';
            const deletedPlaylistPath = this.$store.state.documentsPath + '/mustap/playlists/' + playlist.name + '__deleted__.json';

            if (fs.existsSync(deletedPlaylistPath)) {
                await fs.promises.unlink(deletedPlaylistPath)
                    .then(e => console.log(e))
                    .catch(e => console.log(e));
            }

            await fs.promises.unlink(playlistPath)
                .then(e => {
                    console.log(e);
                    this.$refs.dataTable.back()
                    this.getPlaylists()
                })
                .catch(e => console.log(e));
        },
        changeTitles(refresh) {
            setTimeout(() => {
                if (this.mainTitle == 'Your Library' || refresh) {
                    this.mainTitle = 'Currently Viewing'
                    const currentPlaylist = this.$store.state.playlistsFiltered[this.$store.state.currentPlaylistViewing];
                    this.subTitle = `${currentPlaylist.name} - ${currentPlaylist.data.length} tracks`
                } else {
                    this.mainTitle = 'Your Library';
                    this.subTitle = 'Select a playlist';
                }
            }, 100)
        },
        async getPlaylists() {
            this.$store.state.deleteClickedIndex = -1;
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
            this.$store.state.playlistsFiltered = playlists.filter(playlist => playlist.name.indexOf('__deleted__') === -1)
            console.log(this.$store.state.playlistsFiltered)
            
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
            height: calc(100% - 200px);
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

    .deleted-songs-modal {
        width: 100%;
        height: 100%;
        position: absolute;
        background: rgba(0, 0, 0, .7);
        z-index: 10;
        display: flex;
        justify-content: center;
        align-items: center;

        .modal {
            background-color: var(--main-bg);
            padding: 20px;
            border-radius: 10px;

            p {
                margin-bottom: 5px;
                opacity: .7;
                color: var(--primary-text);
            }

            &__list {
                width: 100%;
                background: var(--lighter-bg);
                border-radius: 6px;
                margin: 15px 0;
                padding: 10px;
                max-height: 350px;

                &-cell {
                    width: 100%;
                    padding: 4px 8px;
                    display: flex;
                    align-items: center;
                    border-radius: 5px;
                    transition: background-color .3s ease-in;
                    margin-top: 5px;
                    justify-content: space-between;

                    &:first-of-type {
                        margin-top: 0px;
                    }

                    &:hover {
                        background-color: rgba(255, 255, 255, 0.1);
                    }

                    &-left-text {
                        width: 100%;
                        color: var(--secondary-text);
                        font-size: 14px;
                        max-width: 60%;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;

                        div:first-of-type {
                            color: var(--primary-text);
                            font-weight: 500;
                            font-size: 16px;
                        }

                    }

                }
            }

            &__button-container {
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: flex-end;
                margin-top: 10px;

                div:first-of-type {
                    margin-right: 15px;
                }
            }

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