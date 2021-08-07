require("dotenv").config();
const express = require("express");
const compression = require("compression");
const path = require("path");
const http = require("http");
const fetch = require("node-fetch");
const socketio = require("socket.io");
const fs = require("fs");

const { stopSearches, watchSearches } = require("./server/websocket");
const { fetchPoeNinja } = require("./server/poe-ninja");
const { makeLootFilter } = require("./server/loot-filter");

const app = express();
const server = http.createServer(app);
const router = express.Router();
const io = socketio(server);

const port = process.env.PORT || 9362;
app.set("port", port);

router.post("/api/searches", async (req, res, next) => {
  watchSearches(req.body, io);

  res.sendStatus(201);
});

router.post("/api/searches/stop", async (req, res, next) => {
  await stopSearches(io);

  res.sendStatus(200);
});

router.get("/api/poe-ninja", async (req, res, next) => {
  const { minChaos: minChaos } = req.query;
  const results = await fetchPoeNinja(minChaos);

  res.json(results);
});

router.get("/api/loot-filter", async (req, res, next) => {
  const { minChaos: minChaos } = req.query;
  const results = await fetchPoeNinja(minChaos, process.env.POE_SETTINGS_PATH);
  makeLootFilter(results);

  res.sendStatus(200);
});

router.post("/api/loot-filter", async (req, res, next) => {
  console.log("req.body", req.body);
  makeLootFilter(req.body);

  res.sendStatus(200);
});

app.use(compression());
app.use(express.json());
app.use(router);
app.use(express.static("dist"));

app.use((req, res) => {
  res.sendFile(path.resolve(__dirname, "./dist/index.html"));
});

server.listen(app.get("port"), () => {
  console.log(`${new Date()} Website server listening on ${port}.`);
});
