# nodal

Read AGENTS.md before doing anything. It is the operating contract.

## Project

Open-source agent that scans a product (its repo, and optionally its public site) and reports where it falls short of India's intermediary due diligence rules: the duties that protect safe harbour under s.79 of the IT Act. Sibling to Vigil, which covers DPDP and GDPR.

## Structure

- `.claude/skills/<name>/SKILL.md`: 11 skills. `classify` and `catalog` first; `grievance`, `takedown`, `terms`, `ai-media`, `ssmi`, `ecom` are the checks; `audit` runs them in order; `draft` writes fixes; `export` writes SARIF
- `catalog/rules.json`: every clause and clock nodal checks, with a `verified` flag per rule and a list of which gazette notifications were read
- `.claude/schemas/`: JSON Schemas, plus `layout.json`, which lists every writable path and its schema
- `.claude/scripts/`: hooks (`write-guard`, `validate-on-write`), validation, the SARIF exporter, tests
- `company-profile/{id}/classification.json`: the stored answer of `/classify`
- `assessments/{id}/`: one audit: `report.json`, `summary.md`, drafts
- `examples/`: a synthetic app with planted gaps, its answer key, run sheet and scored run

## Rules

1. Only write files matching paths in `.claude/schemas/layout.json`. The write-guard hook enforces this.
2. Run `/classify` before any check. Apply only the catalog rules its tags select.
3. Cite clauses exactly as `catalog/rules.json` writes them. The validator rejects a clause the catalog does not have.
4. Never say "compliant". Say which file, page or missing artefact breaks which clause.
5. No personal data in findings. Reference by file path and line number only.
6. Every report carries the disclaimer and the list of what was not checked.
7. Live-site checks are GET requests to public pages. No logins, no form submissions.

## Validation

```
npm run validate
npm test
```
