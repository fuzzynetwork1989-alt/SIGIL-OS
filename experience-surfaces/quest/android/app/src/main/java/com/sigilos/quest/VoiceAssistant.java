package com.sigilos.quest;

import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.speech.RecognitionListener;
import android.speech.RecognizerIntent;
import android.speech.SpeechRecognizer;
import android.speech.tts.TextToSpeech;
import android.util.Log;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.UUID;

/**
 * Voice Assistant for Quest 3.
 * Handles voice recognition (Android SpeechRecognizer), text-to-speech
 * (Android TextToSpeech), and voice command processing via Model Fabric.
 *
 * NOTE: On Quest 3, Android speech services are provided by the system
 * speech recognition service. For the Meta Voice SDK (wake word, on-device
 * STT/TTS), replace the SpeechRecognizer/TextToSpeech usage below with the
 * Meta Voice SDK once the Oculus Mobile SDK is installed — see
 * docs/QUEST3_INSTALL_MANUAL.md.
 */
public class VoiceAssistant {
    private static final String TAG = "VoiceAssistant";

    private final String id;
    private boolean listening;
    private boolean speaking;
    private String language;
    private final Context context;

    private SpeechRecognizer speechRecognizer;
    private TextToSpeech textToSpeech;
    private boolean ttsReady;
    private final ModelFabricClient modelFabricClient;

    private VoiceCommand lastCommand;
    private OnCommandListener commandListener;

    public VoiceAssistant(Context context, String modelFabricUrl, String apiKey) {
        this.context = context.getApplicationContext();
        this.id = UUID.randomUUID().toString();
        this.listening = false;
        this.speaking = false;
        this.language = "en-US";
        this.lastCommand = null;
        this.commandListener = null;

        this.modelFabricClient = new ModelFabricClient(modelFabricUrl, apiKey);

        initSpeechRecognizer();
        initTextToSpeech();
    }

    /**
     * Constructor without Model Fabric (for backward compatibility).
     */
    public VoiceAssistant(Context context) {
        this(context, "http://localhost:8080", "sigil-api-key");
    }

    private void initSpeechRecognizer() {
        if (!SpeechRecognizer.isRecognitionAvailable(context)) {
            Log.w(TAG, "Speech recognition not available on this device");
            return;
        }
        speechRecognizer = SpeechRecognizer.createSpeechRecognizer(context);
        speechRecognizer.setRecognitionListener(new RecognitionListener() {
            @Override
            public void onReadyForSpeech(Bundle params) {
                Log.d(TAG, "Ready for speech");
            }

            @Override
            public void onBeginningOfSpeech() {
                Log.d(TAG, "Beginning of speech");
            }

            @Override
            public void onRmsChanged(float rmsdB) {
            }

            @Override
            public void onBufferReceived(byte[] buffer) {
            }

            @Override
            public void onEndOfSpeech() {
                Log.d(TAG, "End of speech");
            }

            @Override
            public void onError(int error) {
                Log.w(TAG, "Speech recognition error: " + error);
                listening = false;
            }

            @Override
            public void onResults(Bundle results) {
                List<String> matches = results.getStringArrayList(
                    SpeechRecognizer.RESULTS_RECOGNITION);
                if (matches != null && !matches.isEmpty()) {
                    String text = matches.get(0);
                    Log.i(TAG, "Recognized: " + text);
                    handleRecognizedText(text);
                }
                listening = false;
            }

            @Override
            public void onPartialResults(Bundle partialResults) {
                List<String> matches = partialResults.getStringArrayList(
                    SpeechRecognizer.RESULTS_RECOGNITION);
                if (matches != null && !matches.isEmpty()) {
                    Log.d(TAG, "Partial: " + matches.get(0));
                }
            }

            @Override
            public void onEvent(int eventType, Bundle params) {
            }
        });
    }

    private void initTextToSpeech() {
        textToSpeech = new TextToSpeech(context, status -> {
            if (status == TextToSpeech.SUCCESS) {
                textToSpeech.setOnUtteranceProgressListener(
                    new android.speech.tts.UtteranceProgressListener() {
                        @Override
                        public void onStart(String utteranceId) {
                            speaking = true;
                        }

                        @Override
                        public void onDone(String utteranceId) {
                            speaking = false;
                        }

                        @Override
                        public void onError(String utteranceId) {
                            speaking = false;
                        }
                    });
                int result = textToSpeech.setLanguage(Locale.forLanguageTag(language));
                if (result == TextToSpeech.LANG_MISSING_DATA
                    || result == TextToSpeech.LANG_NOT_SUPPORTED) {
                    Log.w(TAG, "Language not supported by TTS: " + language);
                    textToSpeech.setLanguage(Locale.US);
                }
                ttsReady = true;
                Log.i(TAG, "TTS initialized");
            } else {
                Log.e(TAG, "TTS initialization failed: " + status);
            }
        });
    }

    /**
     * Start listening for voice commands.
     */
    public void startListening() {
        if (speechRecognizer == null) {
            Log.e(TAG, "SpeechRecognizer not available");
            return;
        }

        Log.i(TAG, "Starting voice recognition");
        Intent intent = new Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH);
        intent.putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL,
            RecognizerIntent.LANGUAGE_MODEL_FREE_FORM);
        intent.putExtra(RecognizerIntent.EXTRA_LANGUAGE, language);
        intent.putExtra(RecognizerIntent.EXTRA_PARTIAL_RESULTS, true);
        intent.putExtra(RecognizerIntent.EXTRA_MAX_RESULTS, 1);

        try {
            speechRecognizer.startListening(intent);
            listening = true;
        } catch (Exception e) {
            Log.e(TAG, "Failed to start voice recognition", e);
            listening = false;
        }
    }

    /**
     * Stop listening for voice commands.
     */
    public void stopListening() {
        Log.i(TAG, "Stopping voice recognition");
        if (speechRecognizer != null) {
            try {
                speechRecognizer.stopListening();
            } catch (Exception e) {
                Log.e(TAG, "Failed to stop voice recognition", e);
            }
        }
        listening = false;
    }

    /**
     * Process a recognized speech result: run intent detection and notify
     * the registered command listener.
     */
    private void handleRecognizedText(String text) {
        ModelFabricClient.IntentDetectionResult intentResult =
            modelFabricClient.detectIntent(text);

        String intent = "unknown";
        float intentConfidence = 0.0f;
        if (intentResult != null) {
            intent = intentResult.intent;
            intentConfidence = intentResult.confidence;
            Log.i(TAG, "Intent detected: " + intent
                + " (confidence: " + intentConfidence + ")");
        }

        VoiceCommand command = new VoiceCommand(
            UUID.randomUUID().toString(),
            text,
            1.0f,
            intent,
            intentConfidence
        );
        lastCommand = command;

        if (commandListener != null) {
            commandListener.onCommand(command);
        }
    }

    /**
     * Register a listener invoked when a full voice command is recognized.
     */
    public void setOnCommandListener(OnCommandListener listener) {
        this.commandListener = listener;
    }

    /**
     * Get the most recently recognized voice command, if any.
     */
    public VoiceCommand getLastCommand() {
        return lastCommand;
    }

    /**
     * Process audio input and return voice command.
     *
     * NOTE: Raw PCM buffers cannot be fed to Android SpeechRecognizer.
     * Real recognition happens through {@link #startListening()} and the
     * {@link OnCommandListener} callback. This method returns the most
     * recently recognized command, or an empty command if none exists.
     */
    public VoiceCommand processCommand(byte[] audio) {
        Log.d(TAG, "processCommand called with " + audio.length
            + " bytes — returning last recognized command");
        if (lastCommand != null) {
            return lastCommand;
        }
        return new VoiceCommand(UUID.randomUUID().toString(), "", 0.0f, "unknown", 0.0f);
    }

    /**
     * Speak text using text-to-speech.
     */
    public void speak(String text) {
        Log.i(TAG, "Speaking: " + text);

        if (textToSpeech == null) {
            Log.e(TAG, "TTS not initialized");
            return;
        }

        int result = textToSpeech.speak(text, TextToSpeech.QUEUE_FLUSH, null, "sigil-utterance");
        speaking = result != TextToSpeech.ERROR;
        if (!speaking) {
            Log.e(TAG, "TTS speak failed");
        }
    }

    /**
     * Set language for voice recognition and TTS.
     */
    public void setLanguage(String language) {
        Log.i(TAG, "Setting language to: " + language);
        this.language = language;

        if (textToSpeech != null) {
            textToSpeech.setLanguage(Locale.forLanguageTag(language));
        }
        if (listening) {
            stopListening();
            startListening();
        }
    }

    /**
     * Release speech resources.
     */
    public void shutdown() {
        stopListening();
        if (speechRecognizer != null) {
            speechRecognizer.destroy();
            speechRecognizer = null;
        }
        if (textToSpeech != null) {
            textToSpeech.stop();
            textToSpeech.shutdown();
            textToSpeech = null;
            ttsReady = false;
        }
    }

    // Getters
    public String getId() { return id; }
    public boolean isListening() { return listening; }
    public boolean isSpeaking() { return speaking; }
    public String getLanguage() { return language; }
    public Context getContext() { return context; }

    /**
     * Callback invoked when a voice command has been recognized and its
     * intent classified.
     */
    public interface OnCommandListener {
        void onCommand(VoiceCommand command);
    }

    /**
     * Voice command representation.
     */
    public static class VoiceCommand {
        private final String id;
        private final String command;
        private final float confidence;
        private final String intent;
        private final float intentConfidence;

        public VoiceCommand(String id, String command, float confidence) {
            this(id, command, confidence, "unknown", 0.0f);
        }

        public VoiceCommand(String id, String command, float confidence,
                            String intent, float intentConfidence) {
            this.id = id;
            this.command = command;
            this.confidence = confidence;
            this.intent = intent;
            this.intentConfidence = intentConfidence;
        }

        public String getId() { return id; }
        public String getCommand() { return command; }
        public float getConfidence() { return confidence; }
        public String getIntent() { return intent; }
        public float getIntentConfidence() { return intentConfidence; }
    }
}
