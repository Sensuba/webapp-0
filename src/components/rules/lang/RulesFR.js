import React, { Component } from 'react';

export default class RulesFR extends Component {

  render() {
    return (
      <div>
        <div className="rule-part">Apercu du jeu</div>
        <div className="rule-extender">
          <div className="rule-title">Vaincre son adversaire</div>
          <div className="explanation">
            <p>A Sensuba, chaque joueur commence la partie avec un héros en jeu. Lorsque ses PV atteignent 0, vous avez gagné. Réciproquement, si les PV de votre propre héros tombent à 0, vous perdez la partie.</p>
            <p>Le moyen le plus courant de faire perdre des PV à votre adversaire est d'utiliser des personnages. Ils restent sur le terrain et peuvent attaquer à chaque tour. Ce sont des éléments essentiels à votre stratégie.</p>
            <p>Votre héros aussi est un personnage. Comme les autres, il peut participer à la bataille. Cela peut vous aider à prendre l'avantage sur le terrain, mais trop en user risque de le blesser plus qu'il ne faut. N'oubliez pas de le ménager ou c'est vous qui finirez mal.</p>
          </div>
          <img className="img-exp" src="/rules/vaincre-son-adversaire.png" alt="img"/>
        </div>
        <div className="rule-extender">
          <div className="rule-title">Gérer son mana</div>
          <img className="img-exp" src="/rules/gerer-son-mana.png" alt="img"/>
          <div className="explanation">
            <p>Afin de jouer des cartes et activer des capacités, vous aurez besoin de mana. C'est la monnaie commune à toutes les cartes du jeu. Sans mana, vous ne pouvez rien faire.</p>
            <p>Utilisez votre héros pour créer des réceptacles de mana qui pourront générer cette précieuse ressource. Ils se rempliront à chaque tour, vous permettant d'invoquer des personnages de plus en plus puissants.</p>
          </div>
        </div>
        <div className="rule-extender">
          <div className="rule-title">Des effets à la pelle</div>
          <div className="explanation">
            <p>Les personnages ne sont pas uniquement présents pour combattre purement ceux de votre adversaire. La majorité d'entre eux possèdent des effets spécifiques. Certains sont capables de voler, de se camoufler, d'attaquer plusieurs fois ou de vous procurez des avantages uniques. Utilisez vos personnages à bon escient afin d'établir une stratégie solide !</p>
            <p>Les personnages ne sont pas les seuls à procurer des effets spéciaux. Des cartes spécifiques y sont dédiés ; jouez des sorts au bon moment pour renverser la vapeur et prendre l'avantage. Leurs effets sont instantanés, mais puissants. Prenez-y garde !</p>
          </div>
          <img className="img-exp" src="/rules/des-effets-a-la-pelle.png" alt="img"/>
        </div>
        <div className="rule-part">Deroulement de la partie</div>
        <div className="rule-extender">
          <div className="rule-title">Démarrer la partie</div>
          <img className="img-exp" src="/rules/demarrer-la-partie.png" alt="img"/>
          <div className="explanation">
            <p>Au début de la partie, chaque joueur dispose son héros sur la case centrale de la ligne arrière, c'est son emplacement de départ (cf. <i>Mouvement et portée</i>). A partir de ce moment, la partie a commencé ; le premier à éliminer le héros adverse remporte la victoire.</p>
            <p>Le premier joueur est ensuite choisi aléatoirement. Il pioche alors 4 cartes pour se constituer une main de départ. Jouer en premier est un avantage, et en conséquence, le second joueur pioche 5 cartes et obtient une gemme gratuite (cf. <i>Mana et gemmes</i>).</p>
            <p>Une fois la mise en place effectuée, les tours peuvent commencer à s'enchaîner, en commençant évidemment par le premier joueur.</p>
          </div>
          <div className="rule-title">Mettre son jeu en place</div>
          <div className="explanation">
            <p>Le tour d'un joueur commence toujours par la pioche d'une carte. Une nouvelle carte permet d'affiner son jeu durant la partie, et d'offrir de nouvelles options au joueur. Prenez cependant garde : si votre deck est vide, piocher une carte vous conduira à une défaite imminente ! De plus, vous ne pouvez pas avoir plus de 10 cartes en main, les cartes piochées supplémentaires seront perdues.</p>
            <p>Durant un tour de jeu, vous pouvez effectuez de nombreuses actions. Vous pouvez utiliser votre mana pour jouer des cartes qui influenceront directement le jeu, déplacer vos personnages sur des cases adjacentes, attaquer avec, ou encore déclencher leurs effets, de manière à mettre en place votre stratégie, en enrayant celle de l'adversaire.</p>
          </div>
          <img className="img-exp" src="/rules/mettre-son-jeu-en-place.png" alt="img"/>
          <div className="rule-title">Une partie évolutive</div>
          <img className="img-exp" src="/rules/une-partie-evolutive.png" alt="img"/>
          <div className="explanation">
            <p>Une fois par tour, votre héros peut créer un réceptacle de mana qui se remplira à chaque tour. Vous aurez ainsi accès à de plus en plus de mana au fil de la partie, et serez ainsi aptes à jouer plus de cartes et des plus puissantes.</p>
            <p>Certains jeux utilisent cette évolution à leur avantage, et contrôlent le terrain en début de partie pour jouer leurs cartes les plus puissantes une fois qu'ils ont engrangé suffisamment de mana. D'autres jeux préfèrent ne pas laisser cette possibilité à l'adversaire et gagner avant ; l'adversaire n'ayant souvent que peu de ressources en début de partie, il peuvent enchaîner les cartes peu coûteuses pour envahir le terrain et vaincre l'adversaire avant qu'il n'ait le temps de se préparer.</p>
          </div>
        </div>
        <div className="rule-part">Mana et gemmes</div>
        <div className="rule-extender">
          <div className="rule-title">Utiliser son mana</div>
          <div className="explanation">
            <p>Chaque carte possède un coût en mana pour être jouée. Pour la jouer, vous dever vider autant de réceptacles de mana que le coût indiqué. Si vous n'en avez pas suffisamment, vous ne pouvez pas jouer cette carte.</p>
            <p>Au début de votre tour, tous vos réceptacles de mana se remplissent. N'hésitez donc pas à utiliser votre mana durant votre tour : il sera réinitialisé pour le tour suivant.</p>
            <p>Jouer une carte n'est pas la seule action nécessitant du mana. Certaines compétences des personnages doivent être payées pour être activées. Pensez à calculer le mana que vous pourrez utiliser dans les tours à venir afin d'organiser votre jeu à l'avance.</p>
          </div>
          <img className="img-exp" src="/rules/utiliser-son-mana.png" alt="img"/>
          <div className="rule-title">Récolter du mana</div>
          <img className="img-exp" src="/rules/recolter-du-mana.png" alt="img"/>
          <div className="explanation">
            <p>Votre principale source de mana provient de vos réceptacles. Si certaines cartes sont capables d'en créer, vous utiliserez principalement votre héros à cette fin. Une action de base de chaque héros est de créer un réceptacle de mana (cf. <i>Activer des effets</i>). En clair, vous pouvez décider de créer un réceptacle de mana à la place d'attaquer avec votre héros.</p>
            <p>Il est important de savoir choisir les actions de son héros. Si, en début de partie, il est nécessaire de générer du mana, sans quoi vous ne pourrez pas jouer de cartes, il faudra décider par la suite si vous préférez continuer à améliorer sa réserve ou vous concentrer sur d'autres points, comme l'offensive. Jetez un oeil aux options de jeu que vous aurez lors des prochains tours avec ou sans gain de mana pour effectuer vos décisions.</p>
          </div>
          <div className="rule-title">Utiliser des gemmes</div>
          <div className="explanation">
            <p>Si les réceptacles constituent la principale source de mana du jeu, ce n'est pas la seule. Les gemmes sont des objets pouvant être consumés pour générer un point de mana si tous vos réceptacles sont vides. Elles permettent de pallier un manque de mana particulier, mais ne peuvent être utilisées qu'une fois, après quoi elles disparaissent.</p>
            <p>Les héros ne peuvent pas créer de gemme. Celles-ci s'obtiennent grâce à des effets appropriés. Certains jeux peuvent également se passer de gemmes sans souci.</p>
            <p>Une gemme est également offerte au second joueur en début de partie. Afin de combler le retard avec lequel il part, il peut utiliser une gemme pour obtenir l'avantage durant un tour de son choix.</p>
          </div>
          <img className="img-exp" src="/rules/utiliser-des-gemmes.png" alt="img"/>
        </div>
        <div className="rule-part">Les personnages</div>
        <div className="rule-extender">
          <div className="rule-title">Héros et figures</div>
          <img className="img-exp" src="/rules/heros-et-figures.png" alt="img"/>
          <div className="explanation">
            <p>Que ce soit votre héros, qui organise votre jeu, ou les figures que vous jouez depuis votre main, les personnages sont les cartes-clef du jeu. Ce sont eux qui ont le plus d'influence sur le terrain, en pouvant combattre les adversaires et défendre leurs alliés.</p>
            <p>Que se soit pour se déplacer, combattre ou défendre, les personnages possèdent de nombreuses règles qui leurs sont propres, et chacun possède des caractéristiques et effets spécifiant ses points forts et faibles.</p>
            <p>Apprenez à gérer les interactions entre les personnages et vous aurez déjà la moitié de la victoire.</p>
          </div>
          <div className="rule-title">Des statistiques importantes</div>
          <div className="explanation">
            <p>Outre le coût en mana, un personnage possède plusieurs autres statistiques qui lui sont propres.</p>
            <p>L'ATK indique la force du personnage et le nombre de dégâts qu'il infligera à chaque coup. Les PV sont le nombre de dégâts que le personnage est capable de prendre avant d'être détruit. Un bon équilibre entre ces deux statistiques permet d'avoir un personnage équilibré et polyvalent.</p>
            <p>La portée est un nombre correspondant à la capacité d'un personnage à atteindre des cibles difficiles, qu'elles volent, soient protégées ou tenues à distance. Il est toujours intéressant de garder quelques personnages capables d'attaquer à distance.</p>
          </div>
          <img className="img-exp" src="/rules/des-statistiques-importantes.png" alt="img"/>
          <div className="rule-title">La vraie force du personnage</div>
          <img className="img-exp" src="/rules/la-vraie-force-du-personnage.png" alt="img"/>
          <div className="explanation">
            <p>Les personnages peuvent combattre, mais tous ne sont pas des combattants, et même les combattants gardent quelque chose dans leur manche. Si les statistiques sont l'élément le plus simple pour juger de l'efficacité d'une carte, un point tout aussi important est son effet. Un bon effet de personnage peut renverser la partie rien qu'en venant sur le terrain.</p>
            <p>Des personnages faibles mais impactants par leur effet peuvent être protégés par des personnages plus solides, tandis que d'autres peuvent améliorer leur propre puissance au combat. La clef est de trouver les effets qui synergisent le mieux et de les faire travailler de concert.</p>
          </div>
        </div>
        <div className="rule-part">Mouvement et portée</div>
        <div className="rule-extender">
          <div className="rule-title">Le placement est la clef</div>
          <div className="explanation">
            <p>Le terrain est constitué de 2 lignes de combat : une ligne de front de 4 cases, et une ligne de retrait de 5 cases. Chaque case au front se situe directement devant 2 cases en retrait. Chaque case pourra accueillir un personnage. Bien placer ses personnages sur le terrain est nécessaire pour pouvoir l'emporter.</p>
            <p>Une fois par tour, s'il n'a pas attaqué ou été invoqué durant ce tour, un personnage peut se déplacer sur une case libre adjacente, pouvant changer de ligne ou simplement se décaler. Réorganiser ses personnages permet de les envoyer combattre ou de défendre les plus vulnérables.</p>
          </div>
          <img className="img-exp" src="/rules/le-placement-est-la-clef.png" alt="img"/>
          <div className="rule-title">Défendre ses alliés</div>
          <img className="img-exp" src="/rules/defendre-ses-allies.png" alt="img"/>
          <div className="explanation">
            <p>Si un personnage est situé juste derrière un allié, il est défendu. Un personnage au front peut donc normalement défendre jusqu'à 2 personnages en retrait.</p>
            <p>Il est important de défendre ses alliés les plus vulnérables afin qu'ils soient plus durs à cibler. Défendre son héros est également une stratégie fréquemment utilisée afin de protéger au mieux ses PV.</p>
            <p>Deux personnages ne peuvent pas se défendre mutuellement. Si c'est le cas, aucun ne défend l'autre. Les personnages volants peuvent également passer à travers les défenses au sol, mais c'est réciproque.</p>
          </div>
          <div className="rule-title">Atteindre son adversaire</div>
          <div className="explanation">
            <p>Lorsqu'un personnage attaque, il doit cibler un adversaire à portée. Le placement et la défense influent beaucoup sur l'assignation des cibles, il est donc de rigueur de bien placer ses personnages pour influer au mieux l'assaut adverse.</p>
            <p>Il faut 1 point de portée pour attaquer un adversaire. A cela, il faut 1 point de portée supplémentaire si la cible est défendue, si l'on attaque depuis la ligne de retrait, où si l'on attaque un personnage volant depuis le sol. Plus un personnage a de portée, moins il a de contraintes.</p>
            <p>Souvenez-vous que la plupart des personnages n'ont qu'un point de portée, et ne peuvent donc pas attaquer sous la moindre de ces contraintes.</p>
          </div>
          <img className="img-exp" src="/rules/atteindre-son-adversaire.png" alt="img"/>
        </div>
        <div className="rule-part">Combattre son adversaire</div>
        <div className="rule-extender">
          <div className="rule-title">Lancer une attaque</div>
          <img className="img-exp" src="/rules/lancer-une-attaque.png" alt="img"/>
          <div className="explanation">
            <p>Une fois par tour, s'il n'a pas été invoqué durant ce tour, un personnage peut attaquer un personnage adverse à portée (cf. <i>Mouvement et portée)</i>, ce qui lui coûte un point d'action. Les personnages avec plusieurs points d'action peuvent attaquer plusieurs fois par tour (cf. <i>Activer des effets</i>).</p>
            <p>Un personnage qui attaque perd ses points de mouvement, et ne peut plus se déplacer après coup. On ne peut pas attaquer puis se mettre à couvert dans le même tour.</p>
          </div>
          <div className="rule-title">Résoudre les dégâts</div>
          <div className="explanation">
            <p>Lorsqu'un personnage en attaque un autre, les deux entrent au contact. Dans cette phase, chaque personnage reçoit les dégâts correspondant à l'attaque de l'autre. Si l'un des personnages n'a plus de PV, il est détruit. Seuls les personnages avec Initiative peuvent attaquer sans craindre de contrecoup.</p>
            <p>Soyez prudent lorsque vous attaquez un personnage puissant. Vous pourrez y laisser plusieurs des vôtres pour le mettre à terre. Privilégiez les échanges où vous êtes gagnant, comme si vous échangez un personnage faible contre un personnage fort, ou lorsque le vôtre subsite et l'autre non après l'échange.</p>
            <p>Certains personnages peuvent avoir de l'armure. Cette statistique rare offre un avantage non négligeable : les points d'armure sont ôtés aux dégâts reçus lors de dégâts de contact.</p>
          </div>
          <img className="img-exp" src="/rules/resoudre-les-degats.png" alt="img"/>
          <div className="rule-title">Attaquer un héros</div>
          <img className="img-exp" src="/rules/attaquer-un-heros.png" alt="img"/>
          <div className="explanation">
            <p>Mais assez de combattre les figures. Nous sommes là pour gagner. Attaquons le héros !</p>
            <p>Lorsque vous attaquez un héros, votre personnage ne reçoit pas de contrecoup. L'ATK du héros n'entre en compte que lorsqu'il est à l'initiative de l'attaque. Vous pouvez donc détruire les points de vie ennemis sans perdre un seul personnage, c'est pour cela que l'avantage du terrain est important.</p>
            <p>Il vous sera souvent nécessaire de choisir si vous devez attaquer le héros adverse ou une figure. Attaquer le héros permet de vous rapprocher de la victoire et mettre la pression, tandis que faire des échanges enlève des options à votre adversaire. Réfléchissez bien !</p>
          </div>
        </div>
        <div className="rule-part">Activer des effets</div>
        <div className="rule-extender">
          <div className="rule-title">Points d'action, mouvement et compétence</div>
          <div className="explanation">
            <p>Chaque personnage a de nombreuses possibilités d'action. A chaque tour, les personnages ont un point d'action, un point de mouvement et un point de compétence qu'ils peuvent utiliser pour impacter le jeu.</p>
            <p>Les points de mouvement sont utilisés lorsque le personnage se déplace. Les points de compétence sont utilisés lorsque le personnage utilise une compétence et les points d'action lorsque le personnage utilise une action, mais utiliser une action consumme tous vos points de mouvement restants. Vous ne pouvez donc pas vous déplacer après avoir utilisé une action.</p>
            <p>Lorsqu'un personnage est invoqué, il reçoit simplement un point de compétence. Vous ne pouvez donc pas déplacer votre personnage ou utiliser d'action lorsqu'il est invoqué.</p>
          </div>
          <img className="img-exp" src="/rules/points-action-mouvement-competence.png" alt="img"/>
          <div className="rule-title">Différents types d'effets</div>
          <img className="img-exp" src="/rules/differents-types-effets.png" alt="img"/>
          <div className="explanation">
            <p>Si un personnage peut avoir des effets passifs qui s'effectuent de manière permanente, il peut aussi avoir des actions et des compétences spécifiques, qui sont des effets actifs devant être déclenchés par le joueur.</p>
            <p>En plus des actions inscrites sur la carte, un personnage possède toujours une action de base : l'attaque. Un personnage ne peut donc pas attaquer s'il a déjà effectué une action durant son tour, n'ayant plus de point d'action.</p>
            <p>Les héros possèdent quand à eux une autre action de base, celle de gagner un réceptacle de mana. Ils possèdent donc une panoplie d'actions utilisables à chaque tour, et il est important de bien choisir celle que vous allez utiliser pour avancer vers la victoire.</p>
          </div>
          <div className="rule-title">Déclencher une compétence</div>
          <div className="explanation">
            <p>Les compétences sont des capacités supplémentaires que possèdent certains personnages. Elles permettent d'activer des effets sans utiliser d'action, et offrent une option supplémentaire au joueur.</p>
            <p>Si certaines sont gratuites, certaines compétences nécessitent, au même titre que les cartes, de payer un coût en mana pour être activées. Le paiement en mana fonctionne de la même manière que pour les cartes.</p>
            <p>Un avantage non négligeable offert par les compétences est de pouvoir être activées au tour où la figure est invoquée. Cela peut permettre de profiter d'un effet de surprise.</p>
          </div>
          <img className="img-exp" src="/rules/declencher-une-competence.png" alt="img"/>
        </div>
        <div className="rule-part">Artefacts</div>
        <div className="rule-extender">
          <div className="rule-title">Des objets puissants</div>
          <img className="img-exp" src="/rules/des-objets-puissants.png" alt="img"/>
          <div className="explanation">
            <p>Les artefacts sont une catégorie de cartes particulière à laquelle sont rattachés des objets avec un pouvoir spécifique. Les artefacts sont invoqués sur le terrain comme les personnages en payant leur coût en mana.</p>
            <p>Contrairement à un personnage, un artefact ne peut ni attaquer, ni se déplacer, ni défendre. Ils ne possèdent d'ailleurs pas de point d'action ou de mouvement. Ils peuvent cependant se faire attaquer et détruire.</p>
            <p>Malgré ces défauts, un artefact est souvent très intéressant. L'effet qu'il procure a souvent un fort impact sur la partie, et peut se révéler décisif s'il n'est pas géré par l'adversaire.</p>
          </div>
          <div className="rule-title">Utiliser un artefact</div>
          <div className="explanation">
            <p>Lorsque vous jouez un artefact, il est invoqué avec une durabilité indiquée. Lorsqu'il n'a plus de durabilité, il est détruit.</p>
            <p>Comme les personnages, les artefacts possèdent des points de compétence. Vous pouvez donc utiliser une fois par tour une compétence de votre artefact. Cependant, les compétences d'un artefact ne coûtent pas du mana, mais de la durabilité. L'artefact perd ou gagne la durabilité indiquée par la compétence. Vous ne pouvez pas déclencher la compétence si l'artefact ne possède pas suffisemment de durabilité, mais vous pouvez gagner plus de durabilité qu'initialement.</p>
            <p>Une compétence de base des artefacts est de se briser ; vous pouvez détruire votre artefact à la place d'utiliser son effet. C'est particulièrement utile lorsque votre artefact n'a plus assez de durabilité pour pouvoir déclencher une compétence, afin de libérer la case.</p>
          </div>
          <img className="img-exp" src="/rules/utiliser-un-artefact.png" alt="img"/>
          <div className="rule-title">Gérer la durabilité</div>
          <img className="img-exp" src="/rules/gerer-la-durabilite.png" alt="img"/>
          <div className="explanation">
            <p>De la même manière que les personnages ont de la vie, les artefacts subsistent grâce à leur durabilité. Lorsqu'il n'en ont plus, ils sont détruits. Ils se fragilisent donc peu à peu en utilisant leurs capacités.</p>
            <p>Un artefact peut recevoir des dégâts et se faire attaquer par un personnage. L'artefact ne peut riposter, et perd un point de durabilité par dégât reçu. Protégez vos artefacts le temps de les utiliser à leur plein potentiel !</p>
          </div>
        </div>
        <div className="rule-part">Forger son deck</div>
        <div className="rule-extender">
          <div className="rule-title">Bien choisir son héros</div>
          <div className="explanation">
            <p>La première chose à faire lorsque l'on crée un deck est de choisir son héros. Il s'agit du point-clef de notre deck. Il sera présent toute la partie et influencera chacun de vos tours. Toute votre stratégie doit être axée autour de lui.</p>
            <p>Certains héros ont une forte attaque et peuvent rapidement faire mal, tandis que d'autres possèdent de nombreuses actions et des capacités de soutien leur permettant de vous préparer rapidement. Choisissez le héros qui convient le mieux à votre stratégie.</p>
          </div>
          <img className="img-exp" src="/rules/bien-choisir-son-heros.png" alt="img"/>
          <div className="rule-title">Utiliser les bonnes cartes</div>
          <img className="img-exp" src="/rules/utiliser-les-bonnes-cartes.png" alt="img"/>
          <div className="explanation">
            <p>Outre votre héros, vous devez placer 30 cartes dans votre deck. Pas plus, pas moins. La place est précieuse, et chaque pioche doit être intéressante. De plus, chaque carte ne peut être présente qu'en un maximum de 2 exemplaires dans votre deck, ce qui fait au minimum 15 cartes différentes.</p>
            <p>Une contrainte imposée est de respecter la couleur de son héros. On ne peut pas mettre n'importe quelle carte dans son deck. On ne peut y mettre que des cartes neutres et des cartes d'une des couleurs de son héros. Les autres cartes ne peuvent entrer dans notre deck. Chaque héros possédant 2 couleurs, cela fait de nombreuses possibilités de combinaison.</p>
          </div>
          <div className="rule-title">Mettre en place des synergies</div>
          <div className="explanation">
            <p>Gardez toujours en tête l'idée de base de votre deck lorsque vous choisissez vos cartes. Imaginez les cartes agir ensemble : de quoi auriez-vous besoin ?</p>
            <p>Surveillez vos faiblesses. Si vous jouez agressivement, prenez garde aux capacités de contrôle et sachez rebondir. Si vous avez des cartes chères, sachez répondre aux adversaires agressifs. Faites également attention à ne jamais tomber à court de cartes, s'essoufler amène rapidement à la défaite.</p>
            <p>Assurez-vous d'avoir toujours une condition de victoire dans votre deck. Cela ne sert à rien de piocher tout son deck si l'on ne peut pas faire de dégâts. Souvenez-vous : pour gagner, il faut détruire le héros adverse.</p>
          </div>
          <img className="img-exp" src="/rules/mettre-en-place-des-synergies.png" alt="img"/>
        </div>
      </div>
    );
  }
}