import React, { Component } from 'react';

export default class GlossaryEN extends Component {

  render() {

    return (
      <div>
        <div className="quarter-section">
          <div className="glossary-panel">
              <img className="glossary-panel-background" src="/glossary/initiative.jpg" alt="bg"/>
              <div className="glossary-panel-filter"/>
              <div className="glossary-panel-text">
                <h3>Initiative</h3>
                <p>Does not receives counterattacks when attacking.</p>
                </div>
          </div>
        </div>
        <div className="quarter-section">
          <div className="glossary-panel">
              <img className="glossary-panel-background" src="/glossary/rush.jpg" alt="bg"/>
              <div className="glossary-panel-filter"/>
              <div className="glossary-panel-text">
                <h3>Rush</h3>
                <p>Can attack during their summoning turn.</p>
                </div>
          </div>
        </div>
        <div className="quarter-section">
          <div className="glossary-panel">
              <img className="glossary-panel-background" src="/glossary/fury.jpg" alt="bg"/>
              <div className="glossary-panel-filter"/>
              <div className="glossary-panel-text">
                <h3>Fury</h3>
                <p>Can attack twice a turn.</p>
                </div>
          </div>
        </div>
        <div className="quarter-section">
          <div className="glossary-panel">
              <img className="glossary-panel-background" src="/glossary/exaltation.jpg" alt="bg"/>
              <div className="glossary-panel-filter"/>
              <div className="glossary-panel-text">
                <h3>Exaltation</h3>
                <p>Cannot be targeted by card effects.</p>
                </div>
          </div>
        </div>
        <div className="quarter-section">
          <div className="glossary-panel">
              <img className="glossary-panel-background" src="/glossary/lethal.png" alt="bg"/>
              <div className="glossary-panel-filter"/>
              <div className="glossary-panel-text">
                <h3>Lethal</h3>
                <p>Any figure receiving damage from this card gets destroyed.</p>
                </div>
          </div>
        </div>
        <div className="half-section">
          <div className="glossary-panel">
              <img className="glossary-panel-background" src="/glossary/shield.png" alt="bg"/>
              <div className="glossary-panel-filter"/>
              <div className="glossary-panel-text">
                <h3>Shield</h3>
                <p>Whenever a character with a <i>Shield</i> receives damage, their <i>Shield</i> breaks but no damage is taken.<br/>One character can have one <i>Shield</i> at a time.</p>
                </div>
          </div>
        </div>
        <div className="quarter-section">
          <div className="glossary-panel">
              <img className="glossary-panel-background" src="/glossary/silence.jpg" alt="bg"/>
              <div className="glossary-panel-filter"/>
              <div className="glossary-panel-text">
                <h3>Silence</h3>
                <p>Cancel every effect or statistic modifier on a character, excepting damage.</p>
                </div>
          </div>
        </div>
        <div className="half-section">
          <div className="glossary-panel">
              <img className="glossary-panel-background" src="/glossary/flying.jpg" alt="bg"/>
              <div className="glossary-panel-filter"/>
              <div className="glossary-panel-text">
                <h3>Flying</h3>
                <p>A grounded character bypasses defense from flying ones. A flying character bypasses defense from grounded ones.<br/>+1 range point is needed to a grounded character to target a flying one.</p>
                </div>
          </div>
        </div>
        <div className="quarter-section">
          <div className="glossary-panel">
              <img className="glossary-panel-background" src="/glossary/freeze.jpg" alt="bg"/>
              <div className="glossary-panel-filter"/>
              <div className="glossary-panel-text">
                <h3>Freeze</h3>
                <p>Cannot use actions, skills, or move.<br/>A character frozen at the beginning of a turn gets unfreezed at the end of it.</p>
                </div>
          </div>
        </div>
        <div className="quarter-section">
          <div className="glossary-panel">
              <img className="glossary-panel-background" src="/glossary/conceal.jpg" alt="bg"/>
              <div className="glossary-panel-filter"/>
              <div className="glossary-panel-text">
                <h3>Conceal</h3>
                <p>Cannot be targeted by attacks or card effects. Cannot defend.</p>
                </div>
          </div>
        </div>
        <div className="quarter-section">
          <div className="glossary-panel">
              <img className="glossary-panel-background" src="/glossary/last_will.png" alt="bg"/>
              <div className="glossary-panel-filter"/>
              <div className="glossary-panel-text">
                <h3>Last will</h3>
                <p>Effect triggered whenever the figure gets destroyed.</p>
                </div>
          </div>
        </div>
        <div className="quarter-section">
          <div className="glossary-panel">
              <img className="glossary-panel-background" src="/glossary/frenzy.jpg" alt="bg"/>
              <div className="glossary-panel-filter"/>
              <div className="glossary-panel-text">
                <h3>Frenzy</h3>
                <p>Effect triggered whenever the character attacks and destroyed a figure while surviving.</p>
                </div>
          </div>
        </div>
        <div className="half-section">
          <div className="glossary-panel">
              <img className="glossary-panel-background" src="/glossary/overload.jpg" alt="bg"/>
              <div className="glossary-panel-filter"/>
              <div className="glossary-panel-text">
                <h3>Overload</h3>
                <p>If a card with limit <span role="img" aria-label="limit">⚡</span> receives <i>Overload</i>, numerical values on the card are incremented by the <i>Overload</i> receives divided by the card limit <span role="img" aria-label="limit">⚡</span>.</p>
                </div>
          </div>
        </div>
      </div>
    );
  }
}