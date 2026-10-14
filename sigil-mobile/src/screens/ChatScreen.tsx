import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { ApiService } from '../services/api';

export default function ChatScreen({ navigation }: any) {
  const [messages, setMessages] = useState([
    { id: 1, text: 'Hello! I\'m your SIGIL OS companion. How can I help you today?', isUser: false },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage = { id: Date.now(), text: inputText, isUser: true };
    setMessages([...messages, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await ApiService.sendMessage(userMessage.text);
      const aiMessage = { id: Date.now() + 1, text: response.text, isUser: false };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage = { 
        id: Date.now() + 1, 
        text: 'Sorry, I encountered an error. Please try again.', 
        isUser: false 
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>SIGIL OS</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Avatar')}>
          <Text style={styles.headerButton}>Avatar</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
          <Text style={styles.headerButton}>Settings</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.messagesContainer}>
        {messages.map((message) => (
          <View
            key={message.id}
            style={[
              styles.message,
              message.isUser ? styles.userMessage : styles.aiMessage,
            ]}
          >
            <Text
              style={[
                styles.messageText,
                message.isUser ? styles.userMessageText : styles.aiMessageText,
              ]}
            >
              {message.text}
            </Text>
          </View>
        ))}
        {isLoading && (
          <View style={[styles.message, styles.aiMessage]}>
            <Text style={styles.messageText}>Thinking...</Text>
          </View>
        )}
      </ScrollView>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.inputContainer}
      >
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Type a message..."
          placeholderTextColor="#666"
          multiline
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#667eea',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerButton: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 15,
  },
  messagesContainer: {
    flex: 1,
    padding: 15,
  },
  message: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#667eea',
  },
  aiMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#2a2a4e',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userMessageText: {
    color: '#fff',
  },
  aiMessageText: {
    color: '#e0e0e0',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#2a2a4e',
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    color: '#fff',
    padding: 12,
    borderRadius: 20,
    marginRight: 10,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: '#667eea',
    padding: 12,
    borderRadius: 20,
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
