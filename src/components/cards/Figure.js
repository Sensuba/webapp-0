import React, { Component } from 'react';

export default class Figure extends Component {

  render() {

  	var src = this.props.src;

  	var capitalize = string => string.charAt(0).toUpperCase() + string.slice(1);

  	var ct = capitalize(src.cardType);
  	if (src.archetypes && src.archetypes.length > 0) {
  		ct += ": " + capitalize(src.archetypes[0]);
  		if (src.archetypes && src.archetypes.length > 1)
  			ct += ", " + capitalize(src.archetypes[1])
  	}
  	
    return (
      <div id={this.props.id} className={"sensuba-card sensuba-figure " + this.props.classColor + " " + this.props.className}>
		<img crossOrigin="Anonymous" className="sensuba-card-bg" src={src.imgLink} alt={src.nameCard}/>
	    <div className="sensuba-card-header">
	    	<div className={"sensuba-card-mana" + (this.props.model ? (src.mana < this.props.model.mana ? " sensuba-card-param-bonus" : (src.mana > this.props.model.mana ? " sensuba-card-param-malus" : "")) : "")}>{src.mana}</div>
	        <div className={"sensuba-card-title" +
	        	(src.nameCard.length >= 25 ?
	        		(src.nameCard.length >= 30 ? " sensuba-card-very-long-title" : " sensuba-card-long-title")
	        		: ""
	        	)}>
	        	{src.nameCard}
	        </div>
	    </div>
	    <div className="sensuba-card-body">
	    	<div className="sensuba-card-body-header">
	        	<span className="sensuba-card-type">{ct}</span>
	        	<span className="sensuba-card-anime">{src.anime}</span>
	        </div>
	        <div className="sensuba-card-body-main">
	        	<div className="sensuba-card-effect" style={{fontSize: (src.fontSize || 1.3)/2 + 'em'}} dangerouslySetInnerHTML={{__html: src.htmlDescription}}/>
	        	<div className="sensuba-card-flavour">{src.flavourText}</div>
	        </div>
	    </div>
		<div className="sensuba-card-footer">
		  <div className="sensuba-card-param sensuba-card-param-atk">
		  	<div className="sensuba-card-param-name">ATK</div>
		   	<div className={"sensuba-card-param-value" + (this.props.model ? (src.atk < this.props.model.atk ? " sensuba-card-param-malus" : (src.atk > this.props.model.atk ? " sensuba-card-param-bonus" : "")) : "")}>{src.atk}</div>
		  </div>
		  <span className="sensuba-card-param-separator">/</span>
		  <div className="sensuba-card-param sensuba-card-param-hp">
		    <div className="sensuba-card-param-name">HP</div>
	   	    <div className={"sensuba-card-param-value" + (src.hasOwnProperty('chp') ? (src.chp < src.hp ? " sensuba-card-param-malus" : (this.props.model && src.hp > this.props.model.hp ? " sensuba-card-param-bonus" : "")) : "")}>{src.chp || src.hp}</div>
		  </div>
		</div>
		<div className={"sensuba-card-range" + (this.props.model ? (src.range < this.props.model.range ? " sensuba-card-param-malus" : (src.range > this.props.model.range ? " sensuba-card-param-bonus" : "")) : "")}>
		  <div className="sensuba-card-range-arrow"/>
		  { src.range > 1 ? <div className="sensuba-card-range-arrow sensuba-card-range-arrow-2"/> : <span/> }
		  { src.range > 2 ? <div className="sensuba-card-range-arrow sensuba-card-range-arrow-3"/> : <span/> }
		</div>
	    { src.overload && src.overload > 0 ? <div className={"sensuba-card-overload" + (src.ol && src.ol > src.overload ? " sensuba-card-overload-limit-break" : "")}>{src.overload}</div> : <span/> }
	    <div className="sensuba-card-frame">
	    	<div className="sensuba-frame-icon"/>
	    	<div className="sensuba-card-inner-frame"/>
	    </div>
	  </div>
    );
  }
}