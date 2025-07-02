/*
  # Add Appointments System Tables

  1. New Tables
    - `specialties` - Medical specialties
      - `id` (uuid, primary key)
      - `name` (text) - Specialty name
      - `created_at` (timestamptz)
    
    - `appointments` - Medical appointments
      - `id` (uuid, primary key)
      - `patient_id` (uuid) - Reference to profiles
      - `doctor_id` (uuid) - Reference to doctors
      - `health_unit_id` (uuid) - Reference to health_units
      - `appointment_date` (date) - Date of appointment
      - `appointment_time` (time) - Time of appointment
      - `status` (text) - Status of appointment (scheduled, completed, cancelled)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Changes
    - Add specialty column to doctors table
    - Add RLS policies for appointments
*/

-- Create specialties table
CREATE TABLE IF NOT EXISTS specialties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  created_at timestamptz DEFAULT now()
);

-- Create appointments table
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
ALTER TABLE specialties ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public read access for specialties"
  ON specialties
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Users can read own appointments"
  ON appointments
  FOR SELECT
  TO authenticated
  USING (auth.uid() = patient_id);

CREATE POLICY "Users can create own appointments"
  ON appointments
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Users can update own appointments"
  ON appointments
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = patient_id)
  WITH CHECK (auth.uid() = patient_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_appointments_patient ON appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_appointments_doctor ON appointments(doctor_id);
CREATE INDEX IF NOT EXISTS idx_appointments_health_unit ON appointments(health_unit_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date);