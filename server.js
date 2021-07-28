require("dotenv").config();
const WebSocket = require("ws");
const fetch = require("node-fetch");
const fs = require("fs");

const { requestOptions } = require("./websocket");

const hydrate = async (id) => {
  const res = await fetch(
    `https://www.pathofexile.com/api/trade/fetch/${id}`,
    requestOptions
  );
  const resJson = await res.json();
  const { result } = resJson;
  return result.map((a) => a.listing);
};

const main = async () => {
  try {
    fs.accessSync("./searches.json");
  } catch (e) {
    fs.copyFileSync("./searches.json.example", "./searches.json");
  }

  const searches = require("./searches.json");

  let clients = searches.map(({ searchUrl }) => {
    const url = searchUrl.replace(
      "https://www.pathofexile.com/trade/search/",
      "wss://www.pathofexile.com/api/trade/live/"
    );

    return new WebSocket(url, requestOptions);
  });

  clients.map((client) => {
    client.on("message", (msg) => {
      try {
        const msgJson = JSON.parse(msg);
        const itemIds = msgJson.new;
        if (!Array.isArray(itemIds)) {
          console.log("Not array", msg);
          return;
        }
        itemIds.forEach(async (itemId) => {
          const a = await hydrate(itemId);
          console.log(a[0].whisper);
        });
      } catch (e) {
        console.log("couldn't parse msg", e);
      }
    });
    client.on("error", (e) => {
      console.log("error", e);
    });
  });
};

main();
