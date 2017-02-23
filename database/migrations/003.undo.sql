

ALTER TABLE users
  ADD COLUMN org_id VARCHAR REFERENCES organizations(id) NOT NULL DEFAULT '';

UPDATE users AS u SET org_id = o.org_id
  FROM user_organizations AS o
  WHERE o.user_id = u.id;
DROP TABLE user_organizations;

ALTER TABLE users
  ADD FOREIGN KEY (org_id) REFERENCES organizations(id);
