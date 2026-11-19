Law as amended up to 2026-02-10. Catalog entries last checked 2026-11-15.

Assessment `2026-11-19-neem-square-full`, nodal 0.1.2, run on 19 November 2026 against a local copy of the `neem-square` repository. No live site was given. Scope: IT Rules 2021, Part II. 31 catalog rules selected, 31 examined, 22 findings.

## 1. Classification

| Tag | Basis |
|---|---|
| `intermediary` | Code: `api/posts.py` stores user uploads and Imagine results as posts |
| `smi` | Code: `web/templates/upload.html` and the README; posts, follows, comments, shares |
| `ssmi` | Code: the README states about 62 lakh registered users in India (September 2026), above the 50 lakh threshold |
| `sgi` | Code: `services/imagine/generate.py` generates images from text and edits uploaded photos, and results can be posted |

Not tagged `ecom`: the footer Merch link opens a third-party print shop selling that party's goods.

Unknowns: whether the Ministry has made a rule 6 order for the product (it would not change the tags), and the user count comes from the README rather than from a person at the company. A lawyer should confirm both before the company relies on the `ssmi` tag.

## 2. Findings by severity

Under rule 7, an intermediary that fails to observe these rules loses the protection of section 79(1) of the IT Act and is liable under any law in force. Whether any one finding below has that result is for counsel.

**Critical (3)**

| Id | Clause | Gap | Where |
|---|---|---|---|
| F-0001 | Rule 3(1)(d) | Order runbook targets 36 hours and next-working-day pickup; the rule gives 3 hours. Postal orders scanned weekly in Singapore | `docs/runbooks/legal-orders.md:20` |
| F-0002 | Rule 3(1)(d) | Legal-orders rota is weekdays 10:00 to 18:00, by email | `config/oncall.yaml:18` |
| F-0003 | Rule 3(2)(b) | `NCII_SLA` is 24 hours; the rule gives 2 | `services/safety/ncii.py:7` |

**High (11)**

| Id | Clause | Gap | Where |
|---|---|---|---|
| F-0004 | Rule 3(2)(a), Rule 4(1)(c) | No named Grievance Officer or Resident Grievance Officer; role mailbox only | `web/templates/grievance.html:7` |
| F-0005 | Rule 3(2)(a) | Grievance page is three clicks from home; no footer link | `web/templates/footer.html:6` |
| F-0006 | Rule 3(2)(a)(i) | `resolve_days` is 15; the rule gives 7 | `config/support.yaml:5` |
| F-0007 | Rule 3(2)(a)(i) | `content_removal_hours` is 72; the rule gives 36 | `config/support.yaml:6` |
| F-0008 | Rule 3(1)(g) | Removed posts and their moderation records purged after 30 days; the rule gives 180 | `jobs/purge_removed.py:6` |
| F-0009 | Rule 3(1)(h) | Registration data purged 30 days after closure; the rule gives 180 | `jobs/purge_closed_accounts.py:6` |
| F-0010 | Rule 3(3)(a)(i) | Image-to-image editing skips the prompt and output filters | `services/imagine/generate.py:27` |
| F-0011 | Rule 3(3)(a)(ii), Rule 3(3)(b) | `clean_export` lets verified creators post Imagine images without the label | `services/imagine/generate.py:12` |
| F-0012 | Rule 3(3)(b) | Feed pipeline strips the provenance XMP from every image, Imagine output included | `services/media/pipeline.py:11` |
| F-0013 | Rule 4(5) | Only a Singapore address is published; none in India | `web/templates/contact.html:19` |
| F-0014 | Rule 4(1A) | Upload form asks for no AI declaration; nothing detects or labels outside uploads | `web/templates/upload.html:4` |

**Medium (7)**

| Id | Clause | Gap | Where |
|---|---|---|---|
| F-0015 | Rule 3(1)(d) | Runbook does not read an intimation against the rule's conditions (rank, written authorisation, reasons, unlawful act) | `docs/runbooks/legal-orders.md:12` |
| F-0016 | Rule 3(1)(c) | Reminder cron fires once a year (15 January) | `config/schedules.yaml:13` |
| F-0017 | Rule 3(1)(c), Rule 3(1)(ca) | Reminder carries limb (i) only, and no synthetic media warnings | `jobs/terms_reminder.py:10` |
| F-0018 | Rule 3(1)(ca) | Terms give no penalty or consequence warning for unlawful synthetic content | `web/legal/terms.md:27` |
| F-0019 | Rule 4(8) | Policy removals happen with no prior notice to the uploader and no dispute route | `services/moderation/takedown.py:23` |
| F-0020 | Rule 3A(7) | No step for Grievance Appellate Committee orders or the compliance report: not found in the reviewed material | none |
| F-0021 | Rule 4(4) | No hash matching or classifier on upload, no re-upload matching: not found in the reviewed material | none |

**Low (1)**

| Id | Clause | Gap | Where |
|---|---|---|---|
| F-0022 | Rule 3(2)(a)(ii) | Orders go to Legal, not the Grievance Officer, and are acknowledged only after removal | `docs/runbooks/legal-orders.md:7` |

## 3. Every clock you are on

| Duty | Clause | Clock | What the code or documents say today | Finding |
|---|---|---|---|---|
| Remove intimate or morphed imagery on complaint | Rule 3(2)(b) | 2 hours | `NCII_SLA` 24 hours; queue paged 24x7, re-paged at 12 hours | F-0003 |
| Act on a court order or government intimation | Rule 3(1)(d) | 3 hours | Runbook 36 hours, next working day out of hours; rota weekdays 10:00 to 18:00 | F-0001, F-0002, F-0015 |
| Acknowledge a complaint | Rule 3(2)(a)(i) | 24 hours | `ack_hours` 24; acknowledgement email with ticket number sent on intake | no gap found |
| Resolve a removal complaint | Rule 3(2)(a)(i) | 36 hours | `content_removal_hours` 72 | F-0007 |
| Answer a government information order | Rule 3(1)(j) | 72 hours | Runbook: 72 hours, 24x7 `lea-liaison` pager, page at 48 hours | no gap found |
| Resolve any other grievance | Rule 3(2)(a)(i) | 7 days | `resolve_days` 15 | F-0006 |
| User's window to appeal to the Grievance Appellate Committee | Rule 3A(3) | 30 days from the decision | Closure email and grievance page both mention the Committee; email gives the 30 days | no gap found |
| Monthly compliance report | Rule 4(1)(d) | Every month | Cron `0 6 1 * *`, published at /transparency with archive; template covers complaints, actions and proactive removals | no gap found (see F-0008 on purged counts) |
| Remind users of the terms and consequences | Rule 3(1)(c) | Every 3 months | Cron `0 9 15 1 *`: once a year; limb (i) only | F-0016, F-0017 |
| Warn users about unlawful synthetic content | Rule 3(1)(ca) | With the 3-monthly notice | Not in the reminder or the Terms | F-0017, F-0018 |
| Tell users of the documents and changes | Rule 3(1)(f) | At least once a year | Yearly reminder links the three documents; Terms promise email and in-app notice of changes | no gap found |
| Keep removed content and its records | Rule 3(1)(g) | 180 days | `KEEP_REMOVED` 30 days | F-0008 |
| Keep registration data after closure | Rule 3(1)(h) | 180 days | `GRACE` 30 days | F-0009 |
| Act on synthetic media violations | Rule 3(1)(cb) | Expeditiously | Report category `synthetic_media` on the 72-hour removal clock; removal path exists | no gap found beyond F-0007 |
| Declare and label synthetic content | Rule 4(1A) | Before display | No declaration on upload | F-0014 |
| Notify the uploader | Rule 4(8) | Before removal | No notice before policy removal | F-0019 |

## 4. Fix first

1. **F-0003.** Set `NCII_SLA` to 2 hours and `PAGE_AFTER` to about 30 minutes in `services/safety/ncii.py`, and staff the `safety-priority` pager to act inside that.
2. **F-0002.** Make the `legal-orders` rota in `config/oncall.yaml` 24x7 with pager escalation, or let on-call Trust and Safety act on a checked order with counsel review after.
3. **F-0001.** Change the target in `docs/runbooks/legal-orders.md` to 3 hours from receipt on any channel, drop the next-working-day line, and stop routing postal orders through a weekly scan in Singapore.
4. **F-0007.** Set `content_removal_hours` to 36 in `config/support.yaml`.
5. **F-0006.** Set `resolve_days` to 7 in `config/support.yaml`.

The purge findings (F-0008, F-0009) carry a long clock but destroy records every night they run. Pause both jobs while the 180-day hold is built, and take the DPDP side to Vigil.

## 5. Unverified rules relied on

- `IT-3-1-c`, Rule 3(1)(c): limb (iii), on reporting offences, is unconfirmed against the gazette. The catalog follows the corrigendum G.S.R. 148(E) of 26 February 2026, read only as a footnote in a consolidated text. F-0017 relies on it; F-0016 (the schedule) does not.

## 6. Not checked

The full list is in `report.json` under `not_checked`; it is repeated here.
- DPDP Act 2023 and DPDP Rules 2025 (use Vigil)
- IT Rules Part III (digital media publishers) and rule 5
- Online gaming provisions: rule 3(1)(b)(ix)-(x), rule 4(10)-(13), rules 4A to 4C
- Rule 3(1)(i), (k), (l), (m), (n): security practices, CERT-In reporting, accessibility, constitutional rights
- Rule 4(2) first originator, rule 4(3) advertised content, rule 4(7) voluntary verification
- Whether a particular court order or government intimation is valid under rule 3(1)(d): nodal checks that a process exists to read one against the rule, not any actual order
- E-Commerce Rules beyond grievance duties
- RBI, SEBI, IRDAI, TRAI and other sector rules
- Blocking orders under section 69A of the IT Act and the Blocking Rules, 2009
- Any amendment or corrigendum notified after G.S.R. 120(E) of 10 February 2026. A draft Second Amendment was published on 30 March 2026; whether it has been notified was not checked
- Whether the product is an intermediary in law: the classification records the user's answer and what the code shows
- E-Commerce Rules grievance duties: the classification carries no ecom or ecom-seller tag (the footer Merch link opens a third-party shop), so /ecom did not run
- Live site: none given, and the app has none. Every finding comes from the repository
- Whether the Ministry has made a rule 6 order for this product: not stated; the ssmi tag rests on the 62 lakh user count in the README
- Material referenced but not supplied: web/templates/base.html, transparency.html, imagine.html and post_card.html; the /help/imagine, /help/legal/law-enforcement, /help/legal/copyright and /help/report/status pages; the signup screen and app settings; the Android app; the services/imagine label, classifier and model modules; services/media xmp and codec; the copyright notice template; account suspension code paths
- Language of the documents and reminder: all are in English only, and the material does not say whether the product is offered in Indian languages or lets users choose one
- Whether the compliance report counts only complaints from users in India, as its heading says: the queries in jobs/compliance_report.py do not filter by country, and the rule text read does not require it
- Rule 3(1)(cb) account action: users.status allows suspension, but the code that suspends an account, discloses identity to a victim or makes a mandatory report was not in the reviewed material. No finding was filed

## 7. Disclaimer

nodal is compliance tooling, not legal advice. It reports gaps visible in the material reviewed and never certifies compliance. Have a qualified lawyer check every finding before relying on it.
