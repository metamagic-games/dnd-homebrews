/*	-WHAT IS THIS?-
	This file adds optional material to "MPMB's Character Record Sheet" found at https://flapkan.com/mpmb/charsheets
	Import this file using the "Add Extra Materials" bookmark.

	-KEEP IN MIND-
	It is recommended to enter the code in a fresh sheet before adding any other information (i.e. before making your character with it).
*/

/*	-INFORMATION-
	Subject:	Race
	Effect:		This script adds a player race, called "Pearl"
				This race is made by Max Clayton Clowes
	Code by:	Max Clayton Clowes
	Date:		2019-10-24 (sheet v12.999)
*/

var iFileName = "Pearl.js";
RequiredSheetVersion(12.999);

SourceList["MM:K"] = {
	name : "Max Clayton Clowes: Pearl player race",
	abbreviation : "MM:K",
	group : "Dungeon Masters Guild",
	url : "https://www.dmsguild.com/product/171361/",
	date : "2016/01/18"
};

RaceList["pearl"] = {
	regExpSearch : /pearl/i,
	name : "Pearl",
	source : ["MM:K", 0],
	plural : "Pearls",
	size : 3,
	speed : {
		walk : { spd : 0, enc : 0 }
	},
	languageProfs : ["Common", 3],
	vision : [["Same as host", 0]],
	age : " reach adulthood around 50 years and live around 1000 to 5000 years",
	height : " have no physical form",
	weight : "",
	improvements : "Pearl: +2 Intelligence, +2 Wisdom, -5 Constitution;",
	scores : [0, 0, -5, 2, 2, 0],
	trait : "Pearl (+2 Intelligence and Wisdom, -5 Constitution)\nPearl Magic: 1st level: Message cantrip; 3rd level: Command at 1st-level, once per short rest; 5th level: Charm Person at 2nd-level, once per long rest; Both spells can be cast without material components. Intelligence is my spellcasting ability for these.\nInavde mind: As an action, once per 30 days, I can try to invade the mind of any humanoid of intelligence 10 or greater, and of size Medium or less. The target must pass a Wisdom saving throw or be invaded.\nThe host can resist, but I gains full control after three consecutive failures and cannot be resisted. This resets if the Pearl ever voluntarily gives control back to the host.\nI can be targeted by psychic attackes, and all psychic attacks targeting my host hit by me instead. If my hit points are reduced to 0, I die without making death saving throws.",
	addarmor : "Natural Armor",
	abilitySave : 4,
	skills : ["History",],
	spellcastingAbility : 4,
	spellcastingBonus : {
		name : "Pearl Magic 1",
		spells : ["message"],
		selection : ["message"]
	},
	features : {
		"invasive mind" : {
			name : "Invasive Mind",
			minlevel : 1,
			usages : "1",
			action : ["action", ""],
			recovery : "30 days"
		},
		"command" : {
			name : "Command (level 1)",
			minlevel : 3,
			tooltip : " (Pearl Magic)",
			action : ["action", ""],
			usages : 1,
			recovery : "short rest",
			spellcastingBonus : {
				name : "Pearl Magic 3",
				spells : ["command"],
				selection : ["command"],
				oncesr : true
			}
		},
		"charm person" : {
			name : "Charm Person (level 2)",
			minlevel : 5,
			tooltip : " (Pearl Magic)",
			action : ["action", ""],
			usages : 1,
			recovery : "long rest",
			spellcastingBonus : {
				name : "Pearl Magic 5",
				spells : ["charm person"],
				selection : ["charm person"],
				oncelr : true
			}
		},
	}
};
