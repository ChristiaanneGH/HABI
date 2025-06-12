/*
  # Add Comprehensive Service Categories and Providers

  1. Service Categories
    - Essential Maintenance & Repair (Plumbing, Electrical, HVAC, Appliance Repair, General Handyman, Roofing)
    - Cleaning & Organization (House Cleaning, Specialized Cleaning, Laundry, Organization)
    - Pest Control
    - Grounds & Garden Care (Landscaping, Pool Maintenance)
    - Home Improvement & Renovation (Painting, Flooring, Remodeling, Carpentry)
    - Automotive Services (Traditional Car Repair, EV Services)
    - Specialized & Occasional Needs (IT/Tech, Waste Removal, Security)

  2. Service Providers
    - Multiple providers per category with realistic Philippine data
    - Ratings between 4.0-5.0
    - Hourly rates in Philippine Peso (₱300-₱2500/hour)
    - Business names, descriptions, and locations
*/

-- Clear existing data
DELETE FROM service_providers;
DELETE FROM service_categories;

-- Insert comprehensive service categories
INSERT INTO service_categories (name, description, icon) VALUES
-- Essential Maintenance & Repair
('Plumbing Services', 'Leak repair, drain cleaning, water heater services, toilet repair, fixture installation', 'wrench'),
('Electrical Services', 'Outlet/switch repair, lighting installation, circuit breaker issues, wiring repair', 'zap'),
('HVAC Services', 'AC cleaning/repair/installation, duct cleaning, heating system maintenance', 'thermometer'),
('Appliance Repair', 'Washing machine, refrigerator, oven, dishwasher, microwave repair', 'settings'),
('General Handyman', 'Drywall repair, door/window installation, furniture assembly, minor carpentry', 'hammer'),
('Roofing & Exterior', 'Roof repair/inspection, gutter cleaning, exterior painting, siding repair', 'home'),

-- Cleaning & Organization
('House Cleaning', 'Regular cleaning, deep cleaning, move-in/out cleaning, post-construction cleaning', 'sparkles'),
('Specialized Cleaning', 'Carpet, upholstery, window, tile and grout cleaning', 'spray-can'),
('Laundry Services', 'Wash, dry, fold services, dry cleaning, ironing', 'shirt'),
('Organization Services', 'Clutter removal, pantry/closet organization, home decluttering', 'package'),

-- Pest Control
('Pest Control', 'Ant, cockroach, mosquito, rodent, termite, bed bug treatment', 'bug'),

-- Grounds & Garden Care
('Landscaping & Lawn Care', 'Lawn mowing, gardening, tree trimming, irrigation system repair', 'trees'),
('Pool Maintenance', 'Pool cleaning, chemical balancing, equipment repair', 'waves'),

-- Home Improvement & Renovation
('Painting Services', 'Interior and exterior painting services', 'paintbrush'),
('Flooring Services', 'Installation and repair of tile, wood, laminate, vinyl flooring', 'square'),
('Remodeling Services', 'Bathroom, kitchen, basement remodeling, general renovations', 'construction'),
('Carpentry Services', 'Custom cabinetry, deck building/repair, framing', 'hammer'),

-- Automotive Services
('Car Repair & Maintenance', 'Oil changes, tire service, brake repair, engine diagnostics, general maintenance', 'car'),
('Electric Vehicle Services', 'EV battery diagnostics, charging system repair, electric motor service', 'battery'),

-- Specialized & Occasional Needs
('IT & Tech Support', 'Network setup, computer repair, smart home installation, TV mounting', 'monitor'),
('Waste Removal', 'Junk removal, debris hauling, post-renovation cleanup', 'trash'),
('Security Services', 'Locksmith services, home security system installation', 'shield');

-- Insert service providers with Philippine data
INSERT INTO service_providers (business_name, description, service_categories, location, rating, reviews_count, hourly_rate, verified, photos) VALUES

-- Plumbing Services Providers
('Manila Plumbing Experts', 'Professional plumbing services with 15+ years experience. Specializing in leak repairs, drain cleaning, and water heater installation.', ARRAY['Plumbing Services'], 'Makati City, Metro Manila', 4.8, 127, 450.00, true, ARRAY['https://images.pexels.com/photos/8293778/pexels-photo-8293778.jpeg']),
('QuickFix Plumbers PH', 'Fast and reliable plumbing solutions. Available 24/7 for emergency repairs and installations.', ARRAY['Plumbing Services'], 'Quezon City, Metro Manila', 4.6, 89, 400.00, true, ARRAY['https://images.pexels.com/photos/8293726/pexels-photo-8293726.jpeg']),
('Cebu Pipe Masters', 'Trusted plumbing contractors serving Cebu and surrounding areas. Quality workmanship guaranteed.', ARRAY['Plumbing Services'], 'Cebu City, Cebu', 4.9, 156, 380.00, true, ARRAY['https://images.pexels.com/photos/8293742/pexels-photo-8293742.jpeg']),

-- Electrical Services Providers
('PowerTech Electricians', 'Licensed electrical contractors specializing in residential and commercial wiring, panel upgrades, and lighting installation.', ARRAY['Electrical Services'], 'Taguig City, Metro Manila', 4.9, 203, 550.00, true, ARRAY['https://images.pexels.com/photos/257736/pexels-photo-257736.jpeg']),
('Spark Electric Solutions', 'Professional electrical services including outlet installation, circuit repairs, and ceiling fan installation.', ARRAY['Electrical Services'], 'Pasig City, Metro Manila', 4.7, 134, 500.00, true, ARRAY['https://images.pexels.com/photos/257736/pexels-photo-257736.jpeg']),
('Davao Electric Pro', 'Reliable electrical services in Davao. Emergency repairs and scheduled installations available.', ARRAY['Electrical Services'], 'Davao City, Davao del Sur', 4.8, 98, 480.00, true, ARRAY['https://images.pexels.com/photos/257736/pexels-photo-257736.jpeg']),

-- HVAC Services Providers
('CoolAir Philippines', 'Premier HVAC services including AC installation, repair, cleaning, and maintenance. Serving Metro Manila since 2010.', ARRAY['HVAC Services'], 'Manila City, Metro Manila', 4.8, 245, 600.00, true, ARRAY['https://images.pexels.com/photos/8293778/pexels-photo-8293778.jpeg']),
('Arctic Breeze HVAC', 'Professional air conditioning services, duct cleaning, and ventilation system maintenance.', ARRAY['HVAC Services'], 'Alabang, Metro Manila', 4.7, 167, 580.00, true, ARRAY['https://images.pexels.com/photos/8293778/pexels-photo-8293778.jpeg']),
('Baguio Climate Control', 'HVAC specialists serving Northern Luzon. Heating and cooling solutions for all seasons.', ARRAY['HVAC Services'], 'Baguio City, Benguet', 4.6, 78, 520.00, true, ARRAY['https://images.pexels.com/photos/8293778/pexels-photo-8293778.jpeg']),

-- Appliance Repair Providers
('ApplianceFix Manila', 'Expert repair services for all major appliances. Washing machines, refrigerators, ovens, and more.', ARRAY['Appliance Repair'], 'San Juan City, Metro Manila', 4.8, 189, 450.00, true, ARRAY['https://images.pexels.com/photos/4246119/pexels-photo-4246119.jpeg']),
('Home Appliance Doctors', 'Professional appliance repair with genuine parts and warranty. Same-day service available.', ARRAY['Appliance Repair'], 'Marikina City, Metro Manila', 4.9, 156, 480.00, true, ARRAY['https://images.pexels.com/photos/4246119/pexels-photo-4246119.jpeg']),
('Iloilo Appliance Repair', 'Trusted appliance repair services in Western Visayas. Quality repairs at affordable rates.', ARRAY['Appliance Repair'], 'Iloilo City, Iloilo', 4.7, 92, 420.00, true, ARRAY['https://images.pexels.com/photos/4246119/pexels-photo-4246119.jpeg']),

-- General Handyman Providers
('Handy Helper PH', 'Your go-to handyman for all home repairs. Drywall, doors, windows, furniture assembly, and more.', ARRAY['General Handyman'], 'Paranaque City, Metro Manila', 4.7, 234, 350.00, true, ARRAY['https://images.pexels.com/photos/5691659/pexels-photo-5691659.jpeg']),
('Fix-It-All Services', 'Professional handyman services for residential and commercial properties. No job too small!', ARRAY['General Handyman'], 'Las Pinas City, Metro Manila', 4.8, 178, 380.00, true, ARRAY['https://images.pexels.com/photos/5691659/pexels-photo-5691659.jpeg']),
('Cagayan Handyman Hub', 'Reliable handyman services in Northern Luzon. Quality workmanship and fair pricing.', ARRAY['General Handyman'], 'Tuguegarao City, Cagayan', 4.6, 67, 320.00, true, ARRAY['https://images.pexels.com/photos/5691659/pexels-photo-5691659.jpeg']),

-- Roofing & Exterior Providers
('RoofMasters Philippines', 'Professional roofing contractors specializing in repair, inspection, and gutter services.', ARRAY['Roofing & Exterior'], 'Caloocan City, Metro Manila', 4.9, 145, 650.00, true, ARRAY['https://images.pexels.com/photos/209251/pexels-photo-209251.jpeg']),
('Exterior Pro Services', 'Complete exterior maintenance including roofing, siding, and exterior painting.', ARRAY['Roofing & Exterior'], 'Antipolo City, Rizal', 4.7, 98, 600.00, true, ARRAY['https://images.pexels.com/photos/209251/pexels-photo-209251.jpeg']),

-- House Cleaning Providers
('Sparkle Clean Manila', 'Professional house cleaning services. Regular, deep, and move-in/out cleaning available.', ARRAY['House Cleaning'], 'Ortigas, Metro Manila', 4.8, 312, 300.00, true, ARRAY['https://images.pexels.com/photos/4239146/pexels-photo-4239146.jpeg']),
('CleanPro Philippines', 'Trusted cleaning services with trained and bonded staff. Residential and commercial cleaning.', ARRAY['House Cleaning'], 'BGC, Taguig City', 4.9, 267, 350.00, true, ARRAY['https://images.pexels.com/photos/4239146/pexels-photo-4239146.jpeg']),
('Cebu Clean Squad', 'Professional cleaning services in Cebu. Eco-friendly products and flexible scheduling.', ARRAY['House Cleaning'], 'Lahug, Cebu City', 4.7, 189, 280.00, true, ARRAY['https://images.pexels.com/photos/4239146/pexels-photo-4239146.jpeg']),

-- Specialized Cleaning Providers
('Deep Clean Specialists', 'Expert carpet, upholstery, and specialized cleaning services using professional equipment.', ARRAY['Specialized Cleaning'], 'Muntinlupa City, Metro Manila', 4.8, 156, 450.00, true, ARRAY['https://images.pexels.com/photos/4239146/pexels-photo-4239146.jpeg']),
('Crystal Clear Windows', 'Professional window cleaning for residential and commercial properties. Interior and exterior service.', ARRAY['Specialized Cleaning'], 'Mandaluyong City, Metro Manila', 4.7, 123, 380.00, true, ARRAY['https://images.pexels.com/photos/4239146/pexels-photo-4239146.jpeg']),

-- Laundry Services Providers
('Fresh Laundry Express', 'Premium laundry services with pickup and delivery. Wash, dry, fold, and dry cleaning available.', ARRAY['Laundry Services'], 'Eastwood, Quezon City', 4.8, 234, 250.00, true, ARRAY['https://images.pexels.com/photos/963278/pexels-photo-963278.jpeg']),
('Suds & Bubbles Laundry', 'Professional laundry and dry cleaning services. Same-day service available.', ARRAY['Laundry Services'], 'Kapitolyo, Pasig City', 4.6, 167, 220.00, true, ARRAY['https://images.pexels.com/photos/963278/pexels-photo-963278.jpeg']),

-- Organization Services Providers
('Organize It PH', 'Professional home organization services. Decluttering, closet organization, and space optimization.', ARRAY['Organization Services'], 'Alabang Hills, Muntinlupa', 4.9, 89, 400.00, true, ARRAY['https://images.pexels.com/photos/6489663/pexels-photo-6489663.jpeg']),
('Clutter-Free Solutions', 'Expert organization services for homes and offices. Transform your space today!', ARRAY['Organization Services'], 'New Manila, Quezon City', 4.7, 76, 380.00, true, ARRAY['https://images.pexels.com/photos/6489663/pexels-photo-6489663.jpeg']),

-- Pest Control Providers
('Pest Busters Philippines', 'Professional pest control services. Termite, rodent, and insect treatment with eco-friendly options.', ARRAY['Pest Control'], 'Marikina City, Metro Manila', 4.8, 198, 500.00, true, ARRAY['https://images.pexels.com/photos/8293778/pexels-photo-8293778.jpeg']),
('Bug-Free Solutions', 'Comprehensive pest management for residential and commercial properties. Licensed and insured.', ARRAY['Pest Control'], 'Cainta, Rizal', 4.7, 134, 480.00, true, ARRAY['https://images.pexels.com/photos/8293778/pexels-photo-8293778.jpeg']),

-- Landscaping & Lawn Care Providers
('Green Thumb Landscaping', 'Professional landscaping and lawn care services. Garden design, maintenance, and tree services.', ARRAY['Landscaping & Lawn Care'], 'Ayala Alabang, Muntinlupa', 4.9, 167, 420.00, true, ARRAY['https://images.pexels.com/photos/1453499/pexels-photo-1453499.jpeg']),
('Garden Masters PH', 'Expert gardening and landscaping services. Lawn mowing, pruning, and irrigation system installation.', ARRAY['Landscaping & Lawn Care'], 'BF Homes, Paranaque', 4.8, 145, 400.00, true, ARRAY['https://images.pexels.com/photos/1453499/pexels-photo-1453499.jpeg']),
('Baguio Garden Care', 'Specialized landscaping services for mountain climate. Native plant expertise and sustainable practices.', ARRAY['Landscaping & Lawn Care'], 'Session Road, Baguio City', 4.7, 89, 380.00, true, ARRAY['https://images.pexels.com/photos/1453499/pexels-photo-1453499.jpeg']),

-- Pool Maintenance Providers
('AquaClear Pool Services', 'Professional pool maintenance and repair. Chemical balancing, equipment service, and cleaning.', ARRAY['Pool Maintenance'], 'Laguna, Calamba', 4.8, 123, 550.00, true, ARRAY['https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg']),
('Crystal Pool Maintenance', 'Expert pool care services for residential and commercial pools. Weekly maintenance available.', ARRAY['Pool Maintenance'], 'Antipolo, Rizal', 4.7, 98, 520.00, true, ARRAY['https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg']),

-- Painting Services Providers
('ColorCraft Painters', 'Professional painting services for interior and exterior projects. Quality paints and expert application.', ARRAY['Painting Services'], 'Cubao, Quezon City', 4.8, 189, 380.00, true, ARRAY['https://images.pexels.com/photos/1669799/pexels-photo-1669799.jpeg']),
('Perfect Paint Solutions', 'Expert painters specializing in residential and commercial projects. Free estimates and color consultation.', ARRAY['Painting Services'], 'Ortigas, Pasig City', 4.9, 156, 420.00, true, ARRAY['https://images.pexels.com/photos/1669799/pexels-photo-1669799.jpeg']),
('Cebu Paint Pros', 'Professional painting contractors in Cebu. Interior, exterior, and specialty finishes available.', ARRAY['Painting Services'], 'IT Park, Cebu City', 4.7, 112, 360.00, true, ARRAY['https://images.pexels.com/photos/1669799/pexels-photo-1669799.jpeg']),

-- Flooring Services Providers
('FloorMaster Philippines', 'Expert flooring installation and repair. Tile, hardwood, laminate, and vinyl flooring specialists.', ARRAY['Flooring Services'], 'Makati CBD, Makati City', 4.9, 145, 650.00, true, ARRAY['https://images.pexels.com/photos/534151/pexels-photo-534151.jpeg']),
('Premium Floor Solutions', 'Professional flooring services with premium materials. Installation, repair, and refinishing available.', ARRAY['Flooring Services'], 'Greenhills, San Juan', 4.8, 123, 600.00, true, ARRAY['https://images.pexels.com/photos/534151/pexels-photo-534151.jpeg']),

-- Remodeling Services Providers
('Dream Home Remodeling', 'Complete home renovation services. Kitchen, bathroom, and whole-house remodeling specialists.', ARRAY['Remodeling Services'], 'Alabang, Muntinlupa', 4.9, 98, 800.00, true, ARRAY['https://images.pexels.com/photos/1669799/pexels-photo-1669799.jpeg']),
('Renovation Experts PH', 'Professional remodeling contractors with 20+ years experience. Quality craftsmanship guaranteed.', ARRAY['Remodeling Services'], 'BGC, Taguig City', 4.8, 87, 750.00, true, ARRAY['https://images.pexels.com/photos/1669799/pexels-photo-1669799.jpeg']),

-- Carpentry Services Providers
('Woodcraft Masters', 'Expert carpentry services including custom cabinetry, deck building, and fine woodworking.', ARRAY['Carpentry Services'], 'Cainta, Rizal', 4.9, 134, 550.00, true, ARRAY['https://images.pexels.com/photos/5691659/pexels-photo-5691659.jpeg']),
('Custom Wood Solutions', 'Professional carpenters specializing in custom furniture, built-ins, and home improvements.', ARRAY['Carpentry Services'], 'Marikina City, Metro Manila', 4.8, 112, 520.00, true, ARRAY['https://images.pexels.com/photos/5691659/pexels-photo-5691659.jpeg']),

-- Car Repair & Maintenance Providers
('AutoCare Philippines', 'Complete automotive services including oil changes, brake repair, engine diagnostics, and general maintenance.', ARRAY['Car Repair & Maintenance'], 'EDSA, Quezon City', 4.8, 267, 450.00, true, ARRAY['https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg']),
('Speedway Auto Services', 'Professional car repair and maintenance. Tire service, battery replacement, and AC repair available.', ARRAY['Car Repair & Maintenance'], 'Shaw Boulevard, Mandaluyong', 4.7, 198, 420.00, true, ARRAY['https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg']),
('Cebu Auto Experts', 'Trusted automotive services in Cebu. Quality repairs and maintenance at competitive prices.', ARRAY['Car Repair & Maintenance'], 'Colon Street, Cebu City', 4.8, 156, 400.00, true, ARRAY['https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg']),

-- Electric Vehicle Services Providers
('EV Tech Philippines', 'Specialized electric vehicle services. Battery diagnostics, charging system repair, and EV maintenance.', ARRAY['Electric Vehicle Services'], 'BGC, Taguig City', 4.9, 89, 800.00, true, ARRAY['https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg']),
('Green Auto Solutions', 'Expert EV services including battery replacement, motor diagnostics, and software updates.', ARRAY['Electric Vehicle Services'], 'Makati CBD, Makati City', 4.8, 67, 750.00, true, ARRAY['https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg']),

-- IT & Tech Support Providers
('TechFix Philippines', 'Professional IT support including computer repair, network setup, and smart home installation.', ARRAY['IT & Tech Support'], 'Ortigas Center, Pasig City', 4.8, 234, 500.00, true, ARRAY['https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg']),
('Digital Solutions PH', 'Expert tech support for homes and businesses. Computer repair, TV mounting, and home theater setup.', ARRAY['IT & Tech Support'], 'Eastwood, Quezon City', 4.9, 189, 550.00, true, ARRAY['https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg']),
('Cebu Tech Support', 'Reliable IT services in Cebu. Computer repair, network troubleshooting, and device setup.', ARRAY['IT & Tech Support'], 'Ayala Center, Cebu City', 4.7, 145, 480.00, true, ARRAY['https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg']),

-- Waste Removal Providers
('Haul-Away Services PH', 'Professional junk removal and debris hauling. Residential and commercial waste removal available.', ARRAY['Waste Removal'], 'Valenzuela City, Metro Manila', 4.7, 156, 350.00, true, ARRAY['https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg']),
('Clean Sweep Removal', 'Efficient waste removal services. Post-renovation cleanup and general junk hauling.', ARRAY['Waste Removal'], 'Caloocan City, Metro Manila', 4.8, 123, 380.00, true, ARRAY['https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg']),

-- Security Services Providers
('SecureLock Philippines', 'Professional locksmith and security services. Lock installation, repair, and emergency lockout service.', ARRAY['Security Services'], 'Makati City, Metro Manila', 4.9, 178, 450.00, true, ARRAY['https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg']),
('Guardian Security Systems', 'Complete security solutions including home security system installation and monitoring setup.', ARRAY['Security Services'], 'Paranaque City, Metro Manila', 4.8, 134, 500.00, true, ARRAY['https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg']),
('Davao Security Pro', 'Trusted security services in Davao. Locksmith services and security system installation.', ARRAY['Security Services'], 'Davao City, Davao del Sur', 4.7, 98, 420.00, true, ARRAY['https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg']);

-- Update availability for all providers (sample schedule)
UPDATE service_providers SET availability = '{
  "monday": {"available": true, "hours": "8:00-17:00"},
  "tuesday": {"available": true, "hours": "8:00-17:00"},
  "wednesday": {"available": true, "hours": "8:00-17:00"},
  "thursday": {"available": true, "hours": "8:00-17:00"},
  "friday": {"available": true, "hours": "8:00-17:00"},
  "saturday": {"available": true, "hours": "9:00-15:00"},
  "sunday": {"available": false, "hours": ""}
}'::jsonb;