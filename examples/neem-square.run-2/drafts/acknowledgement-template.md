DRAFT for legal review. Not legal advice. Clocks from the rule catalog, as amended up to 2026-02-10; catalog last checked 2026-11-15.

# Complaint acknowledgement and closure templates

Fill these in:

- `[GRIEVANCE OFFICER NAME]`
- `[GRIEVANCE OFFICER DESIGNATION]`

Merge fields come from the ticket at send time: `{{ticket_number}}`, `{{received_at}}`, `{{clock_text}}`, `{{due_at}}`, `{{decision}}`, `{{reasons}}`, `{{decided_at}}`. No complaint text goes into either template.

## Choosing `{{clock_text}}`

Pick by the complaint category in `config/support.yaml`. These match the catalog today; read the catalog again if it changes.

| Category | `{{clock_text}}` | Rule |
|---|---|---|
| `intimate_imagery`, `impersonation` | "We will act on content that shows you nude or in a sexual act, or that impersonates you, within 2 hours of your complaint." | Rule 3(2)(b), `IT-3-2-b` |
| `content_removal`, `synthetic_media` | "We will decide on your request to remove this content within 36 hours of your report." | Rule 3(2)(a)(i), `IT-3-2-a-removal` |
| `copyright`, `account`, `other` | "We will look into this and send you our decision within 7 days." | Rule 3(2)(a)(i), `IT-3-2-a-resolve` |

The acknowledgement itself must go out within 24 hours of receipt (rule 3(2)(a)(i), `IT-3-2-a-ack`). The current intake sends it at once, which meets that.

## Acknowledgement

**Subject:** We have your complaint ({{ticket_number}})

Hello,

We received your complaint on {{received_at}}. Your ticket number is {{ticket_number}}.

{{clock_text}} We aim to reply by {{due_at}}.

You can check its status at any time at https://neemsquare.example/help/report/status using your ticket number. To add information, reply to this email and keep the ticket number in the subject.

[GRIEVANCE OFFICER NAME]
[GRIEVANCE OFFICER DESIGNATION], Grievance Officer, Neem Square Private Limited

## Closure

**Subject:** Our decision on your complaint ({{ticket_number}})

Hello,

We have looked into your complaint {{ticket_number}} and made a decision on {{decided_at}}.

Decision: {{decision}}

Why: {{reasons}}

If you disagree with this decision, you can appeal to the Grievance Appellate Committee at https://gac.gov.in within 30 days of receiving this email (rule 3A(3), `IT-3A-3`).

[GRIEVANCE OFFICER NAME]
[GRIEVANCE OFFICER DESIGNATION], Grievance Officer, Neem Square Private Limited

---

**Note for the engineer.** These replace `services/grievance/templates/ack_email.txt` and `closure_email.txt`. `{{reasons}}` must always be filled: an empty reason fails rule 4(6) (`IT-4-6`). The clocks above only hold once `config/support.yaml` and `services/safety/ncii.py` are corrected (findings F-0003, F-0006, F-0007).