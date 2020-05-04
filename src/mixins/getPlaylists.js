export default {
  data() {
    return {
      array: [],
      playlists: [],
      playlistNames: [],
      datesAdded: []
    };
  },
  computed: {
    documentsPath() {
      return this.$store.state.documentsPath;
    }
  },
  watch: {
    documentsPath() {
      this.getPlaylists().then(() => {
        this.formatDataPlaylists();
      });
    }
  },
  methods: {
    clickedCell(index) {
      const i = index - 1;

      this.$store.dispatch("setProp", { prop: "missingSongsCount", data: 0 });
      this.$store.dispatch("setProp", { prop: "deletedSongsCount", data: 0 });
      this.$store.dispatch("setProp", { prop: "deletedSongs", data: [] });

      this.$route.params.playlistName = this.$store.state.playlists.playlists[
        i
      ].name;
      this.$store.dispatch("setPlaylistsProp", {
        prop: "currentPlaylistViewing",
        data: i
      });
      this.$router.push({ name: "LibraryPlaylist" });
    },
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
    async getPlaylists() {
      const fs = require("fs");

      const playlistsLocation =
        this.$store.state.documentsPath + "/mustap/playlists";

      await this.$store.dispatch("changePlaylists", []);
      await this.$store.dispatch("setPlaylistsProp", {
        prop: "deletedPlaylists",
        data: []
      });

      // read all json files in the playlists directory
      await fs.promises
        .readdir(playlistsLocation)
        .then(async arr => {
          // a recursive style is used so that we read the files one by one and not all at the same time
          // this means that the playlists are always read and appear in the same order which gives a better UX
          const readFile = async i => {
            // if the array has nothing left in it then stop the recursion
            if (!arr[i]) {
              return;
            }

            const file = arr[i];

            // read the file
            await fs.promises
              .readFile(playlistsLocation + "/" + file)
              .then(async data => {
                // get the date the file was created
                const date = new Date(
                  fs.statSync(playlistsLocation + "/" + file).mtimeMs
                );
                const day = ("0" + date.getDate()).slice(-2);
                const month = ("0" + (date.getMonth() + 1)).slice(-2);
                const year = date.getFullYear();

                // only push the data to the playlists array if it isn't one used to store deleted songs
                if (file.indexOf("__deleted__") === -1) {
                  this.$store.dispatch("pushPlaylist", {
                    name: file.split(".")[0],
                    data: JSON.parse(data),
                    added: `${day}/${month}/${year}`
                  });
                } else {
                  this.$store.dispatch("pushDeletedPlaylists", {
                    name: file.split(".")[0],
                    data: JSON.parse(data),
                    added: `${day}/${month}/${year}`
                  });
                }
                // start the next read
                await readFile(i + 1);
              })
              .catch(err => console.log(err));
          };
          await readFile(0);
        })
        .catch(err => console.log(err));

      if (
        this.$store.state.playlists.currentPlaylist !== -1 &&
        this.$store.state.playlists.playlists !== []
      ) {
        this.$store.getters.playlistNames.forEach((name, i) => {
          name === this.$store.state.playlists.currentPlaylistName
            ? this.$store.dispatch("setProp", {
                prop: "currentPlaylist",
                payload: i
              })
            : null;
        });
      }
    }
  },
  mounted() {
    if (this.documentsPath) {
      this.getPlaylists().then(() => {
        this.formatDataPlaylists();
      });
    }
  }
};
