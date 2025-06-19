/*
  # Add location field to profiles table

  1. Changes
    - Add location column to profiles table if it doesn't exist
    - Update the handle_new_user function to include location field

  2. Security
    - No changes to RLS policies needed as location is part of existing profile data
*/

-- Add location column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'location'
  ) THEN
    ALTER TABLE profiles ADD COLUMN location text;
  END IF;
END $$;

-- Update the handle_new_user function to include location
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
    referral_source
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
    NEW.raw_user_meta_data->>'referral_source'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;