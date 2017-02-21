DROP TABLE IF EXISTS ref_actions;

ALTER TABLE users
  ADD PRIMARY KEY(id, org_id);
