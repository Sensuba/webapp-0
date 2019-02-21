import React, { Component } from 'react';
import Glossary from './GlossaryEN';

export default class RulesEN extends Component {

  render() {
    return (
      <div>
        <div className="rule-part">Overview</div>
        <div className="rule-extender">
          <div className="rule-title">Overcoming the opponent</div>
          <div className="explanation">
            <p>At Sensuba, both players starts the game with a hero on the field. Whenever the opponent's hero's HP reach 0, you win. Conversely, whenever your own hero's HP reach 0, you lose the game.</p>
            <p>The most common way to shorten your opponent's HP is by using characters. They stick on the field and may attack every turn. They are key elements in strategy.</p>
            <p>Your hero is also a character. They can take part to the battle like any other. This may help you taking advantage on board, but using too much of this strategy may hurt your hero more than needed. Get easy on your hero or you'll be the one to bite the dust.</p>
          </div>
          <img className="img-exp" src="/rules/vaincre-son-adversaire.png" alt="img"/>
        </div>
        <div className="rule-extender">
          <div className="rule-title">Managing mana</div>
          <img className="img-exp" src="/rules/gerer-son-mana.png" alt="img"/>
          <div className="explanation">
            <p>In order to play cards and trigger abilities, you will need some mana. This is the currency shared by every card in the game. Without mana, you can not do much.</p>
            <p>Your hero is able to create mana receptacles genearating this valued resource. They fill up each turn, allowing you to summon more and more powerful characters.</p>
          </div>
        </div>
        <div className="rule-extender">
          <div className="rule-title">Effects everywhere</div>
          <div className="explanation">
            <p>Characters have other meanings than purely fight your opponent's ones. Most of them also have specific effects. Some have the ability to fly, to conceal themselves, to attack twice or to grant you unique advantages. Use your characters wisely in order to establish a firm strategy !</p>
            <p>Characters aren't the only ones able to grant you special effects. Some cards are dedicated to this use ; play spells at the right time to reverse the steam and take the advantage. Spells are instant, but their effects are powerful. Beware !</p>
          </div>
          <img className="img-exp" src="/rules/des-effets-a-la-pelle.png" alt="img"/>
        </div>
        <div className="rule-part">Flow of the game</div>
        <div className="rule-extender">
          <div className="rule-title">Starting the game</div>
          <img className="img-exp" src="/rules/demarrer-la-partie.png" alt="img"/>
          <div className="explanation">
            <p>At the beginning of the game, both players dispose its hero on the central tile of the backline : that's its starting location (cf. <i>Range and movement</i>). When this has happened, the game is on ; the first player to get rid of the opponent's hero wins.</p>
            <p>The first player is then chosen randomly. They draw 4 cards to form their opening hand. Playing first is a plus, and the other player draws 5 cards and obtain a free gem to compensate (cf. <i>Mana and gems</i>).</p>
            <p>Once everything has been set up, players start taking turns, obviously with the first player beginning.</p>
          </div>
          <div className="rule-title">Setting up a gameplan</div>
          <div className="explanation">
            <p>A player's turn always starts with a card draw. Each new card allows to refine one's gameplan, and grants new options to the player. Beware though : if your deck is empty, each new draw deals 500 damage to your hero ! Furthermore, you cannot have more than 10 cards in hand, and extra cards drawn will be discarded.</p>
            <p>During a turn, you can perform many actions. You can use your mana to play spells directly influencing the game, move your characters on adjacent tiles, attack with, trigger their abilities, in order to setup your strategy while stamping on the opponent's.</p>
          </div>
          <img className="img-exp" src="/rules/mettre-son-jeu-en-place.png" alt="img"/>
          <div className="rule-title">Une partie évolutive</div>
          <img className="img-exp" src="/rules/une-partie-evolutive.png" alt="img"/>
          <div className="explanation">
            <p>Once a turn, your hero can create a mana receptacle that fill up every turn. This way, you have access to more and more mana as the game goes on, and will be able to play cards more and more powerful.</p>
            <p>Some decks use this evolution to their advantage, starting the game by controlling the board and playing their most powerful cards and combos once they have enough mana. Other decks choose to not let that chance to the opponent and want to win faster ; the opponent often having only a few resources at the beginning of the game, they can string low cost cards to flood the board and overcome the opponent before their have the time to get ready.</p>
          </div>
        </div>
        <div className="rule-part">Mana and gems</div>
        <div className="rule-extender">
          <div className="rule-title">Using mana</div>
          <div className="explanation">
            <p>Each card has a specified mana cost. To play the card, you have to empty as many mana receptacles as its cost. If you don't have enough filled receptacle, you can not play the card.</p>
            <p>At the beginning of your turn, all of your mana receptacles fill up. So do not hesitate to use your mana during your turn : it will be reinitialized for your next turn.</p>
            <p>Playing a card isn't the only action requiring mana. Some characters' abilities have to be paid so they can trigger. Think about the mana at your disposal during your next turns so you can plan your game beforehand efficiently.</p>
          </div>
          <img className="img-exp" src="/rules/utiliser-son-mana.png" alt="img"/>
          <div className="rule-title">Gathering mana</div>
          <img className="img-exp" src="/rules/recolter-du-mana.png" alt="img"/>
          <div className="explanation">
            <p>Your main mana source is your receptacles. And if some specific cards can create receptacles, you will mainly use your hero for this purpose. A basic action for a hero is creating a mana receptacle (cf. <i>Triggering effects</i>). In short, you can choose to create a mana receptacle in place of attacking with your hero.</p>
            <p>It is crucial to know how to manage your hero's actions. If it is often required during the first turns to generate mana, otherwise you cannot play cards, you will then need to choose between continuing to increase your mana tank or focusing on other points, like the offense. Pay attention to the options you'll have during the next turn with and without mana gain to help you deciding.</p>
          </div>
          <div className="rule-title">Using gems</div>
          <div className="explanation">
            <p>If receptacles are the main mana source in the game, they are not the only one. Gems are expandable items that can be used to generate an extra mana point whenever all of your receptacles are empty. They are used to fill a specific lack of mana, but can only be used once before disappearing.</p>
            <p>Heros can not create gems. These are obtained through appropriate effects. Most decks can also be played without needing any gem.</p>
            <p>A gem is also given to the second player at the beginning of the game. Given that they starts the game afterhand, they can use a game to take the advantage during the turn they want.</p>
          </div>
          <img className="img-exp" src="/rules/utiliser-des-gemmes.png" alt="img"/>
        </div>
        <div className="rule-part">Characters</div>
        <div className="rule-extender">
          <div className="rule-title">Heroes and figures</div>
          <img className="img-exp" src="/rules/heros-et-figures.png" alt="img"/>
          <div className="explanation">
            <p>From your hero, organizing your playstyle, to the figures you play from your hand, characters form the core of the game. Those are the cards with the most influence on the board, being able to fight opponents and cover their allies.</p>
            <p>Being able to move from tile to tile, to fight and to defend, characters are governed by rules unique to them, and each one has characteristics and effects ruling its strengths and weaknesses.</p>
            <p>Learn how to manage interactions between characters and you'll have already won half the battle.</p>
          </div>
          <div className="rule-title">Statistics are important</div>
          <div className="explanation">
            <p>Apart from the mana cost, a character have multiple other statistics to influence their interactions on the field.</p>
            <p>ATK denotes the character's strength and the amount of damage they deals with a hit. HP is the amount of damage the character is able to take before being destroyed. A balance between these two statistics is often the mark of a balanced and versatile character.</p>
            <p>The range is a digit corresponding to the character's ability to reach difficult targets, like flying, covered or distant entities. It is always a good thing to have some characters able to fight from a far.</p>
          </div>
          <img className="img-exp" src="/rules/des-statistiques-importantes.png" alt="img"/>
          <div className="rule-title">Where a character shines</div>
          <img className="img-exp" src="/rules/la-vraie-force-du-personnage.png" alt="img"/>
          <div className="explanation">
            <p>Characters can fight, but not everyone is a fighter at heart, and even fighters often know a few tricks. If statistics are the simplest basis to assess a card efficiency, its effect is as much important. A good character effect is able to reverse the flow of the game just by getting on the field.</p>
            <p>Weak characters by their statistics but strong by their effect can be protected by more robust characters, while others can boost their own fighting ability. The key is finding effects that synergize and make them work together while renforcing your gameplan.</p>
          </div>
        </div>
        <div className="rule-part">Range and movement</div>
        <div className="rule-extender">
          <div className="rule-title">Position is key</div>
          <div className="explanation">
            <p>The field is formed by 2 battle lines : a 4-tiles front line, and a 5-tiles back line. Each front tile is located right ahead of 2 back tiles. Each tile can host one character. Knowing how to position your characters on the field is a prime skill in order to win the game.</p>
            <p>Once a turn, if they have not attacked or been summoned during this turn, a character can move on a free adjacent tile, being able to switch lines or simply shift away. Reorganizing characters allows them to go fight to the front or protect weaker entities.</p>
          </div>
          <img className="img-exp" src="/rules/le-placement-est-la-clef.png" alt="img"/>
          <div className="rule-title">Covering their allies</div>
          <img className="img-exp" src="/rules/defendre-ses-allies.png" alt="img"/>
          <div className="explanation">
            <p>While a character is located behind one of its allies, they is covered. Therefore, each character in front can cover up to 2 characters in the back line.</p>
            <p>It is good use to cover your allies so they are harder to target. Covering your hero is also a basic strategy used to protect their precious HP.</p>
            <p>Two characters cannot cover themselves mutually. If that would be the case, then no one covers the other. Flying characters also have the ability to bypass grounded defenses, but the opposite is also true.</p>
          </div>
          <div className="rule-title">Reaching the opponent</div>
          <div className="explanation">
            <p>Whenever a character attacks, they have to target an opponent within reach. Positioning and coverage have a major impact on target assignement, thus well dispatching their characters is required to influence the opponent's attacks at best.</p>
            <p>1 range point is needed for a character to attack. Then, 1 extra range point is required for each of these constraints : the target is covered, the attacker is on the back line, or the attacker is grounded and the target is flying. The more a character has range, the less contraints they have.</p>
            <p>Remember that most of the casting only has one range point, and cannot attack with any of those constraints.</p>
          </div>
          <img className="img-exp" src="/rules/atteindre-son-adversaire.png" alt="img"/>
        </div>
        <div className="rule-part">Fighting the opponent</div>
        <div className="rule-extender">
          <div className="rule-title">Launch a strike</div>
          <img className="img-exp" src="/rules/lancer-une-attaque.png" alt="img"/>
          <div className="explanation">
            <p>Once a turn, if they have not been summon during the turn, a character can attack an opponent's entity within reach (cf. <i>Range and movement</i>), costing them one action point. Characters with multiple action points may attack several times a turn (cf. <i>Triggering effects</i>).</p>
            <p>A character attacking lose their remaining movement points, and cannot move for the turn. Attacking then going back under cover during the same turn is not a thing.</p>
          </div>
          <div className="rule-title">Resolving damage</div>
          <div className="explanation">
            <p>Whenever characters attack one another, the contact phase begins. During this phase, each character receives damage equals to the other's attack and are deduced from their HP. Characters for who their HP reach 0 get destroyed. Only characters with Initiative may attack without having to fear a backlash.</p>
            <p>Be careful whenever you chose to attack a powerful foe. You may have to pay several of your units if you want to get them down. Subserve winning trades, with your character surviving the trade but not the opponent's, or when trading one of your weak units with a powerful one.</p>
          </div>
          <img className="img-exp" src="/rules/resoudre-les-degats.png" alt="img"/>
          <div className="rule-title">Fighting a hero</div>
          <img className="img-exp" src="/rules/attaquer-un-heros.png" alt="img"/>
          <div className="explanation">
            <p>But enough with fighting figures. We do want to win. Let's fight the hero !</p>
            <p>Whenever a character attacks a hero, he does not receive any ripost. A hero's ATK only counts where they are the one attacking. Therefore you can destroy the opponent's life bar without losing a single character, and that's why board control is so important.</p>
            <p>You'll often get in a position where you need to chose between attacking the opponent's hero or a figure. Attacking the hero allows to turn up the pressure, where trading figures removes options for your opponent. Think carefully !</p>
          </div>
        </div>
        <div className="rule-part">Triggering effects</div>
        <div className="rule-extender">
          <div className="rule-title">Action, motion, and skill points</div>
          <div className="explanation">
            <p>Each character has multiple ways to act. Each character begins their turn with an action point, a motion point and a skill point they can use to act on the game.</p>
            <p>Motion points are consumed whenever the character moves, skill points are consumed whenever the character uses a skill, and action points are consumed whenever the character uses an action. Using a action also consumes the remaining of your motion points. This way, you can only move before using an action.</p>
            <p>Whenever a character is summoned, they only receive a skill point, and have not access to motion or actions until their next turn.</p>
          </div>
          <img className="img-exp" src="/rules/points-action-mouvement-competence.png" alt="img"/>
          <div className="rule-title">Different kinds of effects</div>
          <img className="img-exp" src="/rules/differents-types-effets.png" alt="img"/>
          <div className="explanation">
            <p>Characters can have passive effects acting permanently, but can also have active effects the player needs to trigger manually. These active effects can be either skills or actions.</p>
            <p>In addition to those printed on the card, each character also have one basic action : attacking. Attacking requires an action point, so a character cannot attack if they already used an action this turn.</p>
            <p>Heroes also possess another basic action, the one generating a mana receptacle. Heroes have quite the panoply of actions you can use each turn, and knowing how to chose the best during each of these turns is key in order to end with the victory.</p>
          </div>
          <div className="rule-title">Activating skills</div>
          <div className="explanation">
            <p>Skills are extra faculties owned by a few characters. They allow to trigger effects without using any action, and give one more option to the player.</p>
            <p>While some are free for use, some other need to pay a specified amount of mana to be triggered, as when you play a card. Mana payment is functionally identical between playing cards and activating skills.</p>
            <p>A non-neglictable plus given by skills is that they can be activated the turn the figure is summoned. You may get advantage of the surprise effect.</p>
          </div>
          <img className="img-exp" src="/rules/declencher-une-competence.png" alt="img"/>
        </div>
        <div className="rule-part">Arteficts</div>
        <div className="rule-extender">
          <div className="rule-title">Powerful items</div>
          <img className="img-exp" src="/rules/des-objets-puissants.png" alt="img"/>
          <div className="explanation">
            <p>Artifacts are an especial card category containing all kinds of items with great power. Like characters, artifacts are summoned on the field by paying their mana cost.</p>
            <p>Not like a character however, an artifact cannot attack, move, or defend. They do not possess neither action nor motion points. Yet they can get attacked and destroyed.</p>
            <p>Despite these flaws, artifacts are often a good pick. Their effect often provide a powerful impact on the game, and may prove to be decisive if not managed by the opponent.</p>
          </div>
          <div className="rule-title">Use an artifact</div>
          <div className="explanation">
            <p>Whenever you play an artifact, it is summoned with a default durability. When its durability reaches 0, the artifact is destroyed.</p>
            <p>Like characters, artifact do have skill points. You can use a skill of your artifact once a turn. Unlike characters however, artifact skills do not cost mana but durability. The artifact gain or lose durability according to the cost associated with the skill. If the artifact does not have enough durability, you cannot use the skill. And when the artifact is gaining durability, there is no maximum, it can go past the default durability.</p>
            <p>One basic skill for all artifacts is to break ; instead of using its effect, you can willingly break it. It proves to be useful when your artifact doesn't have enough durability to use its effect and free one of your tiles.</p>
          </div>
          <img className="img-exp" src="/rules/utiliser-un-artefact.png" alt="img"/>
          <div className="rule-title">Managing durability</div>
          <img className="img-exp" src="/rules/gerer-la-durabilite.png" alt="img"/>
          <div className="explanation">
            <p>While characters stay alive thanks to their HP, artifacts do thanks to their durability. When they do not have durability anymore, they break. They weaken a bit more each time you use one of their skills.</p>
            <p>Artifacts can receive damage and get attacked by other characters. They cannot counterattack, and lose one durability point per damage. Protect your artifacts so you can use them to their full potential !</p>
          </div>
        </div>
        <div className="rule-part">Crafting decks</div>
        <div className="rule-extender">
          <div className="rule-title">Choosing the hero well</div>
          <div className="explanation">
            <p>The first thing you have to do when building a deck is choosing your hero. This is the bandmaster for your deck. They will be on board all game and influence each of your turns. All of your main strategies should be based around your hero.</p>
            <p>Some heroes have powerful attacks and are able to build up damage at a fast rate, while other have many support skills and actions allowing to get ready quickly. Choose the hero fitting your strategy the best.</p>
          </div>
          <img className="img-exp" src="/rules/bien-choisir-son-heros.png" alt="img"/>
          <div className="rule-title">The cards you need</div>
          <img className="img-exp" src="/rules/utiliser-les-bonnes-cartes.png" alt="img"/>
          <div className="explanation">
            <p>In addition to your hero, you must have 30 cards within your deck. No more, no less. Seats are valued, and each draw can reverse the game. Furthermore, you can have a maximum of 2 copies of each card in a deck, forcing at least 15 different cards.</p>
            <p>A restriction is that you have to follow your hero's colors. Any card is not allowed in any deck. Only neutral cards and cards sharing its color with one of your hero's. Card from other colors cannot enter your deck. Each hero wearing 2 colors, there are many possible combinations.</p>
          </div>
          <div className="rule-title">Setting up synergies</div>
          <div className="explanation">
            <p>Always keep in mind the gameplan of your deck whenever you choose cards. Visualize your cards acting together : what is the next thing your need ?</p>
            <p>Beware your weaknesses. If you choose an aggressive gameplan, watch for control abilities and know how to get up. If you have many high-cost cards, set up your defenses against aggressive opponents. Do not forget to keep an eye on your deck size. Being short of cards quickly leads to losing.</p>
            <p>Be sure to always have a way to victory in your deck. It is useless to draw all of your deck if you can barely deal any damage. Remember : you have to kill the opponent's hero to win the game.</p>
          </div>
          <img className="img-exp" src="/rules/mettre-en-place-des-synergies.png" alt="img"/>
        </div>
        <div id="glossary" className="rule-part">Glossary</div>
        <Glossary/>
      </div>
    );
  }
}