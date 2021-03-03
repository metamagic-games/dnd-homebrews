import { handbooker } from "handbooker";

const customOptions = {
  debug: true,
  printOptions: {
    displayHeaderFooter: false,
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

export const createRulebooks = async (rules, options=customOptions) => {
  console.log("Creating rulebooks...");

  for (let i = 0; i < rules.length; i++) {
    const rule = paths[rules[i]];

    console.log("\n>>>", rule);

    //await handbooker(`${rule}.md`, `${rule}.pdf`, options);
  }

  console.log("\nFinished!");
};

const createRulebooksFromCLI = () => {
  const commands = process.argv.slice(2);

  if (commands.length > 0) {
    createRulebooks(commands) 
  } else {
    createRulebooks(Object.keys(paths));
  }
}

createRulebooksFromCLI();
