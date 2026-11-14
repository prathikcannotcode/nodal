# Score: cold audit of neem-square

Assessment `2026-11-14-neem-square-full`, 22 findings, run on 14 November 2026 against nodal 0.1.0 and the catalog verified the same day. Scored the same day against `examples/neem-square.expected.json`. The audit recorded its model as `claude-fable-5-2`.

`report.json` has the same sha256 before and after scoring: `3bb0e18535426f8c8a00ae3086f20748cbd4d4a6d5f914ce6ea70ca92459942f`.

This folder holds the run's `report.json`, `summary.md` and `classification.json`. `score-map.json` records which findings the scorer matched to which planted issue, and `score-check.mjs` reproduces the mechanical checks:

```bash
node examples/neem-square.run-1/score-check.mjs examples/neem-square examples/neem-square.expected.json
```

## Result

| Measure | Score |
|---|---|
| Classification tags | Match: intermediary, smi, ssmi, sgi; no ecom |
| Planted issues found | 17 of 17 |
| Partly found or missed | 0 |
| At least one key clause cited | 17 of 17 |
| Key clause anchors cited | 19 of 20 |
| Should-not-flag violations | 0 of 13 |
| Other findings: fair-if-reported / real unplanted gap / false positive | 2 / 0 / 0 |
| ECOM-RULES findings on a product that sells nothing | 0 |
| Places the output says "compliant" or "fully meets" | 0 |
| Files containing a fixture value | 0 of 3 |
| Findings with an absolute or missing path, or a line past the end | 0 of 20 |
| Retention findings naming the DPDP tension and Vigil without resolving it | 2 of 2 |
| `not_checked`, disclaimer, clock table, fix-first list | All present |

## Read this before the table

Three things limit what these numbers show.

1. **One author.** The same session wrote the skills, the catalog, the app and the key. The audit agent had not seen the key, but the skills were written by someone who knew what kinds of gap the app would hold. 17 of 17 shows the skills find the gaps their author had in mind. It does not show they find gaps in a product nobody at nodal has seen.
2. **The audit was a sub-agent, and the run sheet was not followed to the letter.** The audit ran as a fresh-context agent started by the session that built nodal, on a plain copy of the workspace with `examples/` removed. The folder was not yet a git repository, so there was no `git archive` of a commit. It was not a separately launched Claude Code session, so the blind copy's own hooks never ran.
3. **The scorer placed the files.** The building session's write-guard treated the blind copy as outside its workspace and blocked the audit agent's writes. The agent did not route around the hook; it returned the three files as text. The scorer extracted them byte for byte into this folder and ran `npm run validate -- --strict`, which passes. The audit agent had checked its JSON against the schema and the catalog in memory only.

## Blindness

The audit agent's prompt named two folders, the blind nodal copy and the app, and neither held the key or the run sheet. A search of its transcript for `expected.json`, `run-sheet`, `should_not_flag` and `fair_if_reported` finds no match. It reported reading nothing outside the two folders. The transcript was searched, not read in full.

## Planted issues

| ID | Issue | Findings | Verdict | Clause check |
|---|---|---|---|---|
| P1 | No named Grievance Officer or Resident Grievance Officer | F-0005 | Found | Both anchors |
| P2 | Grievance page three clicks from home | F-0006 | Found. Traces the path and counts the clicks | Cited |
| P3 | No contact address in India | F-0014 | Found | Cited |
| P4 | `resolve_days` 15 | F-0007 | Found. Notes the escalation job first fires on day 14 | Cited |
| P5 | `content_removal_hours` 72 | F-0008 | Found. Names both categories it applies to | Cited |
| P6 | `NCII_SLA` 24 hours | F-0001 | Found. Includes the 12-hour second page | Cited |
| P7 | Orders runbook and rota cannot meet 3 hours | F-0002, F-0003, F-0004 | Found, as three findings: target, rota hours, weekly post scan | Cited |
| P8 | Removed content purged at 30 days | F-0009 | Found. Names the associated records | Cited |
| P9 | Registration data purged at 30 days | F-0010 | Found. Links the Privacy Policy promise; DPDP tension named, not resolved | Cited |
| P10 | Reminder cron is yearly | F-0017 | Found. Reads the expression against its comment | Cited |
| P11 | Reminder carries one limb of three | F-0018 | Found | Cited |
| P12 | Terms lack the AI warnings | F-0019 | Found. Checks the guidelines and the reminder too | Cited |
| P13 | Edit path skips both filters | F-0011 | Found | Cited |
| P14 | Feed pipeline strips provenance | F-0013 | Found. Says stripping ordinary uploads is not the gap | Rule 3(3)(b) cited; Rule 3(3)(a)(ii) not |
| P15 | `clean_export` drops the label | F-0012 | Found | Both anchors |
| P16 | No declaration, check or label on upload | F-0015, F-0016 | Found, split by sub-clause | Cited at (a), (b), (c) |
| P17 | Policy removal with no notice or dispute route | F-0020 | Found. Notes the copyright notice comes after removal | Cited |

## Should-not-flag

All 13 clean. Where a finding sits on a should-not-flag file, it concerns a different line: F-0007 and F-0008 on `config/support.yaml` leave `ack_hours` alone, F-0014 on `contact.html` records both officers as named and based in India, F-0019 on `terms.md` is section 3, F-0020 on `takedown.py` is `remove_for_policy`. F-0012 says in terms that the label for ordinary users is not a gap. The audit did not open `tests/fixtures/grievances.json`.

## Other findings

- **F-0021**, Rule 3A(7), no step for Grievance Appellate Committee orders: on the fair-if-reported list. Medium, worded as "not found in the reviewed material".
- **F-0022**, Rule 4(4), proactive detection not found: on the fair-if-reported list. Low, and it notes the automated tooling the compliance report implies.

One observation inside F-0009 was not planted and is correct: the purge deletes `moderation_events` at 30 days, and it runs at 02:30 on the 1st, before the compliance report at 06:00, so removals from the first day of a 31-day month are missing from that month's published count.

## What the audit left unsaid

- P14 cites Rule 3(3)(b) alone. The stripped metadata also means the published image no longer meets Rule 3(3)(a)(ii).
- Rule 3A(3): the grievance page mentions the appeal route without the 30-day window. The audit recorded "no gap found", which the catalog note supports, but a low good-practice finding would also have been fair.
- The audit treated the yearly reminder as meeting Rule 3(1)(f). The Terms also promise a notice on change, and no job sends one. Fair-if-reported, not reported.

## Next measurement

Changing a skill in response to this score ends this fixture's blindness. A fairer second run needs an app written by someone who has not read the skills, audited from a separately launched session in a `git archive` of a tagged commit.
