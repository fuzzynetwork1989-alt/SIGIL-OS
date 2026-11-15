package com.sigilos.quest;

import android.util.Log;
import org.json.JSONArray;
import org.json.JSONObject;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;

/**
 * HTTP Client for SCA-1R Cognitive Services.
 * Connects Quest runtime to Identity Vault, PCR, Cognitive Assembly, and Planner.
 */
public class CognitiveServiceClient {
    private static final String TAG = "CognitiveServiceClient";
    
    private String baseUrl;
    private String apiKey;
    
    public CognitiveServiceClient(String baseUrl, String apiKey) {
        this.baseUrl = baseUrl;
        this.apiKey = apiKey;
    }
    
    // ==================== Identity Vault ====================
    
    /**
     * Authenticate Quest device.
     */
    public boolean authenticateDevice(String deviceId) {
        Log.i(TAG, "Authenticating device: " + deviceId);
        
        try {
            JSONObject requestBody = new JSONObject();
            requestBody.put("device_id", deviceId);
            requestBody.put("device_type", "quest3");
            
            HttpURLConnection conn = createConnection("/api/v1/identity/authenticate_device", "POST");
            conn.setDoOutput(true);
            
            OutputStream os = conn.getOutputStream();
            os.write(requestBody.toString().getBytes(StandardCharsets.UTF_8));
            os.flush();
            os.close();
            
            int responseCode = conn.getResponseCode();
            return responseCode == 200;
        } catch (Exception e) {
            Log.e(TAG, "Device authentication error", e);
            return false;
        }
    }
    
    /**
     * Get user capabilities.
     */
    public String[] getCapabilities(String userId) {
        Log.i(TAG, "Getting capabilities for user: " + userId);
        
        try {
            HttpURLConnection conn = createConnection("/api/v1/identity/capabilities?user_id=" + userId, "GET");
            
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
                
                JSONObject json = new JSONObject(response.toString());
                JSONArray capabilities = json.getJSONArray("capabilities");
                String[] result = new String[capabilities.length()];
                for (int i = 0; i < capabilities.length(); i++) {
                    result[i] = capabilities.getString(i);
                }
                return result;
            }
        } catch (Exception e) {
            Log.e(TAG, "Get capabilities error", e);
        }
        
        return new String[0];
    }
    
    /**
     * Check permission.
     */
    public boolean checkPermission(String userId, String capability) {
        Log.i(TAG, "Checking permission: " + capability + " for user: " + userId);
        
        try {
            HttpURLConnection conn = createConnection(
                "/api/v1/identity/check_permission?user_id=" + userId + "&capability=" + capability, 
                "GET"
            );
            
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
                
                JSONObject json = new JSONObject(response.toString());
                return json.getBoolean("allowed");
            }
        } catch (Exception e) {
            Log.e(TAG, "Check permission error", e);
        }
        
        return false;
    }
    
    // ==================== Persistent Context Router ====================
    
    /**
     * Assemble context.
     */
    public JSONObject assembleContext(String userId, String missionId, JSONObject spatialData) {
        Log.i(TAG, "Assembling context for user: " + userId + ", mission: " + missionId);
        
        try {
            JSONObject requestBody = new JSONObject();
            requestBody.put("user_id", userId);
            requestBody.put("mission_id", missionId);
            requestBody.put("spatial_data", spatialData);
            
            HttpURLConnection conn = createConnection("/api/v1/context/assemble", "POST");
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
                
                return new JSONObject(response.toString());
            }
        } catch (Exception e) {
            Log.e(TAG, "Assemble context error", e);
        }
        
        return null;
    }
    
    // ==================== Cognitive Assembly ====================
    
    /**
     * Create temporary mind.
     */
    public JSONObject createTemporaryMind(JSONObject context, String task) {
        Log.i(TAG, "Creating temporary mind for task: " + task);
        
        try {
            JSONObject requestBody = new JSONObject();
            requestBody.put("context", context);
            requestBody.put("task", task);
            
            HttpURLConnection conn = createConnection("/api/v1/cognitive/create_mind", "POST");
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
                
                return new JSONObject(response.toString());
            }
        } catch (Exception e) {
            Log.e(TAG, "Create temporary mind error", e);
        }
        
        return null;
    }
    
    /**
     * Reason about query.
     */
    public String reason(JSONObject context, String query) {
        Log.i(TAG, "Reasoning about: " + query);
        
        try {
            JSONObject requestBody = new JSONObject();
            requestBody.put("context", context);
            requestBody.put("query", query);
            
            HttpURLConnection conn = createConnection("/api/v1/cognitive/reason", "POST");
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
                
                JSONObject json = new JSONObject(response.toString());
                return json.getString("response");
            }
        } catch (Exception e) {
            Log.e(TAG, "Reason error", e);
        }
        
        return null;
    }
    
    // ==================== Planner ====================
    
    /**
     * Plan action.
     */
    public JSONObject planAction(JSONObject context, String intent) {
        Log.i(TAG, "Planning action for intent: " + intent);
        
        try {
            JSONObject requestBody = new JSONObject();
            requestBody.put("context", context);
            requestBody.put("intent", intent);
            
            HttpURLConnection conn = createConnection("/api/v1/planner/plan", "POST");
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
                
                return new JSONObject(response.toString());
            }
        } catch (Exception e) {
            Log.e(TAG, "Plan action error", e);
        }
        
        return null;
    }
    
    /**
     * Update mission.
     */
    public boolean updateMission(String missionId, JSONObject action) {
        Log.i(TAG, "Updating mission: " + missionId);
        
        try {
            JSONObject requestBody = new JSONObject();
            requestBody.put("mission_id", missionId);
            requestBody.put("action", action);
            
            HttpURLConnection conn = createConnection("/api/v1/planner/update_mission", "POST");
            conn.setDoOutput(true);
            
            OutputStream os = conn.getOutputStream();
            os.write(requestBody.toString().getBytes(StandardCharsets.UTF_8));
            os.flush();
            os.close();
            
            int responseCode = conn.getResponseCode();
            return responseCode == 200;
        } catch (Exception e) {
            Log.e(TAG, "Update mission error", e);
            return false;
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
}
