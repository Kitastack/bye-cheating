-- @param {String} $1:_id
-- @param {String} $2:email
-- @param {String} $3:username
-- @param {String} $4:password
INSERT INTO "User" ("_id", "email", "username", "password")  values ($1, $2, $3, $4);
