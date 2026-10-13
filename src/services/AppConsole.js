import User from './User';
import {decodeDeck, deckContent, encodeDeck, importDeck} from './DeckData';
import sorter from '../utility/CollectionSorter';
import {formatCard, readOfficial} from '../game/console/ReadCard';
import registerWebMCP, {valid} from '../game/console/WebMCP';
import {definitions, filterProperties, HELP} from './AppToolDefinitions';

export default class AppConsole {
  constructor(app, host = window, output = console) {
    this.app = app;
    this.host = host;
    this.output = output;
    const methods = {
      read: name => { const text = readOfficial(this.catalogue(), name); output.log(text); return text; },
      help: () => { const text = HELP + (this.gameHelp ? '\n\n' + this.gameHelp : ''); output.log(text); return text; },
      searchCards: (options = {}) => this.search(options, false),
      readCards: (options = {}) => this.search(options, true),
      decks: () => this.decks(), deckNew: (options = {}) => this.open(null, options),
      deckOpen: id => this.open(id), deckView: () => this.view(),
      deckUpdate: changes => this.update(changes), deckSave: () => this.save()
    };
    const api = {};
    Object.keys(methods).forEach(name => { api[name] = async (...args) => {
      try {
        if (this.disposed) throw new Error('Cette interface est fermée.');
        return await methods[name](...args);
      } catch (error) { return {ok: false, error: error.message}; }
    }; });
    this.api = Object.freeze(api);
  }

  mount() {
    this.former = Object.getOwnPropertyDescriptor(this.host, 'sensuba');
    Object.defineProperty(this.host, 'sensuba', {configurable: true, value: this.api});
    // GameConsole can share these global methods without registering duplicate tools.
    appConsoles.set(this.host, this);
    this.bridge = registerWebMCP(this.host, this.api, this.output, definitions, false);
  }

  dispose() {
    this.disposed = true;
    if (this.bridge) this.bridge.dispose();
    appConsoles.delete(this.host);
    if (this.host.sensuba === this.api) {
      if (this.former) Object.defineProperty(this.host, 'sensuba', this.former);
      else delete this.host.sensuba;
    }
  }

  catalogue() {
    if (!Array.isArray(this.app.state.cards)) throw new Error('Catalogue en cours de chargement. Réessayez dans quelques instants.');
    return this.app.state.cards.filter(card => card.author === 0 || card.author === '0');
  }

  search(options, full) {
    this.validate(full ? 'readCards' : 'searchCards', options);
    let filters = options.filters;
    if (filters === undefined) {
      filters = this.filters || {};
      if (!this.filters && this.host.location.pathname.indexOf('/cards') === 0) {
        const params = new URL(this.host.location.href).searchParams;
        Object.keys(filterProperties).forEach(key => {
          if (!params.has(key) || params.get(key) === '') return;
          const value = params.get(key);
          filters[key] = key === 'colors' ? value.split(',').map(Number)
            : filterProperties[key].type === 'integer' ? Number(value) : value;
        });
      }
    }
    this.validate('searchCards', {filters});
    filters = JSON.parse(JSON.stringify(filters));
    const normalized = Object.assign({orderBy: 'type'}, filters);
    ['mana', 'atk', 'hp', 'range', 'edition'].forEach(key => {
      if (normalized[key] !== undefined) {
        normalized[key] = String(normalized[key]);
        if (key !== 'edition' && !normalized[key + 'op']) normalized[key + 'op'] = '3';
      }
    });
    const matches = sorter.filter(this.catalogue().slice(), normalized);
    this.filters = filters;
    const page = options.page || 1, limit = options.limit || 20;
    return {ok: true, filters, total: matches.length, page, limit, pages: Math.ceil(matches.length / limit),
      cards: matches.slice((page - 1) * limit, page * limit).map(card => Object.assign({
        id: Number(card.idCardmodel), name: card.nameCard, type: card.cardType,
        colors: [card.idColor, card.idColor2].filter(color => color !== undefined && color !== null), mana: card.mana
      }, full ? {text: formatCard(card)} : {}))};
  }

  validate(name, input) {
    const definition = definitions.find(d => d[0] === name);
    if (!valid(input, {type: 'object', properties: definition[2], required: definition[3]}))
      throw new Error('Arguments invalides. Consultez sensuba.help() ou le schéma WebMCP.');
  }

  account() {
    if (!User.isConnected()) throw new Error('Connectez-vous à votre compte pour gérer vos decks.');
  }

  outsideGame() {
    if (this.gameHelp) throw new Error('Quittez la partie avant d’ouvrir ou modifier un deck.');
  }

  async decks() {
    this.account();
    const rows = await new Promise((resolve, reject) => this.app.props.options.api.getMyDecks(resolve,
      () => reject(new Error('Impossible de charger vos decks. Réessayez.'))));
    this.account();
    return {ok: true, decks: rows.map(row => {
      const deck = decodeDeck(row);
      return Object.assign(deckContent(deck), {id: Number(deck.idDeck)});
    })};
  }

  async open(id, options = {}) {
    this.account(); this.outsideGame();
    this.validate(id === null ? 'deckNew' : 'deckOpen', id === null ? options : {id});
    if (this.opening) throw new Error('Un éditeur est déjà en cours d’ouverture.');
    if (this.editor) {
      if (id !== null && String(this.editor.deckId) === String(id)) return this.view();
      throw new Error('Fermez ou enregistrez l’éditeur actuel avant d’en ouvrir un autre.');
    }
    this.opening = true;
    try {
      if (id !== null) {
        await new Promise((resolve, reject) => {
          const timer = setTimeout(() => reject(new Error('Impossible de charger vos decks. Réessayez.')), 20000);
          this.app.updateDecks(() => { clearTimeout(timer); resolve(); },
            () => { clearTimeout(timer); reject(new Error('Impossible de charger vos decks.')); });
        });
        if (!this.app.state.decks.some(deck => String(deck.idDeck) === String(id)))
          throw new Error('Ce deck n’appartient pas à votre compte ou n’existe plus.');
      }
      this.account(); this.outsideGame();
      if (this.editor) throw new Error('Un éditeur a été ouvert entre-temps. Utilisez deckView() pour le consulter.');
      const history = this.app.router && this.app.router.history;
      if (!history) throw new Error('La page est encore en cours de chargement.');
      const format = options.format || 'standard';
      const path = id !== null ? '/decks/builder/' + id : '/decks/' + (format === 'standard' ? 'builder' : format);
      return await new Promise((resolve, reject) => {
        const timer = setTimeout(() => { this.onEditor = null; reject(new Error('L’éditeur n’a pas pu être ouvert.')); }, 10000);
        this.onEditor = () => {
          clearTimeout(timer); this.onEditor = null;
          try { resolve(this.view()); } catch (error) { reject(error); }
        };
        history.push(path);
      });
    } finally { this.opening = false; }
  }

  attachEditor(editor) { this.editor = editor; if (this.onEditor) this.onEditor(); }
  detachEditor(editor) { if (this.editor === editor) this.editor = null; }

  current() {
    this.account(); this.outsideGame();
    if (!this.editor || this.editor.unmounted) throw new Error('Ouvrez un deck avec deckNew() ou deckOpen(id).');
    return this.editor;
  }

  view() {
    const editor = this.current(), deck = deckContent(editor.state.deck);
    const count = Object.values(deck.cards).reduce((sum, n) => sum + Number(n), 0);
    return {ok: true, id: editor.state.new ? null : Number(editor.deckId), deck,
      count, complete: !!deck.hero && count === (deck.format === 'highlander' ? 60 : 30),
      saving: !!editor.saving, supercode: encodeDeck(deck)};
  }

  validateDeck(deck, editor) {
    const list = editor.loadCardlist(deck.format);
    const hero = list.find(card => Number(card.idCardmodel) === Number(deck.hero) && card.cardType === 'hero');
    if (!hero) throw new Error('Choisissez un héros disponible dans ce format.');
    if (typeof deck.name !== 'string' || !deck.name.trim() || deck.name.length > 120) throw new Error('Le nom doit contenir entre 1 et 120 caractères.');
    if (!deck.cards || typeof deck.cards !== 'object' || Array.isArray(deck.cards)) throw new Error('Liste de cartes invalide.');
    let total = 0;
    Object.keys(deck.cards).forEach(id => {
      const card = list.find(c => String(c.idCardmodel) === id), count = deck.cards[id];
      if (!card || card.cardType === 'hero') throw new Error('Carte indisponible dans ce format : ' + id);
      if (!Number.isInteger(count) || count < 1 || count > (deck.format === 'highlander' || card.count === 1 ? 1 : 2))
        throw new Error('Nombre d’exemplaires interdit pour ' + card.nameCard);
      if (Number(card.idColor) !== 0 && Number(card.idColor) !== Number(hero.idColor) && Number(card.idColor) !== Number(hero.idColor2))
        throw new Error('Couleur incompatible avec le héros : ' + card.nameCard);
      total += count;
    });
    if (total > (deck.format === 'highlander' ? 60 : 30)) throw new Error('Le deck contient trop de cartes.');
    return hero;
  }

  async update(changes) {
    this.validate('deckUpdate', changes);
    const editor = this.current();
    if (editor.saving) throw new Error('Enregistrement en cours ou réponse incertaine. Vérifiez le deck avant de réessayer.');
    if (editor.draft) throw new Error('Terminez les choix du draft dans l’interface.');
    if (changes.supercode && Object.keys(changes).length !== 1) throw new Error('Utilisez supercode seul pour importer le contenu.');
    const deck = changes.supercode ? importDeck(changes.supercode) : deckContent(editor.state.deck);
    // The opened editor owns both identity and format; shared content cannot switch either.
    deck.format = editor.state.deck.format;
    if (changes.name !== undefined) deck.name = changes.name;
    if (changes.hero !== undefined) deck.hero = changes.hero;
    if (changes.background !== undefined) deck.background = changes.background;
    if (changes.clearCards) deck.cards = {};
    const seen = new Set();
    (changes.cards || []).forEach(({id, count}) => {
      if (seen.has(id)) throw new Error('Une carte apparaît plusieurs fois dans la modification.');
      seen.add(id);
      if (count) deck.cards[id] = count; else delete deck.cards[id];
    });
    const hero = this.validateDeck(deck, editor);
    deck.hero = Number(hero.idCardmodel);
    deck.idColor = hero.idColor; deck.idColor2 = hero.idColor2;
    if (!deck.background) deck.background = hero.imgLink;
    await new Promise(resolve => editor.updateDeck(deck, false, resolve));
    return this.view();
  }

  async save() {
    const editor = this.current();
    if (editor.saving) throw new Error('Enregistrement en cours ou réponse incertaine. Vérifiez le deck avant de réessayer.');
    if (editor.draft) throw new Error('Terminez les choix du draft dans l’interface.');
    this.validateDeck(editor.state.deck, editor);
    if (!editor.builder) throw new Error('L’éditeur est en cours de chargement.');
    // The real Save button and WebMCP share selection updates, identity and acknowledgement handling.
    return await new Promise(resolve => {
      const timer = setTimeout(() => resolve({ok: false, uncertain: true,
        error: 'Réponse incertaine. Rechargez pour vérifier le deck avant de réessayer.'}), 25000);
      editor.builder.saveDeck(result => { clearTimeout(timer); resolve(result); });
    });
  }
}

const appConsoles = new WeakMap();
export function appConsoleFor(host) { return appConsoles.get(host); }
