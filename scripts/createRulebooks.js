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
  warden: "./src/Classes/Warden/Warden",
  tribune: "./src/Subclasses/Ranger/Tribune/Tribune",
  gambler: "./src/Subclasses/Warlock/Gambler/Gambler",
  selfless: "./src/Subclasses/Monk/WayOfTheSelfless/WayOfTheSelfless",
  medic: "./src/Subclasses/Fighter/CombatMedic/CombatMedic",
  brood: "./src/Races/Brood/Brood",
  vakkyr: "./src/Races/Vakkyr/Vakkyr",
  pearl: "./src/Races/Pearl/Pearl",
  spells: "./src/Spells/Spells",
  magicItems: "./src/Gear/MagicItems",
  umbarans: "./src/Subraces/Human/Umbarans",
  injuries: "./src/Rules/SeriousInjuries",
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
