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

	{ type: "state", name: "State", model: [ {inout: "in", type: "state", name: " "}, {inout: "in", type: "bool", name: "value"}, {inout: "out", type: "effect", name: " "}, {inout: "out", type: "mutation", name: "mutation"}, {inout: "out", type: "cardfilter", name: "filter"} ], tooltip: "Utilise un état comme effet ou mutation", color: "#ffe521" },
	{ type: "variation", name: "Variation", model: [ {inout: "in", type: "int", name: "mana"}, {inout: "in", type: "int", name: "atk"}, {inout: "in", type: "int", name: "hp"}, {inout: "in", type: "int", name: "range"}, {inout: "in", type: "int", name: "overload"}, {inout: "out", type: "mutation", name: "mutation"} ], tooltip: "Utilise une variation de statistiques comme mutation", color: "#ffe521" },
	{ type: "lockstats", name: "Lock stats", model: [ {inout: "in", type: "int", name: "mana"}, {inout: "in", type: "int", name: "atk"}, {inout: "in", type: "int", name: "hp"}, {inout: "in", type: "int", name: "range"}, {inout: "in", type: "int", name: "overload"}, {inout: "out", type: "mutation", name: "mutation"} ], tooltip: "Fixe des statistiques sur une valeur comme mutation", color: "#ffe521" },
	{ type: "armor", name: "Armor", model: [ {inout: "in", type: "int", name: "armor"}, {inout: "out", type: "effect", name: " "}, {inout: "out", type: "mutation", name: "mutation"} ], tooltip: "Réduit les dégâts de contact d'un certain montant", color: "#ffe521" },
	
	{ type: "play", name: "Play", model: [ {inout: "out", type: "effect", name: " "}, {inout: "in", type: "tilefilter", name: "targetable"}, {inout: "out", type: "exe", name: " "}, {inout: "out", type: "card", name: "target"}, {inout: "out", type: "location", name: "target"} ], event: [ {inout: "in", type: "data", name: "data"}, {inout: "out", type: "card", name: "card"}, {inout: "out", type: "card", name: "target"}, {inout: "out", type: "location", name: "target"}, {inout: "out", type: "bool", name: "has target"} ], tooltip: "Appelle un script lorsque la carte est jouée, avec une cible optionnelle", color: "#871212" },
	{ type: "action", name: "Action", model: [ {inout: "out", type: "effect", name: " "}, {inout: "in", type: "tilefilter", name: "targetable"}, {inout: "in", type: "string", name: "text"}, {inout: "out", type: "exe", name: " "}, {inout: "out", type: "card", name: "target"}, {inout: "out", type: "location", name: "target"} ], tooltip: "Action coûtant un point d'action, avec une cible optionnelle", color: "#871212" },
	{ type: "skill", name: "Skill", model: [ {inout: "out", type: "effect", name: " "}, {inout: "in", type: "tilefilter", name: "targetable"}, {inout: "in", type: "string", name: "text"}, {inout: "in", type: "int", name: "cost"}, {inout: "out", type: "exe", name: " "}, {inout: "out", type: "card", name: "target"}, {inout: "out", type: "location", name: "target"} ], tooltip: "Compétence coûtant un point de compétence, avec une cible optionnelle", color: "#871212" },
	{ type: "lw", name: "Last will", model: [ {inout: "out", type: "effect", name: " "}, {inout: "out", type: "exe", name: " "} ], tooltip: "Appelle un script lorsque l'entité est détruite", color: "#871212" },
	{ type: "frenzy", name: "Frenzy", model: [ {inout: "out", type: "effect", name: " "}, {inout: "out", type: "exe", name: " "}, {inout: "out", type: "card", name: "victim"} ], tooltip: "Appelle un script après que le personnage en détruise un autre en l'attaquant", color: "#871212" },
	{ type: "contact", name: "Contact", model: [ {inout: "out", type: "effect", name: " "}, {inout: "out", type: "exe", name: " "}, {inout: "out", type: "card", name: "other"} ], event: [ {inout: "in", type: "data", name: "data"}, {inout: "out", type: "card", name: "attacker"}, {inout: "out", type: "card", name: "defender"} ], tooltip: "Appelle un script après que l'entité soit entrée au contact avec une autre", color: "#871212" },
	{ type: "listener", name: "Listener", model: [ {inout: "in", type: "event", name: "event"}, {inout: "in", type: "bool", name: "on board"}, {inout: "out", type: "effect", name: " "}, {inout: "out", type: "exe", name: " "}, {inout: "out", type: "data", name: "data"} ], tooltip: "Appelle un script lorsqu'un événement spécifique se déclenche", color: "#871212" },
	{ type: "aura", name: "Aura", model: [ {inout: "in", type: "mutation", name: "mutation"}, {inout: "in", type: "locations", name: "area"}, {inout: "in", type: "cardfilter", name: "targets"}, {inout: "out", type: "effect", name: " "} ], tooltip: "Applique une mutation aux cartes dans une zone", color: "#871212" },
	{ type: "passivemut", name: "Passive mutation", model: [ {inout: "in", type: "mutation", name: "mutation"}, {inout: "out", type: "effect", name: " "} ], tooltip: "Utilise une mutation comme effet passif", color: "#871212" },
	{ type: "contactmut", name: "Contact mutation", model: [ {inout: "in", type: "mutation", name: "mutation"}, {inout: "in", type: "cardfilter", name: "against"}, {inout: "out", type: "effect", name: " "} ], tooltip: "Obtient une mutation durant le combat avec une autre entité", color: "#871212" },
	{ type: "trap", name: "Auto", model: [ {inout: "out", type: "effect", name: " "}, {inout: "out", type: "exe", name: " "} ], tooltip: "Appelle un script lorsque la carte est piochée", color: "#871212" },
	{ type: "secret", name: "Secret", model: [ {inout: "in", type: "string", name: "text"}, {inout: "in", type: "int", name: "cost"}, {inout: "out", type: "effect", name: " "}, {inout: "out", type: "exe", name: " "}, {inout: "out", type: "data", name: "data"} ], event: [ {inout: "in", type: "data", name: "data"}, {inout: "out", type: "card", name: "secret"} ], tooltip: "Appelle un script lorsque le secret se déclenche", color: "#871212" },
	
	{ type: "draw", name: "Draw", model: [ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "int", name: "number"}, {inout: "in", type: "area", name: "player"}, {inout: "in", type: "cardfilter", name: "filter"}, {inout: "out", type: "exe", name: " "}, {inout: "out", type: "card", name: "card"} ], event: [ {inout: "in", type: "data", name: "data"}, {inout: "out", type: "card", name: "card"}, {inout: "out", type: "area", name: "player"} ], tooltip: "Fait piocher des cartes à un joueur", color: "#73BEC8" },
	{ type: "summon", name: "Summon", model: [ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "card", name: "entity"}, {inout: "in", type: "location", name: "tile"}, {inout: "out", type: "exe", name: " "} ], event: [ {inout: "in", type: "data", name: "data"}, {inout: "out", type: "card", name: "entity"}, {inout: "out", type: "location", name: "tile"} ], tooltip: "Invoque une entité sur une case donnée", color: "#73BEC8" },
	{ type: "attack", name: "Attack", model: [ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "card", name: "character"}, {inout: "in", type: "card", name: "target"}, {inout: "out", type: "exe", name: " "} ], event: [ {inout: "in", type: "data", name: "data"}, {inout: "out", type: "card", name: "character"}, {inout: "out", type: "card", name: "target"} ], tooltip: "Force un personnage à attaquer une entité", color: "#73BEC8" },
	{ type: "move", name: "Move", model: [ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "card", name: "card"}, {inout: "in", type: "location", name: "location"}, {inout: "out", type: "exe", name: " "} ], event: [ {inout: "in", type: "data", name: "data"}, {inout: "out", type: "card", name: "card"}, {inout: "out", type: "location", name: "from"}, {inout: "out", type: "location", name: "to"} ], tooltip: "Déplace une carte sur un emplacement donné", color: "#73BEC8" },
	{ type: "movenear", name: "Move Near", model: [ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "card", name: "card"}, {inout: "in", type: "location", name: "tile"}, {inout: "out", type: "exe", name: " "}, {inout: "out", type: "location", name: "nearest"} ], tooltip: "Déplace une carte sur la case vide la plus proche d'une case donnée", color: "#73BEC8" },
	{ type: "damage", name: "Damage", model: [ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "card", name: "entity"}, {inout: "in", type: "card", name: "source"}, {inout: "in", type: "int", name: "damage"}, {inout: "out", type: "exe", name: " "} ], event: [ {inout: "in", type: "data", name: "data"}, {inout: "out", type: "card", name: "entity"}, {inout: "out", type: "card", name: "source"}, {inout: "out", type: "int", name: "damage"}, {inout: "out", type: "int", name: "overkill"} ], tooltip: "Inflige un montant de dégâts à une entité", color: "#73BEC8" },
	{ type: "heal", name: "Heal", model: [ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "card", name: "entity"}, {inout: "in", type: "card", name: "source"}, {inout: "in", type: "int", name: "heal"}, {inout: "out", type: "exe", name: " "} ], event: [ {inout: "in", type: "data", name: "data"}, {inout: "out", type: "card", name: "entity"}, {inout: "out", type: "card", name: "source"}, {inout: "out", type: "int", name: "heal"} ], tooltip: "Rend un montant de vie à une entité", color: "#73BEC8" },
	{ type: "boost", name: "Boost", model: [ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "card", name: "character"}, {inout: "in", type: "int", name: "atk"}, {inout: "in", type: "int", name: "hp"}, {inout: "in", type: "int", name: "range"}, {inout: "out", type: "exe", name: " "} ], event: [ {inout: "in", type: "data", name: "data"}, {inout: "out", type: "card", name: "card"}, {inout: "out", type: "int", name: "atk"}, {inout: "out", type: "int", name: "hp"}, {inout: "out", type: "int", name: "range"} ], tooltip: "Augmente les statistiques d'une entité d'un montant donné", color: "#73BEC8" },
	{ type: "changecost", name: "Change cost", model: [ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "card", name: "card"}, {inout: "in", type: "int", name: "value"}, {inout: "out", type: "exe", name: " "} ], event: [ {inout: "in", type: "data", name: "data"}, {inout: "out", type: "card", name: "card"}, {inout: "out", type: "int", name: "value"} ], tooltip: "Altère le coût d'une carte d'un montant donné", color: "#73BEC8" },
	{ type: "set", name: "Set", model: [ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "card", name: "card"}, {inout: "in", type: "int", name: "cost"}, {inout: "in", type: "int", name: "atk"}, {inout: "in", type: "int", name: "hp"}, {inout: "in", type: "int", name: "range"}, {inout: "out", type: "exe", name: " "} ], event: [ {inout: "in", type: "data", name: "data"}, {inout: "out", type: "card", name: "card"}, {inout: "out", type: "int", name: "cost"}, {inout: "out", type: "int", name: "atk"}, {inout: "out", type: "int", name: "hp"}, {inout: "out", type: "int", name: "range"} ], tooltip: "Fixe les statistiques d'une carte à une valeur donnée", color: "#73BEC8" },
	{ type: "silence", name: "Silence", model: [ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "card", name: "character"}, {inout: "out", type: "exe", name: " "} ], event: [ {inout: "in", type: "data", name: "data"}, {inout: "out", type: "card", name: "card"} ], tooltip: "Réduit un personnage au silence", color: "#73BEC8" },
	{ type: "destroy", name: "Destroy", model: [ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "card", name: "card"}, {inout: "out", type: "exe", name: " "} ], event: [ {inout: "in", type: "data", name: "data"}, {inout: "out", type: "card", name: "card"}, {inout: "out", type: "bool", name: "from play"} ], tooltip: "Détruit une carte", color: "#73BEC8" },
	{ type: "discard", name: "Discard", model: [ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "card", name: "card"}, {inout: "out", type: "exe", name: " "} ], event: [ {inout: "in", type: "data", name: "data"}, {inout: "out", type: "card", name: "card"} ], tooltip: "Défausse une carte", color: "#73BEC8" },
	{ type: "cast", name: "Cast", model: [ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "card", name: "spell"}, {inout: "in", type: "location", name: "target"}, {inout: "out", type: "exe", name: " "} ], event: [ {inout: "in", type: "data", name: "data"}, {inout: "out", type: "card", name: "spell"}, {inout: "out", type: "card", name: "target"}, {inout: "out", type: "location", name: "target"}, {inout: "out", type: "bool", name: "has target"} ], tooltip: "Lance un sort", color: "#73BEC8" },
	{ type: "counter", name: "Counter", model: [ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "card", name: "spell"}, {inout: "out", type: "exe", name: " "} ], tooltip: "Annule un sort", color: "#73BEC8" },
	{ type: "changetarget", name: "Change target", model: [ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "card", name: "card"}, {inout: "in", type: "location", name: "target"}, {inout: "out", type: "exe", name: " "} ], tooltip: "Modifie la cible de l'effet ou de l'attaque d'une carte", color: "#73BEC8" },
	{ type: "transform", name: "Transform", model: [ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "card", name: "card"}, {inout: "in", type: "model", name: "model"}, {inout: "out", type: "exe", name: " "} ], event: [ {inout: "in", type: "data", name: "data"}, {inout: "out", type: "card", name: "card"} ], tooltip: "Transforme une carte en une autre", color: "#73BEC8" },
	{ type: "copy", name: "Copycat", model: [ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "card", name: "card"}, {inout: "in", type: "card", name: "model"}, {inout: "out", type: "exe", name: " "} ], tooltip: "Transforme une carte en copie d'une autre carte", color: "#73BEC8" },
	{ type: "addshield", name: "Add shield", model: [ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "card", name: "character"}, {inout: "out", type: "exe", name: " "} ], event: [ {inout: "in", type: "data", name: "data"}, {inout: "out", type: "card", name: "character"} ], tooltip: "Donne un bouclier à un personnage", color: "#73BEC8" },
	{ type: "breakshield", name: "Break shield", model: [ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "card", name: "character"}, {inout: "out", type: "exe", name: " "} ], event: [ {inout: "in", type: "data", name: "data"}, {inout: "out", type: "card", name: "character"} ], tooltip: "Brise le bouclier d'un personnage", color: "#73BEC8" },
	{ type: "freeze", name: "Freeze", model: [ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "card", name: "character"}, {inout: "out", type: "exe", name: " "} ], event: [ {inout: "in", type: "data", name: "data"}, {inout: "out", type: "card", name: "character"} ], tooltip: "Gèle un personnage", color: "#73BEC8" },
	{ type: "poison", name: "Poison", model: [ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "card", name: "character"}, {inout: "in", type: "int", name: "poison"}, {inout: "out", type: "exe", name: " "} ], event: [ {inout: "in", type: "data", name: "data"}, {inout: "out", type: "card", name: "character"}, {inout: "out", type: "int", name: "poison"} ], tooltip: "Inflige un montant de poison à un personnage", color: "#73BEC8" },
	{ type: "curepoison", name: "Cure poison", model: [ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "card", name: "character"}, {inout: "in", type: "int", name: "poison"}, {inout: "out", type: "exe", name: " "} ], tooltip: "Guérit un personnage d'un montant de poison donné", color: "#73BEC8" },
	{ type: "pushback", name: "Push back", model: [ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "card", name: "character"}, {inout: "out", type: "exe", name: " "} ], tooltip: "Fait reculer un personnage", color: "#73BEC8" },
	{ type: "pushforward", name: "Push forward", model: [ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "card", name: "character"}, {inout: "out", type: "exe", name: " "} ], tooltip: "Fait avancer un personnage", color: "#73BEC8" },
	{ type: "overload", name: "Overload", model: [ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "card", name: "card"}, {inout: "in", type: "int", name: "overload"}, {inout: "out", type: "exe", name: " "} ], tooltip: "Surcharge une carte d'un certain montant", color: "#73BEC8" },
	{ type: "addpoints", name: "Add points", model: [ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "card", name: "entity"}, {inout: "in", type: "int", name: "action"}, {inout: "in", type: "int", name: "skill"}, {inout: "in", type: "int", name: "motion"}, {inout: "out", type: "exe", name: " "} ], tooltip: "Ajoute des points à une entité", color: "#73BEC8" },
	{ type: "levelup", name: "Level up", model: [ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "card", name: "hero"}, {inout: "out", type: "exe", name: " "} ], event: [ {inout: "in", type: "data", name: "data"}, {inout: "out", type: "card", name: "hero"}, {inout: "out", type: "int", name: "level"} ], tooltip: "Passe un héros au niveau supérieur", color: "#73BEC8" },
	{ type: "leveldown", name: "Level down", model: [ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "card", name: "hero"}, {inout: "out", type: "exe", name: " "} ], tooltip: "Passe un héros au niveau inférieur", color: "#73BEC8" },
	{ type: "addeffect", name: "Add effect", model: [ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "card", name: "character"}, {inout: "in", type: "effect", name: "effect"}, {inout: "out", type: "exe", name: " "} ], tooltip: "Attache un effet à une carte", color: "#73BEC8" },
	{ type: "setstate", name: "Set state", model: [ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "card", name: "character"}, {inout: "in", type: "state", name: "state"}, {inout: "in", type: "bool", name: "value"}, {inout: "out", type: "exe", name: " "} ], tooltip: "Modifie l'état d'un personnage", color: "#73BEC8" },
	{ type: "generate", name: "Generate", model: [ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "model", name: "model"}, {inout: "in", type: "int", name: "count"}, {inout: "in", type: "location", name: "location"}, {inout: "out", type: "exe", name: " "}, {inout: "out", type: "card", name: "card"} ], event: [ {inout: "in", type: "data", name: "data"}, {inout: "out", type: "card", name: "card"}, {inout: "out", type: "location", name: "location"} ], tooltip: "Génère des cartes sur le plateau", color: "#73BEC8" },
	{ type: "newcopy", name: "Copy", model: [ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "card", name: "model"}, {inout: "in", type: "int", name: "count"}, {inout: "in", type: "location", name: "location"}, {inout: "in", type: "bool", name: "glaze"}, {inout: "out", type: "exe", name: " "}, {inout: "out", type: "card", name: "card"} ], tooltip: "Génère des copies d'une carte existante", color: "#73BEC8" },
	{ type: "createmana", name: "Refill mana", model: [ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "area", name: "player"}, {inout: "in", type: "int", name: "max"}, {inout: "out", type: "exe", name: " "} ], event: [ {inout: "in", type: "data", name: "data"}, {inout: "out", type: "area", name: "player"}, {inout: "out", type: "int", name: "mana"} ], tooltip: "Remplit les réceptacles de mana vide d'un joueur", color: "#73BEC8" },
	{ type: "extramana", name: "Extra mana", model: [ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "area", name: "player"}, {inout: "in", type: "int", name: "mana"}, {inout: "out", type: "exe", name: " "} ], event: [ {inout: "in", type: "data", name: "data"}, {inout: "out", type: "area", name: "player"}, {inout: "out", type: "int", name: "mana"} ], tooltip: "Ajoute du mana supplémentaire à un joueur durant son tour", color: "#73BEC8" },
	{ type: "usemana", name: "Use mana", model: [ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "area", name: "player"}, {inout: "in", type: "int", name: "mana"}, {inout: "out", type: "exe", name: " "} ], event: [ {inout: "in", type: "data", name: "data"}, {inout: "out", type: "area", name: "player"}, {inout: "out", type: "int", name: "mana"} ], tooltip: "Dépense le mana d'un joueur", color: "#73BEC8" },
	{ type: "createreceptacle", name: "Create receptacle", model: [ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "area", name: "player"}, {inout: "in", type: "int", name: "count"}, {inout: "in", type: "bool", name: "filled"}, {inout: "out", type: "exe", name: " "} ], event: [ {inout: "in", type: "data", name: "data"}, {inout: "out", type: "area", name: "player"} ], tooltip: "Crée des réceptacles de mana pour un joueur", color: "#73BEC8" },
	{ type: "destroyreceptacle", name: "Destroy receptacle", model: [ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "area", name: "player"}, {inout: "in", type: "int", name: "count"}, {inout: "out", type: "exe", name: " "} ], event: [ {inout: "in", type: "data", name: "data"}, {inout: "out", type: "area", name: "player"} ], tooltip: "Détruit les réceptacles de mana d'un joueur", color: "#73BEC8" },
	{ type: "creategem", name: "Create gem", model: [ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "area", name: "player"}, {inout: "in", type: "int", name: "count"}, {inout: "out", type: "exe", name: " "} ], event: [ {inout: "in", type: "data", name: "data"}, {inout: "out", type: "area", name: "player"} ], tooltip: "Crée des gemmes pour un joueur", color: "#73BEC8" },
	{ type: "destroygem", name: "Destroy gem", model: [ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "area", name: "player"}, {inout: "in", type: "int", name: "count"}, {inout: "out", type: "exe", name: " "} ], event: [ {inout: "in", type: "data", name: "data"}, {inout: "out", type: "area", name: "player"} ], tooltip: "Détruit les gemmes d'un joueur", color: "#73BEC8" },
	{ type: "addmut", name: "Add mutation", model: [ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "card", name: "card"}, {inout: "in", type: "mutation", name: "mutation"}, {inout: "in", type: "event", name: "end"}, {inout: "out", type: "exe", name: " "} ], tooltip: "Attache une mutation à une carte", color: "#73BEC8" },
	{ type: "addaspect", name: "Add aspect", model: [ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "effect", name: "aspect"}, {inout: "in", type: "event", name: "end"}, {inout: "out", type: "exe", name: " "} ], tooltip: "Crée un aspect (effet rattaché à aucune carte)", color: "#73BEC8" },
	{ type: "addhazards", name: "Add hazards", model: [ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "location", name: "tile"}, {inout: "in", type: "hazard", name: "hazard"}, {inout: "out", type: "exe", name: " "} ], tooltip: "Applique un événement local à une case", color: "#73BEC8" },
	{ type: "clearhazards", name: "Clear hazards", model: [ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "location", name: "tile"}, {inout: "in", type: "hazard", name: "hazard"}, {inout: "out", type: "exe", name: " "} ], tooltip: "Supprime un type d'événement local d'une case", color: "#73BEC8" },
	{ type: "mutnext", name: "Mutate next card", model: [ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "cardfilter", name: "filter"}, {inout: "in", type: "mutation", name: "mutation"}, {inout: "in", type: "area", name: "player"}, {inout: "in", type: "event", name: "end"}, {inout: "out", type: "exe", name: " "} ], tooltip: "Applique une mutation à la prochaine carte jouée", color: "#73BEC8" },
	{ type: "putfl", name: "Put first/last", model: [ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "card", name: "card"}, {inout: "in", type: "location", name: "location"}, {inout: "in", type: "bool", name: "first"}, {inout: "in", type: "int", name: "position"}, {inout: "out", type: "exe", name: " "} ], tooltip: "Place une carte à la première ou dernière position d'un emplacement", color: "#73BEC8" },
	{ type: "choosebox", name: "Open choosebox", model: [ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "bool", name: "clear"}, {inout: "out", type: "exe", name: " "}, {inout: "out", type: "card", name: "choice"} ], tooltip: "Demande au joueur actuel de choisir une carte dans sa boîte de sélection", color: "#73BEC8" },
	{ type: "trigger", name: "Trigger effect", model: [ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "effect", name: "effect"}, {inout: "in", type: "location", name: "target"}, {inout: "in", type: "card", name: "source"}, {inout: "out", type: "exe", name: " "} ], tooltip: "Déclenche l'effet d'une carte avec une cible optionnelle", color: "#73BEC8" },
	{ type: "triggersecret", name: "Trigger secret", model: [ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "card", name: "secret"}, {inout: "in", type: "data", name: "data"}, {inout: "out", type: "exe", name: " "} ], tooltip: "Déclenche le secret après vérification des conditions", color: "#73BEC8" },
	{ type: "setvisibility", name: "Set visibility", model: [ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "location", name: "location"}, {inout: "in", type: "bool", name: "public"}, {inout: "out", type: "exe", name: " "} ], tooltip: "Modifie la visibilité publique d'un emplacement", color: "#73BEC8" },
	{ type: "writeintvar", name: "Store integer", model: [ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "string", name: "name"}, {inout: "in", type: "int", name: "value"}, {inout: "in", type: "card", name: "src"}, {inout: "out", type: "exe", name: " "} ], tooltip: "Enregistre un nombre entier comme variable", color: "#73BEC8" },
	{ type: "writecardvar", name: "Store card", model: [ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "string", name: "name"}, {inout: "in", type: "card", name: "value"}, {inout: "in", type: "card", name: "src"}, {inout: "out", type: "exe", name: " "} ], tooltip: "Enregistre une carte comme variable", color: "#73BEC8" },
	{ type: "writemodelvar", name: "Store model", model: [ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "string", name: "name"}, {inout: "in", type: "model", name: "value"}, {inout: "in", type: "card", name: "src"}, {inout: "out", type: "exe", name: " "} ], tooltip: "Enregistre un modèle comme variable", color: "#73BEC8" },
	{ type: "writelocvar", name: "Store location", model: [ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "string", name: "name"}, {inout: "in", type: "location", name: "value"}, {inout: "in", type: "card", name: "src"}, {inout: "out", type: "exe", name: " "} ], tooltip: "Enregistre un emplacement comme variable", color: "#73BEC8" },
	{ type: "clearvar", name: "Clear variable", model: [ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "string", name: "name"}, {inout: "in", type: "card", name: "src"}, {inout: "out", type: "exe", name: " "} ], tooltip: "Supprime une variable enregistrée", color: "#73BEC8" },
	{ type: "customevent", name: "Custom event", model: [ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "string", name: "name"}, {inout: "out", type: "exe", name: " "} ], event: [ {inout: "in", type: "data", name: "data"}, {inout: "in", type: "string", name: "name"}, {inout: "out", type: "event", name: "event"} ], tooltip: "Déclenche un événement personnalisé", color: "#73BEC8" },
	
	{ type: "canpay", name: "Can pay", model: [ {inout: "in", type: "area", name: "player"}, {inout: "in", type: "int", name: "mana"}, {inout: "out", type: "bool", name: "checked"} ], tooltip: "Vérifie si un joueur peut payer un montant de mana donné", color: "#89BC62" },
	{ type: "canreach", name: "Can reach", model: [ {inout: "in", type: "card", name: "character"}, {inout: "in", type: "card", name: "target"}, {inout: "out", type: "bool", name: "checked"} ], tooltip: "Vérifie si un personnage est à portée d'une entité à attaquer", color: "#89BC62" },
	{ type: "cmpcards", name: "Compare cards", model: [ {inout: "in", type: "card", name: "card 1"}, {inout: "in", type: "card", name: "card 2"}, {inout: "out", type: "bool", name: "same card"}, {inout: "out", type: "bool", name: "same type"}, {inout: "out", type: "bool", name: "same player"} ], tooltip: "Vérifie les similarités entre deux cartes", color: "#89BC62" },
	{ type: "cmptiles", name: "Compare tiles", model: [ {inout: "in", type: "location", name: "tile 1"}, {inout: "in", type: "location", name: "tile 2"}, {inout: "out", type: "bool", name: "same tile"}, {inout: "out", type: "bool", name: "same line"}, {inout: "out", type: "bool", name: "same field"}, {inout: "out", type: "bool", name: "neighbors"}, {inout: "out", type: "bool", name: "adjacents"}, {inout: "out", type: "int", name: "distance"} ], tooltip: "Vérifie les similarités entre deux cases", color: "#89BC62" },
	{ type: "cmplocations", name: "Compare locations", model: [ {inout: "in", type: "location", name: "location 1"}, {inout: "in", type: "location", name: "location 2"}, {inout: "out", type: "bool", name: "same location"}, {inout: "out", type: "bool", name: "same player"} ], tooltip: "Vérifie les similarités entre deux emplacements", color: "#89BC62" },
	{ type: "cmpplayers", name: "Compare players", model: [ {inout: "in", type: "area", name: "player 1"}, {inout: "in", type: "area", name: "player 2"}, {inout: "out", type: "bool", name: "same player"} ], tooltip: "Vérifie si deux joueurs sont identiques", color: "#89BC62" },
	{ type: "tiletotiles", name: "Tile to tiles", model: [ {inout: "in", type: "location", name: "tile"}, {inout: "out", type: "locations", name: "tiles"} ], tooltip: "Transforme une case en zone", color: "#89BC62" },
	{ type: "containstile", name: "Contains tile", model: [ {inout: "in", type: "locations", name: "area"}, {inout: "in", type: "location", name: "tile"}, {inout: "out", type: "bool", name: "contains"} ], tooltip: "Vérifie si une zone contient une case", color: "#89BC62" },
	{ type: "countcards", name: "Count cards", model: [ {inout: "in", type: "locations", name: "area"}, {inout: "in", type: "cardfilter", name: "filter"}, {inout: "out", type: "int", name: "count"} ], tooltip: "Compte les cartes conformes à un filtre dans une zone", color: "#89BC62" },
	{ type: "counttiles", name: "Count tiles", model: [ {inout: "in", type: "locations", name: "area"}, {inout: "in", type: "tilefilter", name: "filter"}, {inout: "out", type: "int", name: "count"} ], tooltip: "Compte les cases conformes à un filtre dans une zone", color: "#89BC62" },
	{ type: "mergeloc", name: "Merge locations", model: [ {inout: "in", type: "locations", name: "locations 1"}, {inout: "in", type: "locations", name: "locations 2"}, {inout: "out", type: "locations", name: "or"}, {inout: "out", type: "locations", name: "and"} ], tooltip: "Fusionne deux zones en une nouvelle", color: "#89BC62" },
	{ type: "editloc", name: "Edit locations", model: [ {inout: "in", type: "locations", name: "area"}, {inout: "in", type: "location", name: "location"}, {inout: "out", type: "locations", name: "add"}, {inout: "out", type: "locations", name: "remove"} ], tooltip: "Ajoute ou supprime un emplacement à une zone", color: "#89BC62" },
	{ type: "checkcard", name: "Check card", model: [ {inout: "in", type: "card", name: "card"}, {inout: "in", type: "cardfilter", name: "filter"}, {inout: "out", type: "bool", name: "checked"}, {inout: "out", type: "bool", name: "exists"} ], tooltip: "Vérifie si une carte existe ou est conforme à un filtre", color: "#89BC62" },
	{ type: "checktile", name: "Check tile", model: [ {inout: "in", type: "location", name: "tile"}, {inout: "in", type: "tilefilter", name: "filter"}, {inout: "out", type: "bool", name: "checked"} ], tooltip: "Vérifie si une case est conforme à un filtre", color: "#89BC62" },
	{ type: "checkmodel", name: "Check model", model: [ {inout: "in", type: "model", name: "model"}, {inout: "in", type: "modelfilter", name: "filter"}, {inout: "out", type: "bool", name: "checked"} ], tooltip: "Vérifie si un modèle est conforme à un filtre", color: "#89BC62" },
	{ type: "checkloc", name: "Check location", model: [ {inout: "in", type: "location", name: "location"}, {inout: "in", type: "locations", name: "area"}, {inout: "out", type: "bool", name: "checked"}, {inout: "out", type: "bool", name: "exists"} ], tooltip: "Vérifie si une case existe ou est conforme à un filtre", color: "#89BC62" },
	{ type: "checklr", name: "Check left-right", model: [ {inout: "in", type: "location", name: "left"}, {inout: "in", type: "location", name: "right"}, {inout: "out", type: "bool", name: "checked"} ], tooltip: "Vérifie si une case est à gauche/droite d'une autre", color: "#89BC62" },
	{ type: "checkeffect", name: "Check effect", model: [ {inout: "in", type: "effect", name: "effect"}, {inout: "in", type: "effecttype", name: "type"}, {inout: "out", type: "bool", name: "checked"} ], tooltip: "Vérifie qu'un effet soit d'un type donné", color: "#89BC62" },
	{ type: "cover", name: "Does cover", model: [ {inout: "in", type: "card", name: "covering"}, {inout: "in", type: "card", name: "covered"}, {inout: "out", type: "bool", name: "global"}, {inout: "out", type: "bool", name: "ground"}, {inout: "out", type: "bool", name: "air"} ], tooltip: "Vérifie qu'une entité en défend une autre", color: "#89BC62" },
	{ type: "covered", name: "Is covered", model: [ {inout: "in", type: "card", name: "card"}, {inout: "out", type: "bool", name: "global"}, {inout: "out", type: "bool", name: "ground"}, {inout: "out", type: "bool", name: "air"} ], tooltip: "Vérifie si une entité est défendue au sol ou en l'air", color: "#89BC62" },
	{ type: "filtercard", name: "Filter card", model: [ {inout: "in", type: "card", name: "card"}, {inout: "out", type: "cardfilter", name: "same"}, {inout: "out", type: "cardfilter", name: "different"}, {inout: "out", type: "cardfilter", name: "same model"}, {inout: "out", type: "modelfilter", name: "same model"} ], tooltip: "Filtre une carte spécifique", color: "#89BC62" },
	{ type: "filtermodel", name: "Filter model", model: [ {inout: "in", type: "model", name: "model"}, {inout: "out", type: "cardfilter", name: "filter"} ], tooltip: "Filtre des cartes selon leur modèle", color: "#89BC62" },
	{ type: "filterstats", name: "Filter stats", model: [ {inout: "in", type: "int", name: "min cost"}, {inout: "in", type: "int", name: "max cost"}, {inout: "in", type: "int", name: "min atk"}, {inout: "in", type: "int", name: "max atk"}, {inout: "in", type: "int", name: "min hp"}, {inout: "in", type: "int", name: "max hp"}, {inout: "in", type: "int", name: "min range"}, {inout: "in", type: "int", name: "max range"}, {inout: "out", type: "cardfilter", name: "filter"}, {inout: "out", type: "modelfilter", name: "filter"} ], tooltip: "Filtre des cartes selon leurs statistiques", color: "#89BC62" },
	{ type: "filtercovered", name: "Filter covered", model: [ {inout: "in", type: "card", name: "covering"}, {inout: "out", type: "cardfilter", name: "global"}, {inout: "out", type: "cardfilter", name: "ground"}, {inout: "out", type: "cardfilter", name: "air"} ], tooltip: "Filtre les entités défendues par un personnage", color: "#89BC62" },
	{ type: "filtercovering", name: "Filter covering", model: [ {inout: "in", type: "card", name: "covered"}, {inout: "out", type: "cardfilter", name: "global"}, {inout: "out", type: "cardfilter", name: "ground"}, {inout: "out", type: "cardfilter", name: "air"} ], tooltip: "Filtre les entités défendant un personnage", color: "#89BC62" },
	{ type: "filtereffect", name: "Filter effect", model: [ {inout: "in", type: "effecttype", name: "type"}, {inout: "out", type: "cardfilter", name: "filter"}, {inout: "out", type: "modelfilter", name: "filter"} ], tooltip: "Filtre des cartes selon leurs types d'effets", color: "#89BC62" },
	{ type: "filtervar", name: "Filter variable", model: [ {inout: "in", type: "string", name: "name"}, {inout: "out", type: "cardfilter", name: "filter"} ], tooltip: "Filtre des cartes selon l'existence d'une variable", color: "#89BC62" },
	{ type: "filterhazards", name: "Filter hazards", model: [ {inout: "in", type: "hazard", name: "hazard"}, {inout: "out", type: "tilefilter", name: "filter"} ], tooltip: "Filtre des cases selon la présence d'un événement local", color: "#89BC62" },
	{ type: "revcfilter", name: "Reverse card filter", model: [ {inout: "in", type: "cardfilter", name: "filter"}, {inout: "out", type: "cardfilter", name: "result"} ], tooltip: "Inverse le résultat d'un filtre de cartes", color: "#89BC62" },
	{ type: "revtfilter", name: "Reverse tile filter", model: [ {inout: "in", type: "tilefilter", name: "filter"}, {inout: "out", type: "tilefilter", name: "result"} ], tooltip: "Inverse le résultat d'un filtre de cases", color: "#89BC62" },
	{ type: "revmfilter", name: "Reverse model filter", model: [ {inout: "in", type: "modelfilter", name: "filter"}, {inout: "out", type: "modelfilter", name: "result"} ], tooltip: "Inverse le résultat d'un filtre de modèles", color: "#89BC62" },
	{ type: "mergecfilters", name: "Merge card filters", model: [ {inout: "in", type: "cardfilter", name: "filter 1"}, {inout: "in", type: "cardfilter", name: "filter 2"}, {inout: "out", type: "cardfilter", name: "or"}, {inout: "out", type: "cardfilter", name: "and"} ], tooltip: "Fusionne deux filtres de cartes en un nouveau", color: "#89BC62" },
	{ type: "mergetfilters", name: "Merge tile filters", model: [ {inout: "in", type: "tilefilter", name: "filter 1"}, {inout: "in", type: "tilefilter", name: "filter 2"}, {inout: "out", type: "tilefilter", name: "or"}, {inout: "out", type: "tilefilter", name: "and"} ], tooltip: "Fusionne deux filtres de cases en un nouveau", color: "#89BC62" },
	{ type: "mergemfilters", name: "Merge model filters", model: [ {inout: "in", type: "modelfilter", name: "filter 1"}, {inout: "in", type: "modelfilter", name: "filter 2"}, {inout: "out", type: "modelfilter", name: "or"}, {inout: "out", type: "modelfilter", name: "and"} ], tooltip: "Fusionne deux filtres de modèles en un nouveau", color: "#89BC62" },
	{ type: "ctotfilter", name: "Card to tile filter", model: [ {inout: "in", type: "cardfilter", name: "contains"}, {inout: "out", type: "tilefilter", name: "filter"} ], tooltip: "Transforme un filtre de cartes en filtre de cases vérifiant la carte sur la case", color: "#89BC62" },
	{ type: "mergemut", name: "Merge mutations", model: [ {inout: "in", type: "mutation", name: "mutation 1"}, {inout: "in", type: "mutation", name: "mutation 2"}, {inout: "out", type: "mutation", name: "result"} ], tooltip: "Fusionne deux mutations en une nouvelle", color: "#89BC62" },
	{ type: "conditionmut", name: "Conditional mutation", model: [ {inout: "in", type: "mutation", name: "mutation"}, {inout: "in", type: "bool", name: "condition"}, {inout: "out", type: "mutation", name: "result"} ], tooltip: "Applique une mutation sous une condition donnée", color: "#89BC62" },
	{ type: "conditiontarget", name: "Conditional target", model: [ {inout: "in", type: "tilefilter", name: "filter"}, {inout: "in", type: "bool", name: "condition"}, {inout: "out", type: "tilefilter", name: "result"} ], tooltip: "Invalide toute case cible tant qu'une condition n'est pas remplie", color: "#89BC62" },
	{ type: "level", name: "Level", model: [ {inout: "in", type: "card", name: "hero"}, {inout: "out", type: "int", name: "level"} ], tooltip: "Récupère le niveau d'un héros", color: "#89BC62" },
	{ type: "poisoned", name: "Poisoned", model: [ {inout: "in", type: "card", name: "character"}, {inout: "out", type: "bool", name: "poisoned"}, {inout: "out", type: "int", name: "poison"} ], tooltip: "Vérifie si un personnage est empoisonnée", color: "#89BC62" },
	{ type: "hasshield", name: "Has shield", model: [ {inout: "in", type: "card", name: "character"}, {inout: "out", type: "bool", name: "checked"}, {inout: "out", type: "cardfilter", name: "filter"} ], tooltip: "Vérifie si un personnage a un bouclier", color: "#89BC62" },
	{ type: "target", name: "Target data", model: [ {inout: "in", type: "card", name: "source"}, {inout: "out", type: "tilefilter", name: "target"}, {inout: "out", type: "bool", name: "has target"} ], tooltip: "Récupère les cibles possibles pour résoudre l'effet d'une carte", color: "#89BC62" },
	
	{ type: "brkcard", name: "Break card", model: [ {inout: "in", type: "card", name: "card"}, {inout: "out", type: "model", name: "model"}, {inout: "out", type: "location", name: "location"}, {inout: "out", type: "area", name: "player"}, {inout: "out", type: "cardfilter", name: "type"}, {inout: "out", type: "int", name: "mana"}, {inout: "out", type: "int", name: "atk"}, {inout: "out", type: "int", name: "hp"}, {inout: "out", type: "int", name: "range"}, {inout: "out", type: "int", name: "overload"}, {inout: "out", type: "bool", name: "damaged"}, {inout: "out", type: "bool", name: "destroyed"} ], tooltip: "Récupère les informations concernant une carte", color: "#e59c3d" },
	{ type: "basestats", name: "Base stats", model: [ {inout: "in", type: "card", name: "card"}, {inout: "out", type: "int", name: "mana"}, {inout: "out", type: "int", name: "atk"}, {inout: "out", type: "int", name: "hp"}, {inout: "out", type: "int", name: "range"}, {inout: "out", type: "int", name: "overload"} ], tooltip: "Récupère les statistiques de base d'une carte", color: "#e59c3d" },
	{ type: "brkmodel", name: "Break model", model: [ {inout: "in", type: "model", name: "model"}, {inout: "out", type: "cardfilter", name: "type"}, {inout: "out", type: "int", name: "mana"}, {inout: "out", type: "int", name: "atk"}, {inout: "out", type: "int", name: "hp"}, {inout: "out", type: "int", name: "range"} ], tooltip: "Récupère les informations concernant un modèle de carte", color: "#e59c3d" },
	{ type: "brktile", name: "Break tile", model: [ {inout: "in", type: "location", name: "tile"}, {inout: "out", type: "locations", name: "field"}, {inout: "out", type: "area", name: "player"}, {inout: "out", type: "bool", name: "front"}, {inout: "out", type: "bool", name: "empty"}, {inout: "out", type: "card", name: "entity"}, {inout: "out", type: "locations", name: "neighbors"}, {inout: "out", type: "locations", name: "adjacents"}, {inout: "out", type: "locations", name: "ahead"}, {inout: "out", type: "locations", name: "behind"}, {inout: "out", type: "locations", name: "line"}, {inout: "out", type: "location", name: "left"}, {inout: "out", type: "location", name: "right"}, {inout: "out", type: "location", name: "mirror"} ], tooltip: "Récupère les informations concernant une case", color: "#e59c3d" },
	{ type: "brklocation", name: "Break location", model: [ {inout: "in", type: "location", name: "location"}, {inout: "out", type: "area", name: "player"}, {inout: "out", type: "int", name: "count"}, {inout: "out", type: "bool", name: "empty"} ], tooltip: "Récupère les informations concernant un emplacement", color: "#e59c3d" },
	{ type: "brkplayer", name: "Break player", model: [ {inout: "in", type: "area", name: "player"}, {inout: "out", type: "locations", name: "field"}, {inout: "out", type: "location", name: "hand"}, {inout: "out", type: "location", name: "deck"}, {inout: "out", type: "area", name: "opponent"}, {inout: "out", type: "bool", name: "playing"} ], tooltip: "Récupère les informations concernant un joueur", color: "#FFA126" },
	
	{ type: "archetype", name: "Archetype", model: [ {inout: "in", type: "string", name: "name"}, {inout: "out", type: "cardfilter", name: "filter"}, {inout: "out", type: "modelfilter", name: "filter"} ], tooltip: "Filtre des cartes selon leur archétype", color: "#670e6b" },
	{ type: "category", name: "Category", model: [ {inout: "in", type: "string", name: "name"}, {inout: "out", type: "cardfilter", name: "filter"}, {inout: "out", type: "modelfilter", name: "filter"} ], tooltip: "Filtre des cartes selon leur catégorie", color: "#670e6b" },
	{ type: "color", name: "Color", model: [ {inout: "in", type: "color", name: "color"}, {inout: "out", type: "cardfilter", name: "filter"}, {inout: "out", type: "modelfilter", name: "filter"} ], tooltip: "Filtre des cartes selon leur couleur", color: "#670e6b" },
	{ type: "token", name: "Token", model: [ {inout: "in", type: "int", name: "no"}, {inout: "out", type: "model", name: "model"} ], tooltip: "Récupère le modèle d'un jeton associé à la carte", color: "#670e6b" },
	{ type: "limitbrk", name: "Limit break", model: [ {inout: "out", type: "int", name: "bonus"} ], tooltip: "Bonus de valeur numérique associé à la surcharge", color: "#670e6b" },
	{ type: "current", name: "Current player", model: [ {inout: "out", type: "area", name: "player"} ], tooltip: "Joueur dont c'est le tour", color: "#670e6b" },
	{ type: "manapool", name: "Mana pool", model: [ {inout: "in", type: "area", name: "player"}, {inout: "out", type: "int", name: "mana"}, {inout: "out", type: "int", name: "receptacles"}, {inout: "out", type: "int", name: "gems"} ], tooltip: "Informations sur le mana d'un joueur", color: "#670e6b" },
	{ type: "innerdata", name: "Mutant", model: [ {inout: "out", type: "card", name: "target"} ], tooltip: "Carte pour laquelle s'effectue le calcul de mutation en cours", color: "#670e6b" },
	{ type: "innerdata", name: "Analysed event", model: [ {inout: "out", type: "data", name: "data"} ], tooltip: "Données de l'événement pour lequel s'effectue l'analyse en cours", color: "#670e6b" },
	{ type: "intvar", name: "Int variable", model: [ {inout: "in", type: "string", name: "name"}, {inout: "in", type: "card", name: "src"}, {inout: "out", type: "int", name: "value"}, {inout: "out", type: "bool", name: "exists"} ], tooltip: "Récupère un nombre entier enregistré", color: "#670e6b" },
	{ type: "cardvar", name: "Card variable", model: [ {inout: "in", type: "string", name: "name"}, {inout: "in", type: "card", name: "src"}, {inout: "out", type: "card", name: "value"}, {inout: "out", type: "bool", name: "exists"} ], tooltip: "Récupère une carte enregistrée", color: "#670e6b" },
	{ type: "modelvar", name: "Model variable", model: [ {inout: "in", type: "string", name: "name"}, {inout: "in", type: "card", name: "src"}, {inout: "out", type: "model", name: "value"}, {inout: "out", type: "bool", name: "exists"} ], tooltip: "Récupère un modèle enregistré", color: "#670e6b" },
	{ type: "locvar", name: "Location variable", model: [ {inout: "in", type: "string", name: "name"}, {inout: "in", type: "card", name: "src"}, {inout: "out", type: "location", name: "value"}, {inout: "out", type: "bool", name: "exists"} ], tooltip: "Récupère un emplacement enregistré", color: "#670e6b" },
	
	{ type: "timestamp", name: "Timestamp", model: [ {inout: "in", type: "timestamp", name: "timestamp"}, {inout: "out", type: "event", name: "event"} ], tooltip: "L'événement associé à un événement temporel", color: "#212121" },
	{ type: "analyse", name: "Analyse", model: [ {inout: "in", type: "event", name: "event"}, {inout: "in", type: "period", name: "period"}, {inout: "in", type: "bool", name: "condition"}, {inout: "out", type: "bool", name: "happened"}, {inout: "out", type: "int", name: "count"} ], tooltip: "Compte le nombre d'événements s'étant produits sur une période donnée", color: "#212121" },
	{ type: "extremum", name: "Extremum", model: [ {inout: "in", type: "locations", name: "area"}, {inout: "in", type: "cardfilter", name: "filter"}, {inout: "out", type: "card", name: "lowest cost"}, {inout: "out", type: "card", name: "highest cost"}, {inout: "out", type: "card", name: "lowest atk"}, {inout: "out", type: "card", name: "highest atk"}, {inout: "out", type: "card", name: "lowest hp"}, {inout: "out", type: "card", name: "highest hp"} ], tooltip: "Trouve la carte avec le plus ou le moins de statistiques", color: "#212121" },
	{ type: "findcard", name: "Find random card", model: [ {inout: "in", type: "locations", name: "area"}, {inout: "in", type: "cardfilter", name: "filter"}, {inout: "out", type: "card", name: "result"}, {inout: "out", type: "bool", name: "found"} ], tooltip: "Trouve une carte aléatoire dans une zone donnée", color: "#212121" },
	{ type: "findtile", name: "Find random tile", model: [ {inout: "in", type: "locations", name: "area"}, {inout: "in", type: "tilefilter", name: "filter"}, {inout: "out", type: "location", name: "result"}, {inout: "out", type: "bool", name: "found"} ], tooltip: "Trouve une case aléatoire dans une zone donnée", color: "#212121" },
	{ type: "findmodel", name: "Find random model", model: [ {inout: "in", type: "modelfilter", name: "filter"}, {inout: "out", type: "model", name: "result"}, {inout: "out", type: "bool", name: "found"} ], tooltip: "Trouve un modèle de carte aléatoire", color: "#212121" },
	{ type: "findevent", name: "Find random event", model: [ {inout: "in", type: "event", name: "event"}, {inout: "in", type: "period", name: "period"}, {inout: "in", type: "bool", name: "condition"}, {inout: "out", type: "data", name: "result"}, {inout: "out", type: "bool", name: "found"} ], tooltip: "Trouve un événement aléatoire sur une période donnée", color: "#212121" },
	{ type: "randint", name: "Random int", model: [ {inout: "in", type: "int", name: "min"}, {inout: "in", type: "int", name: "max"}, {inout: "out", type: "int", name: "result"} ], tooltip: "Donne un nombre entier aléatoire entre deux seuils", color: "#212121" },
	{ type: "randbool", name: "Random bool", model: [ {inout: "out", type: "bool", name: "result"} ], tooltip: "Donne aléatoirement vrai ou faux", color: "#212121" },
	
	{ type: "branch", name: "Branch", model: [ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "bool", name: "condition"}, {inout: "out", type: "exe", name: "true"}, {inout: "out", type: "exe", name: "false"} ], tooltip: "Appelle des scripts differents selon une condition", color: "#C0C0C0" },
	{ type: "loop", name: "Loop", model: [ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "int", name: "times"}, {inout: "in", type: "bool", name: "condition"}, {inout: "out", type: "exe", name: "completed"}, {inout: "out", type: "exe", name: "loop"}, {inout: "out", type: "int", name: "index"} ], tooltip: "Appelle un script plusieurs fois", color: "#C0C0C0" },
	{ type: "timer", name: "Timer", model: [ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "timestamp", name: "timestamp"}, {inout: "out", type: "exe", name: " "}, {inout: "out", type: "exe", name: "callback"} ], tooltip: "Appelle un script plus tard dans la partie", color: "#C0C0C0" },
	//{ type: "watchdog", name: "Watchdog", model: [ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "event", name: "event"}, {inout: "in", type: "event", name: "end"}, {inout: "out", type: "exe", name: " "}, {inout: "out", type: "exe", name: "callback"} ], tooltip: "Setup a watchdog calling a script whenever a specific event is handled", color: "#C0C0C0" },
	{ type: "aoe", name: "For each card", model: [ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "locations", name: "area"}, {inout: "in", type: "cardfilter", name: "targets"}, {inout: "out", type: "exe", name: "completed"}, {inout: "out", type: "exe", name: "for each"}, {inout: "out", type: "card", name: "card"} ], tooltip: "Appelle un script pour chaque carte dans une zone donnée", color: "#C0C0C0" },
	{ type: "fortile", name: "For each tile", model: [ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "locations", name: "area"}, {inout: "in", type: "tilefilter", name: "targets"}, {inout: "out", type: "exe", name: "completed"}, {inout: "out", type: "exe", name: "for each"}, {inout: "out", type: "location", name: "tile"} ], tooltip: "Appelle un script pour chaque case dans une zone donnée", color: "#C0C0C0" },
	{ type: "foreffect", name: "For each effect", model: [ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "card", name: "card"}, {inout: "in", type: "effecttype", name: "type"}, {inout: "out", type: "exe", name: "completed"}, {inout: "out", type: "exe", name: "for each"}, {inout: "out", type: "effect", name: "effect"} ], tooltip: "Appelle un script pour chaque effet d'une carte", color: "#C0C0C0" },
	{ type: "forevent", name: "For each event", model: [ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "event", name: "event"}, {inout: "in", type: "period", name: "period"}, {inout: "in", type: "bool", name: "condition"}, {inout: "out", type: "exe", name: "completed"}, {inout: "out", type: "exe", name: "for each"}, {inout: "out", type: "data", name: "data"} ], tooltip: "Appelle un script pour chaque événement s'étant produit sur une période donnée", color: "#C0C0C0" },
	{ type: "flcards", name: "First/last cards", model: [ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "location", name: "location"}, {inout: "in", type: "bool", name: "first"}, {inout: "in", type: "int", name: "count"}, {inout: "in", type: "cardfilter", name: "filter"}, {inout: "out", type: "exe", name: "completed"}, {inout: "out", type: "exe", name: "for each"}, {inout: "out", type: "card", name: "card"} ], tooltip: "Appelle un script pour les premières ou dernières cartes d'un emplacement", color: "#C0C0C0" },
	
	{ type: "extraturn", name: "Extra turn", model: [ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "area", name: "player"}, {inout: "out", type: "exe", name: " "} ], tooltip: "Accorde un tour supplémentaire à un joueur", color: "#C752A2" },
	
	{ type: "wait", name: "Wait", model: [ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "int", name: "ms"}, {inout: "out", type: "exe", name: " "} ], tooltip: "Attend un peu de temps avant de continuer le script (millisecondes)", color: "#2196F3" },
	{ type: "blink", name: "Blink", model: [ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "card", name: "card"}, {inout: "out", type: "exe", name: " "} ], tooltip: "Affiche l'effet visuel d'un déclencheur pour une carte", color: "#2196F3" },
	{ type: "message", name: "Message", model: [ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "string", name: "text"}, {inout: "in", type: "area", name: "player"}, {inout: "out", type: "exe", name: " "} ], tooltip: "Affiche un message à un joueur", color: "#2196F3" },
	//{ type: "quote", name: "Quote", model: [ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "string", name: "text"}, {inout: "in", type: "card", name: "src"}, {inout: "out", type: "exe", name: " "} ], tooltip: "Display a quote using a card illustration", color: "#2196F3" },
	{ type: "highlight", name: "Highlight", model: [ {inout: "in", type: "exe", name: " "}, {inout: "in", type: "card", name: "card"}, {inout: "in", type: "area", name: "player"}, {inout: "out", type: "exe", name: " "} ], tooltip: "Met une carte en valeur pour un joueur jusqu'à ce qu'il agisse", color: "#2196F3" },
	
	{ type: "opplus", name: "+", model: [ {inout: "in", type: "int", name: " "}, {inout: "in", type: "int", name: " "}, {inout: "out", type: "int", name: " "} ], tooltip: "Ajoute deux nombres entiers", color: "#202020" },
	{ type: "opminus", name: "-", model: [ {inout: "in", type: "int", name: " "}, {inout: "in", type: "int", name: " "}, {inout: "out", type: "int", name: " "} ], tooltip: "Soustrait un nombre entier à un autre", color: "#202020" },
	{ type: "optimes", name: "x", model: [ {inout: "in", type: "int", name: " "}, {inout: "in", type: "int", name: " "}, {inout: "out", type: "int", name: " "} ], tooltip: "Multiplie deux nombres entiers", color: "#202020" },
	{ type: "opdiv", name: "/", model: [ {inout: "in", type: "int", name: " "}, {inout: "in", type: "int", name: " "}, {inout: "out", type: "int", name: " "} ], tooltip: "Divise un nombre entier par un autre", color: "#202020" },
	{ type: "opmod", name: "%", model: [ {inout: "in", type: "int", name: " "}, {inout: "in", type: "int", name: " "}, {inout: "out", type: "int", name: " "} ], tooltip: "Trouve le reste après une division entière entre deux nombres", color: "#202020" },
	{ type: "opter", name: "?", model: [ {inout: "in", type: "bool", name: " "}, {inout: "in", type: "int", name: "true"}, {inout: "in", type: "int", name: "false"}, {inout: "out", type: "int", name: " "} ], tooltip: "Donne un nombre entier ou un autre selon un booléen", color: "#202020" },
	{ type: "opnot", name: "!", model: [ {inout: "in", type: "bool", name: " "}, {inout: "out", type: "bool", name: " "} ], tooltip: "Inverse la valeur d'un booléen", color: "#202020" },
	{ type: "opand", name: "&", model: [ {inout: "in", type: "bool", name: " "}, {inout: "in", type: "bool", name: " "}, {inout: "out", type: "bool", name: " "} ], tooltip: "Vérifie si deux booléens sont vrais", color: "#202020" },
	{ type: "opor", name: "|", model: [ {inout: "in", type: "bool", name: " "}, {inout: "in", type: "bool", name: " "}, {inout: "out", type: "bool", name: " "} ], tooltip: "Vérifie si au moins un booléen est vrai", color: "#202020" },
	{ type: "opxor", name: "⊕", model: [ {inout: "in", type: "bool", name: " "}, {inout: "in", type: "bool", name: " "}, {inout: "out", type: "bool", name: " "} ], tooltip: "Vérifie si exactement un booléen est vrai", color: "#202020" },
	{ type: "ope", name: "=", model: [ {inout: "in", type: "int", name: " "}, {inout: "in", type: "int", name: " "}, {inout: "out", type: "bool", name: " "} ], tooltip: "Vérifie si deux nombres entiers sont égaux", color: "#202020" },
	{ type: "opne", name: "!=", model: [ {inout: "in", type: "int", name: " "}, {inout: "in", type: "int", name: " "}, {inout: "out", type: "bool", name: " "} ], tooltip: "Vérifie si deux nombres entiers sont différents", color: "#202020" },
	{ type: "opg", name: ">", model: [ {inout: "in", type: "int", name: " "}, {inout: "in", type: "int", name: " "}, {inout: "out", type: "bool", name: " "} ], tooltip: "Vérifie si un nombre entier est strictement supérieur à un autre", color: "#202020" },
	{ type: "opl", name: "<", model: [ {inout: "in", type: "int", name: " "}, {inout: "in", type: "int", name: " "}, {inout: "out", type: "bool", name: " "} ], tooltip: "Vérifie si un nombre entier est strictement inférieur à un autre", color: "#202020" },
	{ type: "opge", name: ">=", model: [ {inout: "in", type: "int", name: " "}, {inout: "in", type: "int", name: " "}, {inout: "out", type: "bool", name: " "} ], tooltip: "Vérifie si un nombre entier est supérieur ou égal à un autre", color: "#202020" },
	{ type: "ople", name: "<=", model: [ {inout: "in", type: "int", name: " "}, {inout: "in", type: "int", name: " "}, {inout: "out", type: "bool", name: " "} ], tooltip: "Vérifie si un nombre entier est inférieur ou égal à un autre", color: "#202020" },
	{ type: "opmax", name: "MAX", model: [ {inout: "in", type: "int", name: " "}, {inout: "in", type: "int", name: " "}, {inout: "out", type: "int", name: " "} ], tooltip: "Donne le maximum entre deux nombres entiers", color: "#202020" },
	{ type: "opmin", name: "MIN", model: [ {inout: "in", type: "int", name: " "}, {inout: "in", type: "int", name: " "}, {inout: "out", type: "int", name: " "} ], tooltip: "Donne le minimum entre deux nombres entiers", color: "#202020" }
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

		var node = new Node("basis", "Base", "#C0C0C0");
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