<template>
  <div class="table" id="table" ref="table" :class="{ forPlaylists: forPlaylists }">
    <DataTableCell
      v-for="(data, index) in array"
      :data="data"
      :key="index"
      @clicked="$emit('clicked-cell', $event)"
      @deleteSong="$emit('delete-song', $event)"
      @loaded-cells="$emit('loaded-cells')"
      :index="index + 1"
      :forPlaylists="forPlaylists"
    />
    <backBtn style="left: 16px" v-if="!this.forPlaylists" @back="back" />
  </div>
</template>

<script>
import DataTableCell from "./DataTableCell";
import BackBtn from "../../../components/BackBtn";

export default {
  name: "DataTable",
  components: {
    DataTableCell,
    BackBtn
  },
  props: {
    array: Array,
    forPlaylists: Boolean
  },
  methods: {
    back() {
      if (this.forPlaylists) {
        return;
      } else {
        // set the currentPlaylistViewing back to -1 so that other components know that we don't have a playlist open anymore
        this.$store.dispatch("setPlaylistsProp", {
          prop: "currentPlaylistViewing",
          data: -1
        });

        // get all the dataTableCell elements
        const children = this.$refs.table.children;

        // remove all their extra classes so they don't appear on the playlists view
        for (let i = 0; i < children.length; i++) {
          const element = children[i];

          if (element.classList.contains("missing")) {
            element.classList.remove("missing");
          }

          if (element.classList.contains("deleted")) {
            element.classList.remove("deleted");
          }

          if (element.classList.contains("clicked")) {
            element.classList.remove("clicked");
          }
        }

        this.$router.push({ name: "Library" });

        // set deleteClickedIndex back to -1 so that the cell we clicked on can be clicked again
        this.$store.dispatch("resetDeleteClickedIndex");
      }
    }
  }
};
</script>

<style lang="scss">
::-webkit-scrollbar {
  background: transparent;
  width: 12px;
}

::-webkit-scrollbar-thumb {
  background: var(--lighter-bg);
  border-radius: 20px;
}

::-webkit-scrollbar-corner {
  display: none;
}

.table {
  width: 100%;
  height: 100%;
  overflow: scroll;
  padding-right: 8px;
  overflow-x: hidden;
}
</style>
