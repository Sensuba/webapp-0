// Explicit projection: never serialize a model, notification, blueprint or log.
export function visibleCard(card, viewer, watchHands = false) {
  if (!card || !card.location) return false;
  const location = card.location;
  const own = location.area.id.no === viewer;
  if (location.id.type === 'deck') return false;
  if (location.id.type === 'hand' && watchHands) return !!card.nameCard;
  if (['hand', 'choosebox'].includes(location.id.type) && !own) return false;
  if (card.isType('secret') && !own) return false;
  if (card.invisible && (viewer === undefined || card.invisible.for === viewer)) return false;
  return !!card.nameCard && (own || location.public === true);
}

const scalar = value => value === null || ['string', 'number', 'boolean'].includes(typeof value);
function pick(source, fields) {
  const result = {};
  fields.forEach(key => { if (scalar(source[key])) result[key] = source[key]; });
  return result;
}

export function cardView(card, viewer, watchHands = false) {
  if (!card) return null;
  if (!visibleCard(card, viewer, watchHands)) return {hidden: true};
  const eff = card.eff;
  const result = Object.assign({ref: 'card:' + card.id.no}, pick(eff, [
    'nameCard', 'description', 'cardType', 'level', 'mana', 'atk', 'hp', 'chp', 'range',
    'armor', 'ol', 'overload', 'actionPt', 'motionPt', 'skillPt', 'firstTurn',
    'furyState', 'furyFirstAttackWasHero', 'charges', 'activationPt', 'activation', 'silenced',
    'poisondmg', 'lastwill', 'mecha', 'outOfMecha'
  ]));
  result.states = Object.keys(eff.states || {}).filter(key => eff.states[key] === true);
  result.shield = !!card.hasShield;
  result.trial = (card.steps || []).map(step => pick(step, ['step', 'completed']));
  result.marks = ['sakuramark', 'reipromote', 'acceleratorvector', 'chiseenchant', 'atsukobewitch', 'natsumemark']
    .filter(mark => card.variables && card.variables[mark]);
  result.faculties = (card.faculties || []).map((faculty, i) => Object.assign({
    number: i + 1, targeted: !!faculty.target
  }, pick(faculty, ['desc', 'cost'])));
  if (card.isType('secret') && card.area.id.no === viewer) {
    result.secret = {effect: Number.isInteger(card.secreteffect) ? card.secreteffect + 1 : null, count: card.secretcount};
  }
  if (card.pilot && visibleCard(card.pilot, viewer))
    result.pilot = pick(card.pilot.eff, ['nameCard', 'description', 'atk', 'hp', 'chp']);
  return result;
}

export function sideName(area, viewer) {
  return viewer === undefined ? 'player' + (area.id.no + 1) : (area.id.no === viewer ? 'me' : 'opponent');
}

export function boardView(game) {
  const model = game.store.getState();
  const viewer = game.role === 'player' && Number.isInteger(game.no) ? game.no : undefined;
  const players = {};
  model.areas.forEach(area => {
    const side = sideName(area, viewer);
    const own = area.id.no === viewer;
    const list = location => location.cards.map(card => cardView(card, viewer, game.watchHands));
    players[side] = {
      name: area.name || '',
      mana: pick(area.manapool, ['mana', 'maxMana', 'gems', 'extramana', 'usableMana']),
      extraTurns: area.extraTurns || 0,
      deck: {count: area.deck.count, fatigue: area.deck.curse, increment: area.deck.curseInc},
      hand: own || game.watchHands ? {count: area.hand.count, cards: list(area.hand)} : {count: area.hand.count},
      board: area.field.tiles.map((tile, i) => ({
        ref: side + ':' + (i + 1), number: i + 1, row: i < 4 ? 'front' : 'back',
        hazards: tile.hazards.filter(h => typeof h === 'string'),
        card: tile.occupied ? cardView(tile.card, viewer) : null
      })),
      court: list(area.court), honorboard: list(area.honorboard),
      cemetery: list(area.cemetery), discard: list(area.discard),
      choosebox: own ? {opened: !!area.choosebox.opened, cards: area.choosebox.opened ? list(area.choosebox) : []}
        : {opened: !!area.choosebox.opened}
    };
  });
  return JSON.parse(JSON.stringify({
    version: 1, role: viewer === undefined ? 'spectator' : 'player',
    started: !!model.started, result: model.gamestate,
    connected: !!game.socket && !!game.socket.connected && !game.state.pending,
    revision: game.revision || 0, receivedRevision: game.receivedRevision || 0,
    displayRevision: game.displayRevision || 0, updating: !!game.dispatching,
    turn: model.currentArea ? sideName(model.currentArea, viewer) : null,
    players
  }));
}

// Both operands are already filtered snapshots. Paths use 1-based array indices.
export function changesBetween(before, after, path = '') {
  if (JSON.stringify(before) === JSON.stringify(after)) return [];
  if (before && after && typeof before === 'object' && typeof after === 'object' && Array.isArray(before) === Array.isArray(after)) {
    const keys = Array.from(new Set(Object.keys(before).concat(Object.keys(after))));
    return keys.reduce((changes, key) => changes.concat(changesBetween(before[key], after[key],
      path + (path ? '.' : '') + (Array.isArray(after) ? Number(key) + 1 : key))), []);
  }
  return [{path, before: before === undefined ? null : before, after: after === undefined ? null : after}];
}
