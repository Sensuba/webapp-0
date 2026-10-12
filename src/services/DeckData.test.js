import {encodeDeck, decodeDeck, importDeck} from './DeckData';
import Api from './Api';
import User from './User';

jest.mock('./User', () => ({getData: jest.fn(() => ({idMember: 1, token: 'test'}))}));

const content = {name:'Étoiles 🌟', hero:3, cards:{329:2}, background:'image', format:'standard', idColor:2, idColor2:4};
test('portable codes never carry identity and retain accented and Unicode names', () => {
  const code = encodeDeck(Object.assign({}, content, {idDeck:42, id:99, author:7, list:[], supercode:'old'}));
  expect(JSON.parse(window.atob(code))).toEqual(content);
  expect(importDeck(code, 42)).toEqual(Object.assign({}, content, {idDeck:42}));
  expect(importDeck(code).idDeck).toBeUndefined();
});

test('legacy embedded IDs cannot replace server identity or the deck being edited', () => {
  const code = window.btoa(JSON.stringify({name:'Legacy',hero:3,cards:{329:1},idDeck:7,author:99}));
  expect(decodeDeck({idDeck:42,author:1,supercode:code})).toEqual({name:'Legacy',hero:3,cards:{329:1},idDeck:42,author:1});
  expect(importDeck(code).idDeck).toBeUndefined();
  expect(importDeck(code, 11).idDeck).toBe(11);
});

test('overlapping requests use their own acknowledgements even out of order', () => {
  const api = new Api({url:'/'});
  api.socket = {emit:jest.fn()};
  const first = jest.fn(), second = jest.fn(), failed = jest.fn();
  api.getMyDecks(first, failed);
  api.getMyDecks(second, failed);
  api.socket.emit.mock.calls[1][2]([{idDeck:2}]);
  api.socket.emit.mock.calls[0][2]([{idDeck:1}]);
  expect(first).toHaveBeenCalledWith([{idDeck:1}]);
  expect(second).toHaveBeenCalledWith([{idDeck:2}]);
  api.saveDeck({supercode:'x',id:1}, first, failed);
  api.socket.emit.mock.calls[2][3]({error:2});
  expect(failed).toHaveBeenCalledWith({error:2});
  expect(User.getData).toHaveBeenCalled();
});

test('an unanswered write is reported as uncertain and late replies are ignored', () => {
  jest.useFakeTimers();
  const api = new Api({url:'/'}); api.socket = {emit:jest.fn()};
  const done = jest.fn(), failed = jest.fn();
  api.saveDeck({supercode:'x'}, done, failed);
  jest.runTimersToTime(15000);
  expect(failed).toHaveBeenCalledWith({error:'timeout',uncertain:true});
  api.socket.emit.mock.calls[0][3](42);
  expect(done).not.toHaveBeenCalled();
  jest.useRealTimers();
});
