export interface Profile {
  id: string;
  free_trial_used: boolean;
  created_at: string;
}

export interface CreateProfileData {
  id: string;
  free_trial_used?: boolean;
}

export interface UpdateProfileData {
  free_trial_used?: boolean;
} 