import React from 'react';
import { Image, View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bot, Users, Wrench } from 'lucide-react-native';

import {
  useFonts,
  Urbanist_600SemiBold,
  Urbanist_400Regular,
} from '@expo-google-fonts/urbanist';
//import AppLoading from 'expo-app-loading';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
  const [fontsLoaded] = useFonts({
    Urbanist_600SemiBold,
    Urbanist_400Regular,
  });

  //if (!fontsLoaded) return <AppLoading />;
  if (!fontsLoaded) return null;

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#1E40AF', '#3B82F6']}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.content}>
          <View style={styles.heroSection}>
            <View style={styles.iconContainer}>
              <Image
                source={require('../../assets/images/habi-logo.png')}
                style={styles.logo}
                resizeMode="contain"
                accessible
                accessibilityLabel="HABI logo"
              />
            </View>
            <Text style={styles.title}>habi</Text>
            <Text style={styles.subtitle}>Your AI-powered marketplace for local services</Text>
          </View>

          {false && (
            <View style={styles.featuresContainer}>
              <View style={styles.featureItem}>
                <Users size={24} color="white" />
                <Text style={styles.featureText}>Connect with trusted professionals</Text>
              </View>
              <View style={styles.featureItem}>
                <Wrench size={24} color="white" />
                <Text style={styles.featureText}>Get expert repairs & services</Text>
              </View>
              <View style={styles.featureItem}>
                <Bot size={24} color="white" />
                <Text style={styles.featureText}>AI-guided booking experience</Text>
              </View>
            </View>
          )}

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => router.push('/(auth)/signup')}
            >
              <Text style={styles.primaryButtonText}>Get Started</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => router.push('/(auth)/login')}
            >
              <Text style={styles.secondaryButtonText}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    paddingTop: height * 0.1,
    paddingBottom: 40,
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  logoContainer: {
    width: 120,
    height: 120,
    marginBottom: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  title: {
    fontFamily: 'Urbanist_600SemiBold',
    fontSize: 36,
    color: 'white',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontFamily: 'Urbanist_400Regular',
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 24,
  },
  featuresContainer: {
    marginBottom: 40,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 16,
    borderRadius: 12,
  },
  featureText: {
    fontFamily: 'Urbanist_400Regular',
    fontSize: 16,
    color: 'white',
    marginLeft: 16,
    flex: 1,
  },
  buttonContainer: {
    gap: 16,
  },
  primaryButton: {
    backgroundColor: 'white',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    fontFamily: 'Urbanist_600SemiBold',
    color: '#1E40AF',
    fontSize: 18,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  secondaryButtonText: {
    fontFamily: 'Urbanist_600SemiBold',
    color: 'white',
    fontSize: 18,
  },
});
