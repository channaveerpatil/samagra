CREATE TABLE IF NOT EXISTS report_jobs (
  id              text PRIMARY KEY,
  report_type     text NOT NULL,
  report_name     text NOT NULL,
  status          text NOT NULL DEFAULT 'QUEUED',
  progress        int,
  requested_by_id text NOT NULL REFERENCES users(id),
  file_name       text,
  file_path       text,
  error_message   text,
  created_at      timestamptz NOT NULL DEFAULT now(),
  completed_at    timestamptz
);

CREATE INDEX IF NOT EXISTS report_jobs_created_at_idx ON report_jobs (created_at DESC);
