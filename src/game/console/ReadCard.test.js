import {formatCard, readOfficial} from './ReadCard';

const spirit = {nameCard:'Esprit des Moissons',cardType:'figure',idColor:4,mana:1,atk:300,hp:300,range:1};
const holo = {author:0,nameCard:'Holo, Déesse des Moissons',cardType:'hero',idColor:2,idColor2:4,hp:6000,atk:600,range:1,
  description:'1 : Niveau Supérieur.',
  lv2:{atk:600,range:1,description:'1 : Vous donne un esprit 300/300.\n1 : Donne +200/+200 à un personnage allié durant ce tour.\n5 : Niveau Supérieur.'},
  lvmax:{atk:600,range:1,description:'Vos personnages ont +200/+200.\n1 : Vous donne un esprit 300/300 avec Don du Vol.\n2 : Piochez une carte.'},
  tokens:[spirit,Object.assign({},spirit,{description:'Don du Vol.'})]};

test('Holo includes health, all three levels and both distinct spirit tokens', () => {
  expect(readOfficial([holo], 'HOLO, DÉESSE DES MOISSONS')).toBe([
    'Holo, Déesse des Moissons','Héros rouge et vert','6000 PV','',
    'Nv 1','600/1','1 : Niveau Supérieur.','',
    'Nv 2','600/1',holo.lv2.description,'',
    'Nv MAX','600/1',holo.lvmax.description,'',
    'Esprit des Moissons (jeton)','Figure verte, 1 mana','300/300/1','',
    'Esprit des Moissons (jeton)','Figure verte, 1 mana','300/300/1','Don du Vol.'
  ].join('\n'));
});

test('nested tokens and level-specific tokens are included without leaking metadata or inheriting level-one effects', () => {
  const hero = Object.assign({},holo,{anime:'OMIT',flavourText:'OMIT',lv2:{atk:800,range:2,tokens:[{nameCard:'Nested',cardType:'spell',description:'Piochez.',tokens:[spirit]}]},tokens:[]});
  const text = formatCard(hero);
  expect(text).toContain('Nv 2\n800/2\n\nNv MAX');
  expect(text).toContain('Nested (jeton)\nSort\nPiochez.');
  expect(text).toContain('Esprit des Moissons (jeton)');
  expect(text).not.toContain('OMIT');
});

test('tokens and activated mecha rules participate in official reprint deduplication', () => {
  const alt = Object.assign({},holo,{tokens:[Object.assign({},spirit,{description:'Autre effet.'})]});
  const text = readOfficial([holo,alt],holo.nameCard);
  expect(text.split('Holo, Déesse des Moissons')).toHaveLength(3);
  const mech = {nameCard:'Robot',cardType:'artifact',mecha:true,hp:800,atk:100,range:1,description:'Inactif.',mechactive:{atk:900,description:'Actif.',tokens:[spirit]}};
  expect(formatCard(mech)).toContain('Mecha activé :\n900/800/1\nActif.');
  expect(formatCard(mech)).toContain('Esprit des Moissons (jeton)');
});
