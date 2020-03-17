<template>
  <main class="home">
      <Searchbox @searched="searched" :class="{ home__searchbox: true, hidden: searchboxHidden, displaynone: searchboxDisplayNone }" />
      <DownloadStatus :class="{ home__downloadstatus: true,  show: downloadShow, displaynone: downloadDisplayNone }" />
      <button @click="back" class="home__back-btn">
        Back <span>&#8250;</span>
      </button>
  </main>
</template>

<script>
import Searchbox from './components/TheSearchbox'
import DownloadStatus from './components/TheDownloadStatus'

export default {
  name: 'Home',
  components: {
    Searchbox,
    DownloadStatus
  },
  data() {
    return {
      searchboxHidden: false,
      searchboxDisplayNone: false,
      downloadShow: false,
      downloadDisplayNone: true
    }
  },
  methods: {
    searched(value) {
      this.searchboxHidden = true;

      setTimeout(() => {
        this.searchboxDisplayNone = true;
        this.downloadDisplayNone = false;
      }, 720)

      setTimeout(() => this.downloadShow = true, 750)

      this.playlistDownloader(value)
    },
    back() {
      if (!this.$store.state.currentDownload.currentlyDownloading) {
        this.downloadShow = false;

      setTimeout(() => {
        this.downloadDisplayNone = true;
        this.searchboxDisplayNone = false;
      }, 720)

      setTimeout(() => this.searchboxHidden = false, 750)
      }
    },
    playlistDownloader(url) {

        let currentDownload = this.$store.state.currentDownload;

        if (url === '') {
          currentDownload.currentProcess = 'Please enter a playlist link.'
          return;
        }

        window.console.log()

        /* dependencies */
        const fs = require('fs');
        const util = require('util')
        const ytdl = require('ytdl-core');
        const ytpl = require('ytpl');
        const progress = require('progress-stream');
        const readdir = util.promisify(fs.readdir);
        const { remote } = require('electron');

        window.console.log(remote);

        /* environment variables */
        const documentsPath = remote.app.getPath('documents')
        const songsPath = documentsPath + '/mustap/songs/';
        window.console.log(documentsPath);

        let playlist = [];

        // Get playlist metadata
        ytpl(url, {
            limit: 0
        })
            .then(async res => {
                console.log('Fetching metadata...')
                currentDownload.currentProcess = 'Fetching metadata...';
                playlist = await Promise.all(res.items /* await is used so that we don't move on until all songs metadata has been found*/
                    .map((song, i) => { /* map is the best way to do this as it allows us to take in all the songs from the playlist, change them, and put them back in all in one*/
                        const info = ytdl.getBasicInfo(song.url)
                            .then(res => {
                                let details = res.player_response.videoDetails;

                                /* Take the data we want and format it nicely */
                                return {
                                    videoId: res.video_id,
                                    url: res.video_url,
                                    title: res.title,
                                    filename: details.title.replace(/[/\\?%*:|"<>]/g, '') + '.mp3',
                                    artist: res.author.name,
                                    datePublished: res.published,
                                    thumbnailUrl: details.thumbnail.thumbnails.pop().url,
                                    duration: details.lengthSeconds,
                                    views: details.viewCount,
                                    likes: res.likes,
                                    dislikes: res.dislikes,
                                }
                            })
                            .catch(err => console.log(`An error occured: The song at position ${i} of the playlist could not be found.`, err));

                        return info; /* add the formatted data to the plalist array */
                    }));

                playlist = playlist.filter(obj => obj !== undefined); /* get rid of any songs that weren't found*/
                window.console.log(playlist)
                
                // console.log(playlist);
                console.log('Fetched all metadata.')
                currentDownload.currentProcess = 'Fetched all metadata.';
            })
            .then(async () => {

                currentDownload.currentProcess = 'Saving metadata in documents...';

                /* saving playlist to documents as json file */
                const jsonPlaylist = JSON.stringify(playlist);
                await fs.promises.mkdir(documentsPath + '/mustap/playlists/', { recursive: true })
                    .then(async () => {
                        await fs.promises.writeFile(documentsPath + '/mustap/playlists/playlist.json', jsonPlaylist)
                    })
                    .catch(err => console.log(err));
                  
                currentDownload.currentProcess = 'Saved metadata to documents.';
                currentDownload.currentProcess = 'Creating songs save location...'

                await fs.promises.mkdir(songsPath, { recursive: true })
                    .catch(err => console.log(err));

                currentDownload.currentProcess = 'Created songs save location.'

                console.log('Removing all previously installed songs...');
                currentDownload.currentProcess = 'Removing all previously installed songs...';

                let files = await readdir(songsPath)
                    .catch(err => console.log(err));

                if (!files) {
                  console.log('No songs to remove.')
                } else {
                    for (let i = playlist.length - 1; i >= 0; i--) {
                      if (playlist[i] === undefined) {
                          break
                      }

                      const songFilename = playlist[i].filename;

                      for (let index = 0; index < files.length; index++) {
                          const file = files[index];

                          if (file === songFilename) {
                              playlist.splice(i, 1);
                          }
                      }
                  }

                  console.log('All previously installed songs removed from download queue.');
                  currentDownload.currentProcess = 'All previously installed songs removed from download queue.';
                }

                if (playlist === []) {
                    console.log('You already have all these songs downloaded.')
                    currentDownload.currentProcess = 'You already have all these songs downloaded.';
                } else {
                    /* start downloading the songs */
                    console.log('Starting download...');
                    currentDownload.currentProcess = 'Starting download...';
                    currentDownload.totalQueueSize = playlist.length;
                    downloadSongs(0, 0);
                }
            })
            .catch(err => {
                console.log('An error has occured --- ' + err)
                currentDownload.currentProcess = err;
            });

        async function downloadSongs(i, tries) {
            const index = i;
            const songInfo = playlist[index];

            /* check if the playlist is finished downloading*/
            if (index > playlist.length - 1) {
                console.log('----- Finished downloading all songs. -----');
                currentDownload.currentProcess = 'Finished downloading all songs.';
                currentDownload.currentlyDownloading = false;
                return;
            }

            currentDownload.currentlyDownloading = true;
            currentDownload.currentDownloadTitle = songInfo.title;
            currentDownload.index = i + 1;
            currentDownload.currentProcess = 'Downloading...'

            if (tries === 2) {
                console.log(`Sorry the download of ${songInfo.title} has been attempted 3 times and has failed. This song cannot be downloaded.`)
                currentDownload.currentProcess = 'Sorry this song cannot be downloaded.'
                downloadSongs(i + 1, 0)
            }

            /* calculate the progress on the download */
            let str = progress({
                length: songInfo.duration * 127000,
                time: 100 /* ms */
            });

            str.on('progress', progress => {
                currentDownload.progress = Math.round(progress.percentage);
            });
            /* calculate the progress on the download */

            ytdl(songInfo.url, { quality: 'highestaudio', filter: 'audioonly' })
                .on('error', err => {
                    console.log(' Failed to download. Retrying...', err)
                    currentDownload.currentProcess = 'Failed to download. Retrying...';
                    downloadSongs(index, tries + 1)
                })
                .pipe(str)
                .pipe(fs.createWriteStream(songsPath + songInfo.filename)
                    .on('close', () => { /* once the song is finished downloading call the function again for the next song in the array*/
                        downloadSongs(index + 1, 0)
                    }));

      }
    }
  }
}
</script>

<style lang="scss">
  .home {
    display: flex;
    width: 100%;
    height: 100%;

    &__searchbox {
      margin: auto;
      width: 100%;
      max-width: 500px;
      height: 50px;
      opacity: 1;
      display: flex;
      transition: opacity .7s ease-in;
    }

    &__downloadstatus {
      width: 100%;
      margin: auto;
      max-width: 500px;
      height: 160px;
      z-index: 2;
      opacity: 0;
      transition: opacity .7s ease-in;
    }

    &__back-btn {
      position: absolute;
      background: transparent;
      border: none;
      color: rgba(255, 255, 255, 0.253);
      font-size: 18px;
      font-weight: 500;
      bottom: 3px;
      right: 10px;
      cursor: pointer;
      transition: color .4s ease-in;
      outline: none !important;

      &:hover {
        color: white;
      }
    }
  }

  .hidden {
    opacity: 0 !important;
  }

  .show {
    opacity: 1 !important;
  }

  .displaynone {
    display: none !important;
  }
</style>