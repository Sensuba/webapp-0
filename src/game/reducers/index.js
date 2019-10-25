import GameBoard from '../model/board/GameBoard';
import Card from '../model/board/Card';

export default (state = new GameBoard(), n) => {

  state.log.add({type:n.type, src:n.src, data:n.data});
  switch(n.type) {
    case "start":
      state.start();
      break;
    case "newturn":
      state.newTurn(n.src.no);
      break;
    case "newcard":
      new Card(n.src.no, state.find(n.data[0]));
      break;
    case "identify":
      state.find(n.data[0].id).identify(n.data[0]);
      break;
    case "cardmove": {
      let card = state.find(n.src),
          loc = state.find(n.data[0]);
      if (card && loc)
        card.goto(loc);
      break; }
    case "draw": {
      state.find(n.src).draw()
      break;
    }
    case "summon": {
      let card = state.find(n.src),
          loc = state.find(n.data[0]);
      if (card && loc)
        card.summon(loc);
      break; }
    case "charmove": {
      let card = state.find(n.src);
      if (card)
        card.move();
      break; }
    case "charattack": {
      let card = state.find(n.src);
      if (card)
        card.attack();
      break; }
    case "damagecard": {
      let card = state.find(n.src);
      if (card)
        card.damage(n.data[0], state.find(n.data[1]));
      break; }
    case "healcard": {
      let card = state.find(n.src);
      if (card)
        card.heal(n.data[0], state.find(n.data[1]));
      break; }
    case "boostcard": {
      let card = state.find(n.src);
      if (card)
        card.boost(n.data[0], n.data[1], n.data[2]);
      break; }
    case "setcard": {
      let card = state.find(n.src);
      if (card)
        card.set(n.data[0], n.data[1], n.data[2], n.data[3]);
      break; }
    case "charfreeze": {
      let card = state.find(n.src);
      if (card)
        card.freeze();
      break; }
    case "silence": {
      let card = state.find(n.src);
      if (card)
        card.silence();
      break; }
    case "destroycard": {
      let card = state.find(n.src);
      if (card)
        card.destroy();
      break; }
    case "levelup": {
      let card = state.find(n.src);
      if (card)
        card.levelUp();
      break; }
    case "cardfaculty": {
      let card = state.find(n.src);
      if (card)
        card.use(n.data[0].value);
      break; }
    case "addshield": {
      let card = state.find(n.src);
      if (card)
        card.addShield();
      break; }
    case "breakshield": {
      let card = state.find(n.src);
      if (card)
        card.breakShield();
      break; }
    case "setstate": {
      let card = state.find(n.src);
      if (card)
        card.setState(n.data[0].value, n.data[1].value);
      break; }
    case "setpoints": {
      let card = state.find(n.src);
      if (card)
        card.setPoints(n.data[0].value, n.data[1].value, n.data[2].value);
      break; }
    case "addmut": {
      let card = state.find(n.src);
      let mutsrc = state.find(n.data[0]);
      if (card) {
        let mut = mutsrc.mutdata[n.data[1].value].getMutation();
        card.mutate(mut.effect, mut.end);
      }
      break; }
    case "createmana":
      state.areas[n.src.no].manapool.createReceptacle(n.data[0].value);
      break;
    case "usemana":
      state.areas[n.src.no].manapool.use(n.data[0].value);
      break;
    case "refillmana":
      state.areas[n.src.no].manapool.refill(n.data[0].value);
      break;
    case "creategem":
      state.areas[n.src.no].manapool.createGem();
      break;
    case "usegem":
      state.areas[n.src.no].manapool.useGem();
      break;
    case "end":
      state.end(n.data[0].no);
      break;
    default: break;
  }
  state.notify(n.type, n.src, n.data);

  return state;
}
