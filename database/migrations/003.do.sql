
CREATE TABLE user_organizations (
  user_id VARCHAR(128) REFERENCES users(id) NOT NULL,
  org_id VARCHAR(128) REFERENCES organizations(id) NOT NULL,
  CONSTRAINT user_organization_link PRIMARY KEY(user_id, org_id)
);

INSERT INTO user_organizations (user_id, org_id)
  SELECT id, org_id FROM users;

ALTER TABLE users
  DROP COLUMN org_id;
