# Code review: `dnd-homebrews`

> Holistic review by an incoming principal engineer. The aim of this document is **not** to be cruel — it is to surface the issues that this codebase has been hiding behind the fact that "it's just markdown to PDF, who cares?" The answer to that question is that future-you cares, your collaborators care, and your players care when their character sheet is wrong.
>
> Throughout the document I've called out **why** each item matters and what a good engineering reflex looks like, because the brief was to help more junior team members grow. Some sections are blunt. None of them are personal.

---

## TL;DR

Severity legend: 🔴 critical · 🟠 high · 🟡 medium · 🟢 low / nit

| #  | Sev   | Area                  | Issue                                                                                                  |
|----|-------|-----------------------|--------------------------------------------------------------------------------------------------------|
| 1  | 🔴    | Correctness           | Global `you → I` find-and-replace in MPMB JS produced ungrammatical, sometimes meaning-changing text   |
| 2  | 🔴    | Correctness           | Brood race: ASI string, `scores` array, and `trait` text all describe **different** ability bonuses    |
| 3  | 🔴    | Correctness           | Rhinocerous Brood `trait` is a copy-paste of a vampire/sunlight block — wrong creature                 |
| 4  | 🔴    | Correctness           | Warden class identity drift: README/MD says Wis, code says Cha (a recent commit "fixed" only one side) |
| 5  | 🔴    | Correctness           | Tribune `usagescalc` uses `Math.min(1, …)` — caps usages at 1 instead of `Math.max`                    |
| 6  | 🔴    | Correctness           | Warden `spellcastingTable` has 21 rows for a 20-level class — off-by-one across the entire progression |
| 7  | 🟠    | Single source of truth| Every MPMB JS file duplicates the markdown narrative as string literals; the two have already drifted  |
| 8  | 🟠    | IP / licensing        | `LICENSE.md` says MIT, `package.json` says ISC; XGtE feat copied verbatim; DanDwiki sourced wholesale  |
| 9  | 🟠    | Build/CI              | CI runs only a tautological test; never builds the PDFs; pinned to EOL Node 12 on legacy CircleCI v2.0 |
| 10 | 🟠    | Build/CI              | Husky pre-commit only formats `./scripts/**`, ignoring all of `src/`; emits a leftover "build the CV?" |
| 11 | 🟠    | Tooling               | `path` listed as a dep — that's a Node built-in; you've installed an abandoned 2015 npm package        |
| 12 | 🟠    | Schema validation     | No schema check that MPMB JS is syntactically valid against MPMB's expected shape; no smoke test       |
| 13 | 🟡    | Architecture          | `regExpSearch` patterns are inconsistent (some anchored & lookahead-guarded, others wide-open `/x/i`)  |
| 14 | 🟡    | Architecture          | `paths` map in `createRulebooks.js` is hand-maintained — easy to forget; should be derived from disk   |
| 15 | 🟡    | Architecture          | Build is silently sequential; no error handling — one bad PDF aborts the whole batch                   |
| 16 | 🟡    | Repo hygiene          | PDFs are LFS-tracked and rebuilt every commit → enormous churn, frequent merge conflicts               |
| 17 | 🟡    | Repo hygiene          | Tons of half-empty WIP class/race directories sit next to "released" content with no signal of status  |
| 18 | 🟡    | Content rot           | Markdown image links hot-link external sites (wixmp, pinimg, theplaylist.net) — guaranteed link rot    |
| 19 | 🟡    | Naming                | `assetts/` (sic) is the canonical asset path. It is now too late to rename without breaking PDFs.      |
| 20 | 🟡    | Naming                | `WatoftheShadowRealm.js` (also empty) vs `WayoftheShadowRealm.md` — neither matches the rest           |
| 21 | 🟢    | Style                 | No `.prettierrc`, no `.editorconfig`, mixed tabs/spaces, mixed 2/4-space indentation                   |
| 22 | 🟢    | Style                 | No `CONTRIBUTING.md`, no PR template, no issue templates — yet the README invites contributions        |
| 23 | 🟢    | Style                 | `Ideas.md`, `Rules.md` (one bullet) and per-class `TIPS.md` files leak personal todo notes into source |
| 24 | 🟢    | Docs                  | README's getting-started has a typo (`npmr run build`) and undersells the project                       |

---

## 1. Correctness — these are bugs in the *content*, not code style

The single most important reframing for everyone working on this repo: **the JavaScript files are not "code". They are character sheet records.** A typo is not a stylistic concern — it is a wrong character. A wrong number changes how someone plays a character for an entire campaign. Treat these files with the same care you would a financial spreadsheet.

### 1.1 🔴 The "you → I" find-and-replace mass casualty event

`MPMB`'s sheet conventionally uses *first person* in feature descriptions ("I gain proficiency…"). It looks as though, at some point, somebody ran a find-and-replace from `you` → `I` across imported text. The output is grammatically broken in every JS file:

```text
// src/Subclasses/Fighter/CombatMedic/CombatMedic.js:55
"…allowing I to mend wounds quickly and get my allies back in the fight…"

// src/Classes/Warden/Warden.js:246
"When a creature within 15 feet of I drops to 0 hit points, I can use a reaction to cast the _bane_ spell on another target within 15 feet of I…"

// src/Classes/Warden/Warden.js:317
"…each undead that can see or hear I within 30 feet of I must make a Charisma saving throw…"
```

Worse, it occasionally **changes the meaning**:

```text
// src/Subclasses/Fighter/CombatMedic/CombatMedic.js:55, 77
"…The creature can't regain hit points from feat again until it finishes a short or long rest."
```
"`feat`" was previously "this feature". Now the sentence is nonsense — and the same nonsense bled through to the markdown source: `src/Subclasses/Fighter/CombatMedic/CombatMedic.md:47,59`. The two sources of truth are **both** wrong, in matching ways, which means whoever audited it just looked at one and copied to the other.

**Why this matters / lesson:** find-and-replace across natural-language strings is a footgun. Pronouns inflect; the same word can be the right answer in one place and the wrong answer in another. The fix is not "find-and-replace more carefully" — it is **don't store narrative copy and code in the same file**. See §3.1 (single source of truth).

**Action:**
- Stop hand-editing the JS narratives. Generate them from the canonical markdown.
- Until you do, run a regex sweep: `\b(of|with|to|for|hear|see|than) I\b` will find a dozen of these in five seconds.

---

### 1.2 🔴 Brood race — three different stat blocks for the same race

In `src/Races/Brood/Brood.js`, the Leatherwing variant declares its ASI **three times, each saying something different**:

```js
improvements:
  "Brood: +2 Charsima and +1 to Strength, Dexterity, or Constitution;",   // typo + wrong stat
scores: [-1, 1, -1, 1, 2, 0],                                              // STR -1, DEX +1, CON -1, INT +1, WIS +2, CHA 0
trait:
  "Brood (+2 Wisdom, +1 to Strength and Intelligence, -1 Constitution and Strength)" + …
//          ^^^^^^^^^^                          ^^^^^^^^                 ^^^^^^^^^^^^^^ str twice?!
```

So:
- `improvements` → +2 **Charisma** (and "Charsima" is misspelled three times in the file).
- `scores` → +2 **Wisdom**, +1 Dex, +1 Int, −1 Str, −1 Con.
- `trait` → +2 **Wisdom**, +1 Str, +1 Int, −1 Con, **−1 Str again** (impossible — same stat appears twice).

The same disagreement appears in Bombardier Brood (lines 87–91) and Rhinocerous Brood (lines 128–132). Whichever source the player or sheet trusts, **at least two of the other three are lying**.

**Why this matters / lesson:** when the same fact is repeated three times, the codebase is *guaranteed* to drift unless something enforces consistency. Either:
- Pick one canonical field (e.g., `scores`) and **derive** the human-readable strings from it, **or**
- Add a test that asserts the three encodings agree.

This kind of multi-source duplication is one of the most reliable sources of bugs in *any* codebase. It is not a content-author problem; it is an architecture problem.

---

### 1.3 🔴 Rhinocerous Brood has Vampire Bite and Sunlight Sensitivity

`src/Races/Brood/Brood.js:131-134`:

```js
trait:
  "Brood (+2 Wisdom, +1 to Strength and Constitution, -2 Intelligence)" +
  (typePF ? " " : "\n") +
  "Sunlight Sensitivity: …\nVampire's Bite: I can use my bite attack if a target is charmed/grappled by me…\nVampiric Gaze: Once per short rest, I can cast charm person…",
```

This is the trait block from a **vampire / shade race**, copy-pasted onto a horned beetle whose actual special ability is supposed to be its `Crushing Horn` natural weapon. The Crushing Horn is correctly defined in `WeaponsList`, but the player-facing description never mentions it — instead it tells the player about a bite attack that doesn't exist on this race and a vampiric charm spell that has no recovery mechanism plumbed into `features`.

**Why this matters / lesson:** copy-paste is fine; copy-paste-without-reading is dangerous. A trivial peer-review pass would have caught this before merge. The repo has no PR template forcing a checklist (see §6.4) — so there is no friction encouraging that read.

---

### 1.4 🔴 Warden's identity is in two states at once

The most recent commit on `main` is `4313e4a [feat] warden finished, remove charisma for wisdom`. The commit message implies a deliberate retconning of Warden from a Cha-based to a Wis-based class. But the codebase remembers both:

| Where                                          | Says                                            |
|-----------------------------------------------|-------------------------------------------------|
| `src/Classes/Warden/Warden.md:42-43`          | Saving Throws: Constitution, **Wisdom**         |
| `src/Classes/Warden/Warden.js:100`            | `primaryAbility: "… Warden: Constitution, and **Charisma**"` |
| `src/Classes/Warden/Warden.js:104`            | `saves: ["Con", "Cha"]`                         |
| `src/Classes/Warden/Warden.js:138`            | `abilitySave: 3` (Constitution — i.e., neither) |
| `Pain of Death`, `Last Words`, etc.            | Repeatedly say "Charisma is my spellcasting ability for this spell" |
| `Audience with Death`                          | "advantage on **Charisma** saving throws… my spirit can ask…" — actually that's Cha as a save type, not the class save |

So a Warden built from the **PDF** has Wisdom saves, but a character built using the **MPMB sheet** has Charisma saves and a Cha spellcasting modifier. Players using your two outputs in the same campaign will produce mechanically different characters.

This is exactly the failure mode predicted in §1.2: when you have two sources of truth, refactoring one and not the other is a question of *when*, not *if*.

---

### 1.5 🔴 Tribune `Math.min(1, …)` — usages capped at 1

`src/Subclasses/Ranger/Tribune/Tribune.js:152-153`:

```js
usages: "Wisdom modifier per ",
usagescalc: "event.value = Math.min(1, tDoc.getField('Wis Mod').value);",
```

The intent (echoing the PHB pattern "a number of times equal to your X modifier (minimum once)") is `Math.max(1, …)`. As written, it is `Math.min(1, …)`:
- Wis mod 0 → 0 uses
- Wis mod 1 → 1 use
- Wis mod 2 → 1 use
- Wis mod 5 → 1 use

A 15th-level Tribune with +5 Wisdom gets one use per long rest of their capstone ability. Quietly broken.

**Why this matters / lesson:** `Math.min` and `Math.max` are easy to swap mentally because both sound like "limit". Read every `min/max` next to the word it is bounding: "**at least** one" → `max(1, …)`, "**at most** one" → `min(1, …)`.

This is also one of the *only* lines of executable JavaScript in the codebase that isn't pure data — and it has no test.

---

### 1.6 🔴 Warden `wardenSpellTable` has 21 rows; classes have 20 levels

`src/Classes/Warden/Warden.js:72-94`:

```js
const wardenSpellTable = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0], // level 0
  [0, 0, 0, 0, 0, 0, 0, 0, 0], // level 1
  …
  [2, 2, 2, 2, 2, 1, 1, 0, 0], // level 20
];
```

MPMB's `spellcastingTable` is a 20-element array indexed `[0..19]` representing class levels 1..20. There is no "level 0". The author's own comments label the rows as 0..20, which is 21 entries. So index 0 is wasted, and the actual spell slots a Warden gets are **shifted one level later** than the table claims:

- Author's "level 5" row (`[1, 1, 0, …]`) is actually applied at character level 6.
- The "level 20" row never applies — at level 20 the sheet reads index 19 (the author's "level 19" row).

Compare to `improvements: [0,0,0,1,1,1,1,2,…]` (20 elements, indexed 0..19, correct) and `spellcastingKnown.cantrips` / `.spells` (20 elements each, correct). The spell **slot** table is the only mis-shaped one, which makes it easy to miss in review.

**Why this matters / lesson:** it is dangerous to use *parallel arrays* keyed by an implicit index. If you must, write a small assertion in the build:

```js
assert.strictEqual(wardenSpellTable.length, 20, "spellcastingTable must have 20 rows");
```

Even better, model levels as a list of objects:

```js
const wardenProgression = [
  { level: 1, slots: [0,0,0,…], cantrips: 1, …},
  { level: 2, slots: [0,0,0,…], cantrips: 1, …},
  …
];
```

…and *generate* the parallel arrays MPMB needs from that. The level number is then explicit and impossible to misalign.

---

## 2. Architecture

### 2.1 🟠 Two sources of truth, drifting

Every character option exists twice:

1. As prose in a `.md` file (rendered to PDF via `handbooker`).
2. As JavaScript object literals in a sibling `.js` file (consumed by the MPMB character sheet).

These two are 100% manually kept in sync. The drift is already observable:

| Feature               | Markdown                                           | JavaScript                                          |
|-----------------------|----------------------------------------------------|-----------------------------------------------------|
| Combat Medic, *Veteran Medic*  | "1d6 + 4 hit points" (md:60 gives `1d4 + 4`!) | "1d6 + 4" (js:77)                                    |
| Combat Medic, *Preventative Medicine* | "spend **four** uses" (md:67)              | "spend **three** uses" (js:87)                       |
| Warden saves           | Constitution + Wisdom                              | Constitution + Charisma                              |
| Combat Medic, *Anatomical Precision* | DC = target's Constitution score (md:71)   | (no DC reference) (js:95)                            |
| Warden spell list "stabilise" (js:38) | Not a real D&D spell — typo of "stabilize"  | —                                                     |

**Recommendation:**
- Treat the `.md` as the canonical content.
- Generate the MPMB JS from a structured intermediate (YAML or JSON in frontmatter) using a small build step.
- If that's too ambitious, **at minimum** write a test that diffs the `description:` strings against the `.md` headings/paragraphs and fails on drift.

This is the single highest-leverage architectural change available.

### 2.2 🟡 `regExpSearch` patterns are inconsistent and over-broad

Some examples:

```js
// Brood — strict (good)
regExpSearch: /^(?=.*brood)(?=.*leatherwing).*$/i

// Tribune — too loose
regExpSearch: /tribune/i      // matches "tribune", "intributed", "contribunal"…

// Pearl — also loose
regExpSearch: /pearl/i

// Combat Medic — `.` is not escaped
regExpSearch: /combat.medic/i // matches "combat-medic", "combatXmedic", "combat\nmedic"
```

A single inconsistent convention is harder to read and review than no convention. Pick one (the Brood pattern is good — anchored, multi-token lookahead, case-insensitive) and apply it everywhere.

### 2.3 🟡 Globals everywhere, no type definitions

The MPMB JS files reference `SourceList`, `RaceList`, `WeaponsList`, `ClassList`, `SpellsList`, `AddSubClass`, `RequiredSheetVersion`, `desc`, `toUni`, `typePF`, `tDoc`, `AddACMisc`, `event` — none of which are imported, declared, or typed. They are runtime globals provided by the host. That's MPMB's contract, but you can defend yourself:

- A `globals.d.ts` (or even a JSDoc `@global` block) declaring the shape of `RaceList[k]` would catch typos like `subname` vs `subName`, `usagescalc` vs `usageCalc`, `spellcastingBonus` vs `spellCastingBonus` at lint time.
- A small "loader" stub that mocks these globals would let you `require()` each file in a test and assert it doesn't throw.

Right now, **the only way to validate one of these JS files is to load it into MPMB and click around**. That is a hopeless test loop.

### 2.4 🟡 `paths` map is hand-maintained

`scripts/createRulebooks.js:29-44` is a hardcoded enumeration. Adding a new homebrew silently doesn't get built unless you remember to update it. This is exactly the kind of metadata you should be **discovering**, not declaring:

```js
import { glob } from "glob";
const docs = await glob("src/**/*.md", { ignore: ["**/Ideas.md", "**/TEMPLATE.md", "**/CHANGELOG.md", …] });
```

…or, if you want a stable short-name → path map, derive the keys from the file path (`combatmedic` from `CombatMedic.md`).

### 2.5 🟡 Build script: no error handling, no parallelism, no exit code

```js
// scripts/createRulebooks.js
const cvs = process.argv.slice(2);   // cvs = leftover from a CV/résumé project this was forked from
…
for (let i = 0; i < cvs.length; i++) {
  const rule = paths[cvs[i]];          // no validation: typo → undefined.md → handbooker throws
  await handbooker(`${rule}.md`, `${rule}.pdf`, options);   // one failure aborts the rest
}
```

What's missing:
- **Validation:** unknown key → friendly error listing the available keys.
- **Resilience:** wrap each call in a try/catch so one bad doc doesn't kill the rest. Aggregate failures and exit non-zero at the end.
- **Concurrency:** these are independent. `Promise.all` (with a small concurrency cap if Puppeteer's memory is a concern) would dramatically speed up `npm run build`.
- **Logging:** the only output is `>>> path` and `Finished!`. No timing, no success/failure summary.
- **Naming:** rename `cvs`. It's left over from another project and confuses every reader.

### 2.6 🟡 Build artifacts (PDFs) committed to the repo

`*.pdf` is LFS-tracked, which is good — but the PDFs are also the **build output**, regenerated by `npm run build`. So every content change creates a noisy LFS diff, and the `Did you remember to build the CV?` pre-commit echo (yes — "CV"; another fossil) is the only thing nudging authors to keep them in sync.

Two cleaner options:
1. Stop committing PDFs. Build them in CI and publish them to GitHub Releases (or a `gh-pages` branch, or a Cloudflare R2 bucket), then have the README link to the latest published artifact.
2. Keep committing them, but have CI **rebuild and assert no diff** so you can't ship out-of-sync PDFs.

Right now you have neither — and so the PDFs in the repo can silently lag the source for weeks (some `.md` files have no matching `.pdf` at all: `Vakkyr.js`, `Gambler.js`, `MagicItems.js` are missing entirely).

---

## 3. Build, CI, and tooling

### 3.1 🟠 CI runs nothing useful

```yaml
# .circleci/config.yml
- image: circleci/node:12.6.0     # Node 12 went EOL April 2022; "circleci/node" is the legacy 1.0 image namespace
…
- run: npm install                # use `npm ci` for reproducible installs
- run: npm run test               # which is…
```

…and the only test is:

```js
// __tests__/root.spec.js
describe("Root", () => {
  describe("should just pass", () => {
    it("because it is true", () => { expect(true).toBe(true); });
  });
});
```

So CI is a green tick for nothing. It does **not** verify that:
- the markdown actually builds to a PDF;
- the MPMB JS files parse;
- the linter/formatter would clean;
- linked external images still resolve;
- any of the dozen content correctness invariants in §1 hold.

**Minimum viable CI** for this repo:
1. `npm ci`
2. `node --check` every `*.js` (or run them in a sandbox with the MPMB globals stubbed)
3. `npm run build` — verify all PDFs generate without throwing
4. `prettier --check` (not just `--write`)
5. A small `markdown-link-check` against the `.md` files
6. Spell-check (`cspell`) with a custom dictionary for D&D terms

### 3.2 🟠 Pre-commit hook formats only `./scripts/**`

```json
// package.json
"format:staged": "pretty-quick --staged --pattern ./scripts/**",
"husky": {
  "hooks": {
    "pre-commit": "npm run format:staged && echo Did you remember to build the CV?"
  }
}
```

`./scripts/**` is **15 lines of CV-leftover** — your real source tree is in `./src/**` and gets nothing. Also the `echo Did you remember to build the CV?` references a CV (résumé) project this was forked from, and is now confusing folklore.

Fix:
```json
"format:staged": "pretty-quick --staged --pattern \"{src,scripts,__tests__}/**/*.{js,md,json}\"",
…
"pre-commit": "npm run format:staged"
```

### 3.3 🟠 `path` is not a package

```json
// package.json devDependencies
"path": "^0.12.7",
```

`path` is a Node built-in. The npm package by that name is an abandoned 2015 polyfill. Listing it shadows the built-in in some bundlers and triggers `npm audit` warnings. Just delete the entry — nothing in this repo even imports `path`.

### 3.4 🟡 No `.prettierrc`, no `.editorconfig`

Without explicit config, Prettier picks defaults that may differ between Node versions and IDEs. Mixed tabs/spaces (you have both — `Tribune.js` uses tabs in the header comment and spaces in the body) and inconsistent 2-vs-4-space indentation across the JS files prove this is already happening.

Drop a `.prettierrc.json`:
```json
{ "tabWidth": 2, "useTabs": false, "printWidth": 100, "trailingComma": "es5" }
```
…and a `.editorconfig` to back it up.

### 3.5 🟡 `package.json#main` points at a non-existent `index.js`

Harmless (no consumer imports the package), but it's a smell. Either remove the field or set it to the build script.

### 3.6 🟢 Babel is overkill

You target Node, which has had ESM and async/await for years. `@babel/node` adds a 10MB+ install and a startup hit just to allow `import` syntax. Switching to ESM (`"type": "module"` and renaming `.js` → `.mjs` for the script, or just using `require`) would let you delete `@babel/cli`, `@babel/core`, `@babel/node`, `@babel/preset-env`, and `.babelrc`.

---

## 4. Repository hygiene

### 4.1 🟡 PDFs and source are entangled in commits

Every content commit touches both `Foo.md` and `Foo.pdf`. The PDF is large, binary (LFS), and meaningless to a human reviewer. PRs become impossible to read. See §2.6.

### 4.2 🟡 Half-finished WIP next to released content

```
src/Classes/Brewmaster/Brewmaster.md
src/Classes/True-Forged/True-Forged.md
src/Classes/Aetherist/Aetherist.md
src/Classes/Squire/Squire.md
src/Races/Werewolf/Werewolf.md
src/Races/Golem/Golem.md
src/Races/Duclops/DuclopsFighter.md
src/Races/Duclops/DuclopsMagi.md
src/Races/Primordial Genasi/PrimordialGenasi.md   # space in path — please don't
src/Subclasses/Monk/WayOfTheShadowRealm/WatoftheShadowRealm.js   # 0 bytes
```

A new contributor can't tell which of these are "actively worked on", "abandoned", "never built". A simple `STATUS.md` in each subdir, or a `status: draft|published` frontmatter, would cost ten minutes and save weeks of confusion.

Note `src/Races/Primordial Genasi/` — directory names with spaces will bite you the first time someone writes a shell script that doesn't quote them.

### 4.3 🟡 Orphan and misnamed files

- `WatoftheShadowRealm.js` (typo of "Way", and wrong casing) — empty file.
- `WayoftheShadowRealm.md` (lowercase `o`) — every other "Way of the X" file uses `WayOfTheX`.
- `Shade, with 2 subraces [Jeremy Forbing's work, transcribed by MPMB].js` — a 60-character file name with brackets, commas, and apostrophes. It works on macOS / Linux, will hurt on Windows, and breaks `xargs ls -l` (I tried).

### 4.4 🟡 External hot-linked images

```md
src/Subclasses/Monk/WayOfTheSelfless/WayOfTheSelfless.md:8
![rock lee](https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/4b849f.../rock_lee_vs_gaara_….jpg?token=…)
```

That URL contains a JWT-signed token. Several of those URLs (`pinimg.com`, `theplaylist.net`, `db4sgowjqfwig.cloudfront.net`, `forum.playboundless.com`) point at content not under your control. Any one of them dropping a referer check, expiring a token, or rotating storage will silently break the next PDF build.

Download the assets you actually want to use, put them in `assetts/` (sigh — see 4.5), and check the licensing.

### 4.5 🟡 `assetts/`

It's misspelled. It's been misspelled for years. It's now the canonical raw URL referenced from many `.md` files (`https://media.githubusercontent.com/media/.../assetts/medic.png`), so renaming it would break every published PDF and every external link.

You're stuck. The lesson is the lesson: directory names are an API. Spell-check yours. (For new directories elsewhere, use the correct spelling and consider a `git mv` + redirect now rather than later.)

### 4.6 🟢 Personal todo files inside `src/`

`src/Ideas.md`, `src/Spells/Ideas.md`, `src/Races/Ideas.md`, `src/Rules.md` (one bullet), `src/Classes/TIPS.md`. These are bullet-point dumps with no titles, no dates, no owners. Per your own root `CLAUDE.md`:

> All work should be tracked in GitHub issues by default … New ideas during development: Create new GitHub issues rather than TODO comments in code.

Those `Ideas.md` files are the same anti-pattern. Migrate to issues with a `idea` label and delete the files.

---

## 5. IP, licensing, and provenance

### 5.1 🟠 The license file disagrees with `package.json`

- `LICENSE.md` → MIT.
- `package.json` → `"license": "ISC"`.

Pick one. (MIT is the more common choice for content-adjacent code.) `npm` and many compliance scanners read `package.json`; humans read `LICENSE.md`. They will reach different conclusions until you fix it.

### 5.2 🟠 Verbatim XGtE content embedded in homebrew

`src/Subclasses/Ranger/Tribune/Tribune.js:79-91` defines a feature called **Mage Slayer** with `source: ["XGTE", 0]` and a description copied verbatim from *Xanathar's Guide to Everything* (a paid Wizards of the Coast publication). Even if your homebrew is intended only for personal use, distributing copyrighted text under an MIT license is a misrepresentation of the rights you have. WotC's Open Game License doesn't cover XGtE.

Either:
- Replace the description with "Mage Slayer (see XGtE p. 168)", **or**
- Confirm the SRD/OGL covers it (it doesn't), **or**
- Remove the feat.

Same caution applies to:
- The Cavalier subclass content quoted in `src/Subclasses/TEMPLATE.md` (PHB-protected text).
- The cleric content in `src/Classes/TEMPLATE.md` (PHB).
- DanDwiki content imported into `Brood.js` — DanDwiki is CC BY-SA 4.0, which is **viral**: anything that wraps it must also be CC BY-SA. That arguably contaminates the MIT license you ship.

This isn't a fun review item, but it's the kind of thing that causes a take-down later. Get ahead of it now.

### 5.3 🟢 Source attribution is inconsistent

```js
// CombatMedic.js
SourceList["S:Combat Medic"] = { name: "Submortimer - Fighter Martial Archetype: Combat Medic", group: "Giant in the Playground forums", … };
// …but two lines above:
// "This subclass is made by mcclowes"
// and "Code by: MorePurpleMoreBetter"
```

You credit yourself, then credit "Submortimer" as the source, then credit MPMB as the code author. Untangle this — the credits are demonstrably contradictory.

---

## 6. Process & contributor experience

### 6.1 🟢 README is too modest

The repo is more than a "collection of homebrews". It is a **publishing pipeline** that turns markdown into PDFs and MPMB-compatible JS bundles. That's interesting and reusable. The README should explain:
- Architecture (md → PDF via handbooker; sibling .js → MPMB sheet)
- The naming convention (`Foo.md` and `Foo.js` in `src/Category/Foo/`)
- How to add a new homebrew (template, paths registration, build, PR)

It also has a typo: `npmr run build medic` (line 15).

### 6.2 🟢 No `CONTRIBUTING.md`, no PR template, no issue templates

You explicitly invite contributions. Show contributors what good looks like:
- A `CONTRIBUTING.md` describing the dual-source convention and the expectation that md and js stay in sync.
- A PR template with checkboxes: "PDF rebuilt? MPMB JS updated? Cross-checked stats vs description?"
- Issue templates for "Bug in published content" vs "New homebrew idea".

### 6.3 🟢 No `CHANGELOG.md` at the repo level

There are per-class `CHANGELOG.md` files (`Warden`, `CombatMedic`) which is great — but no top-level one. With 14+ buildable documents and no published version per document beyond a hand-bumped date in the JS file, players can't tell whether the PDF they downloaded six months ago is still current.

### 6.4 🟢 No `.github/` directory at all

No PR template, no CODEOWNERS, no GitHub Actions. CircleCI is fine, but a `.github/dependabot.yml` would replace the very-stale-looking `dependabot/npm_and_yarn/lodash-4.17.21` PR titles in `git log` with something less mystery-meat.

---

## 7. Things I'd tackle first if I owned this

In priority order:

1. **Fix the bugs in §1.** All six. They affect the actual game. Some are 30-second fixes; do them this afternoon.
2. **Make CI useful (§3.1).** Even just `npm run build` in CI catches a future broken PDF before it ships.
3. **Eliminate the dual-source-of-truth problem (§2.1).** This is the change that prevents §1 from happening again. Do it once and you stop paying drift tax forever.
4. **Sort out the licensing and verbatim WotC text (§5).** You don't want this to become a problem later.
5. **Pre-commit, formatter, and CV-fossil cleanup (§3.2, §3.3, §3.4).** A morning's work; permanently cleaner repo.
6. **Shrink the repo's surface area (§4).** Move drafts to a `wip/` directory or a separate branch; move ideas to issues; delete dead `WatoftheShadowRealm.js`.
7. **Status dashboard / proper README (§6.1).** So a new contributor can land in 30 minutes, not a week.

---

## 8. What this codebase is doing well

It would be unfair to leave only the bad. Real strengths:
- **Conventional structure.** `src/<Category>/<Name>/<Name>.{md,js,pdf}` is consistent enough that the build script is small and a reader can predict where a thing lives.
- **Per-document changelogs** for Warden and Combat Medic — exactly the right granularity for content that players track over time.
- **Per-document templates** (`TEMPLATE.md`, `Template.md`) — the *intent* of a single source of truth is there, even if the implementation drifted.
- **Designer-notes sections** in some markdown files (`WayOfTheSelfless.md` has a great one). These are gold for collaborators and players alike.
- **Git LFS** is correctly configured for the binary assets — many small projects skip this and bloat their git history with multi-MB blobs.
- **The content itself is genuinely creative** and shows real game-design thinking. The mechanical bugs are obscuring good design — fix them and the work shines.

---

## Appendix A — Quick-fix patches you can ship today

These are five-minute changes with high leverage. Pick three before lunch.

```text
A1. src/Subclasses/Ranger/Tribune/Tribune.js:153
    -    usagescalc: "event.value = Math.min(1, tDoc.getField('Wis Mod').value);",
    +    usagescalc: "event.value = Math.max(1, tDoc.getField('Wis Mod').value);",

A2. src/Races/Brood/Brood.js (×3 lines)
    -    "Brood: +2 Charsima and +1 to Strength, Dexterity, or Constitution;",
    +    "Brood: +2 Wisdom and +1 to Strength, Dexterity, or Constitution;",
       (then audit `scores` and `trait` to all three say the same thing)

A3. src/Subclasses/Fighter/CombatMedic/{CombatMedic.js,CombatMedic.md}
    s/from feat again/from this feature again/g

A4. src/Classes/Warden/Warden.js:72-94
    Delete the first `// level 0` row and renumber comments.

A5. package.json
    Remove the "path" devDependency.
    Fix "format:staged" pattern to cover ./src as well as ./scripts.
    Pick MIT or ISC; sync with LICENSE.md.

A6. scripts/createRulebooks.js
    Rename `cvs` → `requestedDocs`. Add validation for unknown keys.
```

## Appendix B — Tests I'd write first

```text
T1. For every src/**/*.js, parsing must succeed in Node with MPMB globals stubbed.
T2. For every Brood-style race with `improvements`, `scores`, `trait`: assert all three encode the same +/- per ability.
T3. For every class with `spellcastingTable`: assert length === 20.
T4. For every `usagescalc` containing 'Math.min(1,'  → fail (almost certainly meant max).
T5. For every paths[k] in createRulebooks.js: assert the .md file exists.
T6. Build smoke test: npm run build must produce a non-empty PDF for every key in `paths`.
T7. Markdown lint: no `your` adjacent to ` I `; no double spaces; consistent heading depths.
```

Each of these is a few lines of Jest. Together they would have prevented every 🔴 in this review.

---

*End of review. Push back on anything here that you disagree with — I'd rather argue and learn than be deferred to and be wrong.*
