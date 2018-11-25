import GameBoard from '../model/board/GameBoard';
import Card from '../model/board/Card';

export default (state = new GameBoard(), n) => {

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
    case "destroycard": {
      let card = state.find(n.src);
      if (card)
        card.destroy();
      break; }
    case "createmana":
      state.areas[n.src.no].manapool.createReceptacle(n.data[0].value);
      break;
    case "usemana":
      state.areas[n.src.no].manapool.use(n.data[0].value);
      break;
    default: break;
    }

    return state;
}
