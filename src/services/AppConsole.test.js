import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-dom/test-utils';
import AppConsole from './AppConsole';
import GameConsole from '../game/console/GameConsole';
import Page from '../components/decks/deckbuilder/DeckbuilderPage';
import User from './User';
import {encodeDeck, decodeDeck} from './DeckData';

jest.mock('../components/Nav', () => 'nav');
jest.mock('../components/cards/Card', () => 'card');
jest.mock('../components/decks/deckbuilder/HeroSelector', () => 'selector');
jest.mock('recharts', () => ({BarChart:'chart',Bar:'bar',XAxis:'axis',YAxis:'axis',CartesianGrid:'grid',Tooltip:'tooltip',Legend:'legend'}));
jest.mock('./User', () => ({isConnected:jest.fn(()=>true),getData:()=>({authorization:0}),updateDeck:jest.fn(),getDeck:()=>null}));

const cards = [
  {idCardmodel:3,author:0,cardType:'hero',nameCard:'Holo',idColor:2,idColor2:4,hp:'6000',atk:'600',range:'1',description:'Niveau Supérieur.',lv2:{description:'Esprit'},lvmax:{description:'Piochez.'},tokens:[{nameCard:'Esprit',cardType:'figure',idColor:4,mana:'1',atk:'300',hp:'300',range:'1'}]},
  {idCardmodel:329,author:0,cardType:'spell',nameCard:'Première main',idColor:2,mana:'2',description:'Inflige 700 dégâts.',anime:'Exemple',flavourText:'Texte',idEdition:2,rarity:1},
  {idCardmodel:330,author:'0',cardType:'figure',nameCard:'Oiseau',idColor:4,mana:0,atk:'300',hp:'500',range:'1',archetypes:['beast'],description:'Vol',anime:'Exemple',flavourText:'Texte',idEdition:3,rarity:2},
  {idCardmodel:331,author:0,cardType:'spell',nameCard:'Bleu',idColor:3,mana:'2',description:'Piochez.',anime:'Autre',flavourText:'Texte',idEdition:2,rarity:3},
  {idCardmodel:999,author:9,cardType:'spell',nameCard:'Privée',idColor:2,mana:'2',description:'SECRET BLUEPRINT'}
];
const original={name:'Original',hero:3,cards:{329:1},format:'standard'};

function fixture() {
  const element = document.createElement('div'); document.body.appendChild(element);
  const tools = new Map();
  const host = {location:{href:'https://sensuba.com/home',pathname:'/home'},navigator:{modelContext:{
    registerTool:tool=>{if(tools.has(tool.name))throw new Error('duplicate');tools.set(tool.name,tool);},
    unregisterTool:name=>tools.delete(name)
  }}};
  const records = {42:{idDeck:42,author:1,supercode:encodeDeck(original)}};
  const api = {
    getMyDecks:jest.fn(done=>done(Object.values(records))),
    saveDeck:jest.fn((params,done)=>{
      const id=params.id || 43; records[id]={idDeck:id,author:1,supercode:params.supercode};done(id);
    })
  };
  const app={state:{cards,decks:[decodeDeck(records[42])]},props:{options:{api}}};
  const controller=new AppConsole(app,host,{log:jest.fn()});
  app.updateDecks=jest.fn(done=>{app.state.decks=Object.values(records).map(decodeDeck);done();});
  const history={push:jest.fn(path=>{
    ReactDOM.unmountComponentAtNode(element);
    if(path==='/decks')return;
    const match=path.match(/builder\/(\d+)$/);
    const deck=match && app.state.decks.find(d=>String(d.idDeck)===match[1]);
    ReactDOM.render(<Page cards={cards.filter(c=>Number(c.author)===0)} customs={[]} collection={[]} deck={deck}
      type="standard" api={api} history={history} updateDecks={app.updateDecks} consoleTools={controller}/>,element);
  })};
  app.router={history};controller.mount();
  const cleanup=()=>{ReactDOM.unmountComponentAtNode(element);document.body.removeChild(element);controller.dispose();};
  return {host,tools,app,controller,api:controller.api,server:api,records,element,cleanup};
}

beforeEach(()=>User.isConnected.mockImplementation(()=>true));

test('read and all global tools survive game entry/exit without duplicate registrations', async()=>{
  const f=fixture();await f.controller.bridge.ready;
  expect(f.tools.size).toBe(10);
  const readTool=f.tools.get('sensuba_read');
  expect(await f.api.read('hOLO')).toMatch(/Nv MAX/);
  expect(await f.api.read('Holo')).toMatch(/Esprit \(jeton\)/);
  expect((await f.api.read('Privée')).ok).toBe(false);
  for(let i=0;i<2;i++){
    const game=new GameConsole({},{log:jest.fn()});game.mount(f.host);await game.webmcp.ready;
    expect(f.tools.size).toBe(23);
    expect(f.tools.get('sensuba_read')).toBe(readTool);
    expect(await f.host.sensuba.read('Holo')).toMatch(/6000 PV/);
    expect(await f.host.sensuba.help()).toMatch(/sensuba.attack/);
    expect((await f.api.deckNew()).ok).toBe(false);
    game.dispose();
    expect(f.host.sensuba).toBe(f.api);expect(f.tools.size).toBe(10);
    expect(await f.host.sensuba.read('Holo')).toMatch(/Nv 2/);
  }
  f.cleanup();expect(f.tools.size).toBe(0);
  expect((await readTool.execute({name:'Holo'})).isError).toBe(true);
});

test('shared filters, pagination and full reads expose only official card text', async()=>{
  const f=fixture();await f.controller.bridge.ready;
  const query={filters:{colors:[0,2],type:'spell',mana:2,manaop:'5',edition:2,rarity:'common',name:'premiere',description:'dégâts',anime:'Exemple',flavour:'Texte',orderBy:'name'},limit:1};
  const found=await f.api.searchCards(query);
  expect(found.total).toBe(1);expect(found.cards[0].id).toBe(329);
  const read=await f.api.readCards();expect(read.cards[0].text).toMatch(/700 dégâts/);
  expect((await f.api.searchCards({filters:{archetype:'bête',atk:300,hp:500,range:1,mana:0}})).cards.map(c=>c.id)).toEqual([330]);
  const all=await f.api.readCards({filters:{},limit:2,page:1});
  expect(all.total).toBe(4);expect(all.pages).toBe(2);expect(all.cards).toHaveLength(2);
  expect((await f.api.readCards({page:2,limit:2})).cards).toHaveLength(2);
  expect((await f.api.readCards({page:3,limit:2})).cards).toHaveLength(0);
  expect(JSON.stringify(all)).not.toMatch(/BLUEPRINT|Privée/);
  for(const args of [{limit:51},{page:0},{filters:{id:42}},{filters:{colors:[6]}},{filters:{mana:'2'}},{filters:{manaop:'='}}]){
    expect((await f.api.searchCards(args)).ok).toBe(false);
    expect((await f.tools.get('sensuba_searchCards').execute(args)).isError).toBe(true);
  }
  f.cleanup();
});

test('initial search inherits the visible cards filters and handles catalogue loading',async()=>{
  const formerURL=global.URL;global.URL=require('url').URL;
  const f=fixture();
  f.host.location={href:'https://sensuba.com/cards?type=spell&colors=0%2C2&mana=2&manaop=5',pathname:'/cards'};
  expect((await f.api.searchCards()).cards.map(c=>c.id)).toEqual([329]);
  f.app.state.cards=null;expect((await f.api.read('Holo')).error).toMatch(/chargement/);
  f.cleanup();global.URL=formerURL;
});

test('real editor creates a copy and edits it without sharing identity; UI edits remain visible to tools',async()=>{
  const f=fixture();await f.controller.bridge.ready;
  expect((await f.api.decks()).decks[0].id).toBe(42);
  expect((await f.api.deckNew()).id).toBe(null);
  const legacy=window.btoa(JSON.stringify(Object.assign({},original,{id:42,idDeck:42,author:99})));
  expect((await f.api.deckUpdate({supercode:legacy})).id).toBe(null);
  expect((await f.api.deckUpdate({name:'Copie',cards:[{id:329,count:2}]})).count).toBe(2);
  const view=await f.api.deckView();expect(JSON.parse(window.atob(view.supercode)).idDeck).toBeUndefined();
  expect((await f.api.deckOpen(42)).ok).toBe(false);
  expect(await f.api.deckSave()).toEqual({ok:true,saved:true,id:43});
  expect(f.server.saveDeck.mock.calls[0][0].id).toBeUndefined();
  expect(decodeDeck(f.records[42]).name).toBe('Original');
  await f.api.deckOpen(43);
  expect((await f.api.deckUpdate({supercode:legacy})).id).toBe(43);
  TestUtils.Simulate.change(f.element.querySelector('textarea'),{target:{value:encodeDeck(Object.assign({},original,{name:'Saisie manuelle'}))}});
  expect((await f.api.deckView()).deck.name).toBe('Saisie manuelle');
  await f.api.deckSave();expect(f.server.saveDeck.mock.calls[1][0].id).toBe(43);
  expect(decodeDeck(f.records[42]).name).toBe('Original');
  expect(decodeDeck(f.records[43]).name).toBe('Saisie manuelle');
  f.cleanup();
});

test('deck updates reject invalid composition atomically; account and ownership checks precede writes',async()=>{
  const f=fixture();
  expect((await f.api.deckOpen(999)).ok).toBe(false);
  await f.api.deckOpen(42);
  for(const changes of [{name:'Bad',cards:[{id:331,count:1}]},{hero:329},{cards:[{id:329,count:3}]},{cards:[{id:999,count:1}]},{supercode:'bad'},{idDeck:99},{cards:[{id:329,count:1},{id:329,count:2}]}]){
    expect((await f.api.deckUpdate(changes)).ok).toBe(false);
    expect((await f.api.deckView()).deck.name).toBe('Original');
  }
  expect((await f.api.deckUpdate({cards:[{id:329,count:0}]})).count).toBe(0);
  User.isConnected.mockImplementation(()=>false);
  expect((await f.api.deckSave()).ok).toBe(false);expect((await f.api.decks()).ok).toBe(false);
  expect(f.server.saveDeck).not.toHaveBeenCalled();
  expect(await f.api.read('Holo')).toMatch(/Nv 1/);
  f.cleanup();
});

test('save awaits server acknowledgement, blocks concurrent writes and preserves an assigned ID after refresh failure',async()=>{
  const f=fixture();await f.api.deckNew();await f.api.deckUpdate({supercode:encodeDeck(original)});
  f.server.saveDeck.mockImplementation(()=>{});
  let settled=false;const pending=f.api.deckSave().then(value=>{settled=true;return value;});
  expect(settled).toBe(false);
  expect((await f.api.deckSave()).ok).toBe(false);
  expect((await f.api.deckUpdate({name:'Race'})).ok).toBe(false);
  f.app.updateDecks.mockImplementation((done,failed)=>failed());
  f.server.saveDeck.mock.calls[0][1](43);
  expect(await pending).toMatchObject({saved:true,id:43});
  const again=f.api.deckSave();expect(f.server.saveDeck.mock.calls[1][0].id).toBe(43);
  f.server.saveDeck.mock.calls[1][2]({uncertain:true});
  expect(await again).toMatchObject({ok:false,uncertain:true});
  expect((await f.api.deckSave()).ok).toBe(false);
  f.cleanup();
});
