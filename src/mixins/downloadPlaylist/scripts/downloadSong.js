import store from "@/store";
import calcLengthSeconds from "@/mixins/calcLengthSeconds";

const fs = require("fs");
const ytdl = require("ytdl-core");
const progress = require("progress-stream");
const eos = require("end-of-stream");

const downloadOptions = {
  quality: "highestaudio",
  filter: "audioonly"
};

const downloadSong = (song, songsPath, tries = 0) => {
  const estimatedSize = calcLengthSeconds(song.duration) * 144000;

  // calculate progress on the download
  let str = progress({
    length: estimatedSize,
    time: 1000 /* ms */
  });

  str.on("progress", progress => {
    if (store.state.currentDownload.progress < 100) {
      const progress10x = Math.round(progress.percentage) * 10;

      store.dispatch("setCurrentDownloadProp", {
        prop: "progress",
        data: progress10x > 100 ? 100 : progress10x
      });
    } else {
      store.dispatch("setCurrentDownloadProp", {
        prop: "progress",
        data: 100
      });
    }
  });
  
  let stream;

  try {
    stream = ytdl(song.url, downloadOptions)
        .pipe(str)
        .pipe(fs.createWriteStream(songsPath + song.filename));
  } catch (e) {
    return e;
  }

  store.state.currentDownload.stream = stream;

  const promise = new Promise((resolve, reject) => {
    eos(stream, err => {
      if (err && String(err).split(": ")[1] !== "premature close") {
        store.dispatch("setCurrentDownloadProp", {
          prop: "currentProcess",
          data: "Failed to download, retrying..."
        });

        if (tries === 2) {
          reject("failed");
        } else {
          store.dispatch("setCurrentDownloadProp", {
            prop: "currentProcess",
            data: "Song failed to download, retrying..."
          });

          downloadSong(song, songsPath, tries + 1);
        }
      } else {
        if (!store.state.currentDownload.stopAll) {
          resolve()
        } else {
          store.dispatch("setCurrentDownloadProp", {
            prop: "stopAll",
            data: false
          });

          resolve(true);
        }
      }
    });
  });

  return promise;
};

export default downloadSong;
