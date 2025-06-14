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
  Dimensions,
} from 'react-native';
import { X, Calendar, Clock, MapPin, FileText, CreditCard, Star, Shield, Phone, MessageCircle, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react-native';
import { ServiceProvider, createBooking } from '@/lib/supabaseService';

const { width } = Dimensions.get('window');

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
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());

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

  // Calendar functions
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const formatSelectedDate = () => {
    if (!selectedDate) return 'Select service date';
    const date = new Date(selectedDate);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatSelectedTime = () => {
    if (!selectedTime) return 'Select preferred time';
    return selectedTime;
  };

  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days = [];
    const today = new Date();
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const dateString = date.toISOString().split('T')[0];
      const isToday = date.toDateString() === today.toDateString();
      const isPast = date < today && !isToday;
      const isSelected = selectedDate === dateString;
      
      days.push({
        day,
        date: dateString,
        isToday,
        isPast,
        isSelected,
        disabled: isPast
      });
    }
    
    return days;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newMonth = new Date(currentMonth);
    if (direction === 'prev') {
      newMonth.setMonth(currentMonth.getMonth() - 1);
    } else {
      newMonth.setMonth(currentMonth.getMonth() + 1);
    }
    setCurrentMonth(newMonth);
  };

  // Time picker functions
  const generateTimeSlots = () => {
    const times = [];
    for (let hour = 8; hour <= 17; hour++) {
      const time12 = hour > 12 ? hour - 12 : hour;
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const timeString = `${time12}:00 ${ampm}`;
      times.push(timeString);
    }
    return times;
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
      const estimatedCost = calculateEstimatedCost();
      const primaryServiceCategory = provider.service_categories[0];
      
      // Create booking notes with additional details
      const bookingNotes = [
        `Urgency Level: ${urgencyLevel}`,
        `Estimated Duration: ${estimatedDuration}`,
        `Contact Preference: ${contactPreference}`,
        urgencyLevel !== 'normal' ? `Urgency Surcharge: ₱${urgencyOptions.find(opt => opt.value === urgencyLevel)?.surcharge}` : null
      ].filter(Boolean).join('\n');

      const { data, error } = await createBooking({
        provider_id: provider.id,
        service_category: primaryServiceCategory,
        description: problemDescription,
        location: serviceLocation,
        scheduled_date: selectedDate,
        scheduled_time: selectedTime,
        estimated_cost: estimatedCost,
        notes: bookingNotes,
        urgency_level: urgencyLevel,
        estimated_duration: estimatedDuration,
        contact_preference: contactPreference
      });

      if (error) {
        Alert.alert('Error', error.message || 'Failed to create booking. Please try again.');
        return;
      }

      Alert.alert(
        'Booking Request Sent!',
        `Your service request has been sent to ${provider.business_name}. They will contact you within 30 minutes to confirm details and provide a final quote.\n\nEstimated Cost: ₱${estimatedCost}\nBooking ID: ${data?.id?.slice(0, 8)}...`,
        [
          {
            text: 'OK',
            onPress: () => {
              onBookingConfirmed();
              handleClose();
            }
          }
        ]
      );
    } catch (error) {
      console.error('Booking error:', error);
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
    setCurrentMonth(new Date());
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

  const renderCalendarModal = () => (
    <Modal
      visible={showDatePicker}
      transparent
      animationType="fade"
      onRequestClose={() => setShowDatePicker(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.calendarModal}>
          <View style={styles.calendarHeader}>
            <Text style={styles.calendarYear}>{currentMonth.getFullYear()}</Text>
            <Text style={styles.calendarMonthDay}>
              {formatSelectedDate() !== 'Select service date' ? formatSelectedDate() : formatMonthYear(currentMonth)}
            </Text>
          </View>
          
          <View style={styles.calendarContent}>
            <View style={styles.calendarNavigation}>
              <TouchableOpacity onPress={() => navigateMonth('prev')} style={styles.navButton}>
                <ChevronLeft size={20} color="#333" />
              </TouchableOpacity>
              <Text style={styles.monthYearText}>{formatMonthYear(currentMonth)}</Text>
              <TouchableOpacity onPress={() => navigateMonth('next')} style={styles.navButton}>
                <ChevronRight size={20} color="#333" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.weekDaysHeader}>
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
                <Text key={index} style={styles.weekDayText}>{day}</Text>
              ))}
            </View>
            
            <View style={styles.calendarGrid}>
              {generateCalendarDays().map((dayData, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.calendarDay,
                    dayData?.isSelected && styles.selectedCalendarDay,
                    dayData?.disabled && styles.disabledCalendarDay
                  ]}
                  onPress={() => {
                    if (dayData && !dayData.disabled) {
                      setSelectedDate(dayData.date);
                    }
                  }}
                  disabled={!dayData || dayData.disabled}
                >
                  {dayData && (
                    <Text style={[
                      styles.calendarDayText,
                      dayData.isSelected && styles.selectedCalendarDayText,
                      dayData.disabled && styles.disabledCalendarDayText
                    ]}>
                      {dayData.day}
                    </Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          <View style={styles.calendarActions}>
            <TouchableOpacity 
              style={styles.calendarCancelButton}
              onPress={() => setShowDatePicker(false)}
            >
              <Text style={styles.calendarCancelText}>CANCEL</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.calendarOkButton}
              onPress={() => setShowDatePicker(false)}
            >
              <Text style={styles.calendarOkText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  const renderTimePickerModal = () => (
    <Modal
      visible={showTimePicker}
      transparent
      animationType="fade"
      onRequestClose={() => setShowTimePicker(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.timePickerModal}>
          <View style={styles.timePickerHeader}>
            <Text style={styles.timePickerTitle}>
              {selectedTime || '3:15'}
            </Text>
            <View style={styles.amPmToggle}>
              <Text style={styles.amPmText}>AM</Text>
              <Text style={styles.amPmText}>PM</Text>
            </View>
          </View>
          
          <View style={styles.clockContainer}>
            <View style={styles.clockFace}>
              {/* Clock numbers */}
              {[12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((hour, index) => {
                const angle = (index * 30) - 90; // Start from 12 o'clock
                const radian = (angle * Math.PI) / 180;
                const radius = 80;
                const x = Math.cos(radian) * radius;
                const y = Math.sin(radian) * radius;
                
                return (
                  <TouchableOpacity
                    key={hour}
                    style={[
                      styles.clockNumber,
                      {
                        transform: [
                          { translateX: x },
                          { translateY: y }
                        ]
                      },
                      hour === 3 && styles.selectedClockNumber
                    ]}
                    onPress={() => {
                      const time12 = hour;
                      const ampm = 'PM'; // Default to PM for demo
                      const timeString = `${time12}:15 ${ampm}`;
                      setSelectedTime(timeString);
                    }}
                  >
                    <Text style={[
                      styles.clockNumberText,
                      hour === 3 && styles.selectedClockNumberText
                    ]}>
                      {hour}
                    </Text>
                  </TouchableOpacity>
                );
              })}
              
              {/* Clock hand */}
              <View style={styles.clockCenter} />
              <View style={[
                styles.clockHand,
                {
                  transform: [
                    { rotate: '0deg' } // Points to 3
                  ]
                }
              ]} />
            </View>
          </View>
          
          <View style={styles.timePickerActions}>
            <TouchableOpacity 
              style={styles.timePickerCancelButton}
              onPress={() => setShowTimePicker(false)}
            >
              <Text style={styles.timePickerCancelText}>CANCEL</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.timePickerOkButton}
              onPress={() => setShowTimePicker(false)}
            >
              <Text style={styles.timePickerOkText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

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
            <TouchableOpacity
              style={styles.dateTimeSelector}
              onPress={() => setShowDatePicker(true)}
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
          </View>

          {/* Time Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Preferred Time</Text>
            <TouchableOpacity
              style={styles.dateTimeSelector}
              onPress={() => setShowTimePicker(true)}
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

        {/* Calendar Modal */}
        {renderCalendarModal()}

        {/* Time Picker Modal */}
        {renderTimePickerModal()}
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
  
  // Modal Overlay
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Calendar Modal Styles
  calendarModal: {
    backgroundColor: 'white',
    borderRadius: 8,
    width: width * 0.85,
    maxWidth: 320,
    overflow: 'hidden',
  },
  calendarHeader: {
    backgroundColor: '#4CAF50',
    padding: 20,
  },
  calendarYear: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
    marginBottom: 4,
  },
  calendarMonthDay: {
    color: 'white',
    fontSize: 24,
    fontWeight: '500',
  },
  calendarContent: {
    padding: 16,
  },
  calendarNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  navButton: {
    padding: 8,
  },
  monthYearText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  weekDaysHeader: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 8,
  },
  weekDayText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
    width: 32,
    textAlign: 'center',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  calendarDay: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  selectedCalendarDay: {
    backgroundColor: '#4CAF50',
  },
  disabledCalendarDay: {
    opacity: 0.3,
  },
  calendarDayText: {
    fontSize: 14,
    color: '#333',
  },
  selectedCalendarDayText: {
    color: 'white',
    fontWeight: '600',
  },
  disabledCalendarDayText: {
    color: '#ccc',
  },
  calendarActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 16,
    gap: 16,
  },
  calendarCancelButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  calendarCancelText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '600',
  },
  calendarOkButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  calendarOkText: {
    color: '#4CAF50',
    fontSize: 14,
    fontWeight: '600',
  },
  
  // Time Picker Modal Styles
  timePickerModal: {
    backgroundColor: 'white',
    borderRadius: 8,
    width: width * 0.85,
    maxWidth: 320,
    overflow: 'hidden',
  },
  timePickerHeader: {
    backgroundColor: '#4CAF50',
    padding: 20,
    alignItems: 'center',
  },
  timePickerTitle: {
    color: 'white',
    fontSize: 48,
    fontWeight: '300',
    marginBottom: 8,
  },
  amPmToggle: {
    flexDirection: 'row',
    gap: 16,
  },
  amPmText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
  },
  clockContainer: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clockFace: {
    width: 200,
    height: 200,
    borderRadius: 100,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  clockNumber: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedClockNumber: {
    backgroundColor: '#4CAF50',
  },
  clockNumberText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  selectedClockNumberText: {
    color: 'white',
  },
  clockCenter: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
    position: 'absolute',
  },
  clockHand: {
    position: 'absolute',
    width: 2,
    height: 80,
    backgroundColor: '#4CAF50',
    transformOrigin: 'bottom center',
    top: 60,
  },
  timePickerActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 16,
    gap: 16,
  },
  timePickerCancelButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  timePickerCancelText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '600',
  },
  timePickerOkButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  timePickerOkText: {
    color: '#4CAF50',
    fontSize: 14,
    fontWeight: '600',
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