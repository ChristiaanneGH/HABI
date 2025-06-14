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
  estimated_cost?: number;
  notes?: string;
  urgency_level?: string;
  estimated_duration?: string;
  contact_preference?: string;
  created_at: string;
  updated_at: string;
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
  estimated_cost?: number;
  notes?: string;
  urgency_level?: string;
  estimated_duration?: string;
  contact_preference?: string;
}) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Get the user's profile to use as client_id
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      console.error('Error fetching user profile:', profileError);
      throw new Error('User profile not found');
    }

    // Convert time format from "3:15 PM" to "15:15:00"
    const convertTo24Hour = (time12h: string): string => {
      const [time, modifier] = time12h.split(' ');
      let [hours, minutes] = time.split(':');
      
      if (hours === '12') {
        hours = '00';
      }
      
      if (modifier === 'PM') {
        hours = (parseInt(hours, 10) + 12).toString();
      }
      
      return `${hours.padStart(2, '0')}:${minutes}:00`;
    };

    const formattedTime = convertTo24Hour(bookingData.scheduled_time);

    const { data, error } = await supabase
      .from('bookings')
      .insert({
        client_id: profile.id,
        provider_id: bookingData.provider_id,
        service_category: bookingData.service_category,
        description: bookingData.description,
        location: bookingData.location,
        scheduled_date: bookingData.scheduled_date,
        scheduled_time: formattedTime,
        estimated_cost: bookingData.estimated_cost,
        notes: bookingData.notes,
        status: 'pending'
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

export const createLaundryBooking = async (bookingData: {
  provider_id: string;
  selected_services: string[];
  pickup_date: string;
  pickup_time: string;
  pickup_address: string;
  special_instructions?: string;
  estimated_cost: number;
}) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Get the user's profile to use as client_id
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      console.error('Error fetching user profile:', profileError);
      throw new Error('User profile not found');
    }

    // Convert time format from "3:15 PM" to "15:15:00"
    const convertTo24Hour = (time12h: string): string => {
      const [time, modifier] = time12h.split(' ');
      let [hours, minutes] = time.split(':');
      
      if (hours === '12') {
        hours = '00';
      }
      
      if (modifier === 'PM') {
        hours = (parseInt(hours, 10) + 12).toString();
      }
      
      return `${hours.padStart(2, '0')}:${minutes}:00`;
    };

    const formattedTime = convertTo24Hour(bookingData.pickup_time);

    // Create description from selected services
    const serviceDescription = `Laundry Services: ${bookingData.selected_services.join(', ')}`;
    const fullDescription = bookingData.special_instructions 
      ? `${serviceDescription}\n\nSpecial Instructions: ${bookingData.special_instructions}`
      : serviceDescription;

    const { data, error } = await supabase
      .from('bookings')
      .insert({
        client_id: profile.id,
        provider_id: bookingData.provider_id,
        service_category: 'Laundry Services',
        description: fullDescription,
        location: bookingData.pickup_address,
        scheduled_date: bookingData.pickup_date,
        scheduled_time: formattedTime,
        estimated_cost: bookingData.estimated_cost,
        notes: `Selected Services: ${bookingData.selected_services.join(', ')}`,
        status: 'pending'
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating laundry booking:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (err) {
    console.error('Unexpected error creating laundry booking:', err);
    return { 
      data: null, 
      error: { message: 'Failed to create laundry booking. Please try again.' } 
    };
  }
};

export const getUserBookings = async (): Promise<Booking[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        service_providers!provider_id (
          business_name,
          rating,
          photos
        )
      `)
      .eq('client_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching user bookings:', error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error('Unexpected error fetching user bookings:', err);
    return [];
  }
};

export const updateBookingStatus = async (
  bookingId: string, 
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled'
) => {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', bookingId)
      .select()
      .single();

    if (error) {
      console.error('Error updating booking status:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (err) {
    console.error('Unexpected error updating booking status:', err);
    return { 
      data: null, 
      error: { message: 'Failed to update booking status. Please try again.' } 
    };
  }
};