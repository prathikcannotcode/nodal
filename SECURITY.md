# Security policy

## Reporting a vulnerability

Report security issues privately through [GitHub security advisories](https://github.com/prathikcannotcode/nodal/security/advisories/new). Do not open a public issue. Include what you found, how to reproduce it, and the impact.

## In scope

- Bypasses of the write-guard hook: writing outside `layout.json`, editing `catalog/rules.json`, smuggling a secret past the patterns
- Schema or catalog validation bypasses
- Command injection in the exporter
- Any path where nodal copies personal data into findings, summaries, drafts or exports
- A live-site check that does more than GET a public page

## Known limits

The hooks and the validator catch mistakes an agent makes through Claude Code's file tools. They are not a security boundary, and a file that passes them is well formed, not legally checked.

### Write paths the guard never sees

The write-guard runs on Write, Edit, MultiEdit and NotebookEdit. It does not see shell commands, MCP tools that write files, another harness, or a person with an editor. Claude Code's permission system is what stands in front of the shell: `.claude/settings.json` pre-approves only the validate and test commands. A session in auto mode, or started with `--dangerously-skip-permissions`, can write anything the shell can. For unattended runs, use a container, or make `.claude/scripts`, `.claude/schemas`, `.claude/settings.json` and `catalog/` read-only at the OS level.

`npm run validate -- --strict` in CI re-checks schemas and clauses however a file was written. It cannot tell that someone flipped a `verified` flag without reading the gazette, so read catalog diffs in review.

### Clause references

The validator checks that each reference in a finding's `clause` is a clause in `catalog/rules.json` for the finding's framework, or a sub-clause of one. "Rule 99" fails. It does not check that a sub-clause such as Rule 3(2)(a)(ix) exists, that the clause says what the finding claims, or that it applies to the product, and it never reads `cross_reference`. A lawyer still checks every finding.

### The catalog

`verified: true` means a person or an agent read the clause number and the deadline in the gazette text on the `last_verified` date. It does not mean the entry's summary of the obligation is complete, and it says nothing about amendments after that date. Two notifications have not been read; `catalog/rules.json` lists them with `read: false`.

### Classification

Every finding depends on `/classify`. The user count that makes a platform a significant social media intermediary is the company's own number, and whether a product is an intermediary at all is a legal question. nodal records the answer it was given and what the code shows. It does not check either against the world.

### Personal data

The guard blocks three formats in `company-profile/` and `assessments/`: Aadhaar numbers that pass the Verhoeff check, PAN, and +91 mobile numbers. Everything else gets through, including names and email addresses, because a Grievance Officer's published name and work email are data a report is meant to hold. Keeping complainants' details out of findings rests on the skills' instructions and on review. Treat the filter as a tripwire. It is not data-loss prevention.

It also has no say over what the model reads. Files Claude Code opens go to your model provider.

### Live-site checks

The skills tell the agent to fetch public pages with GET requests only, 15 at most, with no logins and no form submissions. Nothing in the scripts enforces that: it rests on the instruction and on the fetch tool the session has. Review the transcript of any run that touched a live site.

### Platform

- `onFailure: block` needs a recent Claude Code. On older versions, a hook that cannot start at all does not block the write.
- On Windows without Git Bash, Claude Code runs hooks in PowerShell, which can't parse the hook command. The write-guard then blocks every write, and post-write validation does not run. Install Git for Windows.

## Your data

nodal runs locally on your machine and your model provider. It has no server and no telemetry. Classifications and assessments you create stay in your clone and are gitignored by default. If you fork publicly, keep them out of the fork.
