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
      if (window.resetTimer)
        window.resetTimer();
      break;
    case "newcard": {
      var card = new Card(n.src.no, state.find(n.data[0]));
      if (n.data[1])
        card.identify(n.data[1]);
      break;
    } case "identify":
      state.find(n.data[0].id).identify(n.data[0]);
      break;
    case "transform":
      state.find(n.src).transform(n.data[0].data);
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
    case "playcard": {
      let card = state.find(n.src);
      if (card)
        card.finalize(n.data[3], n.data[4]);
      break; }
    case "trap": {
      let card = state.find(n.src);
      if (card)
        card.finalize(n.data[1], n.data[2]);
      break; }
    case "summon": {
      let card = state.find(n.src),
          loc = state.find(n.data[0]);
      if (card && loc)
        card.summon(loc);
      break; }
    case "secretsetup": {
      let card = state.find(n.src);
      if (card)
        card.cardType = "secret";
      break; }
    case "trial": {
      let card = state.find(n.src);
      if (card && card.steps)
        card.steps.forEach(step => { if (step.step === n.data[0]) step.completed = true; })
      break; }
    case "charmove": {
      let card = state.find(n.src);
      if (card)
        card.move();
      break; }
    case "charattack": {
      let card = state.find(n.src);
      if (card)
        card.attack(n.data[1].value);
      break; }
    case "damagecard": {
      let card = state.find(n.src);
      if (card)
        card.damage(n.data[0], n.data[1] ? state.find(n.data[1]) : null);
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
    case "poisoncard": {
      let card = state.find(n.src);
      if (card)
        card.poison(n.data[0]);
      break; }
    case "curepoison": {
      let card = state.find(n.src);
      if (card)
        card.curePoison(n.data[0]);
      break; }
    case "charge": {
      let card = state.find(n.src);
      if (card)
        card.charge(n.data[0]);
      break; }
    case "changecost": {
      let card = state.find(n.src);
      if (card)
        card.changeCost(n.data[0]);
      break; }
    case "setcard": {
      let card = state.find(n.src);
      if (card)
        card.set(n.data[0], n.data[1], n.data[2], n.data[3]);
      break; }
    case "overloadcard": {
      let card = state.find(n.src);
      if (card)
        card.boostoverload(n.data[0]);
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
      if (card) {
        if (n.data[0].value)
          card.levelDown();
        else card.levelUp();
      }
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
    case "storevar": {
      let card = state.find(n.src);
      if (card)
        card.setVariable(n.data[0].value, n.data[1]);
      break; }
    case "clearvar": {
      let card = state.find(n.src);
      if (card)
        card.clearVariable(n.data[0].value, n.data[1]);
      break; }
    case "addmut": {
      let card = state.find(n.src);
      let mutsrc = state.find(n.data[0]);
      if (card) {
        let mut = mutsrc.mutdata[n.data[1].value].getMutation();
        card.mutate(mut.effect, mut.end);
      }
      break; }
    case "addeffect": {
      let lastwill = n.data[1].value;
      if (lastwill) {
        let card = state.find(n.src);
        if (card)
          card.lastwill = true;
      }
      break; }
    case "hazards": {
      let tile = state.find(n.src);
      if (tile)
        tile.addHazards(n.data[0].value);
      break; }
    case "clearhazards": {
      let tile = state.find(n.src);
      if (tile)
        tile.clearHazards(n.data[0].value);
      break; }
    case "nextcard": {
      let player = state.find(n.src);
      let mutsrc = state.find(n.data[0]);
      let mut = mutsrc.mutdata[n.data[1].value].getMutation();
      player.addAspect(mut.effect, mut.targets, mut.end);
      break; }
    case "createmana":
      state.areas[n.src.no].manapool.createReceptacle(n.data[0].value);
      break;
    case "destroymana":
      state.areas[n.src.no].manapool.destroyReceptacle();
      break;
    case "usemana":
      state.areas[n.src.no].manapool.use(n.data[0].value);
      break;
    case "refillmana":
      state.areas[n.src.no].manapool.refill(n.data[0].value);
      break;
    case "extramana":
      state.areas[n.src.no].manapool.addExtraMana(n.data[0].value);
      break;
    case "creategem":
      state.areas[n.src.no].manapool.createGem();
      break;
    case "usegem":
      state.areas[n.src.no].manapool.useGem();
      break;
    case "fatigue":
      state.areas[n.src.no].deck.fatigue();
      break;
    case "editfatigue":
      state.areas[n.src.no].deck.editFatigue(n.data[0].value, n.data[1].value);
      break;
    case "openchoosebox":
      state.areas[n.src.no].choosebox.open();
      break;
    case "visibilityloc": {
      state.find(n.src).public = n.data[0].value;
      break; }
    case "extraturn":
      state.areas[n.src.no].extraTurn();
      break;
    case "endeffect":
    case "cleanup":
      state.update();
      break;
    case "end":
      state.end(n.data[0].no);
      break;
    default: break;
  }
  state.notify(n.type, n.src, n.data);

  return state;
}
