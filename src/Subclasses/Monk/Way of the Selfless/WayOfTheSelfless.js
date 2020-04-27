/*  -WHAT IS THIS?-
  This file adds optional material to "MPMB's Character Record Sheet" found at https://flapkan.com/mpmb/charsheets
  Import this file using the "Add Extra Materials" bookmark.

  -KEEP IN MIND-
  It is recommended to enter the code in a fresh sheet before adding any other information (i.e. before making my character with it).
*/

/*  -INFORMATION-
  Subject:  Subclass
  Effect:   This script adds a subclass for the Monk, called "Way of the Selfless"
        This subclass has been made by /u/mcclowes
        This code uses version 1.1 of the subclass from 2020-04-26
        
  Code by:  mcclowes & MorePurpleMoreBetter
  Date:   2020-04-26 (sheet v12.999)
*/

var iFileName = "WayOfTheSelfless.js";
RequiredSheetVersion(12.999);

if (!SourceList["MG:WotS"]) {
  SourceList["MG:WotS"] = {
    name: "Metamagic Games: Way of the Selfless (v1.1)",
    abbreviation: "MG:WotS",
    group: "Metamagic Games",
    url: "https://github.com/metamagic-games/dnd-homebrews/blob/master/src/Subclasses/Monk/Way%20of%20the%20Selfless/WayOfTheSelfless.md",
    date : "2020/04/26",
  };
};

AddSubClass("monk", "selfless", {
  regExpSearch: /selfless/i,
  subname: "Way of the Selfless",
  fullname: "Monk of the Selfless Way",
  source: [ "MG:WotS", 0 ],
  features: {
    "subclassfeature3": {
      name: "Limit Break",
      source: [ "MG:WotS", 0 ],
      minlevel: 3,
      description: desc([
        "When I move or attack, I can activate Limit Break as a reaction.",
        "I immediately:",
        "- Increase my exhaustion level by 1",
        "- Gain 1 ki per level of exhaustion you now have",
        "Until my next turn:",
        "- I ignore the effects of exhaustion",
        "- I add my Wisdom modifier to my rolls to hit and my damage",
        "- I score a critical hit on a roll of a 19 or 20",
        "- I have advantage on ability checks",
        "- I can perform the dash action as a bonus action"
      ]),
      action : [ "reaction", " (move or attack)" ]
    },
    "subclassfeature6": {
      name: "Endless Endurance",
      source: [ "MG:WotS", 0 ],
      minlevel: 6,
      description: "\n   " + "When I take a long rest, I recover 2 endurance points."
    },
    "subclassfeature11": {
      name: "Unrivaled Senses",
      source: [ "MG:WotS", 0 ],
      minlevel: 11,
      description: desc([
        "When I would fail an ability check based on sight or hearing, I can re-roll and add my Cons modifier.",
        "If the ability check was based on sight, I am blinded.",
        "If the ability check was based on hearing, I am now deafened.",
        "I recover fully after a short rest."
      ]),
      action: [ "reaction", " (fail ability check)" ],
      usages: 1,
      recovery: "short rest"
    },
    "subclassfeature17": {
      name: "Pressure Point",
      source: [ "MG:WotS", 0 ],
      minlevel: 17,
      description: "[1 ki point]" + "\n   " + "When I hit another creature with a melee weapon attack, the target must succeed on a Cons save or take a point of exhaustion.",
      action: [ "reaction", " (hit a creature)" ]
    }
  },
});

