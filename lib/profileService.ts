import { supabase } from './supabase';
import { Profile, UpdateProfileData } from './types/profile';

export class ProfileService {
  /**
   * Get the current user's profile
   */
  static async getCurrentProfile(): Promise<Profile | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in getCurrentProfile:', error);
      return null;
    }
  }

  /**
   * Update the current user's profile
   */
  static async updateProfile(updates: UpdateProfileData): Promise<Profile | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating profile:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in updateProfile:', error);
      return null;
    }
  }

  /**
   * Mark the free trial as used
   */
  static async markFreeTrialUsed(): Promise<boolean> {
    try {
      const result = await this.updateProfile({ free_trial_used: true });
      return result !== null;
    } catch (error) {
      console.error('Error marking free trial as used:', error);
      return false;
    }
  }

  /**
   * Check if the user has used their free trial
   */
  static async hasUsedFreeTrial(): Promise<boolean> {
    try {
      const profile = await this.getCurrentProfile();
      return profile?.free_trial_used || false;
    } catch (error) {
      console.error('Error checking free trial status:', error);
      return false;
    }
  }

  /**
   * Get the user's trial eligibility
   */
  static async getTrialEligibility(): Promise<{
    canUseTrial: boolean;
    hasUsedTrial: boolean;
  }> {
    try {
      const hasUsedTrial = await this.hasUsedFreeTrial();
      return {
        canUseTrial: !hasUsedTrial,
        hasUsedTrial,
      };
    } catch (error) {
      console.error('Error getting trial eligibility:', error);
      return {
        canUseTrial: false,
        hasUsedTrial: true, // Assume used if error
      };
    }
  }
} 