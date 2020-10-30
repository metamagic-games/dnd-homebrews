/*  -WHAT IS THIS?-
  This file adds optional material to "MPMB's Character Record Sheet" found at https://flapkan.com/mpmb/charsheets
  Import this file using the "Add Extra Materials" bookmark.

  -KEEP IN MIND-
  It is recommended to enter the code in a fresh sheet before adding any other information (i.e. before making your character with it).
*/

/*  -INFORMATION-
  Subject:  Subclass & Feat
  Effect:   This script adds a subclass for the fighter, called "Combat Medic"
        And a feat, called "Combat Combat Medic"
        These are taken from the Giant in the Playground forums (http://www.giantitp.com/forums/showthread.php?426879) and is the version posted at 10th of July 2015
        This subclass is made by Submortimer
  Code by:  MorePurpleMoreBetter
  Date:   2018-01-02 (sheet v12.999)
*/

var iFileName = "Combat Medic.js";
RequiredSheetVersion(12.999);

SourceList["S:Combat Medic"] = {
  name: "Submortimer - Fighter Martial Archetype: Combat Medic",
  abbreviation: "S:Combat Medic",
  group: "Giant in the Playground forums",
  url: "http://www.giantitp.com/forums/showthread.php?426879",
  date: "2015/07/10",
};

var theCoD = AddSubClass("fighter", "brute-giantitp", {
  regExpSearch: /brute/i,
  subname: "Combat Medic",
  source: ["S:Combat Medic", 0],
  fullname: "Combat Medic",
  features: {
    "subclassfeature3.1": {
      name: "Bonus Proficiency",
      source: ["S:Combat Medic", 0],
      minlevel: 3,
      description:
        "You gain proficiency in one of the following skills of your choice: Medicine, Survival, Insight, Persuasion.",
    },
    "subclassfeature3.2": {
      name: "Combat Medic's Equipment",
      source: ["S:Combat Medic", 0],
      minlevel: 3,
      description:
        "You gain a Healer's Kit. This kit is a leather pouch containing bandages, salves, and splints. The kit has up to ten uses. As an action, you can expend one use of the kit to stabilize a creature that has O hit points, without needing to make a Wisdom (Medicine) check.\nYou kit starts with 0 uses. Whenever you make a rest, you can make a survival check to scavenge for more supplies (DC15). If you succeed during a Short Rest, your kit gains 1 use. If you succeed during a Long Rest, your kit gains 1d4 uses.",
    },
    "subclassfeature3.3": {
      name: "Healer",
      source: ["S:Combat Medic", 0],
      minlevel: 3,
      description:
        "At 3rd level, you gain the _Healer_ feat. You are an able physician, allowing you to mend wounds quickly and get your allies back in the fight. You gain the following benefits: When you use a healer's kit to stabilize a dying creature, that creature also regains 1 hit point. As an action, you can spend one use of a healer's kit to tend to a creature and restore 1d6 + 4 hit points to it, plus additional hit points equal to the creature's maximum number of Hit Dice. The creature can't regain hit points from feat again until it finishes a short or long rest.",
    },
    subclassfeature7: {
      name: "Protective Maneuvers",
      source: ["S:Combat Medic", 0],
      minlevel: 7,
      recovery: "long rest",
      usages: 1,
      description:
        "If you or a creature you can see within 5 feet of you is hit by an attack, you can roll 1d8 as a reaction if you’re wielding a melee weapon or a shield. Roll the die, and add the number rolled to the target’s AC against that attack. If the attack still hits, the target has resistance against the attack’s damage.\nYou can use this feature a number of times equal to your Constitution modifier (minimum of once), and you regain all expended uses of it when you finish a long rest.",
      action: ["reaction", ""],
      spellcastingBonus: {
        name: "Spare the Dying",
        spells: ["spare the dying"],
        selection: ["spare the dying"],
      },
    },
    subclassfeature10: {
      name: "Veteran Medic",
      source: ["S:Combat Medic", 0],
      minlevel: 10,
      description: desc([
        "As a bonus action. you can spend one use of a healer's kit to tend to a creature and restore 1d4 + 4 hit points to it, plus additional hit points equal to the creature's maximum number of Hit Dice. The creature can't regain hit points from feat again until it finishes a short or long rest.",
        "You gain the cantrip Spare the Dying.",
      ]),
    },
    subclassfeature15: {
      name: "Preventative Medicine",
      source: ["S:Combat Medic", 0],
      minlevel: 15,
      description: desc([
        "As a bonus action, you can spend two use of a healer's kit you can give 1d6 + 4 temporary hitpoints to a target.",
        "As an action, you can spend three uses of a healer's kit to give a target resistance to one type of damage.",
      ]),
    },
    subclassfeature18: {
      name: "Anatomical Precision",
      source: ["S:Combat Medic", 0],
      minlevel: 18,
      description:
        "Once per Short Rest, when attacking a humanoid creature, you can choose to use _Anatomical Precision_. Make a medicine check. If you succeed, you gain advantage on your attack.",
      recovery: "short rest",
      usages: 1,
      action: ["reaction", ""],
    },
  },
});
