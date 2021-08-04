require("dotenv").config();
const express = require("express");
const compression = require("compression");
const path = require("path");
const http = require("http");
const fetch = require("node-fetch");
const socketio = require("socket.io");
const fs = require("fs");

const { watchSearches } = require("./server/websocket");

const app = express();
const server = http.createServer(app);
const router = express.Router();
const io = socketio(server);

const port = process.env.PORT || 9362;
app.set("port", port);

app.use(compression());
app.use(express.json());
app.use(router);
app.use(express.static("dist"));
app.use((req, res) => {
  res.sendFile(path.resolve(__dirname, "./dist/index.html"));
});

const main = async () => {
  try {
    fs.accessSync("./searches.json");
  } catch (e) {
    fs.copyFileSync("./searches.json.example", "./searches.json");
  }

  const searches = require("./searches.json");

  watchSearches(searches, io);
};

main();

server.listen(app.get("port"), () => {
  console.log(`${new Date()} Website server listening on ${port}.`);
});
