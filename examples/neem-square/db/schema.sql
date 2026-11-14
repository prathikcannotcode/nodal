CREATE TABLE users (
  id            BIGSERIAL PRIMARY KEY,
  display_name  TEXT NOT NULL,
  email         TEXT NOT NULL UNIQUE,
  status        TEXT NOT NULL DEFAULT 'active',      -- active, suspended, closed
  is_verified_creator BOOLEAN NOT NULL DEFAULT false,
  closed_at     TIMESTAMPTZ
);

CREATE TABLE signup_records (
  user_id       BIGINT PRIMARY KEY REFERENCES users(id),
  email         TEXT NOT NULL,
  phone         TEXT,
  date_of_birth DATE,
  signup_ip     INET,
  signed_up_at  TIMESTAMPTZ NOT NULL
);

CREATE TABLE posts (
  id            BIGSERIAL PRIMARY KEY,
  author_id     BIGINT NOT NULL REFERENCES users(id),
  media_id      TEXT,
  caption       TEXT,
  audience      TEXT NOT NULL DEFAULT 'public',
  allow_comments BOOLEAN NOT NULL DEFAULT true,
  source        TEXT NOT NULL DEFAULT 'upload',      -- upload, imagine
  status        TEXT NOT NULL DEFAULT 'live',        -- live, removed
  removed_at    TIMESTAMPTZ,
  removed_reason TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE moderation_events (
  id       BIGSERIAL PRIMARY KEY,
  post_id  BIGINT NOT NULL,
  event    TEXT NOT NULL,
  reason   TEXT,
  at       TIMESTAMPTZ NOT NULL
);

CREATE TABLE tickets (
  id              BIGSERIAL PRIMARY KEY,
  number          TEXT NOT NULL UNIQUE,
  category        TEXT NOT NULL,
  content_url     TEXT NOT NULL,
  details         TEXT,
  reply_to        TEXT NOT NULL,
  on_behalf       BOOLEAN NOT NULL DEFAULT false,
  received_at     TIMESTAMPTZ NOT NULL,
  ack_due_at      TIMESTAMPTZ NOT NULL,
  acknowledged_at TIMESTAMPTZ,
  due_at          TIMESTAMPTZ NOT NULL,
  queue           TEXT NOT NULL,
  status          TEXT NOT NULL DEFAULT 'open',
  decision        TEXT,
  closed_at       TIMESTAMPTZ,
  closed_by       TEXT
);

CREATE TABLE audit_log (
  id         BIGSERIAL PRIMARY KEY,
  action     TEXT NOT NULL,
  content_id BIGINT,
  reason     TEXT,
  actor      TEXT NOT NULL,
  at         TIMESTAMPTZ NOT NULL
);
