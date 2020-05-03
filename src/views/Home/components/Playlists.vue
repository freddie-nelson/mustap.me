<template>
  <div class="playlists">
    <div class="playlists__header">
      <h1>Your Library</h1>
    </div>
    <DataTable
      class="playlists__table"
      :formatted-array="array"
      :for-playlists="true"
      @clicked-cell="clickedCell($event)"
    />
  </div>
</template>

<script>
import getPlaylists from "@/mixins/getPlaylists";
import DataTable from "../../Library/components/DataTable";

export default {
    name: "Playlists",
    mixins: [getPlaylists],  
    components: {
        DataTable
    },
    data() {
        return {
            array: []
        }
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
        }
    }, 
    mounted() {
        this.getPlaylists();
        this.formatDataPlaylists();
    }
}
</script>

<style lang="scss">
.playlists {
    background-color: var(--lighter-bg);
    color: var(--primary-text);
    border-radius: 12px;

    &__header {

        h1 {
            margin: 10px 0 0 20px;
            font-size: 28px;
            font-weight: 600;
        }
    }

    &__table {
        width: 105% !important;
        margin-left: -8px;
        height: calc(100% - 60px) !important;
        transform: scale(.9);
        margin-top: -5px;

        .cell {
            margin-left: 6px;
            background-color: var(--light-bg);

            &:hover {
                background-color: var(--alert-hover-color) !important;
            }
        }
    }
}
</style>