export default {
  methods: {
    setCurrentPlaying(e, src, setCurrentPlaylistDetails = false) {
      if (src === "") {
        this.$store.state.currentPlaying.sound.pause();

        this.$store.dispatch("setCurrentPlayingMultiple", {
          thumbnail: "N / A",
          title: "N / A",
          artist: "N / A",
          duration: "0:00",
          currentTime: "0:00",
          currentTimeSeconds: 0,
          lengthSeconds: 0,
          filename: "",
          playing: false,
          index: -1
        });

        this.$store.dispatch("setCurrentPlayingSrc", src);
      } else {
        if (setCurrentPlaylistDetails) {
          this.$store.dispatch("setCurrentPlaylistDetails");
        }
        /* Get the song that the user clicked on */
        const index = e - 1;
        const song = this.$store.getters.currentPlaylist.data[index];

        /* setting all the properties of the song that is going to be played (the first song) */
        this.$store.dispatch("setCurrentPlayingMultiple", {
          thumbnail: song.thumbnailUrl.replace("hqdefault", "maxresdefault"),
          title: song.title,
          artist: song.artist,
          duration: song.duration,
          currentTime: "0:00",
          lengthSeconds: song.duration.split(":")[0] * 60 + Number.parseInt(song.duration.split(":")[1]),
          filename: song.filename,
          playing: true,
          index: index
        });

        this.$store.dispatch("setCurrentPlayingSrc");
      }
    }
  }
};
