import {commandError} from '../controller/CommandRules';
import {boardView, visibleCard, sideName} from './VisibleBoard';
import describeEvent from './FollowEvents';
import {readOfficial} from './ReadCard';
import Library from '../../services/Library';
import registerWebMCP from './WebMCP';

const HELP = `Interface console Sensuba (pendant une partie)
Dans un navigateur compatible WebMCP, les mêmes méthodes sont disponibles comme outils sensuba_<méthode>.
Utiliser les noms et schémas annoncés par le navigateur. follow écrit dans les logs console.
sensuba.view() : affiche et retourne un instantané JSON. view(false) retourne sans afficher.
sensuba.follow() / sensuba.follow(false) : active / coupe les phrases de suivi des événements de jeu.
await sensuba.read('Koito Minase') : affiche et retourne le texte d’une carte officielle (author = 0), sans distinction de casse.
sensuba.actions() : liste les commandes disponibles et leurs arguments.
sensuba.targets(carte, ciblesDéjàChoisies = []) : prochaines cibles pour jouer une carte.
sensuba.play('hand:1', ['me:2', 'opponent:3']) : joue une carte ; [] si aucune cible.
sensuba.attack('me:1', 'opponent:7') : attaque avec la carte de la case 1.
sensuba.move('me:1', 'me:2') : déplace une carte.
sensuba.faculty('me:7', 1, 'opponent:2') : utilise une faculté ; omettre la cible si inutile.
sensuba.secret('me:1', 'effect', 1) : règle l’effet d’un secret (numéros à partir de 1).
sensuba.secret('me:1', 'count', 0) : règle son compteur (0 à 5).
sensuba.secret('me:1', 'destroy') : détruit son secret.
sensuba.choose(1) : choisit la première carte de la boîte de choix.
sensuba.endTurn() : termine le tour. sensuba.concede() : abandonne immédiatement.
sensuba.help() : cette aide.
Références : me:1…me:9 et opponent:1…opponent:9 ; hand:1… ; card:N tel que donné par view().
Cases : avant = 1 2 3 4 ; arrière = 5 6 7 8 9, de gauche à droite à l’écran, pour chaque camp.
Facultés, cartes en main et choix sont numérotés à partir de 1. Relire view() après les changements.
Une boîte de choix ouverte n’autorise que choose(). Les lectures restent disponibles.
Les actions retournent {ok:true, sent:true} (envoi, pas confirmation serveur) ou {ok:false,error}.
follow() annonce seulement les pioches, déplacements, cartes jouées, invocations, destructions,
secrets déclenchés, actions, compétences, attaques, tours, brûlures, malédictions et résultats.
Il avertit à 60 et 30 secondes restantes de votre tour dans une partie chronométrée.
Attendre les événements de follow() / relire view() avant l’action suivante.
Les spectateurs n’ont que la lecture publique. Aucun contenu de deck ni de main/secret adverse n’est exposé.`;

export default class GameConsole {
  constructor(game, output = console) {
    this.game = game;
    this.output = output;
    this.following = false;
    this.turnPlayer = null;
    this.remaining = null;
    this.timerWarnings = new Set();
    // Only bound operations escape: no game/model/socket handles on window.sensuba.
    this.api = Object.freeze({
      view: (print = true) => this.view(print),
      follow: (enabled = true) => this.follow(enabled),
      read: name => this.read(name),
      help: () => { this.output.log(HELP); return HELP; },
      actions: () => this.attempt(() => this.actions()),
      targets: (card, selected = []) => this.attempt(() => this.targets(card, selected)),
      play: (card, targets = []) => this.execute(() => {
        if (!Array.isArray(targets)) throw new Error('Les cibles doivent former un tableau.');
        return {type: 'play', id: this.card(card).id, targets: targets.map(t => this.tile(t).id)};
      }),
      attack: (card, target) => this.execute(() => ({type: 'attack', id: this.card(card).id, target: this.card(target).id})),
      move: (card, target) => this.execute(() => ({type: 'move', id: this.card(card).id, to: this.tile(target).id})),
      faculty: (card, number, target) => this.execute(() => {
        this.index(number);
        const source = this.card(card);
        if (source.isType('secret')) {
          return {type: 'param', id: source.id, option: number === source.faculties.length ? 'destroy' : 'seteffect', value: number - 1};
        }
        const command = {type: 'faculty', id: source.id, faculty: number - 1};
        if (target !== undefined) command.target = this.tile(target).id;
        return command;
      }),
      secret: (card, setting, value) => this.execute(() => {
        const options = {effect: 'seteffect', count: 'setcount', destroy: 'destroy'};
        if (!Object.prototype.hasOwnProperty.call(options, setting)) throw new Error('Réglage de secret inconnu.');
        if (setting === 'effect') this.index(value);
        return {type: 'param', id: this.card(card).id, option: options[setting], value: setting === 'effect' ? value - 1 : value};
      }),
      choose: number => this.execute(() => {
        this.index(number);
        const area = this.board.areas[this.game.no];
        const box = area && area.choosebox;
        const card = box && box.opened && box.cards[number - 1];
        if (!card) throw new Error('Ce choix n’est pas disponible.');
        return {type: 'choose', id: card.id};
      }),
      endTurn: () => this.execute(() => ({type: 'endturn'})),
      concede: () => this.execute(() => ({type: 'concede'}))
    });
  }

  get board() { return this.game.store.getState(); }
  get viewer() { return this.game.role === 'player' ? this.game.no : undefined; }

  mount(host) {
    this.host = host;
    this.former = Object.getOwnPropertyDescriptor(host, 'sensuba');
    Object.defineProperty(host, 'sensuba', {configurable: true, value: this.api});
    this.webmcp = registerWebMCP(host, this.api, this.output);
    this.output.log('Console Sensuba disponible : sensuba.help()');
  }

  dispose() {
    this.disposed = true;
    this.following = false;
    if (this.webmcp) this.webmcp.dispose();
    if (this.host && this.host.sensuba === this.api) {
      if (this.former) Object.defineProperty(this.host, 'sensuba', this.former);
      else delete this.host.sensuba;
    }
  }

  attempt(run) {
    try {
      if (this.disposed || this.game.unmounted) throw new Error('Cette partie est fermée.');
      return run();
    } catch (error) {
      // Never return an Error object, which could retain internal model references.
      return {ok: false, error: error.message};
    }
  }

  execute(create) {
    return this.attempt(() => this.game.command(create()));
  }

  index(number) {
    if (!Number.isInteger(number) || number < 1) throw new Error('Le numéro doit être un entier à partir de 1.');
  }

  tile(ref) {
    const match = typeof ref === 'string' && /^(me|opponent):([1-9])$/.exec(ref);
    if (!match || this.viewer === undefined) throw new Error('Case attendue : me:1…9 ou opponent:1…9.');
    return this.board.areas[match[1] === 'me' ? this.viewer : 1 - this.viewer].field.tiles[Number(match[2]) - 1];
  }

  card(ref) {
    let card;
    if (typeof ref !== 'string') throw new Error('Une référence de carte est attendue.');
    if (/^(me|opponent):/.test(ref)) card = this.tile(ref).card;
    else if (/^hand:[1-9][0-9]*$/.test(ref) && this.viewer !== undefined)
      card = this.board.areas[this.viewer].hand.cards[Number(ref.split(':')[1]) - 1];
    else if (/^card:[0-9]+$/.test(ref)) card = this.board.find({type: 'card', no: Number(ref.split(':')[1])});
    if (!card || !visibleCard(card, this.viewer)) throw new Error('Carte absente ou non visible.');
    return card;
  }

  tileRef(tile) { return sideName(tile.area, this.viewer) + ':' + (tile.area.field.tiles.indexOf(tile) + 1); }

  view(print) {
    return this.attempt(() => {
      const snapshot = boardView(this.game);
      if (print) this.output.log(JSON.stringify(snapshot, null, 2));
      return snapshot;
    });
  }

  follow(enabled) {
    return this.attempt(() => {
      if (typeof enabled !== 'boolean') throw new Error('follow attend true ou false.');
      if (this.following !== enabled) this.output.log(enabled ? 'Suivi activé.' : 'Suivi désactivé.');
      this.following = enabled;
      return {ok: true, following: enabled};
    });
  }

  capture(event) {
    return this.following && !this.disposed ? describeEvent(this.game, event) : null;
  }

  publish(message) {
    if (message && this.following && !this.disposed) this.output.log(message);
  }

  startTurn(player, seconds) {
    this.turnPlayer = player;
    this.remaining = seconds + 1;
    this.timerWarnings.clear();
  }

  endTurn() { this.turnPlayer = null; }

  timer(seconds) {
    if (!Number.isFinite(seconds)) return;
    const previous = this.remaining;
    this.remaining = seconds;
    if (this.disposed || !this.following || !this.game.state.timer || this.game.ended || this.game.state.pending
      || !this.game.socket.connected || this.viewer === undefined || this.turnPlayer !== this.viewer) return;
    const crossed = [60, 30].filter(limit => !this.timerWarnings.has(limit) && previous > limit && seconds <= limit);
    crossed.forEach(limit => this.timerWarnings.add(limit));
    // A resync can skip a threshold: report the actual remaining time once.
    if (crossed.length && seconds > 0) this.output.log('Il reste ' + Math.ceil(seconds) + ' secondes pour jouer.');
  }

  async read(query) {
    try {
      if (this.disposed || this.game.unmounted) throw new Error('Cette partie est fermée.');
      if (typeof query !== 'string' || !query.trim()) throw new Error('Indiquez le nom exact d’une carte officielle.');
      const supplied = this.game.props && this.game.props.cards;
      const cards = Array.isArray(supplied) && supplied.length ? supplied : await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => reject(new Error('Catalogue indisponible. Réessayez dans quelques instants.')), 10000);
        try {
          Library.getCardList(list => { clearTimeout(timeout); resolve(list || []); });
        } catch (error) {
          clearTimeout(timeout);
          reject(new Error('Catalogue indisponible.'));
        }
      });
      if (this.disposed || this.game.unmounted) throw new Error('Cette partie est fermée.');
      const text = readOfficial(cards, query);
      this.output.log(text);
      return text;
    } catch (error) {
      return {ok: false, error: error.message};
    }
  }

  targets(ref, selected) {
    const card = this.card(ref);
    if (!Array.isArray(selected)) throw new Error('Les cibles doivent former un tableau.');
    if (this.viewer === undefined || card.area.id.no !== this.viewer || !card.inHand || !card.canBePlayed || commandError(this.game, {type: 'endturn'}))
      throw new Error('Cette carte ne peut pas être jouée maintenant.');
    const targets = selected.map(t => this.tile(t));
    if (targets.length > card.targets.length || (targets.length && !card.canBePlayedOn(targets))) throw new Error('Séquence de cibles invalide.');
    const complete = !commandError(this.game, {type: 'play', id: card.id, targets: targets.map(t => t.id)});
    const next = targets.length < card.targets.length ? this.board.tiles.filter(t => card.canBePlayedOn(targets.concat(t))).map(t => this.tileRef(t)) : [];
    return {complete, next};
  }

  actions() {
    const actions = [];
    const add = (command, method, args) => {
      if (!commandError(this.game, command)) actions.push({method, args});
    };
    if (this.viewer === undefined) return actions;
    const area = this.board.areas[this.viewer];
    if (area.choosebox.opened) {
      area.choosebox.cards.forEach((card, i) => add({type: 'choose', id: card.id}, 'choose', [i + 1]));
      return actions;
    }
    add({type: 'endturn'}, 'endTurn', []);
    add({type: 'concede'}, 'concede', []);
    if (commandError(this.game, {type: 'endturn'})) return actions;
    area.hand.cards.filter(card => visibleCard(card, this.viewer) && card.canBePlayed).forEach(card => {
      const ref = 'card:' + card.id.no;
      const targets = this.targets(ref, []);
      actions.push({method: 'play', card: ref, targets, hint: 'Utiliser targets(carte, cibles) pour compléter la séquence, puis play(carte, cibles).'});
    });
    area.field.cards.filter(card => visibleCard(card, this.viewer)).forEach(card => {
      const ref = this.tileRef(card.location);
      this.board.tiles.forEach(tile => {
        add({type: 'move', id: card.id, to: tile.id}, 'move', [ref, this.tileRef(tile)]);
        if (tile.occupied && visibleCard(tile.card, this.viewer))
          add({type: 'attack', id: card.id, target: tile.card.id}, 'attack', [ref, this.tileRef(tile)]);
      });
      if (card.isType('secret')) {
        add({type: 'param', id: card.id, option: 'destroy'}, 'secret', [ref, 'destroy']);
        for (let value = 0; value <= 5; value++) add({type: 'param', id: card.id, option: 'setcount', value}, 'secret', [ref, 'count', value]);
        card.faculties.slice(0, -1).forEach((f, i) => add({type: 'param', id: card.id, option: 'seteffect', value: i}, 'secret', [ref, 'effect', i + 1]));
      } else (card.faculties || []).forEach((faculty, i) => {
        const command = {type: 'faculty', id: card.id, faculty: i};
        if (!faculty.target) add(command, 'faculty', [ref, i + 1]);
        else this.board.tiles.forEach(tile => add(Object.assign({}, command, {target: tile.id}), 'faculty', [ref, i + 1, this.tileRef(tile)]));
      });
    });
    return actions;
  }
}
