CREATE TABLE IF NOT EXISTS approval_requests (
  id              text PRIMARY KEY,
  title           text NOT NULL,
  description     text NOT NULL,
  type            text NOT NULL,
  requested_by_id text NOT NULL REFERENCES users(id),
  approver_id     text NULL REFERENCES users(id),
  amount          numeric(14, 2),
  status          text NOT NULL DEFAULT 'PENDING',
  comment         text,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS approval_requests_status_idx ON approval_requests (status);
CREATE INDEX IF NOT EXISTS approval_requests_requested_by_idx ON approval_requests (requested_by_id);
