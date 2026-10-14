import GameBoard from './board/GameBoard';
import Card from './board/Card';
import Aura from './board/Aura';
import fixture from './state-resolution.fixture.json';

function setup() {
  const board=new GameBoard();board.started=true;board.currentArea=board.areas[0];let id=0;
  function card(tile,props={}) {
    const c=new Card(++id,board.areas[0].field.tiles[tile]);
    c.identify(Object.assign({nameCard:'Test',cardType:'figure',atk:300,hp:1000,chp:1000,range:3,
      states:{},actionPt:1,motionPt:1,firstTurn:false},props));
    board.update();return c;
  }
  return {board,card};
}

[true,false].forEach(einFirst=>test('Kuroko and Ein settle camouflage and immune together (Ein first: '+einFirst+')',()=>{
  const {board,card}=setup();let hero,ein;
  if(!einFirst)hero=card(6,{cardType:'hero',blueprint:fixture.kuroko});
  ein=card(2,{blueprint:fixture.ein});
  if(einFirst)hero=card(6,{cardType:'hero',blueprint:fixture.kuroko});
  const target=card(4),cover=card(0);
  expect(target.concealed).toBe(true);expect(target.immune).toBe(true);
  cover.goto(board.areas[0].cemetery);
  expect(target.concealed).toBe(false);expect(target.immune).toBe(false);
  cover.goto(board.areas[0].field.tiles[0]);
  expect(target.concealed).toBe(true);expect(target.immune).toBe(true);
  ein.silence();expect(target.concealed).toBe(true);expect(target.immune).toBe(false);
  hero.silence();expect(target.concealed).toBe(false);
}));

test('a longer aura chain settles on gain and loss without an extra event',()=>{
  const {board,card}=setup(),c=card(0);
  ['lethal','immune','concealed'].forEach((state,i,states)=>{
    board.addAura(new Aura(c,value=>({...value,states:{...value.states,[state]:true}}),
      ()=>[c.location],target=>target.hasState(states[i+1]||'flying')));
  });
  c.setState('flying',true);expect(c.hasState('lethal')).toBe(true);
  c.setState('flying',false);
  ['flying','concealed','immune','lethal'].forEach(s=>expect(c.hasState(s)).toBe(false));
});

test('zero HP stays zero while the client waits for the destruction notification',()=>{
  const {board,card}=setup(),c=card(0,{hp:300,chp:300});
  c.damage(300);board.update();expect(c.chp).toBe(0);expect(c.eff.chp).toBe(0);
});

test('contradictory aura rules cannot recurse forever or leave updates locked',()=>{
  const {board,card}=setup(),c=card(0);let calls=0;
  board.addAura(new Aura(c,value=>{calls++;return {...value,states:{...value.states,immune:true}};},
    ()=>[c.location],target=>!target.immune));
  expect(()=>board.update()).not.toThrow();expect(calls).toBeLessThanOrEqual(32);
  expect(board.updateState).toBeUndefined();
});
