<template>
  <div
    :id="tableId"
    ref="table"
    :class="{ forPlaylists: forPlaylists, table: forPlaylists }"
    style="height: 100%; position: relative;"
  >
    <draggable
      v-if="!forPlaylists"
      :id="draggableTableId"
      class="table"
      v-model="playlist"
      @change="$emit('drag-end', $event)"
    >
      <DataTableCell
        v-for="(data, index) in $store.state.playlists.formattedPlaylist"
        :data="data"
        :key="index"
        @clicked="$emit('clicked-cell', $event)"
        @deleteSong="$emit('delete-song', $event)"
        @loaded-cells="$emit('loaded-cells')"
        :index="index + 1"
        :for-playlists="forPlaylists"
      />
    </draggable>
    <DataTableCell
      v-else
      v-for="(data, index) in array"
      :data="data"
      :key="index"
      @clicked="$emit('clicked-cell', $event)"
      @deleteSong="$emit('delete-song', $event)"
      @loaded-cells="$emit('loaded-cells')"
      :index="index + 1"
      :for-playlists="forPlaylists"
    />
  </div>
</template>

<script>
import DataTableCell from "./DataTableCell";
import draggable from "vuedraggable";

export default {
  name: "DataTable",
  components: {
    DataTableCell,
    draggable
  },
  data() {
    return {
      array: [],
      tableId: this.forPlaylists ? "table" : false,
      draggableTableId: !this.forPlaylists ? "table" : false
    };
  },
  computed: {
    playlist: {
      get() {
        return this.$store.state.playlists.formattedPlaylist;
      },
      set(value) {
        this.$store.dispatch("setPlaylistsProp", { prop: "formattedPlaylist", data: value });
      }
    }
  },
  props: {
    formattedArray: Array,
    forPlaylists: Boolean
  },
  watch: {
    formattedArray() {
      this.array = [...this.formattedArray];
    }
  },
  mounted() {
    if (this.formattedArray) {
      this.array = [...this.formattedArray];
    }
  },
  beforeDestroy() {
    this.formattedArray.length = 0;
    this.array.length = 0;
    this.$store.state.playlists.formattedPlaylist.length = 0;
  }
};
</script>

<style lang="scss">
::-webkit-scrollbar {
  background: transparent;
  width: 12px;
}

::-webkit-scrollbar-thumb {
  background-color: var(--lighter-bg);
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
