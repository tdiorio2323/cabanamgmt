-- Extend invites table with status/token columns for invite lifecycle
alter table public.invites
  add column if not exists status text default 'pending',
  add column if not exists token text;

update public.invites
set status = coalesce(status, 'pending')
where status is null;

alter table public.invites
  alter column status set not null;

alter table public.invites
  drop constraint if exists invites_status_check;

alter table public.invites
  add constraint invites_status_check check (status in ('pending','revoked','accepted'));

create index if not exists idx_invites_email_status on public.invites(email, status);
