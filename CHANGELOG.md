# Changelog

## 0.1.1 (15 November 2026)

### Catalog
- G.S.R. 775(E) of 22 October 2025 is read and marked `read: true`, from the gazette PDF. `IT-3-1-d` now sets out when a takedown intimation gives actual knowledge under rule 3(1)(d): a court order, or a reasoned written intimation from an officer authorised in writing, not below Joint Secretary (Deputy Inspector General for the police), that names the legal basis, the unlawful act and the specific URL. Intimations are reviewed monthly by a Secretary-level officer.
- The rule does not say what an intermediary should do with an intimation that falls short. The catalog note leaves that to counsel.
- One notification remains unread: G.S.R. 328(E) of 17 May 2021.

### Skills
- `/takedown` checks that the orders runbook has a step that reads an intimation against those conditions.
- `/draft` writes that step into the takedown runbook as a checklist.
- Reports no longer list rule 3(1)(d) as partly unconfirmed. They list instead that nodal does not judge whether any actual order is valid.

### Measured
- `/takedown` changed after run 1 on `examples/neem-square` was scored, so a later run on that app is not blind for this skill. Run 1's files are unchanged and still describe the catalog as it was on 14 November 2026.

## 0.1.0 (15 November 2026)

First public release.

### What it checks
- The IT (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021, Part II, as amended up to G.S.R. 120(E) of 10 February 2026.
- The grievance duties of the Consumer Protection (E-Commerce) Rules, 2020.

### Catalog
- `catalog/rules.json` holds 38 rules: 31 for the IT Rules and 7 for the E-Commerce Rules. Each cites the gazette notification that fixes its current wording.
- Six notifications were read in the gazette PDFs: G.S.R. 139(E), S.O. 942(E), G.S.R. 794(E), G.S.R. 275(E), G.S.R. 120(E) and G.S.R. 462(E).
- Two were not read and are marked `read: false`: G.S.R. 775(E) of 22 October 2025, which rewrote rule 3(1)(d), and G.S.R. 328(E) of 17 May 2021. The three-hour clock in rule 3(1)(d) is confirmed from the 2026 text. Who may issue a takedown intimation, and what it must contain, are not in the catalog.

### Skills
- Eleven: `classify`, `catalog`, `grievance`, `takedown`, `terms`, `ai-media`, `ssmi`, `ecom`, `audit`, `draft`, `export`.
- `/classify` runs first and stores its answer. Every check applies only the catalog rules its tags select.

### Guardrails
- The validator rejects a finding whose clause is not in the catalog, or a sub-clause of a catalog clause.
- A report without `not_checked` or `disclaimer` fails its schema.
- Agents cannot write the catalog, the schemas, the scripts or the settings.

### Measured
- One cold run on `examples/neem-square`: 17 of 17 planted gaps found, 0 of 13 should-not-flag items flagged. The same author wrote the skills and the test app, and the audit ran as a sub-agent of the building session. `examples/neem-square.run-1/score.md` sets out both limits.

### Not yet exercised
- `/draft`, `/ecom` and live-site checks have not been run by an audit agent.
- The hook-command test is skipped on Windows.
