import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-dom/test-utils';
import Page from './DeckbuilderPage';
import {encodeDeck} from '../../../services/DeckData';

jest.mock('../../Nav', () => 'nav');
jest.mock('../../cards/Card', () => 'card');
jest.mock('./HeroSelector', () => 'selector');
jest.mock('recharts', () => ({BarChart:'chart',Bar:'bar',XAxis:'axis',YAxis:'axis',CartesianGrid:'grid',Tooltip:'tooltip',Legend:'legend'}));
jest.mock('../../../services/User', () => ({isConnected:()=>true,getData:()=>({authorization:0}),updateDeck:()=>{},getDeck:()=>null}));

test('the real editor imports a code, updates the original deck and allows retry after rejection', () => {
  const host=document.createElement('div'); document.body.appendChild(host);
  const original={idDeck:42,name:'Original',hero:3,cards:{329:1},format:'standard'};
  const props={deck:original,cards:[{idCardmodel:3,cardType:'hero',idColor:2,idColor2:4,nameCard:'Hero'},
    {idCardmodel:329,cardType:'spell',idColor:2,mana:'2',nameCard:'Spell'}],customs:[],
    api:{saveDeck:jest.fn()},history:{push:jest.fn()},updateDecks:jest.fn()};
  ReactDOM.render(<Page {...props}/>,host);
  const code=encodeDeck({name:'Imported',hero:3,cards:{329:2},format:'standard'});
  TestUtils.Simulate.change(host.querySelector('textarea'),{target:{value:code}});
  const save=Array.from(host.querySelectorAll('button')).find(button=>button.textContent==='Modifier');
  TestUtils.Simulate.click(save);
  expect(props.api.saveDeck.mock.calls[0][0].id).toBe(42);
  expect(JSON.parse(window.atob(props.api.saveDeck.mock.calls[0][0].supercode)).cards).toEqual({329:2});
  expect(original.cards).toEqual({329:1});
  props.api.saveDeck.mock.calls[0][2]({error:2});
  expect(host.querySelector('[role="alert"]').textContent).toMatch(/pas été enregistré/);
  TestUtils.Simulate.click(save);
  expect(props.api.saveDeck).toHaveBeenCalledTimes(2);
  props.api.saveDeck.mock.calls[1][1](42);
  props.updateDecks.mock.calls[0][0]();
  expect(props.history.push).toHaveBeenCalledWith('/decks');
  ReactDOM.unmountComponentAtNode(host); document.body.removeChild(host);
});
