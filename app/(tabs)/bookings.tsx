import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Calendar, Clock, MapPin, Star, MessageCircle, Phone, CircleCheck as CheckCircle, Circle as XCircle, CircleAlert as AlertCircle } from 'lucide-react-native';

interface Booking {
  id: string;
  serviceName: string;
  providerName: string;
  date: string;
  time: string;
  location: string;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  estimatedCost: number;
  providerRating: number;
  description: string;
}

const mockBookings: Booking[] = [
  {
    id: '1',
    serviceName: 'Computer Repair',
    providerName: 'TechFix Solutions',
    date: '2025-01-15',
    time: '2:00 PM',
    location: '123 Main St, Your City',
    status: 'confirmed',
    estimatedCost: 150,
    providerRating: 4.9,
    description: 'Laptop screen replacement and system optimization',
  },
  {
    id: '2',
    serviceName: 'Plumbing',
    providerName: 'Quick Plumb Pro',
    date: '2025-01-12',
    time: '10:00 AM',
    location: '456 Oak Ave, Your City',
    status: 'completed',
    estimatedCost: 280,
    providerRating: 4.7,
    description: 'Kitchen sink leak repair and faucet replacement',
  },
  {
    id: '3',
    serviceName: 'Electrical',
    providerName: 'Bright Electric Co.',
    date: '2025-01-18',
    time: '9:00 AM',
    location: '789 Pine St, Your City',
    status: 'pending',
    estimatedCost: 320,
    providerRating: 4.8,
    description: 'Install new outlets and ceiling fan in living room',
  },
];

export default function BookingsTab() {
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle size={20} color="#059669" />;
      case 'completed':
        return <CheckCircle size={20} color="#0891B2" />;
      case 'pending':
        return <AlertCircle size={20} color="#D97706" />;
      case 'cancelled':
        return <XCircle size={20} color="#DC2626" />;
      default:
        return <Clock size={20} color="#6B7280" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return '#059669';
      case 'completed':
        return '#0891B2';
      case 'pending':
        return '#D97706';
      case 'cancelled':
        return '#DC2626';
      default:
        return '#6B7280';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const filteredBookings = mockBookings.filter(booking => {
    if (activeFilter === 'all') return true;
    return booking.status === activeFilter;
  });

  const filters = [
    { key: 'all', label: 'All' },
    { key: 'pending', label: 'Pending' },
    { key: 'confirmed', label: 'Confirmed' },
    { key: 'completed', label: 'Completed' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#0041C2', '#1E3A8A']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>My Bookings</Text>
        <Text style={styles.headerSubtitle}>Track your service requests</Text>
      </LinearGradient>

      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.filterList}>
            {filters.map((filter) => (
              <TouchableOpacity
                key={filter.key}
                style={[
                  styles.filterButton,
                  activeFilter === filter.key && styles.activeFilterButton,
                ]}
                onPress={() => setActiveFilter(filter.key)}
              >
                <Text
                  style={[
                    styles.filterText,
                    activeFilter === filter.key && styles.activeFilterText,
                  ]}
                >
                  {filter.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {filteredBookings.length === 0 ? (
          <View style={styles.emptyState}>
            <Calendar size={64} color="#ccc" />
            <Text style={styles.emptyTitle}>No bookings found</Text>
            <Text style={styles.emptySubtitle}>
              {activeFilter === 'all'
                ? "You haven't made any bookings yet"
                : `No ${activeFilter} bookings at the moment`}
            </Text>
          </View>
        ) : (
          <View style={styles.bookingsList}>
            {filteredBookings.map((booking) => (
              <TouchableOpacity key={booking.id} style={styles.bookingCard}>
                <View style={styles.bookingHeader}>
                  <View style={styles.serviceInfo}>
                    <Text style={styles.serviceName}>{booking.serviceName}</Text>
                    <Text style={styles.providerName}>{booking.providerName}</Text>
                  </View>
                  <View style={styles.statusContainer}>
                    {getStatusIcon(booking.status)}
                    <Text
                      style={[
                        styles.statusText,
                        { color: getStatusColor(booking.status) },
                      ]}
                    >
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </Text>
                  </View>
                </View>

                <Text style={styles.description}>{booking.description}</Text>

                <View style={styles.bookingDetails}>
                  <View style={styles.detailRow}>
                    <Calendar size={16} color="#666" />
                    <Text style={styles.detailText}>
                      {formatDate(booking.date)} at {booking.time}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <MapPin size={16} color="#666" />
                    <Text style={styles.detailText}>{booking.location}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Star size={16} color="#FFB800" />
                    <Text style={styles.detailText}>
                      {booking.providerRating} rating • ${booking.estimatedCost} estimated
                    </Text>
                  </View>
                </View>

                {booking.status === 'confirmed' && (
                  <View style={styles.actionButtons}>
                    <TouchableOpacity style={styles.actionButton}>
                      <MessageCircle size={18} color="#0041C2" />
                      <Text style={styles.actionButtonText}>Message</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionButton}>
                      <Phone size={18} color="#0041C2" />
                      <Text style={styles.actionButtonText}>Call</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
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
  filterContainer: {
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  filterList: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingVertical: 16,
    gap: 12,
  },
  filterButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  activeFilterButton: {
    backgroundColor: '#0041C2',
    borderColor: '#0041C2',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  activeFilterText: {
    color: 'white',
  },
  content: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 100,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  bookingsList: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    gap: 16,
  },
  bookingCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  providerName: {
    fontSize: 14,
    color: '#666',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    lineHeight: 20,
  },
  bookingDetails: {
    gap: 8,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
    gap: 8,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#0041C2',
  },
});