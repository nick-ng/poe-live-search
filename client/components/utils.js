export const trimListings = (listings, maxAgeMS = 600000) => {
  return [...listings].filter((a) => Date.now() - a.timeStamp < maxAgeMS);
};

export const filterListingsChaos = (listings, maxChaos = 100) => {
  return [...listings].filter((a) => {
    if (!a.price) {
      return false;
    }

    if (a.price.currency !== "chaos") {
      return true;
    }

    return a.price.amount <= maxChaos;
  });
};

export const formatTime = (date) => {
  const minutes = `${date.getMinutes()}`.padStart(2, "0");
  const seconds = `${date.getSeconds()}`.padStart(2, "0");
  return `${date.getHours()}:${minutes}:${seconds}`;
};

export function djb2(str) {
  var hash = 5381;
  for (var i = 0; i < str.length; i++) {
    hash = (hash << 5) + hash + str.charCodeAt(i); /* hash * 33 + c */
  }
  return hash;
}

export function hashStringToColor(str) {
  var hash = djb2(str);
  var r = (hash & 0xff0000) >> 16;
  var g = (hash & 0x00ff00) >> 8;
  var b = hash & 0x0000ff;
  return (
    "#" +
    ("0" + r.toString(16)).substr(-2) +
    ("0" + g.toString(16)).substr(-2) +
    ("0" + b.toString(16)).substr(-2)
  );
}
