import React, { Component } from 'react';

export default class GlossaryFR extends Component {

  render() {

    return (
      <div>
        <div className="quarter-section">
          <div className="glossary-panel">
              <img className="glossary-panel-background" src="/glossary/initiative.jpg" alt="bg"/>
              <div className="glossary-panel-filter"/>
              <div className="glossary-panel-text">
                <h3>Initiative</h3>
                <p>Ne reçoit pas de contrecoup lorsqu'il attaque.</p>
                </div>
          </div>
        </div>
        <div className="quarter-section">
          <div className="glossary-panel">
              <img className="glossary-panel-background" src="/glossary/rush.jpg" alt="bg"/>
              <div className="glossary-panel-filter"/>
              <div className="glossary-panel-text">
                <h3>Hâte</h3>
                <p>Peut attaquer dès son tour d'invocation.</p>
                </div>
          </div>
        </div>
        <div className="quarter-section">
          <div className="glossary-panel">
              <img className="glossary-panel-background" src="/glossary/fury.jpg" alt="bg"/>
              <div className="glossary-panel-filter"/>
              <div className="glossary-panel-text">
                <h3>Furie</h3>
                <p>Peut attaquer deux fois par tour.</p>
                </div>
          </div>
        </div>
        <div className="quarter-section">
          <div className="glossary-panel">
              <img className="glossary-panel-background" src="/glossary/exaltation.jpg" alt="bg"/>
              <div className="glossary-panel-filter"/>
              <div className="glossary-panel-text">
                <h3>Exaltation</h3>
                <p>Ne peut pas être ciblé par des effets de carte.</p>
                </div>
          </div>
        </div>
        <div className="quarter-section">
          <div className="glossary-panel">
              <img className="glossary-panel-background" src="/glossary/lethal.png" alt="bg"/>
              <div className="glossary-panel-filter"/>
              <div className="glossary-panel-text">
                <h3>Létal</h3>
                <p>Lorsque cette carte inflige des dégâts à une figure, cette dernière est détruite.</p>
                </div>
          </div>
        </div>
        <div className="quarter-section">
          <div className="glossary-panel">
              <img className="glossary-panel-background" src="/glossary/silence.jpg" alt="bg"/>
              <div className="glossary-panel-filter"/>
              <div className="glossary-panel-text">
                <h3>Silence</h3>
                <p>Annule tous les effets et les modifications de statistiques d'un personnage, hormis les dégâts.</p>
                </div>
          </div>
        </div>
        <div className="half-section">
          <div className="glossary-panel">
              <img className="glossary-panel-background" src="/glossary/shield.png" alt="bg"/>
              <div className="glossary-panel-filter"/>
              <div className="glossary-panel-text">
                <h3>Bouclier</h3>
                <p>Lorsqu'un personnage avec un <i>Bouclier</i> doit recevoir des dégâts, son <i>Bouclier</i> se brise et il ne reçoit aucun dégât.<br/>Un personnage ne peut avoir qu'un seul <i>Bouclier</i> à la fois.</p>
                </div>
          </div>
        </div>
        <div className="half-section">
          <div className="glossary-panel">
              <img className="glossary-panel-background" src="/glossary/flying.jpg" alt="bg"/>
              <div className="glossary-panel-filter"/>
              <div className="glossary-panel-text">
                <h3>Don du Vol</h3>
                <p>Un personnage au sol ignore la défense des personnages volants. Un personnage volant ignore la défense des personnages au sol.<br/>Il faut +1 de portée à un personnage au sol pour atteindre un personnage volant.</p>
                </div>
          </div>
        </div>
        <div className="quarter-section">
          <div className="glossary-panel">
              <img className="glossary-panel-background" src="/glossary/freeze.jpg" alt="bg"/>
              <div className="glossary-panel-filter"/>
              <div className="glossary-panel-text">
                <h3>Gel</h3>
                <p>Ne peut pas utiliser d'action, de compétence, ou se déplacer.<br/>N'est plus gelé la fin de votre tour si ce personnage était déjà gelé au début.</p>
                </div>
          </div>
        </div>
        <div className="quarter-section">
          <div className="glossary-panel">
              <img className="glossary-panel-background" src="/glossary/conceal.jpg" alt="bg"/>
              <div className="glossary-panel-filter"/>
              <div className="glossary-panel-text">
                <h3>Camouflage</h3>
                <p>Ne peut pas être ciblé par des attaques ou des effets de carte de votre adversaire. Ne peut pas défendre.</p>
                </div>
          </div>
        </div>
        <div className="quarter-section">
          <div className="glossary-panel">
              <img className="glossary-panel-background" src="/glossary/last_will.png" alt="bg"/>
              <div className="glossary-panel-filter"/>
              <div className="glossary-panel-text">
                <h3>Dernière volonté</h3>
                <p>Effet déclenché lorsque cette figure est détruite.</p>
                </div>
          </div>
        </div>
        <div className="quarter-section">
          <div className="glossary-panel">
              <img className="glossary-panel-background" src="/glossary/frenzy.jpg" alt="bg"/>
              <div className="glossary-panel-filter"/>
              <div className="glossary-panel-text">
                <h3>Frénésie</h3>
                <p>Effet déclenché lorsque ce personnage attaque et détruit une figure.</p>
                </div>
          </div>
        </div>
        <div className="half-section">
          <div className="glossary-panel">
              <img className="glossary-panel-background" src="/glossary/overload.jpg" alt="bg"/>
              <div className="glossary-panel-filter"/>
              <div className="glossary-panel-text">
                <h3>Surcharge</h3>
                <p>Si une carte avec une limite <span role="img" aria-label="limit">⚡</span> reçoit de la <i>Surcharge</i>, les valeurs numériques sur la carte sont incrémentées de la <i>Surcharge</i> reçue divisée par la limite <span role="img" aria-label="limit">⚡</span> de la carte.</p>
                </div>
          </div>
        </div>
        <div className="quarter-section">
          <div className="glossary-panel">
              <img className="glossary-panel-background" src="/glossary/poison.png" alt="bg"/>
              <div className="glossary-panel-filter"/>
              <div className="glossary-panel-text">
                <h3>Poison</h3>
                <p>Reçoit des dégâts équivalents à son poison à la fin du tour de chaque joueur.</p>
                </div>
          </div>
        </div>
        <div className="quarter-section">
          <div className="glossary-panel">
              <img className="glossary-panel-background" src="/glossary/trap.png" alt="bg"/>
              <div className="glossary-panel-filter"/>
              <div className="glossary-panel-text">
                <h3>Auto</h3>
                <p>Se lance automatiquement lorsque cette carte est piochée.</p>
                </div>
          </div>
        </div>
        <div className="quarter-section">
          <div className="glossary-panel">
              <img className="glossary-panel-background" src="/glossary/glazed.jpg" alt="bg"/>
              <div className="glossary-panel-filter"/>
              <div className="glossary-panel-text">
                <h3>Vernissage</h3>
                <p>Une carte vernie peut pas être copiée vers la main ou le deck.</p>
                </div>
          </div>
        </div>
        <div className="quarter-section">
          <div className="glossary-panel">
              <img className="glossary-panel-background" src="/glossary/immune.jpg" alt="bg"/>
              <div className="glossary-panel-filter"/>
              <div className="glossary-panel-text">
                <h3>Insensible</h3>
                <p>Ne peut pas être ciblé par des effets de carte de votre adversaire. Ne reçoit aucun dégât.</p>
                </div>
          </div>
        </div>
      </div>
    );
  }
}