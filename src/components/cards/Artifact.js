import React, { Component } from 'react';

export default class Artifact extends Component {

  render() {

  	var src = this.props.src;

  	var capitalize = string => string.charAt(0).toUpperCase() + string.slice(1);
  	
    return (
      <div id={this.props.id} className={"sensuba-card sensuba-artifact " + this.props.classColor + " " + this.props.className}>
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
	        	<span className="sensuba-card-type">{capitalize(src.cardType)}</span>
	        	<span className="sensuba-card-anime">{src.anime}</span>
	        </div>
	        <div className="sensuba-card-body-main">
	        	<div className="sensuba-card-effect" style={{fontSize: (src.fontSize || 1.3)/2 + 'em'}} dangerouslySetInnerHTML={{__html: src.htmlDescription}}/>
	        	<div className="sensuba-card-flavour">{src.flavourText}</div>
	        </div>
	    </div>
		<div className="sensuba-card-footer">
		  <div className="sensuba-card-param sensuba-card-param-hp">
		    <div className="sensuba-card-param-name">DUR</div>
	   	    <div className="sensuba-card-param-value">{src.chp || src.hp}</div>
		  </div>
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