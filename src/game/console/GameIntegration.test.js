import Game from '../Game';
import Card from '../model/board/Card';
import {boardView} from './VisibleBoard';
import registerWebMCP from './WebMCP';

jest.mock('../view/board/GameBoard', () => () => null);
jest.mock('../view/UI/History', () => () => null);
jest.mock('../view/UI/FacultyBox', () => () => null);
jest.mock('../view/UI/Chatbox', () => () => null);
jest.mock('../view/UI/MuteButton', () => () => null);
jest.mock('../../components/cards/Card', () => () => null);
jest.mock('../../components/decks/deckbuilder/AssistantBuilder', () => jest.fn());
jest.mock('../../services/User', () => ({getDeck: () => null, isConnected: () => false, getSession: () => 'test-session'}));

function mountedGame() {
  global.localStorage = {getItem: jest.fn(() => null)};
  window.Audio = jest.fn().mockImplementation(() => ({pause: jest.fn(), play: jest.fn(), setAttribute: jest.fn()}));
  const socket = {connected: true, on: jest.fn(), emit: jest.fn(), removeAllListeners: jest.fn()};
  const game = new Game({room: 'test-room', getSocket: () => socket, subscribe: jest.fn(), setSync: jest.fn()});
  game.setState = (next, done) => { Object.assign(game.state, next); if (done) done(); };
  game.forceUpdate = jest.fn();
  game.consoleController.output = {log: jest.fn()};
  game.onJoined({as: 'player', no: 0});
  game.componentDidMount();
  game.syncstate = 'async';
  game.analyse({type: 'start', src: {type: 'gameboard', no: 0}, data: []});
  game.analyse({type: 'newturn', src: {type: 'area', no: 0}, data: [0]});
  return game;
}

beforeEach(() => jest.useFakeTimers());
afterEach(() => { delete window.sensuba; jest.clearAllTimers(); jest.useRealTimers(); });

test('real Game dispatch follows semantic events and stays silent for bookkeeping', () => {
  const game = mountedGame();
  expect(window.sensuba).toBe(game.consoleController.api);
  window.sensuba.follow();
  const log = game.consoleController.output.log;
  const before = log.mock.calls.length;
  game.analyse({type: 'createmana', src: {type: 'area', no: 0}, data: [{value: true}]});
  game.analyse({type: 'createmana', src: {type: 'area', no: 0}, data: [{value: true}]});
  expect(log.mock.calls.length - before).toBe(0);
  expect(window.sensuba.view(false).players.me.mana.maxMana).toBe(2);
  game.analyse({type: 'endturn', src: {type: 'area', no: 0}, data: []});
  game.analyse({type: 'newturn', src: {type: 'area', no: 1}, data: [0]});
  expect(log.mock.calls.slice(before).map(call => call[0])).toEqual(['Votre tour se termine.', 'Le tour adverse commence.']);
  game.componentWillUnmount();
  expect(window.sensuba).toBeUndefined();
});

test('real Game blocks direct, console and mouse commands while a choice is open', () => {
  const game = mountedGame();
  game.socket.emit.mockClear();
  game.analyse({type: 'openchoosebox', src: {type: 'area', no: 0}, data: []});
  expect(window.sensuba.endTurn().ok).toBe(false);
  expect(window.sensuba.concede().ok).toBe(false);
  expect(game.command({type: 'endturn'}).ok).toBe(false);
  game.manager.endTurn();
  expect(game.socket.emit).not.toHaveBeenCalled();
  // A server turn change closes the previous choice and releases the controller.
  game.analyse({type: 'newturn', src: {type: 'area', no: 1}, data: [0]});
  game.analyse({type: 'newturn', src: {type: 'area', no: 0}, data: [0]});
  expect(window.sensuba.endTurn().ok).toBe(true);
  expect(game.socket.emit).toHaveBeenLastCalledWith('command', {type: 'endturn'});
  game.componentWillUnmount();
});

test('real Game unmount stops its store subscription and captured console API', () => {
  const game = mountedGame();
  const api = window.sensuba;
  api.follow();
  game.componentWillUnmount();
  game.setState = jest.fn();
  game.store.dispatch({type: 'noop'});
  game.displayStore.dispatch({type: 'noop'});
  expect(game.setState).not.toHaveBeenCalled();
  expect(api.endTurn().ok).toBe(false);
  expect(api.follow().ok).toBe(false);
});

const notification = (game, type, src, data = []) => game.analyse({type, src, data});
const area = no => ({type: 'area', no});
const cardId = no => ({type: 'card', no});
function addCard(game, no, location, props = {}) {
  notification(game, 'newcard', cardId(no), [location, Object.assign({
    id: cardId(no), nameCard: 'Figure ' + no, cardType: 'figure',
    mana: 1, atk: 200, hp: 500, chp: 500, range: 4, states: {}
  }, props)]);
}
function animate(game) { game.syncstate = 'sync'; game.sequencer.setState(3); }
function displayed(game) { return boardView(Object.assign({}, game, {store: game.displayStore})); }

test('live view and follow advance during real destruction animation while display keeps the card', async () => {
  const game = mountedGame();
  const board = game.store.getState();
  addCard(game, 100, board.areas[0].field.tiles[0].id);
  notification(game, 'newturn', area(0), [0]);
  expect(game.store.getState()).not.toBe(game.state.model);
  expect(game.state.model).toBe(game.sequencer.model);
  expect(game.manager.model).toBe(game.state.model);
  animate(game);
  const tools = new Map();
  const bridge = registerWebMCP({navigator: {modelContext: {
    registerTool: tool => tools.set(tool.name, tool), unregisterTool: name => tools.delete(name)
  }}}, window.sensuba, console);
  await bridge.ready;
  window.sensuba.follow();
  const log = game.consoleController.output.log;
  notification(game, 'destroycard', cardId(100));
  expect(window.sensuba.view(false).players.me.board[0].card).toBe(null);
  expect(displayed(game).players.me.board[0].card.nameCard).toBe('Figure 100');
  expect(log).toHaveBeenLastCalledWith('Figure 100 (case 1 de votre camp) est détruit.');
  const count = log.mock.calls.length;
  expect(game.command({type: 'move', id: cardId(100), to: board.areas[0].field.tiles[1].id}).ok).toBe(false);
  const view = window.sensuba.view(false);
  expect(view.revision).toBe(view.receivedRevision);
  expect(view.revision).toBeGreaterThan(view.displayRevision);
  expect(view.updating).toBe(false);
  const webView = JSON.parse((await tools.get('sensuba_view').execute({})).content[0].text);
  expect(webView.players.me.board[0].card).toBe(null);
  expect((await tools.get('sensuba_move').execute({card: 'card:100', target: 'me:2'})).isError).toBe(true);
  jest.runTimersToTime(399);
  expect(displayed(game).players.me.board[0].card).not.toBe(null);
  jest.runTimersToTime(1);
  expect(displayed(game).players).toEqual(window.sensuba.view(false).players);
  expect(log.mock.calls.length).toBe(count);
  expect(game.displayRevision).toBe(game.revision);
  bridge.dispose();
  game.componentWillUnmount();
});

test('live play ignores visual mana lag and display later converges after all gameplay notifications', () => {
  const game = mountedGame();
  const board = game.store.getState();
  addCard(game, 150, board.areas[0].hand.id);
  animate(game);
  notification(game, 'wait', area(0), [{value: 1000}]);
  notification(game, 'createmana', area(0), [{value: true}]);
  expect(game.state.model.areas[0].manapool.mana).toBe(0);
  const refs = ['me:1'];
  expect(window.sensuba.targets('hand:1', refs).complete).toBe(true);
  expect(window.sensuba.play('hand:1', refs).sent).toBe(true);
  notification(game, 'usemana', area(0), [{value: 1}]);
  notification(game, 'playcard', cardId(150), [board.areas[0].field.tiles[0].id, null, null, 1, 0]);
  notification(game, 'summon', cardId(150), [board.areas[0].field.tiles[0].id]);
  expect(window.sensuba.view(false).players.me.hand.count).toBe(0);
  expect(window.sensuba.view(false).players.me.board[0].card.nameCard).toBe('Figure 150');
  expect(displayed(game).players.me.hand.count).toBe(1);
  jest.runAllTimers();
  expect(displayed(game).players).toEqual(window.sensuba.view(false).players);
  game.componentWillUnmount();
});

test('initial live model is ready while display waits for the existing intro/start gate', () => {
  const game = mountedGame();
  game.syncstate = 'sync';
  game.sequencer.state = 0;
  game.props.updateHeroes = jest.fn();
  notification(game, 'init', {type: 'gameboard', no: 0}, [
    {value: 'Alice'}, {value: 'avatar-a'}, {no: 1}, {value: 'Bob'}, {value: 'avatar-b'}, {no: 2}
  ]);
  notification(game, 'start', {type: 'gameboard', no: 0});
  notification(game, 'newturn', area(1), [0]);
  expect(window.sensuba.view(false).players.me.name).toBe('Alice');
  expect(game.state.model.areas[0].name).not.toBe('Alice');
  game.sequencer.setState(1);
  expect(game.state.model.areas[0].name).toBe('Alice');
  expect(game.sequencer.state).toBe(2);
  expect(displayed(game).turn).toBe('me');
  game.sequencer.setState(3);
  expect(displayed(game).turn).toBe('opponent');
  expect(game.displayRevision).toBe(game.revision);
  game.componentWillUnmount();
});

test('a turn and choice received behind an animation govern all commands immediately', () => {
  const game = mountedGame();
  const board = game.store.getState();
  addCard(game, 110, board.areas[0].choosebox.id);
  animate(game);
  notification(game, 'wait', area(0), [{value: 1000}]);
  notification(game, 'newturn', area(1), [0]);
  expect(window.sensuba.view(false).turn).toBe('opponent');
  expect(displayed(game).turn).toBe('me');
  expect(window.sensuba.endTurn().ok).toBe(false);
  notification(game, 'newturn', area(0), [0]);
  notification(game, 'openchoosebox', area(0));
  game.socket.emit.mockClear();
  game.manager.endTurn();
  expect(window.sensuba.concede().ok).toBe(false);
  expect(game.socket.emit).not.toHaveBeenCalled();
  expect(window.sensuba.actions()).toEqual([{method: 'choose', args: [1]}]);
  expect(window.sensuba.choose(1).sent).toBe(true);
  expect(board.areas[0].choosebox.opened).toBe(false);
  // An additional choice arriving before display catches up must remain open:
  // delayed replay of the first local close must never close this second choice.
  notification(game, 'openchoosebox', area(0));
  jest.runAllTimers();
  expect(game.state.model.areas[0].choosebox.opened).toBe(true);
  expect(board.areas[0].choosebox.opened).toBe(true);
  expect(displayed(game).players).toEqual(window.sensuba.view(false).players);
  game.componentWillUnmount();
});

test('late display identity cannot reset secret settings already selected through the live model', () => {
  const game = mountedGame();
  animate(game);
  notification(game, 'wait', area(0), [{value: 1000}]);
  addCard(game, 120, game.store.getState().areas[0].field.tiles[0].id, {cardType: 'secret'});
  expect(game.state.model.find(cardId(120))).toBeUndefined();
  expect(window.sensuba.secret('me:1', 'count', 4).sent).toBe(true);
  expect(game.store.getState().find(cardId(120)).secretcount).toBe(4);
  jest.runAllTimers();
  expect(game.state.model.find(cardId(120)).secretcount).toBe(4);
  expect(displayed(game).players).toEqual(window.sensuba.view(false).players);
  game.componentWillUnmount();
});

test('each model gets independent card data and variables, and current visibility still hides private identities', () => {
  const game = mountedGame();
  const board = game.store.getState();
  addCard(game, 130, board.areas[0].field.tiles[0].id, {lv2: {atk: 400}, variables: {nested: {count: 1}}});
  addCard(game, 131, board.areas[1].hand.id, {nameCard: 'HIDDEN_HAND'});
  addCard(game, 132, board.areas[1].field.tiles[1].id, {cardType: 'secret', nameCard: 'HIDDEN_SECRET'});
  addCard(game, 133, board.areas[0].deck.id, {nameCard: 'HIDDEN_DECK'});
  const live = board.find(cardId(130)), visual = game.state.model.find(cardId(130));
  expect(live).not.toBe(visual);
  expect(live.lv2).not.toBe(visual.lv2);
  live.lv2.atk = 999;
  expect(visual.lv2.atk).toBe(400);
  expect(live.variables).not.toBe(visual.variables);
  live.variables.nested.count = 2;
  expect(visual.variables.nested.count).toBe(1);
  expect(JSON.stringify(window.sensuba.view(false))).not.toMatch(/HIDDEN/);
  game.role = 'spectator';
  expect(window.sensuba.actions()).toEqual([]);
  expect(window.sensuba.endTurn().ok).toBe(false);
  game.componentWillUnmount();
});

test('results are visible immediately, even when the victory screen is behind animations', () => {
  const game = mountedGame();
  animate(game);
  window.sensuba.follow();
  notification(game, 'wait', area(0), [{value: 1000}]);
  game.onEndgame({state: 3});
  expect(window.sensuba.view(false).result).toBe(3);
  expect(game.state.model.gamestate).toBe(0);
  expect(window.sensuba.endTurn().ok).toBe(false);
  expect(game.consoleController.output.log).toHaveBeenLastCalledWith('Victoire !');
  jest.runAllTimers();
  expect(game.state.model.gamestate).toBe(3);
  game.componentWillUnmount();
});

test('resync notifications retain their order behind a running display animation', () => {
  const game = mountedGame();
  animate(game);
  notification(game, 'wait', area(0), [{value: 1000}]);
  notification(game, 'createmana', area(0), [{value: true}]);
  game.syncstate = 'async';
  notification(game, 'destroymana', area(0));
  expect(window.sensuba.view(false).players.me.mana.maxMana).toBe(0);
  jest.runAllTimers();
  expect(game.state.model.areas[0].manapool.maxMana).toBe(0);
  expect(game.displayRevision).toBe(game.revision);
  game.componentWillUnmount();
});

test('a pending model computation serializes live notifications and blocks commands until caught up', () => {
  const game = mountedGame();
  addCard(game, 140, game.store.getState().areas[0].capsule.id);
  const original = Card.prototype.identify;
  let finish;
  const identify = jest.spyOn(Card.prototype, 'identify').mockImplementation(function(data) {
    if (this.gameboard === game.store.getState()) return callback => { finish = callback; };
    return original.call(this, data);
  });
  notification(game, 'identify', cardId(140), [{id: cardId(140)}]);
  notification(game, 'createmana', area(0), [{value: true}]);
  expect(window.sensuba.view(false).updating).toBe(true);
  expect(window.sensuba.endTurn().ok).toBe(false);
  finish();
  expect(window.sensuba.view(false).updating).toBe(false);
  expect(window.sensuba.view(false).players.me.mana.maxMana).toBe(1);
  expect(game.displayRevision).toBe(game.revision);
  identify.mockRestore();
  game.componentWillUnmount();
});

test('unmount during animation prevents later display changes and follow output', () => {
  const game = mountedGame();
  animate(game);
  window.sensuba.follow();
  notification(game, 'wait', area(0), [{value: 1000}]);
  notification(game, 'newturn', area(1), [0]);
  const displayRevision = game.displayRevision;
  game.componentWillUnmount();
  const count = game.consoleController.output.log.mock.calls.length;
  jest.runAllTimers();
  expect(game.displayRevision).toBe(displayRevision);
  expect(game.consoleController.output.log.mock.calls.length).toBe(count);
  expect(game.sequencer.queue).toEqual([]);
});
