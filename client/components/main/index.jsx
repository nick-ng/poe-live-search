import React, { useEffect, useState } from "react";
import styled from "styled-components";
import io from "socket.io-client";

import Listing from "./listing";
import VoiceChooser from "./voice-chooser";
import { getVoices, sayWithVoice, makePhrase } from "./text-to-speech";
import { trimListings, filterListingsChaos } from "./utils";

const MAX_CHAOS = "MAX_CHAOS";
const VOICE_CHARACTER = "VOICE_CHARACTER";
const VOICE_VOLUME = "VOICE_VOLUME";
const VOICE_VERBOSE = "VOICE_VERBOSE";
const VOICE_NONVERBOSE_PHRASE = "VOICE_NONVERBOSE_PHRASE";
const VOICE_COOLDOWN_MS = 1000;

const Container = styled.div``;

const Columns = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 0.5em;
`;

const HorizontalControls = styled.div`
  margin-bottom: 0.5em;
`;

const VerticalControls = styled.div`
  display: flex;
  flex-direction: column;

  & > * {
    margin-bottom: 0.5em;
  }

  label {
    display: flex;
    align-items: center;
  }
`;

export default function Main() {
  const [newest, setNewest] = useState(null);
  const [newListings, setNewListings] = useState([]);
  const [oldListings, setOldListings] = useState([]);
  const [maxChaos, setMaxChaos] = useState(
    parseInt(localStorage.getItem(MAX_CHAOS) || 100, 10)
  );
  const [message, setMessage] = useState("Please wait.");
  const [voices, setVoices] = useState([]);
  const [voice, setVoice] = useState(
    localStorage.getItem(VOICE_CHARACTER) || ""
  );
  const [voiceVolume, setVoiceVolume] = useState(
    parseFloat(localStorage.getItem(VOICE_VOLUME)) || 0.3
  );
  const [verbose, setVerbose] = useState(
    localStorage.getItem(VOICE_VERBOSE) === "true"
  );
  const [nonVerbosePhrase, setNonVerbosePhrase] = useState(
    localStorage.getItem(VOICE_NONVERBOSE_PHRASE) || "woop"
  );
  const [lastSay, setLastSay] = useState(0);

  const makeClickHandler = (listing) => () => {
    navigator.clipboard.writeText(listing.whisper);
    setNewListings((prevNewListings) =>
      prevNewListings.filter(({ id }) => id !== listing.id)
    );
    setOldListings((prevOldListings) =>
      trimListings([listing].concat(prevOldListings))
    );
  };

  useEffect(() => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }

    const bb = async () => {
      const voices = await getVoices();
      setVoices(voices);
    };
    bb();

    const socket = io();

    socket.on("connect", () => {
      setMessage("Connected");
    });

    socket.on("new-listing", (data) => {
      const listing = {
        ...data,
        timeStamp: Date.now(),
      };

      setNewest(listing);
      setNewListings((prevNewListings) =>
        trimListings([listing].concat(prevNewListings))
      );
      setOldListings((prevOldListings) => trimListings(prevOldListings));
    });

    socket.on("message", (message) => {
      setMessage(message);
    });
  }, []);

  useEffect(() => {
    if (!newest) {
      return;
    }
    if (Date.now() - lastSay < VOICE_COOLDOWN_MS) {
      return;
    }
    if (filterListingsChaos([newest], maxChaos).length === 0) {
      return;
    }

    const phrase = makePhrase(newest);
    if (verbose && phrase) {
      sayWithVoice(phrase, voice, voiceVolume);
    } else {
      sayWithVoice(nonVerbosePhrase, voice, voiceVolume);
    }
    setLastSay(Date.now());

    // if (Notification.permission === "granted") {
    //   const notification = new Notification(phrase);
    //   notification.onclick = makeClickHandler(newest);
    // }
  }, [newest]);

  return (
    <Container>
      <h1>Trade Search Listings</h1>
      <HorizontalControls>
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
      </HorizontalControls>
      <Columns>
        <div>
          {filterListingsChaos(newListings, maxChaos).map((listing) => (
            <Listing
              listing={listing}
              key={listing.id}
              onClick={makeClickHandler(listing)}
            />
          ))}
        </div>
        <div>
          {filterListingsChaos(oldListings, maxChaos).map((listing) => (
            <Listing
              listing={listing}
              key={listing.id}
              onClick={() => {
                navigator.clipboard.writeText(listing.whisper);
              }}
            />
          ))}
        </div>
        <VerticalControls>
          <VoiceChooser
            voices={voices}
            voice={voice}
            onChange={(newVoice) => {
              setVoice(newVoice);
              localStorage.setItem(VOICE_CHARACTER, newVoice);
            }}
          />
          <label>
            Volume:{" "}
            <input
              value={voiceVolume}
              type="number"
              min="0"
              max="1"
              step="0.05"
              onChange={(e) => {
                setVoiceVolume(parseFloat(e.target.value));
                localStorage.setItem(VOICE_VOLUME, e.target.value);
              }}
            />
          </label>
          <label>
            Descriptive:{" "}
            <input
              checked={verbose}
              type="checkbox"
              onChange={(e) => {
                setVerbose(e.target.checked);
                localStorage.setItem(VOICE_VERBOSE, e.target.checked);
              }}
            />
          </label>
          <label>
            Non-Descriptive Phrase:{" "}
            <input
              value={nonVerbosePhrase}
              type="text"
              onChange={(e) => {
                setNonVerbosePhrase(e.target.value);
                localStorage.setItem(VOICE_NONVERBOSE_PHRASE, e.target.value);
              }}
            />
          </label>
        </VerticalControls>
      </Columns>
      <pre>{message}</pre>
    </Container>
  );
}
