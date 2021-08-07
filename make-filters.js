require("dotenv").config();
const { fetchPoeNinja } = require("./server/poe-ninja");
const { makeLootFilter } = require("./server/loot-filter");

const run = async () => {
  const results = await fetchPoeNinja(process.env.DEFAULT_FILTER_CHAOS);
  makeLootFilter(results);
  console.log("all done");
};

run();
