import GameBoard from './board/GameBoard';
import Card from './board/Card';
import {commandError} from '../controller/CommandRules';
import {cardView} from '../console/VisibleBoard';
import fixture from './ghost-nanachi.fixture.json';

function setup() {
  const board=new GameBoard();board.started=true;board.currentArea=board.areas[0];
  board.areas[0].manapool.receptacles=Array(10).fill(true);
  let id=0;
  function card(tile,props={}) {
    const card=new Card(++id,tile);
    card.identify(Object.assign({nameCard:'Test',cardType:'figure',atk:300,hp:2000,chp:2000,range:4,
      states:{},actionPt:1,motionPt:1,skillPt:10,firstTurn:false},props));
    board.update();return card;
  }
  return {board,card};
}

test('cannot cover removes rear and neighbor protection without concealment or loss of attack',()=>{
  const {board,card}=setup(),area=board.areas[0];
  const hero=card(area.field.tiles[6],{cardType:'hero'});
  const front=area.field.tiles.find(t=>t.isEmpty&&hero.location.isBehind(t));
  const ghost=card(front,fixture.illusion);
  ghost.firstTurn=false;ghost.actionPt=1;board.update();
  expect(ghost.hasState('cannot cover')).toBe(true);
  expect(ghost.cover(hero)).toBe(false);expect(hero.covered).toBe(false);expect(ghost.concealed).toBe(false);
  ghost.setState('cover neighbors',true);expect(ghost.cover(hero)).toBe(false);
  ghost.setState('cannot cover',false);expect(ghost.cover(hero)).toBe(true);
  ghost.setState('cannot cover',true);expect(ghost.cover(hero)).toBe(false);
  const enemy=card(board.areas[1].field.tiles[0]);
  expect(ghost.canAttack(enemy)).toBe(true);expect(ghost.targetableBy(enemy)).toBe(true);
  expect(cardView(ghost,0).states).toContain('cannot cover');
  ghost.silence();expect(ghost.hasState('cannot cover')).toBe(false);expect(ghost.cover(hero)).toBe(true);
});

test('Nanachi untargeted and targeted skills track separate flags in mouse/console command validation',()=>{
  const {board,card}=setup();const hero=card(board.areas[0].field.tiles[6],{cardType:'hero',blueprint:fixture.nanachi});
  hero.skillPt=10;board.update();
  const game={role:'player',no:0,state:{pending:0},socket:{connected:true},store:{getState:()=>board}};
  const keys=['nanachiskillmana','nanachiskillsummon','nanachiskillfavour'];
  keys.forEach((key,i)=>{
    const cmd={type:'faculty',id:hero.id,faculty:i+1};
    if(i===1)cmd.target=board.areas[0].field.tiles.find(t=>t.isEmpty).id;
    expect(commandError(game,cmd)).toBe(null);
    hero.setVariable(key,1);
    expect(hero.canUse(hero.faculties[i+1])).toBe(false);
    expect(commandError(game,cmd)).toBe('Faculté indisponible.');
    expect(hero.canUse(hero.faculties[(i===2?0:2)+1])).toBe(true);
    hero.clearVariable(key);
    expect(commandError(game,cmd)).toBe(null);
  });
});
