# Changelog

## 0.1.2 (19 November 2026)

### Second review: catalog
- Three E-Commerce rules for sellers on a marketplace, read in the gazette text of G.S.R. 462(E): `EC-6-4-b`, the seller's own grievance officer on a 48-hour and one-month clock; `EC-6-5-e`, the officer details the seller gives the marketplace; and `EC-5-3-seller`, the marketplace's duty to display them. The catalog now holds 41 rules.
- `EC-4-2` follows the gazette wording, fax included. `IT-4-4` gives the full scope of proactive detection and its safeguards.
- `IT-3-1-b` and `IT-3-1-c` state the language requirement.
- The `IT-3-1-c` note says limb (iii) is unconfirmed, so audits list it under "Unverified rules relied on".
- The `IT-3-3-a-ii` note records that rule 3(3) can be read to reach a platform that only hosts synthetic media.

### Second review: skills and schemas
- New classification tag `ecom-seller`. A seller on a marketplace is not an e-commerce entity, so it takes this tag without `ecom`. `/ecom` gains a check for it.
- `/ai-media` gains a check for platforms that host synthetic media made elsewhere, at medium at most and flagged as a question of reading.
- `/terms` checks the language the documents and the reminder are offered in.
- `/classify`, `/ssmi`, the classification schema and the README say "more than 50 lakh": rule 2(1)(v) says above the threshold.
- `export-sarif` explains a missing `--input` file instead of crashing.

### First review: skills
- Reports take `law_as_at` from the latest notification marked read, not from the catalog's `last_verified`. `summary.md` and every draft print both dates.
- `summary.md` states the rule 7 consequence once: failing to observe the rules removes section 79(1) protection.
- `/classify` asks whether the Ministry has made a rule 6 order applying rule 4 below the threshold.
- `/terms` no longer expects the fact check unit limb of rule 3(1)(b)(v), which the Bombay High Court struck down.
- `/takedown` and `AGENTS.md` describe the DPDP overlap as the Act does: sections 8(7) and 12(3) except retention needed to comply with a law.

### First review: not checked list
- Adds blocking orders under section 69A and the draft Second Amendment of 30 March 2026.

### First review: catalog
- `IT-4-1-a`, `IT-4-1-b` and `IT-4-1-c` no longer give three months from crossing the threshold. Rule 4(1) counts three months from the notification of the threshold on 25 February 2021, so an intermediary that crosses it today has no period. `IT-4-1-a` adds the Chief Compliance Officer's liability.
- Adds the corrigendum G.S.R. 148(E) of 26 February 2026, marked unread. `IT-3-1-c` carries the corrected third limb and a note saying so.
- `IT-3-1-b` restores the limbs of sub-clauses (ii), (v) and (vii) that its summary left out, and notes that the Bombay High Court struck down the fact check unit limb of (v).
- `IT-3-1-g` and `IT-3-1-h` describe the DPDP overlap as sections 8(7) and 12(3) do.
- These changes were read in the consolidated text hosted by MIB, updated to 10 February 2026, and not in the gazette PDFs.

### First review: schemas
- The `law_as_at` description matches the skills, and the `ssmi` tag description includes a rule 6 order.

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
