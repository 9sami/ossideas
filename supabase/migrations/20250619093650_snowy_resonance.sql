/*
  # Add onboarding fields to profiles table

  1. New Columns
    - `phone_number` (text) - User's phone number with country code
    - `usage_purpose` (text) - How user plans to use the platform
    - `industries` (text[]) - Array of industries user is interested in
    - `referral_source` (text) - Where user heard about the platform

  2. Security
    - Update existing RLS policies to include new fields
*/

-- Add new columns to profiles table
DO $$
BEGIN
  -- Add phone_number column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'phone_number'
  ) THEN
    ALTER TABLE profiles ADD COLUMN phone_number text;
  END IF;

  -- Add usage_purpose column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'usage_purpose'
  ) THEN
    ALTER TABLE profiles ADD COLUMN usage_purpose text;
  END IF;

  -- Add industries column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'industries'
  ) THEN
    ALTER TABLE profiles ADD COLUMN industries text[];
  END IF;

  -- Add referral_source column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'referral_source'
  ) THEN
    ALTER TABLE profiles ADD COLUMN referral_source text;
  END IF;
END $$;

-- Update the handle_new_user function to include new fields
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id, 
    email, 
    full_name, 
    avatar_url,
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