-- Up
create table deleted_messages
(
  message_time datetime,
  server       text,
  channel      text,
  user         text,
  message      text
);

-- Down
drop table deleted_messages;