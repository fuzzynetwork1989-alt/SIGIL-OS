package com.sigilos.quest;

import android.util.Log;
import org.json.JSONObject;
import java.util.UUID;

/**
 * Personal Companion for Quest 3.
 * Manages companion state and interaction modes.
 * Integrates with SCA-1R Cognitive Services for mode-specific cognitive assemblies.
 */
public class PersonalCompanion {
    private static final String TAG = "PersonalCompanion";

    private String id;
    private String name;
    private CompanionState state;
    private InteractionMode mode;
    private CognitiveServiceClient cognitiveClient;
    private JSONObject currentMind;

    public PersonalCompanion(String name, CognitiveServiceClient cognitiveClient) {
        this.id = UUID.randomUUID().toString();
        this.name = name;
        this.state = CompanionState.IDLE;
        this.mode = InteractionMode.VOICE_AND_GESTURE;
        this.cognitiveClient = cognitiveClient;
        this.currentMind = null;
    }

    /**
     * Set companion state.
     */
    public void setState(CompanionState state) {
        Log.i(TAG, "Setting state to: " + state);
        this.state = state;
    }

    /**
     * Set interaction mode.
     */
    public void setMode(InteractionMode mode) {
        Log.i(TAG, "Setting mode to: " + mode);
        this.mode = mode;
    }

    /**
     * Activate companion (SCA-1R Companion Mode).
     */
    public void activateCompanionMode() {
        Log.i(TAG, "Activating Companion Mode");
        this.state = CompanionState.ACTIVE;
        this.mode = InteractionMode.VOICE_AND_GESTURE;
        
        // Create companion-specific cognitive assembly
        try {
            JSONObject context = new JSONObject();
            context.put("mode", "companion");
            context.put("companion_name", name);
            
            currentMind = cognitiveClient.createTemporaryMind(context, "companion_mode");
            
            if (currentMind != null) {
                Log.i(TAG, "Companion mode cognitive assembly created successfully");
            } else {
                Log.w(TAG, "Failed to create companion mode cognitive assembly");
            }
        } catch (Exception e) {
            Log.e(TAG, "Failed to activate companion mode", e);
        }
    }

    /**
     * Activate collaboration mode (SCA-1R).
     */
    public void activateCollaborationMode() {
        Log.i(TAG, "Activating Collaboration Mode");
        this.state = CompanionState.ACTIVE;
        this.mode = InteractionMode.VOICE_AND_GESTURE;
        
        // Create collaboration-specific cognitive assembly
        try {
            JSONObject context = new JSONObject();
            context.put("mode", "collaboration");
            context.put("companion_name", name);
            
            currentMind = cognitiveClient.createTemporaryMind(context, "collaboration_mode");
            
            if (currentMind != null) {
                Log.i(TAG, "Collaboration mode cognitive assembly created successfully");
            } else {
                Log.w(TAG, "Failed to create collaboration mode cognitive assembly");
            }
        } catch (Exception e) {
            Log.e(TAG, "Failed to activate collaboration mode", e);
        }
    }

    /**
     * Activate research mode (SCA-1R).
     */
    public void activateResearchMode() {
        Log.i(TAG, "Activating Research Mode");
        this.state = CompanionState.PROCESSING;
        this.mode = InteractionMode.VOICE;
        
        // Create research-specific cognitive assembly
        try {
            JSONObject context = new JSONObject();
            context.put("mode", "research");
            context.put("companion_name", name);
            
            currentMind = cognitiveClient.createTemporaryMind(context, "research_mode");
            
            if (currentMind != null) {
                Log.i(TAG, "Research mode cognitive assembly created successfully");
            } else {
                Log.w(TAG, "Failed to create research mode cognitive assembly");
            }
        } catch (Exception e) {
            Log.e(TAG, "Failed to activate research mode", e);
        }
    }

    /**
     * Activate teaching mode (SCA-1R).
     */
    public void activateTeachingMode() {
        Log.i(TAG, "Activating Teaching Mode");
        this.state = CompanionState.ACTIVE;
        this.mode = InteractionMode.VOICE_AND_GESTURE;
        
        // Create teaching-specific cognitive assembly
        try {
            JSONObject context = new JSONObject();
            context.put("mode", "teaching");
            context.put("companion_name", name);
            
            currentMind = cognitiveClient.createTemporaryMind(context, "teaching_mode");
            
            if (currentMind != null) {
                Log.i(TAG, "Teaching mode cognitive assembly created successfully");
            } else {
                Log.w(TAG, "Failed to create teaching mode cognitive assembly");
            }
        } catch (Exception e) {
            Log.e(TAG, "Failed to activate teaching mode", e);
        }
    }

    /**
     * Activate presentation mode (SCA-1R).
     */
    public void activatePresentationMode() {
        Log.i(TAG, "Activating Presentation Mode");
        this.state = CompanionState.ACTIVE;
        this.mode = InteractionMode.VOICE;
        
        // Create presentation-specific cognitive assembly
        try {
            JSONObject context = new JSONObject();
            context.put("mode", "presentation");
            context.put("companion_name", name);
            
            currentMind = cognitiveClient.createTemporaryMind(context, "presentation_mode");
            
            if (currentMind != null) {
                Log.i(TAG, "Presentation mode cognitive assembly created successfully");
            } else {
                Log.w(TAG, "Failed to create presentation mode cognitive assembly");
            }
        } catch (Exception e) {
            Log.e(TAG, "Failed to activate presentation mode", e);
        }
    }
    
    /**
     * Query current cognitive assembly.
     */
    public String queryMind(String query) {
        Log.i(TAG, "Querying mind: " + query);
        
        if (currentMind == null) {
            Log.w(TAG, "No active cognitive assembly");
            return null;
        }
        
        try {
            return cognitiveClient.reason(currentMind, query);
        } catch (Exception e) {
            Log.e(TAG, "Failed to query mind", e);
            return null;
        }
    }

    // Getters
    public String getId() { return id; }
    public String getName() { return name; }
    public CompanionState getState() { return state; }
    public InteractionMode getMode() { return mode; }
    public JSONObject getCurrentMind() { return currentMind; }

    /**
     * Companion state enum.
     */
    public enum CompanionState {
        IDLE, ACTIVE, SLEEP, PROCESSING
    }

    /**
     * Interaction mode enum.
     */
    public enum InteractionMode {
        VOICE, GESTURE, VOICE_AND_GESTURE, AUTONOMOUS
    }
}
