/*
  # Initial Database Schema for GenesisAI

  1. New Tables
    - `profiles` - User profile information extending Supabase auth
    - `service_categories` - Available service types (Computer, Plumbing, etc.)
    - `service_providers` - Professional service provider profiles
    - `bookings` - Service booking requests and appointments
    - `reviews` - Customer reviews and ratings
    - `chat_messages` - AI conversation history

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Service providers can manage their business information
    - Public read access for service categories

  3. Features
    - Location-based matching capability
    - Photo/video upload support
    - Rating and review system
    - AI chat history tracking
*/

-- Create profiles table extending auth.users
CREATE TABLE IF NOT EXISTS profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE,
  full_name text NOT NULL,
  phone text,
  address text,
  user_type text NOT NULL CHECK (user_type IN ('client', 'service_provider')) DEFAULT 'client',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  PRIMARY KEY (id)
);

-- Create service categories table
CREATE TABLE IF NOT EXISTS service_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text,
  icon text,
  created_at timestamptz DEFAULT now()
);

-- Create service providers table
CREATE TABLE IF NOT EXISTS service_providers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  business_name text NOT NULL,
  description text,
  service_categories text[] DEFAULT '{}',
  location text,
  coordinates point,
  rating numeric(2,1) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  reviews_count integer DEFAULT 0,
  hourly_rate numeric(10,2),
  availability jsonb DEFAULT '{}',
  photos text[] DEFAULT '{}',
  verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  provider_id uuid REFERENCES service_providers(id) ON DELETE CASCADE,
  service_category text NOT NULL,
  description text NOT NULL,
  location text NOT NULL,
  scheduled_date date NOT NULL,
  scheduled_time time NOT NULL,
  status text NOT NULL CHECK (status IN ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled')) DEFAULT 'pending',
  photos text[] DEFAULT '{}',
  videos text[] DEFAULT '{}',
  estimated_cost numeric(10,2),
  final_cost numeric(10,2),
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid REFERENCES bookings(id) ON DELETE CASCADE,
  client_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  provider_id uuid REFERENCES service_providers(id) ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  photos text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Create chat messages table for AI conversations
CREATE TABLE IF NOT EXISTS chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  message text NOT NULL,
  is_ai_response boolean DEFAULT false,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Service categories policies (public read)
CREATE POLICY "Service categories are readable by everyone"
  ON service_categories FOR SELECT
  TO anon, authenticated
  USING (true);

-- Service providers policies
CREATE POLICY "Service providers are readable by everyone"
  ON service_providers FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Service providers can manage their own data"
  ON service_providers FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

-- Bookings policies
CREATE POLICY "Users can read their own bookings"
  ON bookings FOR SELECT
  TO authenticated
  USING (
    client_id = auth.uid() OR 
    provider_id IN (SELECT id FROM service_providers WHERE user_id = auth.uid())
  );

CREATE POLICY "Clients can create bookings"
  ON bookings FOR INSERT
  TO authenticated
  WITH CHECK (client_id = auth.uid());

CREATE POLICY "Users can update their own bookings"
  ON bookings FOR UPDATE
  TO authenticated
  USING (
    client_id = auth.uid() OR 
    provider_id IN (SELECT id FROM service_providers WHERE user_id = auth.uid())
  );

-- Reviews policies
CREATE POLICY "Reviews are readable by everyone"
  ON reviews FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Clients can create reviews for their bookings"
  ON reviews FOR INSERT
  TO authenticated
  WITH CHECK (
    client_id = auth.uid() AND
    booking_id IN (SELECT id FROM bookings WHERE client_id = auth.uid())
  );

-- Chat messages policies
CREATE POLICY "Users can read their own chat messages"
  ON chat_messages FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own chat messages"
  ON chat_messages FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Insert default service categories
INSERT INTO service_categories (name, description, icon) VALUES
  ('Computer Repair', 'PC, laptop, virus removal, data recovery', 'monitor'),
  ('Plumbing', 'Leaks, installations, drain cleaning', 'wrench'),
  ('Electrical', 'Wiring, outlets, lighting, safety', 'zap'),
  ('HVAC', 'Heating, cooling, ventilation', 'thermometer'),
  ('Auto Repair', 'Engine, brakes, maintenance', 'car')
ON CONFLICT (name) DO NOTHING;

-- Function to handle profile creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO profiles (id, full_name)
  VALUES (new.id, new.raw_user_meta_data->>'full_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE handle_new_user();

-- Function to update provider rating when review is added
CREATE OR REPLACE FUNCTION update_provider_rating()
RETURNS trigger AS $$
BEGIN
  UPDATE service_providers
  SET 
    rating = (
      SELECT ROUND(AVG(rating::numeric), 1)
      FROM reviews
      WHERE provider_id = NEW.provider_id
    ),
    reviews_count = (
      SELECT COUNT(*)
      FROM reviews
      WHERE provider_id = NEW.provider_id
    )
  WHERE id = NEW.provider_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update provider rating
DROP TRIGGER IF EXISTS on_review_created ON reviews;
CREATE TRIGGER on_review_created
  AFTER INSERT ON reviews
  FOR EACH ROW EXECUTE PROCEDURE update_provider_rating();