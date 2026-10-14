import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import * as SecureStore from 'expo-secure-store';

export default function SettingsScreen({ navigation }: any) {
  const [dreamWeavingEnabled, setDreamWeavingEnabled] = React.useState(true);
  const [localProcessing, setLocalProcessing] = React.useState(true);
  const [telemetry, setTelemetry] = React.useState(false);

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync('sigil-os-authenticated');
    navigation.navigate('Onboarding');
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dream Weaving</Text>
          
          <View style={styles.setting}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Enable Dream Weaving</Text>
              <Text style={styles.settingDescription}>
                Allow the AI to self-evolve based on conversations
              </Text>
            </View>
            <Switch
              value={dreamWeavingEnabled}
              onValueChange={setDreamWeavingEnabled}
              trackColor={{ false: '#2a2a4e', true: '#667eea' }}
            />
          </View>

          <View style={styles.setting}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Auto-approve Mutations</Text>
              <Text style={styles.settingDescription}>
                Automatically approve evolutionary changes
              </Text>
            </View>
            <Switch
              value={false}
              trackColor={{ false: '#2a2a4e', true: '#667eea' }}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Model</Text>
          
          <View style={styles.setting}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Model Provider</Text>
              <Text style={styles.settingDescription}>
                Choose between local or cloud inference
              </Text>
            </View>
            <Text style={styles.settingValue}>Local</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy</Text>
          
          <View style={styles.setting}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Local Processing</Text>
              <Text style={styles.settingDescription}>
                Process all data locally on your device
              </Text>
            </View>
            <Switch
              value={localProcessing}
              onValueChange={setLocalProcessing}
              trackColor={{ false: '#2a2a4e', true: '#667eea' }}
            />
          </View>

          <View style={styles.setting}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Telemetry</Text>
              <Text style={styles.settingDescription}>
                Send anonymous usage data to improve SIGIL OS
              </Text>
            </View>
            <Switch
              value={telemetry}
              onValueChange={setTelemetry}
              trackColor={{ false: '#2a2a4e', true: '#667eea' }}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Sign Out</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.version}>SIGIL OS v1.0.0</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  scrollContent: {
    padding: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    color: '#667eea',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  setting: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a4e',
  },
  settingInfo: {
    flex: 1,
  },
  settingLabel: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 5,
  },
  settingDescription: {
    color: '#a0a0a0',
    fontSize: 14,
  },
  settingValue: {
    color: '#667eea',
    fontSize: 16,
  },
  logoutButton: {
    backgroundColor: '#2a2a4e',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#ff6b6b',
    fontSize: 16,
    fontWeight: 'bold',
  },
  version: {
    color: '#666',
    fontSize: 14,
    textAlign: 'center',
  },
});
