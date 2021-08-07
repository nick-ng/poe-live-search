import React, { useState, useEffect } from "react";
import styled from "styled-components";

import { fetchPoeNinjaData } from "./utils";

const LOOT_FILTER_MIN_CHAOS = "LOOT_FILTER_MIN_CHAOS";

const Container = styled.div`
  padding: 0 1em;
`;

const Controls = styled.div``;

export default function LootFilter() {
  const [minChaos, setMinChaos] = useState(
    parseInt(localStorage.getItem(LOOT_FILTER_MIN_CHAOS) || 2, 10)
  );
  const [poeNinjaData, setPoeNinjaData] = useState([]);

  const x32 = poeNinjaData?.uniques?.x32;

  return (
    <Container>
      <h1>Loot Filter Generator</h1>
      <Controls>
        <label>
          <span>Min Chaos</span>
          <input
            type="number"
            min="0"
            value={minChaos}
            onChange={(e) => {
              setMinChaos(parseInt(e.target.value), 10);
              localStorage.setItem(LOOT_FILTER_MIN_CHAOS, e.target.value);
            }}
          />
        </label>
        <button
          onClick={() => {
            setPoeNinjaData([]);
            fetchPoeNinjaData(setPoeNinjaData, minChaos);
          }}
        >
          Fetch poe.ninja Data
        </button>
        <button
          onClick={() => {
            // if (poeNinjaData.length === 0) {
            //   return;
            // }
            // fetch("/api/loot-filter", {
            //   headers: {
            //     "Content-Type": "application/json",
            //   },
            //   method: "POST",
            //   body: JSON.stringify(poeNinjaData),
            // });
            fetch(`/api/loot-filter?minChaos=${minChaos}`);
          }}
        >
          Make Loot Filter
        </button>
      </Controls>
      <ul>
        {x32 &&
          x32.map((a) => (
            <li key={a.detailsId}>
              <a
                href={`https://pathofexile.fandom.com/wiki/${a.name.replaceAll(
                  " ",
                  "_"
                )}`}
                target="_blank"
              >
                {a.name}
              </a>{" "}
              - {a.detailsId}
            </li>
          ))}
      </ul>
      <pre>
        {JSON.stringify(
          poeNinjaData?.uniques?.x32.map((a) => ({
            name: a.name,
            detailsId: a.detailsId,
          })),
          null,
          "  "
        )}
      </pre>
    </Container>
  );
}
