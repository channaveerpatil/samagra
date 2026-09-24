CREATE TABLE IF NOT EXISTS documents (
  id             text PRIMARY KEY,
  original_name  text NOT NULL,
  stored_name    text NOT NULL,
  mime_type      text NOT NULL,
  file_size      bigint NOT NULL,
  storage_path   text NOT NULL,
  uploaded_by_id text NOT NULL REFERENCES users(id),
  created_at     timestamptz NOT NULL DEFAULT now(),
  updated_at     timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS documents_created_at_idx ON documents (created_at DESC);
