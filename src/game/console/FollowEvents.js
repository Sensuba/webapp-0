import {visibleCard} from './VisibleBoard';

// Format before compute mutates locations or destroys the source. Return only text.
export default function describeEvent(game, event) {
  const board = game.store.getState();
  const viewer = game.role === 'player' ? game.no : undefined;
  const data = event.data || [];
  const find = id => id && board.find(id);
  const source = find(event.src);
  const player = area => !area ? 'Un joueur' : viewer === undefined ? 'Le joueur ' + (area.id.no + 1)
    : area.id.no === viewer ? 'Vous' : 'L’adversaire';
  const possessive = area => !area ? '' : viewer === undefined ? 'du joueur ' + (area.id.no + 1)
    : area.id.no === viewer ? 'de votre camp' : 'du camp adverse';
  const square = tile => 'case ' + (tile.area.field.tiles.indexOf(tile) + 1) + ' ' + possessive(tile.area);
  const name = (card, revealed = false) => {
    if (!card) return 'une carte';
    // burncard and triggersecret are explicit public reveals; no other event can
    // name a card merely because an old identity is still cached in the model.
    if ((revealed || visibleCard(card, viewer)) && card.nameCard) return card.nameCard;
    return card.isType('secret') && card.onBoard ? 'un secret' : 'une carte';
  };
  const label = card => name(card) + (card && card.onBoard ? ' (' + square(card.location) + ')' : '');
  const target = id => {
    const item = find(id);
    if (!item) return '';
    if (id.type === 'tile') return item.occupied ? label(item.card) : square(item);
    if (id.type === 'card') return label(item);
    if (id.type === 'area') return player(item).toLowerCase();
    return '';
  };
  const towards = id => { const text = target(id); return text ? ' → ' + text : ''; };
  const area = source && (source.id.type === 'area' ? source : source.area);
  switch (event.type) {
    case 'draw':
      return player(area) + (area && area.id.no === viewer ? ' piochez ' : ' pioche ') + name(find(data[0])) + '.';
    case 'cardmove': {
      const to = find(data[0]);
      const from = find(data[1]) || (source && source.location);
      if (!source || !from || !to || from.id.type !== 'tile' || to.id.type !== 'tile' || from === to) return null;
      return name(source) + ' se déplace : ' + square(from) + ' → ' + square(to) + '.';
    }
    case 'playcard': {
      const place = find(data[0]);
      return player(area) + (area && area.id.no === viewer ? ' jouez ' : ' joue ') + name(source)
        + (place && place.id.type === 'tile' ? ' en ' + square(place) : '') + towards(data[2] || data[1]) + '.';
    }
    case 'summon':
      return name(source) + ' est invoqué' + (find(data[0]) ? ' en ' + square(find(data[0])) : '') + '.';
    case 'destroycard':
    case 'discardcard':
      if (!source || !source.onBoard || !source.isType('entity')) return null;
      return label(source) + ' est détruit.';
    case 'triggersecret': {
      const effect = data[0] && typeof data[0].value === 'string' ? data[0].value.trim() : '';
      return 'Secret déclenché ' + possessive(area) + ' : ' + name(source, true) + towards(data[1])
        + (effect ? ' — ' + effect : '.');
    }
    case 'cardfaculty': {
      const action = data[0] && data[0].value;
      const effect = data[2] && typeof data[2].value === 'string' ? data[2].value.trim() : '';
      return label(source) + ' utilise ' + (action ? 'une action' : 'une compétence') + towards(data[1])
        + ' : ' + (effect || (action ? 'Crée un réceptacle de mana.' : 'Activation.'));
    }
    case 'charattack': return label(source) + ' attaque ' + target(data[0]) + '.';
    case 'newturn': return source && source.id.no === viewer ? 'Votre tour commence.'
      : viewer === undefined ? 'Le tour du joueur ' + (source.id.no + 1) + ' commence.' : 'Le tour adverse commence.';
    case 'endturn': return source && source.id.no === viewer ? 'Votre tour se termine.'
      : viewer === undefined ? 'Le tour du joueur ' + (source.id.no + 1) + ' se termine.' : 'Le tour adverse se termine.';
    case 'burncard': return 'Carte brûlée / détruite du deck ' + possessive(area) + ' : ' + name(find(data[0]), true) + '.';
    case 'fatigue':
      return 'Malédiction du deck ' + possessive(area) + towards(area && area.hero && area.hero.id) + '.';
    case 'end': {
      const result = data[0] && data[0].no;
      if (result === 3) return 'Victoire !';
      if (result === 4) return 'Défaite.';
      if (result === 2) return 'Égalité.';
      return null;
    }
    default: return null;
  }
}
