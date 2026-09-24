CREATE TABLE IF NOT EXISTS audit_logs (
  id             text PRIMARY KEY,
  action         text NOT NULL,
  module         text NOT NULL,
  actor_id       text NOT NULL REFERENCES users(id),
  target         text NOT NULL,
  description    text,
  previous_value text,
  new_value      text,
  created_at     timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS audit_logs_created_at_idx ON audit_logs (created_at DESC);
