create table if not exists public.user_profiles (
    id uuid references auth.users on delete cascade not null primary key,
    display_name text,
    avatar_url text,
    banner_url text,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up Row Level Security (RLS)
alter table public.user_profiles enable row level security;

create policy "Users can view any profile"
    on public.user_profiles for select
    using ( true );

create policy "Users can update own profile"
    on public.user_profiles for update
    using ( auth.uid() = id );

create policy "Users can insert own profile"
    on public.user_profiles for insert
    with check ( auth.uid() = id );

-- Create a function to handle new user profiles
create or replace function public.handle_new_user()
returns trigger as $$
begin
    insert into public.user_profiles (id)
    values (new.id);
    return new;
end;
$$ language plpgsql security definer;

-- Create a trigger to call the function on user creation
create trigger on_auth_user_created
    after insert on auth.users
    for each row execute procedure public.handle_new_user(); 