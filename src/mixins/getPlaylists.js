export default {
  methods: {
    async getPlaylists() {
      const fs = require("fs");

      const playlistsLocation =
        this.$store.state.documentsPath + "/mustap/playlists";
      let playlists = [];
      let deletedPlaylists = [];

      // read all json files in the playlists directory
      await fs.promises
        .readdir(playlistsLocation)
        .then(arr => {
          // a recursive style is used so that we read the files one by one and not all at the same time
          // this means that the playlists are always read and appear in the same order which gives a better UX

          readFile(0);
          function readFile(i) {
            // if the array has nothing left in it then stop the recursion
            if (!arr[i]) {
              return;
            }

            const file = arr[i];

            // read the file
            fs.promises
              .readFile(playlistsLocation + "/" + file)
              .then(data => {
                // get the date the file was created
                const date = new Date(
                  fs.statSync(playlistsLocation + "/" + file).mtimeMs
                );
                const day = ("0" + date.getDate()).slice(-2);
                const month = ("0" + (date.getMonth() + 1)).slice(-2);
                const year = date.getFullYear();

                // only push the data to the playlists array if it isn't one used to store deleted songs
                if (file.indexOf("__deleted__") === -1) {
                  playlists.push({
                    name: file.split(".")[0],
                    data: JSON.parse(data),
                    added: `${day}/${month}/${year}`
                  });
                } else {
                  deletedPlaylists.push({
                    name: file.split(".")[0],
                    data: JSON.parse(data),
                    added: `${day}/${month}/${year}`
                  });
                }
                // start the next read
                readFile(i + 1);
              })
              .catch(err => console.log(err));
          }
        })
        .catch(err => console.log(err));

      // store the playlists in vuex
      this.$store.dispatch("changePlaylists", playlists);
      this.$store.dispatch("setPlaylistsProp", {
        prop: "deletedPlaylists",
        data: deletedPlaylists
      });

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
  }
};