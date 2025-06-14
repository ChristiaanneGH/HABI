import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Monitor, Wrench, Zap, Thermometer, Car, Star, MapPin, Shield, Settings, Hammer, Chrome as Home, Sparkles, Bug, Trees, Paintbrush, Square, Construction, Battery, Trash, ChevronRight } from 'lucide-react-native';
import { getServiceCategories, getServiceProvidersByCategory, ServiceProvider, ServiceCategory } from '@/lib/supabaseService';
import LaundryBookingModal from '@/components/LaundryBookingModal';
import GeneralBookingModal from '@/components/GeneralBookingModal';

const { width } = Dimensions.get('window');

interface ServiceCategoryWithIcon extends ServiceCategory {
  iconComponent: React.ComponentType<any>;
  color: string;
}

const iconMap: { [key: string]: { component: React.ComponentType<any>; color: string } } = {
  'IT & Tech Support': { component: Monitor, color: '#4F46E5' },
  'Plumbing Services': { component: Wrench, color: '#059669' },
  'Electrical Services': { component: Zap, color: '#DC2626' },
  'HVAC Services': { component: Thermometer, color: '#7C3AED' },
  'Car Repair & Maintenance': { component: Car, color: '#EA580C' },
  'Electric Vehicle Services': { component: Battery, color: '#10B981' },
  'Appliance Repair': { component: Settings, color: '#0891B2' },
  'General Handyman': { component: Hammer, color: '#8B5CF6' },
  'Roofing & Exterior': { component: Home, color: '#F59E0B' },
  'House Cleaning': { component: Sparkles, color: '#EC4899' },
  'Specialized Cleaning': { component: Sparkles, color: '#06B6D4' },
  'Laundry Services': { component: Sparkles, color: '#84CC16' },
  'Organization Services': { component: Square, color: '#6366F1' },
  'Pest Control': { component: Bug, color: '#EF4444' },
  'Landscaping & Lawn Care': { component: Trees, color: '#22C55E' },
  'Pool Maintenance': { component: Sparkles, color: '#3B82F6' },
  'Painting Services': { component: Paintbrush, color: '#F97316' },
  'Flooring Services': { component: Square, color: '#A855F7' },
  'Remodeling Services': { component: Construction, color: '#14B8A6' },
  'Carpentry Services': { component: Hammer, color: '#92400E' },
  'Waste Removal': { component: Trash, color: '#6B7280' },
  'Security Services': { component: Shield, color: '#1F2937' },
};

export default function ServicesTab() {
  const [categories, setCategories] = useState<ServiceCategoryWithIcon[]>([]);
  const [topProviders, setTopProviders] = useState<ServiceProvider[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [laundryModalVisible, setLaundryModalVisible] = useState(false);
  const [generalModalVisible, setGeneralModalVisible] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<ServiceProvider | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load service categories
      const categoriesData = await getServiceCategories();
      const categoriesWithIcons = categoriesData.map(category => ({
        ...category,
        iconComponent: iconMap[category.name]?.component || Monitor,
        color: iconMap[category.name]?.color || '#6B7280',
      }));
      setCategories(categoriesWithIcons);

      // Load top providers from multiple categories
      const allProviders: ServiceProvider[] = [];
      const categoryNames = ['IT & Tech Support', 'Plumbing Services', 'Electrical Services', 'HVAC Services', 'House Cleaning'];
      
      for (const categoryName of categoryNames) {
        const providers = await getServiceProvidersByCategory(categoryName, 2);
        allProviders.push(...providers);
      }
      
      // Sort by rating and take top 10
      const sortedProviders = allProviders
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 10);
      
      setTopProviders(sortedProviders);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryPress = async (category: ServiceCategoryWithIcon) => {
    setSelectedCategory(category.name);
    try {
      const providers = await getServiceProvidersByCategory(category.name, 10);
      setTopProviders(providers);
    } catch (error) {
      console.error('Error loading category providers:', error);
    }
  };

  const handleBookNow = (provider: ServiceProvider) => {
    setSelectedProvider(provider);
    
    // Check if this is a laundry service provider
    const isLaundryProvider = provider.service_categories.includes('Laundry Services');
    
    if (isLaundryProvider) {
      setLaundryModalVisible(true);
    } else {
      setGeneralModalVisible(true);
    }
  };

  const handleBookingConfirmed = () => {
    // Handle successful booking - could update UI, refresh data, etc.
    console.log('Booking confirmed successfully');
  };

  const closeModals = () => {
    setLaundryModalVisible(false);
    setGeneralModalVisible(false);
    setSelectedProvider(null);
  };

  const renderCategoryTile = (category: ServiceCategoryWithIcon) => {
    const IconComponent = category.iconComponent;
    const isSelected = selectedCategory === category.name;
    
    return (
      <TouchableOpacity
        key={category.id}
        style={[
          styles.categoryTile,
          isSelected && styles.selectedCategoryTile,
        ]}
        onPress={() => handleCategoryPress(category)}
      >
        <LinearGradient
          colors={isSelected ? [category.color, `${category.color}CC`] : ['#F8F9FA', '#F1F3F4']}
          style={styles.categoryIconContainer}
        >
          <IconComponent 
            size={24} 
            color={isSelected ? 'white' : category.color} 
          />
        </LinearGradient>
        <Text style={[
          styles.categoryName,
          isSelected && styles.selectedCategoryName,
        ]} numberOfLines={2}>
          {category.name}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderServiceProvider = (provider: ServiceProvider) => {
    return (
      <TouchableOpacity key={provider.id} style={styles.providerCard}>
        <View style={styles.providerHeader}>
          <Image
            source={{ uri: provider.photos[0] }}
            style={styles.providerImage}
          />
          <View style={styles.providerInfo}>
            <View style={styles.providerNameRow}>
              <Text style={styles.providerName} numberOfLines={1}>
                {provider.business_name}
              </Text>
              {provider.verified && (
                <View style={styles.verifiedBadge}>
                  <Shield size={12} color="white" />
                </View>
              )}
            </View>
            
            <View style={styles.ratingRow}>
              <Star size={14} color="#FFB800" fill="#FFB800" />
              <Text style={styles.rating}>
                {provider.rating} ({provider.reviews_count} reviews)
              </Text>
            </View>
            
            <View style={styles.locationRow}>
              <MapPin size={12} color="#666" />
              <Text style={styles.location} numberOfLines={1}>
                {provider.location}
              </Text>
            </View>
            
            <View style={styles.servicesRow}>
              <Text style={styles.servicesLabel}>Services:</Text>
              <Text style={styles.servicesList} numberOfLines={1}>
                {provider.service_categories.slice(0, 2).join(', ')}
                {provider.service_categories.length > 2 && '...'}
              </Text>
            </View>
          </View>
        </View>

        <Text style={styles.providerDescription} numberOfLines={2}>
          {provider.description}
        </Text>

        <View style={styles.providerFooter}>
          <View style={styles.priceContainer}>
            <Text style={styles.priceLabel}>Starting at</Text>
            <Text style={styles.price}>₱{provider.hourly_rate}/hr</Text>
          </View>
          
          <TouchableOpacity 
            style={styles.bookButton}
            onPress={() => handleBookNow(provider)}
          >
            <Text style={styles.bookButtonText}>Book Now</Text>
            <ChevronRight size={16} color="white" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient
          colors={['#0041C2', '#1E3A8A']}
          style={styles.header}
        >
          <Text style={styles.headerTitle}>Services</Text>
          <Text style={styles.headerSubtitle}>Choose from our trusted professionals</Text>
        </LinearGradient>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading services...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#0041C2', '#1E3A8A']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Services</Text>
        <Text style={styles.headerSubtitle}>Choose from our trusted professionals</Text>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Service Categories Section */}
        <View style={styles.categoriesSection}>
          <Text style={styles.sectionTitle}>Service Categories</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesScrollContainer}
            style={styles.categoriesScroll}
          >
            {categories.map(renderCategoryTile)}
          </ScrollView>
        </View>

        {/* Top Service Providers Section */}
        <View style={styles.providersSection}>
          <Text style={styles.sectionTitle}>
            {selectedCategory ? `${selectedCategory} Providers` : 'Top Service Providers'}
          </Text>
          <Text style={styles.sectionSubtitle}>
            {selectedCategory 
              ? `Specialists in ${selectedCategory.toLowerCase()}`
              : 'Highly rated professionals ready to help'
            }
          </Text>
          
          <View style={styles.providersList}>
            {topProviders.map(renderServiceProvider)}
          </View>
        </View>
      </ScrollView>

      {/* Booking Modals */}
      {selectedProvider && (
        <>
          <LaundryBookingModal
            visible={laundryModalVisible}
            onClose={closeModals}
            provider={selectedProvider}
            onBookingConfirmed={handleBookingConfirmed}
          />
          
          <GeneralBookingModal
            visible={generalModalVisible}
            onClose={closeModals}
            provider={selectedProvider}
            onBookingConfirmed={handleBookingConfirmed}
          />
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 24,
    paddingBottom: 32,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: 'white',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  
  // Categories Section
  categoriesSection: {
    paddingTop: 24,
    paddingBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
    paddingHorizontal: 24,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    paddingHorizontal: 24,
  },
  categoriesScroll: {
    paddingLeft: 24,
  },
  categoriesScrollContainer: {
    paddingRight: 24,
    gap: 16,
  },
  categoryTile: {
    alignItems: 'center',
    width: 100,
  },
  selectedCategoryTile: {
    transform: [{ scale: 1.05 }],
  },
  categoryIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    lineHeight: 16,
  },
  selectedCategoryName: {
    color: '#0041C2',
  },
  
  // Providers Section
  providersSection: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
  },
  providersList: {
    gap: 16,
    marginTop: 16,
  },
  providerCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  providerHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  providerImage: {
    width: 64,
    height: 64,
    borderRadius: 12,
    marginRight: 16,
  },
  providerInfo: {
    flex: 1,
  },
  providerNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  providerName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  verifiedBadge: {
    backgroundColor: '#059669',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  rating: {
    fontSize: 13,
    color: '#333',
    marginLeft: 4,
    fontWeight: '500',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  location: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
    flex: 1,
  },
  servicesRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  servicesLabel: {
    fontSize: 12,
    color: '#666',
    marginRight: 4,
  },
  servicesList: {
    fontSize: 12,
    color: '#0041C2',
    fontWeight: '500',
    flex: 1,
  },
  providerDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 16,
  },
  providerFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceContainer: {
    flex: 1,
  },
  priceLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0041C2',
  },
  bookButton: {
    backgroundColor: '#0041C2',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 4,
  },
  bookButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});