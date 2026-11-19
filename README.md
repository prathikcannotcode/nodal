# nodal

**An open-source agent that reads your product and reports where it falls short of India's intermediary due diligence rules.** Eleven Claude Code skills, one rule catalog checked against the gazette, and findings that cite the clause, the file and the fix.

[![CI](https://github.com/prathikcannotcode/nodal/actions/workflows/ci.yml/badge.svg)](https://github.com/prathikcannotcode/nodal/actions/workflows/ci.yml)
[![License: Apache 2.0](https://img.shields.io/badge/license-Apache%202.0-0F1317)](LICENSE)
![IT Rules 2021, as amended to February 2026](https://img.shields.io/badge/IT%20Rules%202021-amended%20to%20Feb%202026-f0a63a)
![11 Claude Code skills](https://img.shields.io/badge/Claude%20Code-11%20skills-0F1317)
![Zero dependencies](https://img.shields.io/badge/dependencies-0-0F1317)

[Quick start](#quick-start) · [What a run gives you](#what-a-run-gives-you) · [Accuracy](#how-accurate-is-it) · [Skills](#skills) · [The catalog](#the-catalog-and-what-verified-means) · [Guardrails](#guardrails) · [Contribute](CONTRIBUTING.md)

Sibling to [Vigil](https://github.com/prathikcannotcode/Vigil), which does the same job for the DPDP Act and the GDPR.

## Why now

Safe harbour under section 79 of the IT Act depends on following the Intermediary Guidelines. On 20 February 2026 an amendment (G.S.R. 120(E)) cut most of the clocks in those guidelines and added duties for AI-generated media. A platform that hard-coded the old numbers in 2021 is now out of time in several places at once, and the numbers sit in config files and runbooks that counsel never sees.

| Duty | Clause | Clock now | Before 20 Feb 2026 |
|---|---|---|---|
| Act on a court order or government intimation | Rule 3(1)(d) | 3 hours | 36 hours |
| Remove intimate or morphed imagery on complaint | Rule 3(2)(b) | 2 hours | 24 hours |
| Resolve a complaint asking for content removal | Rule 3(2)(a)(i) | 36 hours | 72 hours |
| Resolve any other grievance | Rule 3(2)(a)(i) | 7 days | 15 days |
| Remind users of the terms and the consequences of breach | Rule 3(1)(c) | Every 3 months | Every year |
| Acknowledge a complaint | Rule 3(2)(a)(i) | 24 hours | Unchanged |
| Answer a government information order | Rule 3(1)(j) | 72 hours | Unchanged |
| Keep removed content and its records | Rule 3(1)(g) | 180 days | Unchanged |
| Keep registration data after account closure | Rule 3(1)(h) | 180 days | Unchanged |

Every row was read in the gazette text. The full list, with sources, is [`catalog/rules.json`](catalog/rules.json).

nodal starts from the code. It finds `resolve_days: 15` in a YAML file, the takedown runbook that waits for the next working day, the image pipeline that strips the provenance tag your generator just wrote, and the grievance page that names a mailbox where the rule asks for a person.

It never says you are compliant. It says which file, page or missing document breaks which clause.

## What a run gives you

`/audit` writes three things to `assessments/<id>/`:

- **`report.json`**: schema-valid findings. Each has a severity, a clause the catalog recognises, the value found and the value required, a file and line (or a page URL, or neither for a missing document), and a recommendation.
- **`summary.md`**: the classification, findings by severity, a one-page table of every clock the company is on, a fix-first list, and what was not checked.
- **SARIF**, through `/export`, for GitHub code scanning on the audited repository.

`/draft` then writes first drafts of the three documents most audits ask for: the Grievance Officer page, the complaint acknowledgement, and the takedown runbook. Clocks come from the catalog. Names and addresses are placeholders for you to fill.

## How accurate is it?

One cold run so far, on [`examples/neem-square`](examples/neem-square): a 36-file synthetic social platform with an AI image generator, whose code states none of its gaps. An agent that had never seen the answer list ran `/classify` and `/audit`; the result was scored against the list afterwards. The [score](examples/neem-square.run-1/score.md):

| Measure | Result |
|---|---|
| Planted gaps found | 17 of 17 |
| Expected clauses cited | 19 of 20 |
| Should-not-flag items flagged anyway | 0 of 13 |
| False positives among the other findings | 0 of 2 |
| Complaint data copied into any output | 0 |

Treat that as a floor test, not a benchmark. The same author wrote the skills and the test app, so the run shows the skills find the gaps their author had in mind. The audit also ran as a sub-agent of the session that built nodal, not as a separately launched session. The score sheet sets out both limits, and the [run sheet](examples/neem-square.run-sheet.md) says how to do a fairer run. A fixture written by someone who has not read the skills is the contribution that would tell us most.

## Quick start

You need [Node.js 22+](https://nodejs.org) and [Claude Code](https://claude.com/claude-code). There is nothing to `npm install`. On Windows, install [Git for Windows](https://git-scm.com/download/win) too: the hooks run in Git Bash, and without it every write is blocked.

1. **Clone and check the workspace.**
   ```bash
   git clone https://github.com/prathikcannotcode/nodal.git
   cd nodal
   npm run validate -- --strict
   ```
   It should end with `0 error(s)`.
2. **Open Claude Code in the repo.**
   ```bash
   claude
   ```
3. **Add your product's code.** Type `/add-dir ../your-app`. nodal reads it and never edits it.
4. **Classify.** Type `/classify`. It asks five questions, confirms what it can from the code, and stores the answer in `company-profile/<id>/classification.json`. Every check reads that file.
5. **Audit.** Type `/audit`, or `/audit https://your-site.example` to check the published pages too. The report and summary land in `assessments/<id>/`.
6. **Take the output further.** `/draft` writes the Grievance Officer page, the acknowledgement template and the takedown runbook into the same folder. For GitHub code scanning:
   ```bash
   npm run export:sarif -- --company <id> --output findings.sarif
   ```
   Upload `findings.sarif` with [`github/codeql-action/upload-sarif`](https://docs.github.com/en/code-security/code-scanning/integrating-with-code-scanning/uploading-a-sarif-file-to-github) from the audited repository. A finding with no file, such as a missing runbook, stays in `report.json`; the exporter names what it left out.

Your classifications and assessments are gitignored, so a public fork does not publish your gaps.

### Try it on the synthetic app first

Copy the app out of the repo, so the run cannot read the answer list, then add it like any other codebase and use company id `neem-square`:

```bash
cp -r examples/neem-square ../neem-square
```

Answer `/classify` from the company facts in the app's README. Afterwards, compare your report with [the answer list](examples/neem-square.expected.json).

### Or install the skills as a plugin

```bash
claude plugin marketplace add prathikcannotcode/nodal
```

```bash
claude plugin install nodal@nodal
```

The plugin carries the eleven skills, namespaced as `/nodal:audit`, `/nodal:classify` and so on. It carries no hooks, no catalog and no validator: the skills read `catalog/rules.json` and the schemas from a nodal workspace, so clone the repo to run an audit. The plugin is useful for looking things up from another project once you have a clone.

## Skills

| Skill | What it does |
|---|---|
| `/classify` | Decides which duties apply: intermediary, social media intermediary, significant social media intermediary (50 lakh registered users in India), AI-generated media, e-commerce model. Runs first. |
| `/catalog` | Looks up a clause, its clock, who it applies to, and whether it was checked against the gazette. |
| `/grievance` | Named Grievance Officer, contact details and complaint route, published one click from home; acknowledgement and resolution clocks; the appeal route. |
| `/takedown` | The admin action, runbook, on-call rota and audit log behind the 3-hour and 2-hour clocks; purge jobs that delete inside 180 days; government information requests. |
| `/terms` | The three documents, the prohibited content clause, the three-monthly reminder and what it must say, AI warnings. |
| `/ai-media` | Filters on every generation path, the label, provenance metadata, and any code that strips either. |
| `/ssmi` | Chief Compliance Officer, nodal contact person, Resident Grievance Officer, India address, monthly report, notice before removal, the AI declaration on upload. |
| `/ecom` | Consumer grievance officer displayed with designation, 48-hour acknowledgement, one-month redressal, ticket numbers. |
| `/audit` | Runs the checks the classification selects, in order, and writes the report and summary. |
| `/draft` | Grievance Officer page, acknowledgement template, takedown runbook. |
| `/export` | SARIF 2.1.0. |

## The catalog, and what "verified" means

Skills name rule ids. Clocks live only in [`catalog/rules.json`](catalog/rules.json), so an amendment is one edit to one file, and the validator rejects any finding whose clause the catalog does not have.

Each rule carries a `verified` flag. It is `true` only where the clause number and the deadline were read in the gazette notification itself. All 38 rules are verified today, against these texts:

| Notification | Read |
|---|---|
| G.S.R. 139(E), 25 Feb 2021: the principal rules | Yes |
| S.O. 942(E), 25 Feb 2021: the 50 lakh threshold | Yes |
| G.S.R. 794(E), 28 Oct 2022 | Yes |
| G.S.R. 275(E), 6 Apr 2023 | Yes |
| G.S.R. 775(E), 22 Oct 2025 | Yes |
| G.S.R. 120(E), 10 Feb 2026 | Yes |
| G.S.R. 148(E), 26 Feb 2026: corrigendum to G.S.R. 120(E) | **No** |
| G.S.R. 462(E), 23 Jul 2020: E-Commerce Rules | Yes |
| G.S.R. 328(E), 17 May 2021: E-Commerce amendment | **No** |

Both gaps are narrow. G.S.R. 148(E) corrects which criminal statute rule 3(1)(c)(iii) and rule 3(1)(ca) name; no clock depends on it. G.S.R. 328(E) is reported to touch only E-Commerce rule 4(1), on the nodal officer, and the catalog leaves that rule out.

A report's `law_as_at` is the date of the latest notification read, not the day the catalog was last checked.

Rule 3(1)(d) deserves a second look by anyone who runs a takedown desk. Since November 2025 a government intimation counts only if it is in writing, gives reasons, comes from an authorised officer of at least Joint Secretary rank (a Director where that rank is not appointed; Deputy Inspector General for the police), and names the legal basis, the unlawful act and the specific URL. Since February 2026 the officer's authorisation must itself be by order in writing, and the clock is three hours. The rule does not say what a platform should do with an intimation that falls short, so nodal checks that your runbook reads each one against those conditions and leaves the rest to counsel.

Two things in the starting brief turned out differently in the gazette. The three-monthly reminder is rule 3(1)(c); the separate yearly notice of the documents and their changes in rule 3(1)(f) was not amended. And the rules give users a 30-day window to appeal to the Grievance Appellate Committee, but nothing read requires a platform to tell users so. nodal reports a closure message that omits it as low severity and says why.

## Guardrails

- **Classification first.** No check runs without a stored classification, and a product that neither handles user content nor sells online gets "nothing in scope applies", not a list of findings.
- **Agents cannot edit their own guards.** A write-guard hook blocks writes outside [`layout.json`](.claude/schemas/layout.json). The catalog, schemas, scripts and settings are outside it.
- **Every write is validated.** A second hook checks each JSON file against its schema, and each clause against the catalog.
- **Reports cannot omit their limits.** The schema requires `not_checked` and `disclaimer`.
- **No personal data in findings.** A Grievance Officer's published name is fine. A complainant's is not.
- **Live-site checks read public pages only.** GET requests, no logins, no form submissions. This one rests on the skill instructions; see [SECURITY.md](SECURITY.md).

## Not checked

DPDP (use [Vigil](https://github.com/prathikcannotcode/Vigil)). Part III of the IT Rules on digital media publishers. The online gaming provisions. Rule 3(1)(i), (k), (l), (m) and (n). Rule 4(2), 4(3) and 4(7). The E-Commerce Rules beyond grievance duties. RBI, SEBI, IRDAI, TRAI and other sector rules. Blocking orders under section 69A of the IT Act. Anything notified after 10 February 2026, which includes the draft Second Amendment published on 30 March 2026 if it has since been notified. Every report repeats this list.

One overlap nodal reports and does not resolve: rules 3(1)(g) and 3(1)(h) require keeping some data for 180 days, and the DPDP Act has its own erasure duties for the same data. Sections 8(7) and 12(3) of that Act except retention needed to comply with a law, so the 180 days stand. What may be kept after day 180 is a question for counsel. A finding there names the overlap and sends you to Vigil.

## Disclaimer

nodal is compliance tooling, not legal advice. It reports gaps visible in the material it reviewed, and AI can make mistakes. Have a qualified lawyer check every finding and the classification before you rely on either.

## Contributing and licence

See [CONTRIBUTING.md](CONTRIBUTING.md); the most useful contribution is a test app written by someone who has not read the skills. Apache 2.0, in [LICENSE](LICENSE).
