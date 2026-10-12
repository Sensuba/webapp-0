import GameConsole from './GameConsole';
import {boardView, changesBetween} from './VisibleBoard';
import {commandError, sendCommand} from '../controller/CommandRules';
import Manager from '../Manager';
import ChooseboxState from '../controller/state/ChooseboxState';
import PlayingState from '../controller/state/PlayingState';
import GameBoard from '../model/board/GameBoard';
import Card from '../model/board/Card';

function fixture(no = 0) {
  const board = new GameBoard();
  board.started = true;
  board.currentArea = board.areas[no];
  board.areas.forEach(area => { area.manapool.receptacles = [true, true, true]; });
  const game = {
    no, role: 'player', store: {getState: () => board}, state: {pending: 0},
    socket: {connected: true, emit: jest.fn()}, forceUpdate: jest.fn()
  };
  Object.defineProperty(game, 'isPlaying', {get: () => board.currentArea === board.areas[game.no]});
  game.command = command => sendCommand(game, command);
  game.manager = new Manager(board, game.command, jest.fn());
  game.manager.control(true, {model: board});
  const output = {log: jest.fn()};
  const controller = new GameConsole(game, output);
  game.consoleController = controller;
  let nextId = 10;
  const card = (location, props = {}) => {
    // Use production legality methods with a fixed effective state; aura computation
    // and network identification are outside the console's responsibility.
    const value = Object.assign(Object.create(Card.prototype), {
      id: {type: 'card', no: nextId++}, location, nameCard: 'Visible card', description: 'Public text',
      cardType: 'figure', mana: 1, atk: 100, hp: 500, chp: 500, range: 4,
      actionPt: 1, motionPt: 1, skillPt: 1, firstTurn: false, furyState: 0,
      states: {}, faculties: [], targets: [], mutations: [], passives: [], cmutations: []
    }, props);
    Object.defineProperty(value, 'eff', {get: () => value});
    board.register(value);
    if (location.id.type === 'tile' || location.id.type === 'court') location.card = value;
    else location.cards.push(value);
    return value;
  };
  return {board, game, output, controller, api: controller.api, card, me: board.areas[no], opponent: board.areas[1 - no]};
}

test('view hides even previously identified private cards, both decks and opponent choices', () => {
  const f = fixture();
  f.card(f.me.hand, {nameCard: 'My hand'});
  const known = f.card(f.opponent.hand, {nameCard: 'HIDDEN_HAND'});
  f.card(f.opponent.field.tiles[2], {cardType: 'secret', nameCard: 'HIDDEN_SECRET', secretcount: 3});
  f.card(f.opponent.choosebox, {nameCard: 'HIDDEN_CHOICE'});
  f.opponent.choosebox.open();
  f.card(f.me.deck, {nameCard: 'HIDDEN_MY_DECK'});
  f.card(f.opponent.deck, {nameCard: 'HIDDEN_DECK'});
  f.game.access = [0, 1];
  const view = f.api.view(false);
  expect(JSON.stringify(view)).not.toMatch(/HIDDEN/);
  expect(view.players.me.hand.cards[0].nameCard).toBe('My hand');
  expect(view.players.opponent.hand).toEqual({count: 1});
  expect(view.players.opponent.board[2].card).toEqual({hidden: true});
  expect(f.api.attack('card:' + known.id.no, 'me:1').ok).toBe(false);
  expect(f.game.socket.emit).not.toHaveBeenCalled();
});

test('WebMCP uses real visibility and choice/ownership guards, and unmount removes tools', async () => {
  const f = fixture();
  const tools = new Map();
  const host = {navigator: {modelContext: {
    registerTool: tool => tools.set(tool.name, tool),
    unregisterTool: name => tools.delete(name)
  }}};
  f.card(f.opponent.hand, {nameCard: 'HIDDEN_HAND'});
  f.card(f.opponent.field.tiles[1], {cardType: 'secret', nameCard: 'HIDDEN_SECRET'});
  f.card(f.me.deck, {nameCard: 'HIDDEN_DECK'});
  f.card(f.me.choosebox);
  f.me.choosebox.open();
  f.controller.mount(host);
  await f.controller.webmcp.ready;
  const call = async (method, input = {}) => JSON.parse((await tools.get('sensuba_' + method).execute(input)).content[0].text);
  expect(JSON.stringify(await call('view'))).not.toMatch(/HIDDEN/);
  expect((await call('endTurn')).ok).toBe(false);
  expect((await call('concede')).ok).toBe(false);
  expect(f.game.socket.emit).not.toHaveBeenCalled();
  expect(await call('actions')).toEqual([{method: 'choose', args: [1]}]);
  expect((await call('choose', {number: 1})).sent).toBe(true);
  expect(f.me.choosebox.opened).toBe(false);
  expect((await call('endTurn')).sent).toBe(true);
  f.game.role = 'spectator';
  expect((await call('concede')).ok).toBe(false);
  f.controller.dispose();
  expect(tools.size).toBe(0);
  expect(host.sensuba).toBeUndefined();
});

test('view is detached JSON with no internal references, arbitrary fields or functions', () => {
  const f = fixture();
  const card = f.card(f.me.field.tiles[0], {variables: {password: 'PRIVATE', sakuramark: true}, blueprint: {data: 'PRIVATE'},
    steps: [{step: 1, completed: false, condition: () => 'PRIVATE'}]});
  const view = f.api.view(false);
  expect(JSON.stringify(view)).not.toMatch(/PRIVATE|blueprint|location|gameboard/);
  expect(view.players.me.board[0].card.marks).toEqual(['sakuramark']);
  expect(view.players.me.board[0].card.trial).toEqual([{step: 1, completed: false}]);
  view.players.me.board[0].card.nameCard = 'Changed';
  view.players.me.board[0].hazards.push('fire');
  expect(card.nameCard).toBe('Visible card');
  expect(card.location.hazards).toEqual([]);
  expect(f.api.view()).toEqual(f.api.view(false));
  expect(typeof f.output.log.mock.calls[0][0]).toBe('string');
});

test('spectators have only public information and no controls even with granted access', () => {
  const f = fixture();
  f.card(f.me.hand, {nameCard: 'PRIVATE'});
  f.card(f.me.field.tiles[0], {cardType: 'secret', nameCard: 'PRIVATE'});
  f.game.role = 'spectator';
  f.game.access = [0, 1];
  expect(JSON.stringify(f.api.view(false))).not.toMatch(/PRIVATE/);
  expect(f.api.view(false).players.player1).toBeDefined();
  expect(f.api.actions()).toEqual([]);
  expect(f.api.concede().ok).toBe(false);
});

test('numbering is 1–9 for both player positions, front 1–4 / back 5–9', () => {
  const f = fixture(1);
  const attacker = f.card(f.me.field.tiles[0]);
  const victim = f.card(f.opponent.field.tiles[6], {cardType: 'hero'});
  expect(f.api.attack('me:1', 'opponent:7')).toEqual({ok: true, sent: true});
  expect(f.game.socket.emit).toHaveBeenLastCalledWith('command', {type: 'attack', id: attacker.id, target: victim.id});
  const view = f.api.view(false);
  expect(view.players.me.board.map(t => t.number)).toEqual([1,2,3,4,5,6,7,8,9]);
  expect(view.players.me.board[3].row).toBe('front');
  expect(view.players.me.board[4].row).toBe('back');
});

test('all actions except choosing are blocked by an open choosebox at the shared boundary', () => {
  const f = fixture();
  const unit = f.card(f.me.field.tiles[0]);
  const hand = f.card(f.me.hand);
  const enemy = f.card(f.opponent.field.tiles[0]);
  f.me.choosebox.open();
  ['endturn', 'concede', 'play', 'attack', 'move', 'faculty', 'param'].forEach(type => {
    expect(f.game.command({type, id: unit.id, target: enemy.id}).ok).toBe(false);
  });
  expect(f.api.play('card:' + hand.id.no).ok).toBe(false);
  f.game.manager.endTurn();
  f.game.manager.select(unit);
  expect(f.game.manager.controller instanceof ChooseboxState).toBe(true);
  expect(f.game.socket.emit).not.toHaveBeenCalled();
});

test('choose accepts only a current own choice, closes once and restores mouse control', () => {
  const f = fixture();
  const choice = f.card(f.me.choosebox);
  const foreign = f.card(f.opponent.choosebox);
  f.me.choosebox.open();
  f.game.manager.control(true, {model: f.board});
  f.game.manager.select(foreign);
  expect(f.game.socket.emit).not.toHaveBeenCalled();
  expect(f.api.choose(0).ok).toBe(false);
  expect(f.api.choose(2).ok).toBe(false);
  expect(f.api.actions()).toEqual([{method: 'choose', args: [1]}]);
  f.game.manager.select(choice);
  expect(f.game.socket.emit).toHaveBeenCalledTimes(1);
  expect(f.me.choosebox.opened).toBe(false);
  expect(f.game.manager.controller instanceof PlayingState).toBe(true);
  expect(f.api.choose(1).ok).toBe(false);
});

test('choice state expires on a turn change and cannot stay active for opponent turn', () => {
  const f = fixture();
  f.me.choosebox.open();
  f.game.manager.control(true, {model: f.board});
  f.board.currentArea = f.opponent;
  f.game.manager.control(false, {model: f.board});
  expect(f.game.manager.controller).toBe(f.game.manager.states.waiting);
  expect(f.api.endTurn().ok).toBe(false);
});

test('ownership and turn checks also apply when model attack predicates would allow it', () => {
  const f = fixture();
  f.card(f.me.field.tiles[0]);
  f.card(f.opponent.field.tiles[0]);
  expect(f.api.attack('opponent:1', 'me:1').ok).toBe(false);
  f.board.currentArea = f.opponent;
  expect(f.api.attack('me:1', 'opponent:1').ok).toBe(false);
  expect(f.api.move('me:1', 'me:2').ok).toBe(false);
  expect(f.api.endTurn().ok).toBe(false);
  expect(f.api.concede().ok).toBe(true);
});

test('inactive, ended, replay, disconnected and unmounted sessions cannot send', () => {
  [f => { f.board.started = false; }, f => { f.board.gamestate = 3; },
    f => { f.game.ended = true; }, f => { f.game.isReplay = true; },
    f => { f.game.socket.connected = false; }, f => { f.game.state.pending = 1; },
    f => { f.game.unmounted = true; }].forEach(modify => {
      const f = fixture(); modify(f);
      expect(f.api.endTurn().ok).toBe(false);
      expect(f.api.concede().ok).toBe(false);
      expect(f.game.socket.emit).not.toHaveBeenCalled();
    });
});

test('play without targets and sequential multi-target cards use the real target rules', () => {
  const f = fixture();
  const plain = f.card(f.me.hand, {cardType: 'spell'});
  expect(f.api.play('hand:1').ok).toBe(true);
  expect(f.game.socket.emit).toHaveBeenLastCalledWith('command', {type: 'play', id: plain.id, targets: []});
  f.card(f.me.hand, {targets: [(c,t) => t.area === c.area && !t.occupied, (c,t) => t.area !== c.area && t.occupied]});
  f.card(f.opponent.field.tiles[0]);
  expect(f.api.targets('hand:2').complete).toBe(false);
  expect(f.api.targets('hand:2').next).toHaveLength(9);
  expect(f.api.targets('hand:2', ['me:1'])).toEqual({complete: false, next: ['opponent:1']});
  expect(f.api.play('hand:2', ['me:1']).ok).toBe(false);
  expect(f.api.play('hand:2', ['me:1', 'opponent:1']).ok).toBe(true);
  expect(f.api.play('hand:2', ['me:1', 'me:1']).ok).toBe(false);
  expect(f.api.play('hand:2', ['me:1', 'opponent:1', 'me:2']).ok).toBe(false);
});

test('optional trailing target is omitted only when there is no possible target', () => {
  const f = fixture();
  f.card(f.me.hand, {targets: [(c,t) => t.area === c.area && !t.occupied, () => false]});
  expect(f.api.targets('hand:1', ['me:1'])).toEqual({complete: true, next: []});
  expect(f.api.play('hand:1', ['me:1']).ok).toBe(true);
});

test('unaffordable plays, occupied moves and exhausted or frozen attacks are rejected', () => {
  const f = fixture();
  f.card(f.me.hand, {mana: 99});
  const source = f.card(f.me.field.tiles[0]);
  f.card(f.me.field.tiles[1]);
  f.card(f.opponent.field.tiles[0]);
  expect(f.api.play('hand:1').ok).toBe(false);
  expect(f.api.move('me:1', 'me:2').ok).toBe(false);
  source.actionPt = 0;
  expect(f.api.attack('me:1', 'opponent:1').ok).toBe(false);
  source.actionPt = 1;
  source.states.frozen = true;
  expect(f.api.attack('me:1', 'opponent:1').ok).toBe(false);
});

test('rush/fury: other → hero allowed, hero → hero forbidden on arrival turn', () => {
  const f = fixture();
  const source = f.card(f.me.field.tiles[0], {states: {rush: true, fury: true}, firstTurn: true, actionPt: 0, furyState: 1});
  f.card(f.opponent.field.tiles[0], {cardType: 'hero'});
  source.furyFirstAttackWasHero = false;
  expect(f.api.attack('me:1', 'opponent:1').ok).toBe(true);
  source.furyFirstAttackWasHero = true;
  expect(f.api.attack('me:1', 'opponent:1').ok).toBe(false);
});

test('faculties enforce costs, conditions, one-based indices and target type', () => {
  const f = fixture();
  f.card(f.me.field.tiles[0], {faculties: [
    {no: 0, cost: 1}, {no: 1, cost: 0, target: (c,t) => t.area !== c.area},
    {no: 2, cost: 99}, {no: 3, cost: 0, condition: () => false}
  ]});
  expect(f.api.faculty('me:1', 1).ok).toBe(true);
  expect(f.api.faculty('me:1', 2, 'opponent:9').ok).toBe(true);
  [[0], [5], [1,'me:2'], [2], [2,'me:2'], [3], [4]].forEach(args => {
    expect(f.api.faculty('me:1', ...args).ok).toBe(false);
  });
});

test('secret settings match mouse semantics and cannot mutate while choosing', () => {
  const f = fixture();
  const secret = f.card(f.me.field.tiles[0], {cardType: 'secret', secreteffect: 0, secretcount: 1,
    faculties: [{no:0}, {no:1}, {no:2}]});
  expect(f.api.secret('me:1', 'effect', 2).ok).toBe(true);
  expect(secret.secreteffect).toBe(1);
  expect(f.api.secret('me:1', 'count', 5).ok).toBe(true);
  expect(secret.secretcount).toBe(5);
  expect(f.api.secret('me:1', 'count', 6).ok).toBe(false);
  f.me.choosebox.open();
  expect(f.api.secret('me:1', 'count', 0).ok).toBe(false);
  expect(secret.secretcount).toBe(5);
  f.me.choosebox.close();
  expect(f.api.faculty('me:1', 3).ok).toBe(true);
});

test('actions discovers movement, attack, faculties, plays, secret options and turn controls', () => {
  const f = fixture();
  f.card(f.me.field.tiles[0], {faculties: [{no:0, cost:1}]});
  f.card(f.opponent.field.tiles[0]);
  f.card(f.me.hand);
  f.card(f.me.field.tiles[4], {cardType:'secret', faculties:[{no:0}, {no:1}]});
  const methods = f.api.actions().map(a => a.method);
  ['play','move','attack','faculty','secret','endTurn','concede'].forEach(method => expect(methods).toContain(method));
});

test('follow uses frozen human sentences, masks hidden draws and stops', () => {
  const f = fixture();
  const privateCard = f.card(f.opponent.hand, {nameCard:'PRIVATE'});
  f.api.follow();
  const draw = {type:'draw', src:f.opponent.id, data:[privateCard.id]};
  const message = f.controller.capture(draw);
  privateCard.nameCard = 'CHANGED';
  f.controller.publish(message);
  expect(f.output.log.mock.calls.map(call => call[0])).toEqual(['Suivi activé.', 'L’adversaire pioche une carte.']);
  f.api.follow(false);
  f.controller.publish(f.controller.capture(draw));
  expect(f.output.log).toHaveBeenCalledTimes(3);
});

test('follow ignores bookkeeping, damage, choice UI and local secret settings', () => {
  const f = fixture();
  f.api.follow();
  ['identify','setstate','damagecard','usemana','charattack-extra','openchoosebox','cleanup','charmove'].forEach(type => {
    f.controller.publish(f.controller.capture({type,src:f.me.id,data:[]}));
  });
  f.card(f.me.choosebox);
  f.me.choosebox.open();
  f.api.choose(1);
  expect(f.output.log).toHaveBeenCalledTimes(1);
});

test('mount and dispose restore previous global, stop follow and invalidate captured commands', () => {
  const f = fixture();
  const previous = {value:1};
  const host = {sensuba:previous};
  f.controller.mount(host);
  expect(host.sensuba).toBe(f.api);
  expect(host.sensuba.game).toBeUndefined();
  expect(Object.isFrozen(host.sensuba)).toBe(true);
  f.api.follow();
  f.controller.dispose();
  expect(host.sensuba).toBe(previous);
  expect(f.api.endTurn().ok).toBe(false);
  expect(f.api.view(false).ok).toBe(false);
});

test('invalid inputs fail without emitting and help explains all exported commands', () => {
  const f = fixture();
  f.card(f.me.hand);
  [() => f.api.play(null), () => f.api.play('hand:0'), () => f.api.play('hand:1', 'me:1'),
    () => f.api.play('hand:1', ['me:0']), () => f.api.play('hand:1', ['opponent:10']),
    () => f.api.choose(1.5), () => f.api.secret('hand:1','__proto__'), () => f.api.faculty('hand:1',NaN)
  ].forEach(call => expect(call().ok).toBe(false));
  expect(f.game.socket.emit).not.toHaveBeenCalled();
  const help = f.api.help();
  Object.keys(f.api).forEach(method => expect(help).toContain('sensuba.' + method));
  expect(commandError(f.game, {type:'unknown'})).toBeTruthy();
  expect(changesBetween({a:1}, {a:1})).toEqual([]);
  expect(boardView(f.game).version).toBe(1);
});
