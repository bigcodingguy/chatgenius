-- Enable UUID extension if not already enabled
create extension if not exists "uuid-ossp";

-- Create channels table
create table if not exists channels (
    id text primary key,
    name text not null unique,
    description text,
    created_by text not null,
    type text not null check (type in ('public', 'private')),
    is_direct boolean not null default false,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create indexes
create index if not exists channels_name_idx on channels(name);

-- Create updated_at trigger function
create or replace function update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = timezone('utc'::text, now());
    return new;
end;
$$ language plpgsql;

-- Create trigger for channels table
create trigger update_channels_updated_at
    before update on channels
    for each row
    execute function update_updated_at_column(); 