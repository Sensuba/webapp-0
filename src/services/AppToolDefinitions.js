const text = {type: 'string'};
const id = {type: 'integer', minimum: 1};
const stat = {type: 'integer', minimum: 0};
const op = {type: 'string', enum: ['1', '2', '3', '4', '5', '6'], description: '1 >, 2 >=, 3 =, 4 !=, 5 <=, 6 <. Avec une valeur sans opérateur, utilise =.'};
export const filterProperties = {
  search: text, name: text, description: text, archetype: text, anime: text, flavour: text,
  colors: {type: 'array', items: {type: 'integer', minimum: 0, maximum: 5}, description: '0 neutre, 1 blanc, 2 rouge, 3 bleu, 4 vert, 5 noir. Toutes les couleurs de la carte doivent être incluses.'},
  type: {type: 'string', enum: ['', 'hero', 'figure', 'spell', 'secret', 'artifact']},
  rarity: {type: 'string', enum: ['', 'basic', 'common', 'uncommon', 'rare']},
  edition: stat, mana: stat, manaop: op, atk: stat, atkop: op, hp: stat, hpop: op, range: stat, rangeop: op,
  orderBy: {type: 'string', enum: ['type', 'name', 'mana', 'atk', 'hp', 'range', 'color', 'rarity', 'edition', 'anime']}
};
const search = {
  filters: {type: 'object', properties: filterProperties, additionalProperties: false, description: 'Remplace les filtres. {} les efface. Si omis, reprend la dernière recherche ou les filtres de la page Cartes.'},
  page: {type: 'integer', minimum: 1}, limit: {type: 'integer', minimum: 1, maximum: 50}
};
const formats = {type: 'string', enum: ['standard', 'custom', 'display']};
export const definitions = [
  ['read', 'Lit une carte officielle par son nom exact, sans distinction de casse. Disponible sur toutes les pages ; inclut niveaux et jetons.', {name: {type: 'string', minLength: 1}}, ['name'], a => [a.name], true],
  ['help', 'Explique les commandes globales et celles de la partie ouverte.', {}, [], () => [], true],
  ['searchCards', 'Recherche dans le catalogue officiel avec les mêmes filtres que la page Cartes. Retourne IDs et noms, sans changer de page. Pages à partir de 1, 20 cartes par défaut.', search, [], a => [a], true],
  ['readCards', 'Lit le texte complet des cartes officielles filtrées, avec niveaux et jetons. Sans filtres, reprend la recherche précédente. Pages à partir de 1, 20 cartes par défaut.', search, [], a => [a], true],
  ['decks', 'Liste les decks du compte connecté depuis le serveur, avec leurs IDs et leur contenu. Aucun deck adverse.', {}, [], () => [], true],
  ['deckNew', 'Ouvre un nouveau deck dans l’éditeur visible, sans enregistrer. Refuse de remplacer un éditeur déjà ouvert : fermez-le ou enregistrez-le d’abord.', {format: formats}, [], a => [a]],
  ['deckOpen', 'Ouvre un deck existant appartenant au compte connecté dans l’éditeur visible. Utiliser l’ID renvoyé par decks. Refuse de remplacer un autre éditeur ouvert.', {id}, ['id'], a => [a.id]],
  ['deckView', 'Lit le contenu courant de l’éditeur visible et son supercode sans ID. Indique si le deck est complet pour jouer.', {}, [], () => [], true],
  ['deckUpdate', 'Modifie le contenu de l’éditeur visible, sans enregistrer. cards fixe les quantités des IDs indiqués (0 retire) ; clearCards vide d’abord la liste. supercode remplace le contenu et ignore toujours les IDs inclus. Aucune modification partielle en cas d’erreur.', {
    name: {type: 'string', minLength: 1, maxLength: 120}, hero: id,
    cards: {type: 'array', items: {type: 'object', properties: {id, count: {type: 'integer', minimum: 0, maximum: 2}}, required: ['id', 'count'], additionalProperties: false}},
    clearCards: {type: 'boolean'}, supercode: {type: 'string', minLength: 1},
    background: text
  }, [], a => [a]],
  ['deckSave', 'Enregistre le deck de l’éditeur via le compte connecté, puis actualise la liste. Retour saved=true uniquement après confirmation serveur. Un deck incomplet peut être enregistré. Après un délai de réponse dépassé, rechargez pour vérifier avant de réessayer.', {}, [], () => []]
];

export const HELP = `Commandes disponibles partout (console et WebMCP sensuba_<nom>) :
await sensuba.read('Holo, Déesse des Moissons') : carte officielle, niveaux et jetons.
await sensuba.searchCards({filters:{type:'figure',colors:[0,2],mana:2,manaop:'5'},page:1,limit:20}) : IDs et noms.
await sensuba.readCards({page:1,limit:10}) : texte des cartes de la dernière recherche.
Filtres : search, name, description, archetype, anime, flavour, colors, type, rarity, edition,
mana/manaop, atk/atkop, hp/hpop, range/rangeop, orderBy. Opérateurs : 1 >, 2 >=, 3 =, 4 !=, 5 <=, 6 <.
Couleurs : 0 neutre, 1 blanc, 2 rouge, 3 bleu, 4 vert, 5 noir. filters:{} efface les filtres.
La recherche n’ouvre pas de page. Les résultats sont paginés (1 à 50 cartes, pages à partir de 1).
await sensuba.decks() : liste des decks de votre compte.
await sensuba.deckNew() / await sensuba.deckOpen(42) : ouvrir un éditeur.
await sensuba.deckView() : contenu courant et supercode partageable sans ID.
await sensuba.deckUpdate({hero:3,name:'Mon deck',cards:[{id:775,count:1}]}) : fixer les quantités (0 retire).
await sensuba.deckUpdate({supercode:'...'}) : remplacer le contenu de l’éditeur, jamais son identité.
await sensuba.deckSave() : enregistrer et attendre la confirmation serveur.
Les commandes de deck exigent une connexion au compte. La modification passe par l’éditeur visible, hors partie.
Un éditeur déjà ouvert doit être fermé ou enregistré avant d’en ouvrir un autre.`;
