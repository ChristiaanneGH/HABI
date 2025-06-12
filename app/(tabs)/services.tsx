import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Monitor,
  Wrench,
  Zap,
  Thermometer,
  Car,
  Star,
  Clock,
  ArrowRight,
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface ServiceCategory {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  avgRating: number;
  avgResponse: string;
  professionals: number;
}

const serviceCategories: ServiceCategory[] = [
  {
    id: '1',
    name: 'Computer Repair',
    description: 'PC, laptop, virus removal, data recovery',
    icon: Monitor,
    color: '#4F46E5',
    avgRating: 4.8,
    avgResponse: '30 min',
    professionals: 127,
  },
  {
    id: '2',
    name: 'Plumbing',
    description: 'Leaks, installations, drain cleaning',
    icon: Wrench,
    color: '#059669',
    avgRating: 4.7,
    avgResponse: '45 min',
    professionals: 89,
  },
  {
    id: '3',
    name: 'Electrical',
    description: 'Wiring, outlets, lighting, safety',
    icon: Zap,
    color: '#DC2626',
    avgRating: 4.9,
    avgResponse: '25 min',
    professionals: 63,
  },
  {
    id: '4',
    name: 'HVAC',
    description: 'Heating, cooling, ventilation',
    icon: Thermometer,
    color: '#7C3AED',
    avgRating: 4.6,
    avgResponse: '1 hour',
    professionals: 45,
  },
  {
    id: '5',
    name: 'Auto Repair',
    description: 'Engine, brakes, maintenance',
    icon: Car,
    color: '#EA580C',
    avgRating: 4.8,
    avgResponse: '2 hours',
    professionals: 78,
  },
];

export default function ServicesTab() {
  const renderServiceCard = (service: ServiceCategory) => {
    const IconComponent = service.icon;
    
    return (
      <TouchableOpacity key={service.id} style={styles.serviceCard}>
        <LinearGradient
          colors={[service.color, `${service.color}CC`]}
          style={styles.serviceIconContainer}
        >
          <IconComponent size={32} color="white" />
        </LinearGradient>
        
        <View style={styles.serviceContent}>
          <Text style={styles.serviceName}>{service.name}</Text>
          <Text style={styles.serviceDescription}>{service.description}</Text>
          
          <View style={styles.serviceStats}>
            <View style={styles.statItem}>
              <Star size={14} color="#FFB800" />
              <Text style={styles.statText}>{service.avgRating}</Text>
            </View>
            <View style={styles.statItem}>
              <Clock size={14} color="#666" />
              <Text style={styles.statText}>{service.avgResponse}</Text>
            </View>
            <Text style={styles.professionalCount}>
              {service.professionals} professionals
            </Text>
          </View>
        </View>
        
        <ArrowRight size={20} color="#0041C2" />
      </TouchableOpacity>
    );
  };

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
        <View style={styles.categorySection}>
          <Text style={styles.sectionTitle}>Service Categories</Text>
          <Text style={styles.sectionSubtitle}>
            All professionals are vetted and highly rated
          </Text>
          
          <View style={styles.servicesGrid}>
            {serviceCategories.map(renderServiceCard)}
          </View>
        </View>

        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>Why Choose GenesisAI?</Text>
          
          <View style={styles.featuresList}>
            <View style={styles.featureItem}>
              <View style={[styles.featureIcon, { backgroundColor: '#E7F3FF' }]}>
                <Star size={20} color="#0041C2" />
              </View>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>Verified Professionals</Text>
                <Text style={styles.featureDescription}>
                  All service providers are background checked and certified
                </Text>
              </View>
            </View>

            <View style={styles.featureItem}>
              <View style={[styles.featureIcon, { backgroundColor: '#F0FDF4' }]}>
                <Clock size={20} color="#059669" />
              </View>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>Fast Response</Text>
                <Text style={styles.featureDescription}>
                  Get matched with available professionals in minutes
                </Text>
              </View>
            </View>

            <View style={styles.featureItem}>
              <View style={[styles.featureIcon, { backgroundColor: '#FFF7ED' }]}>
                <Wrench size={20} color="#EA580C" />
              </View>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>Quality Guaranteed</Text>
                <Text style={styles.featureDescription}>
                  Satisfaction guarantee on all completed services
                </Text>
              </View>
            </View>
          </View>
        </View>
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
  content: {
    flex: 1,
  },
  categorySection: {
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 24,
  },
  servicesGrid: {
    gap: 16,
  },
  serviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  serviceIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  serviceContent: {
    flex: 1,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  serviceDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  serviceStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
    color: '#333',
    fontWeight: '500',
  },
  professionalCount: {
    fontSize: 12,
    color: '#666',
  },
  featuresSection: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  featuresList: {
    gap: 16,
    marginTop: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});