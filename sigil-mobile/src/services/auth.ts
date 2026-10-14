import * as SecureStore from 'expo-secure-store';
import * as Crypto from 'expo-crypto';

export class AuthService {
  private static readonly KEY_PAIR_KEY = 'sigil-os-keypair';
  private static readonly AUTH_TOKEN_KEY = 'sigil-os-auth-token';

  /**
   * Generate Ed25519 key pair for keyless authentication
   */
  static async generateKeyPair(): Promise<{ publicKey: string; privateKey: string }> {
    // In production, this would use a proper Ed25519 library
    // For now, we'll generate a random key pair using expo-crypto
    const publicKey = await Crypto.randomUUID();
    const privateKey = await Crypto.randomUUID();

    // Store in secure storage
    await SecureStore.setItemAsync(
      this.KEY_PAIR_KEY,
      JSON.stringify({ publicKey, privateKey })
    );

    return { publicKey, privateKey };
  }

  /**
   * Get stored key pair
   */
  static async getKeyPair(): Promise<{ publicKey: string; privateKey: string } | null> {
    const keyPairData = await SecureStore.getItemAsync(this.KEY_PAIR_KEY);
    if (!keyPairData) return null;

    try {
      return JSON.parse(keyPairData);
    } catch {
      return null;
    }
  }

  /**
   * Sign a message with the private key
   */
  static async sign(message: string): Promise<string> {
    const keyPair = await this.getKeyPair();
    if (!keyPair) {
      throw new Error('No key pair found. Please authenticate first.');
    }

    // In production, this would use proper Ed25519 signing
    // For now, we'll create a simple signature
    const signature = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      message + keyPair.privateKey
    );

    return signature;
  }

  /**
   * Verify a signature
   */
  static async verify(message: string, signature: string): Promise<boolean> {
    const keyPair = await this.getKeyPair();
    if (!keyPair) return false;

    // In production, this would use proper Ed25519 verification
    const expectedSignature = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      message + keyPair.privateKey
    );

    return signature === expectedSignature;
  }

  /**
   * Register with passkey (WebAuthn)
   */
  static async registerPasskey(): Promise<boolean> {
    // In production, this would use WebAuthn API
    // For now, we'll simulate registration
    const keyPair = await this.generateKeyPair();
    await SecureStore.setItemAsync('sigil-os-authenticated', 'true');
    return true;
  }

  /**
   * Authenticate with passkey
   */
  static async authenticatePasskey(): Promise<boolean> {
    // In production, this would use WebAuthn API
    // For now, we'll simulate authentication
    const keyPair = await this.getKeyPair();
    if (!keyPair) return false;

    await SecureStore.setItemAsync('sigil-os-authenticated', 'true');
    return true;
  }

  /**
   * Check if user is authenticated
   */
  static async isAuthenticated(): Promise<boolean> {
    const authenticated = await SecureStore.getItemAsync('sigil-os-authenticated');
    return authenticated === 'true';
  }

  /**
   * Logout
   */
  static async logout(): Promise<void> {
    await SecureStore.deleteItemAsync('sigil-os-authenticated');
    // Keep the key pair for future use
  }
}
