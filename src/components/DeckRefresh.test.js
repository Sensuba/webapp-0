import App from './App';
import Library from '../services/Library';
import {encodeDeck} from '../services/DeckData';
jest.mock('./cards/CardsPage', () => 'cards');
jest.mock('./cards/Editor/EditorPage', () => 'editor');
jest.mock('./play/PlayPage', () => 'play');
jest.mock('./play/room/RoomPage', () => 'room');
jest.mock('./solo/SoloPage', () => 'solo');
jest.mock('./solo/mission/MissionPage', () => 'mission');
jest.mock('./play/room/ReplayPage', () => 'replay');
jest.mock('./loading/LoadingPage', () => 'loading');
jest.mock('./rules/RulesPage', () => 'rules');
jest.mock('./profile/ProfilePage', () => 'profile');
jest.mock('./decks/DecksPage', () => 'decks');
jest.mock('./decks/deckbuilder/DeckbuilderPage', () => 'builder');
jest.mock('./home/HomePage', () => 'home');
jest.mock('../services/User', () => ({isConnected:()=>true,getData:()=>({version:1}),setVersion:()=>{},getSession:()=>1}));
jest.mock('../services/Library', () => ({instantiate:jest.fn(),upToDate:()=>true,getCardList:jest.fn(),getCollection:jest.fn(),
  getCustomCardList:jest.fn(),getCommonDeckList:jest.fn(),getDeckList:jest.fn(),updateDecks:jest.fn()}));

const row = (id,name) => ({idDeck:id,author:1,supercode:encodeDeck({name,hero:3,cards:{329:1}})});
function setup() {
  const app = Object.create(App.prototype);
  app.state = {cards:[{idCardmodel:3},{idCardmodel:329}],customCards:[]};
  app.props = {options:{api:{getMyDecks:jest.fn()}}};
  app.setState = (state, done) => {Object.assign(app.state,state); if(done)done();};
  return app;
}

test('startup fetches decks once, ignoring both legacy caches', () => {
  jest.useFakeTimers();
  const storage = {};
  global.localStorage = {setItem:(key,value)=>{storage[key]=value;},getItem:key=>storage[key] || null,removeItem:key=>{delete storage[key];}};
  const reconnect = jest.spyOn(App.prototype,'reconnect').mockImplementation(()=>{});
  localStorage.setItem('decklist',JSON.stringify([{idDeck:999}]));
  const api = {getMyDecks:jest.fn()};
  const app = new App({options:{api}});
  const decoded = app.filterCardData(app.readObject({idCardmodel:3,author:0,supercode:window.btoa(JSON.stringify({nameCard:'Hero',author:99,tokens:[{nameCard:'Token'}]}))}));
  expect(decoded.author).toBe(0);
  expect(decoded.tokens[0].nameCard).toBe('Token');
  app.setState = state => Object.assign(app.state,state);
  Library.getCardList.mockImplementation(done=>done(Array.from({length:1300},(_,i)=>({idCardmodel:i,author:0}))));
  Library.getCollection.mockImplementation(done=>done([{}]));
  Library.getCustomCardList.mockImplementation(done=>done([{}]));
  Library.getCommonDeckList.mockImplementation(done=>done([{}]));
  Library.instantiate.mock.calls[0][0]();
  expect(api.getMyDecks).toHaveBeenCalledTimes(1);
  expect(Library.getDeckList).not.toHaveBeenCalled();
  expect(localStorage.getItem('decklist')).toBe(null);
  reconnect.mockRestore(); jest.clearAllTimers(); jest.useRealTimers();
  delete global.localStorage;
});

test('older responses cannot replace the latest list; failures retain existing decks', () => {
  const app=setup(), api=app.props.options.api;
  app.updateDecks(); app.updateDecks();
  api.getMyDecks.mock.calls[1][0]([row(2,'Latest')]);
  api.getMyDecks.mock.calls[0][0]([row(1,'Old')]);
  expect(app.state.decks.map(d=>d.idDeck)).toEqual([2]);
  app.updateDecks(); api.getMyDecks.mock.calls[2][1]({error:1});
  expect(app.state.decks.map(d=>d.idDeck)).toEqual([2]);
  app.updateDecks(); api.getMyDecks.mock.calls[3][0]([]);
  expect(app.state.decks).toEqual([]);
  expect(Library.updateDecks).not.toHaveBeenCalled();
});

test('a response waiting for cards cannot restore deleted decks later', () => {
  jest.useFakeTimers();
  const app=setup(), api=app.props.options.api;
  const cards=app.state.cards; app.state.cards=null;
  app.updateDecks(); api.getMyDecks.mock.calls[0][0]([row(1,'Deleted')]);
  app.updateDecks(); app.state.cards=cards;
  api.getMyDecks.mock.calls[1][0]([]);
  jest.runTimersToTime(200);
  expect(app.state.decks).toEqual([]);
  jest.useRealTimers();
});
