DRAFT for legal review. Not legal advice. Clocks from the rule catalog, as amended up to 2026-02-10; catalog last checked 2026-11-15.

# Runbook: takedown, intimate imagery and government requests

Fill these in:

- `[ORDERS ROTA NAME]`
- `[ORDERS ROTA MEMBERS]`
- `[ORDERS INTAKE EMAIL]`
- `[CONTACT ADDRESS IN INDIA]`
- `[COUNSEL ON CALL]`
- `[GRIEVANCE OFFICER NAME]`
- `[NODAL CONTACT PERSON NAME]`
- `[ORDERS REGISTER LOCATION]`
- `[REQUESTS REGISTER LOCATION]`
- `[PRESERVATION STORE]`
- `[DRILL OWNER]`

Owner: Trust and Safety Operations with Legal. Replaces `docs/runbooks/legal-orders.md`, and adds the intimate imagery path. Review this runbook whenever the rule catalog changes.

## 1. Court orders and government intimations (rule 3(1)(d), `IT-3-1-d`)

**Clock:** 3 hours from receipt of the court order or the intimation. **Target:** content disabled within 90 minutes.

**Where they arrive:**

- Email to [ORDERS INTAKE EMAIL], which pages [ORDERS ROTA NAME] at once, at all hours.
- Post to [CONTACT ADDRESS IN INDIA], opened every day. A postal order is scanned and paged on the day it arrives; its clock runs from receipt at the address.
- The Grievance Officer, [GRIEVANCE OFFICER NAME], is copied on every order and acknowledges receipt to the sender on arrival (rule 3(2)(a)(ii), `IT-3-2-a-orders`).

**Who is on call:** [ORDERS ROTA NAME]: [ORDERS ROTA MEMBERS], staffed 24x7 by pager, with [COUNSEL ON CALL] reachable at all hours.

**Steps:**

1. **0 to 10 minutes.** Log the order in [ORDERS REGISTER LOCATION] with the time received. Acknowledge receipt to the sender.
2. **10 to 30 minutes. Check it.**
   - Court order: issued by a court, names the content to remove.
   - Government intimation, against each condition in rule 3(1)(d)(ii). Record yes or no for each:
     - [ ] In writing.
     - [ ] Gives reasons.
     - [ ] Issued by an officer not below Joint Secretary rank or equivalent (Director or equivalent where no Joint Secretary is appointed); for the police, not below Deputy Inspector General, specially authorised.
     - [ ] The officer is authorised by the Appropriate Government or its agency by order in writing.
     - [ ] States the legal basis and the statutory provision invoked.
     - [ ] States the nature of the unlawful act.
     - [ ] Names the specific URL, identifier or other electronic location.
3. **30 to 90 minutes.** Disable the content with `services.moderation.takedown.remove_on_order(content_url, order_ref, actor)`, using the register reference as `order_ref`. It hides the content everywhere without a deploy and writes the `audit_log` entry (action, content id, reason `order:<ref>`, actor, time). Check the content is unreachable from a logged-out browser.
4. Confirm to the sender that the content has been disabled, with the time.
5. Preserve the content and its records (section 4).

**If the target is missed:** at 2 hours, page [COUNSEL ON CALL] and the Chief Compliance Officer. Record the reason in the register.

### For counsel: an intimation that falls short

> **[COUNSEL TO COMPLETE]** The rule does not say what an intermediary should do with an intimation that fails one or more of the conditions above, and the 3-hour clock leaves little time to ask the sender. Set out here who decides, how fast, and what is recorded. Until this section is complete, escalate any failed check to [COUNSEL ON CALL] at once and do not let the clock lapse without a recorded decision.

## 2. Intimate, nude or morphed imagery complaints (rule 3(2)(b), `IT-3-2-b`)

**Clock:** 2 hours from the complaint. **Target:** content disabled within 60 minutes.

**Where they arrive:** the report form, categories `intimate_imagery` and `impersonation`. Anyone may file, including someone acting for the person shown (rule 3(2)(c), `IT-3-2-c`).

**Who is on call:** the `safety-priority` rota, 24x7 by pager.

**Steps:**

1. **0 to 15 minutes.** Open the ticket. Look at the reported content only as far as needed to judge it.
2. **15 to 60 minutes.** If it prima facie shows the person's private area, shows them fully or partly nude or in a sexual act, or impersonates them in electronic form, including a morphed or AI-made image: disable it with `services.safety.ncii.action(ticket, reviewer, confirmed=True)`, which calls `disable_content` and writes the audit log.
3. Search for identical copies and disable those too.
4. Preserve the content and its records (section 4).

**If the target is missed:** at 90 minutes, page the Trust and Safety lead. The `NCII_SLA` and `PAGE_AFTER` constants in `services/safety/ncii.py` must match this section (audit finding F-0003).

## 3. Government information requests (rule 3(1)(j), `IT-3-1-j`)

**Clock:** as soon as possible, and within 72 hours of receiving the order. **Target:** 48 hours.

**Where they arrive:** `lea@` email, paged to the `lea-liaison` rota at all hours. Owner: the nodal contact person, [NODAL CONTACT PERSON NAME].

**Steps:**

1. Check the order is in writing, from a lawfully authorised agency, and states its purpose.
2. Log it in [REQUESTS REGISTER LOCATION] with the time received.
3. Pull only what the order names. A second person on the rota reviews the export.
4. Send through the agency's official channel and record the time sent.

**If the target is missed:** at 48 hours, page the rota lead; at 60 hours, the Chief Compliance Officer.

## 4. Preservation (rule 3(1)(g), `IT-3-1-g`)

When content is removed under section 1, section 2, a grievance, or the platform's own enforcement, keep the content and its associated records (post row, media renditions, `moderation_events`, `audit_log`, uploader id, timestamps) for 180 days, or longer if a court or an authorised agency requires it. Keep them in [PRESERVATION STORE], unaltered, so the evidence is not vitiated.

`jobs/purge_removed.py` currently deletes after 30 days (audit finding F-0008). It must not touch removed content before day 180 or while a hold is on it.

What may be kept after day 180, and which records the rule reaches, are questions for counsel. The DPDP Act's erasure duties overlap here; sections 8(7) and 12(3) of that Act except retention needed to comply with a law. Take the DPDP side to Vigil.

## 5. Drill

Once a quarter, [DRILL OWNER] runs each path out of hours (a weekday night and a weekend) with a test order and a test complaint on a test post, and records the time from receipt to disable against the target. File the result with this runbook.