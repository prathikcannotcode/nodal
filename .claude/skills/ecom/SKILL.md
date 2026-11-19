---
name: ecom
description: "Check the grievance officer duties of the Consumer Protection (E-Commerce) Rules 2020: officer's name, designation and contact displayed, 48-hour acknowledgement, one-month redressal, complaint ticket numbers. Use for \"e-commerce grievance\", \"consumer complaint SLA\", \"E-Commerce Rules\"."
---

# E-commerce grievance duties

## Trigger

"e-commerce grievance", "E-Commerce Rules", "consumer complaint", "consumer grievance officer"

## Purpose

Check the grievance duties of an e-commerce entity, and of a seller on another company's marketplace. Applies only to products tagged `ecom` or `ecom-seller`. If both are absent, say so and stop: a product that sells nothing gets no finding under this framework.

A seller on a marketplace is not an e-commerce entity, so checks 1 to 4 do not apply to a product tagged `ecom-seller` alone. Run check 5 for it.

Only the grievance duties are in scope. Pricing, cancellation, seller duties, country of origin and the rest of the E-Commerce Rules are not checked; say so in `not_checked`.

## Legal basis

Catalog rules `EC-4-2`, `EC-4-4`, `EC-4-5`, and by model `EC-5-3-b`, `EC-5-3-c`, `EC-5-3-seller` (marketplace) or `EC-7-1-a`, `EC-7-1-f` (inventory). For a seller on another company's marketplace, `EC-6-4-b` and `EC-6-5-e`. Findings use `framework: "ECOM-RULES"`.

## Checks

### 1. Officer displayed (`EC-4-4`, `EC-4-2`)

The platform displays the grievance officer's **name, contact details and designation**. All three. A generic support address is a finding; a name with no designation is a smaller one. The same page should carry customer care contact details.

### 2. Clocks (`EC-4-5`)

Find the consumer complaint SLA constants and compare with the catalog deadline: one value for acknowledgement, one for redressal. Check the redressal clock runs from receipt of the complaint, not from acknowledgement or assignment.

### 3. Ticket numbers (`EC-5-3-b` or `EC-7-1-f`)

Each complaint gets a ticket number the consumer can use to track status. Cite the clause that matches the model in the classification.

### 4. Mechanism described (`EC-5-3-c` or `EC-7-1-a`)

The help or policy pages say how to complain. Low severity.

For a marketplace (`EC-5-3-seller`): the product or seller page shows each seller's grievance officer, with name, contact numbers and designation, and seller onboarding collects them. A marketplace that shows only its own officer is a finding.

### 5. Selling through someone else's marketplace (`EC-6-4-b`, `EC-6-5-e`), only if tagged `ecom-seller`

- The seller has its own grievance officer for consumer complaints, distinct from the marketplace's.
- Complaints the marketplace forwards reach a monitored queue, with clocks at or under the catalog deadline: acknowledgement and redressal, counted from receipt.
- The officer's name, contact numbers and designation go to the marketplace for display. Look in seller profile data, listing feeds or onboarding config.

Most of this sits outside the repo. A missing officer or queue is "not found in the reviewed material", medium at most.

## An entity that is both

A marketplace that hosts reviews, listings or seller content is usually also an `intermediary`. The two frameworks have different clocks. Do not merge them: report an IT Rules gap under `IT-RULES` and a consumer complaint gap under `ECOM-RULES`, and in `summary.md` show both clocks side by side. Where one complaint system serves both, it must meet the shorter clock for each kind of complaint.

## What is not a gap

- A link to a third party's shop.
- Clocks at or under the catalog deadlines.

## Commands

| Run | Action |
|---|---|
| `/ecom` | Run the checks on the repo |
| `/ecom <url>` | Also check the displayed officer on the live site |
