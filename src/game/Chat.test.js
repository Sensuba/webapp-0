import {chatMessage, sendChat} from './Chat';
import Chatbox from './view/UI/Chatbox';

const fixture = () => ({props:{room:'test'},state:{waiting:false,pending:0},role:'player',socket:{connected:true,emit:jest.fn()}});

test('public chat names and system messages are rendered consistently, unknown payloads ignored', () => {
  ['Vous','Adversaire','Joueur 1','Joueur 2','Spectateur'].forEach((name,from)=>
    expect(chatMessage({type:'text',from,text:'Salut'})).toEqual({from:name,text:'Salut'}));
  expect(chatMessage({type:'text',from:'2',text:'Nom numérique'}).from).toBe('2');
  expect(chatMessage({type:'info',info:2})).toEqual({text:'Commande échouée'});
  [null,{}, {type:'text',text:{}},{type:'hidden',text:'secret'}].forEach(value=>expect(chatMessage(value)).toBe(null));
});

test('chat validates text, availability and connection without restricting turns or spectators', () => {
  const game=fixture();
  [null,undefined,1,{},'', '  ', 'a'.repeat(121)].forEach(text=>expect(sendChat(game,text).ok).toBe(false));
  expect(game.socket.emit).not.toHaveBeenCalled();
  expect(sendChat(game,'a'.repeat(120)).ok).toBe(true);
  game.role='spectator'; game.ended=true;
  expect(sendChat(game,'Bien joué !').ok).toBe(true);
  [g=>{g.unmounted=true;},g=>{g.props.room=null;},g=>{g.state.waiting=true;},g=>{g.socket.connected=false;},g=>{g.state.pending=1;},g=>{g.role=null;}].forEach(change=>{
    const current=fixture();change(current);expect(sendChat(current,'Message').ok).toBe(false);expect(current.socket.emit).not.toHaveBeenCalled();
  });
});

test('the visible input uses the same sender and preserves unsent text on failure', () => {
  document.body.innerHTML='<input id="sensuba-chat-input" />';
  const game=fixture(), box=new Chatbox({master:game});
  box.setState=state=>Object.assign(box.state,state);
  const input=document.getElementById('sensuba-chat-input');
  const event={preventDefault:jest.fn()};
  input.value='Bonjour'; game.socket.connected=false;box.submit(event);
  expect(input.value).toBe('Bonjour');expect(game.socket.emit).not.toHaveBeenCalled();
  game.socket.connected=true;box.submit(event);
  expect(input.value).toBe('');expect(game.socket.emit).toHaveBeenCalledWith('chat','Bonjour');
  document.body.innerHTML='';
});
