import Card from './Card';
import View from '../../../components/cards/Card';
jest.mock('../../../components/cards/Card', () => () => null);

function viewIn(node) {
  if (!node || typeof node !== 'object') return null;
  if (node.type === View) return node;
  const children=node.props && node.props.children;
  for (const child of [].concat(children || [])) { const found=viewIn(child); if(found)return found; }
  return null;
}
function fixture(no) {
  const areas=[{},{}];
  const model={nameCard:'Known secret',id:{no:1},area:areas[1],location:{id:{type:'hand'},public:false},
    eff:{nameCard:'Known secret'},hasState:()=>false,isType:t=>t==='secret',isCovered:()=>false};
  const master={no,watchHands:true,state:{model:{areas}}};
  return {model,master,card:new Card({model,master})};
}
test('watch shows a known hand card for players and spectators, then hides it when played as a secret', () => {
  [0,undefined].forEach(no=>{
    const f=fixture(no);
    expect(viewIn(f.card.render()).props.src).toBe(f.model.eff);
    f.model.onBoard=true;f.model.location={id:{type:'tile'},public:true};f.model.invisible={for:0};
    const rendered=f.card.render();expect(viewIn(rendered).props.src).toBe(null);
    f.card.showTooltip=jest.fn();f.card.touched=true;
    rendered.props.onClick({stopPropagation:jest.fn()});expect(f.card.showTooltip).not.toHaveBeenCalled();
  });
});
test('ordinary spectators cannot see a known private hand card', () => {
  const f=fixture(undefined);f.master.watchHands=false;
  expect(viewIn(f.card.render()).props.src).toBe(null);
});
