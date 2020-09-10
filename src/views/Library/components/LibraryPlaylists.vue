<template>
  <DataTable
    ref="dataTable"
    :formatted-array="array"
    :for-playlists="true"
    @clicked-cell="clickedCell($event)"
  />
</template>

<script>
import DataTable from "./DataTable";
import getPlaylists from "@/mixins/getPlaylists";
import downloadPlaylist from "@/mixins/downloadPlaylist/downloadPlaylist";

export default {
  name: "LibraryPlaylists",
  mixins: [getPlaylists, downloadPlaylist],
  components: {
    DataTable
  },
  watch: {
    downloadPlaylistBool() {
      if (this.downloadPlaylistBool) {
        this.playlistDownloader([ this.$store.state.currentDownload.playlistLink, this.$store.state.currentDownload.playlistName ])
      }

      this.getPlaylists().then(() => {
        this.formatDataPlaylists()
      })
    }
  },
  computed: {
    downloadPlaylistBool() {
      return this.$store.state.currentDownload.downloadNow
    }
  },
  methods: {
    clickedCell(index) {
      const i = index - 1;

      this.$store.dispatch("setProp", { prop: "missingSongsCount", data: 0 });
      this.$store.dispatch("setProp", { prop: "deletedSongsCount", data: 0 });
      this.$store.dispatch("setProp", { prop: "deletedSongs", data: [] });

      this.$route.params.playlistName = this.$store.state.playlists.playlists[i].name;
      this.$store.dispatch("setPlaylistsProp", { prop: "currentPlaylistViewing", data: i });
      this.$router.push({ name: "LibraryPlaylist" });
    }
  },
  beforeMount() {
    if (this.$route.query.goto) {
      this.$router.replace({ name: this.$route.query.goto })
      this.$route.query.goto = null;
    }
  }
};
</script>

<style></style>
