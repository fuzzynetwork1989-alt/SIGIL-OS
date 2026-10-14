import axios from 'axios';
import { AuthService } from './auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

export class ApiService {
  private static readonly API_BASE_URL = 'http://127.0.0.1:8080/api/v1';

  /**
   * Send a message to the chat API
   */
  static async sendMessage(prompt: string): Promise<{ text: string; superbrain?: any }> {
    try {
      // Get conversation ID and user ID
      const conversationId = await AsyncStorage.getItem('sigil-conversation-id') || this.generateUUID();
      const userId = await AsyncStorage.getItem('sigil-user-id') || this.generateUUID();

      await AsyncStorage.setItem('sigil-conversation-id', conversationId);
      await AsyncStorage.setItem('sigil-user-id', userId);

      // Check if Super Brain is enabled
      const useSuperBrain = await AsyncStorage.getItem('sigil-use-superbrain') === 'true';

      // Sign the request with the private key
      const signature = await AuthService.sign(prompt);

      const endpoint = useSuperBrain
        ? `${this.API_BASE_URL}/superbrain/chat`
        : `${this.API_BASE_URL}/chat`;

      const response = await axios.post(
        endpoint,
        {
          prompt,
          signature,
          use_superbrain: useSuperBrain,
          conversation_id: conversationId,
          user_id: userId,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error('API Error:', error);
      throw new Error('Failed to send message');
    }
  }

  /**
   * Get dream weaving data
   */
  static async getDreamWeavingData(): Promise<any> {
    try {
      const response = await axios.get(`${this.API_BASE_URL}/dream-weaving`);
      return response.data;
    } catch (error) {
      console.error('API Error:', error);
      throw new Error('Failed to get dream weaving data');
    }
  }

  /**
   * Get sigil explorer data
   */
  static async getSigilData(): Promise<any> {
    try {
      const response = await axios.get(`${this.API_BASE_URL}/sigils`);
      return response.data;
    } catch (error) {
      console.error('API Error:', error);
      throw new Error('Failed to get sigil data');
    }
  }

  /**
   * Update avatar settings
   */
  static async updateAvatar(settings: any): Promise<any> {
    try {
      const signature = await AuthService.sign(JSON.stringify(settings));

      const response = await axios.put(
        `${this.API_BASE_URL}/avatar`,
        settings,
        {
          headers: {
            'Content-Type': 'application/json',
            'X-Signature': signature,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error('API Error:', error);
      throw new Error('Failed to update avatar');
    }
  }

  /**
   * Check API health
   */
  static async healthCheck(): Promise<{ status: string; superbrain_enabled: boolean }> {
    try {
      const response = await axios.get('http://127.0.0.1:8080/health');
      return response.data;
    } catch (error) {
      console.error('API Error:', error);
      throw new Error('API is not available');
    }
  }

  /**
   * Toggle Super Brain
   */
  static async toggleSuperBrain(): Promise<boolean> {
    const currentState = await AsyncStorage.getItem('sigil-use-superbrain') === 'true';
    const newState = !currentState;
    await AsyncStorage.setItem('sigil-use-superbrain', newState.toString());
    return newState;
  }

  /**
   * Check if Super Brain is enabled
   */
  static async isSuperBrainEnabled(): Promise<boolean> {
    return await AsyncStorage.getItem('sigil-use-superbrain') === 'true';
  }

  /**
   * Generate UUID
   */
  private static generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
}
