---
name: catalog
description: "Look up the rule catalog: which clause carries a duty, what the clock is, who it applies to, and whether the entry was checked against the gazette text. Use for \"which rule\", \"what is the deadline\", \"is this verified\", \"what changed in February 2026\"."
---

# Rule catalog

## Trigger

"which rule", "which clause", "what is the deadline for", "is this verified", "what changed in 2026", "rule catalog"

## Purpose

`catalog/rules.json` holds every obligation nodal checks. Other skills name rule ids from it. This skill reads it for the user; it never edits it. The write-guard blocks agent writes to `catalog/`, because the validator trusts the file.

## What is in the file

- `last_verified`: the date the entries were last checked. Reports copy it to `law_as_at`.
- `instruments[].notifications[]`: the principal rules and each amendment, with `read: true` only if someone read that gazette text. An unread notification is a known hole.
- `rules[]`: `id`, `instrument`, `clause`, `applies_to` (classification tags), `obligation`, `deadline`, `evidence_hints`, `default_severity`, `verified`, `source_url`, and a `note` where part of the rule is unconfirmed.

## Scope

In: the IT (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021, Part II, as amended up to G.S.R. 120(E) of 10 February 2026 (in force 20 February 2026), and the grievance duties of the Consumer Protection (E-Commerce) Rules, 2020.

Out: see "Every report carries" in `AGENTS.md` for the full not-checked list.

MeitY publishes a consolidated text of the rules on meity.gov.in. Read it alongside the notifications when checking an entry; the gazette notification is what `verified` is measured against.

## How to answer

- **A clause or deadline question.** Quote the catalog entry: id, clause, deadline, and the note. If `verified` is false, or the note says part is unconfirmed, say so first.
- **"What applies to us?"** Read `company-profile/{id}/classification.json` and list the rules whose `applies_to` shares a tag, grouped by skill: grievance, takedown, terms, ai-media, ssmi, ecom.
- **"What changed in February 2026?"** List the rules whose `note` starts "Was": each gives the old value.
- **Something the catalog lacks.** Say it is not in the catalog. Do not answer from memory as if it were. Suggest a regulatory-change issue with the gazette link.

## Proposing a change

Write the proposed entry and its gazette source to `assessments/{id}/catalog-proposal.md`, or open a regulatory-change issue. A maintainer edits `catalog/rules.json` by hand, sets `verified` after reading the notification, and runs `npm run validate -- --strict` and `npm test`.

## Commands

| Run | Action |
|---|---|
| `/catalog` | Summarise instruments, what was read, and rule counts by tag |
| `/catalog <rule id or clause>` | Show one entry |
| `/catalog applies` | List the rules the stored classification selects |
| `/catalog unverified` | List unread notifications and rules with an unconfirmed part |
