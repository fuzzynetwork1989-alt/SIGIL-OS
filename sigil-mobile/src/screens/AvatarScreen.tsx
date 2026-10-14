import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

export default function AvatarScreen({ navigation }: any) {
  const [avatarStyle, setAvatarStyle] = useState('realistic');
  const [skinTone, setSkinTone] = useState('light');
  const [eyeColor, setEyeColor] = useState('blue');
  const [expression, setExpression] = useState('happy');

  const styles = ['realistic', 'stylized', 'procedural', 'minimal'];
  const skinTones = ['light', 'medium', 'dark'];
  const eyeColors = ['blue', 'green', 'brown', 'hazel'];
  const expressions = ['happy', 'neutral', 'thoughtful', 'surprised'];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.avatarPreview}>
          <View style={styles.avatarCircle}>
            <View style={styles.avatarFace}>
              <View style={styles.avatarEyes}>
                <View style={[styles.avatarEye, { backgroundColor: getEyeColor(eyeColor) }]} />
                <View style={[styles.avatarEye, { backgroundColor: getEyeColor(eyeColor) }]} />
              </View>
              <View style={[styles.avatarMouth, getExpressionStyle(expression)]} />
            </View>
          </View>
        </View>

        <View style={styles.controls}>
          <Text style={styles.controlLabel}>Avatar Style</Text>
          <View style={styles.buttonGroup}>
            {styles.map((style) => (
              <TouchableOpacity
                key={style}
                style={[
                  style === avatarStyle ? styles.activeButton : styles.inactiveButton,
                ]}
                onPress={() => setAvatarStyle(style)}
              >
                <Text
                  style={[
                    style === avatarStyle ? styles.activeButtonText : styles.inactiveButtonText,
                  ]}
                >
                  {style.charAt(0).toUpperCase() + style.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.controlLabel}>Skin Tone</Text>
          <View style={styles.buttonGroup}>
            {skinTones.map((tone) => (
              <TouchableOpacity
                key={tone}
                style={[
                  tone === skinTone ? styles.activeButton : styles.inactiveButton,
                ]}
                onPress={() => setSkinTone(tone)}
              >
                <Text
                  style={[
                    tone === skinTone ? styles.activeButtonText : styles.inactiveButtonText,
                  ]}
                >
                  {tone.charAt(0).toUpperCase() + tone.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.controlLabel}>Eye Color</Text>
          <View style={styles.buttonGroup}>
            {eyeColors.map((color) => (
              <TouchableOpacity
                key={color}
                style={[
                  color === eyeColor ? styles.activeButton : styles.inactiveButton,
                ]}
                onPress={() => setEyeColor(color)}
              >
                <Text
                  style={[
                    color === eyeColor ? styles.activeButtonText : styles.inactiveButtonText,
                  ]}
                >
                  {color.charAt(0).toUpperCase() + color.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.controlLabel}>Expression</Text>
          <View style={styles.buttonGroup}>
            {expressions.map((expr) => (
              <TouchableOpacity
                key={expr}
                style={[
                  expr === expression ? styles.activeButton : styles.inactiveButton,
                ]}
                onPress={() => setExpression(expr)}
              >
                <Text
                  style={[
                    expr === expression ? styles.activeButtonText : styles.inactiveButtonText,
                  ]}
                >
                  {expr.charAt(0).toUpperCase() + expr.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function getEyeColor(color: string): string {
  const colors: { [key: string]: string } = {
    blue: '#4a90e2',
    green: '#7ed321',
    brown: '#8b4513',
    hazel: '#8b7355',
  };
  return colors[color] || '#4a90e2';
}

function getExpressionStyle(expression: string) {
  const styles: { [key: string]: any } = {
    happy: { borderRadius: 0, borderBottomLeftRadius: 20, borderBottomRightRadius: 20 },
    neutral: { borderRadius: 0 },
    thoughtful: { borderRadius: 0, borderBottomLeftRadius: 10, borderBottomRightRadius: 10 },
    surprised: { borderRadius: 50 },
  };
  return styles[expression] || styles.happy;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  scrollContent: {
    padding: 20,
  },
  avatarPreview: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatarCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#667eea',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarFace: {
    alignItems: 'center',
  },
  avatarEyes: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 10,
  },
  avatarEye: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  avatarMouth: {
    width: 40,
    height: 20,
    borderWidth: 3,
    borderColor: '#fff',
  },
  controls: {
    gap: 20,
  },
  controlLabel: {
    color: '#667eea',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  buttonGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  activeButton: {
    backgroundColor: '#667eea',
    padding: 12,
    borderRadius: 20,
  },
  inactiveButton: {
    backgroundColor: '#2a2a4e',
    padding: 12,
    borderRadius: 20,
  },
  activeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  inactiveButtonText: {
    color: '#a0a0a0',
  },
});
