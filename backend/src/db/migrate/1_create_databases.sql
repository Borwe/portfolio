CREATE TABLE pull_requests (
  id SERIAL,
  url text NOT NULL UNIQUE,
  repository_url text NOT NULL,
  html_url text NOT NULL,
  title text NOT NULL,
  updated_at text NOT NULL,
  created_at text NOT NULL,
  pull_request text NOT NULL,
  body text NOT NULL,
  org_icon text NOT NULL
);

CREATE TABLE last_update (
  id SERIAL,
  time text NOT NULL
)
