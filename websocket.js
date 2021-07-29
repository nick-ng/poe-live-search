const WebSocket = require("ws");
const fetch = require("node-fetch");
const { v4: uuid } = require("uuid");

const sleep = (ms, output = null) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(output);
    });
  });

const requestOptions = {
  headers: {
    "User-Agent": process.env.USER_AGENT,
    cookie: `POESESSID=${process.env.POESESSID}`,
    origin: "https://www.pathofexile.com",
    host: "www.pathofexile.com",
  },
};

const hydrate = async (id, query) => {
  const url = `https://www.pathofexile.com/api/trade/fetch/${id}?query=${query}`;
  const res = await fetch(url, requestOptions);
  if (res.status > 299) {
    console.log("res", url, res);
    return [];
  }
  const resJson = await res.json();
  const { result } = resJson;
  if (Array.isArray(result)) {
    return result.map((a) => a.listing);
  }
  console.log("result", result);
  return [];
};

const addEvents = (client, io, extra = {}, retry) => {
  client.on("message", (msg) => {
    try {
      const msgJson = JSON.parse(msg);
      const itemIds = msgJson.new;
      if (!Array.isArray(itemIds)) {
        return;
      }
      itemIds.forEach(async (itemId) => {
        const query = extra?.url?.split("/").pop();
        const listings = await hydrate(itemId, query);
        listings.forEach((listing) => {
          io.emit("new-listing", {
            ...listing,
            ...extra,
            id: uuid(),
          });
        });
      });
    } catch (e) {
      console.log("couldn't parse msg", e);
    }
  });
  client.on("error", (e) => {
    console.log("error", extra.note, e.message);
    if (typeof retry === "function") {
      retry();
    }
  });
};

const watchSearches = async (searches, io = null) => {
  let counter = 0;
  if (searches.length > 20) {
    console.log(`20 search limit. You have ${searches.length}`);
    return;
  }

  console.log(`Starting ${searches.length} live searches`);

  for (const search of searches) {
    const { url, note } = search;

    const wsUrl = url.replace(
      "https://www.pathofexile.com/trade/search/",
      "wss://www.pathofexile.com/api/trade/live/"
    );

    function makeClient() {
      console.log(`Connecting ${note}`);
      const client = new WebSocket(wsUrl, requestOptions);

      addEvents(client, io, search, () => {
        setTimeout(() => makeClient(), 70000);
      });
    }

    setTimeout(() => {
      makeClient();
    }, counter * 9000);

    counter++;
  }
};

module.exports = {
  requestOptions,
  watchSearches,
};
