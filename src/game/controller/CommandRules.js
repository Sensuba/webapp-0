// Shared by mouse controls and the console. Never infer ownership from the turn.
export function commandError(game, command) {
  const board = game.store.getState();
  const area = board.areas[game.no];
  if (game.unmounted || game.isReplay || game.role !== 'player' || !area)
    return 'Lecture seule : vous ne contrôlez aucun joueur.';
  if (!board.started || board.gamestate || game.ended)
    return 'La partie n’est pas active.';
  if (!game.socket || !game.socket.connected || game.state.pending)
    return 'Connexion au serveur indisponible.';
  if (!command || typeof command.type !== 'string') return 'Commande invalide.';

  const box = board.currentArea && board.currentArea.choosebox;
  if (box && box.opened) {
    if (command.type !== 'choose') return 'Choisissez dans la boîte de choix avant toute autre action.';
    const card = find(board, command.id, 'card');
    return board.currentArea === area && card && card.location === box && box.hasCard(card)
      ? null : 'Ce choix n’est pas disponible.';
  }
  if (command.type === 'choose') return 'Aucune boîte de choix ouverte.';
  if (command.type === 'concede') return null;
  if (board.currentArea !== area) return 'Ce n’est pas votre tour.';
  if (command.type === 'endturn') return null;

  const card = find(board, command.id, 'card');
  if (!card || card.area !== area) return 'Vous ne contrôlez pas cette carte.';
  switch (command.type) {
    case 'play': {
      if (!card.inHand || !card.canBePlayed) return 'Cette carte ne peut pas être jouée.';
      const ids = command.targets === undefined ? [] : command.targets;
      if (!Array.isArray(ids) || ids.length > card.targets.length) return 'Cibles invalides.';
      const targets = ids.map(id => find(board, id, 'tile'));
      if (targets.some(t => !t) || !card.canBePlayedOn(targets)) return 'Cibles invalides.';
      if (targets.length < card.targets.length && card.possibleTargets(card.targets[targets.length]).length)
        return 'Il manque une cible.';
      return null;
    }
    case 'attack': {
      const target = find(board, command.target, 'card');
      return card.canAct && target && card.canAttack(target) ? null : 'Attaque impossible.';
    }
    case 'move': {
      const target = find(board, command.to, 'tile');
      return card.canAct && target && target.area === area && card.canMoveOn(target) ? null : 'Déplacement impossible.';
    }
    case 'faculty': {
      const faculty = Number.isInteger(command.faculty) && (card.faculties || [])[command.faculty];
      if (!card.onBoard || !card.canAct || card.isType('secret') || !faculty || !card.canUse(faculty))
        return 'Faculté indisponible.';
      const target = find(board, command.target, 'tile');
      return faculty.target ? (target && faculty.target(card, target) ? null : 'Cible de faculté invalide.')
        : (command.target === undefined ? null : 'Cette faculté ne prend pas de cible.');
    }
    case 'param': {
      if (!card.onBoard || !card.isType('secret')) return 'Ce n’est pas un secret contrôlable.';
      if (command.option === 'destroy') return null;
      if (command.option === 'setcount')
        return Number.isInteger(command.value) && command.value >= 0 && command.value <= 5 ? null : 'Le compteur doit être entre 0 et 5.';
      if (command.option === 'seteffect') {
        const faculty = Number.isInteger(command.value) && (card.faculties || [])[command.value];
        return faculty && command.value < card.faculties.length - 1 && card.canUse(faculty)
          ? null : 'Effet de secret indisponible.';
      }
      return 'Paramètre inconnu.';
    }
    default: return 'Commande inconnue.';
  }
}

function find(board, id, type) {
  return id && id.type === type && Number.isInteger(id.no) ? board.find(id) : undefined;
}

export function sendCommand(game, command) {
  const error = commandError(game, command);
  if (error) return {ok: false, error};
  game.socket.emit('command', command);
  // The existing protocol has no notification for choice closure or secret settings.
  if (command.type === 'choose') game.store.getState().currentArea.choosebox.close();
  if (command.type === 'param') {
    const card = game.store.getState().find(command.id);
    if (command.option === 'seteffect') card.secreteffect = command.value;
    if (command.option === 'setcount') card.secretcount = command.value;
  }
  game.manager.control(game.isPlaying, {model: game.store.getState()});
  game.forceUpdate();
  return {ok: true, sent: true};
}
