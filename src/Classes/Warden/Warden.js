/*  -WHAT IS THIS?-
  This file adds optional material to "MPMB's Character Record Sheet" found at https://flapkan.com/mpmb/charsheets
  Import this file using the "Add Extra Materials" bookmark.

  -KEEP IN MIND-
  It is recommended to enter the code in a fresh sheet before adding any other information (i.e. before making my character with it).
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
  name: "Metamagic Games: Warden Class v1.1",
  abbreviation: "MG:W",
  group: "Metamagic Games",
  url:
    "https://github.com/metamagic-games/dnd-homebrews/blob/master/src/Classes/Warden/Warden.md",
  date: "2018/06/07",
};

[
  // level 0 (cantrips)
  "chill touch",
  "guidance",
  "mage hand",
  "minor illusion",
  "resistance",
  "spare the dying",
  "stabilise",
  "true strike",

  // level 1
  "arms of hadar",
  "bane",
  "dancing lights",

  // level 2
  "phantasmal force",

  // level 3
  "animate dead",
  "feign death",
  "speak with dead",
  "spirit guardians",

  // level 4
  "antilife shell",
  "death ward",
  "phantasmal killer",

  // level 5
  "raise dead",
  "reincarnate",

  // level 6
  "circle of death",
  "create undead",
].forEach(function (wardenSpells) {
  if (SpellsList[wardenSpells]) SpellsList[wardenSpells].classes.push("warden");
});

const wardenSpellTable = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0], // level 0
  [0, 0, 0, 0, 0, 0, 0, 0, 0], // level 1
  [0, 0, 0, 0, 0, 0, 0, 0, 0], // level 2
  [1, 0, 0, 0, 0, 0, 0, 0, 0], // level 3
  [1, 0, 0, 0, 0, 0, 0, 0, 0], // level 4
  [1, 1, 0, 0, 0, 0, 0, 0, 0], // level 5
  [1, 1, 0, 0, 0, 0, 0, 0, 0], // level 6
  [2, 1, 1, 0, 0, 0, 0, 0, 0], // level 7
  [2, 1, 1, 0, 0, 0, 0, 0, 0], // level 8
  [2, 2, 1, 1, 0, 0, 0, 0, 0], // level 9
  [2, 2, 1, 1, 0, 0, 0, 0, 0], // level 10
  [2, 2, 2, 1, 1, 0, 0, 0, 0], // level 11
  [2, 2, 2, 1, 1, 0, 0, 0, 0], // level 12
  [2, 2, 2, 2, 1, 1, 0, 0, 0], // level 13
  [2, 2, 2, 2, 1, 1, 0, 0, 0], // level 14
  [2, 2, 2, 2, 2, 1, 1, 0, 0], // level 15
  [2, 2, 2, 2, 2, 1, 1, 0, 0], // level 16
  [2, 2, 2, 2, 2, 1, 1, 0, 0], // level 17
  [2, 2, 2, 2, 2, 1, 1, 0, 0], // level 18
  [2, 2, 2, 2, 2, 1, 1, 0, 0], // level 19
  [2, 2, 2, 2, 2, 1, 1, 0, 0], // level 20
];

ClassList["warden"] = {
  regExpSearch: /^(?=.*warden).*$/i,
  name: "Warden",
  source: ["MG:W", 0],
  primaryAbility: "\n \u2022 Warden: Constitution, and Charisma;",
  prereqs: "\n \u2022 Warden: Constitution 13, and Charisma 13;",
  die: 12,
  improvements: [0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 5, 5],
  saves: ["Con", "Cha"],
  skills: [
    "\n\n" +
      toUni("Warden") +
      ": Choose two from Insight, Intimidation, Medicine, Perception, Stealth, and Survival.",
  ],
  toolProfs: {
    primary: null,
    secondary: null,
  },
  armor: [
    [true, true, false, true],
    [true, true, false, true],
  ],
  weapons: [true, false, "shortsword", "spear"],
  equipment:
    "Warden starting equipment:\n \u2022 leather armor;\n \u2022 A short sword or a club;\n \u2022 An explorer's pack.\n\nAlternatively, choose 4d4 \xD7 10 gp worth of starting equipment instead of both the class' and the background's starting equipment.",
  subclasses: [
    "Warden Soul Essences",
    [
      "warden-soul-essence of the ghostslayer",
      "warden-soul-essence of the lycan",
      "warden-soul-essence of the mutant",
      "warden-soul-essence of the profane soul",
    ],
  ],
  attacks: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  spellcastingFactor: 1,
  spellcastingTable: wardenSpellTable,
  spellcastingKnown: {
    cantrips: [1, 1, 2, 2, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
    spells: [0, 0, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 7, 7, 7, 7, 7, 7],
    prepared: true,
  },
  abilitySave: 3,
  features: {
    "mark for death": {
      name: "Mark for Death",
      source: ["MG:W", 1],
      minlevel: 3,
      description: desc([
        "I can mark a target within 15ft as a bonus action.",
        "They must take a con saving throw against my warden spell save DC or become marked for death",
        "The target is marked until they take a long rest or I mark another target.",
        "The target has the following disadvantages:",
        "- Whenever the target is healed, that healing is reduced by 1d4",
        "- Characters have advantage on intimidation checks against the target",
        "- If a marked target dies, gain 1d12 health.",
        "I can use this feature once per character level until I take a long rest.",
      ]),
      usages: [
        0,
        0,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        10,
        11,
        12,
        13,
        14,
        15,
        16,
        17,
        18,
        19,
        20,
      ],
      recovery: "short rest",
      action: ["bonus action", ""],
    },
    reap: {
      name: "Reap",
      source: ["MG:W", 1],
      minlevel: 3,
      description: desc([
        "When I damage a target Marked for Death, I may Reap",
        "I deal an additional 1d6 plus con mod to the target and myself",
      ]),
      action: ["reaction", " (damages a Marked target)"],
    },
    "deathly insights": {
      name: "Deathly Insights",
      source: ["MG:W", 1],
      minlevel: 5,
      description: desc([
        'Choose a Deathly Insight using the "Choose Feature" button above',
        "\n   Borrowed Capabilities",
        "| d3 | Capability |",
        "| :-: | :-: |",
        "| 01 | I learn how to speak, read, and write one language of my choice. |",
        "| 02 | I gain one skill or tool proficiency of my choice. |",
        "| 03 | I gain proficiency with one saving throw of my choice. |",
      ]),
      choices: ["Last Words", "Lingering Lifeforce", "Pain of Death"],
      "last words": {
        name: "Last Words",
        description: desc([
          "When I am within 5 foot of a corpse, as an action I can create a link with a spirit through their corpse. When I do so, I cast the _speak with dead_ spell, without using a spell slot or material components. Charisma is my spellcasting ability for this spell.",
          "Speaking with the dead in this way temporarily gives I a capability from a past life — you’re unsure whether it’s from my past or the spirit’s. When the spell ends, I gain one random benefit from the Borrowed Capabilities table. The benefit lasts until I finish a short or long rest.",
          "\n   Borrowed Capabilities",
          "| d3 | Capability |",
          "| :-: | :-: |",
          "| 01 | I learn how to speak, read, and write one language of my choice. |",
          "| 02 | I gain one skill or tool proficiency of my choice. |",
          "| 03 | I gain proficiency with one saving throw of my choice. |",
        ]),
        action: ["action", ""],
        usages: 1,
        recovery: "short rest",
        source: [
          ["SRD", 35],
          ["P", 91],
        ],
      },
      "lingering lifeforce": {
        name: "Lingering Lifeforce",
        description: desc([
          "When I am within 5 foot of a corpse that died within the past hour, I can use an action to gain hitpoints equal to 1d4 per that target's constitution modifier + my constitution modifier. I gain one random benefit from the Borrowed Capabilities table. The benefit lasts until I finish a short or long rest.",
          "This ability can only be cast once on a given corpse.",
          "\n   Borrowed Capabilities",
          "| d3 | Capability |",
          "| :-: | :-: |",
          "| 01 | I learn how to speak, read, and write one language of my choice. |",
          "| 02 | I gain one skill or tool proficiency of my choice. |",
          "| 03 | I gain proficiency with one saving throw of my choice. |",
        ]),
        usages: 1,
        recovery: "short rest",
        action: ["action", ""],
        source: [
          ["SRD", 35],
          ["P", 91],
        ],
      },
      "pain of death": {
        name: "Pain of Death",
        description: desc([
          "When a creature within 15 feet of I drops to 0 hit points, I can use a reaction to cast the _bane_ spell on another target within 15 feet of I without using a spell slot or material components. I gain one random benefit from the Borrowed Capabilities table. The benefit lasts until I finish a short or long rest.",
          "\n   Borrowed Capabilities",
          "| d3 | Capability |",
          "| :-: | :-: |",
          "| 01 | I learn how to speak, read, and write one language of my choice. |",
          "| 02 | I gain one skill or tool proficiency of my choice. |",
          "| 03 | I gain proficiency with one saving throw of my choice. |",
        ]),
        usages: 1,
        recovery: "short rest",
        source: [
          ["SRD", 35],
          ["P", 91],
        ],
        action: ["reaction", " (creature drops to 0 HP)"],
      },
    },
    "uncanny cadaver": {
      name: "Uncanny Cadaver",
      source: ["MG:W", 1],
      minlevel: 7,
      description: desc([
        "I can manipulate how a corpse is perceived:",
        "The corpse looks like it is simply sleeping; or",
        "The corpse looks like another person.",
      ]),
      usages: 1,
      action: ["action", ""],
      recovery: "long rest",
    },
    "brush with death": {
      name: "Brush with Death",
      source: ["MG:W", 1],
      minlevel: 10,
      description: desc(["I'm not happy with this one yet"]),
      usages: 1,
      action: ["action", ""],
      recovery: "long rest",
    },
    "spectral vision": {
      name: "Spectral Vision",
      source: ["MG:W", 1],
      minlevel: 11,
      description:
        "I can sense undead and ethereal creatures within 30 feet, even behind walls.",
      usages: 1,
      action: ["action", ""],
      recovery: "short rest",
    },
    "allies in Death": {
      name: "Allies in Death",
      source: ["MG:W", 1],
      minlevel: 15,
      description:
        "\n   " +
        'Choose an Ally in Death using the "Choose Feature" button above',
      choices: ["Ethereal Jaunt", "Deathly Parlay", "Audience with Death"],
      "ethereal jaunt": {
        name: "Ethereal Jaunt",
        description: desc([
          "When my health is lower than my constitution modifier, I can use an action to teleport to an unoccupied space within 30 feet of you. I don’t need to see that space to teleport to it, but my teleportation fails, wasting my bonus action, if I attempt to teleport through magical force that is Medium or larger, such as a wall of force.",
          "If I appear in a space occupied by another creature or filled by an object, I am immediately shunted to the nearest unoccupied space that I can occupy and take force damage equal to twice the number of feet I am shunted.",
        ]),
        source: [
          ["SRD", 35],
          ["P", 91],
        ],
      },
      "deathly parlay": {
        name: "Deathly Parlay",
        description:
          "When my health reaches lower than my constitution modifier, each undead that can see or hear I within 30 feet of I must make a Charisma saving throw. If the creature fails its saving throw, it is turned for 1 minute or until it takes any damage. A turned creature must spend its turns trying to move as far away from I as it can, and it can't willingly move to a space within 30 feet of you. lt also can't take reactions. For its action, it can use only the Dash action or try to escape from an effect that prevents it from moving. If there's nowhere to move, the creature can use the Dodge action.",
        source: [
          ["SRD", 35],
          ["P", 91],
        ],
      },
      "audience with death": {
        name: "Audience with Death",
        description:
          "I have advantage on death saving throws, and whenever I make a death saving throw, my spirit can ask an entity of death a question that can be answered with “yes,” “no,” or “unknown.” The entity answers truthfully, using the knowledge of all those who have died.",
        source: [
          ["SRD", 35],
          ["P", 91],
        ],
      },
    },
    "deathly resilience": {
      name: "Deathly Resilience",
      source: ["MG:W", 1],
      minlevel: 18,
      description: " [resistance to cold and necrotic damage]",
      dmgres: ["Cold", "Necrotic"],
    },
    "deal with death": {
      name: "Deal with Death",
      source: ["MG:W", 1],
      minlevel: 20,
      description: desc([
        "I can exchange my life for another's, and die in their place.",
        "When a target within 15 feet of me dies, I can choose to die instead.",
        "That target is restored to full health.",
      ]),
      usages: 1,
      action: ["reaction", ""],
      recovery: "long rest",
    },
  },
};

AddSubClass("warden", "vengeful soul", {
  regExpSearch: /^(?=.*vengeful)(?=.*so(ul|le)).*$/i,
  subname: "Vengeful Soul",
  source: ["MG:W", 1],
  spellcastingExtra: [
    "inflict wounds",
    "ray of sickness",
    "ray of enfeeblement",
    "vampiric touch",
    "blight",
    "destructive wave",
    "harm",
    "finger of death",
  ],
  features: {
    subclassfeature2: {
      name: "Soul Nature: Vengeful",
      source: ["MG:W", 1],
      minlevel: 2,
      description: desc([
        "When I am damaged by a target Marked for Death, I can attack back as a reaction.",
      ]),
      usages: 3,
      action: ["reaction", "(damaged by Marked target)"],
      recovery: "long rest",
    },
    subclassfeature13: {
      name: "Inner Power: Mark of the Reaper",
      source: ["MG:W", 1],
      minlevel: 13,
      description: desc([
        "Whenever I take damage from a target, I can use a reaction to apply Mark for Death to them.",
        "Whilst a target is marked for death:",
        "- If they die, their soul cannot rest",
        "- If they take a long rest, they take a point of exhaustion",
        "I reap with an upgraded reap and no longer take damage.",
        "If my marked target dies, I heal for an additional 1d12.",
      ]),
    },
    subclassfeature17: {
      name: "Last Gasp: Haunt",
      source: ["MG:W", 1],
      minlevel: 17,
      description: desc([
        "When I am killed by a target, I can return as a ghost and really annoy them",
      ]),
    },
  },
});

AddSubClass("warden", "elusive soul", {
  regExpSearch: /^(?=.*elusive)(?=.*so(ul|le)).*$/i,
  subname: "Elusive Soul",
  source: ["MG:W", 1],
  spellcastingExtra: [
    "dissonant whispers",
    "silent image",
    "misty step",
    "blink",
    "leomund's secret chest",
    "greater invisibility",
    "wind walk",
    "etherealness",
  ],
  features: {
    subclassfeature2: {
      name: "Soul Nature: Elusive",
      source: ["MG:W", 1],
      minlevel: 2,
      description: desc([
        "I can cast the spell Disguise Self without consuming a spell slot or material components. I gain advantage on deception whilst disguised.",
        "Once I use this feature, I can't use it again until I finish a short or long rest.",
      ]),
      usages: 1,
      action: ["action", ""],
      recovery: "short rest",
    },
    subclassfeature13: {
      name: "Inner Power: Mark of the Reaper",
      source: ["MG:W", 1],
      minlevel: 13,
      description: desc([
        "Once per short rest, when I would take damage, I can use a reaction to become ethereal. This effect lasts until my next turn.",
      ]),
      usages: 1,
      action: ["reaction", " (would take damage)"],
      recovery: "short rest",
    },
    subclassfeature17: {
      name: "Last Gasp: Haunt",
      source: ["MG:W", 1],
      minlevel: 17,
      description: desc([
        "When I drop to 0 hit points, I can teleport at random to another plane of existence.",
      ]),
      usages: 1,
      action: ["reaction", " (drop to 0)"],
      recovery: "long rest",
    },
  },
});
