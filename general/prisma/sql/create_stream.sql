-- @param {String} $1:_id
-- @param {String} $2:url
-- @param {String} $3:userId
INSERT INTO "Stream" ("_id", "url", "userId")  values ($1, $2, $3);
