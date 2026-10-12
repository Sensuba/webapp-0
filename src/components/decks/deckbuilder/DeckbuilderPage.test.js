import Page from './DeckbuilderPage';
import {encodeDeck, importDeck} from '../../../services/DeckData';
import User from '../../../services/User';

jest.mock('../../Nav', () => 'nav');
jest.mock('./Deckbuilder', () => 'builder');
jest.mock('./HeroSelector', () => 'selector');
jest.mock('../../../services/User', () => ({isConnected:()=>true, getData:()=>({authorization:0}), updateDeck:jest.fn(), getDeck:()=>null}));

function setup(existing = true) {
  const deck = {idDeck:42,hero:3,name:'Original',cards:{329:1},format:'standard'};
  const props = {deck:existing ? deck : undefined, type:'standard', cards:[{idCardmodel:3},{idCardmodel:329}], customs:[],
    api:{saveDeck:jest.fn(),deleteDeck:jest.fn()}, history:{push:jest.fn()},updateDecks:jest.fn()};
  const page = new Page(props);
  page.setState = (state, done) => {Object.assign(page.state,state); if(done)done();};
  return {page,props,deck};
}

test('editing uses a private copy, and importing a code preserves the original ID', () => {
  const {page,props,deck} = setup();
  page.state.deck.name = 'Unsaved'; page.state.deck.cards[329] = 2;
  expect(deck.name).toBe('Original'); expect(deck.cards[329]).toBe(1);
  page.updateDeck(importDeck(encodeDeck({name:'Imported',hero:3,cards:{329:2},format:'standard'})), true);
  page.onSave({supercode:encodeDeck(page.state.deck),id:999});
  expect(props.api.saveDeck.mock.calls[0][0].id).toBe(42);
  expect(page.state.deck.idDeck).toBe(42);
  page.onSave({supercode:'duplicate'});
  expect(props.api.saveDeck).toHaveBeenCalledTimes(1);
  props.api.saveDeck.mock.calls[0][1](42);
  expect(props.history.push).not.toHaveBeenCalled();
  props.updateDecks.mock.calls[0][0]();
  expect(props.history.push).toHaveBeenCalledWith('/decks');
});

test('new deck receives its server ID before a refresh retry or selected-deck update', () => {
  const {page,props} = setup(false);
  page.updateDeck({hero:3,cards:{329:2},name:'New',idDeck:999,format:'standard'});
  page.onSave({supercode:encodeDeck(page.state.deck),id:999},{hero:3,body:[329]});
  expect(props.api.saveDeck.mock.calls[0][0].id).toBeUndefined();
  props.api.saveDeck.mock.calls[0][1](43);
  expect(User.updateDeck).toHaveBeenCalledWith({hero:3,body:[329],id:43});
  props.updateDecks.mock.calls[0][1]();
  page.onSave({supercode:encodeDeck(page.state.deck)});
  expect(props.api.saveDeck.mock.calls[1][0].id).toBe(43);
});

test('failed saves remain editable; uncertain saves cannot create a duplicate on retry', () => {
  const {page,props} = setup(false);
  page.onSave({supercode:'x'});
  props.api.saveDeck.mock.calls[0][2]({error:2});
  expect(page.state.saving).toBe(false);
  page.onSave({supercode:'x'});
  props.api.saveDeck.mock.calls[1][2]({error:'timeout',uncertain:true});
  page.onSave({supercode:'x'});
  expect(props.api.saveDeck).toHaveBeenCalledTimes(2);
  expect(page.state.error).toMatch(/Rechargez/);
});
