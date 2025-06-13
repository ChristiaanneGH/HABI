import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Send, Bot, User, Camera, MapPin } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import ServiceProvidersList from '@/components/ServiceProvidersList';
import { getServiceProvidersByCategory, ServiceProvider } from '@/lib/supabaseService';

interface Message {
  id: string;
  text: string;
  isAI: boolean;
  timestamp: Date;
  serviceProviders?: ServiceProvider[];
  serviceType?: string;
}

export default function GenesisAITab() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm Habi, your personal service assistant. I can help you find and book local professionals. What home service do you need today?",
      isAI: true,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const sendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isAI: false,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputText;
    setInputText('');
    setIsLoading(true);

    // Scroll to bottom after user message
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);

    try {
      // Generate AI response and potentially fetch service providers
      const { aiResponse, serviceProviders, serviceType } = await generateAIResponse(currentInput);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        isAI: true,
        timestamp: new Date(),
        serviceProviders,
        serviceType,
      };

      setMessages(prev => [...prev, aiMessage]);
      
      // Scroll to bottom after AI response
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (error) {
      console.error('Error generating AI response:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm sorry, I encountered an error. Please try again.",
        isAI: true,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const generateAIResponse = async (userInput: string): Promise<{
    aiResponse: string;
    serviceProviders?: ServiceProvider[];
    serviceType?: string;
  }> => {
    const input = userInput.toLowerCase();
    
    // Define service mappings
    const serviceMap: { [key: string]: string } = {
      'computer': 'IT & Tech Support',
      'laptop': 'IT & Tech Support',
      'pc': 'IT & Tech Support',
      'tech': 'IT & Tech Support',
      'plumb': 'Plumbing Services',
      'leak': 'Plumbing Services',
      'pipe': 'Plumbing Services',
      'toilet': 'Plumbing Services',
      'sink': 'Plumbing Services',
      'faucet': 'Plumbing Services',
      'electric': 'Electrical Services',
      'wiring': 'Electrical Services',
      'outlet': 'Electrical Services',
      'power': 'Electrical Services',
      'lighting': 'Electrical Services',
      'hvac': 'HVAC Services',
      'heating': 'HVAC Services',
      'cooling': 'HVAC Services',
      'air conditioning': 'HVAC Services',
      'ac': 'HVAC Services',
      'furnace': 'HVAC Services',
      'car': 'Car Repair & Maintenance',
      'auto': 'Car Repair & Maintenance',
      'vehicle': 'Car Repair & Maintenance',
      'brake': 'Car Repair & Maintenance',
      'engine': 'Car Repair & Maintenance',
      'clean': 'House Cleaning',
      'cleaning': 'House Cleaning',
      'paint': 'Painting Services',
      'painting': 'Painting Services',
      'handyman': 'General Handyman',
      'repair': 'General Handyman',
    };

    // Find matching service category
    let detectedService: string | null = null;
    for (const [keyword, service] of Object.entries(serviceMap)) {
      if (input.includes(keyword)) {
        detectedService = service;
        break;
      }
    }

    if (detectedService) {
      try {
        // Fetch service providers for the detected service
        const providers = await getServiceProvidersByCategory(detectedService, 3);
        
        if (providers.length > 0) {
          const aiResponse = `Perfect! I found ${providers.length} ${detectedService.toLowerCase()} professionals in your area. These providers handle ${getServiceDescription(detectedService)}. Here are some top-rated options for you:`;
          
          return {
            aiResponse,
            serviceProviders: providers,
            serviceType: detectedService,
          };
        } else {
          return {
            aiResponse: `I understand you need ${detectedService.toLowerCase()} services. Unfortunately, I couldn't find any available providers in your area right now. Please try again later or contact us directly for assistance.`,
          };
        }
      } catch (error) {
        console.error('Error fetching service providers:', error);
        return {
          aiResponse: `I can help you find ${detectedService.toLowerCase()} professionals! However, I'm having trouble accessing our provider database right now. Please try again in a moment.`,
        };
      }
    }
    
    // Default response for unrecognized input
    return {
      aiResponse: "I understand you need help with a service. Could you please specify which type of service you're looking for?\n\n• Computer/IT repair\n• Plumbing\n• Electrical work\n• HVAC (heating/cooling)\n• Auto repair\n• House cleaning\n• Painting\n• General handyman services\n\nOnce you tell me the service type, I can find the perfect professional for your needs!",
    };
  };

  const getServiceDescription = (serviceType: string): string => {
    const descriptions: { [key: string]: string } = {
      'IT & Tech Support': 'computer repair, network setup, smart home installation, and tech troubleshooting',
      'Plumbing Services': 'leak repair, drain cleaning, fixture installation, and water heater services',
      'Electrical Services': 'outlet installation, lighting repair, wiring, and electrical safety',
      'HVAC Services': 'AC repair/installation, heating system maintenance, and duct cleaning',
      'Car Repair & Maintenance': 'engine diagnostics, brake repair, oil changes, and general automotive maintenance',
      'House Cleaning': 'regular cleaning, deep cleaning, and move-in/out cleaning services',
      'Painting Services': 'interior and exterior painting for residential and commercial properties',
      'General Handyman': 'home repairs, furniture assembly, and general maintenance tasks',
    };
    
    return descriptions[serviceType] || 'various professional services';
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderMessage = (message: Message) => (
    <View
      key={message.id}
      style={[
        styles.messageContainer,
        message.isAI ? styles.aiMessage : styles.userMessage,
      ]}
    >
      <View style={styles.messageHeader}>
        {message.isAI ? (
          <Bot size={20} color="#0041C2" />
        ) : (
          <User size={20} color="white" />
        )}
        <Text style={[
          styles.messageTime,
          { color: message.isAI ? '#666' : 'rgba(255,255,255,0.8)' }
        ]}>
          {formatTime(message.timestamp)}
        </Text>
      </View>
      <Text style={[
        styles.messageText,
        { color: message.isAI ? '#333' : 'white' }
      ]}>
        {message.text}
      </Text>
      
      {message.serviceProviders && message.serviceProviders.length > 0 && (
        <ServiceProvidersList
          providers={message.serviceProviders}
          serviceType={message.serviceType || 'service'}
        />
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#0041C2', '#1E3A8A']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>GenesisAI Assistant</Text>
        <Text style={styles.headerSubtitle}>Your personal service expert</Text>
      </LinearGradient>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.chatContainer}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          {messages.map(renderMessage)}
          
          {isLoading && (
            <View style={[styles.messageContainer, styles.aiMessage]}>
              <View style={styles.messageHeader}>
                <Bot size={20} color="#0041C2" />
                <Text style={[styles.messageTime, { color: '#666' }]}>
                  {formatTime(new Date())}
                </Text>
              </View>
              <Text style={[styles.messageText, { color: '#333', fontStyle: 'italic' }]}>
                GenesisAI is thinking...
              </Text>
            </View>
          )}
        </ScrollView>

        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.textInput}
              value={inputText}
              onChangeText={setInputText}
              placeholder="Describe what service you need..."
              multiline
              maxLength={500}
              editable={!isLoading}
            />
            <View style={styles.inputActions}>
              <TouchableOpacity style={styles.actionButton} disabled={isLoading}>
                <Camera size={20} color={isLoading ? '#ccc' : '#666'} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton} disabled={isLoading}>
                <MapPin size={20} color={isLoading ? '#ccc' : '#666'} />
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.sendButton,
                  (!inputText.trim() || isLoading) && styles.sendButtonDisabled
                ]}
                onPress={sendMessage}
                disabled={!inputText.trim() || isLoading}
              >
                <Send size={20} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
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
  chatContainer: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  messageContainer: {
    marginBottom: 16,
    borderRadius: 16,
    padding: 16,
    maxWidth: '85%',
  },
  aiMessage: {
    backgroundColor: 'white',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    maxWidth: '95%',
  },
  userMessage: {
    backgroundColor: '#0041C2',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  messageTime: {
    fontSize: 12,
    marginLeft: 8,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  inputContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  inputWrapper: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    backgroundColor: '#f9f9f9',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  textInput: {
    fontSize: 16,
    maxHeight: 100,
    marginBottom: 8,
  },
  inputActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  actionButton: {
    padding: 8,
  },
  sendButton: {
    backgroundColor: '#0041C2',
    borderRadius: 20,
    padding: 10,
  },
  sendButtonDisabled: {
    backgroundColor: '#ccc',
  },
});