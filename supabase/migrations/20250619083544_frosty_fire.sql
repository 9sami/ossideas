/*
  # Create Profile Creation Trigger

  1. Database Function
    - `handle_new_user()` function that creates a profile when a new user is created
    - Uses SECURITY DEFINER to bypass RLS for initial profile creation
    - Extracts user metadata for profile fields

  2. Database Trigger
    - `on_auth_user_created` trigger that fires after user creation
    - Automatically creates profile entry in profiles table
    - Eliminates race conditions with client-side profile creation

  3. Security
    - Maintains RLS policies for normal operations
    - Only bypasses RLS for the initial automated profile creation
    - Ensures data consistency and proper user onboarding
*/

-- Create function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id, 
    NEW.email, 
    NEW.raw_user_meta_data->>'full_name', 
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create profile on user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();