import Game from '../Game';

jest.mock('../Sequencer', () => jest.fn().mockImplementation(() => ({add: jest.fn(), setState: jest.fn()})));
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
  window.Audio = jest.fn().mockImplementation(() => ({pause: jest.fn()}));
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

afterEach(() => { delete window.sensuba; });

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
  expect(game.setState).not.toHaveBeenCalled();
  expect(api.endTurn().ok).toBe(false);
  expect(api.follow().ok).toBe(false);
});
