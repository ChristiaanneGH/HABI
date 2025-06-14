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
  Platform,
} from 'react-native';
import { X, Calendar, Clock, MapPin, Package, ChevronDown } from 'lucide-react-native';
import { ServiceProvider } from '@/lib/supabaseService';

interface LaundrySubcategory {
  id: string;
  name: string;
  description: string;
  pricing_model: string;
  base_price: number;
  notes: string;
}

interface LaundryBookingModalProps {
  visible: boolean;
  onClose: () => void;
  provider: ServiceProvider;
  onBookingConfirmed: () => void;
}

export default function LaundryBookingModal({
  visible,
  onClose,
  provider,
  onBookingConfirmed,
}: LaundryBookingModalProps) {
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [pickupAddress, setPickupAddress] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [estimatedCost, setEstimatedCost] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  // Mock laundry subcategories - in real app, fetch from database
  const laundryServices: LaundrySubcategory[] = [
    {
      id: '1',
      name: 'Standard Wash & Fold',
      description: 'Wash, dry, fold for everyday clothes',
      pricing_model: 'Flat-Rate (per bag)',
      base_price: 250.00,
      notes: 'Most common recurring service'
    },
    {
      id: '2',
      name: 'Standard Wash & Iron',
      description: 'Clothes are washed, dried, and ironed',
      pricing_model: 'Flat-Rate (per bag) or Per-Piece',
      base_price: 350.00,
      notes: 'Ideal for professionals and families'
    },
    {
      id: '3',
      name: 'Express Wash',
      description: 'Same-day wash & fold service',
      pricing_model: 'Flat-Rate + Add-on',
      base_price: 300.00,
      notes: 'Time-based surcharge'
    },
    {
      id: '4',
      name: 'Express Wash & Iron',
      description: 'Same-day wash + ironing',
      pricing_model: 'Flat-Rate + Add-on',
      base_price: 450.00,
      notes: 'Premium tier with speed + quality'
    },
    {
      id: '5',
      name: 'Delicate Wash',
      description: 'Gentle handling (air-dry, cold cycle)',
      pricing_model: 'Per-Piece',
      base_price: 50.00,
      notes: 'For silks, lace, wool'
    },
    {
      id: '6',
      name: 'Baby Clothes',
      description: 'Uses hypoallergenic detergent',
      pricing_model: 'Flat-Rate or Per-Piece',
      base_price: 200.00,
      notes: 'Family-safe; could be bundled'
    },
    {
      id: '7',
      name: 'Curtain/Bedding Wash',
      description: 'Wash for oversized items',
      pricing_model: 'Per-Kilo',
      base_price: 80.00,
      notes: 'Large items by weight (e.g., duvets, drapes)'
    }
  ];

  const timeSlots = [
    '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM',
    '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'
  ];

  useEffect(() => {
    calculateEstimatedCost();
  }, [selectedServices]);

  const calculateEstimatedCost = () => {
    let total = 0;
    selectedServices.forEach(serviceId => {
      const service = laundryServices.find(s => s.id === serviceId);
      if (service) {
        total += service.base_price;
      }
    });
    setEstimatedCost(total);
  };

  const toggleService = (serviceId: string) => {
    setSelectedServices(prev => 
      prev.includes(serviceId)
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

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
        }),
        fullDate: date
      });
    }
    return dates;
  };

  const formatSelectedDate = () => {
    if (!selectedDate) return 'Select pickup date';
    const date = new Date(selectedDate);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatSelectedTime = () => {
    if (!selectedTime) return 'Select pickup time';
    return selectedTime;
  };

  const handleBooking = async () => {
    if (!selectedServices.length) {
      Alert.alert('Error', 'Please select at least one service');
      return;
    }
    if (!selectedDate) {
      Alert.alert('Error', 'Please select a pickup date');
      return;
    }
    if (!selectedTime) {
      Alert.alert('Error', 'Please select a pickup time');
      return;
    }
    if (!pickupAddress.trim()) {
      Alert.alert('Error', 'Please enter your pickup address');
      return;
    }

    setLoading(true);
    
    try {
      // Simulate booking API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      Alert.alert(
        'Booking Confirmed!',
        `Your laundry service has been booked with ${provider.business_name}. They will contact you shortly to confirm pickup details.`,
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
      Alert.alert('Error', 'Failed to create booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedServices([]);
    setSelectedDate('');
    setSelectedTime('');
    setPickupAddress('');
    setSpecialInstructions('');
    setEstimatedCost(0);
  };

  const handleClose = () => {
    resetForm();
    onClose();
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
          <Text style={styles.headerTitle}>Book Laundry Service</Text>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <X size={24} color="#333" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Provider Info */}
          <View style={styles.providerSection}>
            <Text style={styles.providerName}>{provider.business_name}</Text>
            <Text style={styles.providerLocation}>{provider.location}</Text>
          </View>

          {/* Service Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Select Services</Text>
            {laundryServices.map(service => (
              <TouchableOpacity
                key={service.id}
                style={[
                  styles.serviceItem,
                  selectedServices.includes(service.id) && styles.selectedServiceItem
                ]}
                onPress={() => toggleService(service.id)}
              >
                <View style={styles.serviceInfo}>
                  <Text style={[
                    styles.serviceName,
                    selectedServices.includes(service.id) && styles.selectedServiceText
                  ]}>
                    {service.name}
                  </Text>
                  <Text style={styles.serviceDescription}>{service.description}</Text>
                  <Text style={styles.servicePricing}>{service.pricing_model}</Text>
                  {service.notes && (
                    <Text style={styles.serviceNotes}>{service.notes}</Text>
                  )}
                </View>
                <Text style={[
                  styles.servicePrice,
                  selectedServices.includes(service.id) && styles.selectedServiceText
                ]}>
                  ₱{service.base_price}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Date Selection - Calendar Widget */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Pickup Date</Text>
            <TouchableOpacity
              style={styles.dateTimeSelector}
              onPress={() => setShowDatePicker(!showDatePicker)}
            >
              <Calendar size={20} color="#0041C2" />
              <Text style={[
                styles.dateTimeText,
                !selectedDate && styles.placeholderText
              ]}>
                {formatSelectedDate()}
              </Text>
              <ChevronDown size={20} color="#666" />
            </TouchableOpacity>
            
            {showDatePicker && (
              <View style={styles.datePickerContainer}>
                <ScrollView style={styles.datePickerScroll} showsVerticalScrollIndicator={false}>
                  {getNextWeekDates().map(date => (
                    <TouchableOpacity
                      key={date.value}
                      style={[
                        styles.datePickerItem,
                        selectedDate === date.value && styles.selectedDatePickerItem
                      ]}
                      onPress={() => {
                        setSelectedDate(date.value);
                        setShowDatePicker(false);
                      }}
                    >
                      <View style={styles.datePickerItemContent}>
                        <Text style={[
                          styles.datePickerDay,
                          selectedDate === date.value && styles.selectedDatePickerText
                        ]}>
                          {date.fullDate.toLocaleDateString('en-US', { weekday: 'long' })}
                        </Text>
                        <Text style={[
                          styles.datePickerDate,
                          selectedDate === date.value && styles.selectedDatePickerText
                        ]}>
                          {date.fullDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </Text>
                      </View>
                      {selectedDate === date.value && (
                        <View style={styles.checkmark}>
                          <Text style={styles.checkmarkText}>✓</Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>

          {/* Time Selection - Time Widget */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Pickup Time</Text>
            <TouchableOpacity
              style={styles.dateTimeSelector}
              onPress={() => setShowTimePicker(!showTimePicker)}
            >
              <Clock size={20} color="#0041C2" />
              <Text style={[
                styles.dateTimeText,
                !selectedTime && styles.placeholderText
              ]}>
                {formatSelectedTime()}
              </Text>
              <ChevronDown size={20} color="#666" />
            </TouchableOpacity>
            
            {showTimePicker && (
              <View style={styles.timePickerContainer}>
                <View style={styles.timePickerGrid}>
                  {timeSlots.map(time => (
                    <TouchableOpacity
                      key={time}
                      style={[
                        styles.timePickerItem,
                        selectedTime === time && styles.selectedTimePickerItem
                      ]}
                      onPress={() => {
                        setSelectedTime(time);
                        setShowTimePicker(false);
                      }}
                    >
                      <Clock size={16} color={selectedTime === time ? 'white' : '#666'} />
                      <Text style={[
                        styles.timePickerText,
                        selectedTime === time && styles.selectedTimePickerText
                      ]}>
                        {time}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}
          </View>

          {/* Pickup Address */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Pickup Address</Text>
            <View style={styles.inputContainer}>
              <MapPin size={20} color="#666" />
              <TextInput
                style={styles.textInput}
                placeholder="Enter your complete address"
                value={pickupAddress}
                onChangeText={setPickupAddress}
                multiline
              />
            </View>
          </View>

          {/* Special Instructions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Special Instructions (Optional)</Text>
            <TextInput
              style={styles.textArea}
              placeholder="Any special care instructions, fabric preferences, or notes..."
              value={specialInstructions}
              onChangeText={setSpecialInstructions}
              multiline
              numberOfLines={3}
            />
          </View>

          {/* Cost Summary */}
          <View style={styles.costSection}>
            <View style={styles.costRow}>
              <Text style={styles.costLabel}>Estimated Total:</Text>
              <Text style={styles.costAmount}>₱{estimatedCost.toFixed(2)}</Text>
            </View>
            <Text style={styles.costNote}>
              Final cost may vary based on actual quantity and additional services
            </Text>
          </View>
        </ScrollView>

        {/* Book Button */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[
              styles.bookButton,
              (!selectedServices.length || !selectedDate || !selectedTime || !pickupAddress.trim() || loading) && styles.bookButtonDisabled
            ]}
            onPress={handleBooking}
            disabled={!selectedServices.length || !selectedDate || !selectedTime || !pickupAddress.trim() || loading}
          >
            <Package size={20} color="white" />
            <Text style={styles.bookButtonText}>
              {loading ? 'Booking...' : `Book Now - ₱${estimatedCost.toFixed(2)}`}
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
  },
  providerName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  providerLocation: {
    fontSize: 14,
    color: '#666',
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
  serviceItem: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedServiceItem: {
    borderColor: '#0041C2',
    backgroundColor: '#F0F7FF',
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  selectedServiceText: {
    color: '#0041C2',
  },
  serviceDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  servicePricing: {
    fontSize: 12,
    color: '#0041C2',
    fontWeight: '500',
    marginBottom: 2,
  },
  serviceNotes: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
  },
  servicePrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  
  // Date/Time Selector Styles
  dateTimeSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    gap: 12,
  },
  dateTimeText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  placeholderText: {
    color: '#999',
    fontWeight: '400',
  },
  
  // Date Picker Styles
  datePickerContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginTop: 8,
    maxHeight: 200,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  datePickerScroll: {
    maxHeight: 200,
  },
  datePickerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  selectedDatePickerItem: {
    backgroundColor: '#F0F7FF',
  },
  datePickerItemContent: {
    flex: 1,
  },
  datePickerDay: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  datePickerDate: {
    fontSize: 14,
    color: '#666',
  },
  selectedDatePickerText: {
    color: '#0041C2',
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#0041C2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  
  // Time Picker Styles
  timePickerContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginTop: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  timePickerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  timePickerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 6,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  selectedTimePickerItem: {
    backgroundColor: '#0041C2',
    borderColor: '#0041C2',
  },
  timePickerText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  selectedTimePickerText: {
    color: 'white',
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
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    textAlignVertical: 'top',
  },
  costSection: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
  },
  costRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  costLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  costAmount: {
    fontSize: 20,
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