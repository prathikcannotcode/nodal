---
name: grievance
description: "Check the Grievance Officer duties of the IT Rules 2021: named officer and contact details published prominently, complaint intake, 24-hour acknowledgement, 7-day resolution, 36-hour removal complaints, and the appeal route. Use for \"grievance officer\", \"complaint SLA\", \"grievance page\"."
---

# Grievance Officer and complaint handling

## Trigger

"grievance officer", "grievance page", "complaint handling", "complaint SLA", "grievance audit"

## Purpose

Find where the product's published details and complaint handling fall short of rule 3(2)(a) and rule 3A. Applies to every product tagged `intermediary`.

## Legal basis

Catalog rules `IT-3-2-a`, `IT-3-2-a-ack`, `IT-3-2-a-resolve`, `IT-3-2-a-removal`, `IT-3-2-a-orders`, `IT-3A-3`, `IT-3A-7`. Read each entry's `deadline` and `note` from `catalog/rules.json` before checking; do not rely on a remembered number.

## Checks

### 1. Published details (`IT-3-2-a`)

Look in footer, contact, help, legal and grievance templates, and on the live site if a URL was given.

- **A named person.** The rule asks for the name of the Grievance Officer. A role mailbox such as `support@` or `grievance@` with no name is a finding.
- **Contact details** for that officer, and **the mechanism**: a form, an address or a portal where a user or a victim who is not a user can complain.
- **Prominence.** The details must be on the home page or home screen, or on a page directly reachable from it. Trace the links: if the grievance page is two or more clicks from home, that is a finding, with the path in the issue text.
- Report a missing name and a prominence gap as separate findings; they have separate fixes.

### 2. Intake and acknowledgement (`IT-3-2-a-ack`)

Find the intake route. Check that an acknowledgement goes out automatically and what the acknowledgement SLA is in config. An acknowledgement that depends on a person reading an inbox is a finding when nothing guarantees the catalog deadline.

### 3. Resolution clocks (`IT-3-2-a-resolve`, `IT-3-2-a-removal`)

Find the SLA constants and the code that turns them into due dates. Compare each value with the catalog deadline.

- Stale values are the common gap: 15 days where the catalog gives the current resolution period, 72 hours where it gives the current period for removal complaints. One finding per constant, with the value found and the value required.
- Check that a removal complaint reaches the faster clock at all. One SLA for every complaint, even a compliant-looking one, fails the removal rule if it is longer than the removal deadline.
- Check units. `2880` may be minutes or hours; read the code that uses it.

### 4. Orders and notices (`IT-3-2-a-orders`)

Who receives court orders and government notices, and is that address monitored? Usually a runbook question. `/takedown` covers the clock that follows.

### 5. Appeals (`IT-3A-3`, `IT-3A-7`)

- Closure and rejection templates: do they tell the user about the Grievance Appellate Committee and the appeal window? The catalog note says this is good practice and not a stated duty. Report its absence as low, and say so.
- Is there any step for complying with a Committee order and posting the compliance report? Absence is "not found in the reviewed material", medium at most.

## What is not a gap

- An acknowledgement SLA at or under the catalog deadline.
- An automatic acknowledgement with a ticket reference.
- A named officer whose contact is a role address, as long as the name is there.

## Guardrails

- Publish-side evidence only. Do not open complaint data, tickets or fixtures to "see how it works"; read the code and templates.
- Never copy a complainant's details. A Grievance Officer's published name may appear in a finding.
- For an SSMI the same person must also satisfy the Resident Grievance Officer rule: leave that to `/ssmi`, and cross-refer.

## Commands

| Run | Action |
|---|---|
| `/grievance` | Run all five checks on the repo |
| `/grievance <url>` | Also check the published details on the live site |
