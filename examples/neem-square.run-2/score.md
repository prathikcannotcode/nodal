# Score: blind audit of neem-square, run 2

Assessment `2026-11-19-neem-square-full`, 22 findings, run on 19 November 2026 against nodal 0.1.2 at commit `b3b1829`. The audit recorded its model as `claude-opus-5-5`. Scored on 20 November 2026 against `examples/neem-square.expected.json`.

`report.json` has the same sha256 here as in the blind copy: `d20c12c5ab6eb1ae9d9aa4c3a13355a5222d02d67d6ef728e257a5683622b958`. `findings.sarif` also matches its source: `cf977c8f1b62727c2d083611dcafe78248ab8af765cb244733add05eac433d16`.

This folder holds the run's `report.json`, `summary.md`, `classification.json`, `findings.sarif`, the three drafts and the audit session's `audit-notes.md`. `score-map.json` records which findings the scorer matched to which planted issue. To reproduce the mechanical checks:

```bash
node examples/neem-square.run-2/score-check.mjs examples/neem-square examples/neem-square.expected.json
```

## Result

| Measure | Run 2 | Run 1 |
|---|---|---|
| Classification tags | Match | Match |
| Planted issues found | 17 of 17 | 17 of 17 |
| Partly found or missed | 0 | 0 |
| At least one key clause cited | 17 of 17 | 17 of 17 |
| Key clause anchors cited | 19 of 20 | 19 of 20 |
| Should-not-flag violations | 0 of 13 | 0 of 13 |
| Other findings: fair-if-reported / correct, outside the key / false positive | 3 / 1 / 0 | 2 / 0 / 0 |
| ECOM-RULES findings on a product that sells nothing | 0 | 0 |
| Places the output says "compliant" or "fully meets" | 0 | 0 |
| Output files containing a fixture value | 0 of 8 | 0 of 3 |
| Findings with an absolute or missing path, or a line past the end | 0 of 20 | 0 of 20 |
| Retention findings naming DPDP and Vigil without resolving it | 2 of 2 | 2 of 2 |
| `not_checked`, disclaimer, clock table, fix-first list | All present | All present |
| Drafts written by `/draft` | 3, no clock error found | not run |
| SARIF export | 20 results (the 2 findings with no file left out) | not run |

## What this run adds over run 1

1. **A separate session.** The audit ran in a separately launched Claude Code session on a `git archive` of a tagged commit, as the run sheet asks. Run 1 was a sub-agent of the building session.
2. **`/draft` and `/export` ran for the first time.** Run 1 did neither.
3. **0.1.2 skills.** The intimation check from 0.1.1 and the declaration and reminder changes from 0.1.2 all fired. Neither cost a should-not-flag item.

## Limits

1. **Not blind for the skills' author.** The skills and catalog were changed in 0.1.1 and 0.1.2 by sessions that had read run 1's score. The changes came from two legal reviews, not from tuning on this fixture, but `CONTRIBUTING.md` rule 6 counts any change made after reading the score. The same author wrote the skills, the app and the key. This run measures the session, not the fixture.
2. **The hooks' wiring was not exercised.** The session started in the original repo, whose write-guard blocked writes to the blind copy. The session fed each write through the blind copy's own `write-guard.mjs` and `validate-on-write.mjs` from a script. All seven writes passed both hooks. The hook logic ran; the `.claude/settings.json` wiring did not.
3. **Skills were read, not invoked.** The session followed each `SKILL.md` from the blind copy instead of running slash commands.
4. **Untested here:** `/ecom` and the seller check (the app sells nothing), the live-site checks (no URL), and the `/ai-media` host check as a separate finding (for an SSMI it folds into `IT-4-1A`).

## Blindness

The audit session read lines 1 to 24 and 43 to 45 of the run sheet: the audit section and "What this fixture cannot show". It skipped lines 25 to 42, the scoring section. The transcript has no tool call that opens `expected.json` or anything under `neem-square.run-1/`. No tool result contains `should_not_flag`, `fair_if_reported` or text from run 1's score. Its first prompt names no planted value (`NCII`, `clean_export`, `resolve_days`, `Singapore`, `image_to_image`). The transcript was searched, not read in full.

## Planted issues

| ID | Issue | Findings | Verdict | Clause check |
|---|---|---|---|---|
| P1 | No named Grievance Officer or Resident Grievance Officer | F-0004 | Found | Both anchors |
| P2 | Grievance page three clicks from home | F-0005 | Found. Traces the path through `help.html` and `legal_index.html` | Cited |
| P3 | No contact address in India | F-0013 | Found. Notes the officers are said to be in Bengaluru with no address | Cited |
| P4 | `resolve_days` 15 | F-0006 | Found. Names the categories it applies to | Cited |
| P5 | `content_removal_hours` 72 | F-0007 | Found. States the 3(1)(b) sub-clause exceptions correctly | Cited |
| P6 | `NCII_SLA` 24 hours | F-0003 | Found. Includes the 12-hour second page | Cited |
| P7 | Orders runbook and rota cannot meet 3 hours | F-0001, F-0002 | Found. Works an example: an order at 21:00 Friday waits about 61 hours | Cited |
| P8 | Removed content purged at 30 days | F-0008 | Found. Names the associated records | Cited |
| P9 | Registration data purged at 30 days | F-0009 | Found. Links the Privacy Policy promise; DPDP and Vigil in `cross_reference`, not resolved | Cited |
| P10 | Reminder cron is yearly | F-0016 | Found. Reads the expression against its comment | Cited |
| P11 | Reminder carries one limb of three | F-0017 | Found. Flags limb (iii) as unconfirmed | Cited |
| P12 | Terms lack the AI warnings | F-0018 | Found. Checks the guidelines too | Cited |
| P13 | Edit path skips both filters | F-0010 | Found | Cited |
| P14 | Feed pipeline strips provenance | F-0012 | Found | Rule 3(3)(b) cited; Rule 3(3)(a)(ii) not |
| P15 | `clean_export` drops the label | F-0011 | Found. Filed on `generate.py`, names `features.yaml` | Both anchors |
| P16 | No declaration, check or label on upload | F-0014 | Found, as one finding covering all three | Cited |
| P17 | Policy removal with no notice or dispute route | F-0019 | Found | Cited |

## Should-not-flag

All 13 clean. Findings filed on a should-not-flag file concern a different line:
- F-0006 and F-0007 leave `ack_hours` alone.
- F-0013 on `contact.html` is about the address only.
- F-0018 on `terms.md` is section 3.
- F-0005 on `footer.html` is the grievance link, not the Merch link.
- F-0019 on `takedown.py` is `remove_for_policy`.

The mentions elsewhere are neutral:
- F-0002 names `remove_on_order` and the audit log as existing.
- F-0010 notes that `text_to_image` checks prompts and outputs and fails closed.
- F-0012 says `provenance.py` writes the metadata.
- The draft acknowledgement template says the intake already acknowledges in time.

The audit session did open `tests/fixtures/grievances.json` before reading `/grievance`, against that skill's guardrail. `audit-notes.md` item 10 records this. No fixture value appears in any output file.

## Other findings

- **F-0020**, Rule 3A(7), no step for Grievance Appellate Committee orders: fair-if-reported. Medium, "not found in the reviewed material".
- **F-0021**, Rule 4(4), proactive detection not found: fair-if-reported. Notes the `policy:auto` removals.
- **F-0022**, Rule 3(2)(a)(ii), orders go to counsel, not the Grievance Officer: fair-if-reported. Low, marked partial.
- **F-0015**, Rule 3(1)(d), the runbook does not read an intimation against the rule's conditions. The facts are right: step 1 checks the authority, the URLs and the legal basis, not rank, written authorisation, reasons or the unlawful act. The key predates the 0.1.1 change that added this check, so it is outside the key, not a false positive. Rule 3(1)(d) sets when an intimation gives actual knowledge and does not itself oblige anyone to keep a checklist, so this is a practice gap rather than a breach. Medium is the ceiling. The key should list it as fair-if-reported.

F-0008 repeats run 1's unplanted observation: the purge runs before the monthly compliance report and deletes `moderation_events` the report would count.

## Drafts

Read against the catalog. Nothing wrong found.
- **`grievance-officer-page.md`:**
  - Its clocks are 24 hours, 2 hours, 36 hours and 7 days.
  - The 36-hour row states the rule 3(1)(b)(i), (iv) and (xi) exceptions in plain words.
  - The appeal paragraph covers both a decision and an unresolved complaint, as rule 3A(3) does.
- **`takedown-runbook.md`:**
  - Lists every rule 3(1)(d)(ii) condition as a checkbox.
  - Leaves the shortfall question to counsel in a marked block.
  - Gives rule 3(1)(j) its 72 hours and rule 3(1)(g) its 180 days, with the DPDP note pointing to Vigil.
- **`acknowledgement-template.md`:** carries no complaint text and leaves `{{reasons}}` mandatory.

Every draft opens with both dates and uses bracketed placeholders for names, with nothing invented.

## What the audit left unsaid

- P14 cites Rule 3(3)(b) alone again. Both runs missed the same anchor, so this is the skill's wording, not chance.
- The Terms promise notice of changes and no job sends one (Rule 3(1)(f)). Fair-if-reported, not reported, as in run 1.

## Friction the run found in nodal itself

From `audit-notes.md`. The first three affect users, not just this fixture:

1. `/export` and the README write `findings.sarif` to the repo root, outside `layout.json`. The shell bypasses the write-guard, so nothing objects.
2. A blind copy cannot pass `npm test`: the run sheet deletes `examples/`, and the strict-validation test then fails with ENOENT.
3. The fixture warning sits in `/grievance`, after `/classify` has already sent the agent through the repo. The write-guard's personal-data check would not catch a name.
4. `/audit` step 1 asks the user to confirm the classification, which a headless run cannot do.
5. The clock table instruction does not say which kinds of deadline count ("Always", "Before display", "Notice before removal").
6. "Fix first" ranks five config edits above two purge jobs that destroy records every night.
7. `/grievance` check 4 does not say whether orders routed to Legal rather than the Grievance Officer is a gap.
8. For an SSMI, `/ai-media` check 4 and `/ssmi` check 6 overlap on outside uploads.

## Next measurement

Changing a skill in response to this score ends what is left of this fixture's blindness. A fairer test still needs an app written by someone who has not read the skills, audited from a session launched inside the blind copy so the hook wiring runs too.
