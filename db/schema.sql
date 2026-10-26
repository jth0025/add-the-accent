-- Run once in the Neon SQL editor.

create table if not exists word_chat_sentences (
  id            serial primary key,
  word_date     date        not null,
  word          text        not null,
  name          text        not null,
  handle        text        not null,
  sentence      text        not null,
  status        text        not null default 'pending', -- pending | approved | rejected
  threads_reply_id text,
  created_at    timestamptz not null default now()
);

create index if not exists word_chat_status_idx on word_chat_sentences (status, created_at desc);

-- Which Threads post holds each day's word, so approved sentences reply under it.
create table if not exists word_chat_threads_posts (
  word_date       date primary key,
  threads_post_id text not null
);
