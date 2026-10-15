import Game from './Game';

jest.mock('./view/board/GameBoard', () => () => null);
jest.mock('./view/UI/History', () => () => null);
jest.mock('./view/UI/FacultyBox', () => () => null);
jest.mock('./view/UI/Chatbox', () => () => null);
jest.mock('./view/UI/MuteButton', () => () => null);
jest.mock('../components/cards/Card', () => () => null);
jest.mock('../components/decks/deckbuilder/AssistantBuilder', () => jest.fn());
jest.mock('../services/User', () => ({getDeck: () => null, isConnected: () => false, getSession: () => 'test-session'}));

function socket() {
  const handlers = {};
  return {connected: true, handlers, on: (e, f) => { (handlers[e] = handlers[e] || []).push(f); },
    emit: jest.fn(), removeAllListeners: () => Object.keys(handlers).forEach(k => delete handlers[k]),
    receive: (e, ...args) => (handlers[e] || []).forEach(f => f(...args))};
}
function fixture() {
  global.localStorage = {getItem: () => null};
  window.Audio = jest.fn().mockImplementation(() => ({pause: jest.fn(), play: jest.fn()}));
  let current = socket();
  const game = new Game({room: 'room-a', getSocket: () => current, subscribe: jest.fn(), setSync: jest.fn()});
  game.setState = next => Object.assign(game.state, next);
  game.analyse = jest.fn();
  game.onJoined({as: 'player', no: 0});
  return {game, replace: () => { current = socket(); return current; }};
}
function disconnect(game) { game.socket.connected = false; game.socket.receive('disconnect'); }
function request(s) { return s.emit.mock.calls.filter(c => c[0] === 'reconnectuser').pop(); }
beforeEach(() => jest.useFakeTimers());
afterEach(() => { jest.clearAllTimers(); jest.useRealTimers(); });

test('same Socket.IO object can reconnect, then waits for server confirmation', () => {
  const {game} = fixture(); disconnect(game);
  jest.runTimersToTime(10000); expect(game.ended).toBeUndefined();
  game.socket.connected = true; jest.runTimersToTime(500);
  expect(request(game.socket).slice(0, 3)).toEqual(['reconnectuser', 'test-session', 'room-a']);
  expect(game.state.pending).toBe(1);
  game.socket.receive('state', 'async');
  game.socket.receive('notification', {type: 'missed'});
  game.socket.receive('time', 42);
  game.socket.receive('state', 'sync');
  request(game.socket)[3]({ok: true});
  expect(game.state.pending).toBe(0);
  expect(game.setTimer).toBe(42);
  expect(game.props.setSync).toHaveBeenLastCalledWith('sync');
  expect(game.analyse).toHaveBeenCalledTimes(1);
  game.setupSocketListeners();
  expect(game.socket.handlers.notification.length).toBe(1);
  game.componentWillUnmount();
});

test('replacement socket retains state/time listeners and ignores stale transport events', () => {
  const f = fixture(), game = f.game, old = game.socket;
  disconnect(game); const fresh = f.replace(); jest.runTimersToTime(500);
  fresh.receive('state', 'sync'); fresh.receive('time', 36);
  old.receive('notification', {type: 'stale'}); old.receive('endgame', {state: 7});
  expect(game.analyse).not.toHaveBeenCalled(); expect(game.ended).toBeUndefined();
  expect(game.setTimer).toBe(36); expect(game.props.setSync).toHaveBeenLastCalledWith('sync');
  request(fresh)[3]({ok: true}); expect(game.state.pending).toBe(0);
  game.componentWillUnmount();
});

test('expired resume exits the overlay and reports one terminal result', () => {
  const {game} = fixture(); disconnect(game); game.socket.connected = true; jest.runTimersToTime(500);
  game.socket.receive('endgame', {state: 5}); request(game.socket)[3]({ok: false});
  expect(game.ended).toBe(true); expect(game.state.pending).toBe(0);
  expect(game.props.setSync).toHaveBeenLastCalledWith('sync'); expect(game.analyse).toHaveBeenCalledTimes(1);
  game.componentWillUnmount();
});

test('unmount cancels pending reconnection attempts', () => {
  const {game} = fixture(); disconnect(game); game.componentWillUnmount();
  game.socket.connected = true; jest.runTimersToTime(20000);
  expect(request(game.socket)).toBeUndefined();
});

test('an expired session before game start displays the terminal result', () => {
  const {game} = fixture();
  game.analyse = Game.prototype.analyse.bind(game);
  game.forceUpdate = jest.fn();
  game.onEndgame({state: 5, credit: 0});
  expect(game.displayStore.getState().gamestate).toBe(5);
  game.componentWillUnmount();
});
