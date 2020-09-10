<template>
  <main class="download">
    <Searchbox
      @searched="searched"
      v-if="!searchboxDisplayNone"
      :class="{ download__searchbox: true, hidden: searchboxHidden }"
    />
    <DownloadStatus
      v-if="!downloadDisplayNone"
      :class="{ download__downloadstatus: true, show: downloadShow }"
    />
  </main>
</template>
<script>
import Searchbox from "./components/TheSearchbox";
import DownloadStatus from "./components/TheDownloadStatus";

export default {
  name: "DownloadPlaylist",
  components: {
    Searchbox,
    DownloadStatus
  },
  data() {
    return {
      searchboxHidden: false,
      searchboxDisplayNone: false,
      downloadShow: false,
      downloadDisplayNone: true,
      onDownloadView: false
    };
  },
  methods: {
    searched(arr) {
      this.searchboxHidden = true;

      setTimeout(() => {
        this.searchboxDisplayNone = true;
        this.downloadDisplayNone = false;
      }, 720);

      setTimeout(() => {
        this.downloadShow = true;
        this.onDownloadView = true;
      }, 750);

      this.playlistDownloader(arr);
    },
    back() {
      if (!this.$store.state.currentDownload.currentlyDownloading) {
        this.downloadShow = false;

        setTimeout(() => {
          this.downloadDisplayNone = true;
          this.searchboxDisplayNone = false;
        }, 720);

        setTimeout(() => {
          this.searchboxHidden = false;
          this.onDownloadView = false;
        }, 750);
      }
    }
  },
  mounted() {
    if (this.$store.state.currentDownload.currentlyDownloading) {
      this.searchboxHidden = true;
      this.searchboxDisplayNone = true;
      this.downloadDisplayNone = false;
      this.downloadShow = true;
    }

    try {
      const updatingPlaylist = this.$store.state.playlists.updatingPlaylist;

      if (updatingPlaylist.updatePlaylist) {
        this.playlistDownloader([updatingPlaylist.link, updatingPlaylist.name]);
      }
    } catch {
      // console.log("No playlist to update.");
    }
  }
};
</script>

<style lang="scss">
.download {
  display: flex;
  width: 100%;
  height: 100%;
  position: relative;

  &__searchbox {
    margin: auto;
    max-width: 455px;
    height: 40px;
    opacity: 1;
    display: flex;
    transition: opacity 0.7s ease-in;
  }

  &__downloadstatus {
    width: 100%;
    margin: auto;
    max-width: 500px;
    height: 160px;
    z-index: 2;
    opacity: 0;
    transition: opacity 0.7s ease-in;
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
