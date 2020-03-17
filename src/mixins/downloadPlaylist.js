function playlistDownloader(url) {

    /* dependencies */
    const fs = require('fs');
    const util = require('util')
    const ytdl = require('ytdl-core');
    const ytpl = require('ytpl');
    const progress = require('progress-stream');
    const cliProgress = require('cli-progress');
    const _colors = require('colors');
    const readdir = util.promisify(fs.readdir);
    const getPath = require('platform-folders');
    
    
    import store from '../store/index'

    const currentDownload = store;
    console.log(currentDownload)

    let playlist = [];

    // Get playlist metadata
    ytpl(url, {
        limit: 0
    })
        .then(async res => {
            console.log('Fetching metadata...')
            playlist = await Promise.all(res.items /* await is used so that we don't move on until all songs metadata has been found*/
                .map((song, i) => { /* map is the best way to do this as it allows us to take in all the songs from the playlist, change them, and put them back in all in one*/
                    const info = ytdl.getBasicInfo(song.url)
                        .then(res => {
                            let details = res.player_response.videoDetails;

                            /* Take the data we want and format it nicely */
                            return {
                                videoId: res.video_id,
                                url: res.video_url,
                                title: res.title,
                                filename: details.title.replace(/[/\\?%*:|"<>]/g, '') + '.mp3',
                                artist: res.author.name,
                                datePublished: res.published,
                                thumbnailUrl: details.thumbnail.thumbnails.pop().url,
                                duration: details.lengthSeconds,
                                views: details.viewCount,
                                likes: res.likes,
                                dislikes: res.dislikes,
                            }
                        })
                        .catch(err => console.log(`An error occured: The song at position ${i} of the playlist could not be found.`, err));

                    return info; /* add the formatted data to the plalist array */
                }));

            playlist = playlist.filter(obj => obj !== undefined); /* get rid of any songs that weren't found*/
            
            // console.log(playlist);
            console.log('Fetched all metadata.')
        })
        .then(async () => {

            /* saving playlist to documents as json file */
            const jsonPlaylist = JSON.stringify(playlist);
            const documentsPath = getPath('documents');
            await fs.promises.mkdir(documentsPath + '/mustap/playlists/playlist.json')
                .then(async () => {
                    await fs.promises.writeFile(documentsPath + '/mustap/playlists/playlist.json', jsonPlaylist)
                })
                .catch(err => console.log(err));

            console.log('Removing all previously installed songs...');
            let files = await readdir('./songs/')
                .catch(err => console.log(err));

            for (let i = playlist.length - 1; i >= 0; i--) {
                if (playlist[i] === undefined) {
                    break
                }

                const songFilename = playlist[i].filename;

                for (let index = 0; index < files.length; index++) {
                    const file = files[index];

                    if (file === songFilename) {
                        playlist.splice(i, 1);
                    }
                }
            }

            console.log('All previously installed songs removed from download queue (if any).');

            if (playlist === []) {
                console.log('You already have all these songs downloaded.')
            } else {
                /* start downloading the songs */
                console.log('Starting download...');
                downloadSongs(0, 0);
            }
        })
        .catch(err => {
            console.log('An error has occured --- ' + err)
        });

    async function downloadSongs(i, tries) {
        const index = i;
        const songInfo = playlist[index];

        if (tries === 2) {
            console.log(`Sorry the download of ${songInfo.title} has been attempted 3 times and has failed. This song cannot be downloaded.`)
            progressBar.stop();
            downloadSongs(i + 1, 0)
        }

        /* check if the playlist is finished downloading*/
        if (index > playlist.length - 1) {
            console.log('----- Finished downloading all songs. -----');
            return;
        }

        /* console progress bar setup */
        const progressBar = new cliProgress.SingleBar({
            format: `${index + 1} / ${playlist.length} | ${songInfo.title} |` + _colors.cyan('{bar}') + '| {percentage}%',
            barCompleteChar: '\u2588',
            barIncompleteChar: '\u2591',
            hideCursor: true
        });

        progressBar.start(100, 0);

        /* console progress bar setup */

        /* calculate the progress on the download */
        let str = progress({
            length: songInfo.duration * 127000,
            time: 100 /* ms */
        });

        str.on('progress', progress => {
            progressBar.update(Math.round(progress.percentage));
        });
        /* calculate the progress on the download */

        ytdl(songInfo.url, { quality: 'highestaudio', filter: 'audioonly' })
            .on('error', err => {
                console.log(' Failed to download. Retrying...', err)
                progressBar.stop()
                downloadSongs(index, tries + 1)
            })
            .pipe(str)
            .pipe(fs.createWriteStream('./songs/' + songInfo.filename)
                .on('close', () => { /* once the song is finished downloading call the function again for the next song in the array*/
                    progressBar.stop();
                    downloadSongs(index + 1, 0)
                }));

    }
}

playlistDownloader('');