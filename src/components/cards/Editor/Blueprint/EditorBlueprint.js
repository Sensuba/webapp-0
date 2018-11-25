import React, { Component } from 'react';
import './Blueprint.css';
import * as SRD from "storm-react-diagrams";
import Tray from './TrayWidget';
import Node from './NodeModel';
import NodeFactory from './NodeFactory';
import LinkFactory from './LinkFactory';
require("storm-react-diagrams/dist/style.min.css");

export default class EditorBlueprint extends Component {

	constructor(props) {

		super(props);

		var engine = new SRD.DiagramEngine();
		engine.installDefaultFactories();
		engine.registerNodeFactory(new NodeFactory());
		engine.registerLinkFactory(new LinkFactory());

		var model = new SRD.DiagramModel();

		engine.setDiagramModel(model);

		var basisModel = [
			{inout: "in", type: "effect", name: " "},
			{inout: "in", type: "effect", name: " "},
			{inout: "in", type: "effect", name: " "},
			{inout: "in", type: "effect", name: " "},
			{inout: "in", type: "effect", name: " "} ];

		var node = new Node("basis", "Object", "#C0C0C0");
		node.remove = () => {};
		node.model = model;
		node.x = 650;
		node.y = 150;

		basisModel.forEach(inout => node.addInPort(inout.type, inout.name));
		model.addNode(node);
		node.forceUpdate = () => this.forceUpdate();

		this.engine = engine;
		this.state = { model }
	}

	blueprint () {

		var model = this.state.model;
		var bp = { basis: [], triggers: [], actions: [], parameters: [] };
		var bpd = { basis: null, triggers: [], actions: [], parameters: [] };
		Object.keys(model.nodes).forEach(key => {
			var node = model.nodes[key];
			if (node.nodeType === "basis") {
				bpd.basis = node;
				return;
			}
			var section = "parameters";
			var cc = false;
			var indexportsin = 0;
			var indexportsout = 0;
			Object.keys(node.ports).forEach((keyp, i) => {
				var port = node.ports[keyp];
				if (port.type !== "exe")
					port.index = port.in ? indexportsin++ : indexportsout++;
				if (cc) return;
				if (port.type === "exe") {
					if (port.in) {
						section = "actions";
						cc = true;
					} else section = "triggers";
				}
			});
			var index = bpd[section].length;
			node.section = section;
			bpd[section].push(node);
			bpd[section][index].index = index;
			bp[section].push({type: node.nodeType, in: []});
			Object.keys(node.ports).forEach(keyp => {
				var port = node.ports[keyp];
				if (port.in && port.type !== "exe") {
					bp[section][index].in.push(port.value || null);
				}
			});
		});
		Object.keys(model.links).forEach(key => {
			var link = model.links[key];
			if (!link.sourcePort || !link.targetPort)
				return;
			var source, target;
			var nodes = bpd["triggers"].concat(bpd["actions"]).concat(bpd["parameters"]);
			nodes.push(bpd.basis);
			nodes.forEach(node => {
				Object.keys(node.ports).forEach(keyp => {
					var port = node.ports[keyp];
					if (link.sourcePort.id === port.id || link.targetPort.id === port.id) {
						if (port.in)
							target = port;
						else {
							source = port;
							if (port.parent.nodeType === "play" && port.label === "target" && Object.keys(port.links).some(key => port.links[key].targetPort))
								bp[source.parent.section][source.parent.index].target = true;
						}
					}
				})
			});
			if (target.parent.nodeType === "basis")
				bp.basis.push({ type: source.parent.section, index: source.parent.index, out: source.index });
			else if (source.type === "exe")
				bp[source.parent.section][source.parent.index][source.label === " " ? "to" : source.label] = target.parent.index;
			else {
				var bpel = { type: source.parent.section, index: source.parent.index, out: source.index };
				bp[target.parent.section][target.parent.index].in[target.index] = bpel;
			}
		});
		return bp;
	}

	render () {

		return (
	    <div className={"blueprint-menu " + this.props.className}>
  			<div className="blueprint-nav">
  				<div className="blueprint-nav-header">Blocks</div>
  				<div className="blueprint-nav-body">
  					
  					<Tray type="state" name="State" model={[ {inout: "in", type: "state", name: " "}, {inout: "out", type: "effect", name: " "}, {inout: "out", type: "mutation", name: "mutation"}, {inout: "out", type: "cardfilter", name: "filter"} ]} color="#ffe521"/>
  					<Tray type="variation" name="Variation" model={[ {inout: "in", type: "int", name: "mana"}, {inout: "in", type: "int", name: "atk"}, {inout: "in", type: "int", name: "hp"}, {inout: "in", type: "int", name: "range"}, {inout: "in", type: "int", name: "overload"}, {inout: "out", type: "mutation", name: "mutation"} ]} color="#ffe521"/>
  					
  					<Tray type="play" name="Play" model={[ {inout: "out", type: "effect", name: " "}, {inout: "in", type: "tilefilter", name: "targetable"}, {inout: "out", type: "exe", name: " "}, {inout: "out", type: "card", name: "target"}, {inout: "out", type: "location", name: "target"} ]} event={[ {inout: "out", type: "event", name: "event"}, {inout: "out", type: "card", name: "card"}, {inout: "out", type: "card", name: "target"}, {inout: "out", type: "location", name: "target"}, {inout: "out", type: "bool", name: "has target"} ]} color="#871212"/>
  					<Tray type="action" name="Action" model={[ {inout: "out", type: "effect", name: " "}, {inout: "in", type: "tilefilter", name: "targetable"}, {inout: "out", type: "exe", name: " "}, {inout: "out", type: "card", name: "target"}, {inout: "out", type: "location", name: "target"} ]} color="#871212"/>
  					<Tray type="skill" name="Skill" model={[ {inout: "out", type: "effect", name: " "}, {inout: "in", type: "tilefilter", name: "targetable"}, {inout: "in", type: "int", name: "cost"}, {inout: "out", type: "exe", name: " "}, {inout: "out", type: "card", name: "target"}, {inout: "out", type: "location", name: "target"} ]} color="#871212"/>
  					<Tray type="lw" name="Last will" model={[ {inout: "out", type: "effect", name: " "}, {inout: "out", type: "exe", name: " "} ]} color="#871212"/>
  					<Tray type="frenzy" name="Frenzy" model={[ {inout: "out", type: "effect", name: " "}, {inout: "out", type: "exe", name: " "}, {inout: "out", type: "card", name: "victim"} ]} color="#871212"/>
  					<Tray type="contact" name="Contact" model={[ {inout: "out", type: "effect", name: " "}, {inout: "out", type: "exe", name: " "}, {inout: "out", type: "card", name: "other"} ]} color="#871212"/>
  					<Tray type="listener" name="Listener" model={[ {inout: "in", type: "event", name: "event"}, {inout: "in", type: "bool", name: "on board"}, {inout: "out", type: "effect", name: " "}, {inout: "out", type: "exe", name: " "} ]} color="#871212"/>
  					<Tray type="aura" name="Aura" model={[ {inout: "in", type: "mutation", name: "mutation"}, {inout: "in", type: "locations", name: "area"}, {inout: "in", type: "cardfilter", name: "targets"}, {inout: "out", type: "effect", name: " "} ]} color="#871212"/>
  					<Tray type="passivemut" name="Passive mutation" model={[ {inout: "in", type: "mutation", name: "mutation"}, {inout: "out", type: "effect", name: " "} ]} color="#871212"/>
  					
  					<Tray type="draw" name="Draw" model={[ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "int", name: "number"}, {inout: "in", type: "area", name: "player"}, {inout: "in", type: "cardfilter", name: "filter"}, {inout: "out", type: "exe", name: " "}, {inout: "out", type: "card", name: "card"} ]} event={[ {inout: "out", type: "event", name: "event"}, {inout: "out", type: "card", name: "card"}, {inout: "out", type: "area", name: "player"} ]} color="#73BEC8"/>
  					<Tray type="summon" name="Summon" model={[ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "card", name: "entity"}, {inout: "in", type: "location", name: "tile"}, {inout: "out", type: "exe", name: " "} ]} event={[ {inout: "out", type: "event", name: "event"}, {inout: "out", type: "card", name: "entity"}, {inout: "out", type: "location", name: "tile"} ]} color="#73BEC8"/>
  					<Tray type="move" name="Move" model={[ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "card", name: "card"}, {inout: "in", type: "location", name: "location"}, {inout: "out", type: "exe", name: " "} ]} event={[ {inout: "out", type: "event", name: "event"}, {inout: "out", type: "card", name: "card"}, {inout: "out", type: "location", name: "location"} ]} color="#73BEC8"/>
  					<Tray type="damage" name="Damage" model={[ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "card", name: "entity"}, {inout: "in", type: "card", name: "source"}, {inout: "in", type: "int", name: "damage"}, {inout: "out", type: "exe", name: " "} ]} event={[ {inout: "out", type: "event", name: "event"}, {inout: "out", type: "card", name: "entity"}, {inout: "out", type: "int", name: "damage"} ]} color="#73BEC8"/>
  					<Tray type="heal" name="Heal" model={[ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "card", name: "entity"}, {inout: "in", type: "card", name: "source"}, {inout: "in", type: "int", name: "heal"}, {inout: "out", type: "exe", name: " "} ]} event={[ {inout: "out", type: "event", name: "event"}, {inout: "out", type: "card", name: "card"}, {inout: "out", type: "int", name: "heal"} ]} color="#73BEC8"/>
  					<Tray type="boost" name="Boost" model={[ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "card", name: "character"}, {inout: "in", type: "int", name: "atk"}, {inout: "in", type: "int", name: "hp"}, {inout: "in", type: "int", name: "range"}, {inout: "out", type: "exe", name: " "} ]} event={[ {inout: "out", type: "event", name: "event"}, {inout: "out", type: "card", name: "card"}, {inout: "out", type: "int", name: "atk"}, {inout: "out", type: "int", name: "hp"}, {inout: "out", type: "int", name: "range"} ]} color="#73BEC8"/>
  					<Tray type="set" name="Set" model={[ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "card", name: "card"}, {inout: "in", type: "int", name: "cost"}, {inout: "in", type: "int", name: "atk"}, {inout: "in", type: "int", name: "hp"}, {inout: "in", type: "int", name: "range"}, {inout: "out", type: "exe", name: " "} ]} event={[ {inout: "out", type: "event", name: "event"}, {inout: "out", type: "card", name: "card"}, {inout: "out", type: "int", name: "atk"}, {inout: "out", type: "int", name: "hp"}, {inout: "out", type: "int", name: "range"} ]} color="#73BEC8"/>
  					<Tray type="silence" name="Silence" model={[ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "card", name: "character"}, {inout: "out", type: "exe", name: " "} ]} event={[ {inout: "out", type: "event", name: "event"}, {inout: "out", type: "card", name: "card"} ]} color="#73BEC8"/>
  					<Tray type="destroy" name="Destroy" model={[ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "card", name: "card"}, {inout: "out", type: "exe", name: " "} ]} event={[ {inout: "out", type: "event", name: "event"}, {inout: "out", type: "card", name: "card"} ]} color="#73BEC8"/>
  					<Tray type="transform" name="Transform" model={[ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "card", name: "card"}, {inout: "in", type: "model", name: "model"}, {inout: "out", type: "exe", name: " "} ]} event={[ {inout: "out", type: "event", name: "event"}, {inout: "out", type: "card", name: "card"} ]} color="#73BEC8"/>
  					<Tray type="addshield" name="Add shield" model={[ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "card", name: "character"}, {inout: "out", type: "exe", name: " "} ]} event={[ {inout: "out", type: "event", name: "event"}, {inout: "out", type: "card", name: "character"} ]} color="#73BEC8"/>
  					<Tray type="breakshield" name="Break shield" model={[ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "card", name: "character"}, {inout: "out", type: "exe", name: " "} ]} event={[ {inout: "out", type: "event", name: "event"}, {inout: "out", type: "card", name: "character"} ]} color="#73BEC8"/>
  					<Tray type="freeze" name="Freeze" model={[ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "card", name: "character"}, {inout: "out", type: "exe", name: " "} ]} event={[ {inout: "out", type: "event", name: "event"}, {inout: "out", type: "card", name: "character"} ]} color="#73BEC8"/>
  					<Tray type="overload" name="Overload" model={[ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "card", name: "card"}, {inout: "in", type: "int", name: "overload"}, {inout: "out", type: "exe", name: " "} ]} color="#73BEC8"/>
  					<Tray type="levelup" name="Level up" model={[ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "card", name: "hero"}, {inout: "out", type: "exe", name: " "} ]} event={[ {inout: "out", type: "event", name: "event"}, {inout: "out", type: "card", name: "hero"}, {inout: "out", type: "int", name: "level"} ]} color="#73BEC8"/>
  					<Tray type="addeffect" name="Add effect" model={[ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "card", name: "character"}, {inout: "in", type: "effect", name: "effect"}, {inout: "out", type: "exe", name: " "} ]} color="#73BEC8"/>
  					<Tray type="setstate" name="Set state" model={[ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "card", name: "character"}, {inout: "in", type: "state", name: "state"}, {inout: "in", type: "bool", name: "value"}, {inout: "out", type: "exe", name: " "} ]} color="#73BEC8"/>
  					<Tray type="generate" name="Generate" model={[ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "model", name: "model"}, {inout: "in", type: "int", name: "count"}, {inout: "in", type: "location", name: "location"}, {inout: "out", type: "exe", name: " "}, {inout: "out", type: "card", name: "card"} ]} event={[ {inout: "out", type: "event", name: "event"}, {inout: "out", type: "card", name: "card"}, {inout: "out", type: "location", name: "location"} ]} color="#73BEC8"/>
  					<Tray type="createmana" name="Refill mana" model={[ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "area", name: "player"}, {inout: "in", type: "int", name: "max"}, {inout: "out", type: "exe", name: " "} ]} event={[ {inout: "out", type: "event", name: "event"}, {inout: "out", type: "area", name: "player"}, {inout: "out", type: "int", name: "mana"} ]} color="#73BEC8"/>
  					<Tray type="usemana" name="Use mana" model={[ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "area", name: "player"}, {inout: "in", type: "int", name: "mana"}, {inout: "out", type: "exe", name: " "} ]} event={[ {inout: "out", type: "event", name: "event"}, {inout: "out", type: "area", name: "player"}, {inout: "out", type: "int", name: "mana"} ]} color="#73BEC8"/>
  					<Tray type="createreceptacle" name="Create receptacle" model={[ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "area", name: "player"}, {inout: "in", type: "int", name: "count"}, {inout: "out", type: "exe", name: " "} ]} event={[ {inout: "out", type: "event", name: "event"}, {inout: "out", type: "area", name: "player"} ]} color="#73BEC8"/>
  					<Tray type="destroyreceptacle" name="Destroy receptacle" model={[ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "area", name: "player"}, {inout: "in", type: "int", name: "count"}, {inout: "out", type: "exe", name: " "} ]} event={[ {inout: "out", type: "event", name: "event"}, {inout: "out", type: "area", name: "player"} ]} color="#73BEC8"/>
  					<Tray type="creategem" name="Create gem" model={[ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "area", name: "player"}, {inout: "in", type: "int", name: "count"}, {inout: "out", type: "exe", name: " "} ]} event={[ {inout: "out", type: "event", name: "event"}, {inout: "out", type: "area", name: "player"} ]} color="#73BEC8"/>
  					<Tray type="destroygem" name="Destroy gem" model={[ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "area", name: "player"}, {inout: "in", type: "int", name: "count"}, {inout: "out", type: "exe", name: " "} ]} event={[ {inout: "out", type: "event", name: "event"}, {inout: "out", type: "area", name: "player"} ]} color="#73BEC8"/>
  					<Tray type="addmut" name="Add mutation" model={[ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "card", name: "card"}, {inout: "in", type: "mutation", name: "mutation"}, {inout: "in", type: "event", name: "end"}, {inout: "out", type: "exe", name: " "} ]} color="#73BEC8"/>
  					<Tray type="addaspect" name="Add aspect" model={[ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "effect", name: "aspect"}, {inout: "in", type: "event", name: "end"}, {inout: "out", type: "exe", name: " "} ]} color="#73BEC8"/>
  					<Tray type="trigger" name="Trigger effect" model={[ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "effect", name: "effect"}, {inout: "in", type: "location", name: "target"}, {inout: "in", type: "card", name: "source"}, {inout: "out", type: "exe", name: " "} ]} color="#73BEC8"/>
  					<Tray type="writeintvar" name="Write int variable" model={[ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "string", name: "name"}, {inout: "in", type: "int", name: "value"}, {inout: "out", type: "exe", name: " "} ]} color="#73BEC8"/>
  					<Tray type="writecardvar" name="Write card variable" model={[ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "string", name: "name"}, {inout: "in", type: "card", name: "value"}, {inout: "out", type: "exe", name: " "} ]} color="#73BEC8"/>
  					<Tray type="clearvar" name="Clear variable" model={[ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "string", name: "name"}, {inout: "out", type: "exe", name: " "} ]} color="#73BEC8"/>
  					<Tray type="customevent" name="Custom event" model={[ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "string", name: "name"}, {inout: "out", type: "exe", name: " "} ]} event={[ {inout: "in", type: "string", name: "name"}, {inout: "out", type: "event", name: "event"} ]} color="#73BEC8"/>
  					
  					<Tray type="canpay" name="Can pay" model={[ {inout: "in", type: "area", name: "player"}, {inout: "in", type: "int", name: "mana"}, {inout: "out", type: "bool", name: "checked"} ]} color="#89BC62"/>
  					<Tray type="cmpcards" name="Compare cards" model={[ {inout: "in", type: "card", name: "card 1"}, {inout: "in", type: "card", name: "card 2"}, {inout: "out", type: "bool", name: "same card"}, {inout: "out", type: "bool", name: "same type"}, {inout: "out", type: "bool", name: "same player"} ]} color="#89BC62"/>
  					<Tray type="cmplocations" name="Compare locations" model={[ {inout: "in", type: "location", name: "location 1"}, {inout: "in", type: "location", name: "location 2"}, {inout: "out", type: "bool", name: "same location"}, {inout: "out", type: "bool", name: "same player"} ]} color="#89BC62"/>
  					<Tray type="cmpplayers" name="Compare players" model={[ {inout: "in", type: "area", name: "player 1"}, {inout: "in", type: "area", name: "player 2"}, {inout: "out", type: "bool", name: "same player"} ]} color="#89BC62"/>
  					<Tray type="tiletotiles" name="Tile to tiles" model={[ {inout: "in", type: "location", name: "tile"}, {inout: "out", type: "locations", name: "tiles"} ]} color="#89BC62"/>
  					<Tray type="containstile" name="Contains tile" model={[ {inout: "in", type: "locations", name: "area"}, {inout: "in", type: "location", name: "tile"}, {inout: "out", type: "bool", name: "contains"} ]} color="#89BC62"/>
  					<Tray type="mergeloc" name="Merge locations" model={[ {inout: "in", type: "locations", name: "locations 1"}, {inout: "in", type: "locations", name: "locations 2"}, {inout: "out", type: "locations", name: "or"}, {inout: "out", type: "locations", name: "and"} ]} color="#89BC62"/>
  					<Tray type="checkcard" name="Check card" model={[ {inout: "in", type: "card", name: "card"}, {inout: "in", type: "cardfilter", name: "filter"}, {inout: "out", type: "bool", name: "checked"} ]} color="#89BC62"/>
  					<Tray type="checktile" name="Check tile" model={[ {inout: "in", type: "location", name: "tile"}, {inout: "in", type: "tilefilter", name: "filter"}, {inout: "out", type: "bool", name: "checked"} ]} color="#89BC62"/>
  					<Tray type="checkeffect" name="Check effect" model={[ {inout: "in", type: "effect", name: "effect"}, {inout: "in", type: "effecttype", name: "type"}, {inout: "out", type: "bool", name: "checked"} ]} color="#89BC62"/>
  					<Tray type="filterstats" name="Filter stats" model={[ {inout: "in", type: "int", name: "min cost"}, {inout: "in", type: "int", name: "max cost"}, {inout: "in", type: "int", name: "min atk"}, {inout: "in", type: "int", name: "max atk"}, {inout: "in", type: "int", name: "min hp"}, {inout: "in", type: "int", name: "max hp"}, {inout: "in", type: "int", name: "min range"}, {inout: "in", type: "int", name: "max range"}, {inout: "out", type: "cardfilter", name: "filter"} ]} color="#89BC62"/>
  					<Tray type="mergecfilters" name="Merge card filters" model={[ {inout: "in", type: "cardfilter", name: "filter 1"}, {inout: "in", type: "cardfilter", name: "filter 2"}, {inout: "out", type: "cardfilter", name: "or"}, {inout: "out", type: "cardfilter", name: "and"} ]} color="#89BC62"/>
  					<Tray type="mergetfilters" name="Merge tile filters" model={[ {inout: "in", type: "tilefilter", name: "filter 1"}, {inout: "in", type: "tilefilter", name: "filter 2"}, {inout: "out", type: "tilefilter", name: "or"}, {inout: "out", type: "tilefilter", name: "and"} ]} color="#89BC62"/>
  					<Tray type="ctotfilter" name="Card to tile filter" model={[ {inout: "in", type: "cardfilter", name: "contains"}, {inout: "out", type: "tilefilter", name: "filter"} ]} color="#89BC62"/>
  					<Tray type="conditionmut" name="Conditional mutation" model={[ {inout: "in", type: "mutation", name: "mutation"}, {inout: "in", type: "cardfilter", name: "filter"}, {inout: "out", type: "mutation", name: "result"} ]} color="#89BC62"/>
  					
  					<Tray type="brkcard" name="Break card" model={[ {inout: "in", type: "card", name: "card"}, {inout: "out", type: "model", name: "model"}, {inout: "out", type: "location", name: "location"}, {inout: "out", type: "area", name: "player"}, {inout: "out", type: "cardfilter", name: "type"}, {inout: "out", type: "int", name: "mana"}, {inout: "out", type: "int", name: "atk"}, {inout: "out", type: "int", name: "hp"}, {inout: "out", type: "int", name: "range"}, {inout: "out", type: "int", name: "overload"}, {inout: "out", type: "bool", name: "damaged"}, {inout: "out", type: "bool", name: "destroyed"} ]} color="#e59c3d"/>
  					<Tray type="brkmodel" name="Break model" model={[ {inout: "in", type: "model", name: "model"}, {inout: "out", type: "cardfilter", name: "type"}, {inout: "out", type: "int", name: "mana"}, {inout: "out", type: "int", name: "atk"}, {inout: "out", type: "int", name: "hp"}, {inout: "out", type: "int", name: "range"} ]} color="#e59c3d"/>
  					<Tray type="brktile" name="Break tile" model={[ {inout: "in", type: "location", name: "tile"}, {inout: "out", type: "locations", name: "field"}, {inout: "out", type: "area", name: "player"}, {inout: "out", type: "bool", name: "front"}, {inout: "out", type: "bool", name: "empty"}, {inout: "out", type: "card", name: "entity"}, {inout: "out", type: "locations", name: "neighbors"}, {inout: "out", type: "locations", name: "adjacents"}, {inout: "out", type: "locations", name: "line"} ]} color="#e59c3d"/>
  					<Tray type="brklocation" name="Break location" model={[ {inout: "in", type: "location", name: "location"}, {inout: "out", type: "area", name: "player"}, {inout: "out", type: "int", name: "count"}, {inout: "out", type: "bool", name: "empty"} ]} color="#e59c3d"/>
  					<Tray type="brkplayer" name="Break player" model={[ {inout: "in", type: "area", name: "player"}, {inout: "out", type: "locations", name: "field"}, {inout: "out", type: "location", name: "hand"}, {inout: "out", type: "location", name: "deck"}, {inout: "out", type: "area", name: "opponent"}, {inout: "out", type: "bool", name: "playing"} ]} color="#FFA126"/>
  					
  					<Tray type="archetype" name="Archetype" model={[ {inout: "in", type: "string", name: "name"}, {inout: "out", type: "cardfilter", name: "filter"} ]} color="#670e6b"/>
  					<Tray type="token" name="Token" model={[ {inout: "in", type: "int", name: "no"}, {inout: "out", type: "model", name: "model"} ]} color="#670e6b"/>
  					<Tray type="limitbrk" name="Limit break" model={[ {inout: "out", type: "int", name: "bonus"} ]} color="#670e6b"/>
  					<Tray type="manapool" name="Mana pool" model={[ {inout: "in", type: "area", name: "player"}, {inout: "out", type: "int", name: "mana"}, {inout: "out", type: "int", name: "receptacles"}, {inout: "out", type: "int", name: "gems"} ]} color="#670e6b"/>
  					<Tray type="intvar" name="Int variable" model={[ {inout: "in", type: "string", name: "name"}, {inout: "out", type: "int", name: "value"}, {inout: "out", type: "bool", name: "exists"} ]} color="#670e6b"/>
  					<Tray type="cardvar" name="Card variable" model={[ {inout: "in", type: "string", name: "name"}, {inout: "out", type: "card", name: "value"}, {inout: "out", type: "bool", name: "exists"} ]} color="#670e6b"/>
  					
  					<Tray type="timestamp" name="Timestamp" model={[ {inout: "in", type: "timestamp", name: "timestamp"}, {inout: "out", type: "event", name: "event"} ]} color="#212121"/>
  					<Tray type="analyse" name="Analyse" model={[ {inout: "in", type: "event", name: "event"}, {inout: "in", type: "period", name: "period"}, {inout: "in", type: "bool", name: "condition"}, {inout: "out", type: "bool", name: "happened"}, {inout: "out", type: "int", name: "count"} ]} color="#212121"/>
  					<Tray type="findcard" name="Find random card" model={[ {inout: "in", type: "location", name: "location"}, {inout: "in", type: "cardfilter", name: "filter"}, {inout: "out", type: "card", name: "result"}, {inout: "out", type: "bool", name: "found"} ]} color="#212121"/>
  					<Tray type="randint" name="Random int" model={[ {inout: "in", type: "int", name: "min"}, {inout: "in", type: "int", name: "max"}, {inout: "out", type: "int", name: "result"} ]} color="#212121"/>
  					<Tray type="randbool" name="Random bool" model={[ {inout: "out", type: "bool", name: "result"} ]} color="#212121"/>
  					
  					<Tray type="branch" name="Branch" model={[ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "bool", name: "condition"}, {inout: "out", type: "exe", name: "true"}, {inout: "out", type: "exe", name: "false"} ]} color="#C0C0C0"/>
  					<Tray type="loop" name="Loop" model={[ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "int", name: "times"}, {inout: "in", type: "bool", name: "condition"}, {inout: "out", type: "exe", name: "completed"}, {inout: "out", type: "exe", name: "loop"}, {inout: "out", type: "int", name: "index"} ]} color="#C0C0C0"/>
  					<Tray type="timer" name="Timer" model={[ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "timestamp", name: "timestamp"}, {inout: "out", type: "exe", name: " "}, {inout: "out", type: "exe", name: "callback"} ]} color="#C0C0C0"/>
  					<Tray type="watchdog" name="Watchdog" model={[ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "event", name: "event"}, {inout: "in", type: "event", name: "end"}, {inout: "out", type: "exe", name: " "}, {inout: "out", type: "exe", name: "callback"} ]} color="#C0C0C0"/>
  					<Tray type="aoe" name="Area of effect" model={[ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "locations", name: "area"}, {inout: "in", type: "cardfilter", name: "targets"}, {inout: "out", type: "exe", name: "completed"}, {inout: "out", type: "exe", name: "for each"}, {inout: "out", type: "card", name: "card"} ]} color="#C0C0C0"/>
  					<Tray type="fortile" name="For each tile" model={[ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "locations", name: "area"}, {inout: "in", type: "tilefilter", name: "targets"}, {inout: "out", type: "exe", name: "completed"}, {inout: "out", type: "exe", name: "for each"}, {inout: "out", type: "location", name: "tile"} ]} color="#C0C0C0"/>
  					<Tray type="foreffect" name="For each effect" model={[ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "card", name: "card"}, {inout: "in", type: "effecttype", name: "type"}, {inout: "out", type: "exe", name: "completed"}, {inout: "out", type: "exe", name: "for each"}, {inout: "out", type: "effect", name: "effect"} ]} color="#C0C0C0"/>
  					
  					<Tray type="opplus" name="+" model={[ {inout: "in", type: "int", name: " "}, {inout: "in", type: "int", name: " "}, {inout: "out", type: "int", name: " "} ]} color="#202020"/>
  					<Tray type="opminus" name="-" model={[ {inout: "in", type: "int", name: " "}, {inout: "in", type: "int", name: " "}, {inout: "out", type: "int", name: " "} ]} color="#202020"/>
  					<Tray type="optimes" name="x" model={[ {inout: "in", type: "int", name: " "}, {inout: "in", type: "int", name: " "}, {inout: "out", type: "int", name: " "} ]} color="#202020"/>
  					<Tray type="opdiv" name="/" model={[ {inout: "in", type: "int", name: " "}, {inout: "in", type: "int", name: " "}, {inout: "out", type: "int", name: " "} ]} color="#202020"/>
  					<Tray type="opmod" name="%" model={[ {inout: "in", type: "int", name: " "}, {inout: "in", type: "int", name: " "}, {inout: "out", type: "int", name: " "} ]} color="#202020"/>
  					<Tray type="opter" name="?" model={[ {inout: "in", type: "bool", name: " "}, {inout: "in", type: "int", name: "true"}, {inout: "in", type: "int", name: "false"}, {inout: "out", type: "int", name: " "} ]} color="#202020"/>
					<Tray type="opnot" name="!" model={[ {inout: "in", type: "bool", name: " "}, {inout: "out", type: "bool", name: " "} ]} color="#202020"/>
  					<Tray type="opand" name="&" model={[ {inout: "in", type: "bool", name: " "}, {inout: "in", type: "bool", name: " "}, {inout: "out", type: "bool", name: " "} ]} color="#202020"/>
  					<Tray type="opor" name="|" model={[ {inout: "in", type: "bool", name: " "}, {inout: "in", type: "bool", name: " "}, {inout: "out", type: "bool", name: " "} ]} color="#202020"/>
  					<Tray type="opxor" name="⊕" model={[ {inout: "in", type: "bool", name: " "}, {inout: "in", type: "bool", name: " "}, {inout: "out", type: "bool", name: " "} ]} color="#202020"/>
  					<Tray type="ope" name="=" model={[ {inout: "in", type: "int", name: " "}, {inout: "in", type: "int", name: " "}, {inout: "out", type: "bool", name: " "} ]} color="#202020"/>
  					<Tray type="opne" name="!=" model={[ {inout: "in", type: "int", name: " "}, {inout: "in", type: "int", name: " "}, {inout: "out", type: "bool", name: " "} ]} color="#202020"/>
  					<Tray type="opg" name=">" model={[ {inout: "in", type: "int", name: " "}, {inout: "in", type: "int", name: " "}, {inout: "out", type: "bool", name: " "} ]} color="#202020"/>
  					<Tray type="opl" name="<" model={[ {inout: "in", type: "int", name: " "}, {inout: "in", type: "int", name: " "}, {inout: "out", type: "bool", name: " "} ]} color="#202020"/>
  					<Tray type="opge" name=">=" model={[ {inout: "in", type: "int", name: " "}, {inout: "in", type: "int", name: " "}, {inout: "out", type: "bool", name: " "} ]} color="#202020"/>
  					<Tray type="ople" name="<=" model={[ {inout: "in", type: "int", name: " "}, {inout: "in", type: "int", name: " "}, {inout: "out", type: "bool", name: " "} ]} color="#202020"/>
  				</div>
  			</div>
  			<div className="blueprint-schema"
  				onDrop={event => {
  					try {
						var data = JSON.parse(event.dataTransfer.getData("storm-diagram-node"));
						/*var nodesCount = Object.keys(
							this.state.model.getNodes()
						).length;*/

						var node = new Node(data.type, data.name, data.color);
						node.model = data.model;
						node.event = data.event;
						var points = this.engine.getRelativeMousePoint(event);
						node.x = points.x;
						node.y = points.y;

						node.setStateEvent(false);
						this.state.model.addNode(node);
						node.forceUpdate = () => this.forceUpdate();
						
						this.forceUpdate();
					} catch (e) {}
				}}
				onDragOver={event => {
					event.preventDefault();
				}}
				>
  				<SRD.DiagramWidget diagramEngine={this.engine} />
  			</div>
  			<div onClick={() => this.props.save(this.blueprint())} className="blueprint-save">Save</div>
      	</div>
      	);
	}
}