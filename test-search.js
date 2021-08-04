require("dotenv").config();
const fetch = require("node-fetch");

const { fetchSearchId } = require("./server/utils");

const run = async () => {
  const b = await fetchSearchId("asdf", 3);

  console.log("b", b);
};

run();
