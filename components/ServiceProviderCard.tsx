import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { Star, MapPin, Phone, MessageCircle } from 'lucide-react-native';

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

interface ServiceProviderCardProps {
  provider: ServiceProvider;
  onCall: (provider: ServiceProvider) => void;
  onMessage: (provider: ServiceProvider) => void;
  onBook: (provider: ServiceProvider) => void;
}

export default function ServiceProviderCard({
  provider,
  onCall,
  onMessage,
  onBook,
}: ServiceProviderCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Image
          source={{ uri: provider.photos[0] }}
          style={styles.providerImage}
        />
        <View style={styles.providerInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.businessName} numberOfLines={1}>
              {provider.business_name}
            </Text>
            {provider.verified && (
              <View style={styles.verifiedBadge}>
                <Text style={styles.verifiedText}>✓</Text>
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
          <Text style={styles.hourlyRate}>
            ₱{provider.hourly_rate}/hr
          </Text>
        </View>
      </View>

      <Text style={styles.description} numberOfLines={2}>
        {provider.description}
      </Text>

      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.actionButton, styles.callButton]}
          onPress={() => onCall(provider)}
        >
          <Phone size={16} color="#059669" />
          <Text style={[styles.actionButtonText, { color: '#059669' }]}>
            Call
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.messageButton]}
          onPress={() => onMessage(provider)}
        >
          <MessageCircle size={16} color="#0041C2" />
          <Text style={[styles.actionButtonText, { color: '#0041C2' }]}>
            Message
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.bookButton]}
          onPress={() => onBook(provider)}
        >
          <Text style={styles.bookButtonText}>Book Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  providerImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  providerInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  businessName: {
    fontSize: 16,
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
  verifiedText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
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
  hourlyRate: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0041C2',
  },
  description: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
    marginBottom: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    gap: 4,
  },
  callButton: {
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  messageButton: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  bookButton: {
    backgroundColor: '#0041C2',
  },
  actionButtonText: {
    fontSize: 13,
    fontWeight: '500',
  },
  bookButtonText: {
    color: 'white',
    fontSize: 13,
    fontWeight: '600',
  },
});