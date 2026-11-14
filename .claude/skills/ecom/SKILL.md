---
name: ecom
description: "Check the grievance officer duties of the Consumer Protection (E-Commerce) Rules 2020: officer's name, designation and contact displayed, 48-hour acknowledgement, one-month redressal, complaint ticket numbers. Use for \"e-commerce grievance\", \"consumer complaint SLA\", \"E-Commerce Rules\"."
---

# E-commerce grievance duties

## Trigger

"e-commerce grievance", "E-Commerce Rules", "consumer complaint", "consumer grievance officer"

## Purpose

Check the grievance duties of an e-commerce entity. Applies only to products tagged `ecom`. If the tag is absent, say so and stop: a product that sells nothing gets no finding under this framework.

Only the grievance duties are in scope. Pricing, cancellation, seller duties, country of origin and the rest of the E-Commerce Rules are not checked; say so in `not_checked`.

## Legal basis

Catalog rules `EC-4-2`, `EC-4-4`, `EC-4-5`, and by model `EC-5-3-b`, `EC-5-3-c` (marketplace) or `EC-7-1-a`, `EC-7-1-f` (inventory). Findings use `framework: "ECOM-RULES"`.

## Checks

### 1. Officer displayed (`EC-4-4`, `EC-4-2`)

The platform displays the grievance officer's **name, contact details and designation**. All three. A generic support address is a finding; a name with no designation is a smaller one. The same page should carry customer care contact details.

### 2. Clocks (`EC-4-5`)

Find the consumer complaint SLA constants and compare with the catalog deadline: one value for acknowledgement, one for redressal. Check the redressal clock runs from receipt of the complaint, not from acknowledgement or assignment.

### 3. Ticket numbers (`EC-5-3-b` or `EC-7-1-f`)

Each complaint gets a ticket number the consumer can use to track status. Cite the clause that matches the model in the classification.

### 4. Mechanism described (`EC-5-3-c` or `EC-7-1-a`)

The help or policy pages say how to complain. Low severity.

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
