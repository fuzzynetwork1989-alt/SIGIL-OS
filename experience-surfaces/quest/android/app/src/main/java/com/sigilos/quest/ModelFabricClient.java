package com.sigilos.quest;

import android.util.Log;
import org.json.JSONObject;
import org.json.JSONArray;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;

/**
 * HTTP Client for Model Fabric API.
 * Connects Quest runtime to SIGIL OS Model Fabric service.
 */
public class ModelFabricClient {
    private static final String TAG = "ModelFabricClient";
    
    private String baseUrl;
    private String apiKey;
    
    public ModelFabricClient(String baseUrl, String apiKey) {
        this.baseUrl = baseUrl;
        this.apiKey = apiKey;
    }
    
    /**
     * Detect intent from voice command.
     */
    public IntentDetectionResult detectIntent(String command) {
        Log.i(TAG, "Detecting intent from: " + command);
        
        try {
            JSONObject requestBody = new JSONObject();
            requestBody.put("command", command);
            requestBody.put("model", "qwen-7b");
            
            HttpURLConnection conn = createConnection("/api/v1/intent/detect", "POST");
            conn.setDoOutput(true);
            
            OutputStream os = conn.getOutputStream();
            os.write(requestBody.toString().getBytes(StandardCharsets.UTF_8));
            os.flush();
            os.close();
            
            int responseCode = conn.getResponseCode();
            if (responseCode == 200) {
                BufferedReader br = new BufferedReader(
                    new InputStreamReader(conn.getInputStream())
                );
                StringBuilder response = new StringBuilder();
                String line;
                while ((line = br.readLine()) != null) {
                    response.append(line);
                }
                br.close();
                
                JSONObject jsonResponse = new JSONObject(response.toString());
                return parseIntentDetectionResult(jsonResponse);
            } else {
                Log.e(TAG, "Intent detection failed: " + responseCode);
                return null;
            }
        } catch (Exception e) {
            Log.e(TAG, "Intent detection error", e);
            return null;
        }
    }
    
    /**
     * Process vision frame.
     */
    public VisionResult processVision(byte[] imageBytes) {
        Log.i(TAG, "Processing vision frame");
        
        try {
            // Convert image to base64
            String base64Image = android.util.Base64.encodeToString(
                imageBytes, 
                android.util.Base64.DEFAULT
            );
            
            JSONObject requestBody = new JSONObject();
            requestBody.put("image", base64Image);
            requestBody.put("model", "qwen-vl");
            
            HttpURLConnection conn = createConnection("/api/v1/vision/process", "POST");
            conn.setDoOutput(true);
            
            OutputStream os = conn.getOutputStream();
            os.write(requestBody.toString().getBytes(StandardCharsets.UTF_8));
            os.flush();
            os.close();
            
            int responseCode = conn.getResponseCode();
            if (responseCode == 200) {
                BufferedReader br = new BufferedReader(
                    new InputStreamReader(conn.getInputStream())
                );
                StringBuilder response = new StringBuilder();
                String line;
                while ((line = br.readLine()) != null) {
                    response.append(line);
                }
                br.close();
                
                JSONObject jsonResponse = new JSONObject(response.toString());
                return parseVisionResult(jsonResponse);
            } else {
                Log.e(TAG, "Vision processing failed: " + responseCode);
                return null;
            }
        } catch (Exception e) {
            Log.e(TAG, "Vision processing error", e);
            return null;
        }
    }
    
    /**
     * Create HTTP connection.
     */
    private HttpURLConnection createConnection(String endpoint, String method) throws Exception {
        URL url = new URL(baseUrl + endpoint);
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod(method);
        conn.setRequestProperty("Content-Type", "application/json");
        conn.setRequestProperty("Authorization", "Bearer " + apiKey);
        conn.setConnectTimeout(10000);
        conn.setReadTimeout(10000);
        return conn;
    }
    
    /**
     * Parse intent detection result.
     */
    private IntentDetectionResult parseIntentDetectionResult(JSONObject json) {
        String intent = json.optString("intent", "unknown");
        float confidence = (float) json.optDouble("confidence", 0.0);
        JSONObject entities = json.optJSONObject("entities");
        
        return new IntentDetectionResult(intent, confidence, entities);
    }
    
    /**
     * Parse vision result.
     */
    private VisionResult parseVisionResult(JSONObject json) {
        JSONArray objects = json.optJSONArray("objects");
        String[] detectedObjects = objects != null
            ? new String[objects.length()]
            : new String[0];
        if (objects != null) {
            for (int i = 0; i < objects.length(); i++) {
                detectedObjects[i] = objects.optString(i, "");
            }
        }
        
        String sceneType = json.optString("scene_type", "unknown");
        float confidence = (float) json.optDouble("confidence", 0.0);
        
        return new VisionResult(detectedObjects, sceneType, confidence);
    }
    
    /**
     * Intent detection result.
     */
    public static class IntentDetectionResult {
        public String intent;
        public float confidence;
        public JSONObject entities;
        
        public IntentDetectionResult(String intent, float confidence, JSONObject entities) {
            this.intent = intent;
            this.confidence = confidence;
            this.entities = entities;
        }
    }
    
    /**
     * Vision result.
     */
    public static class VisionResult {
        public String[] detectedObjects;
        public String sceneType;
        public float confidence;
        
        public VisionResult(String[] detectedObjects, String sceneType, float confidence) {
            this.detectedObjects = detectedObjects;
            this.sceneType = sceneType;
            this.confidence = confidence;
        }
    }
}
