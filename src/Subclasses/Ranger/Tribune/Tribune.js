/*  -WHAT IS THIS?-
	The script featured here is made as an optional addition to "MPMB's Character Record Sheet" found at http://flapkan.com/mpmb/dmsguild
	You can add the content to the Character Sheet's functionality by adding the script below in the "Add Custom Script" dialogue.
	-KEEP IN MIND-
	Note that you can add as many custom codes as you want, but you have to add the code in at once (i.e. copy all the code into a single, long file and copy that into the sheet).
	It is recommended to enter the code in a fresh sheet before adding any other information.
 */

/*  -INFORMATION-
	Subject:	Subclass
	Effect:		This script adds a subclass for the Ranger, called "Tribune"
				This is a homebrew class designed by mcclowes
	Code by:	mcclowes
	Date:		2017-11-29 (sheet v12.999)
 */

var iFileName = "Tribune.js";
RequiredSheetVersion(12.999);

AddSubClass("ranger", "tribune", {
  regExpSearch: /tribune/i,
  subname: "Tribune",
  source: ["HB", 0],
  fullname: "Tribune",
  spellcastingKnown: {
    cantrips: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    spells: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  },
  features: {
    subclassfeature3: {
      name: "Tribune Magic",
      source: ["HB", 0],
      minlevel: 3,
      description:
        "\n   " +
        "I don't know any spells, aside from those acquired through Arcane Well. Spells I cast are removed from my spell book. I forget spells after short and long rests.",
    },
    "subclassfeature3.1": {
      name: "Arcane Well",
      source: ["HB", 0],
      minlevel: 3,
      description: "\n   " + "I can store and recast spells cast at me.",
      spellcastingBonus: [
        {
          name: "Arcane Well",
          spells: ["arcane well"],
          selection: ["arcane well"],
          atwill: true,
        },
      ],
      action: ["reaction", ""],
    },
    "subclassfeature3.2": {
      name: "Consume Magic",
      source: ["HB", 0],
      minlevel: 3,
      description:
        "\n   " +
        "I can remove a spell from my spell book as a bonus action. If I do so, I regain D4 + the spell's level HP",
      spellcastingBonus: [
        {
          name: "Consume Magic",
          spells: ["consume magic"],
          selection: ["consume magic"],
          atwill: true,
        },
      ],
      action: ["bonus action", ""],
    },
    "subclassfeature3.3": {
      name: "Reckless",
      source: ["HB", 0],
      minlevel: 3,
      description:
        "\n   " + "I'm habituated to danger, often putting myself at risk.",
      eval: 'AddACMisc(-1, "Reckless")',
    },
    subclassfeature7: {
      name: "Mage Slayer",
      source: ["XGTE", 0],
      minlevel: 7,
      description:
        "\n   " +
        "I have practiced techniques useful in melee combat against spellcasters, gaining the following benefits:" +
        "\n 	" +
        "- When a creature within 5 feet of me casts a spell, I can use my reaction to make a melee weapon attack against that creature." +
        "\n 	" +
        "- When I damage a creature that is concentrating on a spell, that creature has disadvantage on the saving throw it makes to maintain its concentration." +
        "\n 	" +
        "- I have advantage on saving throws against spells cast by creatures within 5 feet of me.",
      action: ["reaction", ""],
    },
    "subclassfeature7.1": {
      name: "Magic Hunter",
      source: ["HB", 0],
      minlevel: 7,
      description:
        "\n   " +
        "I am attuned to the arcane and can cast Detect Magic at will",
      spellcastingBonus: [
        {
          name: "Magic Hunter (Detect Magic)",
          spells: ["detect magic"],
          selection: ["detect magic"],
          atwill: true,
        },
      ],
    },
    subclassfeature11: {
      name: "Improved Arcane Well",
      source: ["HB", 0],
      minlevel: 11,
      description:
        "\n   " +
        "When a creature misses me or an ally within range, I can use my reaction to retaliate" +
        "\n   " +
        "I can make an immediate attack with a melee or loaded firearm against the creature",
      spellcastingBonus: [
        {
          name: "Antimagic Field",
          spells: ["antimagic field"],
          selection: ["antimagic field"],
          uses: 1,
          recovery: "long rest",
          atwill: true,
        },
        {
          name: "Improved Arcane Well",
          spells: ["improved arcane well"],
          selection: ["improved arcane well"],
          action: ["reaction", ""],
          atwill: true,
        },
      ],
      action: ["reaction", ""],
    },
    "subclassfeature11.1": {
      name: "Preserve Magic",
      source: ["HB", 0],
      minlevel: 11,
      description:
        "\n   " +
        "I may preserve one spell in my spell book after a short rest.",
    },
    subclassfeature15: {
      name: "Predict Magic",
      source: ["HB", 0],
      minlevel: 15,
      description:
        "\n   " + "I can sense spells being cast and warn myself and others.",
      action: ["reaction", ""],
      usages: "Wisdom modifier per ",
      usagescalc: "event.value = Math.min(1, tDoc.getField('Wis Mod').value);",
      recovery: "long rest",
    },
    "subclassfeature15.1": {
      name: "Disenchant Artefact",
      source: ["HB", 0],
      minlevel: 15,
      description:
        "\n   " +
        "1 hour concentration. Arcane check. On success, magic item is disenchanted.",
      action: ["action", ""],
    },
  },
});

if (!SourceList["Y:TGD"]) {
  SourceList["Y:TGD"] = {
    name: "Yarzun: The Great Descent",
    abbreviation: "Y:TGD",
    group: "Yarzun",
    url: "https://mcclowes.com",
    date: "2018/01/01",
  };
}

SpellsList["arcane well"] = {
  name: "Arcane Well",
  classes: [],
  ritual: false,
  level: 2,
  school: "Evoc",
  time: "Instant",
  duration: "Instantaneous",
  save: "DC12 + spell lvl",
  description:
    "Negate spell, DC12 + spell level. Add spell to spell book at level cast",
  descriptionFull:
    "DC equal to 12 + the spell's level, modified by your intelligence modifier (make this instead of any check or saving throw you would normally make). On a success, you absorb the magical energy and the spell has no effect. Add the spell to your spell book. Arcane Well must be cast at the level of the spell you are absorbing. Spells cast with a critical roll cannot be absorbed. When you fail to absorb a spell with arcane well you take (an additional) D4 damage per level of the spell.",
  atwill: true,
};

SpellsList["improved arcane well"] = {
  name: "Improved Arcane Well",
  classes: [],
  ritual: false,
  level: 4,
  school: "Evoc",
  time: "Instant",
  duration: "Instantaneous",
  save: "DC12 + spell lvl",
  description:
    "Negate spell, DC12 + spell level. Add spell to spell book at level cast",
  descriptionFull:
    "DC equal to 12 + the spell's level, modified by your intelligence modifier (make this instead of any check or saving throw you would normally make). On a success, you absorb the magical energy and the spell has no effect. Add the spell to your spell book. Arcane Well must be cast at the level of the spell you are absorbing. Spells cast with a critical roll cannot be absorbed. When you fail to absorb a spell with arcane well you take (an additional) D4 damage per level of the spell.",
  atwill: true,
};

SpellsList["consume magic"] = {
  name: "Consume Magic",
  classes: [],
  ritual: false,
  level: 1,
  school: "Evoc",
  time: "1 ba",
  duration: "Instantaneous",
  description:
    "Remove a spell from your spell book. Heal D4 + the spell's level",
  atwill: true,
};
