# Operating Rules

These rules bind all agents (AI and human contributors) working in this repository.

## What nodal reports

nodal never says "compliant". A finding says which file, page or missing artefact falls short of which clause, how serious that is, and what to do. A run with no findings means "no gaps found in the material reviewed", and the report says so in those words.

## Layout

Only write files matching the paths defined in `.claude/schemas/layout.json`. Agents do not edit `.claude/scripts`, `.claude/schemas`, `.claude/settings.json` or `catalog/rules.json`; a human changes those by hand.

## Classification comes first

Wrong classification gives wrong findings. `/classify` runs before any check and stores its answer in `company-profile/{id}/classification.json`. Every other skill reads `tags` from that file and applies only the catalog rules whose `applies_to` shares a tag. If the file is missing, run `/classify` first. If `tags` is empty, nothing in scope applies: say so and stop.

## The rule catalog

`catalog/rules.json` is the only source of clauses and clocks. Skills name rule ids; they do not restate timelines, so a change in the law is one edit to one file.

- Cite a clause exactly as the catalog writes it, such as `Rule 3(2)(a)(i)`. A sub-clause of a catalog clause is fine. The validator rejects anything else.
- If a rule has `verified: false`, or a `note` that says part of it is unconfirmed, say so in the finding's issue text and list the rule under "Unverified rules relied on" in `summary.md`.
- A duty that only another instrument imposes (DPDP, RBI, CERT-In) goes in `cross_reference` or the summary, never in `clause`.

## Findings

Every finding must:

- Follow `.claude/schemas/finding.schema.json`, numbered `F-0001` upwards within the report.
- Set `framework` to `IT-RULES` or `ECOM-RULES` and cite the catalog clause.
- Start from the catalog's `default_severity`. Go lower when the gap is partial, higher only when the code shows the duty cannot be met at all.
- State the value the code has and the value the rule needs, such as "resolve_days is 15; the rule gives 7".
- Give `file` and `line` for a gap in the repo, relative to the audited codebase's root. Give `url` for a gap seen only on the live site. A missing artefact (no runbook, no reminder job) has neither.
- Set `found_at`. Leave `owner` and `due_date` out unless the user gave them.

## Live-site checks

Only when the user gives a URL. Fetch public pages with GET requests: the home page and the contact, help, legal, grievance, terms and privacy pages linked from it, 15 pages at most. No logins, no form submissions, no query strings carrying data. Record the page in `url`. If nothing can fetch pages in this session, skip the live check and list it under `not_checked`.

## Personal data

No personal data in findings, summaries or drafts. A Grievance Officer's published name is fine: publishing it is the point of the rule. A user's complaint, a complainant's name or contact, and anything from a fixture or a database is not. Reference those by file and line.

## The DPDP tension

Rule 3(1)(g) and 3(1)(h) require keeping removed content and registration data for 180 days. The DPDP Act requires erasure in some of the same cases. When a purge job sits in that overlap, report the IT Rules gap, name the tension in `cross_reference`, and point the user to Vigil. Do not resolve it.

## Every report carries

- `disclaimer`: "nodal is compliance tooling, not legal advice. It reports gaps visible in the material reviewed and never certifies compliance. Have a qualified lawyer check every finding before relying on it."
- `not_checked`, always including:
  - DPDP Act 2023 and DPDP Rules 2025 (use Vigil)
  - IT Rules Part III (digital media publishers) and rule 5
  - Online gaming provisions: rule 3(1)(b)(ix)-(x), rule 4(10)-(13), rules 4A to 4C
  - Rule 3(1)(i), (k), (l), (m), (n): security practices, CERT-In reporting, accessibility, constitutional rights
  - Rule 4(2) first originator, rule 4(3) advertised content, rule 4(7) voluntary verification
  - The parts of rule 3(1)(d) other than the three-hour clock (G.S.R. 775(E) was not read when the catalog was built)
  - E-Commerce Rules beyond grievance duties
  - RBI, SEBI, IRDAI, TRAI and other sector rules
  - Any amendment notified after G.S.R. 120(E) of 10 February 2026
  - Whether the product is an intermediary in law: the classification records the user's answer and what the code shows

  Add what this run skipped: catalog rules not examined, the live site if not fetched, material not supplied.

## When something is missing or blocked

A run should end with a partial result and a list of what it skipped. It should not stall.

- **Nobody can answer a question** (headless run, no reply): take the answer from the material you have and carry on. Never write `false`, `0` or a guess for something you don't know. Record it under `unknowns` with `basis: "unconfirmed"`.
- **A hook blocks a write**: do not route around it through the shell or another tool. Put the content at the nearest path the layout allows, usually `assessments/{id}/`, and report the block.
- **The only evidence is an absence**: if a runbook, job or template is merely missing from the material you were given, write "not found in the reviewed material" and rate it medium at most. Go higher when the code or a document itself shows the gap.

## Contributing

1. Keep to the layout.
2. Edit skills in `.claude/skills/` only. One skill per directory: `.claude/skills/<name>/SKILL.md`, with `name` and `description` frontmatter.
3. A catalog change is a human edit with the gazette PDF open. Set `verified: true` only after reading the clause number and the deadline in the notification, and mark the notification `read: true`.
4. Run `npm run validate -- --strict` and `npm test` before opening a PR.
