import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  TextInput,
  Alert,
  Image,
} from 'react-native';
import { X, Calendar, Clock, MapPin, FileText, CreditCard, Star, Shield, Phone, MessageCircle } from 'lucide-react-native';
import { ServiceProvider } from '@/lib/supabaseService';

interface GeneralBookingModalProps {
  visible: boolean;
  onClose: () => void;
  provider: ServiceProvider;
  onBookingConfirmed: () => void;
}

export default function GeneralBookingModal({
  visible,
  onClose,
  provider,
  onBookingConfirmed,
}: GeneralBookingModalProps) {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [serviceLocation, setServiceLocation] = useState('');
  const [problemDescription, setProblemDescription] = useState('');
  const [urgencyLevel, setUrgencyLevel] = useState('normal');
  const [estimatedDuration, setEstimatedDuration] = useState('1-2 hours');
  const [contactPreference, setContactPreference] = useState('phone');
  const [loading, setLoading] = useState(false);

  const timeSlots = [
    '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM',
    '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'
  ];

  const urgencyOptions = [
    { value: 'emergency', label: 'Emergency', color: '#DC2626', surcharge: 100 },
    { value: 'urgent', label: 'Urgent (Same Day)', color: '#EA580C', surcharge: 50 },
    { value: 'normal', label: 'Normal', color: '#059669', surcharge: 0 },
    { value: 'flexible', label: 'Flexible', color: '#0891B2', surcharge: -25 }
  ];

  const durationOptions = [
    '30 minutes - 1 hour',
    '1-2 hours',
    '2-4 hours',
    '4-6 hours',
    'Full day (8+ hours)',
    'Multiple days'
  ];

  const getNextWeekDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push({
        value: date.toISOString().split('T')[0],
        label: date.toLocaleDateString('en-US', { 
          weekday: 'short', 
          month: 'short', 
          day: 'numeric' 
        })
      });
    }
    return dates;
  };

  const calculateEstimatedCost = () => {
    const selectedUrgency = urgencyOptions.find(opt => opt.value === urgencyLevel);
    const baseCost = provider.hourly_rate * 2; // Assume 2 hours minimum
    const urgencySurcharge = selectedUrgency?.surcharge || 0;
    return baseCost + urgencySurcharge;
  };

  const getServiceTypeDescription = () => {
    const primaryService = provider.service_categories[0];
    
    const descriptions: { [key: string]: string } = {
      'IT & Tech Support': 'Computer repair, network setup, smart home installation',
      'Plumbing Services': 'Leak repair, drain cleaning, fixture installation',
      'Electrical Services': 'Outlet installation, lighting repair, wiring',
      'HVAC Services': 'AC repair/installation, heating system maintenance',
      'Car Repair & Maintenance': 'Engine diagnostics, brake repair, maintenance',
      'House Cleaning': 'Deep cleaning, regular maintenance, sanitization',
      'Painting Services': 'Interior/exterior painting, color consultation',
      'General Handyman': 'Home repairs, furniture assembly, maintenance',
      'Appliance Repair': 'Washing machine, refrigerator, oven repair',
      'Roofing & Exterior': 'Roof repair, gutter cleaning, exterior maintenance',
      'Pest Control': 'Insect treatment, rodent control, prevention',
      'Landscaping & Lawn Care': 'Garden maintenance, lawn care, tree service',
      'Security Services': 'Lock installation, security system setup'
    };

    return descriptions[primaryService] || 'Professional service';
  };

  const handleBooking = async () => {
    if (!selectedDate) {
      Alert.alert('Error', 'Please select a service date');
      return;
    }
    if (!selectedTime) {
      Alert.alert('Error', 'Please select a preferred time');
      return;
    }
    if (!serviceLocation.trim()) {
      Alert.alert('Error', 'Please enter the service location');
      return;
    }
    if (!problemDescription.trim()) {
      Alert.alert('Error', 'Please describe the service needed');
      return;
    }

    setLoading(true);
    
    try {
      // Simulate booking API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const estimatedCost = calculateEstimatedCost();
      
      Alert.alert(
        'Booking Request Sent!',
        `Your service request has been sent to ${provider.business_name}. They will contact you within 30 minutes to confirm details and provide a final quote.\n\nEstimated Cost: ₱${estimatedCost}`,
        [
          {
            text: 'OK',
            onPress: () => {
              onBookingConfirmed();
              onClose();
            }
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to send booking request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedDate('');
    setSelectedTime('');
    setServiceLocation('');
    setProblemDescription('');
    setUrgencyLevel('normal');
    setEstimatedDuration('1-2 hours');
    setContactPreference('phone');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleContactProvider = (method: 'phone' | 'message') => {
    if (method === 'phone') {
      Alert.alert('Call Provider', `Would you like to call ${provider.business_name}?`);
    } else {
      Alert.alert('Message Provider', `Start a conversation with ${provider.business_name}?`);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Book Service</Text>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <X size={24} color="#333" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Provider Info */}
          <View style={styles.providerSection}>
            <View style={styles.providerHeader}>
              <Image
                source={{ uri: provider.photos[0] }}
                style={styles.providerImage}
              />
              <View style={styles.providerInfo}>
                <View style={styles.providerNameRow}>
                  <Text style={styles.providerName}>{provider.business_name}</Text>
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
                <Text style={styles.providerLocation}>{provider.location}</Text>
                <Text style={styles.serviceDescription}>{getServiceTypeDescription()}</Text>
              </View>
            </View>
            
            <View style={styles.contactButtons}>
              <TouchableOpacity 
                style={styles.contactButton}
                onPress={() => handleContactProvider('phone')}
              >
                <Phone size={16} color="#059669" />
                <Text style={[styles.contactButtonText, { color: '#059669' }]}>Call</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.contactButton}
                onPress={() => handleContactProvider('message')}
              >
                <MessageCircle size={16} color="#0041C2" />
                <Text style={[styles.contactButtonText, { color: '#0041C2' }]}>Message</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Service Details */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Service Details</Text>
            <View style={styles.inputContainer}>
              <FileText size={20} color="#666" />
              <TextInput
                style={styles.textArea}
                placeholder="Describe the problem or service needed in detail..."
                value={problemDescription}
                onChangeText={setProblemDescription}
                multiline
                numberOfLines={4}
              />
            </View>
          </View>

          {/* Service Location */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Service Location</Text>
            <View style={styles.inputContainer}>
              <MapPin size={20} color="#666" />
              <TextInput
                style={styles.textInput}
                placeholder="Enter complete address where service is needed"
                value={serviceLocation}
                onChangeText={setServiceLocation}
                multiline
              />
            </View>
          </View>

          {/* Date Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Preferred Date</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.dateContainer}>
                {getNextWeekDates().map(date => (
                  <TouchableOpacity
                    key={date.value}
                    style={[
                      styles.dateButton,
                      selectedDate === date.value && styles.selectedDateButton
                    ]}
                    onPress={() => setSelectedDate(date.value)}
                  >
                    <Calendar size={16} color={selectedDate === date.value ? 'white' : '#666'} />
                    <Text style={[
                      styles.dateText,
                      selectedDate === date.value && styles.selectedDateText
                    ]}>
                      {date.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          {/* Time Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Preferred Time</Text>
            <View style={styles.timeGrid}>
              {timeSlots.map(time => (
                <TouchableOpacity
                  key={time}
                  style={[
                    styles.timeButton,
                    selectedTime === time && styles.selectedTimeButton
                  ]}
                  onPress={() => setSelectedTime(time)}
                >
                  <Clock size={14} color={selectedTime === time ? 'white' : '#666'} />
                  <Text style={[
                    styles.timeText,
                    selectedTime === time && styles.selectedTimeText
                  ]}>
                    {time}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Urgency Level */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Urgency Level</Text>
            <View style={styles.urgencyContainer}>
              {urgencyOptions.map(option => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.urgencyButton,
                    urgencyLevel === option.value && styles.selectedUrgencyButton,
                    { borderColor: option.color }
                  ]}
                  onPress={() => setUrgencyLevel(option.value)}
                >
                  <Text style={[
                    styles.urgencyLabel,
                    urgencyLevel === option.value && { color: option.color }
                  ]}>
                    {option.label}
                  </Text>
                  {option.surcharge !== 0 && (
                    <Text style={[
                      styles.urgencySurcharge,
                      { color: option.surcharge > 0 ? '#DC2626' : '#059669' }
                    ]}>
                      {option.surcharge > 0 ? '+' : ''}₱{option.surcharge}
                    </Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Estimated Duration */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Estimated Duration</Text>
            <View style={styles.durationContainer}>
              {durationOptions.map(duration => (
                <TouchableOpacity
                  key={duration}
                  style={[
                    styles.durationButton,
                    estimatedDuration === duration && styles.selectedDurationButton
                  ]}
                  onPress={() => setEstimatedDuration(duration)}
                >
                  <Text style={[
                    styles.durationText,
                    estimatedDuration === duration && styles.selectedDurationText
                  ]}>
                    {duration}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Cost Estimate */}
          <View style={styles.costSection}>
            <View style={styles.costHeader}>
              <CreditCard size={20} color="#0041C2" />
              <Text style={styles.costTitle}>Cost Estimate</Text>
            </View>
            <View style={styles.costBreakdown}>
              <View style={styles.costRow}>
                <Text style={styles.costLabel}>Base Rate (₱{provider.hourly_rate}/hr):</Text>
                <Text style={styles.costAmount}>₱{provider.hourly_rate * 2}</Text>
              </View>
              {urgencyLevel !== 'normal' && (
                <View style={styles.costRow}>
                  <Text style={styles.costLabel}>Urgency Surcharge:</Text>
                  <Text style={[
                    styles.costAmount,
                    { color: urgencyOptions.find(opt => opt.value === urgencyLevel)?.surcharge! > 0 ? '#DC2626' : '#059669' }
                  ]}>
                    {urgencyOptions.find(opt => opt.value === urgencyLevel)?.surcharge! > 0 ? '+' : ''}₱{urgencyOptions.find(opt => opt.value === urgencyLevel)?.surcharge}
                  </Text>
                </View>
              )}
              <View style={[styles.costRow, styles.totalRow]}>
                <Text style={styles.totalLabel}>Estimated Total:</Text>
                <Text style={styles.totalAmount}>₱{calculateEstimatedCost()}</Text>
              </View>
            </View>
            <Text style={styles.costNote}>
              * Final cost will be confirmed by the provider based on actual work required
            </Text>
          </View>
        </ScrollView>

        {/* Book Button */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[
              styles.bookButton,
              (!selectedDate || !selectedTime || !serviceLocation.trim() || !problemDescription.trim() || loading) && styles.bookButtonDisabled
            ]}
            onPress={handleBooking}
            disabled={!selectedDate || !selectedTime || !serviceLocation.trim() || !problemDescription.trim() || loading}
          >
            <Calendar size={20} color="white" />
            <Text style={styles.bookButtonText}>
              {loading ? 'Sending Request...' : 'Send Booking Request'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  closeButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  providerSection: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    marginVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  providerHeader: {
    flexDirection: 'row',
    marginBottom: 16,
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
  providerLocation: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  serviceDescription: {
    fontSize: 13,
    color: '#0041C2',
    fontWeight: '500',
  },
  contactButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  contactButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
    gap: 6,
  },
  contactButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    minHeight: 40,
  },
  textArea: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    minHeight: 80,
    textAlignVertical: 'top',
  },
  dateContainer: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 8,
  },
  dateButton: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  selectedDateButton: {
    backgroundColor: '#0041C2',
    borderColor: '#0041C2',
  },
  dateText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  selectedDateText: {
    color: 'white',
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  timeButton: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  selectedTimeButton: {
    backgroundColor: '#0041C2',
    borderColor: '#0041C2',
  },
  timeText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  selectedTimeText: {
    color: 'white',
  },
  urgencyContainer: {
    gap: 12,
  },
  urgencyButton: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectedUrgencyButton: {
    backgroundColor: '#f8f9fa',
  },
  urgencyLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  urgencySurcharge: {
    fontSize: 14,
    fontWeight: '600',
  },
  durationContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  durationButton: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  selectedDurationButton: {
    backgroundColor: '#0041C2',
    borderColor: '#0041C2',
  },
  durationText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  selectedDurationText: {
    color: 'white',
  },
  costSection: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  costHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  costTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  costBreakdown: {
    gap: 8,
    marginBottom: 12,
  },
  costRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  costLabel: {
    fontSize: 14,
    color: '#666',
  },
  costAmount: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 8,
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0041C2',
  },
  costNote: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  footer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  bookButton: {
    backgroundColor: '#0041C2',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  bookButtonDisabled: {
    backgroundColor: '#ccc',
  },
  bookButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});