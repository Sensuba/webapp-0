const card = {type: 'string', pattern: '^(me:[1-9]|opponent:[1-9]|hand:[1-9][0-9]*|card:[0-9]+)$', description: 'Référence visible donnée par sensuba_view : me:1…9, opponent:1…9, hand:1… ou card:N.'};
const tile = {type: 'string', pattern: '^(me|opponent):[1-9]$', description: 'Case 1…9 : avant 1–4, arrière 5–9 ; me = votre camp, opponent = adversaire.'};
const tiles = {type: 'array', items: tile};
const number = {type: 'integer', minimum: 1};

// The adapter only receives the public console API, never the model or socket.
export const definitions = [
  ['view', 'Lit le plateau en JSON, sans informations cachées. À relire après chaque action.', {}, [], () => [false], true],
  ['help', 'Explique les commandes Sensuba, les références et les règles de contrôle.', {}, [], () => [], true],
  ['read', 'Lit une carte officielle (author = 0) par son nom exact, sans distinction de casse.', {name: {type: 'string', minLength: 1}}, ['name'], a => [a.name], true],
  ['follow', 'Active ou coupe le suivi en phrases des événements de jeu et des messages de chatbox, dont les alertes de tour à 60/30 secondes. Lire ensuite les logs console.', {enabled: {type: 'boolean', default: true}}, [], a => [a.enabled === undefined ? true : a.enabled], false],
  ['chat', 'Envoie un message dans la chatbox de la salle (joueurs et spectateurs), même hors de votre tour ou pendant un choix. Les commandes /… existantes sont interprétées par le serveur comme dans la chatbox.', {text: {type: 'string', minLength: 1, maxLength: 120}}, ['text'], a => [a.text]],
  ['actions', 'Liste les actions actuellement autorisées et leurs arguments. Avec une boîte de choix ouverte, seule choose est autorisée.', {}, [], () => [], true],
  ['targets', 'Donne les prochaines cases cibles pour jouer une carte. Compléter selected dans l’ordre jusqu’à complete=true.', {card, selected: tiles}, ['card'], a => [a.card, a.selected || []], true],
  ['play', 'Joue une carte de votre main avec toutes ses cibles dans l’ordre, placement inclus. Utiliser targets pour construire la sélection.', {card, targets: tiles}, ['card'], a => [a.card, a.targets || []]],
  ['attack', 'Attaque la carte cible avec votre personnage, selon les règles et points d’action disponibles.', {card, target: card}, ['card', 'target'], a => [a.card, a.target]],
  ['move', 'Déplace votre personnage vers une case autorisée.', {card, target: tile}, ['card', 'target'], a => [a.card, a.target]],
  ['faculty', 'Utilise une action ou compétence de votre carte. number commence à 1 ; target est omis sans cible.', {card, number, target: tile}, ['card', 'number'], a => [a.card, a.number, a.target]],
  ['secret', 'Règle votre secret : effect avec value à partir de 1, count avec value de 0 à 5, ou destroy sans value.', {card, setting: {type: 'string', enum: ['effect', 'count', 'destroy']}, value: {type: 'integer', minimum: 0}}, ['card', 'setting'], a => [a.card, a.setting, a.value]],
  ['choose', 'Choisit la carte numéro number (à partir de 1) dans votre boîte de choix ouverte.', {number}, ['number'], a => [a.number]],
  ['endTurn', 'Termine votre tour. Interdit tant que votre boîte de choix est ouverte.', {}, [], () => []],
  ['concede', 'Abandonne immédiatement la partie. Interdit tant que votre boîte de choix est ouverte.', {}, [], () => []]
];

export function valid(value, schema) {
  if (schema.type === 'object') return !!value && typeof value === 'object' && !Array.isArray(value)
    && (schema.required || []).every(key => Object.prototype.hasOwnProperty.call(value, key))
    && Object.keys(value).every(key => Object.prototype.hasOwnProperty.call(schema.properties, key) && valid(value[key], schema.properties[key]));
  if (schema.type === 'array') return Array.isArray(value) && value.every(item => valid(item, schema.items));
  if (schema.type === 'integer') return Number.isSafeInteger(value) && (schema.minimum === undefined || value >= schema.minimum)
    && (schema.maximum === undefined || value <= schema.maximum);
  if (typeof value !== schema.type) return false;
  if (schema.enum && schema.enum.indexOf(value) < 0) return false;
  if (schema.pattern && !new RegExp(schema.pattern).test(value)) return false;
  if (schema.maxLength !== undefined && value.length > schema.maxLength) return false;
  return !schema.minLength || value.length >= schema.minLength;
}

function result(value) {
  return {content: [{type: 'text', text: typeof value === 'string' ? value : JSON.stringify(value)}], isError: !!(value && value.ok === false)};
}

function createTool(api, [method, description, properties, required, args, readOnly = false], isDisposed, game) {
  return {
    name: 'sensuba_' + method,
    description: description + (!game || readOnly || method === 'follow' ? '' : ' Retour sent=true signifie envoi, pas confirmation serveur. Relire sensuba_view avant l’action suivante.'),
    inputSchema: {type: 'object', properties, required, additionalProperties: false},
    annotations: {readOnlyHint: readOnly},
    execute: async (input = {}) => {
      if (isDisposed()) return result({ok: false, error: 'Cette interface est fermée.'});
      if (!input || typeof input !== 'object' || Array.isArray(input)
        || required.some(key => !Object.prototype.hasOwnProperty.call(input, key))
        || Object.keys(input).some(key => !Object.prototype.hasOwnProperty.call(properties, key) || !valid(input[key], properties[key])))
        return result({ok: false, error: 'Arguments invalides. Consultez le schéma de la commande.'});
      try { return result(await api[method](...args(input))); }
      catch (error) { return result({ok: false, error: 'Commande indisponible. Relisez la vue de la partie.'}); }
    }
  };
}

export default function registerWebMCP(host, api, output, selected = definitions, game = true) {
  const modern = host.document && host.document.modelContext;
  const context = modern || (host.navigator && host.navigator.modelContext);
  if (!context || typeof context.registerTool !== 'function') return {ready: Promise.resolve(false), dispose() {}};
  const abort = host.AbortController ? new host.AbortController() : null;
  const names = [];
  let disposed = false;
  const isDisposed = () => disposed;
  const remove = () => {
    if (abort) abort.abort();
    // Older Chromium implementations use navigator.modelContext/unregisterTool.
    if (typeof context.unregisterTool === 'function') names.splice(0).forEach(name => {
      try { context.unregisterTool(name); } catch (error) { /* Already removed by abort. */ }
    });
  };
  const dispose = () => { disposed = true; remove(); };
  const ready = (async () => {
    try {
      for (const definition of selected) {
        if (disposed) return false;
        const tool = createTool(api, definition, isDisposed, game);
        await context.registerTool(tool, abort ? {signal: abort.signal} : undefined);
        names.push(tool.name);
        if (disposed) { remove(); return false; }
      }
      return true;
    } catch (error) {
      const report = !disposed;
      dispose();
      if (report) output.log('WebMCP indisponible dans ce navigateur ; la console Sensuba reste disponible.');
      return false;
    }
  })();
  return {ready, dispose};
}
