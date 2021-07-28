import React, { useEffect, useState } from "react";
import styled from "styled-components";
import io from "socket.io-client";

import Listing from "./listing";
import { trimListings, filterListingsChaos } from "./utils";

const MAX_CHAOS = "MAX_CHAOS";

const Container = styled.div``;

const Columns = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 0.5em;
`;

const Controls = styled.div`
  margin-bottom: 0.5em;
`;

export default function Main() {
  const [newListings, setNewListings] = useState([]);
  const [oldListings, setOldListings] = useState([]);
  const [maxChaos, setMaxChaos] = useState(
    parseInt(localStorage.getItem(MAX_CHAOS) || 100, 10)
  );
  const [message, setMessage] = useState("Please wait.");

  useEffect(() => {
    const socket = io();

    socket.on("connect", () => {
      setMessage("Connected");
    });

    socket.on("new-listing", (data) => {
      const listing = {
        ...data,
        timeStamp: Date.now(),
      };
      setNewListings((prevNewListings) =>
        trimListings([listing].concat(prevNewListings))
      );
      setOldListings((prevOldListings) => trimListings(prevOldListings));
    });
  }, []);

  return (
    <Container>
      <h1>Trade Search Listings</h1>
      <Controls>
        <label>
          Max Chaos:{" "}
          <input
            type="number"
            onChange={(e) => {
              const newMaxChaos = parseInt(e.target.value, 10);
              setMaxChaos(newMaxChaos);
              localStorage.setItem(MAX_CHAOS, newMaxChaos);
            }}
            value={maxChaos}
          />
        </label>
      </Controls>
      <Columns>
        <div>
          {filterListingsChaos(newListings, maxChaos).map((listing) => (
            <Listing
              listing={listing}
              key={listing.id}
              onClick={() => {
                setNewListings((prevNewListings) =>
                  prevNewListings.filter(({ id }) => id !== listing.id)
                );
                setOldListings((prevOldListings) =>
                  trimListings([listing].concat(prevOldListings))
                );
              }}
            />
          ))}
        </div>
        <div>
          {filterListingsChaos(oldListings, maxChaos).map((listing) => (
            <Listing listing={listing} key={listing.id} onClick={() => {}} />
          ))}
        </div>
        <div>WIP</div>
      </Columns>
      <pre>{message}</pre>
    </Container>
  );
}
