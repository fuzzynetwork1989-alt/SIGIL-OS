package com.sigilos.quest;

import android.content.Context;
import android.util.Log;
import org.json.JSONObject;
import org.json.JSONArray;
import java.util.UUID;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

/**
 * Quest Runtime - Main runtime coordinator for SIGIL OS on Quest 3.
 * Integrates all Quest components: Voice, Hand, Eye, Spatial, Avatar, Presence.
 * Follows SCA-1R Phase 11 runtime stack.
 */
public class QuestRuntime {
    private static final String TAG = "QuestRuntime";

    // Runtime components
    private VoiceAssistant voiceAssistant;
    private HandTracking handTracking;
    private EyeTracking eyeTracking;
    private SpatialMapping spatialMapping;
    private MixedReality mixedReality;
    private PersonalCompanion companion;
    private PresenceEngine presenceEngine;
    private VisionProcessor visionProcessor;

    // SCA-1R Cognitive Integration
    private CognitiveServiceClient cognitiveClient;
    private ModelFabricClient modelFabricClient;

    // Configuration
    private static final String COGNITIVE_SERVICES_URL = "http://localhost:8080";
    private static final String COGNITIVE_SERVICES_API_KEY = "sigil-api-key";
    private static final String MODEL_FABRIC_URL = "http://localhost:8080";
    private static final String MODEL_FABRIC_API_KEY = "sigil-api-key";

    private String deviceId;
    private String userId;
    private Context context;
    private boolean initialized;
    private boolean backendConnected;
    private RuntimeState state;
    private final ExecutorService commandExecutor = Executors.newSingleThreadExecutor();

    public QuestRuntime(Context context) {
        this.context = context;
        this.initialized = false;
        this.state = RuntimeState.IDLE;

        // Generate device ID
        this.deviceId = UUID.randomUUID().toString();

        // Set default user ID (this would come from login/registration)
        this.userId = "user-" + deviceId.substring(0, 8);
    }

    /**
     * Initialize Quest Runtime.
     * Follows SCA-1R Phase 11 runtime stack initialization.
     */
    public void initialize() {
        Log.i(TAG, "Initializing Quest Runtime");

        // Initialize cognitive services client
        cognitiveClient = new CognitiveServiceClient(
            COGNITIVE_SERVICES_URL,
            COGNITIVE_SERVICES_API_KEY
        );

        // Initialize Model Fabric client
        modelFabricClient = new ModelFabricClient(
            MODEL_FABRIC_URL,
            MODEL_FABRIC_API_KEY
        );

        // Authenticate device with Identity Vault.
        // Failure is non-fatal: the runtime continues in offline mode so
        // on-device features (voice, presence) still work without a backend.
        boolean authenticated = cognitiveClient.authenticateDevice(deviceId);
        this.backendConnected = authenticated;
        if (authenticated) {
            Log.i(TAG, "Device authenticated successfully");
        } else {
            Log.w(TAG, "Device authentication failed — continuing in offline mode");
        }

        // Initialize runtime components
        voiceAssistant = new VoiceAssistant(context, MODEL_FABRIC_URL, MODEL_FABRIC_API_KEY);
        voiceAssistant.setOnCommandListener(this::handleVoiceCommand);
        handTracking = new HandTracking(context);
        eyeTracking = new EyeTracking(context);
        spatialMapping = new SpatialMapping(context);
        mixedReality = new MixedReality(context);
        companion = new PersonalCompanion("SIGIL", cognitiveClient);
        presenceEngine = new PresenceEngine();
        visionProcessor = new VisionProcessor(context, null, MODEL_FABRIC_URL, MODEL_FABRIC_API_KEY);

        // Connect eye tracking to spatial mapping for object detection
        eyeTracking.setSpatialMapping(spatialMapping);

        // Start runtime components
        startComponents();

        this.initialized = true;
        this.state = RuntimeState.READY;

        Log.i(TAG, "Quest Runtime initialized successfully");
    }

    /**
     * Start all runtime components.
     */
    private void startComponents() {
        Log.i(TAG, "Starting runtime components");

        // Voice Runtime
        voiceAssistant.startListening();

        // Hand Runtime
        handTracking.startTracking();

        // Eye Runtime
        eyeTracking.startTracking();

        // Spatial Runtime
        spatialMapping.startMapping();

        // MR Runtime
        mixedReality.enablePassthrough();

        // Presence Engine
        presenceEngine.start();

        // Companion
        companion.activateCompanionMode();
    }

    /**
     * Process voice command through SCA-1R stack.
     * Pipeline: Voice → Model Fabric → PCR → Cognitive Assembly → Reasoner → Planner → Avatar
     *
     * NOTE: Raw audio buffers are not used for recognition — Android
     * SpeechRecognizer delivers text via {@link #handleVoiceCommand}. This
     * method converts the most recent recognized command (if any) and
     * dispatches it on the runtime executor.
     */
    public void processVoiceCommand(byte[] audio) {
        VoiceAssistant.VoiceCommand command = voiceAssistant.processCommand(audio);
        handleVoiceCommand(command);
    }

    /**
     * Handle a recognized voice command through the SCA-1R stack.
     * Runs on the runtime executor — never call on the main thread.
     */
    public void handleVoiceCommand(VoiceAssistant.VoiceCommand command) {
        Log.i(TAG, "Processing voice command through SCA-1R stack: " + command.getCommand());

        if (!initialized || command.getCommand() == null || command.getCommand().isEmpty()) {
            return;
        }

        commandExecutor.execute(() -> runVoicePipeline(command));
    }

    private void runVoicePipeline(VoiceAssistant.VoiceCommand command) {
        if (!initialized) {
            Log.e(TAG, "Runtime not initialized");
            return;
        }

        this.state = RuntimeState.PROCESSING;

        // Step 2: Intent detection via Model Fabric
        ModelFabricClient.IntentDetectionResult intentResult =
            modelFabricClient.detectIntent(command.getCommand());

        if (intentResult == null) {
            Log.e(TAG, "Intent detection failed");
            this.state = RuntimeState.READY;
            return;
        }

        Log.i(TAG, "Intent detected: " + intentResult.intent + " (confidence: " + intentResult.confidence + ")");

        // Step 3: Assemble context via PCR
        JSONObject spatialData = getSpatialData();
        JSONObject context = cognitiveClient.assembleContext(userId, null, spatialData);

        if (context == null) {
            Log.e(TAG, "Context assembly failed");
            this.state = RuntimeState.READY;
            return;
        }

        Log.i(TAG, "Context assembled successfully");

        // Step 4: Create cognitive assembly
        JSONObject mind = cognitiveClient.createTemporaryMind(context, "voice_command");

        if (mind == null) {
            Log.e(TAG, "Cognitive assembly creation failed");
            this.state = RuntimeState.READY;
            return;
        }

        Log.i(TAG, "Cognitive assembly created successfully");

        // Step 5: Reason about command
        String reasoning = cognitiveClient.reason(context, command.getCommand());

        if (reasoning == null) {
            Log.e(TAG, "Reasoning failed");
            this.state = RuntimeState.READY;
            return;
        }

        Log.i(TAG, "Reasoning: " + reasoning);

        // Step 6: Plan action
        JSONObject actionPlan = cognitiveClient.planAction(context, intentResult.intent);

        if (actionPlan == null) {
            Log.e(TAG, "Action planning failed");
            this.state = RuntimeState.READY;
            return;
        }

        Log.i(TAG, "Action plan created successfully");

        // Step 7: Execute via avatar
        executeAction(actionPlan);

        this.state = RuntimeState.READY;
    }

    /**
     * Process gesture through SCA-1R stack.
     */
    public void processGesture(HandTracking.Gesture gesture) {
        Log.i(TAG, "Processing gesture through SCA-1R stack");

        if (!initialized) {
            Log.e(TAG, "Runtime not initialized");
            return;
        }

        this.state = RuntimeState.PROCESSING;

        // TODO: Map gesture to action via Planner
        // TODO: Execute via Avatar

        Log.i(TAG, "Gesture processed: " + gesture.getGestureType());

        this.state = RuntimeState.READY;
    }

    /**
     * Process gaze through SCA-1R stack.
     */
    public void processGaze(EyeTracking.GazeData gaze) {
        Log.i(TAG, "Processing gaze through SCA-1R stack");

        if (!initialized) {
            Log.e(TAG, "Runtime not initialized");
            return;
        }

        this.state = RuntimeState.PROCESSING;

        // TODO: Detect object in gaze
        // TODO: Assemble context via PCR
        // TODO: Provide explanation via Cognitive Assembly

        Log.i(TAG, "Gaze processed");

        this.state = RuntimeState.READY;
    }

    /**
     * Get spatial data for context assembly.
     */
    private JSONObject getSpatialData() {
        JSONObject spatialData = new JSONObject();

        try {
            // Add room mapping data
            JSONArray meshes = new JSONArray();
            for (SpatialMapping.Mesh mesh : spatialMapping.getMeshes()) {
                JSONObject meshJson = new JSONObject();
                meshJson.put("id", mesh.getId());
                meshes.put(meshJson);
            }
            spatialData.put("meshes", meshes);

            // Add current position
            JSONObject position = new JSONObject();
            position.put("x", 0.0);
            position.put("y", 0.0);
            position.put("z", 0.0);
            spatialData.put("position", position);
        } catch (Exception e) {
            Log.e(TAG, "Failed to get spatial data", e);
        }

        return spatialData;
    }

    /**
     * Execute action plan.
     */
    private void executeAction(JSONObject actionPlan) {
        Log.i(TAG, "Executing action plan");

        try {
            String actionType = actionPlan.optString("action_type", "unknown");

            switch (actionType) {
                case "walk_to":
                    JSONArray destArray = actionPlan.optJSONArray("destination");
                    if (destArray != null && destArray.length() >= 3) {
                        float[] destination = new float[]{
                            (float) destArray.getDouble(0),
                            (float) destArray.getDouble(1),
                            (float) destArray.getDouble(2)
                        };
                        // TODO: Implement avatar walk to destination
                        Log.i(TAG, "Walking to: " + destination[0] + ", " + destination[1] + ", " + destination[2]);
                    }
                    break;
                case "speak":
                    String text = actionPlan.optString("text", "");
                    voiceAssistant.speak(text);
                    break;
                case "gesture":
                    String gesture = actionPlan.optString("gesture", "");
                    // TODO: Implement avatar gesture
                    Log.i(TAG, "Playing gesture: " + gesture);
                    break;
                default:
                    Log.w(TAG, "Unknown action type: " + actionType);
            }
        } catch (Exception e) {
            Log.e(TAG, "Failed to execute action", e);
        }
    }

    /**
     * Shutdown Quest Runtime.
     */
    public void shutdown() {
        Log.i(TAG, "Shutting down Quest Runtime");

        if (!initialized) {
            return;
        }

        // Stop components
        voiceAssistant.shutdown();
        handTracking.stopTracking();
        eyeTracking.stopTracking();
        spatialMapping.stopMapping();
        mixedReality.disablePassthrough();
        presenceEngine.stop();
        visionProcessor.shutdown();

        this.initialized = false;
        this.state = RuntimeState.SHUTDOWN;
        commandExecutor.shutdown();

        Log.i(TAG, "Quest Runtime shutdown complete");
    }

    // Getters
    public boolean isInitialized() { return initialized; }
    public boolean isBackendConnected() { return backendConnected; }
    public RuntimeState getState() { return state; }
    public VoiceAssistant getVoiceAssistant() { return voiceAssistant; }
    public HandTracking getHandTracking() { return handTracking; }
    public EyeTracking getEyeTracking() { return eyeTracking; }
    public SpatialMapping getSpatialMapping() { return spatialMapping; }
    public MixedReality getMixedReality() { return mixedReality; }
    public PersonalCompanion getCompanion() { return companion; }
    public PresenceEngine getPresenceEngine() { return presenceEngine; }
    public VisionProcessor getVisionProcessor() { return visionProcessor; }
    public String getDeviceId() { return deviceId; }
    public String getUserId() { return userId; }

    /**
     * Runtime state enum.
     */
    public enum RuntimeState {
        IDLE, INITIALIZING, READY, PROCESSING, SHUTDOWN
    }
}
