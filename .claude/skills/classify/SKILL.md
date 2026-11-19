---
name: classify
description: "Decide which intermediary and e-commerce duties apply to a product before any check runs: intermediary, social media intermediary, significant social media intermediary, AI-generated media, e-commerce model. Stores the answer. Use for \"classify\", \"do the IT Rules apply to us\", \"are we an SSMI\"."
---

# Classify the product

## Trigger

"classify", "do the IT Rules apply", "are we an intermediary", "are we an SSMI", "which duties apply". Also the first step of `/audit`.

## Purpose

Wrong classification gives wrong findings. This skill asks five questions, confirms each from the code where it can, and stores the answer in `company-profile/{id}/classification.json`. Every other skill reads that file.

## Questions

Ask the user, then look for confirmation in the repo. Record each answer with its `basis`: `code` (seen in the repo, with the file), `user` (they said so), or `unconfirmed`.

| # | Question | Tag if yes | Where the code shows it |
|---|---|---|---|
| 1 | Does the product host, store or transmit content that users create or send? | `intermediary` | Upload and post endpoints, comment or message tables, object storage for user media |
| 2 | Is its main job to let two or more users interact and share content with each other? | `smi` | Feeds, follows, shares, group chat, public profiles |
| 3 | Does it have 50 lakh (5 million) or more registered users in India? | `ssmi` | Rarely in code. Ask. A README, pitch deck or config comment with user numbers counts as `code` |
| 4 | Can users create, edit or share AI-generated audio, images or video with it? | `sgi` | Calls to image, video or voice models, a generation service, "AI" upload paths |
| 5 | Does it sell goods or services online, or let others sell on it? | `ecom`, plus `ecom-marketplace` (others sell) or `ecom-inventory` (it sells its own stock) | Cart, checkout, orders, seller onboarding |

Rules for the tags:

- `smi` needs `intermediary`. `ssmi` needs `smi`, except under a rule 6 order (below).
- Question 3 is a number the company knows. If nobody answers, leave `ssmi` out, record the question under `unknowns`, and say in the output that the SSMI duties were not checked for that reason. Never guess the number.
- With question 3, ask whether the Ministry has made an order under rule 6 requiring the product to comply with rule 4. Such an order can apply all or part of rule 4 to an intermediary below the threshold. If yes, add `ssmi`, record the order under `answers`, and list under `unknowns` which parts of rule 4 it applies if the user did not say. If nobody answers, record the question under `unknowns`.
- `sgi` covers content that looks real: a synthetic photo, voice or video. Routine editing (crop, colour, noise reduction, compression), documents and slides, and accessibility or translation features are carved out of the definition. A product with only those gets no `sgi` tag; note why.
- A link out to someone else's shop is not e-commerce.
- If questions 1 and 5 are both "no", `tags` is empty. Say that the IT Rules Part II and the E-Commerce Rules grievance duties do not apply on these answers, store the file, and stop.

Whether a product is an intermediary in law can be a hard question (a company that publishes its own content is not one for that content). Record the answer you were given and what the code shows. Flag a mismatch between the two as an unknown; do not settle it.

## Output

`company-profile/{company_id}/classification.json`, per `.claude/schemas/classification.schema.json`. Then tell the user, in three lines: the tags, how many catalog rules they select (count `applies_to` matches in `catalog/rules.json`), and any unknowns.

## Guardrails

- Do not run a check skill from here. Classification only.
- Do not store user counts you were not given.
- Not legal advice. A lawyer confirms the classification before the company relies on it.

## Commands

| Run | Action |
|---|---|
| `/classify` | Ask the questions, confirm from code, store the answer |
| `/classify show` | Print the stored classification and the rules it selects |
