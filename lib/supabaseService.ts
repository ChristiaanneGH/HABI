import { supabase } from './supabase';

export interface ServiceProvider {
  id: string;
  business_name: string;
  description: string;
  rating: number;
  reviews_count: number;
  hourly_rate: number;
  location: string;
  photos: string[];
  verified: boolean;
  service_categories: string[];
}

export interface ServiceCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export const getServiceCategories = async (): Promise<ServiceCategory[]> => {
  try {
    const { data, error } = await supabase
      .from('service_categories')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching service categories:', error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error('Unexpected error fetching service categories:', err);
    return [];
  }
};

export const getServiceProvidersByCategory = async (
  categoryName: string,
  limit: number = 10
): Promise<ServiceProvider[]> => {
  try {
    const { data, error } = await supabase
      .from('service_providers')
      .select('*')
      .contains('service_categories', [categoryName])
      .eq('verified', true)
      .order('rating', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching service providers:', error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error('Unexpected error fetching service providers:', err);
    return [];
  }
};

export const searchServiceProviders = async (
  searchTerm: string,
  location?: string
): Promise<ServiceProvider[]> => {
  try {
    let query = supabase
      .from('service_providers')
      .select('*')
      .eq('verified', true);

    // Search in business name, description, and service categories
    if (searchTerm) {
      query = query.or(
        `business_name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,service_categories.cs.{${searchTerm}}`
      );
    }

    // Filter by location if provided
    if (location) {
      query = query.ilike('location', `%${location}%`);
    }

    const { data, error } = await query
      .order('rating', { ascending: false })
      .limit(20);

    if (error) {
      console.error('Error searching service providers:', error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error('Unexpected error searching service providers:', err);
    return [];
  }
};

export const createBooking = async (bookingData: {
  provider_id: string;
  service_category: string;
  description: string;
  location: string;
  scheduled_date: string;
  scheduled_time: string;
}) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('bookings')
      .insert({
        client_id: user.id,
        ...bookingData,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating booking:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (err) {
    console.error('Unexpected error creating booking:', err);
    return { 
      data: null, 
      error: { message: 'Failed to create booking. Please try again.' } 
    };
  }
};