create extension if not exists "pgcrypto";

create table if not exists articles (
  id uuid primary key default gen_random_uuid(),
  title varchar(500) not null,
  url varchar(1000) not null unique,
  source varchar(50) not null,
  summary text not null,
  published_at timestamptz not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_articles_source_published_at
  on articles (source, published_at desc);

create table if not exists subscribers (
  id uuid primary key default gen_random_uuid(),
  email varchar(255) not null unique,
  verified boolean not null default true,
  created_at timestamptz not null default now()
);
