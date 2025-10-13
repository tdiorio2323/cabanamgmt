-- Reconcile invites schema and helper RPCs

-- Ensure core columns exist and have sane defaults
alter table public.invites
  add column if not exists uses_allowed int,
  add column if not exists uses_remaining int,
  add column if not exists expires_at timestamptz,
  add column if not exists redeemed_by uuid[] default '{}'::uuid[],
  add column if not exists created_at timestamptz default now(),
  add column if not exists updated_at timestamptz default now();

-- Backfill missing values before enforcing constraints
update public.invites
set
  uses_allowed = coalesce(uses_allowed, greatest(uses_remaining, 1), 1),
  uses_remaining = coalesce(uses_remaining, uses_allowed, 0),
  expires_at = coalesce(expires_at, now() + interval '30 days'),
  redeemed_by = coalesce(redeemed_by, '{}'::uuid[]),
  created_at = coalesce(created_at, now()),
  updated_at = now()
where
  uses_allowed is null
  or uses_remaining is null
  or expires_at is null
  or redeemed_by is null
  or created_at is null;

-- Enforce required constraints
alter table public.invites
  alter column uses_allowed set not null,
  alter column uses_allowed set default 1,
  alter column uses_remaining set not null,
  alter column uses_remaining set default 0,
  alter column redeemed_by set not null,
  alter column created_at set not null,
  alter column updated_at set not null;

alter table public.invites drop constraint if exists invites_pkey;
alter table public.invites add primary key (code);

alter table public.invites drop constraint if exists invites_uses_remaining_check;
alter table public.invites add constraint invites_uses_remaining_check check (uses_remaining >= 0);

create index if not exists idx_invites_expires_at on public.invites (expires_at);
create index if not exists idx_invites_uses_remaining on public.invites (uses_remaining);

-- Realign invite redemptions to reference invite codes
alter table public.invite_redemptions add column if not exists invite_code text;

update public.invite_redemptions r
set invite_code = i.code
from public.invites i
where r.invite_code is null and r.invite_id = i.id;

alter table public.invite_redemptions drop constraint if exists invite_redemptions_invite_id_fkey;

alter table public.invite_redemptions
  alter column invite_code set not null,
  drop column if exists invite_id;

alter table public.invite_redemptions add constraint invite_redemptions_invite_code_fkey
  foreign key (invite_code) references public.invites(code) on delete cascade;

drop index if exists idx_invite_redemptions_unique;
create unique index if not exists idx_invite_redemptions_unique on public.invite_redemptions (invite_code, user_id);

-- Replace decrement_uses helper with code-based variant
DROP FUNCTION IF EXISTS public.decrement_uses(uuid);
DROP FUNCTION IF EXISTS public.decrement_uses(p_code_id uuid);

create or replace function public.decrement_uses(p_code text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.invites
  set
    uses_remaining = greatest(uses_remaining - 1, 0),
    redeemed_by = case
      when auth.uid() is null then redeemed_by
      when array_position(redeemed_by, auth.uid()) is not null then redeemed_by
      else redeemed_by || auth.uid()
    end,
    updated_at = now()
  where code = p_code;

  if not found then
    update public.vip_codes
    set uses_remaining = greatest(uses_remaining - 1, 0)
    where code = p_code;
  end if;
end;
$$;

-- Refresh RLS policies
alter table public.invites enable row level security;

DROP POLICY IF EXISTS invites_admin_all ON public.invites;
DROP POLICY IF EXISTS "Admins can manage invites" ON public.invites;
DROP POLICY IF EXISTS "Users can view own invites" ON public.invites;

create policy invites_select_authenticated on public.invites
  for select
  to authenticated
  using (true);

-- Service role bypasses RLS; no insert/update policies for authenticated users
