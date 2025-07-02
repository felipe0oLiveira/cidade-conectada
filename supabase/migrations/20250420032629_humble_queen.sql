/*
  # Create storage bucket for profile avatars

  1. Storage
    - Create 'avatars' bucket for storing profile images
    - Set public access to allow avatar viewing
  
  2. Security
    - Enable RLS policies for secure access
    - Allow authenticated users to upload their own avatars
    - Allow public read access to all avatars
*/

-- Create the storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true);

-- Create policy to allow authenticated users to upload files
CREATE POLICY "Users can upload their own avatar"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'avatars' AND
  POSITION('avatars/' in name) = 1 AND
  POSITION(auth.uid()::text in SUBSTRING(name from 9)) = 1
);

-- Create policy to allow authenticated users to update their own files
CREATE POLICY "Users can update their own avatar"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'avatars' AND
  POSITION('avatars/' in name) = 1 AND
  POSITION(auth.uid()::text in SUBSTRING(name from 9)) = 1
);

-- Create policy to allow authenticated users to delete their own files
CREATE POLICY "Users can delete their own avatar"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'avatars' AND
  POSITION('avatars/' in name) = 1 AND
  POSITION(auth.uid()::text in SUBSTRING(name from 9)) = 1
);

-- Create policy to allow public read access to all files
CREATE POLICY "Public read access"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'avatars');