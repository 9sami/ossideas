/*
  # Add onboarding_completed field to profiles table

  1. Changes
    - Add onboarding_completed column to profiles table
    - Set default value to false
    - Update existing rows to false
    - Update the handle_new_user function to include onboarding_completed field

  2. Security
    - No changes to RLS policies needed as onboarding_completed is part of existing profile data
*/

-- Add onboarding_completed column
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS onboarding_completed boolean DEFAULT false;

-- Update existing rows to have onboarding_completed = false
UPDATE profiles SET onboarding_completed = false WHERE onboarding_completed IS NULL;

-- Update the handle_new_user function to include onboarding_completed
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id, 
    email, 
    full_name, 
    avatar_url,
    location,
    phone_number,
    usage_purpose,
    industries,
    referral_source,
    onboarding_completed
  )
  VALUES (
    NEW.id, 
    NEW.email, 
    NEW.raw_user_meta_data->>'full_name', 
    NEW.raw_user_meta_data->>'avatar_url',
    NEW.raw_user_meta_data->>'location',
    NEW.raw_user_meta_data->>'phone_number',
    NEW.raw_user_meta_data->>'usage_purpose',
    CASE 
      WHEN NEW.raw_user_meta_data->>'industries' IS NOT NULL 
      THEN string_to_array(NEW.raw_user_meta_data->>'industries', ',')
      ELSE NULL
    END,
    NEW.raw_user_meta_data->>'referral_source',
    false
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 