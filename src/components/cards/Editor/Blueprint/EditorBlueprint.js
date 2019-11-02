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

	{ type: "state", name: "State", model: [ {inout: "in", type: "state", name: " "}, {inout: "out", type: "effect", name: " "}, {inout: "out", type: "mutation", name: "mutation"}, {inout: "out", type: "cardfilter", name: "filter"} ], tooltip: "Use a state as an effect or a mutation", color: "#ffe521" },
	{ type: "variation", name: "Variation", model: [ {inout: "in", type: "int", name: "mana"}, {inout: "in", type: "int", name: "atk"}, {inout: "in", type: "int", name: "hp"}, {inout: "in", type: "int", name: "range"}, {inout: "in", type: "int", name: "overload"}, {inout: "out", type: "mutation", name: "mutation"} ], tooltip: "Use statistics variations as a mutation", color: "#ffe521" },
	
	{ type: "play", name: "Play", model: [ {inout: "out", type: "effect", name: " "}, {inout: "in", type: "tilefilter", name: "targetable"}, {inout: "out", type: "exe", name: " "}, {inout: "out", type: "card", name: "target"}, {inout: "out", type: "location", name: "target"} ], event: [ {inout: "in", type: "data", name: "data"}, {inout: "out", type: "card", name: "card"}, {inout: "out", type: "card", name: "target"}, {inout: "out", type: "location", name: "target"}, {inout: "out", type: "bool", name: "has target"} ], tooltip: "Call a script whenever the card is played, with an optional target", color: "#871212" },
	{ type: "action", name: "Action", model: [ {inout: "out", type: "effect", name: " "}, {inout: "in", type: "tilefilter", name: "targetable"}, {inout: "in", type: "string", name: "text"}, {inout: "out", type: "exe", name: " "}, {inout: "out", type: "card", name: "target"}, {inout: "out", type: "location", name: "target"} ], tooltip: "An action using an action point, with an optional target", color: "#871212" },
	{ type: "skill", name: "Skill", model: [ {inout: "out", type: "effect", name: " "}, {inout: "in", type: "tilefilter", name: "targetable"}, {inout: "in", type: "string", name: "text"}, {inout: "in", type: "int", name: "cost"}, {inout: "out", type: "exe", name: " "}, {inout: "out", type: "card", name: "target"}, {inout: "out", type: "location", name: "target"} ], tooltip: "A skill using mana and a skill point, with an optional target", color: "#871212" },
	{ type: "lw", name: "Last will", model: [ {inout: "out", type: "effect", name: " "}, {inout: "out", type: "exe", name: " "} ], tooltip: "Call a script whenever the entity is destroyed", color: "#871212" },
	{ type: "frenzy", name: "Frenzy", model: [ {inout: "out", type: "effect", name: " "}, {inout: "out", type: "exe", name: " "}, {inout: "out", type: "card", name: "victim"} ], tooltip: "Call a script whenever the character destroy another on contact", color: "#871212" },
	{ type: "contact", name: "Contact", model: [ {inout: "out", type: "effect", name: " "}, {inout: "out", type: "exe", name: " "}, {inout: "out", type: "card", name: "other"} ], tooltip: "Call a script whenever the entity makes contact with another", color: "#871212" },
	{ type: "listener", name: "Listener", model: [ {inout: "in", type: "event", name: "event"}, {inout: "in", type: "bool", name: "on board"}, {inout: "out", type: "effect", name: " "}, {inout: "out", type: "exe", name: " "}, {inout: "out", type: "data", name: "data"} ], tooltip: "Call a script whenever a specific event is handled", color: "#871212" },
	{ type: "aura", name: "Aura", model: [ {inout: "in", type: "mutation", name: "mutation"}, {inout: "in", type: "locations", name: "area"}, {inout: "in", type: "cardfilter", name: "targets"}, {inout: "out", type: "effect", name: " "} ], tooltip: "Inflict a mutation to cards in an area", color: "#871212" },
	{ type: "passivemut", name: "Passive mutation", model: [ {inout: "in", type: "mutation", name: "mutation"}, {inout: "out", type: "effect", name: " "} ], tooltip: "Use a mutation as a passive effect", color: "#871212" },
	{ type: "contactmut", name: "Contact mutation", model: [ {inout: "in", type: "mutation", name: "mutation"}, {inout: "in", type: "cardfilter", name: "against"}, {inout: "out", type: "effect", name: " "} ], tooltip: "Get a mutation when fighting specific entities", color: "#871212" },
	{ type: "trap", name: "Trap", model: [ {inout: "out", type: "effect", name: " "}, {inout: "out", type: "exe", name: " "} ], tooltip: "Call a script when drawn", color: "#871212" },
	
	{ type: "draw", name: "Draw", model: [ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "int", name: "number"}, {inout: "in", type: "area", name: "player"}, {inout: "in", type: "cardfilter", name: "filter"}, {inout: "out", type: "exe", name: " "}, {inout: "out", type: "card", name: "card"} ], event: [ {inout: "in", type: "data", name: "data"}, {inout: "out", type: "card", name: "card"}, {inout: "out", type: "area", name: "player"} ], tooltip: "Make a player draw cards", color: "#73BEC8" },
	{ type: "summon", name: "Summon", model: [ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "card", name: "entity"}, {inout: "in", type: "location", name: "tile"}, {inout: "out", type: "exe", name: " "} ], event: [ {inout: "in", type: "data", name: "data"}, {inout: "out", type: "card", name: "entity"}, {inout: "out", type: "location", name: "tile"} ], tooltip: "Summon an entity on a given tile", color: "#73BEC8" },
	{ type: "attack", name: "Attack", model: [ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "card", name: "character"}, {inout: "in", type: "card", name: "target"}, {inout: "out", type: "exe", name: " "} ], event: [ {inout: "in", type: "data", name: "data"}, {inout: "out", type: "card", name: "character"}, {inout: "out", type: "card", name: "target"} ], tooltip: "Force a character to attack a target", color: "#73BEC8" },
	{ type: "move", name: "Move", model: [ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "card", name: "card"}, {inout: "in", type: "location", name: "location"}, {inout: "out", type: "exe", name: " "} ], event: [ {inout: "in", type: "data", name: "data"}, {inout: "out", type: "card", name: "card"}, {inout: "out", type: "location", name: "from"}, {inout: "out", type: "location", name: "to"} ], tooltip: "Move a card to a given location", color: "#73BEC8" },
	{ type: "damage", name: "Damage", model: [ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "card", name: "entity"}, {inout: "in", type: "card", name: "source"}, {inout: "in", type: "int", name: "damage"}, {inout: "out", type: "exe", name: " "} ], event: [ {inout: "in", type: "data", name: "data"}, {inout: "out", type: "card", name: "entity"}, {inout: "out", type: "card", name: "source"}, {inout: "out", type: "int", name: "damage"} ], tooltip: "Deal a certain amount of damage to an entity", color: "#73BEC8" },
	{ type: "heal", name: "Heal", model: [ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "card", name: "entity"}, {inout: "in", type: "card", name: "source"}, {inout: "in", type: "int", name: "heal"}, {inout: "out", type: "exe", name: " "} ], event: [ {inout: "in", type: "data", name: "data"}, {inout: "out", type: "card", name: "entity"}, {inout: "out", type: "card", name: "source"}, {inout: "out", type: "int", name: "heal"} ], tooltip: "Restore a certain amount of health to a character", color: "#73BEC8" },
	{ type: "boost", name: "Boost", model: [ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "card", name: "character"}, {inout: "in", type: "int", name: "atk"}, {inout: "in", type: "int", name: "hp"}, {inout: "in", type: "int", name: "range"}, {inout: "out", type: "exe", name: " "} ], event: [ {inout: "in", type: "data", name: "data"}, {inout: "out", type: "card", name: "card"}, {inout: "out", type: "int", name: "atk"}, {inout: "out", type: "int", name: "hp"}, {inout: "out", type: "int", name: "range"} ], tooltip: "Increase a character's statistics by a certain amount", color: "#73BEC8" },
	{ type: "changecost", name: "Change cost", model: [ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "card", name: "card"}, {inout: "in", type: "int", name: "value"}, {inout: "out", type: "exe", name: " "} ], event: [ {inout: "in", type: "data", name: "data"}, {inout: "out", type: "card", name: "card"}, {inout: "out", type: "int", name: "value"} ], tooltip: "Shift a card cost by a certain amount", color: "#73BEC8" },
	{ type: "set", name: "Set", model: [ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "card", name: "card"}, {inout: "in", type: "int", name: "cost"}, {inout: "in", type: "int", name: "atk"}, {inout: "in", type: "int", name: "hp"}, {inout: "in", type: "int", name: "range"}, {inout: "out", type: "exe", name: " "} ], event: [ {inout: "in", type: "data", name: "data"}, {inout: "out", type: "card", name: "card"}, {inout: "out", type: "int", name: "cost"}, {inout: "out", type: "int", name: "atk"}, {inout: "out", type: "int", name: "hp"}, {inout: "out", type: "int", name: "range"} ], tooltip: "Set a card statistics to a specific amount", color: "#73BEC8" },
	{ type: "silence", name: "Silence", model: [ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "card", name: "character"}, {inout: "out", type: "exe", name: " "} ], event: [ {inout: "in", type: "data", name: "data"}, {inout: "out", type: "card", name: "card"} ], tooltip: "Silence a character", color: "#73BEC8" },
	{ type: "destroy", name: "Destroy", model: [ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "card", name: "card"}, {inout: "out", type: "exe", name: " "} ], event: [ {inout: "in", type: "data", name: "data"}, {inout: "out", type: "card", name: "card"}, {inout: "out", type: "bool", name: "from play"} ], tooltip: "Destroy a card", color: "#73BEC8" },
	{ type: "transform", name: "Transform", model: [ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "card", name: "card"}, {inout: "in", type: "model", name: "model"}, {inout: "out", type: "exe", name: " "} ], event: [ {inout: "in", type: "data", name: "data"}, {inout: "out", type: "card", name: "card"} ], tooltip: "Transform a card into another", color: "#73BEC8" },
	{ type: "copy", name: "Copy", model: [ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "card", name: "card"}, {inout: "in", type: "card", name: "model"}, {inout: "out", type: "exe", name: " "} ], tooltip: "Transform into a copy of another card", color: "#73BEC8" },
	{ type: "addshield", name: "Add shield", model: [ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "card", name: "character"}, {inout: "out", type: "exe", name: " "} ], event: [ {inout: "in", type: "data", name: "data"}, {inout: "out", type: "card", name: "character"} ], tooltip: "Give a shield to a character", color: "#73BEC8" },
	{ type: "breakshield", name: "Break shield", model: [ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "card", name: "character"}, {inout: "out", type: "exe", name: " "} ], event: [ {inout: "in", type: "data", name: "data"}, {inout: "out", type: "card", name: "character"} ], tooltip: "Break a character's shield", color: "#73BEC8" },
	{ type: "freeze", name: "Freeze", model: [ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "card", name: "character"}, {inout: "out", type: "exe", name: " "} ], event: [ {inout: "in", type: "data", name: "data"}, {inout: "out", type: "card", name: "character"} ], tooltip: "Freeze a character", color: "#73BEC8" },
	{ type: "pushback", name: "Push back", model: [ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "card", name: "character"}, {inout: "out", type: "exe", name: " "} ], tooltip: "Push a character back", color: "#73BEC8" },
	{ type: "pushforward", name: "Push forward", model: [ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "card", name: "character"}, {inout: "out", type: "exe", name: " "} ], tooltip: "Push a character forward", color: "#73BEC8" },
	{ type: "overload", name: "Overload", model: [ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "card", name: "card"}, {inout: "in", type: "int", name: "overload"}, {inout: "out", type: "exe", name: " "} ], tooltip: "Overload a card from a certain amount", color: "#73BEC8" },
	{ type: "addpoints", name: "Add points", model: [ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "card", name: "entity"}, {inout: "in", type: "int", name: "action"}, {inout: "in", type: "int", name: "skill"}, {inout: "in", type: "int", name: "motion"}, {inout: "out", type: "exe", name: " "} ], tooltip: "Add various points to an entity", color: "#73BEC8" },
	{ type: "levelup", name: "Level up", model: [ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "card", name: "hero"}, {inout: "out", type: "exe", name: " "} ], event: [ {inout: "in", type: "data", name: "data"}, {inout: "out", type: "card", name: "hero"}, {inout: "out", type: "int", name: "level"} ], tooltip: "Level up a hero", color: "#73BEC8" },
	{ type: "addeffect", name: "Add effect", model: [ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "card", name: "character"}, {inout: "in", type: "effect", name: "effect"}, {inout: "out", type: "exe", name: " "} ], tooltip: "Attach an effect to a card", color: "#73BEC8" },
	{ type: "setstate", name: "Set state", model: [ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "card", name: "character"}, {inout: "in", type: "state", name: "state"}, {inout: "in", type: "bool", name: "value"}, {inout: "out", type: "exe", name: " "} ], tooltip: "Change the state of a character", color: "#73BEC8" },
	{ type: "generate", name: "Generate", model: [ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "model", name: "model"}, {inout: "in", type: "int", name: "count"}, {inout: "in", type: "location", name: "location"}, {inout: "out", type: "exe", name: " "}, {inout: "out", type: "card", name: "card"} ], event: [ {inout: "in", type: "data", name: "data"}, {inout: "out", type: "card", name: "card"}, {inout: "out", type: "location", name: "location"} ], tooltip: "Generate cards on the gameboard", color: "#73BEC8" },
	{ type: "createmana", name: "Refill mana", model: [ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "area", name: "player"}, {inout: "in", type: "int", name: "max"}, {inout: "out", type: "exe", name: " "} ], event: [ {inout: "in", type: "data", name: "data"}, {inout: "out", type: "area", name: "player"}, {inout: "out", type: "int", name: "mana"} ], tooltip: "Refill a player's mana", color: "#73BEC8" },
	{ type: "extramana", name: "Extra mana", model: [ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "area", name: "player"}, {inout: "in", type: "int", name: "mana"}, {inout: "out", type: "exe", name: " "} ], event: [ {inout: "in", type: "data", name: "data"}, {inout: "out", type: "area", name: "player"}, {inout: "out", type: "int", name: "mana"} ], tooltip: "Add extra mana for a turn to a player", color: "#73BEC8" },
	{ type: "usemana", name: "Use mana", model: [ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "area", name: "player"}, {inout: "in", type: "int", name: "mana"}, {inout: "out", type: "exe", name: " "} ], event: [ {inout: "in", type: "data", name: "data"}, {inout: "out", type: "area", name: "player"}, {inout: "out", type: "int", name: "mana"} ], tooltip: "Use a player's mana", color: "#73BEC8" },
	{ type: "createreceptacle", name: "Create receptacle", model: [ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "area", name: "player"}, {inout: "in", type: "int", name: "count"}, {inout: "in", type: "bool", name: "filled"}, {inout: "out", type: "exe", name: " "} ], event: [ {inout: "in", type: "data", name: "data"}, {inout: "out", type: "area", name: "player"} ], tooltip: "Create mana receptacles for a player", color: "#73BEC8" },
	{ type: "destroyreceptacle", name: "Destroy receptacle", model: [ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "area", name: "player"}, {inout: "in", type: "int", name: "count"}, {inout: "out", type: "exe", name: " "} ], event: [ {inout: "in", type: "data", name: "data"}, {inout: "out", type: "area", name: "player"} ], tooltip: "Destroy a player's mana receptacles", color: "#73BEC8" },
	{ type: "creategem", name: "Create gem", model: [ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "area", name: "player"}, {inout: "in", type: "int", name: "count"}, {inout: "out", type: "exe", name: " "} ], event: [ {inout: "in", type: "data", name: "data"}, {inout: "out", type: "area", name: "player"} ], tooltip: "Create gems for a player", color: "#73BEC8" },
	{ type: "destroygem", name: "Destroy gem", model: [ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "area", name: "player"}, {inout: "in", type: "int", name: "count"}, {inout: "out", type: "exe", name: " "} ], event: [ {inout: "in", type: "data", name: "data"}, {inout: "out", type: "area", name: "player"} ], tooltip: "Destroy a player's gems", color: "#73BEC8" },
	{ type: "addmut", name: "Add mutation", model: [ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "card", name: "card"}, {inout: "in", type: "mutation", name: "mutation"}, {inout: "in", type: "event", name: "end"}, {inout: "out", type: "exe", name: " "} ], tooltip: "Attach a mutation to a card", color: "#73BEC8" },
	{ type: "addaspect", name: "Add aspect", model: [ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "effect", name: "aspect"}, {inout: "in", type: "event", name: "end"}, {inout: "out", type: "exe", name: " "} ], tooltip: "Create an aspect (an effect not relative to a card)", color: "#73BEC8" },
	{ type: "trigger", name: "Trigger effect", model: [ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "effect", name: "effect"}, {inout: "in", type: "location", name: "target"}, {inout: "in", type: "card", name: "source"}, {inout: "out", type: "exe", name: " "} ], tooltip: "Trigger an effect using a source on an optional target", color: "#73BEC8" },
	{ type: "writeintvar", name: "Store integer", model: [ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "string", name: "name"}, {inout: "in", type: "int", name: "value"}, {inout: "out", type: "exe", name: " "} ], tooltip: "Store an integer into a variable", color: "#73BEC8" },
	{ type: "writecardvar", name: "Store card", model: [ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "string", name: "name"}, {inout: "in", type: "card", name: "value"}, {inout: "out", type: "exe", name: " "} ], tooltip: "Store a card into a variable", color: "#73BEC8" },
	{ type: "writelocvar", name: "Store location", model: [ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "string", name: "name"}, {inout: "in", type: "location", name: "value"}, {inout: "out", type: "exe", name: " "} ], tooltip: "Store a location into a variable", color: "#73BEC8" },
	{ type: "clearvar", name: "Clear variable", model: [ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "string", name: "name"}, {inout: "out", type: "exe", name: " "} ], tooltip: "Remove a stored variable", color: "#73BEC8" },
	{ type: "customevent", name: "Custom event", model: [ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "string", name: "name"}, {inout: "out", type: "exe", name: " "} ], event: [ {inout: "in", type: "data", name: "data"}, {inout: "in", type: "string", name: "name"}, {inout: "out", type: "event", name: "event"} ], tooltip: "Trigger a custom event", color: "#73BEC8" },
	
	{ type: "canpay", name: "Can pay", model: [ {inout: "in", type: "area", name: "player"}, {inout: "in", type: "int", name: "mana"}, {inout: "out", type: "bool", name: "checked"} ], tooltip: "Check if a player can pay a certain amount of mana", color: "#89BC62" },
	{ type: "cmpcards", name: "Compare cards", model: [ {inout: "in", type: "card", name: "card 1"}, {inout: "in", type: "card", name: "card 2"}, {inout: "out", type: "bool", name: "same card"}, {inout: "out", type: "bool", name: "same type"}, {inout: "out", type: "bool", name: "same player"} ], tooltip: "Check similarities between two cards", color: "#89BC62" },
	{ type: "cmptiles", name: "Compare tiles", model: [ {inout: "in", type: "location", name: "tile 1"}, {inout: "in", type: "location", name: "tile 2"}, {inout: "out", type: "bool", name: "same tile"}, {inout: "out", type: "bool", name: "same line"}, {inout: "out", type: "bool", name: "same field"}, {inout: "out", type: "bool", name: "neighbors"}, {inout: "out", type: "bool", name: "adjacents"}, {inout: "out", type: "int", name: "distance"} ], tooltip: "Check similarities between two tiles", color: "#89BC62" },
	{ type: "cmplocations", name: "Compare locations", model: [ {inout: "in", type: "location", name: "location 1"}, {inout: "in", type: "location", name: "location 2"}, {inout: "out", type: "bool", name: "same location"}, {inout: "out", type: "bool", name: "same player"} ], tooltip: "Check similarities between two locations", color: "#89BC62" },
	{ type: "cmpplayers", name: "Compare players", model: [ {inout: "in", type: "area", name: "player 1"}, {inout: "in", type: "area", name: "player 2"}, {inout: "out", type: "bool", name: "same player"} ], tooltip: "Check if two players are the same", color: "#89BC62" },
	{ type: "tiletotiles", name: "Tile to tiles", model: [ {inout: "in", type: "location", name: "tile"}, {inout: "out", type: "locations", name: "tiles"} ], tooltip: "Transform a tile into a set of locations", color: "#89BC62" },
	{ type: "containstile", name: "Contains tile", model: [ {inout: "in", type: "locations", name: "area"}, {inout: "in", type: "location", name: "tile"}, {inout: "out", type: "bool", name: "contains"} ], tooltip: "Check if an area contains a specific tile", color: "#89BC62" },
	{ type: "countcards", name: "Count cards", model: [ {inout: "in", type: "locations", name: "area"}, {inout: "in", type: "cardfilter", name: "filter"}, {inout: "out", type: "int", name: "count"} ], tooltip: "Count cards in an area matching a filter", color: "#89BC62" },
	{ type: "counttiles", name: "Count tiles", model: [ {inout: "in", type: "locations", name: "area"}, {inout: "in", type: "tilefilter", name: "filter"}, {inout: "out", type: "int", name: "count"} ], tooltip: "Count tiles in an area matching a filter", color: "#89BC62" },
	{ type: "mergeloc", name: "Merge locations", model: [ {inout: "in", type: "locations", name: "locations 1"}, {inout: "in", type: "locations", name: "locations 2"}, {inout: "out", type: "locations", name: "or"}, {inout: "out", type: "locations", name: "and"} ], tooltip: "Merge locations into a new element", color: "#89BC62" },
	{ type: "editloc", name: "Edit locations", model: [ {inout: "in", type: "locations", name: "area"}, {inout: "in", type: "location", name: "location"}, {inout: "out", type: "locations", name: "add"}, {inout: "out", type: "locations", name: "remove"} ], tooltip: "Add or remove a location to/from an area or remove", color: "#89BC62" },
	{ type: "checkcard", name: "Check card", model: [ {inout: "in", type: "card", name: "card"}, {inout: "in", type: "cardfilter", name: "filter"}, {inout: "out", type: "bool", name: "checked"} ], tooltip: "Check if a card matches a filter", color: "#89BC62" },
	{ type: "checktile", name: "Check tile", model: [ {inout: "in", type: "location", name: "tile"}, {inout: "in", type: "tilefilter", name: "filter"}, {inout: "out", type: "bool", name: "checked"} ], tooltip: "Check if a tile matches a filter", color: "#89BC62" },
	{ type: "checkloc", name: "Check location", model: [ {inout: "in", type: "location", name: "location"}, {inout: "in", type: "locations", name: "area"}, {inout: "out", type: "bool", name: "checked"} ], tooltip: "Check if a location is in an area", color: "#89BC62" },
	{ type: "checkeffect", name: "Check effect", model: [ {inout: "in", type: "effect", name: "effect"}, {inout: "in", type: "effecttype", name: "type"}, {inout: "out", type: "bool", name: "checked"} ], tooltip: "Check if an effect is a specific type", color: "#89BC62" },
	{ type: "cover", name: "Does cover", model: [ {inout: "in", type: "card", name: "covering"}, {inout: "in", type: "card", name: "covered"}, {inout: "out", type: "bool", name: "global"}, {inout: "out", type: "bool", name: "ground"}, {inout: "out", type: "bool", name: "air"} ], tooltip: "Check if an card covers another", color: "#89BC62" },
	{ type: "covered", name: "Is covered", model: [ {inout: "in", type: "card", name: "card"}, {inout: "out", type: "bool", name: "global"}, {inout: "out", type: "bool", name: "ground"}, {inout: "out", type: "bool", name: "air"} ], tooltip: "Check if an card is covered on the ground or in the air", color: "#89BC62" },
	{ type: "filterstats", name: "Filter stats", model: [ {inout: "in", type: "int", name: "min cost"}, {inout: "in", type: "int", name: "max cost"}, {inout: "in", type: "int", name: "min atk"}, {inout: "in", type: "int", name: "max atk"}, {inout: "in", type: "int", name: "min hp"}, {inout: "in", type: "int", name: "max hp"}, {inout: "in", type: "int", name: "min range"}, {inout: "in", type: "int", name: "max range"}, {inout: "out", type: "cardfilter", name: "filter"} ], tooltip: "Get a filter using card statistics", color: "#89BC62" },
	{ type: "mergecfilters", name: "Merge card filters", model: [ {inout: "in", type: "cardfilter", name: "filter 1"}, {inout: "in", type: "cardfilter", name: "filter 2"}, {inout: "out", type: "cardfilter", name: "or"}, {inout: "out", type: "cardfilter", name: "and"} ], tooltip: "Merge card filters into a new element", color: "#89BC62" },
	{ type: "mergetfilters", name: "Merge tile filters", model: [ {inout: "in", type: "tilefilter", name: "filter 1"}, {inout: "in", type: "tilefilter", name: "filter 2"}, {inout: "out", type: "tilefilter", name: "or"}, {inout: "out", type: "tilefilter", name: "and"} ], tooltip: "Merge tile filters into a new element", color: "#89BC62" },
	{ type: "ctotfilter", name: "Card to tile filter", model: [ {inout: "in", type: "cardfilter", name: "contains"}, {inout: "out", type: "tilefilter", name: "filter"} ], tooltip: "Transform a card fliter into a tile filter checking if the card on the tile matches the filter", color: "#89BC62" },
	{ type: "mergemut", name: "Merge mutations", model: [ {inout: "in", type: "mutation", name: "mutation 1"}, {inout: "in", type: "mutation", name: "mutation 2"}, {inout: "out", type: "mutation", name: "result"} ], tooltip: "Merge mutations into a new element", color: "#89BC62" },
	{ type: "conditionmut", name: "Conditional mutation", model: [ {inout: "in", type: "mutation", name: "mutation"}, {inout: "in", type: "bool", name: "condition"}, {inout: "out", type: "mutation", name: "result"} ], tooltip: "Apply a mutation under a given condition", color: "#89BC62" },
	
	{ type: "brkcard", name: "Break card", model: [ {inout: "in", type: "card", name: "card"}, {inout: "out", type: "model", name: "model"}, {inout: "out", type: "location", name: "location"}, {inout: "out", type: "area", name: "player"}, {inout: "out", type: "cardfilter", name: "type"}, {inout: "out", type: "int", name: "mana"}, {inout: "out", type: "int", name: "atk"}, {inout: "out", type: "int", name: "hp"}, {inout: "out", type: "int", name: "range"}, {inout: "out", type: "int", name: "overload"}, {inout: "out", type: "bool", name: "damaged"}, {inout: "out", type: "bool", name: "destroyed"} ], tooltip: "Get a card data", color: "#e59c3d" },
	{ type: "brkmodel", name: "Break model", model: [ {inout: "in", type: "model", name: "model"}, {inout: "out", type: "cardfilter", name: "type"}, {inout: "out", type: "int", name: "mana"}, {inout: "out", type: "int", name: "atk"}, {inout: "out", type: "int", name: "hp"}, {inout: "out", type: "int", name: "range"} ], tooltip: "Get a card model data", color: "#e59c3d" },
	{ type: "brktile", name: "Break tile", model: [ {inout: "in", type: "location", name: "tile"}, {inout: "out", type: "locations", name: "field"}, {inout: "out", type: "area", name: "player"}, {inout: "out", type: "bool", name: "front"}, {inout: "out", type: "bool", name: "empty"}, {inout: "out", type: "card", name: "entity"}, {inout: "out", type: "locations", name: "neighbors"}, {inout: "out", type: "locations", name: "adjacents"}, {inout: "out", type: "locations", name: "ahead"}, {inout: "out", type: "locations", name: "behind"}, {inout: "out", type: "locations", name: "line"} ], tooltip: "Get a tile data", color: "#e59c3d" },
	{ type: "brklocation", name: "Break location", model: [ {inout: "in", type: "location", name: "location"}, {inout: "out", type: "area", name: "player"}, {inout: "out", type: "int", name: "count"}, {inout: "out", type: "bool", name: "empty"} ], tooltip: "Get a location data", color: "#e59c3d" },
	{ type: "brkplayer", name: "Break player", model: [ {inout: "in", type: "area", name: "player"}, {inout: "out", type: "locations", name: "field"}, {inout: "out", type: "location", name: "hand"}, {inout: "out", type: "location", name: "deck"}, {inout: "out", type: "area", name: "opponent"}, {inout: "out", type: "bool", name: "playing"} ], tooltip: "Get a player's data", color: "#FFA126" },
	
	{ type: "archetype", name: "Archetype", model: [ {inout: "in", type: "string", name: "name"}, {inout: "out", type: "cardfilter", name: "filter"} ], tooltip: "Filter on a card archetype", color: "#670e6b" },
	{ type: "token", name: "Token", model: [ {inout: "in", type: "int", name: "no"}, {inout: "out", type: "model", name: "model"} ], tooltip: "Get the model of a token", color: "#670e6b" },
	{ type: "limitbrk", name: "Limit break", model: [ {inout: "out", type: "int", name: "bonus"} ], tooltip: "Card effect bonus due to overload", color: "#670e6b" },
	{ type: "manapool", name: "Mana pool", model: [ {inout: "in", type: "area", name: "player"}, {inout: "out", type: "int", name: "mana"}, {inout: "out", type: "int", name: "receptacles"}, {inout: "out", type: "int", name: "gems"} ], tooltip: "Data on a player's mana pool", color: "#670e6b" },
	{ type: "innerdata", name: "Mutant", model: [ {inout: "out", type: "card", name: "target"} ], tooltip: "Card targeted by a mutation", color: "#670e6b" },
	{ type: "innerdata", name: "Analysed event", model: [ {inout: "out", type: "data", name: "data"} ], tooltip: "Event data under analyse", color: "#670e6b" },
	{ type: "intvar", name: "Int variable", model: [ {inout: "in", type: "string", name: "name"}, {inout: "out", type: "int", name: "value"}, {inout: "out", type: "bool", name: "exists"} ], tooltip: "Get a stored integer", color: "#670e6b" },
	{ type: "cardvar", name: "Card variable", model: [ {inout: "in", type: "string", name: "name"}, {inout: "out", type: "card", name: "value"}, {inout: "out", type: "bool", name: "exists"} ], tooltip: "Get a stored card", color: "#670e6b" },
	{ type: "locvar", name: "Location variable", model: [ {inout: "in", type: "string", name: "name"}, {inout: "out", type: "location", name: "value"}, {inout: "out", type: "bool", name: "exists"} ], tooltip: "Get a stored location", color: "#670e6b" },
	
	{ type: "timestamp", name: "Timestamp", model: [ {inout: "in", type: "timestamp", name: "timestamp"}, {inout: "out", type: "event", name: "event"} ], tooltip: "The event corresponding to a timestamp", color: "#212121" },
	{ type: "analyse", name: "Analyse", model: [ {inout: "in", type: "event", name: "event"}, {inout: "in", type: "period", name: "period"}, {inout: "in", type: "bool", name: "condition"}, {inout: "out", type: "bool", name: "happened"}, {inout: "out", type: "int", name: "count"} ], tooltip: "Count how many events have happened during a period of time", color: "#212121" },
	{ type: "findcard", name: "Find random card", model: [ {inout: "in", type: "locations", name: "area"}, {inout: "in", type: "cardfilter", name: "filter"}, {inout: "out", type: "card", name: "result"}, {inout: "out", type: "bool", name: "found"} ], tooltip: "Find a random card in an area", color: "#212121" },
	{ type: "findmodel", name: "Find random model", model: [ {inout: "in", type: "cardfilter", name: "filter"}, {inout: "out", type: "model", name: "result"}, {inout: "out", type: "bool", name: "found"} ], tooltip: "Find a random card model", color: "#212121" },
	{ type: "randint", name: "Random int", model: [ {inout: "in", type: "int", name: "min"}, {inout: "in", type: "int", name: "max"}, {inout: "out", type: "int", name: "result"} ], tooltip: "Return a random integer between thresholds", color: "#212121" },
	{ type: "randbool", name: "Random bool", model: [ {inout: "out", type: "bool", name: "result"} ], tooltip: "Return randomly true or false", color: "#212121" },
	
	{ type: "branch", name: "Branch", model: [ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "bool", name: "condition"}, {inout: "out", type: "exe", name: "true"}, {inout: "out", type: "exe", name: "false"} ], tooltip: "Call different scripts depending on a condition", color: "#C0C0C0" },
	{ type: "loop", name: "Loop", model: [ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "int", name: "times"}, {inout: "in", type: "bool", name: "condition"}, {inout: "out", type: "exe", name: "completed"}, {inout: "out", type: "exe", name: "loop"}, {inout: "out", type: "int", name: "index"} ], tooltip: "Call a script several times", color: "#C0C0C0" },
	{ type: "timer", name: "Timer", model: [ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "timestamp", name: "timestamp"}, {inout: "out", type: "exe", name: " "}, {inout: "out", type: "exe", name: "callback"} ], tooltip: "Call a script later during the game", color: "#C0C0C0" },
	{ type: "watchdog", name: "Watchdog", model: [ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "event", name: "event"}, {inout: "in", type: "event", name: "end"}, {inout: "out", type: "exe", name: " "}, {inout: "out", type: "exe", name: "callback"} ], tooltip: "Setup a watchdog calling a script whenever a specific event is handled", color: "#C0C0C0" },
	{ type: "aoe", name: "Area of effect", model: [ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "locations", name: "area"}, {inout: "in", type: "cardfilter", name: "targets"}, {inout: "out", type: "exe", name: "completed"}, {inout: "out", type: "exe", name: "for each"}, {inout: "out", type: "card", name: "card"} ], tooltip: "Call a script for each card in a specific area", color: "#C0C0C0" },
	{ type: "fortile", name: "For each tile", model: [ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "locations", name: "area"}, {inout: "in", type: "tilefilter", name: "targets"}, {inout: "out", type: "exe", name: "completed"}, {inout: "out", type: "exe", name: "for each"}, {inout: "out", type: "location", name: "tile"} ], tooltip: "Call a script for each tile in a specific area", color: "#C0C0C0" },
	{ type: "foreffect", name: "For each effect", model: [ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "card", name: "card"}, {inout: "in", type: "effecttype", name: "type"}, {inout: "out", type: "exe", name: "completed"}, {inout: "out", type: "exe", name: "for each"}, {inout: "out", type: "effect", name: "effect"} ], tooltip: "Call a script for each effect of a card", color: "#C0C0C0" },
	
	{ type: "extraturn", name: "Extra turn", model: [ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "area", name: "player"}, {inout: "out", type: "exe", name: " "} ], tooltip: "Give an extra turn to a player", color: "#C752A2" },
	
	{ type: "opplus", name: "+", model: [ {inout: "in", type: "int", name: " "}, {inout: "in", type: "int", name: " "}, {inout: "out", type: "int", name: " "} ], tooltip: "Add two integers", color: "#202020" },
	{ type: "opminus", name: "-", model: [ {inout: "in", type: "int", name: " "}, {inout: "in", type: "int", name: " "}, {inout: "out", type: "int", name: " "} ], tooltip: "Substract a integer from another", color: "#202020" },
	{ type: "optimes", name: "x", model: [ {inout: "in", type: "int", name: " "}, {inout: "in", type: "int", name: " "}, {inout: "out", type: "int", name: " "} ], tooltip: "Multiply two integers", color: "#202020" },
	{ type: "opdiv", name: "/", model: [ {inout: "in", type: "int", name: " "}, {inout: "in", type: "int", name: " "}, {inout: "out", type: "int", name: " "} ], tooltip: "Divide an integer from another", color: "#202020" },
	{ type: "opmod", name: "%", model: [ {inout: "in", type: "int", name: " "}, {inout: "in", type: "int", name: " "}, {inout: "out", type: "int", name: " "} ], tooltip: "Find the remainder after dividing an integer by another", color: "#202020" },
	{ type: "opter", name: "?", model: [ {inout: "in", type: "bool", name: " "}, {inout: "in", type: "int", name: "true"}, {inout: "in", type: "int", name: "false"}, {inout: "out", type: "int", name: " "} ], tooltip: "Return an integer or another depending on a boolean", color: "#202020" },
	{ type: "opnot", name: "!", model: [ {inout: "in", type: "bool", name: " "}, {inout: "out", type: "bool", name: " "} ], tooltip: "Reverse a boolean", color: "#202020" },
	{ type: "opand", name: "&", model: [ {inout: "in", type: "bool", name: " "}, {inout: "in", type: "bool", name: " "}, {inout: "out", type: "bool", name: " "} ], tooltip: "Check if both booleans are true", color: "#202020" },
	{ type: "opor", name: "|", model: [ {inout: "in", type: "bool", name: " "}, {inout: "in", type: "bool", name: " "}, {inout: "out", type: "bool", name: " "} ], tooltip: "Check if at least one boolean is true", color: "#202020" },
	{ type: "opxor", name: "⊕", model: [ {inout: "in", type: "bool", name: " "}, {inout: "in", type: "bool", name: " "}, {inout: "out", type: "bool", name: " "} ], tooltip: "Check if exactly one boolean is true", color: "#202020" },
	{ type: "ope", name: "=", model: [ {inout: "in", type: "int", name: " "}, {inout: "in", type: "int", name: " "}, {inout: "out", type: "bool", name: " "} ], tooltip: "Check if two integers are equals", color: "#202020" },
	{ type: "opne", name: "!=", model: [ {inout: "in", type: "int", name: " "}, {inout: "in", type: "int", name: " "}, {inout: "out", type: "bool", name: " "} ], tooltip: "Check if two integers are differents", color: "#202020" },
	{ type: "opg", name: ">", model: [ {inout: "in", type: "int", name: " "}, {inout: "in", type: "int", name: " "}, {inout: "out", type: "bool", name: " "} ], tooltip: "Check if an integer is greater than another", color: "#202020" },
	{ type: "opl", name: "<", model: [ {inout: "in", type: "int", name: " "}, {inout: "in", type: "int", name: " "}, {inout: "out", type: "bool", name: " "} ], tooltip: "Check if an integer is lesser than another", color: "#202020" },
	{ type: "opge", name: ">=", model: [ {inout: "in", type: "int", name: " "}, {inout: "in", type: "int", name: " "}, {inout: "out", type: "bool", name: " "} ], tooltip: "Check if an integer is greater or equal to another", color: "#202020" },
	{ type: "ople", name: "<=", model: [ {inout: "in", type: "int", name: " "}, {inout: "in", type: "int", name: " "}, {inout: "out", type: "bool", name: " "} ], tooltip: "Check if an integer is lesser or equal to another", color: "#202020" },
	{ type: "opmax", name: "MAX", model: [ {inout: "in", type: "int", name: " "}, {inout: "in", type: "int", name: " "}, {inout: "out", type: "int", name: " "} ], tooltip: "Gives the max value between two integers", color: "#202020" },
	{ type: "opmin", name: "MIN", model: [ {inout: "in", type: "int", name: " "}, {inout: "in", type: "int", name: " "}, {inout: "out", type: "int", name: " "} ], tooltip: "Gives the min value between two integers", color: "#202020" }
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
							if ((port.parent.nodeType === "play" || port.parent.nodeType === "action" || port.parent.nodeType === "skill") && port.label === "target" && Object.keys(port.links).some(key => port.links[key].targetPort))
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

	updateTooltip (e, text) {

		var tooltip = document.getElementById("blueprint-tooltip");
	  	tooltip.setAttribute("style", `display: block; top: ${e.pageY}px; left: ${e.pageX}px;`);
	  	document.getElementById("blueprint-tooltip-description").innerHTML = text;
	}

	hideTooltip() {

	  	var tooltip = document.getElementById("blueprint-tooltip");
	  	tooltip.setAttribute("style", `display: none`);
	}

	render () {

		return (
	    <div className={"blueprint-menu " + this.props.className}>
	    	<div id="blueprint-tooltip" data-toggle="tooltip" data-placement="right" data-animation="false" data-trigger="manual">
	    		<span id="blueprint-tooltip-description"/>
	    	</div>
  			<div className="blueprint-nav">
  				<div className="blueprint-nav-header">
  					<div className="blueprint-nav-title">Blocks</div>
  					<Input id="search-blueprint-block" type="text" onChange={() => this.setState({filter: document.getElementById("search-blueprint-block").value})} placeholder="search" className="blueprint-nav-search"/>
  				</div>
  				<div className="blueprint-nav-body">
  				{
  					blocks.filter(block => block.name.toLowerCase().includes(this.state.filter)).map(block => <Tray onMouseMove={e => this.updateTooltip(e, block.tooltip)} onMouseLeave={e => this.hideTooltip()} key={block.name} type={block.type} name={block.name} model={block.model} event={block.event} color={block.color}/>)
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

						node.switch();
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