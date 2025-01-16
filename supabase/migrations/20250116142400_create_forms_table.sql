-- Create forms table
create table if not exists public.forms (
    id uuid default gen_random_uuid() primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    title text not null,
    description text,
    user_id uuid references auth.users(id) on delete cascade not null,
    questions jsonb[] default array[]::jsonb[],
    settings jsonb default '{}'::jsonb,
    published boolean default false,
    responses_count integer default 0
);

-- Enable RLS
alter table public.forms enable row level security;

-- Create policies
create policy "Users can create their own forms"
    on public.forms for insert
    with check (auth.uid() = user_id);

create policy "Users can view their own forms"
    on public.forms for select
    using (auth.uid() = user_id);

create policy "Users can update their own forms"
    on public.forms for update
    using (auth.uid() = user_id);

create policy "Users can delete their own forms"
    on public.forms for delete
    using (auth.uid() = user_id);

-- Create updated_at trigger
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
    new.updated_at = timezone('utc'::text, now());
    return new;
end;
$$;

create trigger handle_forms_updated_at
    before update on public.forms
    for each row
    execute function public.handle_updated_at();
