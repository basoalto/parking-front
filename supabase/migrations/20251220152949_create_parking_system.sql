/*
  # Parking Management System Database Schema

  1. New Tables
    - `parking_lots`
      - `id` (uuid, primary key)
      - `name` (text) - Name of the parking lot
      - `address` (text) - Location address
      - `hourly_rate` (numeric) - Price per hour
      - `capacity` (integer) - Maximum number of spaces
      - `user_id` (uuid) - Owner of the parking lot
      - `created_at` (timestamptz) - Creation timestamp
    
    - `vehicle_entries`
      - `id` (uuid, primary key)
      - `parking_lot_id` (uuid) - Reference to parking lot
      - `license_plate` (text) - Vehicle license plate
      - `vehicle_type` (text) - Type of vehicle (car, motorcycle, truck)
      - `entry_time` (timestamptz) - When vehicle entered
      - `exit_time` (timestamptz, nullable) - When vehicle exited
      - `amount_paid` (numeric, nullable) - Amount paid on exit
      - `user_id` (uuid) - User who registered the entry
      - `created_at` (timestamptz) - Creation timestamp

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Users can only see and manage their own parking lots
    - Users can only see entries for their parking lots
*/

CREATE TABLE IF NOT EXISTS parking_lots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  address text NOT NULL,
  hourly_rate numeric NOT NULL DEFAULT 5.00,
  capacity integer NOT NULL DEFAULT 20,
  user_id uuid NOT NULL REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS vehicle_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parking_lot_id uuid NOT NULL REFERENCES parking_lots(id) ON DELETE CASCADE,
  license_plate text NOT NULL,
  vehicle_type text NOT NULL DEFAULT 'car',
  entry_time timestamptz NOT NULL DEFAULT now(),
  exit_time timestamptz,
  amount_paid numeric,
  user_id uuid NOT NULL REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE parking_lots ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicle_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own parking lots"
  ON parking_lots FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own parking lots"
  ON parking_lots FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own parking lots"
  ON parking_lots FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own parking lots"
  ON parking_lots FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view entries for own parking lots"
  ON vehicle_entries FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM parking_lots
      WHERE parking_lots.id = vehicle_entries.parking_lot_id
      AND parking_lots.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert entries for own parking lots"
  ON vehicle_entries FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM parking_lots
      WHERE parking_lots.id = vehicle_entries.parking_lot_id
      AND parking_lots.user_id = auth.uid()
    )
    AND auth.uid() = user_id
  );

CREATE POLICY "Users can update entries for own parking lots"
  ON vehicle_entries FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM parking_lots
      WHERE parking_lots.id = vehicle_entries.parking_lot_id
      AND parking_lots.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM parking_lots
      WHERE parking_lots.id = vehicle_entries.parking_lot_id
      AND parking_lots.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete entries for own parking lots"
  ON vehicle_entries FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM parking_lots
      WHERE parking_lots.id = vehicle_entries.parking_lot_id
      AND parking_lots.user_id = auth.uid()
    )
  );

CREATE INDEX idx_parking_lots_user_id ON parking_lots(user_id);
CREATE INDEX idx_vehicle_entries_parking_lot_id ON vehicle_entries(parking_lot_id);
CREATE INDEX idx_vehicle_entries_exit_time ON vehicle_entries(exit_time);
