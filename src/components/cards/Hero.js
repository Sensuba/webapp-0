import React, { Component } from 'react';

export default class Hero extends Component {

	constructor (props) {

		super(props);
		this.state = { level: 1 }
    	this.ref = React.createRef();
		if (props.switch === "timer")
			this.timer = setInterval(() => this.setState({level: this.state.level%3+1}), 5000)
		this.id = this.props.id || (this.props.src.idCardmodel + "." + Math.floor(Math.random() * 100000));
	}

	componentWillUnmount () {

		if (this.props.switch === "timer")
			clearInterval(this.timer);
	}

  render() {

  	var src = this.props.src;

  	var level = this.props.level || this.state.level;
  	var eff = src.isEff;
  	var holographic = false;

    return (
      <div ref={this.ref} id={this.id}
      className={"sensuba-card sensuba-hero " + this.props.classColor.color1 + " " + this.props.classColor.color2 + (this.props.switch === "manual" ? " editable " : " ") + (holographic ? "sensuba-card-holographic " : " ") + (this.props.className || "")}
      onClick={this.props.switch === "manual" ? e => this.setState({ level: level%3+1 }) : () => {}}
      onMouseMove={e => {
		  var offset = this.ref.current.offsetLeft;
	        if (this.ref.current.offsetParent)
	          offset += this.ref.current.offsetParent.offsetLeft;
	        var width = this.ref.current.clientWidth;
	        var value = (e.clientX - offset) / width;
		  const percentage = value * 100;
  		  document.getElementById(this.id + "-filter").style.backgroundPosition = percentage + "%";
  		  var img = document.getElementById(this.id + "-img");
  		  document.getElementById(this.id + "-inner").style.transform = "skew(0, " + (value * 2 - 1) + "deg)";
  		  img.style.left = (-1.75 - value * 1.5) + "%";
		}}
      >
      	<div id={this.id + "-inner"} className="sensuba-card-inner">
		<img id={this.id + "-img"} crossOrigin="Anonymous" className="sensuba-card-bg" src={src.imgLink} alt={src.nameCard}/>
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
	    { src.illustrator ? <div className="sensuba-card-illustrator">Illus: {src.illustrator}</div> : <span/> }
	    <div className="sensuba-card-body">
	    	<div className="sensuba-card-body-header">
	        	<span className="sensuba-card-type">Héros</span>
	        	<span className="sensuba-card-anime">{src.anime}</span>
	        </div>
	        <div className="sensuba-card-body-main">
	        	<div className={"sensuba-card-effect" + (level !== 1 ? " sensuba-card-invisible" : "") + (src.lvmax.fontSize < 0.95 ? " sensuba-card-long-effect" : "")} style={{fontSize: (src.fontSize || 1.3)/2 + 'em'}} dangerouslySetInnerHTML={{__html: src.htmlDescription}}/>
	        	<div className={"sensuba-card-effect" + (level !== 2 ? " sensuba-card-invisible" : "") + (src.lv2.fontSize < 0.95 ? " sensuba-card-long-effect" : "")} style={{fontSize: (src.lv2.fontSize || 1.3)/2 + 'em'}} dangerouslySetInnerHTML={{__html: src.lv2.htmlDescription}}/>
	        	<div className={"sensuba-card-effect" + (level !== 3 ? " sensuba-card-invisible" : "") + (src.lvmax.fontSize < 0.95 ? " sensuba-card-long-effect" : "")} style={{fontSize: (src.lvmax.fontSize || 1.3)/2 + 'em'}} dangerouslySetInnerHTML={{__html: src.lvmax.htmlDescription}}/>
	        	<div className="sensuba-card-flavour">{src.flavourText || ""}</div>
	        	{ src.idEdition > 1 ? <div className={"sensuba-card-edition sensuba-card-edition-" + src.idEdition}/> : <span/> }
	    	</div>
	    </div>
		<div className={"sensuba-card-level" + (level !== 1 ? " sensuba-card-invisible" : "")}>Nv 1</div>
		<div className={"sensuba-card-level" + (level !== 2 ? " sensuba-card-invisible" : "")}>Nv 2</div>
		<div className={"sensuba-card-level" + (level !== 3 ? " sensuba-card-invisible" : "")}>Nv MAX</div>
		<div className="sensuba-card-param sensuba-card-param-atk">
			<div className="sensuba-card-param-name">ATK</div>
		   	<div className={"sensuba-card-param-value" + (level !== 1 && !eff ? " sensuba-card-invisible" : "") + (src.atk < src.originalAtk ? " sensuba-card-param-malus" : (src.atk > src.originalAtk ? " sensuba-card-param-bonus" : ""))}>{src.atk}</div>
		   	<div className={"sensuba-card-param-value" + (level !== 2 || eff ? " sensuba-card-invisible" : "") + (src.atk < src.originalAtk ? " sensuba-card-param-malus" : (src.atk > src.originalAtk ? " sensuba-card-param-bonus" : ""))}>{src.lv2.atk}</div>
		   	<div className={"sensuba-card-param-value" + (level !== 3 || eff ? " sensuba-card-invisible" : "") + (src.atk < src.originalAtk ? " sensuba-card-param-malus" : (src.atk > src.originalAtk ? " sensuba-card-param-bonus" : ""))}>{src.lvmax.atk}</div>
		</div>
		<div className={"sensuba-card-param sensuba-card-param-hp" + (src.hasOwnProperty('poisondmg') && src.poisondmg ? " sensuba-card-althp" : "")}>
		    <div className="sensuba-card-param-name">PV</div>
	   	    <div className={"sensuba-card-param-value" + (src.hasOwnProperty('chp') && src.chp < src.hp ? " sensuba-card-param-malus" : "") + (src.hasOwnProperty('chp') ? (src.chp < src.hp ? " sensuba-card-param-malus" : (src.hp > src.originalHp ? " sensuba-card-param-bonus" : "")) : "")}>{src.chp || src.hp}</div>
		</div>
		  {
		  	src.hasOwnProperty('poisondmg') && src.poisondmg ?
			<div className="sensuba-card-param sensuba-card-param-poison">
		    <div className="sensuba-card-param-name">PSN</div>
		      <div className="sensuba-card-param-value">{src.poisondmg}</div>
			</div> : <span/>
		  }
		<div className={"sensuba-card-range" + (level !== 1 && !eff ? " sensuba-card-invisible" : "") + (src.range < src.originalRange ? " sensuba-card-param-malus" : (src.range > src.originalRange ? " sensuba-card-param-bonus" : ""))}>
		  <div className="sensuba-card-range-arrow"/>
		  { src.range > 1 ? <div className="sensuba-card-range-arrow sensuba-card-range-arrow-2"/> : <span/> }
		  { src.range > 2 ? <div className="sensuba-card-range-arrow sensuba-card-range-arrow-3"/> : <span/> }
		</div>
		<div className={"sensuba-card-range" + (level !== 2 || eff ? " sensuba-card-invisible" : "") + (src.range < src.originalRange ? " sensuba-card-param-malus" : (src.range > src.originalRange ? " sensuba-card-param-bonus" : ""))}>
		  <div className="sensuba-card-range-arrow"/>
		  { src.lv2.range > 1 ? <div className="sensuba-card-range-arrow sensuba-card-range-arrow-2"/> : <span/> }
		  { src.lv2.range > 2 ? <div className="sensuba-card-range-arrow sensuba-card-range-arrow-3"/> : <span/> }
		</div>
		<div className={"sensuba-card-range" + (level !== 3 || eff ? " sensuba-card-invisible" : "") + (src.range < src.originalRange ? " sensuba-card-param-malus" : (src.range > src.originalRange ? " sensuba-card-param-bonus" : ""))}>
		  <div className="sensuba-card-range-arrow"/>
		  { src.lvmax.range > 1 ? <div className="sensuba-card-range-arrow sensuba-card-range-arrow-2"/> : <span/> }
		  { src.lvmax.range > 2 ? <div className="sensuba-card-range-arrow sensuba-card-range-arrow-3"/> : <span/> }
		</div>
	    { src.overload && src.overload > 0 ? <div className={"sensuba-card-overload" + (src.ol && src.ol > src.overload ? " sensuba-card-overload-limit-break" : "") + (level !== 1 && !eff ? " sensuba-card-invisible" : "")}>{src.overload}</div> : <span/> }
	    { src.lv2.overload && src.lv2.overload > 0 ? <div className={"sensuba-card-overload" + (src.ol && src.ol > src.lv2.overload ? " sensuba-card-overload-limit-break" : "") + (level !== 2 || eff ? " sensuba-card-invisible" : "")}>{src.lv2.overload}</div> : <span/> }
	    { src.lv2.overload && src.lvmax.overload > 0 ? <div className={"sensuba-card-overload" + (src.ol && src.ol > src.lvmax.overload ? " sensuba-card-overload-limit-break" : "") + (level !== 3 || eff ? " sensuba-card-invisible" : "")}>{src.lvmax.overload}</div> : <span/> }
	    <div className="sensuba-card-frame">
	    	<div className="sensuba-frame-icon"/>
	    	<div className="sensuba-card-inner-frame"/>
	    </div>
	    <div id={this.id + "-filter"} className="sensuba-card-filter"/>
	    </div>
	  </div>
    );
  }
}