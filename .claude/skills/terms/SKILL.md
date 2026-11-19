---
name: terms
description: "Check the published terms duties of the IT Rules 2021: rules, privacy policy and user agreement exist and are prominent, they carry the prohibited content clause, and users get the three-monthly reminder with all its limbs. Use for \"terms audit\", \"prohibited content clause\", \"quarterly reminder\"."
---

# Terms, prohibited content and the periodic reminder

## Trigger

"terms audit", "user agreement", "prohibited content", "quarterly reminder", "periodic notice to users"

## Purpose

Check that the three documents exist, say what the rules require, and that users are reminded on schedule. Applies to every product tagged `intermediary`; the AI warnings apply to `sgi`.

## Legal basis

Catalog rules `IT-3-1-a`, `IT-3-1-b`, `IT-3-1-c`, `IT-3-1-ca`, `IT-3-1-f`. Read each `obligation` and `deadline` from `catalog/rules.json` first.

## Checks

### 1. The three documents (`IT-3-1-a`)

Rules and regulations (often "community guidelines"), a privacy policy and a user agreement (often "terms"). Each exists, and each is linked prominently: footer, signup, app settings. One document doing two jobs is fine if it plainly covers both. A document that exists in the repo but is linked from nowhere is a finding.

This skill does not review the privacy policy's content. That is DPDP work: point to Vigil.

**Language.** Rules 3(1)(a) and 3(1)(b) say the documents are to be in English or an Eighth Schedule language "in the language of his choice"; rule 3(1)(c) asks for the reminder in English or an Eighth Schedule language. Record which languages the documents and the reminder are offered in, and whether the user can choose. If the product is offered in Indian languages but the documents are English only, report it at low and say that whether English alone satisfies "the language of his choice" is a question for counsel.

### 2. The prohibited content clause (`IT-3-1-b`)

The terms or guidelines must tell users not to post the categories in the catalog obligation. Map each sub-clause to a sentence in the document. Wording need not match the rule; the substance must be there. Report the missing categories in one finding, by sub-clause numeral. Sub-clauses (ix) and (x) concern online games: do not report their absence for a product with no games, and note that online gaming is not checked. Sub-clause (v) of the rule also prints a limb on information that a Central Government fact check unit identifies as false. The Bombay High Court struck that limb down in 2024 and an appeal is pending, so do not report its absence either.

### 3. The periodic reminder (`IT-3-1-c`)

Two things to find:

- **The schedule.** A scheduled job, cron entry, campaign config or documented manual process, and its interval, against the catalog deadline. A yearly schedule is the stale value. Work out what a cron expression actually fires on; do not trust the comment beside it.
- **The content.** The reminder must carry all three limbs in the catalog obligation: the right to terminate or remove; that the user may face penalty or punishment for unlawful content; that offences which must be reported will be reported. A reminder with only the first limb is a finding even on the right schedule.

No job and no documented process is a missing artefact: "not found in the reviewed material", medium at most.

### 4. AI warnings (`IT-3-1-ca`), only if tagged `sgi`

The terms, the AI feature's policy or the generator's screens must tell users the two things in the catalog obligation: that making unlawful synthetic content may attract penalty under the listed laws, and what the platform may do about it (removal, suspension, identity disclosure to a victim in accordance with law, mandatory reporting). Generic "don't misuse AI" wording does not carry either.

### 5. Notice of changes (`IT-3-1-f`)

Is there a way users learn of a change to the documents, at least on the catalog's schedule? A version date on the page and a change-notice template are enough to look for. Low severity.

## What is not a gap

- Different headings or plain-language wording that covers a category.
- A reminder sent more often than the rule needs.
- The three-monthly reminder and the yearly notice of the documents being one message, if it carries both.

## Commands

| Run | Action |
|---|---|
| `/terms` | Run all checks on the repo |
| `/terms <url>` | Also check the documents and their links on the live site |
