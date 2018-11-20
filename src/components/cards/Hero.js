import React, { Component } from 'react';

export default class Hero extends Component {

	constructor (props) {

		super(props);
		this.state = { level: props.level || 1 }
		if (props.switch === "timer")
			this.timer = setInterval(() => this.setState({level: this.state.level%3+1}), 5000)
	}

	componentWillUnmount () {

		if (this.props.switch === "timer")
			clearInterval(this.timer);
	}

  render() {

  	var capitalize = string => string.charAt(0).toUpperCase() + string.slice(1);
  	
    return (
      <div id={this.props.id} className={"sensuba-card sensuba-hero " + this.props.classColor.color1 + " " + this.props.classColor.color2 + (this.props.switch === "manual" ? " editable" : "")} onClick={this.props.switch === "manual" ? e => this.setState({ level: this.state.level%3+1 }) : () => {}}>
		<img crossOrigin="Anonymous" className="sensuba-card-bg" src={this.props.src.imgLink} alt={this.props.src.nameCard}/>
	    <div className="sensuba-card-header">
	        <div className={"sensuba-card-title" +
	        	(this.props.src.nameCard.length >= 25 ?
	        		(this.props.src.nameCard.length >= 30 ? " sensuba-card-very-long-title" : " sensuba-card-long-title")
	        		: ""
	        	)}>
	        	{this.props.src.nameCard}
	        </div>
	    	<div className="sensuba-card-hero-icon"/>
	    </div>
	    <div className="sensuba-card-body">
	    	<div className="sensuba-card-body-header">
	        	<span className="sensuba-card-type">{capitalize(this.props.src.cardType)}</span>
	        	<span className="sensuba-card-anime">{this.props.src.anime}</span>
	        </div>
	        <div className="sensuba-card-body-main">
	        	<div className={"sensuba-card-effect" + (this.state.level !== 1 ? " sensuba-card-invisible" : "")} style={{fontSize: (this.props.src.fontSize || 1.3)/2 + 'em'}} dangerouslySetInnerHTML={{__html: this.props.src.htmlDescription}}/>
	        	<div className={"sensuba-card-effect" + (this.state.level !== 2 ? " sensuba-card-invisible" : "")} style={{fontSize: (this.props.src.lv2.fontSize || 1.3)/2 + 'em'}} dangerouslySetInnerHTML={{__html: this.props.src.lv2.htmlDescription}}/>
	        	<div className={"sensuba-card-effect" + (this.state.level !== 3 ? " sensuba-card-invisible" : "")} style={{fontSize: (this.props.src.lvmax.fontSize || 1.3)/2 + 'em'}} dangerouslySetInnerHTML={{__html: this.props.src.lvmax.htmlDescription}}/>
	        	<div className="sensuba-card-flavour">{this.props.src.flavourText}</div>
	        </div>
	    </div>
		<div className={"sensuba-card-level" + (this.state.level !== 1 ? " sensuba-card-invisible" : "")}>Lv 1</div>
		<div className={"sensuba-card-level" + (this.state.level !== 2 ? " sensuba-card-invisible" : "")}>Lv 2</div>
		<div className={"sensuba-card-level" + (this.state.level !== 3 ? " sensuba-card-invisible" : "")}>Lv MAX</div>
		<div className="sensuba-card-param sensuba-card-param-atk">
			<div className="sensuba-card-param-name">ATK</div>
		   	<div className={"sensuba-card-param-value" + (this.state.level !== 1 ? " sensuba-card-invisible" : "")}>{this.props.src.atk}</div>
		   	<div className={"sensuba-card-param-value" + (this.state.level !== 2 ? " sensuba-card-invisible" : "")}>{this.props.src.lv2.atk}</div>
		   	<div className={"sensuba-card-param-value" + (this.state.level !== 3 ? " sensuba-card-invisible" : "")}>{this.props.src.lvmax.atk}</div>
		</div>
		<div className="sensuba-card-param sensuba-card-param-hp">
		    <div className="sensuba-card-param-name">HP</div>
	   	    <div className="sensuba-card-param-value">{this.props.src.hp}</div>
		</div>
		<div className={"sensuba-card-range" + (this.state.level !== 1 ? " sensuba-card-invisible" : "")}>
		  <div className="sensuba-card-range-arrow"/>
		  { this.props.src.range > 1 ? <div className="sensuba-card-range-arrow sensuba-card-range-arrow-2"/> : <span/> }
		  { this.props.src.range > 2 ? <div className="sensuba-card-range-arrow sensuba-card-range-arrow-3"/> : <span/> }
		</div>
		<div className={"sensuba-card-range" + (this.state.level !== 2 ? " sensuba-card-invisible" : "")}>
		  <div className="sensuba-card-range-arrow"/>
		  { this.props.src.lv2.range > 1 ? <div className="sensuba-card-range-arrow sensuba-card-range-arrow-2"/> : <span/> }
		  { this.props.src.lv2.range > 2 ? <div className="sensuba-card-range-arrow sensuba-card-range-arrow-3"/> : <span/> }
		</div>
		<div className={"sensuba-card-range" + (this.state.level !== 3 ? " sensuba-card-invisible" : "")}>
		  <div className="sensuba-card-range-arrow"/>
		  { this.props.src.lvmax.range > 1 ? <div className="sensuba-card-range-arrow sensuba-card-range-arrow-2"/> : <span/> }
		  { this.props.src.lvmax.range > 2 ? <div className="sensuba-card-range-arrow sensuba-card-range-arrow-3"/> : <span/> }
		</div>
	    { this.props.src.overload && this.props.src.overload > 0 ? <div className={"sensuba-card-overload" + (this.state.level !== 1 ? " sensuba-card-invisible" : "")}>{this.props.src.overload}</div> : <span/> }
	    { this.props.src.overload && this.props.src.overload > 0 ? <div className={"sensuba-card-overload" + (this.state.level !== 2 ? " sensuba-card-invisible" : "")}>{this.props.src.lv2.overload}</div> : <span/> }
	    { this.props.src.overload && this.props.src.overload > 0 ? <div className={"sensuba-card-overload" + (this.state.level !== 3 ? " sensuba-card-invisible" : "")}>{this.props.src.lvmax.overload}</div> : <span/> }
	  </div>
    );
  }
}