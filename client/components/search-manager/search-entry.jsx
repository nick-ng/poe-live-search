import React from "react";
import styled from "styled-components";

const Container = styled.div`
  margin-bottom: 0.5em;
  border-top: 1px solid white;
  padding: 0.5em 0;
  display: flex;
  flex-direction: column;
`;

const HorizontalControls = styled.div`
  display: grid;
  grid-template-columns: auto repeat(3, 1fr);
  gap: 1em;
  margin-bottom: 0.5em;
`;

const Controls = styled.div`
  display: grid;
  grid-template-columns: auto auto;
  gap: 0.5em;
`;

const Label = styled.label`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const ActiveStyle = { backgroundColor: "blue", color: "white" };

export default function SearchManager({ value, onChange, onDelete }) {
  const {
    active = false,
    type = "id",
    searchId = "",
    note = "",
    term = "",
    maxChaos = "",
  } = value;

  const changeHandler = (key, a) => {
    onChange({
      ...value,
      [key]: a,
    });
  };

  return (
    <Container>
      <HorizontalControls>
        <input
          type="checkbox"
          checked={active}
          onChange={() => {
            changeHandler("active", !active);
          }}
        />
        <button
          onClick={() => {
            changeHandler("type", "id");
          }}
          style={type === "id" ? ActiveStyle : {}}
        >
          ID
        </button>
        <button
          onClick={() => {
            changeHandler("type", "term");
          }}
          style={type === "term" ? ActiveStyle : {}}
        >
          Term
        </button>
        <button onClick={onDelete}>Delete</button>
      </HorizontalControls>
      {type === "id" ? (
        <Controls>
          <Label>
            <div>Search ID</div>
            <input
              type="text"
              value={searchId}
              onChange={(e) => {
                changeHandler("searchId", e.target.value);
              }}
            />
          </Label>
          <Label>
            <div>Note</div>
            <input
              type="text"
              value={note}
              onChange={(e) => {
                changeHandler("note", e.target.value);
              }}
            />
          </Label>
        </Controls>
      ) : (
        <Controls>
          <Label>
            <div>Search Term</div>
            <input
              type="text"
              value={term}
              onChange={(e) => {
                changeHandler("term", e.target.value);
              }}
            />
          </Label>
          <Label>
            <div>Max Chaos</div>
            <input
              style={{ textAlign: "right" }}
              type="number"
              value={maxChaos}
              onChange={(e) => {
                changeHandler("maxChaos", parseInt(e.target.value, 10));
              }}
            />
          </Label>
        </Controls>
      )}
    </Container>
  );
}
