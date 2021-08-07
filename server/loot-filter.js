const fs = require("fs");
const path = require("path");
const { chunk } = require("lodash");

const lootTiers = ["x32", "x16", "x8", "x4", "x2", "x1"];

const writeFileSync = (filePath, options) => {
  const dirName = path.dirname(filePath);
  fs.mkdirSync(dirName, {
    recursive: true,
  });

  return fs.writeFileSync(filePath, options);
};

const {
  sixLinkTemplate,
  uniquesTemplate,
  uniquesOverrideTemplate,
} = require("./loot-filter-templates");

const neversinkStrictPath = path.resolve(
  __dirname,
  "..",
  "base-filters",
  "neversink_strict.filter"
);

const neversinkVeryStrictPath = path.resolve(
  __dirname,
  "..",
  "base-filters",
  "neversink_verystrict.filter"
);

const sfhobitUberPath = path.resolve(
  __dirname,
  "..",
  "base-filters",
  "SovUber.filter"
);

const writeNeversinkFilters = (filter) => {
  const neversinkStrict = fs.readFileSync(neversinkStrictPath);
  const date = new Date();

  writeFileSync(
    path.resolve(
      __dirname,
      "..",
      "filters",
      `zz_strictplus_${date.toISOString().slice(0, 13)}.filter`
    ),
    `${filter}${neversinkStrict}`
  );
  writeFileSync(
    path.resolve(__dirname, "..", "filters", `zz_strictplus_latest.filter`),
    `${filter}${neversinkStrict}`
  );

  const neversinkVeryStrict = fs.readFileSync(neversinkVeryStrictPath);
  writeFileSync(
    path.resolve(
      __dirname,
      "..",
      "filters",
      `zz_verystrictplus_${date.toISOString().slice(0, 13)}.filter`
    ),
    `${filter}${neversinkVeryStrict}`
  );
  writeFileSync(
    path.resolve(__dirname, "..", "filters", `zz_verystrictplus_latest.filter`),
    `${filter}${neversinkVeryStrict}`
  );

  const sfhobitUber = fs.readFileSync(sfhobitUberPath);
  writeFileSync(
    path.resolve(
      __dirname,
      "..",
      "filters",
      `zz_gigastrict_${date.toISOString().slice(0, 13)}.filter`
    ),
    `${filter}${sfhobitUber}`
  );
  writeFileSync(
    path.resolve(__dirname, "..", "filters", `zz_gigastrict_latest.filter`),
    `${filter}${sfhobitUber}`
  );
};

const makeLootFilter = (sortedItems) => {
  //   console.log("sortedItems", sortedItems);
  const { uniques } = sortedItems;

  const baseFilter = `${sixLinkTemplate()}${uniquesOverrideTemplate()}`;

  // UniquesTemplate
  const handledUniqueBaseTypes = [];
  const uniquesFilter = `${lootTiers.reduce((prev, tier) => {
    const value = uniques[tier];

    const filteredValue = value.filter(
      (item) => !handledUniqueBaseTypes.includes(item.baseType)
    );

    let filterPart = "";

    for (const filterChunk of chunk(filteredValue, 10)) {
      const baseTypes = filterChunk.map((item) => item.baseType);
      handledUniqueBaseTypes.push(...baseTypes);
      filterPart = `${filterPart}${uniquesTemplate(baseTypes, tier)}`;
    }

    return `${prev}${filterPart}`;
  }, baseFilter)}
Hide
    Rarity Unique
    SetBackgroundColor 175 96 37
    SetTextColor 255 255 255
    SetBorderColor 150 150 150
    SetFontSize 20`;

  const filter = `${uniquesFilter}`;

  writeNeversinkFilters(filter);
};

module.exports = {
  makeLootFilter,
};
