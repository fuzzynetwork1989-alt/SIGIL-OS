import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import * as SecureStore from 'expo-secure-store';

export default function OnboardingScreen({ navigation }: any) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: 'Welcome to SIGIL OS',
      subtitle: 'The Post-AI Operating System',
      description: 'SIGIL OS is a new category of computing where intelligence is the substrate and every act of cognition bears a sigil.',
      icon: '🔐',
    },
    {
      title: 'Cryptographic Warrants',
      subtitle: 'No API Keys, No Secrets',
      description: 'Every action is cryptographically signed with Ed25519, providing full provenance and reversibility.',
      icon: '🔐',
    },
    {
      title: 'Get Started',
      subtitle: 'Choose Your Plan',
      description: 'Start with our free tier or unlock advanced features with our premium plans.',
      icon: '🚀',
    },
  ];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      // Show pricing options
      navigation.navigate('Pricing');
    }
  };

  const handleSkip = async () => {
    await SecureStore.setItemAsync('sigil-os-onboarded', 'true');
    navigation.navigate('Chat');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.slide}>
          <Text style={styles.icon}>{slides[currentSlide].icon}</Text>
          <Text style={styles.title}>{slides[currentSlide].title}</Text>
          <Text style={styles.subtitle}>{slides[currentSlide].subtitle}</Text>
          <Text style={styles.description}>{slides[currentSlide].description}</Text>
        </View>

        <View style={styles.dots}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index === currentSlide && styles.activeDot,
              ]}
            />
          ))}
        </View>

        <View style={styles.buttons}>
          <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
            <Text style={styles.skipButtonText}>Skip</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <Text style={styles.nextButtonText}>
              {currentSlide === slides.length - 1 ? 'View Plans' : 'Continue'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  scrollContent: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  slide: {
    alignItems: 'center',
    marginBottom: 40,
  },
  icon: {
    fontSize: 80,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#667eea',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 20,
    color: '#764ba2',
    marginBottom: 20,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#a0a0a0',
    textAlign: 'center',
    lineHeight: 24,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 30,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#666',
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: '#667eea',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  skipButton: {
    padding: 15,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#667eea',
  },
  skipButtonText: {
    color: '#667eea',
    fontSize: 16,
    fontWeight: '600',
  },
  nextButton: {
    padding: 15,
    borderRadius: 25,
    backgroundColor: '#667eea',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
