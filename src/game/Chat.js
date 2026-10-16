// Use only the public fields displayed by the chatbox.
import User from '../services/User';
export function chatMessage(message) {
  if (!message || typeof message !== 'object') return null;
  if (message.type === 'text' && typeof message.text === 'string') {
    const names = ['Vous', 'Adversaire', 'Joueur 1', 'Joueur 2', 'Spectateur'];
    const from = Number.isInteger(message.from) ? names[message.from] : message.from;
    return {from: typeof from === 'string' && from ? from : '?', text: message.text};
  }
  if (message.type === 'info')
    return {text: (Number.isInteger(message.info) && ['Commande inconnue', 'Commande exécutée', 'Commande échouée', 'Commande réservée aux comptes de niveau 5.', 'Observation activée : les deux mains sont visibles.'][message.info]) || 'Commande inconnue'};
  return null;
}

export function sendChat(game, text) {
  if (game.unmounted) return {ok: false, error: 'Cette partie est fermée.'};
  if (!game.props.room || game.state.waiting || !['player', 'spectator'].includes(game.role))
    return {ok: false, error: 'La chatbox n’est pas disponible.'};
  if (!game.socket || !game.socket.connected || game.state.pending)
    return {ok: false, error: 'Connexion au serveur indisponible.'};
  if (typeof text !== 'string' || !text.trim() || text.length > 120)
    return {ok: false, error: 'Le message doit contenir entre 1 et 120 caractères.'};
  if (/^\/watch(?:\s|$)/.test(text)) {
    const account = User.isConnected() ? User.getData() : null;
    game.socket.emit('chat', text, account ? {idMember: account.idMember, token: account.token} : null);
  } else game.socket.emit('chat', text);
  return {ok: true, sent: true};
}
