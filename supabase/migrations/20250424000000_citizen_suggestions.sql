/*
  # Add Citizen Suggestions System

  1. New Tables
    - `suggestions` - User suggestions for city improvements
      - `id` (uuid, primary key)
      - `user_id` (uuid) - Reference to profiles
      - `title` (text) - Suggestion title
      - `description` (text) - Detailed description
      - `category` (text) - Category (infrastructure, health, education, etc.)
      - `location` (text) - Specific location if applicable
      - `priority` (text) - Priority level (low, medium, high, critical)
      - `status` (text) - Status (pending, under_review, approved, rejected, implemented)
      - `votes_count` (int) - Number of votes
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `suggestion_votes` - Votes on suggestions
      - `id` (uuid, primary key)
      - `suggestion_id` (uuid) - Reference to suggestions
      - `user_id` (uuid) - Reference to profiles
      - `vote_type` (text) - Type of vote (upvote, downvote)
      - `created_at` (timestamptz)
    
    - `suggestion_comments` - Comments on suggestions
      - `id` (uuid, primary key)
      - `suggestion_id` (uuid) - Reference to suggestions
      - `user_id` (uuid) - Reference to profiles
      - `content` (text) - Comment content
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `suggestion_attachments` - Files attached to suggestions
      - `id` (uuid, primary key)
      - `suggestion_id` (uuid) - Reference to suggestions
      - `file_name` (text) - Original file name
      - `file_url` (text) - File URL in storage
      - `file_type` (text) - File type (image, document, etc.)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Allow public read access to suggestions
*/

-- Create suggestions table
CREATE TABLE IF NOT EXISTS suggestions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  category text NOT NULL,
  location text,
  priority text DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'under_review', 'approved', 'rejected', 'implemented')),
  votes_count int DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create suggestion_votes table
CREATE TABLE IF NOT EXISTS suggestion_votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  suggestion_id uuid REFERENCES suggestions(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  vote_type text NOT NULL CHECK (vote_type IN ('upvote', 'downvote')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(suggestion_id, user_id)
);

-- Create suggestion_comments table
CREATE TABLE IF NOT EXISTS suggestion_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  suggestion_id uuid REFERENCES suggestions(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create suggestion_attachments table
CREATE TABLE IF NOT EXISTS suggestion_attachments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  suggestion_id uuid REFERENCES suggestions(id) ON DELETE CASCADE,
  file_name text NOT NULL,
  file_url text NOT NULL,
  file_type text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE suggestion_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE suggestion_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE suggestion_attachments ENABLE ROW LEVEL SECURITY;

-- Create policies for suggestions
CREATE POLICY "Allow public read access for suggestions"
  ON suggestions
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow authenticated users to create suggestions"
  ON suggestions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow users to update their own suggestions"
  ON suggestions
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create policies for suggestion_votes
CREATE POLICY "Allow public read access for votes"
  ON suggestion_votes
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow authenticated users to vote"
  ON suggestion_votes
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow users to update their own votes"
  ON suggestion_votes
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow users to delete their own votes"
  ON suggestion_votes
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policies for suggestion_comments
CREATE POLICY "Allow public read access for comments"
  ON suggestion_comments
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow authenticated users to comment"
  ON suggestion_comments
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow users to update their own comments"
  ON suggestion_comments
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow users to delete their own comments"
  ON suggestion_comments
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policies for suggestion_attachments
CREATE POLICY "Allow public read access for attachments"
  ON suggestion_attachments
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow authenticated users to upload attachments"
  ON suggestion_attachments
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_suggestions_user_id ON suggestions(user_id);
CREATE INDEX IF NOT EXISTS idx_suggestions_category ON suggestions(category);
CREATE INDEX IF NOT EXISTS idx_suggestions_status ON suggestions(status);
CREATE INDEX IF NOT EXISTS idx_suggestions_created_at ON suggestions(created_at);
CREATE INDEX IF NOT EXISTS idx_suggestion_votes_suggestion_id ON suggestion_votes(suggestion_id);
CREATE INDEX IF NOT EXISTS idx_suggestion_votes_user_id ON suggestion_votes(user_id);
CREATE INDEX IF NOT EXISTS idx_suggestion_comments_suggestion_id ON suggestion_comments(suggestion_id);
CREATE INDEX IF NOT EXISTS idx_suggestion_attachments_suggestion_id ON suggestion_attachments(suggestion_id);

-- Create function to update votes count
CREATE OR REPLACE FUNCTION update_suggestion_votes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE suggestions 
    SET votes_count = (
      SELECT COUNT(*) 
      FROM suggestion_votes 
      WHERE suggestion_id = NEW.suggestion_id AND vote_type = 'upvote'
    ) - (
      SELECT COUNT(*) 
      FROM suggestion_votes 
      WHERE suggestion_id = NEW.suggestion_id AND vote_type = 'downvote'
    )
    WHERE id = NEW.suggestion_id;
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    UPDATE suggestions 
    SET votes_count = (
      SELECT COUNT(*) 
      FROM suggestion_votes 
      WHERE suggestion_id = NEW.suggestion_id AND vote_type = 'upvote'
    ) - (
      SELECT COUNT(*) 
      FROM suggestion_votes 
      WHERE suggestion_id = NEW.suggestion_id AND vote_type = 'downvote'
    )
    WHERE id = NEW.suggestion_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE suggestions 
    SET votes_count = (
      SELECT COUNT(*) 
      FROM suggestion_votes 
      WHERE suggestion_id = OLD.suggestion_id AND vote_type = 'upvote'
    ) - (
      SELECT COUNT(*) 
      FROM suggestion_votes 
      WHERE suggestion_id = OLD.suggestion_id AND vote_type = 'downvote'
    )
    WHERE id = OLD.suggestion_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for votes count
CREATE TRIGGER trigger_update_suggestion_votes_count
  AFTER INSERT OR UPDATE OR DELETE ON suggestion_votes
  FOR EACH ROW
  EXECUTE FUNCTION update_suggestion_votes_count(); 