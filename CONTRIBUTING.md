# Contributing to nodal

[AGENTS.md](AGENTS.md) is the contract. It binds human and AI contributors alike. This page is the practical version.

## Setup

```bash
git clone https://github.com/prathikcannotcode/nodal.git
cd nodal
npm run validate -- --strict
npm test
```

No `npm install`. Everything runs on Node 22+ built-ins.

## Most wanted

| Area | Examples |
|---|---|
| The unread notifications | G.S.R. 148(E) of 26 February 2026, the corrigendum to rule 3(1)(c)(iii) and 3(1)(ca), and G.S.R. 328(E) of 17 May 2021 (E-Commerce rule 4(1)). Read the gazette PDF, update the catalog entry, flip `read`. |
| New amendments | Anything notified after 10 February 2026. Open a [regulatory change issue](https://github.com/prathikcannotcode/nodal/issues/new?template=regulatory-change.yml) with the gazette link. |
| A second fixture | A synthetic app written by someone who has not read the skills. See "What this fixture cannot show" in the run sheet. |
| Check depth | Android and iOS evidence (home screen links, in-app report flows), audio and video generation paths |
| More instruments | Part III of the IT Rules, the online gaming provisions, sector rules, as new skills with their own catalog entries |

## Rules of the road

1. **The gazette is the source.** A catalog entry cites the notification that fixes its current wording. Commentary helps you find the clause; it never sets `verified`. If the date or clause is uncertain, leave `verified: false` and say why in `note`.
2. **Skills name rule ids, not numbers.** A clock lives in `catalog/rules.json` and nowhere else, so an amendment is one edit.
3. **Keep to the layout.** A new file type needs a rule in `.claude/schemas/layout.json` and, for JSON, a schema. The write-guard hook will stop an agent otherwise. Hooks, schemas, settings and the catalog are off limits to agents: edit those by hand.
4. **One skill per directory.** `.claude/skills/<name>/SKILL.md` with `name` (matching the directory) and `description` frontmatter. Sections: trigger, purpose, legal basis, checks, what is not a gap, guardrails, commands.
5. **No real personal data.** Not in fixtures, issues, screenshots or test output.
6. **Don't tune on a scored fixture.** Changing a skill after reading a fixture's score ends that fixture's blindness. Say so in the next score.

## Pull requests

- `npm run validate -- --strict` and `npm test` pass (CI runs both).
- One topic per PR. A catalog update and a refactor are two PRs.
- Say which catalog rules you changed and link the gazette PDF.

## Disclaimer

Contributions are compliance tooling, not legal advice. Phrase skills as guidance, and never have one say "compliant".
