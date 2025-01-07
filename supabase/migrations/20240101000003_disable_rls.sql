-- Disable RLS on channels table
alter table channels disable row level security;

-- Disable RLS on messages table
alter table messages disable row level security;

-- Drop any existing policies
drop policy if exists "Messages are viewable by channel members" on messages;
drop policy if exists "Messages can be inserted by channel members" on messages;
drop policy if exists "Messages can be updated by their authors" on messages;
drop policy if exists "Messages can be deleted by their authors" on messages; 