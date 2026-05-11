/*  -WHAT IS THIS?-
  This file adds optional material to "MPMB's Character Record Sheet" found at https://flapkan.com/mpmb/charsheets
  Import this file using the "Add Extra Materials" bookmark.

  -KEEP IN MIND-
  It is recommended to enter the code in a fresh sheet before adding any other information (i.e. before making your character with it).
*/

/*  -INFORMATION-
  Subject:  Race
  Effect:   This script adds a player race, called "Brood"
        This is taken from DanDwiki (https://www.dandwiki.com/wiki/Brood_(5e_Race))
        Please note that DanDwiki is renowned for having very unbalanced content
  Code by:  mcclowes
  Date:   2020-04-26 (sheet v12.998)
*/

var iFileName = "Brood.js";
RequiredSheetVersion(12.999);

SourceList["MG:B"] = {
  name: "Metamagic Games: Brood",
  abbreviation: "MG:B",
  group: "Metamagic Games",
  url: "https://www.dandwiki.com/wiki/",
};

RaceList["leatherwing brood"] = {
  regExpSearch: /^(?=.*brood)(?=.*leatherwing).*$/i,
  name: "Leatherwing Brood",
  sortname: "Brood, Leatherwing",
  plural: "Leatherwing Brood",
  source: ["MG:B", 0],
  size: 3,
  speed: {
    walk: { spd: 30, enc: 20 },
    fly: { spd: 20, enc: 10 },
  },
  languageProfs: ["Common", 1],
  vision: [["Darkvision", 60]],
  age: " live 20 to almost 35 years.",
  height: ' range from 5 to 9 feet tall (4\'9" + 4d8")',
  weight: " weigh around 130 lb (110 + 2d8 \xD7 2d4 lb)",
  heightMetric: " range from 1.5 to 2.1 metres tall (145 + 10d8 cm)",
  weightMetric: " weigh around 70 kg (50 + 5d8 \xD7 4d4 / 10 kg)",
  improvements:
    "Leatherwing Brood: +2 Wisdom, +1 Dexterity, +1 Intelligence, -1 Strength, -1 Constitution;",
  scores: [-1, 1, -1, 1, 2, 0],
  trait:
    "Leatherwing Brood (+2 Wisdom, +1 Dexterity and Intelligence, -1 Strength and Constitution)" +
    (typePF ? " " : "\n") +
    "From 3rd level, I can use an action to unfurl wings, gaining a fly speed of 20 feet for 1 hour. Once per long rest.",
  features: {
    "unfurl wings": {
      name: "Unfurl Wings",
      minlevel: 3,
      usages: 1,
      recovery: "long rest",
      action: ["action action", ""],
    },
    "furl wings": {
      name: "Furl Wings",
      minlevel: 3,
      description: "I gain a flying speed for 1 hour.",
      action: ["bonus action", ""],
    },
  },
};

RaceList["bombardier brood"] = {
  regExpSearch: /^(?=.*brood)(?=.*bombardier).*$/i,
  name: "Bombardier Brood",
  sortname: "Brood, Bombardier",
  plural: "Bombardier Brood",
  source: ["MG:B", 0],
  size: 3,
  speed: {
    walk: { spd: 30, enc: 20 },
  },
  languageProfs: ["Common", 1],
  vision: [["Darkvision", 60]],
  age: " live 20 to almost 35 years.",
  height: ' range from 5 to 9 feet tall (4\'9" + 4d8")',
  weight: " weigh around 130 lb (110 + 2d8 \xD7 2d4 lb)",
  heightMetric: " range from 1.5 to 2.1 metres tall (145 + 10d8 cm)",
  weightMetric: " weigh around 70 kg (50 + 5d8 \xD7 4d4 / 10 kg)",
  improvements: "Bombardier Brood: +2 Wisdom, +1 Dexterity, +1 Constitution, -2 Charisma;",
  scores: [0, 1, 1, 0, 2, -2],
  trait:
    "Bombardier Brood (+2 Wisdom, +1 Dexterity and Constitution, -2 Charisma)" +
    (typePF ? " " : "\n") +
    "From 3rd level, I gain the cantrip Acid Splash. Once per long rest, when I take damage, I can cast Acid Splash as a reaction.",
  spellcastingAbility: 6,
  spellcastingBonus: {
    name: "Bombardier Acid Saliva",
    cantrip: ["acid splash"],
  },
  features: {
    "acid splash reaction": {
      name: "Acid Splash (reaction)",
      minlevel: 3,
      usages: 1,
      recovery: "long rest",
      action: ["bonus action", ""],
    },
  },
};

RaceList["rhinocerous brood"] = {
  regExpSearch: /^(?=.*brood)(?=.*rhinocerous).*$/i,
  name: "Rhinocerous Brood",
  sortname: "Brood, Rhinocerous",
  plural: "Rhinocerous Brood",
  source: ["MG:B", 0],
  size: 3,
  speed: {
    walk: { spd: 30, enc: 20 },
  },
  languageProfs: ["Common", 1],
  weapons: ["Crushing Horn"],
  vision: [["Darkvision", 60]],
  age: " live 20 to almost 35 years.",
  height: ' range from 5 to 9 feet tall (4\'9" + 4d8")',
  weight: " weigh around 130 lb (110 + 2d8 \xD7 2d4 lb)",
  heightMetric: " range from 1.5 to 2.1 metres tall (145 + 10d8 cm)",
  weightMetric: " weigh around 70 kg (50 + 5d8 \xD7 4d4 / 10 kg)",
  improvements: "Rhinocerous Brood: +2 Wisdom, +1 Strength, +1 Constitution, -2 Intelligence;",
  scores: [1, 0, 1, -2, 2, 0],
  trait:
    "Rhinocerous Brood (+2 Wisdom, +1 Strength and Constitution, -2 Intelligence)" +
    (typePF ? " " : "\n") +
    "Crushing Horn: As a bonus action, once per short rest, I can make a special unarmed strike with my horn dealing 1d12 piercing damage.",
  features: {
    "crushing horn": {
      name: "Crushing Horn",
      minlevel: 1,
      usages: 1,
      recovery: "short rest",
      action: ["bonus action", ""],
    },
  },
};

WeaponsList["crushing horn"] = {
  regExpSearch: /^(?=.*crushing)(?=.*horn).*$/i,
  name: "Crushing Horn",
  source: ["MG:B", 0],
  ability: 1,
  type: "Natural",
  damage: [1, 12, "piercing"],
  range: "Melee",
  description: "Once per short rest (bonus action).",
  abilitytodamage: true,
};
