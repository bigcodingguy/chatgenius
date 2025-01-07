-- Create messages table
create table if not exists messages (
    id uuid default uuid_generate_v4() primary key,
    channel_id text not null references channels(id) on delete cascade,
    user_id text not null,
    content text not null,
    type text not null default 'text' check (type in ('text', 'file')),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create indexes
create index if not exists messages_channel_id_idx on messages(channel_id);
create index if not exists messages_created_at_idx on messages(created_at);

-- Add trigger for updated_at
create trigger update_messages_updated_at
    before update on messages
    for each row
    execute function update_updated_at_column(); 