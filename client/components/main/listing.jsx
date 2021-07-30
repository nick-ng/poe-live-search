import React from "react";
import styled from "styled-components";

import { hashStringToColor } from "./utils";

const Container = styled.div`
  font-family: "Comic Sans MS", sans-serif;
  margin-bottom: 0.5em;
  display: grid;
  grid-template-columns: auto repeat(5, 1fr);
  gap: 0.5em;
  align-items: center;
`;

const ColoredButton = styled.button.attrs((props) => ({
  style: { backgroundColor: props.buttonColor },
}))`
  font-size: 1.5em;
  font-family: "Comic Sans MS", sans-serif;
  color: white;
  border: 1px solid white;
  font-weight: bold;
  -webkit-text-stroke: 1px black;
  overflow-x: hidden;
`;

const Price = styled.div`
  font-size: 1.5em;
  font-family: "Comic Sans MS", sans-serif;
`;

export default function Listing({ listing, onClick }) {
  const { account, note, price, timeStamp, whisper } = listing;
  const date = new Date(timeStamp);

  return (
    <Container>
      <ColoredButton
        buttonColor={hashStringToColor(account.name)}
        onClick={() => {
          if (typeof onClick === "function") {
            onClick();
          }
        }}
      >
        Whisper
      </ColoredButton>
      {price && price.amount ? (
        <Price>
          {price.amount} {price.currency}
        </Price>
      ) : (
        <div>No Price</div>
      )}
      <div>{account.lastCharacterName}</div>
      <div>{account.name}</div>
      <div>{note}</div>
      <div>{`${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`}</div>
    </Container>
  );
}

/*
{
  "method": "psapi",
  "indexed": "2021-07-28T21:13:29Z",
  "stash": {
    "name": "2",
    "x": 0,
    "y": 5
  },
  "whisper": "@ragingcram Hi, I would like to buy your Tabula Rasa Simple Robe listed for 13 chaos in Expedition (stash tab \"2\"; position: left 1, top 6)",
  "account": {
    "name": "lilgiant333",
    "lastCharacterName": "ragingcram",
    "online": {
      "league": "Expedition"
    },
    "language": "en_US"
  },
  "price": {
    "type": "~price",
    "amount": 13,
    "currency": "chaos"
  },
  "url": "https://www.pathofexile.com/trade/search/Expedition/NK6Ec5",
  "note": "Tabula (optional) b",
  "id": "c690ba75-58e9-418f-b2d5-fe3a403f2c5e",
  "timeStamp": 1627506814154
}
*/
