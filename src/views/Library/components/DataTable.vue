<template>
  <div
    :id="tableId"
    ref="table"
    :class="{ forPlaylists: forPlaylists, table: forPlaylists }"
    style="height: 100%;"
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
    <BackBtn
      v-if="!this.forPlaylists"
      @back="back"
    />
  </div>
</template>

<script>
import DataTableCell from "./DataTableCell";
import BackBtn from "../../../components/BackBtn";
import draggable from "vuedraggable";

export default {
  name: "DataTable",
  components: {
    DataTableCell,
    BackBtn,
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
  methods: {
    back() {
      if (this.forPlaylists) {
        return;
      } else {
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
      }
    }
  },
  mounted() {
    if (this.formattedArray) {
      this.array = [...this.formattedArray];
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
