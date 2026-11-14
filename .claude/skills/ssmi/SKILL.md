---
name: ssmi
description: "Check the extra duties of a significant social media intermediary under rule 4 of the IT Rules 2021: Chief Compliance Officer, nodal contact person, Resident Grievance Officer, India contact address, monthly compliance report, ticket numbers, notice before removal, and the AI-generated content declaration. Use for \"SSMI\", \"rule 4\", \"compliance officer\", \"monthly compliance report\"."
---

# Significant social media intermediary duties

## Trigger

"SSMI", "significant social media intermediary", "rule 4", "chief compliance officer", "nodal contact person", "resident grievance officer", "monthly compliance report"

## Purpose

Check rule 4. Applies only to products tagged `ssmi`: a social media intermediary with registered users in India at or above the notified threshold. If the tag is absent, say so and stop. If `/classify` recorded the user count as unknown, say that rule 4 was not checked for that reason, and list it under `not_checked`.

## Legal basis

Catalog rules `IT-4-1-a`, `IT-4-1-b`, `IT-4-1-c`, `IT-4-1-d`, `IT-4-1A`, `IT-4-4`, `IT-4-5`, `IT-4-6`, `IT-4-8`. Read each entry from `catalog/rules.json` first.

## Checks

### 1. The three officers (`IT-4-1-a`, `IT-4-1-b`, `IT-4-1-c`)

Three roles, three conditions each: appointed, an employee (the Chief Compliance Officer may be key managerial personnel or a senior employee), resident in India. The nodal contact person must be someone other than the Chief Compliance Officer.

- Look on the contact, legal and grievance pages and in the repo's docs. The rules require the appointments; publication is required for the Grievance Officer (rule 3(2)(a)) and the address (rule 4(5)). So a missing Chief Compliance Officer or nodal contact on the website is "not found in the reviewed material", medium at most, unless a document shows the role is vacant.
- The Resident Grievance Officer is different: that person does the rule 3(2) job, so their name must be published. A grievance page with no named officer breaks both `IT-3-2-a` and `IT-4-1-c`: cite both in one finding.
- The nodal contact person coordinates with law enforcement 24x7. A rota that sleeps at night is evidence against it.

### 2. Contact address in India (`IT-4-5`)

A physical address in India, published, offered as the place to send communications. An address abroad, or "see our registered office" with no address, is a finding.

### 3. Monthly compliance report (`IT-4-1-d`)

A report job or documented process, its schedule against the catalog deadline, a template with the required contents, and a place on the site where reports are published. A quarterly or yearly schedule is a finding.

### 4. Ticket numbers and reasons (`IT-4-6`)

Each complaint gets a unique ticket number the complainant can track, and closure messages give reasons.

### 5. Notice before removal (`IT-4-8`)

Find the code that removes content on the platform's own enforcement of its rules. Before it removes, does it notify the uploader with the reason? Is there a route to dispute and ask for reinstatement? A removal function with no notification call and no appeal route is a finding. Removal on a court order or a grievance is outside this rule.

### 6. AI-generated content declaration (`IT-4-1A`)

Applies to every SSMI that lets users post, whether or not it has its own generator.

- (a) The upload or post form asks the user to declare whether the content is synthetically generated, and the answer is stored.
- (b) Something checks the declaration: a detector, a provenance metadata check, or both.
- (c) Declared or detected content is shown with a clear label.

Content from the platform's own generator being labelled automatically does not satisfy (a) for outside uploads.

### 7. Proactive detection (`IT-4-4`)

Hash matching or classifiers for the listed content and for re-uploads of removed content, with human oversight and periodic review. Absence is "not found in the reviewed material".

## What is not a gap

- Officers named with an India location.
- A compliance report on a monthly schedule with the required contents.
- An intake that already issues ticket numbers.

## Guardrails

- Officers' published names and work contact details may appear in findings. Nothing else about them.
- Do not infer residence from a name or a phone prefix. If the page does not say, report that it does not say.

## Commands

| Run | Action |
|---|---|
| `/ssmi` | Run all seven checks on the repo |
| `/ssmi <url>` | Also check the officers and address on the live site |
