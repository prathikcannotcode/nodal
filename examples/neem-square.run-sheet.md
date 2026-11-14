# Neem Square run sheet

`examples/neem-square` measures what nodal detects and what it wrongly flags. Its key is `examples/neem-square.expected.json`. Two sessions do the work, because whoever has read the key cannot run the audit.

## Audit session: cold, never opens the key

Whoever prepares the run exports a committed revision, so uncommitted skill text cannot help the audit. From the repo root, with `<commit>` set to the revision under test:

```bash
BLIND="$HOME/nodal-blind-run"
mkdir -p "$BLIND/nodal" "$BLIND/neem-square"
git archive <commit> | tar -x -C "$BLIND/nodal"
git archive <commit> examples/neem-square | tar -x --strip-components=2 -C "$BLIND/neem-square"
rm -rf "$BLIND/nodal/examples"
```

Start a new session in `$BLIND/nodal`, with no other session's context, notes or transcripts, then:

1. Add the app with `/add-dir` and the path to `$BLIND/neem-square`.
2. Run `/classify` with company id `neem-square`. Answer only from the company facts in the app's README.
3. Run `/audit` on the app. No live site: the app has none. Do not open the original repo or use the web.
4. Run `npm run validate -- --strict` in `$BLIND/nodal`.
5. Hand over `assessments/<assessment_id>/`, `company-profile/neem-square/classification.json` and the transcript. Do not score.

## Scoring session: separate, reads the key

Compare `report.json` with the key.

- **Blindness.** Search the transcript for `expected.json` and `run-sheet`. A hit in anything the audit session read voids the run.
- **Classification.** The stored tags against the key's.
- **Each `expected` item.** Found: the finding names the mechanism and the value, including the other files the issue text points to. Partial: right topic, mechanism or value missing or wrong. Missed: neither. One finding may cover two items.
- **Citation.** Right if the finding cites a key clause, or a sub-clause of it.
- **Each `should_not_flag` item.** Violated if a finding treats it as a gap. A neutral mention is clean.
- **Other findings.** One that matches a `fair_if_reported` line is neutral. Check the rest against the app and call each a real unplanted gap or a false positive.
- **"Compliant".** Count places where the report or summary says the product is compliant or fully meets a rule.
- **Values.** Count files that copy a name, email or complaint text from `tests/fixtures/grievances.json`.
- **Report furniture.** `not_checked` and `disclaimer` present; the summary has the clock table; the DPDP tension is named on the retention findings and not resolved.

Report found, partial and missed out of the `expected` count, should-not-flag violations out of its count, and the other tallies. Commit the score with the audit output under `examples/neem-square.run-<n>/`.

Tuning skills on a scored run ends this fixture's blindness. Say so in any later score; another blind measurement needs a new fixture.

## What this fixture cannot show

The same author wrote the skills, the catalog and this app. A high score shows the skills find the kinds of gap their author had in mind. It does not show they find the gaps in a product nobody at nodal has seen. A fixture written by someone who has not read the skills would be a fairer test.
