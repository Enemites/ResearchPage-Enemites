create table if not exists paper_comments (
  id text primary key,
  paper_slug text not null,
  email text not null,
  email_normalized text not null,
  body text not null,
  status text not null check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now(),
  reviewed_at timestamptz,
  reviewer_note text
);

create index if not exists paper_comments_paper_status_created_idx
  on paper_comments (paper_slug, status, created_at desc);

create index if not exists paper_comments_email_created_idx
  on paper_comments (email_normalized, created_at desc);
