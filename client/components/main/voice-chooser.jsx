import React, { useEffect } from "react";
import styled from "styled-components";

const Container = styled.div``;

export default function VoiceChooser({ voices, voice, onChange }) {
  useEffect(() => {
    if (!voice && voices.length > 0) {
      const defaultVoice = voices.filter((a) => a.default);
      if (defaultVoice.length > 0) {
        onChange(defaultVoice.pop().voiceURI);
      } else {
        onChange(voices[0].voiceURI);
      }
    }
  }, [voices]);

  return (
    <Container>
      <select
        onChange={(e) => {
          onChange(e.target.value);
        }}
        value={voice}
      >
        {voices
          .sort((a, b) => a.lang.localeCompare(b.lang))
          .map(({ name, voiceURI }) => (
            <option key={voiceURI} value={voiceURI}>
              {name}
            </option>
          ))}
      </select>
    </Container>
  );
}
