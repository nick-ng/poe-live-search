const WebSocket = require("ws");
const fetch = require("node-fetch");

const requestOptions = {
  headers: {
    "User-Agent": process.env.USER_AGENT,
    cookie: `POESESSID=${process.env.POESESSID}`,
    origin: "https://www.pathofexile.com",
    host: "www.pathofexile.com",
  },
};

module.exports = {
  requestOptions,
};
