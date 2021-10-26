const fetch = require("node-fetch");

const requestOptions = {
  headers: {
    "User-Agent": process.env.USER_AGENT,
    cookie: `POESESSID=${process.env.POESESSID}`,
    origin: "https://www.pathofexile.com",
    host: "www.pathofexile.com",
    "Content-Type": "application/json",
  },
};

const getLeague = async () => {
  return process.env.LEAGUE;
};

// const makeSearchBody = ({ term, maxChaos }) => ({
//   query: {
//     status: {
//       option: "online",
//     },
//     term: term,
//     stats: [{ type: "and", filters: [], disabled: false }],
//     filters: {
//       trade_filters: {
//         filters: {
//           price: {
//             min: 0.1,
//             max: maxChaos,
//             option: null,
//           },
//           disabled: false,
//         },
//       },
//     },
//   },
//   sort: {
//     price: "asc",
//   },
// });

const makeSearchBody = ({ term, maxChaos }) => ({
  query: {
    status: { option: "online" },
    term: term,
    stats: [{ type: "and", filters: [], disabled: false }],
    filters: {
      trade_filters: {
        filters: { price: { min: 0.1, max: maxChaos, option: null } },
        disabled: false,
      },
    },
  },
  sort: { price: "asc" },
});

const fetchSearchId = async (term, maxChaos = 999) => {
  const searchBody = makeSearchBody({ term, maxChaos });

  const body = JSON.stringify(searchBody);

  const league = await getLeague();

  const res = await fetch(
    `https://www.pathofexile.com/api/trade/search/${league}`,
    {
      ...requestOptions,
      method: "POST",
      referer: `https://www.pathofexile.com/trade/search/${league}`,
      body,
      mode: "cors",
    }
  );

  console.log("fetchSearchId", res);

  const resJson = await res.json();

  console.log("fetchSearchId json", resJson);

  return resJson;
};

module.exports = {
  requestOptions,
  getLeague,
  makeSearchBody,
  fetchSearchId,
};
