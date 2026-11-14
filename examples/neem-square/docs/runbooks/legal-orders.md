# Runbook: court orders and government notices

Owner: Legal. Last reviewed: August 2025.

## Where they arrive

- Email to `legal@neemsquare.example`, read by the `legal-orders` rota (see `config/oncall.yaml`).
- Post to the address on the Contact page. The Singapore office scans post once a week and forwards it to the same inbox.

## Steps

1. Counsel on the rota logs the order in the orders register and checks it: issuing court or authority, the URLs named, the legal basis.
2. If the order is unclear, counsel asks the sender to clarify before acting.
3. Counsel asks Trust and Safety, in the #legal-takedowns channel, to remove the content.
4. Trust and Safety runs `takedown.remove_on_order()` with the register reference. This hides the content everywhere and writes the audit log.
5. Counsel replies to the sender to confirm.

## Target

Content is removed within 36 hours of the order reaching the inbox. Orders that arrive outside rota hours are picked up on the next working day.

## Escalation

If the 36-hour target is at risk, counsel calls the General Counsel.
