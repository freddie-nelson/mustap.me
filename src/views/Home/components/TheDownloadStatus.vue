<template>
  <div class="download-status">
      <div class="download-status__text-container">
          <p id="current-process">{{ currentDownload.currentProcess }}</p>
          <p id="current-download">{{ currentDownload.currentDownloadTitle }}</p>
          <p id="download-index">Song {{ currentDownload.index }} of {{ currentDownload.totalQueueSize }} <span>Skip</span></p>
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
                color: var(--accent-color);
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