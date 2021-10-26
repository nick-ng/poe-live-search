import React, { useEffect, useState } from "react";
import styled from "styled-components";
import io from "socket.io-client";

import SearchManager from "../search-manager";
import Listing, { ColoredButton } from "./listing";
import VoiceChooser from "./voice-chooser";
import { getVoices, sayWithVoice, makePhrase } from "./text-to-speech";
import { trimListings, filterListingsChaos, formatTime, djb2 } from "../utils";

const MAX_CHAOS = "MAX_CHAOS";
const VOICE_CHARACTER = "VOICE_CHARACTER";
const VOICE_VOLUME = "VOICE_VOLUME";
const VOICE_VERBOSE = "VOICE_VERBOSE";
const VOICE_NONVERBOSE_PHRASE = "VOICE_NONVERBOSE_PHRASE";
const VOICE_COOLDOWN_MS = 1000;
const SOUND_VOLUME = "POE_LIVE_SEARCH_SOUND_VOLUME";

const Container = styled.div`
  font-family: sans-serif;
`;

const Columns = styled.div`
  display: grid;
  grid-template-columns: 50px 1fr 1fr auto 50px;
  gap: 0.5em;
`;

const HorizontalControls = styled.div`
  margin-bottom: 0.5em;
`;

const VerticalControls = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
  height: 90vh;
  padding-right: 0.5em;

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
  const [messages, setMessages] = useState([
    { date: new Date(), message: "Please wait." },
  ]);
  const [voices, setVoices] = useState([]);
  const [voice, setVoice] = useState(
    localStorage.getItem(VOICE_CHARACTER) || ""
  );
  const [voiceVolume, setVoiceVolume] = useState(
    parseFloat(localStorage.getItem(VOICE_VOLUME) ?? 0.3)
  );
  const [soundVolume, setSoundVolume] = useState(
    parseFloat(localStorage.getItem(SOUND_VOLUME) ?? 0.3)
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
      setMessages((prevMessages) =>
        [{ date: new Date(), message: "Connected" }].concat(prevMessages)
      );
    });

    socket.on("new-listing", (data) => {
      console.log("data", data);
      const listing = {
        ...data,
        ...data.listing,
        item: data.item,
        id: data.id,
        timeStamp: Date.now(),
      };

      setNewest(listing);
      setNewListings((prevNewListings) =>
        trimListings([listing].concat(prevNewListings))
      );
      setOldListings((prevOldListings) => trimListings(prevOldListings));
    });

    socket.on("message", (newMessage) => {
      setMessages((prevMessages) =>
        [{ date: new Date(), message: newMessage }].concat(prevMessages)
      );
    });
  }, []);

  useEffect(() => {
    if (!newest) {
      return;
    }
    if (newest.sound) {
      const audioElement = new Audio(`/${newest.sound.toLowerCase()}.mp3`);
      audioElement.volume = soundVolume;
      audioElement.play();
      return;
    }
    if (Date.now() - lastSay < VOICE_COOLDOWN_MS) {
      return;
    }
    if (filterListingsChaos([newest], maxChaos).length === 0) {
      return;
    }

    const phrase = makePhrase(newest);
    console.log("newest", newest);
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

  const filteredListings = filterListingsChaos(newListings, maxChaos);
  const listing0 = filteredListings[0];

  return (
    <Container>
      <h1>Trade Search Listings</h1>
      <Columns>
        {filteredListings.length > 0 ? (
          <Listing
            listing={listing0}
            onClick={makeClickHandler(listing0)}
            buttonOnly
          />
        ) : (
          <div />
        )}
        <div>
          {filteredListings.map((listing) => (
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
          <button
            onClick={() => {
              fetch("/api/searches/test", {
                method: "POST",
              });
            }}
          >
            Test
          </button>
          <label>
            Max Chaos:&nbsp;
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
          <label>
            Sound Volume:&nbsp;
            <input
              type="number"
              min="0"
              max="1"
              step="0.05"
              onChange={(e) => {
                const newSoundVolume = parseFloat(e.target.value);
                setSoundVolume(newSoundVolume);
                localStorage.setItem(SOUND_VOLUME, newSoundVolume);
              }}
              value={soundVolume}
            />
          </label>
          <VoiceChooser
            voices={voices}
            voice={voice}
            onChange={(newVoice) => {
              setVoice(newVoice);
              localStorage.setItem(VOICE_CHARACTER, newVoice);
            }}
          />
          <label>
            Volume:&nbsp;
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
            Descriptive:&nbsp;
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
            Non-Descriptive Phrase:&nbsp;
            <input
              value={nonVerbosePhrase}
              type="text"
              onChange={(e) => {
                setNonVerbosePhrase(e.target.value);
                localStorage.setItem(VOICE_NONVERBOSE_PHRASE, e.target.value);
              }}
            />
          </label>
          <SearchManager />
          <div>
            {messages.map((message) => (
              <pre key={djb2(JSON.stringify(message))}>
                {formatTime(message.date)}: {message.message}
              </pre>
            ))}
          </div>
        </VerticalControls>
        {filteredListings.length > 0 ? (
          <Listing
            listing={listing0}
            onClick={makeClickHandler(listing0)}
            buttonOnly
          />
        ) : (
          <div />
        )}
      </Columns>
    </Container>
  );
}
