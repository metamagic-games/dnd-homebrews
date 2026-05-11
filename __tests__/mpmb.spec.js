/**
 * Smoke tests for the MPMB character-sheet JS files in `src/`.
 *
 * These files run inside MPMB (a PDF host) which exposes a set of globals
 * (RaceList, ClassList, AddSubClass, etc). To validate them in Node we
 * stub those globals, eval each file, and assert structural invariants.
 *
 * The goal isn't to prove the homebrew "works" — only to catch the
 * obvious mistakes the codebase has historically made: wrong-length
 * arrays, score/string disagreement, Math.min vs Math.max, etc.
 */

const fs = require("fs");
const path = require("path");

const SRC_ROOT = path.join(__dirname, "..", "src");

const findJsFiles = (dir) => {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...findJsFiles(full));
    else if (entry.isFile() && entry.name.endsWith(".js")) out.push(full);
  }
  return out;
};

const ABILITY_LABELS = ["Str", "Dex", "Con", "Int", "Wis", "Cha"];
const ABILITY_NAMES = {
  Str: ["strength"],
  Dex: ["dexterity"],
  Con: ["constitution"],
  Int: ["intelligence"],
  Wis: ["wisdom"],
  Cha: ["charisma"],
};

/**
 * Parse a "+2 Wisdom, +1 Strength and Constitution, -2 Charisma" style
 * string into a [Str,Dex,Con,Int,Wis,Cha] vector. Returns null if it can't
 * confidently parse the string (then the test should be skipped).
 */
const parseAbilityVector = (text) => {
  if (!text || typeof text !== "string") return null;
  const result = [0, 0, 0, 0, 0, 0];
  const segmentRe = /([+-]?\d+)\s+([A-Za-z][A-Za-z ,and]*?)(?=(?:[,.;)]|\s+[+-]\d|$))/g;
  let m;
  let matched = false;
  while ((m = segmentRe.exec(text)) !== null) {
    const value = parseInt(m[1], 10);
    if (!Number.isFinite(value) || value === 0) continue;
    const stats = m[2]
      .toLowerCase()
      .split(/,| and /)
      .map((s) => s.trim())
      .filter(Boolean);
    for (const stat of stats) {
      const idx = ABILITY_LABELS.findIndex((label) => ABILITY_NAMES[label].includes(stat));
      if (idx >= 0) {
        result[idx] += value;
        matched = true;
      }
    }
  }
  return matched ? result : null;
};

const buildSandbox = () => {
  const sandbox = {
    SourceList: {},
    RaceList: {},
    ClassList: {},
    SubClassList: {},
    WeaponsList: {},
    SpellsList: {},
    FeatsList: {},
    BackgroundList: {},
    typePF: false,
    tDoc: { getField: () => ({ value: 0 }) },
    event: { value: 0 },
    desc: (lines) => (Array.isArray(lines) ? lines.join("\n") : String(lines)),
    toUni: (s) => String(s),
    AddACMisc: () => {},
    RequiredSheetVersion: () => {},
    AddSubClass: (parent, key, def) => {
      sandbox.SubClassList[`${parent}-${key}`] = def;
      return def;
    },
    iFileName: "",
  };
  return sandbox;
};

const loadFile = (filePath) => {
  const sandbox = buildSandbox();
  const code = fs.readFileSync(filePath, "utf8");
  const fn = new Function(...Object.keys(sandbox), code);
  fn(...Object.values(sandbox));
  return sandbox;
};

const allJsFiles = findJsFiles(SRC_ROOT).filter((f) => fs.statSync(f).size > 0);

describe("MPMB JS files", () => {
  describe.each(allJsFiles.map((f) => [path.relative(SRC_ROOT, f), f]))("%s", (_name, filePath) => {
    let sandbox;

    beforeAll(() => {
      sandbox = loadFile(filePath);
    });

    it("parses and executes without throwing", () => {
      expect(sandbox).toBeDefined();
    });

    it("has no broken pronoun phrases like '… of I' or '… for I'", () => {
      const code = fs.readFileSync(filePath, "utf8");
      const matches = code.match(
        /\b(of|for|to|with|than|hear|see|behind|around|near|between|on|by|from) I\b/g
      );
      expect(matches).toBeNull();
    });

    it("has no 'Math.min(1,' in usagescalc strings (likely meant max)", () => {
      const code = fs.readFileSync(filePath, "utf8");
      // Allow Math.min in other contexts; only flag the usagescalc pattern.
      const lines = code.split("\n");
      const offenders = lines.filter(
        (l) => /usagescalc/.test(l) && /Math\.min\s*\(\s*1\s*,/.test(l)
      );
      expect(offenders).toEqual([]);
    });

    it("has no 'from feat again' (search-replace artefact for 'this feature')", () => {
      const code = fs.readFileSync(filePath, "utf8");
      expect(code).not.toMatch(/from feat again/);
    });

    it("each ClassList entry has a 20-row spellcastingTable (when present)", () => {
      for (const [name, klass] of Object.entries(sandbox.ClassList)) {
        if (Array.isArray(klass.spellcastingTable)) {
          expect({
            name,
            rows: klass.spellcastingTable.length,
          }).toEqual({ name, rows: 20 });
        }
      }
    });

    it("each ClassList entry's spellcastingKnown arrays have 20 levels", () => {
      for (const [name, klass] of Object.entries(sandbox.ClassList)) {
        if (klass.spellcastingKnown) {
          for (const key of ["cantrips", "spells"]) {
            const arr = klass.spellcastingKnown[key];
            if (Array.isArray(arr)) {
              expect({ name, key, len: arr.length }).toEqual({
                name,
                key,
                len: 20,
              });
            }
          }
        }
      }
    });

    it("each ClassList entry's `improvements` array has 20 levels", () => {
      for (const [name, klass] of Object.entries(sandbox.ClassList)) {
        if (Array.isArray(klass.improvements)) {
          expect({ name, len: klass.improvements.length }).toEqual({
            name,
            len: 20,
          });
        }
      }
    });

    it("RaceList entries: `scores` is a 6-vector and (where parseable) agrees with `improvements`/`trait`", () => {
      for (const [name, race] of Object.entries(sandbox.RaceList)) {
        if (!Array.isArray(race.scores)) continue;
        expect({ name, len: race.scores.length }).toEqual({ name, len: 6 });

        for (const field of ["improvements", "trait"]) {
          const text = race[field];
          const parsed = parseAbilityVector(text);
          if (parsed) {
            expect({ name, field, vec: parsed }).toEqual({
              name,
              field,
              vec: race.scores,
            });
          }
        }
      }
    });
  });
});

describe("createRulebooks paths", () => {
  // The paths map is hand-maintained; assert each entry resolves to an
  // existing markdown file so a typo or rename doesn't fail silently in CI.
  const buildPaths = {
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

  for (const [key, base] of Object.entries(buildPaths)) {
    it(`'${key}' → ${base}.md exists`, () => {
      const full = path.join(__dirname, "..", `${base}.md`);
      expect(fs.existsSync(full)).toBe(true);
    });
  }
});
