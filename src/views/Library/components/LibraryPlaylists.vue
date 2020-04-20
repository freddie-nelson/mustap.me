<template>
  <DataTable ref="dataTable" :formattedArray="array" :forPlaylists="true" @clicked-cell="clickedCell($event)" />
</template>

<script>
import DataTable from "./DataTable";

export default {
  name: "LibraryPlaylists",
  components: {
    DataTable
  },
  data() {
    return {
      array: [],
      playlists: [],
      playlistNames: [],
      datesAdded: []
    };
  },
  methods: {
    formatDataPlaylists() {
      this.playlists = this.$store.getters.playlistsData;
      this.playlistNames = this.$store.getters.playlistNames;
      this.datesAdded = this.$store.getters.playlistDatesAdded;

      this.array = this.playlists.map((playlist, index) => {
        return {
          leftTop: this.playlistNames[index],
          leftBottom: this.datesAdded[index],
          rightTop: this.playlists[index].length + " Songs"
        };
      });
    },
    clickedCell(index) {
      const i = index - 1;

      this.$route.params.playlistName = this.$store.state.playlists.playlists[i].name;
      this.$store.dispatch("setPlaylistsProp", { prop: "currentPlaylistViewing", data: i });
      this.$router.push({ name: "LibraryPlaylist" });
    }
  },
  mounted() {
    setTimeout(this.formatDataPlaylists, 100);
    setTimeout(() => {
      if (this.$store.state.playlists.currentPlaylist !== -1 && this.$store.state.playlists.playlists !== []) {
        this.$store.getters.playlistNames.forEach((name, i) => {
          name === this.$store.state.playlists.currentPlaylistName
            ? this.$store.dispatch("setPlaylistsProp", {
                prop: "currentPlaylist",
                data: i
              })
            : null;
        });
      }
    }, 100);
  }
};
</script>

<style></style>
