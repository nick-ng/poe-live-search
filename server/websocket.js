const WebSocket = require("ws");
const fetch = require("node-fetch");
const { v4: uuid } = require("uuid");

let clients = [];

const requestOptions = {
  headers: {
    "User-Agent": process.env.USER_AGENT,
    cookie: `POESESSID=${process.env.POESESSID}`,
    origin: "https://www.pathofexile.com",
    host: "www.pathofexile.com",
  },
};

const sleep = (ms, output = null) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(output);
    });
  });

const hydrate = async (id, query) => {
  const url = `https://www.pathofexile.com/api/trade/fetch/${id}?query=${query}`;
  const res = await fetch(url, requestOptions);
  if (res.status > 299) {
    throw res;
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
        try {
          const listings = await hydrate(itemId, query);
          listings.forEach((listing) => {
            io.emit("new-listing", {
              ...listing,
              ...extra,
              id: uuid(),
            });
          });
        } catch (e) {
          io.emit(
            JSON.stringify(
              {
                ...extra,
                status: e.status,
                statusText: e.statusText,
              },
              null,
              "  "
            )
          );
        }
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

const makeClient = (search, io, message) => {
  /**
   * {
    type = "id",
    searchId = "",
    note = "",
    term = "",
    maxChaos = "",
  }
   */
  const { url, note } = search;
  console.log(`Connecting ${note} - ${message}`);
  const wsUrl = url.replace(
    "https://www.pathofexile.com/trade/search/",
    "wss://www.pathofexile.com/api/trade/live/"
  );

  const client = new WebSocket(wsUrl, requestOptions);

  addEvents(client, io, search, () => {
    setTimeout(() => makeClient(), 70000);
  });

  clients.push(client);
};

const watchSearches = async (searches, io = null) => {
  if (searches.length > 20) {
    console.log(`20 search limit. You have ${searches.length}`);
    return;
  }

  clients.forEach((client) => {
    client.close();
  });

  await sleep(5000);

  clients = [];

  console.log(`Starting ${searches.length} live searches`);

  searches.forEach((search, i) => {
    setTimeout(() => {
      makeClient(search, io, `${i + 1}/${searches.length}`);
    }, i * 2000);
  });
};

module.exports = {
  requestOptions,
  watchSearches,
};
