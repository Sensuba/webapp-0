import React, { Component } from 'react';

export default class Figure extends Component {

  render() {

  	var capitalize = string => string.charAt(0).toUpperCase() + string.slice(1);

  	var ct = capitalize(this.props.src.cardType);
  	if (this.props.src.archetypes.length > 0) {
  		ct += ": " + capitalize(this.props.src.archetypes[0]);
  		if (this.props.src.archetypes.length > 1)
  			ct += ", " + capitalize(this.props.src.archetypes[1])
  	}
  	
    return (
      <div id={this.props.id} className={"sensuba-card sensuba-figure " + this.props.classColor}>
		<img crossOrigin="Anonymous" className="sensuba-card-bg" src={this.props.src.imgLink} alt={this.props.src.nameCard}/>
	    <div className="sensuba-card-header">
	    	<div className="sensuba-card-mana">{this.props.src.mana}</div>
	        <div className="sensuba-card-title">{this.props.src.nameCard}</div>
	    </div>
	    <div className="sensuba-card-body">
	    	<div className="sensuba-card-body-header">
	        	<span className="sensuba-card-type">{ct}</span>
	        	<span className="sensuba-card-anime">{this.props.src.anime}</span>
	        </div>
	        <div className="sensuba-card-body-main">
	        	<div className="sensuba-card-effect" style={{'font-size': (this.props.src.fontSize || 1.3)/2 + 'em'}} dangerouslySetInnerHTML={{__html: this.props.src.htmlDescription}}/>
	        	<div className="sensuba-card-flavour">{this.props.src.flavourText}</div>
	        </div>
	    </div>
		<div className="sensuba-card-footer">
		  <div className="sensuba-card-param sensuba-card-param-atk">
		  	<div className="sensuba-card-param-name">ATK</div>
		   	<div className="sensuba-card-param-value">{this.props.src.atk}</div>
		  </div>
		  <span className="sensuba-card-param-separator">/</span>
		  <div className="sensuba-card-param sensuba-card-param-hp">
		    <div className="sensuba-card-param-name">HP</div>
	   	    <div className="sensuba-card-param-value">{this.props.src.hp}</div>
		  </div>
		</div>
		<div className="sensuba-card-range">
		  <div className="sensuba-card-range-arrow"/>
		  { this.props.src.range > 1 ? <div className="sensuba-card-range-arrow sensuba-card-range-arrow-2"/> : <span/> }
		  { this.props.src.range > 2 ? <div className="sensuba-card-range-arrow sensuba-card-range-arrow-3"/> : <span/> }
		</div>
	  </div>
    );
  }
}