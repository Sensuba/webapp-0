// A shared deck code describes content, never the identity of a saved deck.
export function deckContent(deck) {
  const content = {};
  ['name', 'hero', 'cards', 'background', 'format', 'idColor', 'idColor2'].forEach(key => {
    if (deck[key] !== undefined) content[key] = deck[key];
  });
  return JSON.parse(JSON.stringify(content));
}

export function encodeDeck(deck) {
  // Keep the existing Latin-1 base64 format; escape other Unicode characters.
  return window.btoa(JSON.stringify(deckContent(deck)).replace(/[\u0100-\uffff]/g,
    character => '\\u' + ('0000' + character.charCodeAt(0).toString(16)).slice(-4)));
}

export function importDeck(supercode, idDeck) {
  const deck = deckContent(JSON.parse(window.atob(supercode)));
  if (!deck.hero || !deck.cards || typeof deck.cards !== 'object' || Array.isArray(deck.cards))
    throw new Error('Code de deck invalide.');
  if (idDeck !== undefined && idDeck !== null) deck.idDeck = idDeck;
  return deck;
}

export function decodeDeck(row) {
  const deck = importDeck(row.supercode, row.idDeck);
  deck.author = row.author;
  return deck;
}
