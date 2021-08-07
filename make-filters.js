require("dotenv").config();
const { fetchPoeNinja } = require("./server/poe-ninja");
const { makeLootFilter } = require("./server/loot-filter");

const run = async () => {
  if (!process.env.POE_SETTINGS_PATH) {
    return
  }
  const results = await fetchPoeNinja(process.env.DEFAULT_FILTER_CHAOS);
  makeLootFilter(results, process.env.POE_SETTINGS_PATH);
  console.log("all done");
};

run();
