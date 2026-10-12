import GameConsole from './GameConsole';
import describeEvent from './FollowEvents';
import {formatCard, readOfficial} from './ReadCard';
import GameBoard from '../model/board/GameBoard';
import EndTurn from '../view/UI/EndTurn';
import Library from '../../services/Library';

jest.mock('../../services/Library', () => ({getCardList: jest.fn()}));

const koito = {author:0, nameCard:'Koito Minase', cardType:'figure', idColor:2, mana:'1', atk:'200', hp:'500', range:1,
  description:'! : Fait reculer un personnage adverse.', anime:'OMIT', flavourText:'OMIT', idEdition:9};
const koitoText = 'Koito Minase\nFigure rouge, 1 mana\n200/500/1\n! : Fait reculer un personnage adverse.';

function setup() {
  const board = new GameBoard();
  const game = {role:'player', no:0, state:{timer:true}, store:{getState:()=>board}, socket:{connected:true}, props:{cards:[koito]}};
  const output = {log:jest.fn()};
  const controller = new GameConsole(game,output);
  game.consoleController = controller;
  const [me,other] = board.areas;
  let id = 100;
  const card = (location, nameCard='Koito', cardType='figure') => {
    const value = {id:{type:'card',no:id++}, location, nameCard, cardType,
      get area() {return this.location.area;}, get onBoard() {return this.location.id.type === 'tile';},
      isType(type) {return type === 'entity' ? ['hero','figure','artifact'].includes(cardType) : type === cardType;}};
    board.register(value);
    if (location.id.type === 'tile') location.card = value;
    else location.cards.push(value);
    return value;
  };
  const event = (type,src,data=[]) => describeEvent(game,{type,src:src.id,data});
  return {board,game,controller,output,card,me,other,event};
}

test('read produces the requested exact official-card text, case insensitive', () => {
  expect(readOfficial([koito], ' kOiTo MiNaSe ')).toBe(koitoText);
  expect(formatCard(koito)).not.toMatch(/OMIT|9/);
});

test('read only accepts author zero and deduplicates official reprints', () => {
  const custom = Object.assign({},koito,{author:12,description:'CUSTOM'});
  expect(readOfficial([custom,koito,Object.assign({},koito,{author:'0',idEdition:3})], 'KOITO MINASE')).toBe(koitoText);
  [undefined,null,false,'',1].forEach(author => expect(()=>readOfficial([Object.assign({},koito,{author})],koito.nameCard)).toThrow());
  expect(()=>readOfficial([koito], 'Koito')).toThrow();
  expect(()=>readOfficial([koito], '')).toThrow();
});

test('read retains game rules for spells, artifacts, heroes, levels and mechas', () => {
  expect(formatCard({nameCard:'Sort',cardType:'spell',idColor:3,mana:0,description:'Piochez.',overload:2}))
    .toBe('Sort\nSort bleu, 0 mana\nPiochez.\nSurcharge : 2');
  expect(formatCard({nameCard:'Objet',cardType:'artifact',idColor:4,mana:2,hp:500})).toContain('Durabilité : 500');
  const hero = {nameCard:'Héros',cardType:'hero',idColor:2,idColor2:3,atk:200,hp:6000,range:1,lv2:{atk:400,description:'Effet niveau 2.'}};
  expect(formatCard(hero)).toContain('Héros rouge / bleu');
  expect(formatCard(hero)).toContain('Niveau 2 :\n400/6000/1\nEffet niveau 2.');
  expect(formatCard({nameCard:'Mecha',cardType:'artifact',mecha:true,activation:3,atk:500,hp:1000,range:1,mechactive:{atk:700}})).toContain('Mecha activé :\n700/1000/1');
});

test('read is available through the console and uses catalog rather than game identities', async () => {
  const f=setup();
  expect(await f.controller.api.read('koito minase')).toBe(koitoText);
  expect(f.output.log).toHaveBeenLastCalledWith(koitoText);
  f.game.props.cards=[];
  Library.getCardList.mockImplementation(callback => callback([koito]));
  expect(await f.controller.api.read('KOITO MINASE')).toBe(koitoText);
  expect((await f.controller.api.read('absent')).ok).toBe(false);
  f.controller.dispose();
  expect((await f.controller.api.read('Koito Minase')).ok).toBe(false);
});

test('read handles unavailable catalog and ignores a late result after disposal', async () => {
  const f=setup(); f.game.props.cards=[];
  Library.getCardList.mockImplementation(()=>{throw new Error('private internals');});
  expect(await f.controller.api.read('Koito Minase')).toEqual({ok:false,error:'Catalogue indisponible.'});
  let receive;
  Library.getCardList.mockImplementation(callback=>{receive=callback;});
  const pending=f.controller.api.read('Koito Minase');
  f.controller.dispose(); receive([koito]);
  expect((await pending).ok).toBe(false);
  expect(f.output.log).not.toHaveBeenCalled();
});

test('draws show only own identities, including when opposing cards are cached', () => {
  const f=setup();
  const own=f.card(f.me.hand), hidden=f.card(f.other.hand,'HIDDEN');
  expect(f.event('draw',f.me,[own.id])).toBe('Vous piochez Koito.');
  expect(f.event('draw',f.other,[hidden.id])).toBe('L’adversaire pioche une carte.');
  f.game.role='spectator';
  expect(f.event('draw',f.me,[own.id])).toBe('Le joueur 1 pioche une carte.');
});

test('field moves use both square numbers once, ignoring hand/deck moves and charmove duplicate', () => {
  const f=setup(); const card=f.card(f.me.field.tiles[0]);
  expect(f.event('cardmove',card,[f.me.field.tiles[4].id,f.me.field.tiles[0].id])).toBe('Koito se déplace : case 1 de votre camp → case 5 de votre camp.');
  expect(f.event('charmove',card,[f.me.field.tiles[4].id])).toBe(null);
  expect(f.event('cardmove',card,[f.me.hand.id,f.me.deck.id])).toBe(null);
});

test('plays, summons, attacks and faculties name their public targets', () => {
  const f=setup(); const own=f.card(f.me.field.tiles[2]), enemy=f.card(f.other.field.tiles[8],'Héros','hero');
  expect(f.event('playcard',own,[own.location.id,enemy.location.id,enemy.id])).toBe('Vous jouez Koito en case 3 de votre camp → Héros (case 9 du camp adverse).');
  expect(f.event('summon',own,[own.location.id])).toBe('Koito est invoqué en case 3 de votre camp.');
  expect(f.event('charattack',own,[enemy.id])).toBe('Koito (case 3 de votre camp) attaque Héros (case 9 du camp adverse).');
  expect(f.event('cardfaculty',own,[{value:true},enemy.location.id,{value:'Fait reculer.'}])).toContain('utilise une action → Héros (case 9 du camp adverse) : Fait reculer.');
  expect(f.event('cardfaculty',own,[{value:false},f.other.field.tiles[0].id,{value:'Invoque.'}])).toContain('utilise une compétence → case 1 du camp adverse : Invoque.');
  expect(f.event('cardfaculty',own,[{value:true},null,{value:''}])).toContain('Crée un réceptacle de mana.');
});

test('secret play never reveals a cached identity but explicit triggering is public', () => {
  const f=setup(); const secret=f.card(f.other.field.tiles[1],'SECRET_NAME','secret');
  expect(f.event('playcard',secret,[secret.location.id])).toBe('L’adversaire joue un secret en case 2 du camp adverse.');
  secret.location=f.other.court;
  expect(f.event('triggersecret',secret,[{value:'Effet révélé.'}])).toBe('Secret déclenché du camp adverse : SECRET_NAME — Effet révélé.');
});

test('only board entities are destroyed in follow; burns reveal only the burned card', () => {
  const f=setup(); const unit=f.card(f.me.field.tiles[6]), spell=f.card(f.me.court,'Sort','spell'), burned=f.card(f.other.deck,'Brûlée');
  expect(f.event('destroycard',unit)).toBe('Koito (case 7 de votre camp) est détruit.');
  expect(f.event('destroycard',spell)).toBe(null);
  expect(f.event('burncard',f.other,[burned.id])).toBe('Carte brûlée / détruite du deck du camp adverse : Brûlée.');
});

test('curse identifies affected hero; turn boundaries and game outcomes are short', () => {
  const f=setup(); f.me.hero=f.card(f.me.field.tiles[6],'Héros','hero');
  expect(f.event('fatigue',f.me.deck)).toBe('Malédiction du deck de votre camp → Héros (case 7 de votre camp).');
  expect(f.event('newturn',f.me)).toBe('Votre tour commence.');
  expect(f.event('endturn',f.other)).toBe('Le tour adverse se termine.');
  [3,4,2].forEach((no,i)=>expect(f.event('end',f.board,[{no}])).toBe(['Victoire !','Défaite.','Égalité.'][i]));
  expect(f.event('end',f.board,[{no:6}])).toBe(null);
});

test('event text is captured before source destruction and remains safe after mutation', () => {
  const f=setup(); const card=f.card(f.me.field.tiles[0]);
  f.controller.api.follow();
  const message=f.controller.capture({type:'destroycard',src:card.id,data:[]});
  card.location=f.me.cemetery; card.nameCard='OTHER';
  f.controller.publish(message);
  expect(f.output.log).toHaveBeenLastCalledWith('Koito (case 1 de votre camp) est détruit.');
});

test('timer emits 60s and 30s once per own turn and resets on bonus turns', () => {
  const f=setup(); f.controller.api.follow(); f.output.log.mockClear();
  f.controller.startTurn(0,150);
  [150,61,60,60,59,31,30,29,65,60].forEach(s=>f.controller.timer(s));
  expect(f.output.log.mock.calls.map(c=>c[0])).toEqual(['Il reste 60 secondes pour jouer.','Il reste 30 secondes pour jouer.']);
  f.controller.startTurn(0,60); f.controller.timer(60);
  expect(f.output.log).toHaveBeenCalledTimes(3);
});

test('timer ignores opposing turns, spectators, untimed games, disconnects and finished games', () => {
  [f=>f.controller.startTurn(1,150), f=>{f.game.role='spectator';}, f=>{f.game.state.timer=false;},
    f=>{f.game.state.pending=1;},f=>{f.game.ended=true;}, f=>f.controller.endTurn(), f=>f.controller.dispose()
  ].forEach(change=>{
    const f=setup(); f.controller.api.follow(); f.output.log.mockClear(); f.controller.startTurn(0,150); change(f);
    f.controller.timer(60); f.controller.timer(30);
    expect(f.output.log).not.toHaveBeenCalled();
  });
});

test('late follow does not announce expired thresholds; resync reports actual remaining time once', () => {
  const f=setup(); f.controller.startTurn(0,150); f.controller.timer(45); f.controller.api.follow(); f.output.log.mockClear();
  f.controller.timer(44); f.controller.timer(30);
  expect(f.output.log.mock.calls.map(c=>c[0])).toEqual(['Il reste 30 secondes pour jouer.']);
  f.controller.startTurn(0,150); f.output.log.mockClear(); f.controller.timer(25);
  expect(f.output.log.mock.calls.map(c=>c[0])).toEqual(['Il reste 25 secondes pour jouer.']);
});

test('EndTurn feeds the same countdown as the UI and clears its interval on unmount', () => {
  jest.useFakeTimers();
  const f=setup(); f.controller.api.follow(); f.controller.startTurn(0,61); f.output.log.mockClear();
  const timer=new EndTurn({master:f.game});
  timer.setState=next=>Object.assign(timer.state,next);
  timer.resetTimer(61);
  jest.runTimersToTime(1000);
  expect(f.output.log).toHaveBeenLastCalledWith('Il reste 60 secondes pour jouer.');
  f.game.setTimer=31;
  jest.runTimersToTime(1000);
  expect(f.output.log).toHaveBeenLastCalledWith('Il reste 30 secondes pour jouer.');
  timer.componentWillUnmount();
  const count=f.output.log.mock.calls.length;
  jest.runTimersToTime(60000);
  expect(f.output.log).toHaveBeenCalledTimes(count);
  jest.useRealTimers();
});
