/*
  # Add foreign key: digest_ideas.digest_id -> email_digests.id
*/
ALTER TABLE digest_ideas
  ADD CONSTRAINT fk_digest_ideas_digest_id FOREIGN KEY (digest_id)
    REFERENCES email_digests(id); 