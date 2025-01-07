-- Insert the general channel with a fixed ID
insert into channels (id, name, description, type, created_by, is_direct)
values (
    '1',  -- Our hardcoded channel ID
    'general',
    'General discussion channel',
    'public',
    '00000000-0000-0000-0000-000000000000',  -- System user ID
    false
)
on conflict (id) do nothing; 