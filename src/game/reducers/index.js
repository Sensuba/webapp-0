import GameBoard from '../model/board/GameBoard';
import Card from '../model/board/Card';

export default (state = new GameBoard(), action) => {

  switch(action.type) {
    case "start":
      //this.setState({waiting: false});
      break;
    case "newturn":
      state.newTurn(action.src.no);
      //this.manager.controller = (this.no === action.src.no ? new PlayingState(this.manager) : new WaitingState(this.manager));
      //this.isPlaying = this.no === action.src.no;
      break;
    case "newcard":
      //var loc = this.manager.find(action.data[0]);
      //var c = new Card(action.src.no, loc.model);
      break;
    case "identify":
      //this.manager.find(action.data[0].id).model.identify(action.data[0]);
      break;
    case "cardmove":
      //if (this.manager.find(action.src) && this.manager.find(action.data[0]))
      //  this.manager.find(action.src).model.goto(this.manager.find(action.data[0]).model);
      break;
    case "destroycard":
      //if (this.manager.find(action.src))
      //  this.manager.find(action.src).model.destroy();
      break;
    case "createmana":
      //this.state.model.areas[action.src.no].manapool.createReceptacle(action.data[0].value);
      break;
    case "usemana":
      //this.state.model.areas[action.src.no].manapool.use(action.data[0].value);
      break;
    default: break;
    }

    return state;
}
