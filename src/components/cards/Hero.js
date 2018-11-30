import React, { Component } from 'react';

export default class Hero extends Component {

	constructor (props) {

		super(props);
		this.state = { level: 1 }
		if (props.switch === "timer")
			this.timer = setInterval(() => this.setState({level: this.state.level%3+1}), 5000)
	}

	componentWillUnmount () {

		if (this.props.switch === "timer")
			clearInterval(this.timer);
	}

  render() {

  	var src = this.props.src;

  	var capitalize = string => string.charAt(0).toUpperCase() + string.slice(1);

  	var level = this.props.level || this.state.level;
  	
    return (
      <div id={this.props.id} className={"sensuba-card sensuba-hero " + this.props.classColor.color1 + " " + this.props.classColor.color2 + (this.props.switch === "manual" ? " editable " : " ") + this.props.className} onClick={this.props.switch === "manual" ? e => this.setState({ level: level%3+1 }) : () => {}}>
		<img crossOrigin="Anonymous" className="sensuba-card-bg" src={src.imgLink} alt={src.nameCard}/>
	    <div className="sensuba-card-header">
	        <div className={"sensuba-card-title" +
	        	(src.nameCard.length >= 25 ?
	        		(src.nameCard.length >= 30 ? " sensuba-card-very-long-title" : " sensuba-card-long-title")
	        		: ""
	        	)}>
	        	{src.nameCard}
	        </div>
	    	<div className="sensuba-card-hero-icon"/>
	    </div>
	    <div className="sensuba-card-body">
	    	<div className="sensuba-card-body-header">
	        	<span className="sensuba-card-type">{capitalize(src.cardType)}</span>
	        	<span className="sensuba-card-anime">{src.anime}</span>
	        </div>
	        <div className="sensuba-card-body-main">
	        	<div className={"sensuba-card-effect" + (level !== 1 ? " sensuba-card-invisible" : "")} style={{fontSize: (src.fontSize || 1.3)/2 + 'em'}} dangerouslySetInnerHTML={{__html: src.htmlDescription}}/>
	        	<div className={"sensuba-card-effect" + (level !== 2 ? " sensuba-card-invisible" : "")} style={{fontSize: (src.lv2.fontSize || 1.3)/2 + 'em'}} dangerouslySetInnerHTML={{__html: src.lv2.htmlDescription}}/>
	        	<div className={"sensuba-card-effect" + (level !== 3 ? " sensuba-card-invisible" : "")} style={{fontSize: (src.lvmax.fontSize || 1.3)/2 + 'em'}} dangerouslySetInnerHTML={{__html: src.lvmax.htmlDescription}}/>
	        	<div className="sensuba-card-flavour">{src.flavourText}</div>
	        </div>
	    </div>
		<div className={"sensuba-card-level" + (level !== 1 ? " sensuba-card-invisible" : "")}>Lv 1</div>
		<div className={"sensuba-card-level" + (level !== 2 ? " sensuba-card-invisible" : "")}>Lv 2</div>
		<div className={"sensuba-card-level" + (level !== 3 ? " sensuba-card-invisible" : "")}>Lv MAX</div>
		<div className="sensuba-card-param sensuba-card-param-atk">
			<div className="sensuba-card-param-name">ATK</div>
		   	<div className={"sensuba-card-param-value" + (level !== 1 ? " sensuba-card-invisible" : "")}>{src.atk}</div>
		   	<div className={"sensuba-card-param-value" + (level !== 2 ? " sensuba-card-invisible" : "")}>{src.lv2.atk}</div>
		   	<div className={"sensuba-card-param-value" + (level !== 3 ? " sensuba-card-invisible" : "")}>{src.lvmax.atk}</div>
		</div>
		<div className="sensuba-card-param sensuba-card-param-hp">
		    <div className="sensuba-card-param-name">HP</div>
	   	    <div className={"sensuba-card-param-value" + (src.hasOwnProperty('chp') && src.chp < src.hp ? " sensuba-card-param-malus" : "")}>{src.chp || src.hp}</div>
		</div>
		<div className={"sensuba-card-range" + (level !== 1 ? " sensuba-card-invisible" : "")}>
		  <div className="sensuba-card-range-arrow"/>
		  { src.range > 1 ? <div className="sensuba-card-range-arrow sensuba-card-range-arrow-2"/> : <span/> }
		  { src.range > 2 ? <div className="sensuba-card-range-arrow sensuba-card-range-arrow-3"/> : <span/> }
		</div>
		<div className={"sensuba-card-range" + (level !== 2 ? " sensuba-card-invisible" : "")}>
		  <div className="sensuba-card-range-arrow"/>
		  { src.lv2.range > 1 ? <div className="sensuba-card-range-arrow sensuba-card-range-arrow-2"/> : <span/> }
		  { src.lv2.range > 2 ? <div className="sensuba-card-range-arrow sensuba-card-range-arrow-3"/> : <span/> }
		</div>
		<div className={"sensuba-card-range" + (level !== 3 ? " sensuba-card-invisible" : "")}>
		  <div className="sensuba-card-range-arrow"/>
		  { src.lvmax.range > 1 ? <div className="sensuba-card-range-arrow sensuba-card-range-arrow-2"/> : <span/> }
		  { src.lvmax.range > 2 ? <div className="sensuba-card-range-arrow sensuba-card-range-arrow-3"/> : <span/> }
		</div>
	    { src.overload && src.overload > 0 ? <div className={"sensuba-card-overload" + (level !== 1 ? " sensuba-card-invisible" : "")}>{src.overload}</div> : <span/> }
	    { src.overload && src.overload > 0 ? <div className={"sensuba-card-overload" + (level !== 2 ? " sensuba-card-invisible" : "")}>{src.lv2.overload}</div> : <span/> }
	    { src.overload && src.overload > 0 ? <div className={"sensuba-card-overload" + (level !== 3 ? " sensuba-card-invisible" : "")}>{src.lvmax.overload}</div> : <span/> }
	  </div>
    );
  }
}