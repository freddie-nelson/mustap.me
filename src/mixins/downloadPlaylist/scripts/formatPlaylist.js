import removeArtist from "./removeArtist";

const formatPlaylist = (metadata, url) => {
    const playlist = metadata.items
      .map((song, i) => {
        // take the data we want and format it nicely
        if (song.duration !== null) {
          // create song object
          const obj = {
            videoId: song.id,
            url: song.url.split("&")[0],
            title: removeArtist(
              song.title
                .replace(/ *\([^)]*\) */g, "")
                .replace(/\[.*?\]/g, "") || song.title,
              song.author.name
            ),
            filename: song.id + ".mp3",
            artist: song.author.name,
            thumbnailUrl: song.thumbnail.replace("hqdefault", "0"),
            duration: song.duration
          };

          if (i === 0) {
            obj.playlistLink = url;
          }

          return obj;
        } else {
          return;
        }
      })
      .filter(obj => obj !== undefined);

    return playlist
}

export default formatPlaylist;