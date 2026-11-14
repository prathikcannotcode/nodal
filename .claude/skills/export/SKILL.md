---
name: export
description: "Export findings as SARIF 2.1.0 for GitHub code scanning. Use for \"export SARIF\", \"code scanning\", \"send findings to GitHub\"."
---

# Export to SARIF

## Trigger

"export SARIF", "SARIF output", "code scanning", "export findings"

## Purpose

Convert a report's findings to SARIF 2.1.0 so they show as code scanning alerts on the audited repository. Run the script; do not write the file by hand.

## How

```
npm run export:sarif -- --company <id> --output findings.sarif
npm run export:sarif -- --input assessments/<id>/report.json --output findings.sarif
```

`--company` uses that company's latest report.

## What goes in

Open findings that have a `file`. Code scanning needs a place in the repository to show an alert, so the script leaves out:

- findings with no `file`: a missing runbook, a missing reminder job, or a gap seen only on a live page (`url`)
- findings that are `remediated` or `accepted`

The script names what it left out. Tell the user, and point them to `report.json` and `summary.md` for those.

## Mapping

| SARIF | From |
|---|---|
| `result.ruleId` | framework and clause, e.g. `IT-RULES-Rule-3-2-a-i` |
| `result.level` | severity: critical or high is `error`, medium is `warning`, low is `note` |
| `result.message.text` | issue and recommendation |
| `result.locations[].physicalLocation` | `file` and `line`, relative to the audited repository's root |

Upload with GitHub's `codeql-action/upload-sarif` from the audited repository, so the paths resolve.

## Commands

| Run | Action |
|---|---|
| `/export` | Export the latest report as SARIF |
