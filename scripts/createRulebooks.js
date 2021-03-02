import { handbooker } from "handbooker";

const options = {
  debug: true,
  printOptions: {
    displayHeaderFooter: false,
  },
  markdownOptions: {
    //"baseUrl": null,
    // "breaks": false,
    // "gfm": true,
    // "headerIds": true,
    // "headerPrefix": "",
    // "highlight": null,
    // "langPrefix": "language-",
    // "mangle": true,
    // "pedantic": false,
    // "sanitize": false,
    // "sanitizer": null,
    // "silent": false,
    // "smartLists": false,
    // "smartypants": false,
    // "tokenizer": null,
    // "walkTokens": null,
    // "xhtml": false
  },
};

const paths = {
  brood: "./src/Races/Brood/Brood",
  drugs: "./src/Gear/Drugs",
  gambler: "./src/Subclasses/Warlock/Gambler/Gambler",
  injuries: "./src/Rules/SeriousInjuries",
  madness: "./src/Rules/Madness",
  magicItems: "./src/Gear/MagicItems",
  medic: "./src/Subclasses/Fighter/CombatMedic/CombatMedic",
  pearl: "./src/Races/Pearl/Pearl",
  selfless: "./src/Subclasses/Monk/WayOfTheSelfless/WayOfTheSelfless",
  spells: "./src/Spells/Spells",
  tribune: "./src/Subclasses/Ranger/Tribune/Tribune",
  umbarans: "./src/Subraces/Human/Umbarans",
  vakkyr: "./src/Races/Vakkyr/Vakkyr",
  warden: "./src/Classes/Warden/Warden",
};

const createRulebooks = async () => {
  console.log("Creating rulebooks...");

  const cvs = process.argv.slice(2);

  if (cvs.length > 0) {
    for (let i = 0; i < cvs.length; i++) {
      const rule = paths[cvs[i]];

      console.log("\n>>>", rule);

      await handbooker(`${rule}.md`, `${rule}.pdf`, options);
    }
  } else {
    const documents = Object.keys(paths);

    for (let i = 0; i < documents.length; i++) {
      const rule = documents[i];

      console.log("\n>>>", rule);

      await handbooker(`${rule}.md`, `${rule}.pdf`, options);
    }
  }

  console.log("\nFinished!");
};

createRulebooks();
