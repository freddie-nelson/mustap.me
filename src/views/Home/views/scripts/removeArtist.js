const removeArtist = (title, artist, symbol = "-", tries = 0) => {
  let name = title;

  if (tries === 6) {
    return title;
  }

  if (tries < 6) {
    name = title.split(symbol)[1];

    if (name && artist && name.toLowerCase() === artist.toLowerCase()) {
      name = title.split(symbol)[0];

      if (
        !name ||
        name.length === 1 ||
        name.length === 0 ||
        name.length === 2
      ) {
        name = title;
      }
    }

    if (!name) {
      if (tries === 1) {
        removeArtist(title, artist, "–", tries + 1);
      } else if (tries === 2) {
        removeArtist(title, artist, "~", tries + 1);
      } else if (tries === 3) {
        removeArtist(title, artist, "--", tries + 1);
      } else if (tries === 4) {
        removeArtist(title, artist, "—", tries + 1);
      } else if (tries === 5) {
        removeArtist(title, artist, ":", tries + 1);
      } else {
        name = title;
      }
    }
  }

  if (name.indexOf("ft.") > -1) {
    const start = name.split("ft.")[0];
    start.indexOf("ft.") > -1 ? (name = name.split("ft.")[1]) : (name = start);
  } else if (name.indexOf("feat.") > -1) {
    const start = name.split("feat.")[0];
    start.indexOf("feat.") > -1
      ? (name = name.split("feat.")[1])
      : (name = start);
  }

  if (name[0] === " ") {
    name = name.slice(1, name.length);
  }

  if (name.replace(" ", "") === "") {
    return title.replace("-", "");
  }

  return name;
};

export default removeArtist;