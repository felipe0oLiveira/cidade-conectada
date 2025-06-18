/*
  # Safe Policy Creation

  1. Changes
    - Safely attempt to create delete policy for profiles table
    - Only create if policy doesn't already exist
    - No changes if policy already exists

  2. Notes
    - Uses DO block to check policy existence
    - Prevents errors from duplicate policy creation
*/

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'profiles' 
    AND policyname = 'Users can delete own profile'
  ) THEN
    CREATE POLICY "Users can delete own profile"
      ON profiles
      FOR DELETE
      TO authenticated
      USING (auth.uid() = id);
  END IF;
END $$;