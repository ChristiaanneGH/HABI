/*
  # Add Laundry Subcategories and Pricing Models

  1. New Tables
    - `service_subcategories` - Subcategories under main service categories
    - `pricing_models` - Different pricing structures for services
    - `service_pricing` - Links services to their pricing models

  2. Laundry Services Subcategories
    - Standard Wash & Fold
    - Standard Wash & Iron
    - Express Wash
    - Express Wash & Iron
    - Delicate Wash
    - Baby Clothes
    - Curtain/Bedding Wash

  3. Pricing Models
    - Flat-Rate + Add-Ons
    - Task-Based Pricing
    - Hourly Pricing
    - Subscription / Recurring Packages
    - Per-Piece Pricing

  4. Security
    - Enable RLS on new tables
    - Public read access for subcategories and pricing models
*/

-- Create service subcategories table
CREATE TABLE IF NOT EXISTS service_subcategories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_category_id uuid REFERENCES service_categories(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  pricing_model text,
  base_price numeric(10,2),
  notes text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create pricing models table
CREATE TABLE IF NOT EXISTS pricing_models (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text NOT NULL,
  ideal_for text,
  example_services text[],
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create service pricing junction table
CREATE TABLE IF NOT EXISTS service_pricing (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_provider_id uuid REFERENCES service_providers(id) ON DELETE CASCADE,
  subcategory_id uuid REFERENCES service_subcategories(id) ON DELETE CASCADE,
  pricing_model_id uuid REFERENCES pricing_models(id) ON DELETE CASCADE,
  base_price numeric(10,2) NOT NULL,
  additional_fees jsonb DEFAULT '{}',
  notes text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE service_subcategories ENABLE ROW LEVEL SECURITY;
ALTER TABLE pricing_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_pricing ENABLE ROW LEVEL SECURITY;

-- Subcategories policies (public read)
CREATE POLICY "Service subcategories are readable by everyone"
  ON service_subcategories FOR SELECT
  TO anon, authenticated
  USING (true);

-- Pricing models policies (public read)
CREATE POLICY "Pricing models are readable by everyone"
  ON pricing_models FOR SELECT
  TO anon, authenticated
  USING (true);

-- Service pricing policies
CREATE POLICY "Service pricing is readable by everyone"
  ON service_pricing FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Service providers can manage their pricing"
  ON service_pricing FOR ALL
  TO authenticated
  USING (
    service_provider_id IN (
      SELECT id FROM service_providers WHERE user_id = auth.uid()
    )
  );

-- Insert pricing models
INSERT INTO pricing_models (name, description, ideal_for, example_services) VALUES
(
  'Flat-Rate + Add-Ons',
  'Fixed base price per service/tier, with optional paid extras',
  'House cleaning, laundry bags, tech installs',
  ARRAY['Standard house cleaning', 'Laundry wash & fold', 'Basic computer setup']
),
(
  'Task-Based Pricing',
  'Price per predefined task (e.g., fix faucet, install light), often with quantity',
  'Plumbing, handyman, appliance repair',
  ARRAY['Fix leaky faucet', 'Install ceiling fan', 'Repair washing machine']
),
(
  'Hourly Pricing',
  'Client pays by duration, regardless of specific task',
  'Organizing, IT support, lawn care',
  ARRAY['Home organization', 'Computer troubleshooting', 'Garden maintenance']
),
(
  'Subscription / Recurring Packages',
  'Fixed recurring fee for repeat services (weekly/monthly)',
  'House cleaning, laundry, pool care',
  ARRAY['Weekly house cleaning', 'Monthly laundry service', 'Pool maintenance']
),
(
  'Per-Piece Pricing',
  'Price per individual item (e.g., shirt, blazer, curtain)',
  'Dry cleaning, ironing, sensitive garments',
  ARRAY['Dry clean suit', 'Iron dress shirt', 'Clean curtains']
);

-- Get the Laundry Services category ID
DO $$
DECLARE
  laundry_category_id uuid;
  flat_rate_model_id uuid;
  per_piece_model_id uuid;
BEGIN
  -- Get category ID
  SELECT id INTO laundry_category_id 
  FROM service_categories 
  WHERE name = 'Laundry Services';
  
  -- Get pricing model IDs
  SELECT id INTO flat_rate_model_id 
  FROM pricing_models 
  WHERE name = 'Flat-Rate + Add-Ons';
  
  SELECT id INTO per_piece_model_id 
  FROM pricing_models 
  WHERE name = 'Per-Piece Pricing';
  
  -- Insert laundry subcategories if category exists
  IF laundry_category_id IS NOT NULL THEN
    INSERT INTO service_subcategories (parent_category_id, name, description, pricing_model, base_price, notes) VALUES
    (
      laundry_category_id,
      'Standard Wash & Fold',
      'Wash, dry, fold for everyday clothes',
      'Flat-Rate (per bag)',
      250.00,
      'Most common recurring service'
    ),
    (
      laundry_category_id,
      'Standard Wash & Iron',
      'Clothes are washed, dried, and ironed',
      'Flat-Rate (per bag) or Per-Piece',
      350.00,
      'Ideal for professionals and families'
    ),
    (
      laundry_category_id,
      'Express Wash',
      'Same-day wash & fold service',
      'Flat-Rate + Add-on',
      300.00,
      'Time-based surcharge'
    ),
    (
      laundry_category_id,
      'Express Wash & Iron',
      'Same-day wash + ironing',
      'Flat-Rate + Add-on',
      450.00,
      'Premium tier with speed + quality'
    ),
    (
      laundry_category_id,
      'Delicate Wash',
      'Gentle handling (air-dry, cold cycle)',
      'Per-Piece',
      50.00,
      'For silks, lace, wool'
    ),
    (
      laundry_category_id,
      'Baby Clothes',
      'Uses hypoallergenic detergent',
      'Flat-Rate or Per-Piece',
      200.00,
      'Family-safe; could be bundled'
    ),
    (
      laundry_category_id,
      'Curtain/Bedding Wash',
      'Wash for oversized items',
      'Per-Kilo',
      80.00,
      'Large items by weight (e.g., duvets, drapes)'
    );
  END IF;
END $$;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_service_subcategories_parent_category 
  ON service_subcategories(parent_category_id);

CREATE INDEX IF NOT EXISTS idx_service_pricing_provider 
  ON service_pricing(service_provider_id);

CREATE INDEX IF NOT EXISTS idx_service_pricing_subcategory 
  ON service_pricing(subcategory_id);

-- Add trigger to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_service_subcategories_updated_at
  BEFORE UPDATE ON service_subcategories
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_service_pricing_updated_at
  BEFORE UPDATE ON service_pricing
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();