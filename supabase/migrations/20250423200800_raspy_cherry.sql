/*
  # Add Appointments Schema

  1. New Tables
    - `appointments`
      - `id` (uuid, primary key)
      - `patient_id` (uuid) - References profiles(id)
      - `doctor_id` (uuid) - References doctors(id)
      - `health_unit_id` (uuid) - References health_units(id)
      - `appointment_date` (date)
      - `appointment_time` (time)
      - `status` (text) - Can be 'scheduled', 'completed', or 'cancelled'
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on appointments table
    - Add policies for:
      - Users can read their own appointments
      - Users can create appointments
      - Users can update their own appointments (for cancellation)

  3. Constraints
    - Unique constraint on doctor_id, date, and time to prevent double booking
    - Status must be one of: 'scheduled', 'completed', 'cancelled'
    - Foreign key constraints with cascading deletes
*/

-- Create appointments table if it doesn't exist
CREATE TABLE IF NOT EXISTS appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  doctor_id uuid REFERENCES doctors(id) ON DELETE CASCADE,
  health_unit_id uuid REFERENCES health_units(id) ON DELETE CASCADE,
  appointment_date date NOT NULL,
  appointment_time time NOT NULL,
  status text NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(doctor_id, appointment_date, appointment_time)
);

-- Enable RLS
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Create policies safely
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'appointments' 
    AND policyname = 'Users can read own appointments'
  ) THEN
    CREATE POLICY "Users can read own appointments"
      ON appointments
      FOR SELECT
      TO authenticated
      USING (auth.uid() = patient_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'appointments' 
    AND policyname = 'Users can create own appointments'
  ) THEN
    CREATE POLICY "Users can create own appointments"
      ON appointments
      FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = patient_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'appointments' 
    AND policyname = 'Users can update own appointments'
  ) THEN
    CREATE POLICY "Users can update own appointments"
      ON appointments
      FOR UPDATE
      TO authenticated
      USING (auth.uid() = patient_id)
      WITH CHECK (auth.uid() = patient_id);
  END IF;
END $$;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_appointments_patient ON appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_appointments_doctor ON appointments(doctor_id);
CREATE INDEX IF NOT EXISTS idx_appointments_health_unit ON appointments(health_unit_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date);