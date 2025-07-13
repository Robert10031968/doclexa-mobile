-- Add free_trial_used column to users table
-- This script adds a boolean column with default value false
-- and updates all existing users to have this value set to false

-- Step 1: Add the column with default value
ALTER TABLE users 
ADD COLUMN free_trial_used BOOLEAN DEFAULT false;

-- Step 2: Update all existing users to have free_trial_used = false
-- (This is actually not needed since we set DEFAULT false, but included for clarity)
UPDATE users 
SET free_trial_used = false 
WHERE free_trial_used IS NULL;

-- Step 3: Make the column NOT NULL to ensure it always has a value
ALTER TABLE users 
ALTER COLUMN free_trial_used SET NOT NULL;

-- Step 4: Verify the changes
-- You can run this query to verify the column was added correctly:
-- SELECT id, email, free_trial_used FROM users LIMIT 5; 