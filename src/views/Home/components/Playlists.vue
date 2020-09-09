<template>
  <div class="playlists">
    <div class="playlists__header">
      <h1>Your Library</h1>
    </div>
    <DataTable
      class="playlists__table"
      :formatted-array="array"
      :for-playlists="true"
      :for-theme="true"
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
    }
}
</script>

<style lang="scss">
.playlists {
    background-color: var(--lighter-bg);
    color: var(--primary-text);
    border-radius: 8px;

    ::-webkit-scrollbar-thumb {
        background-color: var(--alert-hover-color);
    }   

    &__header {

        h1 {
            margin: 10px 0 5px 20px;
            font-size: 28px;
            font-weight: 600;
        }
    }

    &__table {
        width: 105% !important;
        padding-right: 12px;
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