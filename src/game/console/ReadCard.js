const types = {figure: 'Figure', hero: 'Héros', spell: 'Sort', secret: 'Secret', artifact: 'Artéfact', seal: 'Sceau', world: 'Monde'};
const colors = ['neutre', 'blanc', 'rouge', 'bleu', 'vert', 'noir'];
const feminine = ['neutre', 'blanche', 'rouge', 'bleue', 'verte', 'noire'];
const filled = value => value !== undefined && value !== null && value !== '';

function body(card) {
  const lines = [];
  if (['figure', 'hero'].includes(card.cardType) || card.mecha)
    lines.push([card.atk, card.hp, card.range].map(value => filled(value) ? value : '?').join('/'));
  else if (card.cardType === 'artifact' && filled(card.hp)) lines.push('Durabilité : ' + card.hp);
  if (Array.isArray(card.archetypes) && card.archetypes.length) lines.push(card.archetypes.join(', '));
  if (card.description) lines.push(card.description.trim());
  if (Number(card.overload) > 0) lines.push('Surcharge : ' + card.overload);
  if (card.mecha && filled(card.activation)) lines.push('Activation : ' + card.activation);
  return lines;
}

export function formatCard(card) {
  const palette = card.cardType === 'figure' ? feminine : colors;
  const color = [card.idColor, card.idColor2].filter((id, i, ids) => filled(id) && (i === 0 || Number(id) !== 0) && ids.indexOf(id) === i)
    .map(id => palette[Number(id)]).filter(Boolean).join(' / ');
  const heading = (types[card.cardType] || 'Carte') + (color ? ' ' + color : '')
    + (filled(card.mana) ? ', ' + card.mana + ' mana' : '');
  const lines = [card.nameCard, heading].concat(body(card));
  [['lv2', 'Niveau 2'], ['lvmax', 'Niveau maximum'], ['mechactive', 'Mecha activé']].forEach(([key, title]) => {
    if (card[key]) lines.push(title + ' :', ...body(Object.assign({}, card, card[key])));
  });
  return lines.join('\n');
}

export function readOfficial(cards, query) {
  if (typeof query !== 'string' || !query.trim()) throw new Error('Indiquez le nom exact d’une carte officielle.');
  const name = query.trim().toLocaleLowerCase('fr');
  const matches = cards.filter(card => (card.author === 0 || card.author === '0')
    && typeof card.nameCard === 'string' && card.nameCard.toLocaleLowerCase('fr') === name);
  if (!matches.length) throw new Error('Aucune carte officielle trouvée sous ce nom.');
  // Same-name reprints with identical rules should not repeat the whole card.
  return Array.from(new Set(matches.map(formatCard))).join('\n\n');
}
