const types = {figure: 'Figure', hero: 'Héros', spell: 'Sort', secret: 'Secret', artifact: 'Artéfact', seal: 'Sceau', world: 'Monde'};
const colors = ['neutre', 'blanc', 'rouge', 'bleu', 'vert', 'noir'];
const feminine = ['neutre', 'blanche', 'rouge', 'bleue', 'verte', 'noire'];
const filled = value => value !== undefined && value !== null && value !== '';

function body(card) {
  const lines = [];
  if (card.cardType === 'hero')
    lines.push([card.atk, card.range].map(value => filled(value) ? value : '?').join('/'));
  else if (card.cardType === 'figure' || card.mecha)
    lines.push([card.atk, card.hp, card.range].map(value => filled(value) ? value : '?').join('/'));
  else if (card.cardType === 'artifact' && filled(card.hp)) lines.push('Durabilité : ' + card.hp);
  if (Array.isArray(card.archetypes) && card.archetypes.length) lines.push(card.archetypes.join(', '));
  if (card.description) lines.push(card.description.trim());
  if (card.cardType !== 'spell' && Number(card.overload) > 0) lines.push('Surcharge : ' + card.overload);
  if (card.mecha && filled(card.activation)) lines.push('Activation : ' + card.activation);
  return lines;
}

function formatSection(card, token) {
  const palette = card.cardType === 'figure' ? feminine : colors;
  const color = [card.idColor, card.idColor2].filter((id, i, ids) => filled(id) && (i === 0 || Number(id) !== 0) && ids.indexOf(id) === i)
    .map(id => palette[Number(id)]).filter(Boolean).join(' et ');
  const heading = (types[card.cardType] || 'Carte') + (color ? ' ' + color : '')
    + (card.cardType !== 'hero' && filled(card.mana) ? ', ' + card.mana + ' mana' : '')
    + (card.cardType === 'spell' && Number(card.overload) > 0 ? ' (limite ' + card.overload + ')' : '');
  const lines = [card.nameCard + (token ? ' (jeton)' : ''), heading];
  if (card.cardType === 'hero') {
    if (filled(card.hp)) lines.push(card.hp + ' PV');
    lines.push('', 'Nv 1', ...body(card));
    [['lv2', 'Nv 2'], ['lvmax', 'Nv MAX']].forEach(([key, title]) => {
      if (card[key]) lines.push('', title, ...body(Object.assign({}, card, {description: '', overload: 0}, card[key])));
    });
  } else lines.push(...body(card));
  if (card.mechactive) lines.push('', 'Mecha activé :', ...body(Object.assign({}, card, {description: '', overload: 0}, card.mechactive)));
  return lines.join('\n');
}

export function formatCard(card) {
  const sections = [];
  const visit = (current, token, ancestors) => {
    if (!current || typeof current !== 'object' || ancestors.includes(current)) return;
    sections.push(formatSection(current, token));
    const path = ancestors.concat([current]);
    const addTokens = source => {
      if (source && Array.isArray(source.tokens)) source.tokens.forEach(child => visit(child, true, path));
    };
    addTokens(current);
    ['lv2', 'lvmax', 'mechactive'].forEach(key => addTokens(current[key]));
  };
  visit(card, false, []);
  return sections.join('\n\n');
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
