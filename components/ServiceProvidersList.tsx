import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  Linking,
} from 'react-native';
import ServiceProviderCard from './ServiceProviderCard';

interface ServiceProvider {
  id: string;
  business_name: string;
  description: string;
  rating: number;
  reviews_count: number;
  hourly_rate: number;
  location: string;
  photos: string[];
  verified: boolean;
}

interface ServiceProvidersListProps {
  providers: ServiceProvider[];
  serviceType: string;
}

export default function ServiceProvidersList({
  providers,
  serviceType,
}: ServiceProvidersListProps) {
  const handleCall = (provider: ServiceProvider) => {
    Alert.alert(
      'Call Provider',
      `Would you like to call ${provider.business_name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Call',
          onPress: () => {
            // In a real app, you would have the phone number
            // For demo purposes, we'll show an alert
            Alert.alert('Calling...', `Connecting to ${provider.business_name}`);
          },
        },
      ]
    );
  };

  const handleMessage = (provider: ServiceProvider) => {
    Alert.alert(
      'Message Provider',
      `Start a conversation with ${provider.business_name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Message',
          onPress: () => {
            Alert.alert('Messaging...', `Opening chat with ${provider.business_name}`);
          },
        },
      ]
    );
  };

  const handleBook = (provider: ServiceProvider) => {
    Alert.alert(
      'Book Service',
      `Book ${serviceType} service with ${provider.business_name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Book Now',
          onPress: () => {
            Alert.alert(
              'Booking Confirmed!',
              `Your booking request has been sent to ${provider.business_name}. They will contact you shortly to confirm the details.`
            );
          },
        },
      ]
    );
  };

  if (providers.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          No service providers found for {serviceType} in your area.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Available Service Providers:</Text>
      <ScrollView
        style={styles.providersList}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
      >
        {providers.map((provider) => (
          <ServiceProviderCard
            key={provider.id}
            provider={provider}
            onCall={handleCall}
            onMessage={handleMessage}
            onBook={handleBook}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    maxHeight: 400,
    marginVertical: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  providersList: {
    flex: 1,
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});