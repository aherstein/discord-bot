-- Up
create table friend_codes
(
  last_updated_time datetime,
  user              text unique,
  friend_code       text
);

-- Down
drop table friend_codes;