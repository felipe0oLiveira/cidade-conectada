/*
  # Add UBS (Basic Health Units) related tables

  1. New Tables
    - `neighborhoods` - List of city neighborhoods
      - `id` (uuid, primary key)
      - `name` (text) - Neighborhood name
      - `created_at` (timestamptz)
    
    - `health_units` - Basic Health Units (UBS)
      - `id` (uuid, primary key)
      - `name` (text) - UBS name
      - `address` (text) - Full address
      - `phone` (text) - Contact number
      - `neighborhood_id` (uuid) - Reference to neighborhoods
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `doctors` - Medical professionals
      - `id` (uuid, primary key)
      - `name` (text) - Doctor's name
      - `specialty` (text) - Medical specialty
      - `crm` (text) - Medical license number
      - `created_at` (timestamptz)
    
    - `doctor_schedules` - Doctor's schedules at health units
      - `id` (uuid, primary key)
      - `doctor_id` (uuid) - Reference to doctors
      - `health_unit_id` (uuid) - Reference to health_units
      - `weekday` (int) - Day of the week (0-6)
      - `start_time` (time) - Start of shift
      - `end_time` (time) - End of shift
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for public read access
*/

-- Create neighborhoods table
CREATE TABLE IF NOT EXISTS neighborhoods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create health_units table
CREATE TABLE IF NOT EXISTS health_units (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  address text NOT NULL,
  phone text,
  neighborhood_id uuid REFERENCES neighborhoods(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create doctors table
CREATE TABLE IF NOT EXISTS doctors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  specialty text NOT NULL,
  crm text NOT NULL UNIQUE,
  created_at timestamptz DEFAULT now()
);

-- Create doctor_schedules table
CREATE TABLE IF NOT EXISTS doctor_schedules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id uuid REFERENCES doctors(id) ON DELETE CASCADE,
  health_unit_id uuid REFERENCES health_units(id) ON DELETE CASCADE,
  weekday int NOT NULL CHECK (weekday >= 0 AND weekday <= 6),
  start_time time NOT NULL,
  end_time time NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(doctor_id, health_unit_id, weekday)
);

-- Enable RLS
ALTER TABLE neighborhoods ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_units ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctor_schedules ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access for neighborhoods"
  ON neighborhoods
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public read access for health units"
  ON health_units
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public read access for doctors"
  ON doctors
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public read access for doctor schedules"
  ON doctor_schedules
  FOR SELECT
  TO public
  USING (true);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_health_units_neighborhood ON health_units(neighborhood_id);
CREATE INDEX IF NOT EXISTS idx_doctor_schedules_doctor ON doctor_schedules(doctor_id);
CREATE INDEX IF NOT EXISTS idx_doctor_schedules_health_unit ON doctor_schedules(health_unit_id);
CREATE INDEX IF NOT EXISTS idx_doctor_schedules_weekday ON doctor_schedules(weekday);