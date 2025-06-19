/*
  # Remove conflicting auth trigger and function

  1. Changes Made
    - Drop the `on_auth_user_created` trigger that automatically creates profiles
    - Drop the `handle_new_user` function that was called by the trigger
    - Keep all other functionality intact (RLS policies, update triggers, etc.)

  2. Reason
    - The trigger was conflicting with the client-side OAuth profile creation
    - AuthCallback.tsx already handles profile creation/updates with more complete data
    - This eliminates the race condition causing "Database error saving new user"
*/

-- Drop the trigger first
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Drop the function
DROP FUNCTION IF EXISTS handle_new_user();