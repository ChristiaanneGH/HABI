export interface User {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  address?: string;
  user_type: 'client' | 'service_provider';
  created_at: string;
  updated_at: string;
}

export interface ServiceCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  created_at: string;
}

export interface ServiceProvider {
  id: string;
  user_id: string;
  business_name: string;
  description: string;
  service_categories: string[];
  location: string;
  rating: number;
  reviews_count: number;
  hourly_rate: number;
  availability: any;
  photos: string[];
  verified: boolean;
  created_at: string;
}

export interface Booking {
  id: string;
  client_id: string;
  provider_id: string;
  service_category: string;
  description: string;
  location: string;
  scheduled_date: string;
  scheduled_time: string;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  photos: string[];
  videos: string[];
  estimated_cost: number;
  final_cost?: number;
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: string;
  booking_id: string;
  client_id: string;
  provider_id: string;
  rating: number;
  comment: string;
  created_at: string;
}

export interface ChatMessage {
  id: string;
  user_id: string;
  message: string;
  is_ai_response: boolean;
  metadata?: any;
  created_at: string;
}