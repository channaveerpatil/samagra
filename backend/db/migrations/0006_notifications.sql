CREATE TABLE IF NOT EXISTS notifications (
  id          text PRIMARY KEY,
  user_id     text NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type        text NOT NULL,
  title       text NOT NULL,
  message     text NOT NULL,
  action_type text,
  metadata    jsonb,
  is_read     boolean NOT NULL DEFAULT false,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS notifications_user_id_idx ON notifications (user_id, created_at DESC);

CREATE TABLE IF NOT EXISTS notification_preferences (
  user_id              text PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  approval_requests     boolean NOT NULL DEFAULT true,
  report_notifications  boolean NOT NULL DEFAULT true,
  security_alerts       boolean NOT NULL DEFAULT true,
  system_notifications  boolean NOT NULL DEFAULT false
);
