/*  -WHAT IS THIS?-
  This file adds optional material to "MPMB's Character Record Sheet" found at https://flapkan.com/mpmb/charsheets
  Import this file using the "Add Extra Materials" bookmark.

  -KEEP IN MIND-
  It is recommended to enter the code in a fresh sheet before adding any other information (i.e. before making your character with it).
*/

/*  -INFORMATION-
  Subject:  Class
  Effect:   This script adds a class called "Warden" (v1.1) and the three subclasses for it: "Soul Essence: Vengeful", "Order of the Profane Soul", "Order of the Mutant", and "Order of the Lycan" (v1.5)

  Code by:  Metamagic Games
  Date:   2020-04-26 (sheet v12.999)

  Please support the creator of this content.
*/

var iFileName = "Warden.js";
RequiredSheetVersion(12.999);

SourceList["MG:W"] = {
  name : "Metamagic Games: Warden Class v1.1",
  abbreviation : "MG:W",
  group : "Metamagic Games",
  url : "https://github.com/metamagic-games/dnd-homebrews/blob/master/src/Classes/Warden/Warden.md",
  date : "2018/06/07"
};

ClassList["warden"] = {
  regExpSearch : /^(?=.*warden).*$/i,
  name : "Warden",
  source : ["MG:W", 0],
  primaryAbility : "\n \u2022 Warden: Constitution, and Charisma;",
  prereqs : "\n \u2022 Warden: Constitution 13, and Charisma 13;",
  die : 12,
  improvements : [0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 5, 5],
  saves : ["Con", "Cha"],
  skills : ["\n\n" + toUni("Warden") + ": Choose two from Insight, Intimidation, Medicine, Perception, Stealth, and Survival."],
  toolProfs : {
    primary : null,
    secondary : null
  },
  armor : [
    [true, true, false, true],
    [true, true, false, true]
  ],
  weapons : [
    [true, false],
    [true, false]
  ],
  equipment : "Warden starting equipment:\n \u2022 leather armor;\n \u2022 A short sword or a club;\n \u2022 An explorer's pack.\n\nAlternatively, choose 4d4 \xD7 10 gp worth of starting equipment instead of both the class' and the background's starting equipment.",
  subclasses : ["Warden Soul Essences", ["warden-soul-essence of the ghostslayer", "warden-soul-essence of the lycan", "warden-soul-essence of the mutant", "warden-soul-essence of the profane soul"]],
  attacks : [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  spellcastingFactor : 1,
  spellcastingTable : [
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 0, 0, 0, 0, 0, 0, 0],
    [2, 1, 1, 0, 0, 0, 0, 0, 0],
    [2, 1, 1, 0, 0, 0, 0, 0, 0],
    [2, 2, 1, 1, 0, 0, 0, 0, 0],
    [2, 2, 1, 1, 0, 0, 0, 0, 0],
    [2, 2, 2, 1, 1, 0, 0, 0, 0],
    [2, 2, 2, 1, 1, 0, 0, 0, 0],
    [2, 2, 2, 2, 1, 1, 0, 0, 0],
    [2, 2, 2, 2, 1, 1, 0, 0, 0],
    [2, 2, 2, 2, 2, 1, 1, 0, 0],
    [2, 2, 2, 2, 2, 1, 1, 0, 0],
    [2, 2, 2, 2, 2, 1, 1, 0, 0],
    [2, 2, 2, 2, 2, 1, 1, 0, 0],
    [2, 2, 2, 2, 2, 1, 1, 0, 0],
    [2, 2, 2, 2, 2, 1, 1, 0, 0]
  ],
  spellcastingKnown : {
    cantrips : [1, 1, 2, 2, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
    spells :   [0, 0, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 7, 7, 7, 7, 7, 7],
    spells :   "book",
    prepared : true
  },
  features : {
    "mark for death" : {
      name : "Mark for Death",
      source : ["MG:W", 3],
      minlevel : 3,
      description : desc([
        "I can mark a target within 15ft as a bonus action.",
        "They must take a con saving throw against my warden spell save DC or become marked for death",
        "The target is marked until they take a long rest or I mark another target.",
        "The target has the following disadvantages:",
        "Whenever the target is healed, that healing is reduced by 1d4",
        "Characters have advantage on intimidation checks against the target",
        "If a marked target dies, gain 1d12 health.",
      ]),
      action : ["bonus action", ""],
    },
    "reap" : {
      name : "Reap",
      source : ["MG:W", 3],
      minlevel : 3,
      description : desc([
        "When I damage a target Marked for Death, I may Reap",
        "I deal an additional 1d6 plus con mod to the target and myself"
      ]),
      action : ["reaction", ""]
    },
    "deathly insights" : {
      name : "Deathly Insights",
      source : ["MG:W", 3],
      minlevel : 5,
      description : "\n   " + "Choose a Deathly Insight using the \"Choose Feature\" button above",
      choices : ["Last Words", "Lingering Lifeforce", "Pain of Death"],
      "last words" : FightingStyles.archery,
      "lingering lifeforce" : FightingStyles.dueling,
      "pain of death" : FightingStyles.great_weapon,
    },
    "uncanny cadaver" : {
      name : "Uncanny Cadaver",
      source : ["MG:W", 3],
      minlevel : 7,
      description : desc([
        "I can manipulate how a corpse is perceived:",
        "The corpse looks like it is simply sleeping; or",
        "The corpse looks like another person."
      ]),
      usages : 1,
      action : ["action", ""],
      recovery : "long rest"
    },
    "brush with death" : {
      name : "Brush with Death",
      source : ["MG:W", 3],
      minlevel : 10,
      description : desc([
        "I'm not happy with this one yet"
      ]),
      usages : 1,
      action : ["action", ""],
      recovery : "long rest"
    },
    "spectral vision" : {
      name : "Spectral Vision",
      source : ["MG:W", 3],
      minlevel : 11,
      description : "I can sense undead and ethereal creatures within 30 feet, even behind walls.",
      usages : 1,
      action : ["action", ""],
      recovery : "short rest"
    },
    "Aliies in Death" : {
      name : "Allies in Death",
      source : ["MG:W", 3],
      minlevel : 15,
      description : "\n   " + "Choose an Ally in Death using the \"Choose Feature\" button above",
      choices : ["Ethereal Jaunt", "Deathly Parlay", "Audience with Death"],
      "ethereal jaunt" : FightingStyles.archery,
      "deathly parlay" : FightingStyles.dueling,
      "audience with death" : FightingStyles.great_weapon,
    },
    "deathly resilience" : {
      name : "Deathly Resilience",
      source : ["MG:W", 3],
      minlevel : 18,
      description : " [resistance to cold and necrotic damage]",
      dmgres : ["Cold", "Necrotic"]
    },
    "deal with death" : {
      name : "Deal with Death",
      source : ["MG:W", 3],
      minlevel : 20,
      description : desc([
        "I can exchange your life for another's, and die in their place.",
        "When a target within 15 feet of me dies, I can choose to die instead.",
        "That target is restored to full health." 
      ])
      usages : 1,
      action : ["reaction", ""],
      recovery : "long rest"
    }
  }
};

AddSubClass("warden", "vengeful soul", {
  regExpSearch : /^(?=.*justiciar)(?=.*archiv(es|ist)).*$/i,
  subname : "Vengeful Soul",
  source : ["MG:W", 3],
  spellcastingExtra : ["feather fall", "unseen servant", "continual flame", "locate object", "fly", "leomund's tiny hut", "leomund's secret chest", "mordenkainen's faithful hound", "wall of force"],
  features : {
    "subclassfeature2" : {
      name : "Vengeful",
      source : ["MG:W", 3],
      minlevel : 2,
      description : desc([
        "When I am damaged by a target Marked for Death, I can attack back as a reaction."
      ]),
      usages : 3,
      action : ["reaction", ""],
      recovery : "long rest"
    },
    "subclassfeature13" : {
      name : "Mark of the Reaper",
      source : ["MG:W", 3],
      minlevel : 13,
      description : desc([
        "Whenever you take damage from a target, you can use a reaction to apply Mark for Death to them.",
        "Whilst a target is marked for death:",
        "- If they die, their soul cannot rest",
        "- If they take a long rest, they take a point of exhaustion",
        "I reap with an upgraded reap and no longer take damage.",
        "If my marked target dies, I heal for an additional 1d12.",
      ]),
    },
    "subclassfeature17" : {
      name : "Haunt",
      source : ["MG:W", 3],
      minlevel : 17,
      description : desc([
        "When I am killed by a target, I can return as a ghost and really annoy them",
      ]),
    },
  }
});