import { supabase } from '@/lib/supabase';

/**
 * Checks if a user is eligible for a free trial.
 * Returns true if free_trial_used is false or null for the given userId.
 */
export async function checkFreeTrial(userId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('users')
    .select('free_trial_used')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error checking free trial:', error);
    return false;
  }

  // Eligible if free_trial_used is false or null
  return data && (data.free_trial_used === false || data.free_trial_used == null);
}

/**
 * Marks the user's free trial as used (sets free_trial_used to true).
 * Returns true if successful, false if there was an error.
 */
export async function markFreeTrialUsed(userId: string): Promise<boolean> {
  const { error } = await supabase
    .from('users')
    .update({ free_trial_used: true })
    .eq('id', userId);

  if (error) {
    console.error('Error marking free trial as used:', error);
    return false;
  }
  
  return true;
} 