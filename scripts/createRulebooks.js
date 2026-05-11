import { handbooker } from "handbooker";

const options = {
  debug: true,
  printOptions: {
    displayHeaderFooter: false,
  },
  markdownOptions: {},
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

const formatMs = (ms) => `${(ms / 1000).toFixed(1)}s`;

const buildOne = async (key) => {
  const base = paths[key];
  const start = Date.now();
  console.log(`\n>>> ${key} (${base}.md)`);
  await handbooker(`${base}.md`, `${base}.pdf`, options);
  return Date.now() - start;
};

const createRulebooks = async () => {
  const requested = process.argv.slice(2);
  const allKeys = Object.keys(paths);

  const unknown = requested.filter((k) => !(k in paths));
  if (unknown.length > 0) {
    console.error(`\nUnknown document(s): ${unknown.join(", ")}`);
    console.error(`\nAvailable keys:\n  ${allKeys.sort().join("\n  ")}\n`);
    process.exit(2);
  }

  const targets = requested.length > 0 ? requested : allKeys;
  console.log(`Building ${targets.length} document(s)...`);

  const failures = [];
  const overallStart = Date.now();

  for (const key of targets) {
    try {
      const elapsed = await buildOne(key);
      console.log(`  ok (${formatMs(elapsed)})`);
    } catch (err) {
      console.error(`  FAILED: ${err.message}`);
      failures.push({ key, err });
    }
  }

  const total = formatMs(Date.now() - overallStart);
  console.log(
    `\nFinished in ${total}. ${targets.length - failures.length}/${targets.length} succeeded.`
  );

  if (failures.length > 0) {
    console.error(`\nFailures:`);
    for (const { key, err } of failures) {
      console.error(`  - ${key}: ${err.message}`);
    }
    process.exit(1);
  }
};

createRulebooks();
