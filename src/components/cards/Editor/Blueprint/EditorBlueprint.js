import React, { Component } from 'react';
import { Input } from 'reactstrap';
import './Blueprint.css';
import * as SRD from "storm-react-diagrams";
import Tray from './TrayWidget';
import Node from './NodeModel';
import NodeFactory from './NodeFactory';
import LinkFactory from './LinkFactory';
require("storm-react-diagrams/dist/style.min.css");

const blocks = [

	{ type: "state", name: "State", model: [ {inout: "in", type: "state", name: " "}, {inout: "out", type: "effect", name: " "}, {inout: "out", type: "mutation", name: "mutation"}, {inout: "out", type: "cardfilter", name: "filter"} ], color: "#ffe521" },
	{ type: "variation", name: "Variation", model: [ {inout: "in", type: "int", name: "mana"}, {inout: "in", type: "int", name: "atk"}, {inout: "in", type: "int", name: "hp"}, {inout: "in", type: "int", name: "range"}, {inout: "in", type: "int", name: "overload"}, {inout: "out", type: "mutation", name: "mutation"} ], color: "#ffe521" },
	
	{ type: "play", name: "Play", model: [ {inout: "out", type: "effect", name: " "}, {inout: "in", type: "tilefilter", name: "targetable"}, {inout: "out", type: "exe", name: " "}, {inout: "out", type: "card", name: "target"}, {inout: "out", type: "location", name: "target"} ], event: [ {inout: "out", type: "event", name: "event"}, {inout: "out", type: "card", name: "card"}, {inout: "out", type: "card", name: "target"}, {inout: "out", type: "location", name: "target"}, {inout: "out", type: "bool", name: "has target"} ], color: "#871212" },
	{ type: "action", name: "Action", model: [ {inout: "out", type: "effect", name: " "}, {inout: "in", type: "tilefilter", name: "targetable"}, {inout: "out", type: "exe", name: " "}, {inout: "out", type: "card", name: "target"}, {inout: "out", type: "location", name: "target"} ], color: "#871212" },
	{ type: "skill", name: "Skill", model: [ {inout: "out", type: "effect", name: " "}, {inout: "in", type: "tilefilter", name: "targetable"}, {inout: "in", type: "int", name: "cost"}, {inout: "out", type: "exe", name: " "}, {inout: "out", type: "card", name: "target"}, {inout: "out", type: "location", name: "target"} ], color: "#871212" },
	{ type: "lw", name: "Last will", model: [ {inout: "out", type: "effect", name: " "}, {inout: "out", type: "exe", name: " "} ], color: "#871212" },
	{ type: "frenzy", name: "Frenzy", model: [ {inout: "out", type: "effect", name: " "}, {inout: "out", type: "exe", name: " "}, {inout: "out", type: "card", name: "victim"} ], color: "#871212" },
	{ type: "contact", name: "Contact", model: [ {inout: "out", type: "effect", name: " "}, {inout: "out", type: "exe", name: " "}, {inout: "out", type: "card", name: "other"} ], color: "#871212" },
	{ type: "listener", name: "Listener", model: [ {inout: "in", type: "event", name: "event"}, {inout: "in", type: "bool", name: "on board"}, {inout: "out", type: "effect", name: " "}, {inout: "out", type: "exe", name: " "} ], color: "#871212" },
	{ type: "aura", name: "Aura", model: [ {inout: "in", type: "mutation", name: "mutation"}, {inout: "in", type: "locations", name: "area"}, {inout: "in", type: "cardfilter", name: "targets"}, {inout: "out", type: "effect", name: " "} ], color: "#871212" },
	{ type: "passivemut", name: "Passive mutation", model: [ {inout: "in", type: "mutation", name: "mutation"}, {inout: "out", type: "effect", name: " "} ], color: "#871212" },
	
	{ type: "draw", name: "Draw", model: [ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "int", name: "number"}, {inout: "in", type: "area", name: "player"}, {inout: "in", type: "cardfilter", name: "filter"}, {inout: "out", type: "exe", name: " "}, {inout: "out", type: "card", name: "card"} ], event: [ {inout: "out", type: "event", name: "event"}, {inout: "out", type: "card", name: "card"}, {inout: "out", type: "area", name: "player"} ], color: "#73BEC8" },
	{ type: "summon", name: "Summon", model: [ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "card", name: "entity"}, {inout: "in", type: "location", name: "tile"}, {inout: "out", type: "exe", name: " "} ], event: [ {inout: "out", type: "event", name: "event"}, {inout: "out", type: "card", name: "entity"}, {inout: "out", type: "location", name: "tile"} ], color: "#73BEC8" },
	{ type: "attack", name: "Attack", model: [ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "card", name: "character"}, {inout: "in", type: "card", name: "target"}, {inout: "out", type: "exe", name: " "} ], event: [ {inout: "out", type: "event", name: "event"}, {inout: "out", type: "card", name: "character"}, {inout: "out", type: "card", name: "target"} ], color: "#73BEC8" },
	{ type: "move", name: "Move", model: [ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "card", name: "card"}, {inout: "in", type: "location", name: "location"}, {inout: "out", type: "exe", name: " "} ], event: [ {inout: "out", type: "event", name: "event"}, {inout: "out", type: "card", name: "card"}, {inout: "out", type: "location", name: "location"} ], color: "#73BEC8" },
	{ type: "damage", name: "Damage", model: [ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "card", name: "entity"}, {inout: "in", type: "card", name: "source"}, {inout: "in", type: "int", name: "damage"}, {inout: "out", type: "exe", name: " "} ], event: [ {inout: "out", type: "event", name: "event"}, {inout: "out", type: "card", name: "entity"}, {inout: "out", type: "int", name: "damage"} ], color: "#73BEC8" },
	{ type: "heal", name: "Heal", model: [ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "card", name: "entity"}, {inout: "in", type: "card", name: "source"}, {inout: "in", type: "int", name: "heal"}, {inout: "out", type: "exe", name: " "} ], event: [ {inout: "out", type: "event", name: "event"}, {inout: "out", type: "card", name: "card"}, {inout: "out", type: "int", name: "heal"} ], color: "#73BEC8" },
	{ type: "boost", name: "Boost", model: [ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "card", name: "character"}, {inout: "in", type: "int", name: "atk"}, {inout: "in", type: "int", name: "hp"}, {inout: "in", type: "int", name: "range"}, {inout: "out", type: "exe", name: " "} ], event: [ {inout: "out", type: "event", name: "event"}, {inout: "out", type: "card", name: "card"}, {inout: "out", type: "int", name: "atk"}, {inout: "out", type: "int", name: "hp"}, {inout: "out", type: "int", name: "range"} ], color: "#73BEC8" },
	{ type: "set", name: "Set", model: [ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "card", name: "card"}, {inout: "in", type: "int", name: "cost"}, {inout: "in", type: "int", name: "atk"}, {inout: "in", type: "int", name: "hp"}, {inout: "in", type: "int", name: "range"}, {inout: "out", type: "exe", name: " "} ], event: [ {inout: "out", type: "event", name: "event"}, {inout: "out", type: "card", name: "card"}, {inout: "out", type: "int", name: "atk"}, {inout: "out", type: "int", name: "hp"}, {inout: "out", type: "int", name: "range"} ], color: "#73BEC8" },
	{ type: "silence", name: "Silence", model: [ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "card", name: "character"}, {inout: "out", type: "exe", name: " "} ], event: [ {inout: "out", type: "event", name: "event"}, {inout: "out", type: "card", name: "card"} ], color: "#73BEC8" },
	{ type: "destroy", name: "Destroy", model: [ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "card", name: "card"}, {inout: "out", type: "exe", name: " "} ], event: [ {inout: "out", type: "event", name: "event"}, {inout: "out", type: "card", name: "card"} ], color: "#73BEC8" },
	{ type: "transform", name: "Transform", model: [ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "card", name: "card"}, {inout: "in", type: "model", name: "model"}, {inout: "out", type: "exe", name: " "} ], event: [ {inout: "out", type: "event", name: "event"}, {inout: "out", type: "card", name: "card"} ], color: "#73BEC8" },
	{ type: "addshield", name: "Add shield", model: [ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "card", name: "character"}, {inout: "out", type: "exe", name: " "} ], event: [ {inout: "out", type: "event", name: "event"}, {inout: "out", type: "card", name: "character"} ], color: "#73BEC8" },
	{ type: "breakshield", name: "Break shield", model: [ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "card", name: "character"}, {inout: "out", type: "exe", name: " "} ], event: [ {inout: "out", type: "event", name: "event"}, {inout: "out", type: "card", name: "character"} ], color: "#73BEC8" },
	{ type: "freeze", name: "Freeze", model: [ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "card", name: "character"}, {inout: "out", type: "exe", name: " "} ], event: [ {inout: "out", type: "event", name: "event"}, {inout: "out", type: "card", name: "character"} ], color: "#73BEC8" },
	{ type: "overload", name: "Overload", model: [ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "card", name: "card"}, {inout: "in", type: "int", name: "overload"}, {inout: "out", type: "exe", name: " "} ], color: "#73BEC8" },
	{ type: "addpoints", name: "Add points", model: [ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "card", name: "entity"}, {inout: "in", type: "int", name: "action"}, {inout: "in", type: "int", name: "skill"}, {inout: "in", type: "int", name: "motion"}, {inout: "out", type: "exe", name: " "} ], color: "#73BEC8" },
	{ type: "levelup", name: "Level up", model: [ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "card", name: "hero"}, {inout: "out", type: "exe", name: " "} ], event: [ {inout: "out", type: "event", name: "event"}, {inout: "out", type: "card", name: "hero"}, {inout: "out", type: "int", name: "level"} ], color: "#73BEC8" },
	{ type: "addeffect", name: "Add effect", model: [ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "card", name: "character"}, {inout: "in", type: "effect", name: "effect"}, {inout: "out", type: "exe", name: " "} ], color: "#73BEC8" },
	{ type: "setstate", name: "Set state", model: [ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "card", name: "character"}, {inout: "in", type: "state", name: "state"}, {inout: "in", type: "bool", name: "value"}, {inout: "out", type: "exe", name: " "} ], color: "#73BEC8" },
	{ type: "generate", name: "Generate", model: [ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "model", name: "model"}, {inout: "in", type: "int", name: "count"}, {inout: "in", type: "location", name: "location"}, {inout: "out", type: "exe", name: " "}, {inout: "out", type: "card", name: "card"} ], event: [ {inout: "out", type: "event", name: "event"}, {inout: "out", type: "card", name: "card"}, {inout: "out", type: "location", name: "location"} ], color: "#73BEC8" },
	{ type: "createmana", name: "Refill mana", model: [ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "area", name: "player"}, {inout: "in", type: "int", name: "max"}, {inout: "out", type: "exe", name: " "} ], event: [ {inout: "out", type: "event", name: "event"}, {inout: "out", type: "area", name: "player"}, {inout: "out", type: "int", name: "mana"} ], color: "#73BEC8" },
	{ type: "usemana", name: "Use mana", model: [ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "area", name: "player"}, {inout: "in", type: "int", name: "mana"}, {inout: "out", type: "exe", name: " "} ], event: [ {inout: "out", type: "event", name: "event"}, {inout: "out", type: "area", name: "player"}, {inout: "out", type: "int", name: "mana"} ], color: "#73BEC8" },
	{ type: "createreceptacle", name: "Create receptacle", model: [ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "area", name: "player"}, {inout: "in", type: "int", name: "count"}, {inout: "out", type: "exe", name: " "} ], event: [ {inout: "out", type: "event", name: "event"}, {inout: "out", type: "area", name: "player"} ], color: "#73BEC8" },
	{ type: "destroyreceptacle", name: "Destroy receptacle", model: [ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "area", name: "player"}, {inout: "in", type: "int", name: "count"}, {inout: "out", type: "exe", name: " "} ], event: [ {inout: "out", type: "event", name: "event"}, {inout: "out", type: "area", name: "player"} ], color: "#73BEC8" },
	{ type: "creategem", name: "Create gem", model: [ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "area", name: "player"}, {inout: "in", type: "int", name: "count"}, {inout: "out", type: "exe", name: " "} ], event: [ {inout: "out", type: "event", name: "event"}, {inout: "out", type: "area", name: "player"} ], color: "#73BEC8" },
	{ type: "destroygem", name: "Destroy gem", model: [ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "area", name: "player"}, {inout: "in", type: "int", name: "count"}, {inout: "out", type: "exe", name: " "} ], event: [ {inout: "out", type: "event", name: "event"}, {inout: "out", type: "area", name: "player"} ], color: "#73BEC8" },
	{ type: "addmut", name: "Add mutation", model: [ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "card", name: "card"}, {inout: "in", type: "mutation", name: "mutation"}, {inout: "in", type: "event", name: "end"}, {inout: "out", type: "exe", name: " "} ], color: "#73BEC8" },
	{ type: "addaspect", name: "Add aspect", model: [ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "effect", name: "aspect"}, {inout: "in", type: "event", name: "end"}, {inout: "out", type: "exe", name: " "} ], color: "#73BEC8" },
	{ type: "trigger", name: "Trigger effect", model: [ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "effect", name: "effect"}, {inout: "in", type: "location", name: "target"}, {inout: "in", type: "card", name: "source"}, {inout: "out", type: "exe", name: " "} ], color: "#73BEC8" },
	{ type: "writeintvar", name: "Write int variable", model: [ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "string", name: "name"}, {inout: "in", type: "int", name: "value"}, {inout: "out", type: "exe", name: " "} ], color: "#73BEC8" },
	{ type: "writecardvar", name: "Write card variable", model: [ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "string", name: "name"}, {inout: "in", type: "card", name: "value"}, {inout: "out", type: "exe", name: " "} ], color: "#73BEC8" },
	{ type: "clearvar", name: "Clear variable", model: [ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "string", name: "name"}, {inout: "out", type: "exe", name: " "} ], color: "#73BEC8" },
	{ type: "customevent", name: "Custom event", model: [ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "string", name: "name"}, {inout: "out", type: "exe", name: " "} ], event: [ {inout: "in", type: "string", name: "name"}, {inout: "out", type: "event", name: "event"} ], color: "#73BEC8" },
	
	{ type: "canpay", name: "Can pay", model: [ {inout: "in", type: "area", name: "player"}, {inout: "in", type: "int", name: "mana"}, {inout: "out", type: "bool", name: "checked"} ], color: "#89BC62" },
	{ type: "cmpcards", name: "Compare cards", model: [ {inout: "in", type: "card", name: "card 1"}, {inout: "in", type: "card", name: "card 2"}, {inout: "out", type: "bool", name: "same card"}, {inout: "out", type: "bool", name: "same type"}, {inout: "out", type: "bool", name: "same player"} ], color: "#89BC62" },
	{ type: "cmplocations", name: "Compare locations", model: [ {inout: "in", type: "location", name: "location 1"}, {inout: "in", type: "location", name: "location 2"}, {inout: "out", type: "bool", name: "same location"}, {inout: "out", type: "bool", name: "same player"} ], color: "#89BC62" },
	{ type: "cmpplayers", name: "Compare players", model: [ {inout: "in", type: "area", name: "player 1"}, {inout: "in", type: "area", name: "player 2"}, {inout: "out", type: "bool", name: "same player"} ], color: "#89BC62" },
	{ type: "tiletotiles", name: "Tile to tiles", model: [ {inout: "in", type: "location", name: "tile"}, {inout: "out", type: "locations", name: "tiles"} ], color: "#89BC62" },
	{ type: "containstile", name: "Contains tile", model: [ {inout: "in", type: "locations", name: "area"}, {inout: "in", type: "location", name: "tile"}, {inout: "out", type: "bool", name: "contains"} ], color: "#89BC62" },
	{ type: "counttiles", name: "Count tiles", model: [ {inout: "in", type: "locations", name: "area"}, {inout: "in", type: "tilefilter", name: "filter"}, {inout: "out", type: "int", name: "count"} ], color: "#89BC62" },
	{ type: "mergeloc", name: "Merge locations", model: [ {inout: "in", type: "locations", name: "locations 1"}, {inout: "in", type: "locations", name: "locations 2"}, {inout: "out", type: "locations", name: "or"}, {inout: "out", type: "locations", name: "and"} ], color: "#89BC62" },
	{ type: "checkcard", name: "Check card", model: [ {inout: "in", type: "card", name: "card"}, {inout: "in", type: "cardfilter", name: "filter"}, {inout: "out", type: "bool", name: "checked"} ], color: "#89BC62" },
	{ type: "checktile", name: "Check tile", model: [ {inout: "in", type: "location", name: "tile"}, {inout: "in", type: "tilefilter", name: "filter"}, {inout: "out", type: "bool", name: "checked"} ], color: "#89BC62" },
	{ type: "checkeffect", name: "Check effect", model: [ {inout: "in", type: "effect", name: "effect"}, {inout: "in", type: "effecttype", name: "type"}, {inout: "out", type: "bool", name: "checked"} ], color: "#89BC62" },
	{ type: "filterstats", name: "Filter stats", model: [ {inout: "in", type: "int", name: "min cost"}, {inout: "in", type: "int", name: "max cost"}, {inout: "in", type: "int", name: "min atk"}, {inout: "in", type: "int", name: "max atk"}, {inout: "in", type: "int", name: "min hp"}, {inout: "in", type: "int", name: "max hp"}, {inout: "in", type: "int", name: "min range"}, {inout: "in", type: "int", name: "max range"}, {inout: "out", type: "cardfilter", name: "filter"} ], color: "#89BC62" },
	{ type: "mergecfilters", name: "Merge card filters", model: [ {inout: "in", type: "cardfilter", name: "filter 1"}, {inout: "in", type: "cardfilter", name: "filter 2"}, {inout: "out", type: "cardfilter", name: "or"}, {inout: "out", type: "cardfilter", name: "and"} ], color: "#89BC62" },
	{ type: "mergetfilters", name: "Merge tile filters", model: [ {inout: "in", type: "tilefilter", name: "filter 1"}, {inout: "in", type: "tilefilter", name: "filter 2"}, {inout: "out", type: "tilefilter", name: "or"}, {inout: "out", type: "tilefilter", name: "and"} ], color: "#89BC62" },
	{ type: "ctotfilter", name: "Card to tile filter", model: [ {inout: "in", type: "cardfilter", name: "contains"}, {inout: "out", type: "tilefilter", name: "filter"} ], color: "#89BC62" },
	{ type: "conditionmut", name: "Conditional mutation", model: [ {inout: "in", type: "mutation", name: "mutation"}, {inout: "in", type: "bool", name: "condition"}, {inout: "out", type: "mutation", name: "result"} ], color: "#89BC62" },
	
	{ type: "brkcard", name: "Break card", model: [ {inout: "in", type: "card", name: "card"}, {inout: "out", type: "model", name: "model"}, {inout: "out", type: "location", name: "location"}, {inout: "out", type: "area", name: "player"}, {inout: "out", type: "cardfilter", name: "type"}, {inout: "out", type: "int", name: "mana"}, {inout: "out", type: "int", name: "atk"}, {inout: "out", type: "int", name: "hp"}, {inout: "out", type: "int", name: "range"}, {inout: "out", type: "int", name: "overload"}, {inout: "out", type: "bool", name: "damaged"}, {inout: "out", type: "bool", name: "destroyed"} ], color: "#e59c3d" },
	{ type: "brkmodel", name: "Break model", model: [ {inout: "in", type: "model", name: "model"}, {inout: "out", type: "cardfilter", name: "type"}, {inout: "out", type: "int", name: "mana"}, {inout: "out", type: "int", name: "atk"}, {inout: "out", type: "int", name: "hp"}, {inout: "out", type: "int", name: "range"} ], color: "#e59c3d" },
	{ type: "brktile", name: "Break tile", model: [ {inout: "in", type: "location", name: "tile"}, {inout: "out", type: "locations", name: "field"}, {inout: "out", type: "area", name: "player"}, {inout: "out", type: "bool", name: "front"}, {inout: "out", type: "bool", name: "empty"}, {inout: "out", type: "card", name: "entity"}, {inout: "out", type: "locations", name: "neighbors"}, {inout: "out", type: "locations", name: "adjacents"}, {inout: "out", type: "locations", name: "line"} ], color: "#e59c3d" },
	{ type: "brklocation", name: "Break location", model: [ {inout: "in", type: "location", name: "location"}, {inout: "out", type: "area", name: "player"}, {inout: "out", type: "int", name: "count"}, {inout: "out", type: "bool", name: "empty"} ], color: "#e59c3d" },
	{ type: "brkplayer", name: "Break player", model: [ {inout: "in", type: "area", name: "player"}, {inout: "out", type: "locations", name: "field"}, {inout: "out", type: "location", name: "hand"}, {inout: "out", type: "location", name: "deck"}, {inout: "out", type: "area", name: "opponent"}, {inout: "out", type: "bool", name: "playing"} ], color: "#FFA126" },
	
	{ type: "archetype", name: "Archetype", model: [ {inout: "in", type: "string", name: "name"}, {inout: "out", type: "cardfilter", name: "filter"} ], color: "#670e6b" },
	{ type: "token", name: "Token", model: [ {inout: "in", type: "int", name: "no"}, {inout: "out", type: "model", name: "model"} ], color: "#670e6b" },
	{ type: "limitbrk", name: "Limit break", model: [ {inout: "out", type: "int", name: "bonus"} ], color: "#670e6b" },
	{ type: "manapool", name: "Mana pool", model: [ {inout: "in", type: "area", name: "player"}, {inout: "out", type: "int", name: "mana"}, {inout: "out", type: "int", name: "receptacles"}, {inout: "out", type: "int", name: "gems"} ], color: "#670e6b" },
	{ type: "intvar", name: "Int variable", model: [ {inout: "in", type: "string", name: "name"}, {inout: "out", type: "int", name: "value"}, {inout: "out", type: "bool", name: "exists"} ], color: "#670e6b" },
	{ type: "cardvar", name: "Card variable", model: [ {inout: "in", type: "string", name: "name"}, {inout: "out", type: "card", name: "value"}, {inout: "out", type: "bool", name: "exists"} ], color: "#670e6b" },
	
	{ type: "timestamp", name: "Timestamp", model: [ {inout: "in", type: "timestamp", name: "timestamp"}, {inout: "out", type: "event", name: "event"} ], color: "#212121" },
	{ type: "analyse", name: "Analyse", model: [ {inout: "in", type: "event", name: "event"}, {inout: "in", type: "period", name: "period"}, {inout: "in", type: "bool", name: "condition"}, {inout: "out", type: "bool", name: "happened"}, {inout: "out", type: "int", name: "count"} ], color: "#212121" },
	{ type: "findcard", name: "Find random card", model: [ {inout: "in", type: "location", name: "location"}, {inout: "in", type: "cardfilter", name: "filter"}, {inout: "out", type: "card", name: "result"}, {inout: "out", type: "bool", name: "found"} ], color: "#212121" },
	{ type: "randint", name: "Random int", model: [ {inout: "in", type: "int", name: "min"}, {inout: "in", type: "int", name: "max"}, {inout: "out", type: "int", name: "result"} ], color: "#212121" },
	{ type: "randbool", name: "Random bool", model: [ {inout: "out", type: "bool", name: "result"} ], color: "#212121" },
	
	{ type: "branch", name: "Branch", model: [ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "bool", name: "condition"}, {inout: "out", type: "exe", name: "true"}, {inout: "out", type: "exe", name: "false"} ], color: "#C0C0C0" },
	{ type: "loop", name: "Loop", model: [ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "int", name: "times"}, {inout: "in", type: "bool", name: "condition"}, {inout: "out", type: "exe", name: "completed"}, {inout: "out", type: "exe", name: "loop"}, {inout: "out", type: "int", name: "index"} ], color: "#C0C0C0" },
	{ type: "timer", name: "Timer", model: [ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "timestamp", name: "timestamp"}, {inout: "out", type: "exe", name: " "}, {inout: "out", type: "exe", name: "callback"} ], color: "#C0C0C0" },
	{ type: "watchdog", name: "Watchdog", model: [ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "event", name: "event"}, {inout: "in", type: "event", name: "end"}, {inout: "out", type: "exe", name: " "}, {inout: "out", type: "exe", name: "callback"} ], color: "#C0C0C0" },
	{ type: "aoe", name: "Area of effect", model: [ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "locations", name: "area"}, {inout: "in", type: "cardfilter", name: "targets"}, {inout: "out", type: "exe", name: "completed"}, {inout: "out", type: "exe", name: "for each"}, {inout: "out", type: "card", name: "card"} ], color: "#C0C0C0" },
	{ type: "fortile", name: "For each tile", model: [ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "locations", name: "area"}, {inout: "in", type: "tilefilter", name: "targets"}, {inout: "out", type: "exe", name: "completed"}, {inout: "out", type: "exe", name: "for each"}, {inout: "out", type: "location", name: "tile"} ], color: "#C0C0C0" },
	{ type: "foreffect", name: "For each effect", model: [ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "card", name: "card"}, {inout: "in", type: "effecttype", name: "type"}, {inout: "out", type: "exe", name: "completed"}, {inout: "out", type: "exe", name: "for each"}, {inout: "out", type: "effect", name: "effect"} ], color: "#C0C0C0" },
	
	{ type: "opplus", name: "+", model: [ {inout: "in", type: "int", name: " "}, {inout: "in", type: "int", name: " "}, {inout: "out", type: "int", name: " "} ], color: "#202020" },
	{ type: "opminus", name: "-", model: [ {inout: "in", type: "int", name: " "}, {inout: "in", type: "int", name: " "}, {inout: "out", type: "int", name: " "} ], color: "#202020" },
	{ type: "optimes", name: "x", model: [ {inout: "in", type: "int", name: " "}, {inout: "in", type: "int", name: " "}, {inout: "out", type: "int", name: " "} ], color: "#202020" },
	{ type: "opdiv", name: "/", model: [ {inout: "in", type: "int", name: " "}, {inout: "in", type: "int", name: " "}, {inout: "out", type: "int", name: " "} ], color: "#202020" },
	{ type: "opmod", name: "%", model: [ {inout: "in", type: "int", name: " "}, {inout: "in", type: "int", name: " "}, {inout: "out", type: "int", name: " "} ], color: "#202020" },
	{ type: "opter", name: "?", model: [ {inout: "in", type: "bool", name: " "}, {inout: "in", type: "int", name: "true"}, {inout: "in", type: "int", name: "false"}, {inout: "out", type: "int", name: " "} ], color: "#202020" },
	{ type: "opnot", name: "!", model: [ {inout: "in", type: "bool", name: " "}, {inout: "out", type: "bool", name: " "} ], color: "#202020" },
	{ type: "opand", name: "&", model: [ {inout: "in", type: "bool", name: " "}, {inout: "in", type: "bool", name: " "}, {inout: "out", type: "bool", name: " "} ], color: "#202020" },
	{ type: "opor", name: "|", model: [ {inout: "in", type: "bool", name: " "}, {inout: "in", type: "bool", name: " "}, {inout: "out", type: "bool", name: " "} ], color: "#202020" },
	{ type: "opxor", name: "⊕", model: [ {inout: "in", type: "bool", name: " "}, {inout: "in", type: "bool", name: " "}, {inout: "out", type: "bool", name: " "} ], color: "#202020" },
	{ type: "ope", name: "=", model: [ {inout: "in", type: "int", name: " "}, {inout: "in", type: "int", name: " "}, {inout: "out", type: "bool", name: " "} ], color: "#202020" },
	{ type: "opne", name: "!=", model: [ {inout: "in", type: "int", name: " "}, {inout: "in", type: "int", name: " "}, {inout: "out", type: "bool", name: " "} ], color: "#202020" },
	{ type: "opg", name: ">", model: [ {inout: "in", type: "int", name: " "}, {inout: "in", type: "int", name: " "}, {inout: "out", type: "bool", name: " "} ], color: "#202020" },
	{ type: "opl", name: "<", model: [ {inout: "in", type: "int", name: " "}, {inout: "in", type: "int", name: " "}, {inout: "out", type: "bool", name: " "} ], color: "#202020" },
	{ type: "opge", name: ">=", model: [ {inout: "in", type: "int", name: " "}, {inout: "in", type: "int", name: " "}, {inout: "out", type: "bool", name: " "} ], color: "#202020" },
	{ type: "ople", name: "<=", model: [ {inout: "in", type: "int", name: " "}, {inout: "in", type: "int", name: " "}, {inout: "out", type: "bool", name: " "} ], color: "#202020" }
]

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
		this.state = { model, filter: "" }
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
  				<div className="blueprint-nav-header">
  					<div className="blueprint-nav-title">Blocks</div>
  					<Input id="search-blueprint-block" type="text" onChange={() => this.setState({filter: document.getElementById("search-blueprint-block").value})} placeholder="search" className="blueprint-nav-search"/>
  				</div>
  				<div className="blueprint-nav-body">
  				{
  					blocks.filter(block => block.name.toLowerCase().includes(this.state.filter)).map(block => <Tray key={block.type} type={block.type} name={block.name} model={block.model} event={block.event} color={block.color}/>)
  				}
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