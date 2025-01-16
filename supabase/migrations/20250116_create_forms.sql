-- Create forms table
create table public.forms (
    id uuid default gen_random_uuid() primary key,
    title text not null,
    description text,
    questions jsonb default '[]'::jsonb,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    user_id uuid references auth.users(id) on delete cascade not null
);

-- Enable RLS
alter table public.forms enable row level security;

-- Create policies
create policy "Users can view their own forms" on public.forms
    for select using (auth.uid() = user_id);

create policy "Users can create their own forms" on public.forms
    for insert with check (auth.uid() = user_id);

create policy "Users can update their own forms" on public.forms
    for update using (auth.uid() = user_id);

create policy "Users can delete their own forms" on public.forms
    for delete using (auth.uid() = user_id);

-- Create updated_at trigger
create function public.handle_updated_at()
returns trigger as $$
begin
    new.updated_at = timezone('utc'::text, now());
    return new;
end;
$$ language plpgsql;

create trigger handle_updated_at
    before update on public.forms
    for each row
    execute function public.handle_updated_at();
