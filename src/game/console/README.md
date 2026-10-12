# Console de jeu Sensuba

L'interface `window.sensuba` est installée à l'entrée dans une partie (salle,
entraînement ou mission) et retirée à sa fermeture. Elle ne concerne pas le
lecteur de replays. `sensuba.help()` affiche l'aide dans la console du navigateur.

```js
sensuba.view();                 // JSON affiché et copie retournée
const board = sensuba.view(false); // copie sans affichage
sensuba.follow();               // instantané puis différences JSON
sensuba.follow(false);
sensuba.actions();              // découvre les commandes actuellement autorisées
```

## Références et numérotation

- `me:1` à `me:9` : cases du joueur ; `opponent:1` à `opponent:9` : adversaire.
- Dans chaque camp : avant = **1 2 3 4**, arrière = **5 6 7 8 9**,
  de gauche à droite à l'écran. La numérotation ne change pas pour le joueur 2.
- `hand:1` est la première carte de sa main actuelle.
- `card:N` est la référence d'une carte visible donnée par `view()`.
- Les facultés et choix sont indexés à partir de **1**.
- Les références de cases suivent leur occupant actuel ; relire la vue après une action.

## Actions

```js
sensuba.play('hand:1');                          // sans cible
sensuba.targets('hand:2');                      // {complete, next}
sensuba.targets('hand:2', ['me:3']);             // prochaine cible après placement
sensuba.play('hand:2', ['me:3', 'opponent:1']);   // toutes les cibles dans l'ordre
sensuba.attack('me:1', 'opponent:7');
sensuba.move('me:1', 'me:2');
sensuba.faculty('me:7', 1);                      // sans cible
sensuba.faculty('me:7', 2, 'opponent:2');         // avec cible
sensuba.secret('me:1', 'effect', 2);             // deuxième effet
sensuba.secret('me:1', 'count', 0);              // compteur : 0 à 5
sensuba.secret('me:1', 'destroy');
sensuba.choose(1);
sensuba.endTurn();
sensuba.concede();                              // abandon immédiat
```

`actions()` renvoie `{method, args}` pour les commandes complètes. Pour `play`,
il renvoie `{method: 'play', card, targets: {complete, next}, hint}` : appeler
`targets(card, selection)` en ajoutant les cibles dans l'ordre, jusqu'à ce que
`complete` soit vrai, puis `play(card, selection)`. Cela évite d'énumérer un
nombre exponentiel de combinaisons pour les cartes à plusieurs cibles.
`faculty()` permet aussi de sélectionner les options d'un secret, comme le menu
graphique ; la dernière est sa destruction.

Les résultats d'action sont `{ok: true, sent: true}` ou `{ok: false, error}`.
`sent` signifie que la commande a été émise, **pas** qu'elle a été acceptée par
le serveur. Le protocole actuel ne fournit pas d'accusé de réception de commande.
Attendre la mise à jour de la vue avant de décider d'une nouvelle action ; une
commande peut devenir invalide entre l'observation et son traitement serveur.
Les réglages de secrets et la fermeture d'un choix sont appliqués localement à
l'envoi, conformément au protocole du client existant.

## Informations visibles et suivi

La vue est une projection par liste de champs autorisés, indépendante du modèle.
Elle expose les statistiques effectives, états, facultés, marques, progression
des épreuves, terrains, mana, défausse/cimetière publics et cartes visibles.
Les decks sont limités à leur taille et fatigue. La main adverse est limitée à
sa taille. Les secrets adverses et les autres cartes masquées n'ont ni identité,
ni référence, ni statistiques. Les options d'un choix adverse sont absentes.
Ces restrictions restent appliquées même si des identités sont encore en mémoire
ou si un accès supplémentaire a été accordé au spectateur. Les zones internes
`capsule` et `nether`, notifications brutes, variables arbitraires et blueprints
ne sont jamais sérialisés.

Le spectateur obtient les camps `player1` et `player2`, uniquement en lecture
publique. Il ne peut pas émettre de commande via cette interface.

`follow()` affiche un instantané initial puis chaque différence de la projection
après traitement d'une notification ou changement local. Les logs sont des
chaînes JSON figées, pas des objets évalués plus tard par les outils développeur :

```json
{"type":"change","sequence":1,"changes":[{"path":"players.opponent.board.9.card.chp","before":500,"after":400}]}
```

Les indices des tableaux dans les chemins commencent à **1**. Les changements
invisibles ne produisent aucun message ; une pioche adverse apparaît comme un
changement de taille de main/deck. `follow(false)` arrête le suivi. La sortie de
partie désactive aussi les anciennes références à l'interface.

## Contrôle et validation

La souris et la console passent par le même validateur avant l'émission Socket.IO :
joueur connecté, partie active, propriété de la carte, tour, mana, points d'action,
cibles, paramètres de secrets et règles du modèle (dont rush/fury).
Une boîte de choix ouverte bloque toutes les autres commandes, y compris fin
du tour et abandon. Les lectures `view`, `follow`, `help`, `actions` restent permises.
Le bouton graphique de fin du tour est également verrouillé.

Ce changement porte sur le client. Il ne modifie pas la validation du serveur
pour des clients qui fabriqueraient leurs propres messages Socket.IO.

## Vérification locale

```powershell
$env:CI='true'
npm test -- --runInBand 'GameConsole|GameIntegration'
$env:NODE_OPTIONS='--openssl-legacy-provider'
npm run build
```

Les tests utilisent les règles des classes du modèle et le véritable chemin
`Game.analyse` → `compute` → Redux → suivi, avec les dépendances graphiques et
réseau remplacées par des doublures. Aucune partie de production n'est créée.
