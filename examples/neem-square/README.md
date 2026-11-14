# Neem Square

A synthetic social platform used to test nodal. Nothing here is a real company, person or address.

## Company facts

- **Operator:** Neem Square Private Limited, Bengaluru. Its parent, Neem Square Pte. Ltd., is in Singapore.
- **Product:** a social app. People post text and images, follow each other, comment and share. Web and Android.
- **Users:** about 62 lakh registered users in India as of September 2026.
- **Imagine:** an in-app AI image generator. A user types a prompt, or uploads a photo and describes an edit, and can share the result to their feed.
- **Money:** free, funded by advertising. Neem Square sells nothing. The "Merch" link in the footer opens a third-party print shop that Neem Square does not own or run.
- **Games:** none.

## Layout

| Path | What it holds |
|---|---|
| `web/` | Page templates, routes and the legal documents |
| `api/` | Post creation |
| `services/` | Grievance intake, safety queues, moderation, Imagine, the media pipeline |
| `jobs/` | Scheduled jobs; their schedules are in `config/schedules.yaml` |
| `config/` | Support SLAs, on-call rotas, feature flags, schedules |
| `docs/` | Runbooks and the compliance report template |
| `db/` | Schema |
