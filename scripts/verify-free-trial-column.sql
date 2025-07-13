-- Verify that the free_trial_used column was added correctly
-- Run this script after adding the column to confirm everything is working

-- Check if the column exists
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'users' 
AND column_name = 'free_trial_used';

-- Check the current values for all users
SELECT 
    id, 
    email, 
    free_trial_used,
    created_at
FROM users 
ORDER BY created_at DESC 
LIMIT 10;

-- Count how many users have free_trial_used = false vs true
SELECT 
    free_trial_used,
    COUNT(*) as user_count
FROM users 
GROUP BY free_trial_used; 