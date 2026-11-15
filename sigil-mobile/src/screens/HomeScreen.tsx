import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function HomeScreen({ navigation }: any) {
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  const recentConversations = [
    { id: 1, title: 'Planning my trip to Japan', preview: 'Let me help you plan an amazing trip...', time: '2 hours ago' },
    { id: 2, title: 'Learning Python programming', preview: 'I can guide you through the basics...', time: 'Yesterday' },
    { id: 3, title: 'Recipe ideas for dinner', preview: 'How about something simple and delicious...', time: '2 days ago' },
  ];

  const quickActions = [
    { icon: '💬', label: 'Start a chat', color: ['#8b5cf6', '#ec4899'] },
    { icon: '❤️', label: 'My memories', color: ['#ec4899', '#f43f5e'] },
    { icon: '✨', label: 'Personalize', color: ['#3b82f6', '#06b6d4'] },
    { icon: '📋', label: 'Tasks', color: ['#10b981', '#059669'] },
    { icon: '🧠', label: 'Intelligence', color: ['#f59e0b', '#d97706'] },
    { icon: '🥽', label: 'Quest 3', color: ['#8b5cf6', '#ec4899'] },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={['#0f172a', '#7c3aed', '#0f172a']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Greeting */}
          <View style={styles.greetingSection}>
            <Text style={styles.greeting}>{greeting}, I'm SIGIL</Text>
            <Text style={styles.subtitle}>
              Your AI companion who remembers and helps you
            </Text>
          </View>

          {/* Main Chat Input */}
          <View style={styles.chatInputContainer}>
            <View style={styles.chatInput}>
              <Text style={styles.chatPlaceholder}>
                What would you like to talk about today?
              </Text>
            </View>
            <TouchableOpacity
              style={styles.startChatButton}
              onPress={() => navigation.navigate('Chat')}
            >
              <Text style={styles.startChatButtonText}>Start Chat →</Text>
            </TouchableOpacity>
          </View>

          {/* Quick Actions */}
          <View style={styles.quickActionsContainer}>
            {quickActions.map((action, index) => (
              <TouchableOpacity
                key={index}
                style={styles.quickActionButton}
              >
                <LinearGradient
                  colors={action.color}
                  style={styles.quickActionIcon}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Text style={styles.quickActionIconText}>{action.icon}</Text>
                </LinearGradient>
                <Text style={styles.quickActionLabel}>{action.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Quest 3 Studio Banner */}
          <View style={styles.questBanner}>
            <LinearGradient
              colors={['#8b5cf6', '#ec4899']}
              style={styles.questBannerGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.questBannerTitle}>🥽 Quest 3 Studio</Text>
              <Text style={styles.questBannerSubtitle}>Create immersive VR experiences</Text>
              <TouchableOpacity style={styles.questBannerButton}>
                <Text style={styles.questBannerButtonText}>Launch Studio →</Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>

          {/* Intelligence Engine Banner */}
          <View style={styles.intelligenceBanner}>
            <LinearGradient
              colors={['#f59e0b', '#d97706']}
              style={styles.intelligenceBannerGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.intelligenceBannerTitle}>🧠 SIGIL Intelligence</Text>
              <Text style={styles.intelligenceBannerSubtitle}>Next-gen AI that surpasses everything</Text>
              <TouchableOpacity style={styles.intelligenceBannerButton}>
                <Text style={styles.intelligenceBannerButtonText}>Configure →</Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>

          {/* Recent Conversations */}
          <View style={styles.recentSection}>
            <Text style={styles.recentTitle}>Recent Conversations</Text>
            {recentConversations.map((conv) => (
              <TouchableOpacity
                key={conv.id}
                style={styles.conversationCard}
                onPress={() => navigation.navigate('Chat')}
              >
                <View style={styles.conversationHeader}>
                  <Text style={styles.conversationTitle}>{conv.title}</Text>
                  <Text style={styles.conversationTime}>{conv.time}</Text>
                </View>
                <Text style={styles.conversationPreview}>{conv.preview}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Trust Badge */}
          <View style={styles.trustBadge}>
            <Text style={styles.trustIcon}>❤️</Text>
            <Text style={styles.trustText}>
              Your conversations are private and secure
            </Text>
          </View>
        </ScrollView>
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
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  greetingSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  greeting: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 18,
    color: '#a78bfa',
    textAlign: 'center',
  },
  chatInputContainer: {
    marginBottom: 30,
  },
  chatInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    marginBottom: 16,
  },
  chatPlaceholder: {
    color: '#a78bfa',
    fontSize: 16,
  },
  startChatButton: {
    backgroundColor: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  startChatButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    flexWrap: 'wrap',
  },
  quickActionButton: {
    width: '31%',
    marginHorizontal: '1%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    marginBottom: 8,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  quickActionIconText: {
    fontSize: 24,
  },
  quickActionLabel: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '500',
    textAlign: 'center',
  },
  questBanner: {
    marginBottom: 20,
  },
  questBannerGradient: {
    borderRadius: 20,
    padding: 20,
    borderWidth: 2,
    borderColor: 'rgba(236, 72, 153, 0.5)',
  },
  questBannerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  questBannerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 16,
  },
  questBannerButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  questBannerButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  intelligenceBanner: {
    marginBottom: 30,
  },
  intelligenceBannerGradient: {
    borderRadius: 20,
    padding: 20,
    borderWidth: 2,
    borderColor: 'rgba(245, 158, 11, 0.5)',
  },
  intelligenceBannerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  intelligenceBannerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 16,
  },
  intelligenceBannerButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  intelligenceBannerButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  recentSection: {
    marginBottom: 30,
  },
  recentTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  conversationCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  conversationTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  conversationTime: {
    color: '#a78bfa',
    fontSize: 12,
  },
  conversationPreview: {
    color: '#a78bfa',
    fontSize: 14,
  },
  trustBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(34, 197, 94, 0.2)',
    borderRadius: 24,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.3)',
  },
  trustIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  trustText: {
    color: '#4ade80',
    fontSize: 13,
    fontWeight: '500',
  },
});
