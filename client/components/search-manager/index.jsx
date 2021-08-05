import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { v4 as uuid } from "uuid";

import SearchEntry from "./search-entry";

const SAVED_SEARCHES = "SAVED_SEARCHES";

const Container = styled.div`
  border-top: solid 1px white;
  padding-top: 0.5em;
`;

const Info = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  & + & {
    margin-top: 0.5em;
  }
`;

const Searches = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-top: 0.5em;
`;

export default function SearchManager() {
  const [searches, setSearches] = useState(
    JSON.parse(
      localStorage.getItem(SAVED_SEARCHES) ||
        '{"12345": {"active": true, "type": "id", "searchId": "NK6Ec5", "note": "Tabula", "term": "", "maxChaos": ""}}'
    )
  );

  const searchCount = Object.values(searches).filter((a) => a.active).length;

  const restartSearches = async () => {
    const searchesArray = Object.values(searches)
      .filter((a) => a.active)
      .slice(0, 20);
    fetch("/api/searches", {
      method: "POST",
      body: JSON.stringify(searchesArray),
      headers: {
        "Content-Type": "application/json",
      },
    });
  };

  useEffect(() => {
    localStorage.setItem(SAVED_SEARCHES, JSON.stringify(searches));
  }, [searches]);

  useEffect(() => {
    if (searchCount > 0) {
      restartSearches();
    }

    return () => {
      fetch("/api/searches/stop", {
        method: "POST",
        headers: {},
      });
    };
  }, []);

  return (
    <Container>
      <Info>
        <button onClick={restartSearches}>Restart Search</button>
        <button
          onClick={() => {
            fetch("/api/searches/stop", {
              method: "POST",
              headers: {},
            });
          }}
        >
          Stop Search
        </button>
      </Info>
      <Info>
        <button
          onClick={() => {
            setSearches({
              ...searches,
              [uuid()]: {
                active: true,
                type: "id",
                searchId: "",
                note: "",
                term: "",
                maxChaos: "",
              },
            });
          }}
        >
          New Search
        </button>
        <div>
          {searchCount} Active Search{searchCount === 1 ? "" : "es"}
        </div>
      </Info>
      <Searches>
        {Object.entries(searches).map((a) => {
          const [key, value] = a;

          return (
            <SearchEntry
              key={key}
              value={value}
              onChange={(updatedSearch) => {
                setSearches((prevSearches) => {
                  return {
                    ...prevSearches,
                    [key]: updatedSearch,
                  };
                });
              }}
              onDelete={() => {
                const newSearches = { ...searches };
                delete newSearches[key];
                setSearches(newSearches);
              }}
            />
          );
        })}
      </Searches>
    </Container>
  );
}
