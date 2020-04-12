<template>
  <div class="download-status">
      <div class="download-status__text-container">
          <p id="current-process">{{ currentDownload.currentProcess }}</p>
          <p id="current-download">{{ currentDownload.currentDownloadTitle }}</p>
          <p id="download-index">Song {{ currentDownload.index }} of {{ currentDownload.totalQueueSize }} <span @click="skip">Skip</span></p>
      </div>

      <div class="download-status__progress-bar"><div :style="{ width: currentDownload.progress + '%', maxWidth: '100%' }" id="download-progress"></div></div>
      <p id="download-progress-percentage">{{ currentDownload.progress }}%</p>
  </div>
</template>

<script>
export default {
    name: 'DownloadStatus',
    data() {
        return {
            currentDownload: this.$store.state.currentDownload,
        }
    },
    methods: {
        skip() {
            const currentDownload = this.$store.state.currentDownload;

            if (currentDownload.stream === null) { return }
            
            
            currentDownload.stream.destroy();

            const fs = require('fs');
            const path = currentDownload.path;

            if (fs.existsSync(path)) {
                fs.promises.unlink(path)
                    .then(() => console.log(`deleted song`))
                    .catch(err => console.log(`failed to delete ${ path }. Error: ${ err }`))
            }

            const playlistPath = currentDownload.playlistPath;
            let playlist = JSON.parse(fs.readFileSync(playlistPath));

            let i;
            
            playlist.forEach((song, index) => {
                if (song.title === currentDownload.currentDownloadTitle) {
                    i = index;
                }
            });

            playlist = playlist.filter((song) => song.title !== playlist[i].title);
            
            if (playlist) {
                fs.promises.writeFile(playlistPath, JSON.stringify(playlist))
                    .then(() => console.log('done'))
                    .catch(err => console.log(err));
            } else {
                fs.promises.unlink(playlistPath)
                    .then(() => console.log('done'))
                    .catch(err => console.log(err));
            }
            
        }
    }
}
</script>

<style lang="scss">
    .download-status {
        display: flex;
        flex-direction: column;

        &__text-container {
            color: var(--secondary-text);
            font-size: 24px;
            width: 100%;
            
            #current-process {
                color: var(--primary-text);
            }

            span {
                text-align: right;
                color: var(--accent-color-secondary);
                cursor: pointer;
                transition: color .3s ease-in;

                &:hover {
                    color: var(--accent-color);
                }
            }
            
            #download-index {
                display: flex;
                justify-content: space-between;
            }
        }

        &__progress-bar {
          width: 100%;
          max-width: 500px;
          height: 8px;
          background-color: var(--lighter-bg);
          border-radius: 4px;
          cursor: pointer;
          margin-top: 20px;

          #download-progress {
            height: 8px;
            border-radius: 4px;
            width: 1%;
            background: var(--accent-color);
            position: relative;
            transition: width .2s ease-out;
          }
        }

        #download-progress-percentage {
            color: var(--primary-text);
            font-weight: 600;
            font-size: 18px;
            margin-top: 2px;
        }
    }
</style>