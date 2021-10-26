const synth = window.speechSynthesis;

const sleep = (ms, output = null) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(output);
    }, ms);
  });

export const makePhrase = (listing) => {
  const itemPart = listing.note || listing.item.name || listing.item.typeLine;
  if (listing.price) {
    return `${itemPart} for ${listing.price.amount} ${listing.price.currency}`;
  }

  return itemPart;
};

export const getVoices = async () => {
  for (let n = 0; n < 10000; n++) {
    if (typeof synth.getVoices === "function") {
      return synth.getVoices();
    }
    await sleep(50);
  }
};

export const sayWithVoice = (phrase, voiceURI, volume = 0.5, rate = 1.5) => {
  if (volume <= 0) {
    return;
  }
  const voice = synth.getVoices().find((voice) => voice.voiceURI === voiceURI);
  const utterance = new SpeechSynthesisUtterance(phrase);
  utterance.volume = volume;
  utterance.rate = rate;
  if (voice) {
    utterance.voice = voice;
    synth.speak(utterance);
  }
};
