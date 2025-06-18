/*
  # Add Delete Policy for Profiles

  1. Changes
    - Add policy to allow users to delete their own profile
    - This policy ensures users can only delete their own data

  2. Security
    - Enable delete policy for authenticated users
    - Users can only delete their own profile
*/

-- Add delete policy for profiles table
CREATE POLICY "Users can delete own profile"
  ON profiles
  FOR DELETE
  TO authenticated
  USING (auth.uid() = id);