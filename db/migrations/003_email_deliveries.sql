create table if not exists email_deliveries (
  subscriber_id uuid not null references subscribers(id) on delete cascade,
  article_id uuid not null references articles(id) on delete cascade,
  sent_at timestamptz not null default now(),
  primary key (subscriber_id, article_id)
);

create index if not exists idx_email_deliveries_subscriber_sent_at
  on email_deliveries (subscriber_id, sent_at desc);
