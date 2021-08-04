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

const makeSearchBody = ({ term, maxChaos }) => ({
  query: {
    status: {
      option: "online",
    },
    term: term,
    stats: [
      {
        type: "and",
        filters: [],
      },
    ],
    filters: {
      trade_filters: {
        filters: {
          price: {
            max: maxChaos,
          },
        },
      },
    },
  },
  sort: {
    price: "asc",
  },
});

const fetchSearchId = async (term, maxChaos = 999) => {
  const searchBody = makeSearchBody({ term, maxChaos });

  console.log("searchBody", searchBody);

  const body = JSON.stringify(searchBody);

  console.log("body.length", body.length);

  const res = await fetch(
    `https://www.pathofexile.com/api/trade/search/Expedition`,
    {
      ...requestOptions,
      method: "POST",
      referer: "https://www.pathofexile.com/trade/search/Expedition",
      body,
      mode: "cors",
    }
  );

  console.log("res", res);
  console.log("res.headers", res.headers);

  const resBody = await res.text();

  // const resJson = await res.json();

  return resBody;
};

module.exports = {
  requestOptions,
  makeSearchBody,
  fetchSearchId,
};
