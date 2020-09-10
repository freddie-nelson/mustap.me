const fs = require("fs");

const savePlaylist = async (playlist, documentsPath, playlistName) => {
    const jsonPlaylist = JSON.stringify(playlist);

    await fs.promises.mkdir(documentsPath + "/mustap/playlists/", { recursive: true })
    .then(async () => {
        await fs.promises.writeFile(documentsPath + `/mustap/playlists/${playlistName}.json`, jsonPlaylist);
    })
    .catch(err => console.log(err));
}

export default savePlaylist;
