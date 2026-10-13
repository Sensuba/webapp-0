# Console de jeu Sensuba

Les commandes globales `read`, `help`, `searchCards`, `readCards`, `decks`,
`deckNew`, `deckOpen`, `deckView`, `deckUpdate` et `deckSave` sont disponibles sur
toutes les pages. La recherche utilise les filtres de la page Cartes, sur le
catalogue officiel uniquement, sans changer de page. `readCards` reprend les
derniers filtres et retourne le texte complet, niveaux et jetons inclus.
Chaque méthode est aussi un outil WebMCP `sensuba_<nom>` avec son schéma.

```js
await sensuba.searchCards({filters: {type: 'figure', colors: [0, 2], mana: 2, manaop: '5'}});
await sensuba.readCards({page: 1, limit: 10});
await sensuba.decks();
await sensuba.deckNew(); // ou deckOpen(id), depuis la liste ci-dessus
await sensuba.deckUpdate({hero: 3, name: 'Mon deck', cards: [{id: 775, count: 1}]});
await sensuba.deckView();
await sensuba.deckSave();
```

`deckUpdate` travaille sur l'éditeur visible, sans enregistrer. Les quantités sont
absolues (0 retire la carte), `clearCards: true` vide d'abord la liste, et
`supercode` seul importe un contenu sans changer l'identité ni le format ouvert.
L'import ignore les anciens IDs intégrés au code. Un deck incomplet peut être
enregistré. Les commandes vérifient connexion, composition et confirmation
serveur ; après une réponse incertaine, recharger avant de réessayer.
Les tests de création/édition utilisent des enregistrements simulés.

Les commandes de partie complètent `window.sensuba` à l'entrée dans une partie (salle,
entraînement ou mission) et sont retirées à sa fermeture. Les commandes globales
restent disponibles, y compris dans le lecteur de replays. `sensuba.help()`
affiche l'aide dans la console du navigateur.

```js
sensuba.view();                 // JSON affiché et copie retournée
const board = sensuba.view(false); // copie sans affichage
sensuba.follow();               // phrases lisibles pour les événements de jeu
sensuba.follow(false);
sensuba.actions();              // découvre les commandes actuellement autorisées
await sensuba.read('koito minase'); // texte d'une carte officielle
```

## Accès par les agents : WebMCP

Pendant une partie, les mêmes opérations sont enregistrées comme outils WebMCP
si le navigateur le prend en charge. Le navigateur intégré de Codex peut ainsi
les découvrir et les appeler sans exécuter du JavaScript arbitraire dans la page.
La console `sensuba.*` reste disponible pour les humains.

| Outil | Arguments JSON |
| --- | --- |
| `sensuba_view` | `{}` |
| `sensuba_help` | `{}` |
| `sensuba_read` | `{"name":"Koito Minase"}` |
| `sensuba_chat` | `{"text":"Bonjour !"}` |
| `sensuba_follow` | `{"enabled":true}` (true par défaut) |
| `sensuba_actions` | `{}` |
| `sensuba_targets` | `{"card":"hand:1","selected":[]}` |
| `sensuba_play` | `{"card":"hand:1","targets":["me:3"]}` |
| `sensuba_attack` | `{"card":"me:1","target":"opponent:7"}` |
| `sensuba_move` | `{"card":"me:1","target":"me:2"}` |
| `sensuba_faculty` | `{"card":"me:7","number":1,"target":"opponent:2"}` (target facultatif) |
| `sensuba_secret` | `{"card":"me:1","setting":"count","value":0}` |
| `sensuba_choose` | `{"number":1}` |
| `sensuba_endTurn` | `{}` |
| `sensuba_concede` | `{}` |

Les agents doivent utiliser les noms annoncés par leur navigateur, qui peut
ajouter un identifiant aux noms ci-dessus. `sensuba_actions` renvoie les noms
de méthodes console (`choose`, `play`, etc.) : appeler l'outil correspondant.
`follow` active les phrases dans les **logs console** ; il ne crée pas de flux
de messages asynchrones dans les réponses WebMCP. Lire les logs pour le suivi,
et relire `sensuba_view` avant de prendre la décision suivante.

L'adaptateur appelle exclusivement l'API console : les restrictions de visibilité,
de rôle et de choix restent les mêmes. Les réponses sont des blocs texte MCP
(texte de carte/aide, ou JSON), avec `isError: true` en cas de refus. Les outils
sont retirés à la fermeture de la partie et leurs anciennes références deviennent
inactives. Hors partie et dans les replays, ils ne sont pas enregistrés.

L'intégration utilise `document.modelContext.registerTool` et un signal
d'annulation pour le nettoyage. Elle prend aussi en charge l'ancienne API
`navigator.modelContext`/`unregisterTool`. Sans WebMCP, le jeu et la console
continuent de fonctionner sans installer de polyfill ni de dépendance.

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

### Modèle à jour et modèle d'affichage

Le client maintient deux instances indépendantes du plateau. Le modèle à jour
(`Game.store`) applique les notifications dans l'ordre de réception, sans attendre
les animations. `view`, `actions`, `targets`, `follow` et les commandes console /
WebMCP utilisent ce modèle. La validation finale des commandes souris l'utilise
également, par identifiants de cartes et de cases.

Le modèle d'affichage (`Game.displayStore`, exposé à React comme `state.model`)
rejoue les mêmes notifications au rythme du séquenceur. Les animations, la main
graphique, le plateau et l'historique visuel conservent leur chronologie. Ainsi,
une carte encore visible pendant sa disparition peut déjà être absente de `view`
et ne peut plus agir. Les objets des cartes et les données de notifications sont
séparés entre les deux modèles.

`view()` inclut les compteurs suivants, propres à la partie ouverte :

- `receivedRevision` : nombre de notifications reçues ;
- `revision` : dernière notification appliquée au modèle à jour ;
- `displayRevision` : dernière notification appliquée au modèle d'affichage ;
- `updating` : une notification est encore en cours de traitement. Dans ce cas,
  attendre puis relire la vue ; les commandes de jeu sont temporairement refusées.

Une différence entre `revision` et `displayRevision` n'empêche pas WebMCP de
jouer. Une égalité ne garantit pas que tous les effets CSS sont terminés :
certaines animations se déroulent après l'application de leur notification.
Ces compteurs ne sont pas des accusés de réception du serveur.

Les choix et paramètres de secrets, qui n'ont pas de notification de confirmation
dans le protocole actuel, sont appliqués immédiatement au modèle à jour et rejoués
au même endroit dans la file d'affichage. Un ancien choix ne peut ainsi pas être
réouvert par le retard des animations. Le suivi n'est produit que par le modèle
à jour, jamais une deuxième fois par l'affichage. Les replays conservent leur
modèle unique et ne proposent pas de commandes WebMCP.

« À jour » signifie ici la dernière notification reçue et traitée côté client :
le délai réseau et la réponse du serveur à une commande restent à prendre en compte.

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
publique. Il peut utiliser la chatbox, mais ne peut pas effectuer d'action de jeu.

`follow()` affiche uniquement les événements suivants : pioche, déplacement entre
cases du terrain, carte jouée, invocation, entité détruite, secret déclenché,
action, compétence, attaque, début/fin de tour, carte brûlée/détruite du deck,
malédiction du deck, victoire/défaite (ou égalité), messages de chatbox. Les changements de mana,
statistiques, états et d'interface ne génèrent pas de messages supplémentaires.

```text
Votre tour commence.
Vous piochez Koito Minase.
Koito Minase (case 3 de votre camp) attaque Héros (case 9 du camp adverse).
L’adversaire joue un secret en case 2 du camp adverse.
Il reste 60 secondes pour jouer.
Chat — Adversaire : Bien joué !
```

Les messages incluent les cibles transmises par les notifications, même si la
case cible est vide. Pour les secrets déclenchés, le protocole actuel fournit
le texte de l'effet mais ne transmet pas de cible : le suivi affiche cet effet
sans en inventer une. Une identité cachée n'est jamais reprise du cache pour une
pioche ou un secret joué. La révélation publique d'un secret déclenché ou d'une
carte brûlée permet de nommer cette carte à ce moment-là.

Le message est figé avant que le modèle à jour ne déplace/détruise la carte, puis affiché
après le traitement de la notification, sans attendre les animations. Un déplacement produit une seule phrase,
même si le serveur envoie aussi `charmove`. Une carte jouée et son invocation sont
deux événements distincts de la liste demandée.

Dans les parties chronométrées, des avertissements sont émis à **60 et 30 secondes**
restantes de votre propre tour, une fois par seuil et par tour (y compris bonus).
Ils utilisent le même compte à rebours que l'interface graphique. Si une
resynchronisation saute un seuil, le message indique le temps réellement restant.
Activer le suivi après un seuil ne rejoue pas l'avertissement passé. Les tours
adverses, les spectateurs et les parties sans chronomètre n'ont pas ces alertes.
`follow(false)` arrête le suivi. La sortie de partie désactive aussi les anciennes
références à l'interface.

## Chatbox

`sensuba.chat('Bonjour !')` envoie un message dans la salle, comme le champ de
la chatbox. En WebMCP : `sensuba_chat({"text":"Bonjour !"})`. Le message doit
être non vide et limité à 120 caractères. La salle doit être rejointe et connectée.
La chatbox est disponible aux joueurs et spectateurs, hors de leur tour et pendant
un choix. Les commandes `/…` existantes sont traitées par le serveur comme dans
l'interface graphique. Les missions et entraînements n'ont pas de chatbox.

Le retour `{ok:true,sent:true}` confirme seulement l'envoi. Avec `follow()` activé,
le message est affiché à sa réception du serveur, avec son auteur, une seule fois
(y compris vos propres messages et les réponses système). Aucun historique n'est
rejoué lors de l'activation du suivi.

## Lire une carte officielle

`await sensuba.read(nom)` recherche le nom exact sans distinction de casse, en
ignorant les espaces au début et à la fin, uniquement parmi les cartes dont
`author` vaut `0` (nombre ou chaîne). Le catalogue chargé par le jeu est utilisé,
jamais les identités cachées du plateau. Le résultat est affiché et retourné
sous forme de texte ; en cas d'échec, `{ok: false, error}` est retourné.

```text
Koito Minase
Figure rouge, 1 mana
200/500/1
! : Fait reculer un personnage adverse.
```

L'extension, l'anime, le texte d'ambiance et les illustrations sont omis. Les
statistiques, effets, types, couleurs, surcharge, niveaux de héros et règles de
mecha sont conservés. Les héros affichent leurs PV puis les sections `Nv 1`,
`Nv 2` et `Nv MAX`, avec attaque, portée et effets à chaque niveau. Les jetons
sont détaillés après la carte, y compris leurs propres jetons et les variantes
de même nom aux effets différents. Les rééditions aux règles identiques ne sont affichées
qu'une fois ; plusieurs versions officielles distinctes sont séparées par une
ligne vide. Le nom partiel n'est pas utilisé pour choisir arbitrairement une carte.

## Contrôle et validation

La souris et la console passent par le même validateur avant l'émission Socket.IO :
joueur connecté, partie active, propriété de la carte, tour, mana, points d'action,
cibles, paramètres de secrets et règles du modèle (dont rush/fury).
Une boîte de choix ouverte bloque toutes les autres actions de jeu, y compris fin
du tour et abandon. Les lectures `view`, `follow`, `read`, `help`, `actions` et la chatbox restent permises.
Le bouton graphique de fin du tour est également verrouillé.

Ce changement porte sur le client. Il ne modifie pas la validation du serveur
pour des clients qui fabriqueraient leurs propres messages Socket.IO.

## Vérification locale

```powershell
$env:CI='true'
npm test -- --runInBand 'GameConsole|GameIntegration|FollowRead|WebMCP'
$env:NODE_OPTIONS='--openssl-legacy-provider'
npm run build
```

Les tests utilisent les règles des classes du modèle et le véritable chemin
`Game.analyse` → `compute` → Redux → suivi, avec les dépendances graphiques et
réseau remplacées par des doublures. Aucune partie de production n'est créée.
