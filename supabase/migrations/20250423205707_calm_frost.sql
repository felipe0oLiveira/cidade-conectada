/*
  # Add Cadastro Único table

  1. New Table
    - `cadastro_unico` - User registration for social programs
      - `id` (uuid, primary key)
      - `user_id` (uuid) - Reference to profiles
      - `cpf` (text) - User's CPF
      - `rg` (text) - User's RG
      - `nome_completo` (text) - Full name
      - `data_nascimento` (text) - Birth date
      - `nome_mae` (text) - Mother's name
      - `endereco` (text) - Address
      - `numero` (text) - Address number
      - `bairro` (text) - Neighborhood
      - `cidade` (text) - City
      - `estado` (text) - State
      - `cep` (text) - ZIP code
      - `telefone` (text) - Phone number
      - `renda_familiar` (text) - Family income
      - `num_pessoas` (text) - Number of people in residence
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS
    - Add policies for authenticated users to:
      - Read their own registration
      - Create/Update their own registration
*/

-- Create cadastro_unico table
CREATE TABLE IF NOT EXISTS cadastro_unico (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  cpf text,
  rg text,
  nome_completo text,
  data_nascimento text,
  nome_mae text,
  endereco text,
  numero text,
  bairro text,
  cidade text,
  estado text,
  cep text,
  telefone text,
  renda_familiar text,
  num_pessoas text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE cadastro_unico ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own registration"
  ON cadastro_unico
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create/update own registration"
  ON cadastro_unico
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own registration"
  ON cadastro_unico
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);