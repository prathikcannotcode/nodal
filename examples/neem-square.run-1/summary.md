# Neem Square: intermediary due diligence audit

Assessment `2026-11-14-neem-square-full`. Repo only; no live site was given. Law as at 2026-11-14 (the catalog's `last_verified`). 31 of 31 selected catalog rules were examined. 22 findings: 3 critical, 13 high, 5 medium, 1 low.

## 1. Classification

| Tag | Basis | Where |
|---|---|---|
| `intermediary` | code | `api/posts.py`: users upload photos and captions, stored and published |
| `smi` | code | `web/templates/home.html`: a feed of other users' posts; followers audience and comments on the post form |
| `ssmi` | code (README figure) | `README.md`: about 62 lakh registered users in India as of September 2026, above the 50 lakh threshold |
| `sgi` | code | `services/imagine/generate.py`: text-to-image and photo editing, shareable to the feed |

No `ecom` tag: the README says Neem Square sells nothing, and `web/templates/footer.html` only links out to a third party's print shop.

Unknowns:

- Nobody was available to answer the five questions. Every answer comes from the README and the code.
- The user count is the README's approximate figure, not one the company confirmed. The `ssmi` tag and all nine rule 4 checks rest on it.
- Whether Neem Square is an intermediary in law for everything on it, Imagine output included, was not settled.
- That the Merch shop belongs to a third party rests on the README.

## 2. Findings by severity

### Critical

- **F-0001**, Rule 3(2)(b): intimate-imagery and impersonation reports run on a 24-hour clock; the rule gives 2 hours. `services/safety/ncii.py:7`
- **F-0002**, Rule 3(1)(d): the orders runbook targets 36 hours and leaves out-of-hours orders to the next working day; the rule gives 3 hours. `docs/runbooks/legal-orders.md:20`
- **F-0003**, Rule 3(1)(d): the legal-orders rota is Monday to Friday, 10:00 to 18:00, paged by email. `config/oncall.yaml:19`

### High

- **F-0004**, Rule 3(2)(a)(ii), Rule 3(1)(d): posted orders go to Singapore and are scanned once a week; counsel, not a Grievance Officer, receives orders. `docs/runbooks/legal-orders.md:8`
- **F-0005**, Rule 3(2)(a), Rule 4(1)(c): no Grievance Officer or Resident Grievance Officer is named; the page gives a role mailbox only. `web/templates/grievance.html:7`
- **F-0006**, Rule 3(2)(a): the grievance page is 3 clicks from home; the rule allows 1. `web/templates/footer.html:2`
- **F-0007**, Rule 3(2)(a)(i): `resolve_days` is 15; the rule gives 7. `config/support.yaml:5`
- **F-0008**, Rule 3(2)(a)(i): `content_removal_hours` is 72; the rule gives 36. `config/support.yaml:6`
- **F-0009**, Rule 3(1)(g): removed posts, media and moderation records are purged after 30 days; the rule gives 180. DPDP tension: see Vigil. `jobs/purge_removed.py:6`
- **F-0010**, Rule 3(1)(h): registration data is purged 30 days after closure; the rule gives 180. DPDP tension: see Vigil. `jobs/purge_closed_accounts.py:6`
- **F-0011**, Rule 3(3)(a)(i): the photo-edit path calls no prompt or output filter. `services/imagine/generate.py:27`
- **F-0012**, Rule 3(3)(a)(ii), Rule 3(3)(b): `clean_export` drops the AI label for verified creators. `config/features.yaml:14`
- **F-0013**, Rule 3(3)(b): the feed pipeline strips the provenance metadata from every Imagine post. `services/media/pipeline.py:11`
- **F-0014**, Rule 4(5): the only published address is in Singapore. `web/templates/contact.html:19`
- **F-0015**, Rule 4(1A)(a): the post form and the posts table have no synthetic-content declaration. `web/templates/upload.html:4`
- **F-0016**, Rule 4(1A)(b), Rule 4(1A)(c): uploads are published with no check for synthetic content and no label. `api/posts.py:12`

### Medium

- **F-0017**, Rule 3(1)(c): the reminder cron fires once a year; the rule gives every three months. `config/schedules.yaml:13`
- **F-0018**, Rule 3(1)(c): the reminder carries 1 of the 3 limbs. `jobs/terms_reminder.py:10`
- **F-0019**, Rule 3(1)(ca): the Terms carry neither of the two AI warnings. `web/legal/terms.md:27`
- **F-0020**, Rule 4(8): policy removals send no prior notice and offer no dispute route. `services/moderation/takedown.py:23`
- **F-0021**, Rule 3A(7): a step for Grievance Appellate Committee orders was not found in the reviewed material. Missing artefact, no file.

### Low

- **F-0022**, Rule 4(4): proactive detection of the listed content and of re-uploads was not found in the reviewed material. Missing artefact, no file.

### Examined, no gap found in the material reviewed

Rule 3(1)(a) (three documents, linked from the footer), Rule 3(1)(b) (prohibited content clause; sub-clauses (ix) and (x) on online games not checked, the product has no games), Rule 3(1)(f), Rule 3(1)(j), Rule 3(2)(a)(i) acknowledgement, Rule 3(2)(c), Rule 3A(3), Rule 4(1)(a), Rule 4(1)(b), Rule 4(1)(d), Rule 4(6). Rule 3(1)(cb): a report category, a 24x7 queue and a removal path were seen; account-action paths were not in the material and are listed under Not checked.

## 3. Every clock you are on

| Duty | Clause | The clock | What the code or documents say today | Finding |
|---|---|---|---|---|
| Act on intimate, nude or morphed imagery complaints | Rule 3(2)(b) | Within 2 hours of the complaint | `NCII_SLA` 24 hours; follow-up page at 12 hours; rota 24x7 | F-0001 |
| Remove on a court order or government intimation | Rule 3(1)(d) | Within 3 hours of receiving it | Runbook target 36 hours; rota Mon to Fri 10:00 to 18:00; posted orders scanned weekly | F-0002, F-0003, F-0004 |
| Acknowledge a complaint | Rule 3(2)(a)(i) | Within 24 hours | `ack_hours` 24; sent automatically at intake with a ticket number | no gap found |
| Resolve a removal complaint under rule 3(1)(b) | Rule 3(2)(a)(i) | Within 36 hours of the report | `content_removal_hours` 72 | F-0008 |
| Answer a government information order | Rule 3(1)(j) | As soon as possible, within 72 hours | Runbook: 72 hours, page at 48 hours, 24x7 rota | no gap found |
| Resolve a complaint | Rule 3(2)(a)(i) | Within 7 days of receipt | `resolve_days` 15 | F-0007 |
| Appeal to the Grievance Appellate Committee (the user's clock) | Rule 3A(3) | Within 30 days of the decision | Closure email gives the route and the 30 days | no gap found |
| Publish the compliance report | Rule 4(1)(d) | Every month | Cron `0 6 1 * *`: 06:00 on the 1st of each month | no gap found (F-0009 affects one count) |
| Remind users of the three limbs | Rule 3(1)(c) | At least once every three months | Cron fires once a year, 15 January; body has 1 of 3 limbs | F-0017, F-0018 |
| Give the AI warnings | Rule 3(1)(ca) | No separate period; read with the three-monthly notice | In neither the Terms nor the reminder | F-0019 |
| Act on synthetic-content violations | Rule 3(1)(cb) | Expeditiously; no period stated | `synthetic_media` reports go to a 24x7 queue on the 72-hour clock | no separate finding; see F-0008 |
| Inform users of the documents or changes | Rule 3(1)(f) | At least once a year | Reminder sent yearly; Terms dated 3 March 2026 | no gap found |
| Preserve removed content and records | Rule 3(1)(g) | 180 days, longer if required | `KEEP_REMOVED` 30 days | F-0009 |
| Retain registration data after closure | Rule 3(1)(h) | 180 days after cancellation | `GRACE` 30 days; Privacy Policy promises 30 | F-0010 |
| Appoint a Chief Compliance Officer | Rule 4(1)(a) | Within three months of crossing the threshold | Named on the Contact page, stated as based in India; crossing date not known | no gap found |
| Appoint a nodal contact person | Rule 4(1)(b) | Within three months of crossing the threshold | Named, a different person, stated as based in India; rota 24x7 | no gap found |
| Appoint a Resident Grievance Officer | Rule 4(1)(c) | Within three months of crossing the threshold | Nobody named | F-0005 |
| Take and verify the synthetic-content declaration | Rule 4(1A) | Before display, upload or publication | No declaration, no check, no label | F-0015, F-0016 |
| Notify before removing on own accord | Rule 4(8) | Notice before removal; dispute decided in reasonable time | No notice, no dispute route | F-0020 |
| Carry out Committee orders and post the report | Rule 3A(7) | No period stated | No step found | F-0021 |

## 4. Fix first

1. **F-0001 (2-hour clock).** In `services/safety/ncii.py`, set `NCII_SLA` to 2 hours and `PAGE_AFTER` to about 30 minutes, then recompute due times on open tickets.
2. **F-0003 (3-hour clock).** In `config/oncall.yaml`, give `legal-orders` 24x7 pager coverage, or route orders to the 24x7 `lea-liaison` rota with authority to run `takedown.remove_on_order()`.
3. **F-0002 (3-hour clock).** In `docs/runbooks/legal-orders.md`, rewrite Target and Escalation around 3 hours from receipt and delete the next-working-day rule.
4. **F-0004 (3-hour clock, posted orders).** Publish an India address for orders on `web/templates/contact.html`, open post daily in India, and name the Grievance Officer as recipient in the runbook. The address also closes F-0014; the named officer closes F-0005.
5. **F-0008 (36-hour clock).** In `config/support.yaml`, set `content_removal_hours` to 36. The line above it, `resolve_days`, goes to 7 in the same edit and closes F-0007.

## 5. Unverified rules relied on

- **`IT-3-1-d`, Rule 3(1)(d)**, cited in F-0002, F-0003 and F-0004. The catalog marks it `verified: true` for the 3-hour clock, which was read in G.S.R. 120(E). Its note says G.S.R. 775(E) of 22 October 2025, which rewrote the rest of the clause, was not read: who may issue an intimation and what it must contain are unconfirmed. The three findings rest on the clock only.
- No cited rule has `verified: false`.

## 6. Not checked

- DPDP Act 2023 and DPDP Rules 2025 (use Vigil)
- IT Rules Part III (digital media publishers) and rule 5
- Online gaming provisions: rule 3(1)(b)(ix)-(x), rule 4(10)-(13), rules 4A to 4C
- Rule 3(1)(i), (k), (l), (m), (n): security practices, CERT-In reporting, accessibility, constitutional rights
- Rule 4(2) first originator, rule 4(3) advertised content, rule 4(7) voluntary verification
- The parts of rule 3(1)(d) other than the three-hour clock (G.S.R. 775(E) was not read when the catalog was built)
- E-Commerce Rules beyond grievance duties
- RBI, SEBI, IRDAI, TRAI and other sector rules
- Any amendment notified after G.S.R. 120(E) of 10 February 2026
- Whether the product is an intermediary in law: the classification records the user's answer and what the code shows
- The live site: no URL was given, so no public page was fetched. Every finding on published details rests on the templates in the repo.
- The seven E-Commerce Rules entries in the catalog (EC-4-2, EC-4-4, EC-4-5, EC-5-3-b, EC-5-3-c, EC-7-1-a, EC-7-1-f): the classification has no ecom tag, so /ecom did not run.
- The classification itself: nobody was available to answer, so the tags rest on README.md and the code. The ssmi tag rests on the README's figure of about 62 lakh registered users in India.
- tests/fixtures/grievances.json: not opened. The check skills bar opening complaint data and fixtures.
- Templates and pages the repo refers to but does not contain: base.html, post_card.html, transparency.html, imagine.html, and the pages at /help/imagine, /help/legal/law-enforcement, /help/legal/copyright and /help/report/status. Whether the feed shows a label on Imagine posts, what the Imagine screen warns, and what the published transparency and status pages look like were not seen.
- Modules imported but not supplied: the Imagine classifier, model, label and assets modules, the XMP and codec helpers, and the db, mailer, paging, publisher, notices, storage and flags services. Their behaviour was taken from how the reviewed code calls them.
- The signup screen and the Android app: whether the three documents and the Grievance Officer's details are reachable from them was not seen.
- How a complaint emailed to the grievance address gets a ticket number, an acknowledgement and a due time: the intake code handles the web form only, and no mail-ingest code was in the reviewed material.
- Rule 3(1)(cb) account action: a report category, a 24x7 queue and a removal path for synthetic media were seen; code paths for account suspension, identity disclosure to a victim and mandatory reporting were not in the reviewed material.
- Whether the Chief Compliance Officer and the nodal contact person are in fact appointed, employed and resident in India: only the Contact page's statements were read.
- Registers and logs: the orders register, the law enforcement requests register, the job_runs record of reminder sends and past published reports were not supplied or not opened.

## 7. Disclaimer

nodal is compliance tooling, not legal advice. It reports gaps visible in the material reviewed and never certifies compliance. Have a qualified lawyer check every finding before relying on it.
