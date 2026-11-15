---
name: takedown
description: "Check the takedown path of the IT Rules 2021: the 3-hour clock on court orders and government intimations, the 2-hour clock on intimate or morphed imagery complaints, 180-day preservation of removed content and registration data, and 72-hour replies to government information requests. Use for \"takedown\", \"court order runbook\", \"NCII\", \"retention of removed content\"."
---

# Takedown, preservation and government requests

## Trigger

"takedown", "court order", "government notice", "NCII", "intimate imagery", "deepfake complaint", "removed content retention", "law enforcement request"

## Purpose

Check that the product can act inside the shortest clocks in the rules, and that it keeps what the rules say to keep. Applies to every product tagged `intermediary`.

## Legal basis

Catalog rules `IT-3-1-d`, `IT-3-2-b`, `IT-3-2-c`, `IT-3-1-g`, `IT-3-1-h`, `IT-3-1-j`. Read each `obligation`, `deadline` and `note` from `catalog/rules.json` first.

## Checks

### 1. Orders and intimations (`IT-3-1-d`)

A clock measured in hours needs five things. Look for each:

- **An admin action** that disables content by URL or ID, without a deploy.
- **A runbook** for court orders and government intimations: who receives them, who decides, who presses the button.
- **A step that reads the intimation against the rule.** The catalog obligation lists what makes an intimation count: in writing, with reasons, from an officer of the stated rank who is authorised in writing, naming the legal basis, the unlawful act and the specific URL or identifier. A runbook that acts on anything from any government address, or one that has no such step, is a finding at medium: the rule sets the conditions, and the catalog note says what to do with a defective intimation is for counsel. Do not say the company may ignore one.
- **An on-call route** that is staffed when the order arrives. A legal inbox read on business days cannot meet a three-hour clock at 9 pm on a Saturday. Read the rota or paging config, not only the runbook's promise.
- **An audit log** of who disabled what and when.

Flag any SLA or target still set to the old period (the catalog note gives it). A missing runbook or rota is a missing artefact: no `file`, "not found in the reviewed material", medium at most. A runbook that states a longer period, or a rota that excludes nights and weekends, is evidence in a file: use the catalog severity.

### 2. Intimate, nude or morphed imagery (`IT-3-2-b`, `IT-3-2-c`)

- A report category for this content, open to the person depicted or someone acting for them, with fields for the link or content.
- The SLA for that queue, in code or config, against the catalog deadline. A stale 24 hours is the common gap.
- Whether anything staffs or automates that queue outside office hours.

### 3. Preservation (`IT-3-1-g`, `IT-3-1-h`)

Find every job that deletes. For each, work out what it deletes and after how long.

- Removed, hidden or moderated content and its associated records purged before the catalog period: finding under `IT-3-1-g`.
- Registration data purged before the catalog period after account closure: finding under `IT-3-1-h`.
- A hard delete at moderation time, with no retained copy, is the same gap with a period of zero.
- These jobs often exist to honour erasure requests. Report the IT Rules gap, put the DPDP tension in `cross_reference` ("DPDP s.8(7) and s.12 erasure: see Vigil"), and do not say which duty wins.

### 4. Government information requests (`IT-3-1-j`)

A runbook or intake for written orders from authorised agencies, and its stated response time against the catalog deadline.

## What is not a gap

- A retention period at or over the catalog period.
- A runbook whose stated response time is at or under the catalog deadline.
- Deleting content the user removed themselves: rule 3(1)(g) covers content removed on an order, a grievance, or the platform's own enforcement.

## Guardrails

- Do not open removed content, complaint records or request registers. Read the code and the runbooks.
- Never test a takedown action. Read it.

## Commands

| Run | Action |
|---|---|
| `/takedown` | Run all four checks |
| `/takedown retention` | Only the preservation checks |
