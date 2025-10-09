-- Create admin_emails table
CREATE TABLE IF NOT EXISTS public.admin_emails (
  email text primary key,
  added_at timestamptz default now()
);

-- Insert initial admin email
insert into public.admin_emails(email)
values ('tyler@tdstudiosny.com')
on conflict do nothing;