import React, { Component } from 'react';

export default class SensFR extends Component {

  render() {
    return (
      <div>
        <div className="sens-intro">
        	<div className="sens-title">SENScript</div>
        	<p>Bienvenue dans l'antre des secrets, où vous découvrirez la face cachée des cartes de Sensuba. Le SENScript, ou <b>Sensuba Effect Natural Script</b> est un langage de script permettant de donner un effet aux cartes. Ainsi, une carte personnalisée, accompagnée de son SENS, est donc parfaitement jouable en duel.</p>
        	<p>Un langage de script, ça fait peur. Mais pas de panique, il s'agit d'un langage de script naturel. Si les effets les plus complexes demanderont de la réflexion dans l'écriture du script, les effets simples se feront plus que naturellement.</p>
        	<p>L'important est de respecter la grammaire du SENScript. Avec la bonne syntaxe, chaque élément sera lié à un attribut et le script sera parfaitement compréhensible. Mais si vous vous écartez de la syntaxe, le SENS n'aura plus aucun sens et sera inutilisable. La grammaire exacte du SENScript est définie ci-dessous à l'aide d'<b>expréssions régulières</b>.</p>
      	</div>
        <div className="sens-box">
        	<div className="sens-title">Effect</div>
        	<div className="sens-regex" dangerouslySetInnerHTML={{__html: this.props.regex("SUMMON_EFFECT|LAST_WILL|FRENZY|ACTION|SKILL|PASSIVE")}}/>
        </div>
        <div className="sens-box">
        	<div className="sens-title">Passive</div>
        	<div className="sens-regex" dangerouslySetInnerHTML={{__html: this.props.regex("rush|initiative|fury|flying|exaltation")}}/>
        </div>
        <div className="sens-box">
        	<div className="sens-title">Summon effect</div>
        	<div className="sens-regex" dangerouslySetInnerHTML={{__html: this.props.regex("\\-> EVENT")}}/>
        </div>
        <div className="sens-box">
        	<div className="sens-title">Last will</div>
        	<div className="sens-regex" dangerouslySetInnerHTML={{__html: this.props.regex("last will ?: EVENT")}}/>
        </div>
        <div className="sens-box">
        	<div className="sens-title">Frenzy</div>
        	<div className="sens-regex" dangerouslySetInnerHTML={{__html: this.props.regex("frenzy ?: EVENT")}}/>
        </div>
        <div className="sens-box">
        	<div className="sens-title">Action</div>
        	<div className="sens-regex" dangerouslySetInnerHTML={{__html: this.props.regex("(!|action) ?: EVENT")}}/>
        </div>
        <div className="sens-box">
        	<div className="sens-title">Skill</div>
        	<div className="sens-regex" dangerouslySetInnerHTML={{__html: this.props.regex("DIGIT ?: EVENT")}}/>
        </div>
        <div className="sens-box">
        	<div className="sens-title">Event</div>
        	<div className="sens-regex" dangerouslySetInnerHTML={{__html: this.props.regex("DRAW|DAMAGE|SILENCE|BUFF|DESTROY|HEAL")}}/>
        </div>
        <div className="sens-box">
        	<div className="sens-title">Buff</div>
        	<div className="sens-regex" dangerouslySetInnerHTML={{__html: this.props.regex("(TARGET ?)(gain|lose)( BONUS)+(and BONUS)*")}}/>
        </div>
        <div className="sens-box">
        	<div className="sens-title">Bonus</div>
        	<div className="sens-regex" dangerouslySetInnerHTML={{__html: this.props.regex("(PASSIVE|\\+?STAT)")}}/>
        </div>
        <div className="sens-box">
        	<div className="sens-title">Destroy</div>
        	<div className="sens-regex" dangerouslySetInnerHTML={{__html: this.props.regex("destroy TARGET")}}/>
        </div>
        <div className="sens-box">
        	<div className="sens-title">Stat</div>
        	<div className="sens-regex" dangerouslySetInnerHTML={{__html: this.props.regex("NUMBER ?STAT_TYPE")}}/>
        </div>
        <div className="sens-box">
        	<div className="sens-title">Stat type</div>
        	<div className="sens-regex" dangerouslySetInnerHTML={{__html: this.props.regex("atk|life|range|mana|hp")}}/>
        </div>
        <div className="sens-box">
        	<div className="sens-title">Draw</div>
        	<div className="sens-regex" dangerouslySetInnerHTML={{__html: this.props.regex("draw( NUMBER)?( CARD_FILTERs?)?")}}/>
        </div>
        <div className="sens-box">
        	<div className="sens-title">Damage</div>
        	<div className="sens-regex" dangerouslySetInnerHTML={{__html: this.props.regex("deal NUMBER( damage)?( to TARGET)?")}}/>
        </div>
        <div className="sens-box">
        	<div className="sens-title">Heal</div>
        	<div className="sens-regex" dangerouslySetInnerHTML={{__html: this.props.regex("restore NUMBER( hp)?( TARGET)?")}}/>
        </div>
        <div className="sens-box">
        	<div className="sens-title">Silence</div>
        	<div className="sens-regex" dangerouslySetInnerHTML={{__html: this.props.regex("silence( TARGET)?")}}/>
        </div>
        <div className="sens-box">
        	<div className="sens-title">Target</div>
        	<div className="sens-regex" dangerouslySetInnerHTML={{__html: this.props.regex("((NUMBER )?(target|random )?|every )?CARD_FILTERs?")}}/>
        </div>
        <div className="sens-box">
        	<div className="sens-title">Number</div>
        	<div className="sens-regex" dangerouslySetInnerHTML={{__html: this.props.regex("DIGIT|an?|\(NUMBER( ?OPERATOR ?NUMBER)?\)")}}/>
        </div>
        <div className="sens-box">
        	<div className="sens-title">Digit</div>
        	<div className="sens-regex" dangerouslySetInnerHTML={{__html: this.props.regex("[0-9]+")}}/>
        </div>
        <div className="sens-box">
        	<div className="sens-title">Operator</div>
        	<div className="sens-regex" dangerouslySetInnerHTML={{__html: this.props.regex("\\+|\\-|\\*|/|%")}}/>
        </div>
        <div className="sens-box">
        	<div className="sens-title">Card filter</div>
        	<div className="sens-regex" dangerouslySetInnerHTML={{__html: this.props.regex("this|card|TYPE|ARCHETYPE")}}/>
        </div>
        <div className="sens-box">
        	<div className="sens-title">Type</div>
        	<div className="sens-regex" dangerouslySetInnerHTML={{__html: this.props.regex("entity|character|hero|figure|spell|trap|artefact")}}/>
        </div>
        <div className="sens-box">
        	<div className="sens-title">Archetype</div>
        	<div className="sens-regex" dangerouslySetInnerHTML={{__html: this.props.regex("arc:[a-z]+")}}/>
        </div>
      </div>
    );
  }
}