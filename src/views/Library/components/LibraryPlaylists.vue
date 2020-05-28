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


export default {
  name: "LibraryPlaylists",
  mixins: [getPlaylists],
  components: {
    DataTable
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
  mounted() {
    if (this.$route.query.toHome) {
      this.$route.query.toHome = null;
      this.$router.push({ name: "Home" })
    }
  }
};
</script>

<style></style>
