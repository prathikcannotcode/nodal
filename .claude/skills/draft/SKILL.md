---
name: draft
description: "Draft the three documents most audits ask for: the Grievance Officer page, the complaint acknowledgement template and the takedown runbook, with clocks filled from the rule catalog and placeholders for facts only the company knows. Use for \"draft grievance page\", \"acknowledgement template\", \"takedown runbook\"."
---

# Draft the fixes

## Trigger

"draft grievance officer page", "write the grievance page", "acknowledgement template", "takedown runbook", "draft the fixes"

## Purpose

Turn findings into first drafts a lawyer and an engineer can finish. Every clock comes from `catalog/rules.json` at the time of drafting. Every fact the company must supply is a visible placeholder.

## Rules for every draft

- Read the classification and the latest report first. Draft for the tags that apply: an SSMI page names three officers; an e-commerce page adds the designation.
- Fill clocks from the catalog and cite the rule id beside each, so a later amendment is easy to trace.
- Never invent a name, address, email, phone number or date. Use placeholders in capitals inside square brackets, such as `[GRIEVANCE OFFICER NAME]`, and list every placeholder at the top of the file under "Fill these in".
- Start each file with: "DRAFT for legal review. Not legal advice. Clocks as at {catalog last_verified}."
- Plain language. A complainant in distress reads these.
- Write to `assessments/{assessment_id}/drafts/`. Do not edit the audited product's files; the team applies the drafts.

## The three drafts

### `grievance-officer-page.md`

- The Grievance Officer's name, designation and contact details (placeholders), and the hours the contact is monitored.
- How to complain: the form or address, what to include, and that a person who is not a user can complain.
- What happens next, with each clock from the catalog: acknowledgement (`IT-3-2-a-ack`), resolution (`IT-3-2-a-resolve`), removal complaints (`IT-3-2-a-removal`), intimate or morphed imagery (`IT-3-2-b`), and that each complaint gets a ticket number.
- The appeal route to the Grievance Appellate Committee and its window (`IT-3A-3`).
- If `ssmi`: the Chief Compliance Officer, the nodal contact person, the Resident Grievance Officer and the contact address in India (placeholders), per `IT-4-1-a` to `IT-4-1-c` and `IT-4-5`.
- If `ecom`: the consumer grievance officer's name, designation and contact, with the clocks in `EC-4-5`. Keep the two sets of clocks apart and say which complaints each covers.
- A note for the engineer: link this page from the home page or footer, so it is one click from home.

### `acknowledgement-template.md`

Subject and body for the automatic acknowledgement: the ticket number, the date and time received, which clock applies to this kind of complaint, how to add information, and the Grievance Officer's name. Include a closure template with reasons for the decision and the appeal route. Use merge fields such as `{{ticket_number}}`; no real complaint text.

### `takedown-runbook.md`

- Scope: court orders and government intimations (`IT-3-1-d`), intimate or morphed imagery complaints (`IT-3-2-b`), government information requests (`IT-3-1-j`).
- For each: where it arrives, who is on call (placeholder rota, staffed at all hours), the steps, the clock from the catalog with a target well inside it, and the escalation when the target is missed.
- Checks on an intimation before acting, as a short checklist taken from the obligation in `IT-3-1-d`: in writing, with reasons, the issuing officer's rank and written authorisation, the legal basis and statutory provision, the nature of the unlawful act, the specific URL or identifier. The clock runs while the check happens, so give it minutes, not hours. Leave a marked section for counsel on what to do when an intimation falls short: the rule does not say.
- The disable action to use, and the audit log entry to write.
- Preservation: what to keep and for how long (`IT-3-1-g`), and the pointer to Vigil for the DPDP overlap.
- A drill: run the path out of hours once a quarter and record the time taken.

## Commands

| Run | Action |
|---|---|
| `/draft` | Write all three drafts for the latest assessment |
| `/draft page` / `/draft ack` / `/draft runbook` | One draft |
