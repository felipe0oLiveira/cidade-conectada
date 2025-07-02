/*
  # Add avatar_url to profiles table

  1. Changes
    - Add `avatar_url` column to `profiles` table for storing profile picture URLs

  2. Notes
    - The column is nullable since not all users will have a profile picture
    - URLs will point to images stored in Supabase Storage
*/

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' 
    AND column_name = 'avatar_url'
  ) THEN
    ALTER TABLE profiles ADD COLUMN avatar_url text;
  END IF;
END $$;