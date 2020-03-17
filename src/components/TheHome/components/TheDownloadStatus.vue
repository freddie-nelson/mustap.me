<template>
  <div class="download-status">
      <div class="download-status__text-container">
          <p id="current-process">Downloading...</p>
          <p id="current-download">Billie Eilish - bad guy</p>
          <p id="download-index">Song 1 of 12 <span>Skip</span></p>
      </div>

      <div class="download-status__progress-bar"><div id="download-progress"></div></div>
      <p id="download-progress-percentage">21%</p>
  </div>
</template>

<script>
export default {
    name: 'DownloadStatus'
}
</script>

<style lang="scss">
    .download-status {
        display: flex;
        flex-direction: column;

        &__text-container {
            color: rgb(207, 207, 207);
            font-size: 24px;
            width: 100%;
            
            #current-process {
                color: white;
            }

            span {
                text-align: right;
                color: #E91EA4;
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
          background-color: #292929;
          border-radius: 4px;
          cursor: pointer;
          margin-top: 20px;

          #download-progress {
            height: 8px;
            border-radius: 4px;
            width: 30%;
            background: linear-gradient(to right, #E91E63, #E91EA4);
            position: relative;
          }
        }

        #download-progress-percentage {
            color: white;
            font-weight: 600;
            font-size: 18px;
            margin-top: 2px;
        }
    }
</style>