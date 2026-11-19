---
name: audit
description: "Run the full intermediary due diligence audit: classify, then grievance, takedown, terms, AI media, SSMI and e-commerce checks as the classification selects, ending in a schema-valid report and a summary with every clock the company is on. Use for \"full audit\", \"IT Rules audit\", \"safe harbour check\", \"audit my app\"."
---

# Full audit

## Trigger

"full audit", "IT Rules audit", "safe harbour check", "intermediary audit", "audit my app"

## Purpose

Run every check the classification selects, in order, and write one report. The audit never concludes that the product is compliant. It lists the gaps it found, the clocks that apply, and what it did not look at.

## Workflow

1. **Classify** (`/classify`). Use the stored `company-profile/{id}/classification.json` if it exists and the user confirms it is current; otherwise run the skill. If `tags` is empty, write nothing under `assessments/`, tell the user nothing in scope applies, and stop.
2. **Select rules.** From `catalog/rules.json`, take every rule whose `applies_to` shares a tag with the classification. That list is the audit's checklist and the denominator of `coverage`.
3. **Run the checks**, skipping any whose tag is absent:
   - `/grievance` (tag `intermediary`)
   - `/takedown` (tag `intermediary`)
   - `/terms` (tag `intermediary`)
   - `/ai-media` (tag `sgi`)
   - `/ssmi` (tag `ssmi`)
   - `/ecom` (tag `ecom` or `ecom-seller`)
4. **Live site**, only if the user gave a URL: follow "Live-site checks" in `AGENTS.md`.
5. **Write the report and summary.**
6. Run `npm run validate -- --strict` and fix what it reports.

If a step cannot run, follow "When something is missing or blocked" in `AGENTS.md`, finish the rest, and name the skipped step in `not_checked`.

## Rules for findings

All of "Findings" in `AGENTS.md`, and:

- One gap, one finding. Two stale constants in one file are two findings; one missing officer that breaks two clauses is one finding citing both.
- Before filing, check the opposite reading. If the code already meets the catalog deadline, there is no finding, however old the file looks.
- A finding on `IT-3-1-g` or `IT-3-1-h` carries the DPDP cross-reference and the pointer to Vigil.
- A finding that relies on a rule with an unconfirmed part says so.
- Never copy a credential, a complaint or a fixture value into a finding.

## Output

`assessments/{assessment_id}/`, with id `YYYY-MM-DD-{company_id}-full`.

### `report.json`

Per `.claude/schemas/report.schema.json`: `assessment_id`, `company_id`, `scope` (the frameworks checked), `classification_tags`, `started_at`, `completed_at`, `assessor`, `target` (repo, commit, and site if checked), `model`, `nodal_version` (from `package.json`), `law_as_at` (the latest `date` among the catalog notifications marked `read: true` for the instruments in `scope`; never `last_verified`, which is only the day the entries were checked), `coverage` (rules selected, rules examined), `findings`, `not_checked` and `disclaimer` (both from `AGENTS.md`).

### `summary.md`

Open with one line: "Law as amended up to {law_as_at}. Catalog entries last checked {catalog last_verified}." Then, in this order:

1. **Classification**: the tags, each with its basis, and any unknowns.
2. **Findings by severity**: id, clause, one line, file or page. When `scope` includes `IT-RULES`, state the consequence once above the list: under rule 7, an intermediary that fails to observe these rules loses the protection of section 79(1) of the IT Act and is liable under any law in force. Do not say that any one finding has that result; that is for counsel.
3. **Every clock you are on**: a one-page table with one row per selected catalog rule that has a time limit. Columns: duty, clause, the clock, what the code or documents say today, finding id or "no gap found". Include the rows with no gap: this table is the page counsel pins to the wall.
4. **Fix first**: up to five findings, ordered by how short the clock is and how complete the gap is. For each, the change and where to make it.
5. **Unverified rules relied on**: any cited rule with `verified: false` or an unconfirmed part in its note.
6. **Not checked**: the list from `report.json`.
7. The disclaimer.

Do not write "compliant", "fully meets" or a score. Where a check found nothing, write "no gap found in the material reviewed".

## Commands

| Run | Action |
|---|---|
| `/audit` | Classify, then run every check the tags select |
| `/audit <url>` | Also check the public site |
| `/audit it` / `/audit ecom` | One framework only |
