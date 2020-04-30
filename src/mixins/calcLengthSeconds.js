export default function(songDuration) {
    let lengthSeconds;
    const splits = songDuration.split(":");

    if (songDuration.split("").filter(text => text === ":").length === 2) {
      lengthSeconds =
        splits[0] * 60 * 60 +
        Number.parseInt(splits[1]) * 60 +
        Number.parseInt(splits[2]);
    } else {
      lengthSeconds = splits[0] * 60 + Number.parseInt(splits[1]);
    }

    return lengthSeconds
}