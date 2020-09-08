<template>
  <div
    :id="tableId"
    ref="table"
    :class="{ forPlaylists: forPlaylists, table: forPlaylists }"
    style="height: 100%;"
  >
    <transition name="fade">
      <AddSongModal
        v-if="showAddSongModal"
        @close="showAddSongModal = false"
      />
    </transition>
    <transition name="fade">
      <AddPlaylistModal
        v-if="showAddPlaylistModal"
        @close="showAddPlaylistModal = false"
      />
    </transition>
    <div
      v-if="!forPlaylists"
      class="table"
    >
      <draggable
        :id="draggableTableId"
        v-model="playlist"
        @change="$emit('drag-end', $event)"
      >
        <DataTableCell
          v-for="(data, index) in $store.state.playlists.formattedPlaylist"
          :data="data"
          :key="index"
          @clicked="$emit('clicked-cell', $event)"
          @deleteSong="$emit('delete-song', $event)"
          @loaded-cells="addCells"
          :index="index + 1"
          :for-playlists="forPlaylists"
          :show="visibles[index]"
        />
      </draggable>
      <div
        class="table-add-cell"
        @click="showAddSongModal = true"
      >
        <v-icon name="plus" />
      </div>
    <!-- <div
        class="table-add-cell"
        slot="header"
        v-if="playlist.length > 50"
      >
        <v-icon name="plus" />
      </div> -->
    </div>
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
    <div
      class="table-add-cell"
      v-if="forPlaylists && !forTheme"
      @click="showAddPlaylistModal = true"
    >
      <v-icon name="plus" />
    </div>
  </div>
</template>

<script>
import DataTableCell from "./DataTableCell";
import draggable from "vuedraggable";
import AddSongModal from "./AddSongModal";
import AddPlaylistModal from "./AddPlaylistModal";

export default {
  name: "DataTable",
  components: {
    DataTableCell,
    draggable,
    AddSongModal,
    AddPlaylistModal
  },
  data() {
    return {
      array: [],
      visibles: null,
      tableId: this.forPlaylists ? "table" : false,
      draggableTableId: !this.forPlaylists ? "table" : false,
      showAddSongModal: false,
      showAddPlaylistModal: false
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
    forPlaylists: Boolean,
    mountedBool: {
      type: Boolean,
      default: false
    },
    forTheme: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    formattedArray() {
      this.array = [...this.formattedArray];
    },
    mountedBool(val) {
      if (!val) return

      this.visibles = Array(this.$store.getters.currentPlaylistViewing.data.length);
      this.visibles.fill(false);
    }
  },
  methods: {
    showCells(entries) {
      entries.forEach((entry) => {
        const i = entry.target.getAttribute("index");

        // console.log(entry, i);

        if (entry.isIntersecting) {
          this.$set(this.visibles, i, true);
        } else {
          if (this.visibles[i]) {
            this.$set(this.visibles, i, false);
          }
        }
      });
    },
    addCells() {
      const observer = new IntersectionObserver(this.showCells);
      const cells = Array.from(document.getElementById("table").children);

      cells.forEach((node, i) => {
        node.setAttribute("index", i)
        observer.observe(node);
      });
    }
  },
  mounted() {
    if (this.formattedArray) {
      this.array = [...this.formattedArray];
    }
  },
  beforeDestroy() {
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

.table-add-cell {
  max-width: 100%;
  height: 64px;
  margin: 12px 0;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: background-color .3s ease;
  border-radius: 8px;

  &:hover {
    background-color: var(--lighter-bg);

    div {
      opacity: 1;
    }
  }

  div {
    transition: opacity .3s ease;
    opacity: 0.5;
    width: 30px;
    height: 30px;
  }
}

.table {
  width: 100%;
  height: 100%;
  overflow: scroll;
  padding-right: 8px;
  overflow-x: hidden;

  .cell-container:first-of-type {
    margin-top: 0px;
  }
}
</style>
