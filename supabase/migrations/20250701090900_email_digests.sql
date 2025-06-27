/*
  # Create email_digests table

  1. New Table
    - `email_digests`: Stores information about the weekly or periodic email digests sent to users.
*/

CREATE TABLE IF NOT EXISTS email_digests (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  digest_date date UNIQUE NOT NULL,
  title varchar(511),
  content_html text,
  sent_at timestamptz DEFAULT now()
); 