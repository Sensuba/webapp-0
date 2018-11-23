import GameBoard from '../model/board/GameBoard';
import Card from '../model/board/Card';

export default (state = new GameBoard(), n) => {

  switch(n.type) {
    case "start":
      state.start();
      break;
    case "newturn":
      state.newTurn(n.src.no);
      //this.manager.controller = (this.no === n.src.no ? new PlayingState(this.manager) : new WaitingState(this.manager));
      //this.isPlaying = this.no === n.src.no;
      break;
    case "newcard":
      new Card(n.src.no, state.find(n.data[0]));
      break;
    case "identify":
      state.find(n.data[0].id).identify(n.data[0]);
      break;
    case "cardmove": {
      var card = state.find(n.src),
          loc = state.find(n.data[0]);
      if (card && loc)
        card.goto(loc);
      break; }
    case "destroycard": {
      var card = state.find(n.src);
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
