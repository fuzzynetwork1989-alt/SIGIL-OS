package com.sigilos.quest;

import android.app.Activity;
import android.content.pm.PackageManager;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.util.Log;
import android.view.WindowManager;
import android.widget.TextView;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

/**
 * XR Activity for SIGIL OS Quest 3.
 * Manages the OpenXR session, rendering, and Quest runtime components.
 */
public class XRActivity extends Activity {
    private static final String TAG = "XRActivity";

    private static final int PERMISSION_REQUEST_CODE = 1001;
    private static final String[] REQUIRED_PERMISSIONS = new String[]{
        android.Manifest.permission.RECORD_AUDIO,
        android.Manifest.permission.CAMERA
    };

    private QuestRuntime questRuntime;
    private TextView statusText;
    private final ExecutorService backgroundExecutor = Executors.newSingleThreadExecutor();
    private final Handler uiHandler = new Handler(Looper.getMainLooper());

    // Native method declarations
    private native void nativeOnCreate();
    private native void nativeOnResume();
    private native void nativeOnPause();
    private native void nativeOnDestroy();

    static {
        try {
            System.loadLibrary("sigil_quest");
            Log.i(TAG, "Native library loaded successfully");
        } catch (UnsatisfiedLinkError e) {
            Log.e(TAG, "Failed to load native library: " + e.getMessage());
        }
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Keep screen on
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);

        // Minimal status overlay (XR rendering is handled by the native layer)
        statusText = new TextView(this);
        statusText.setTextColor(0xFF00FF88);
        statusText.setTextSize(14);
        statusText.setPadding(48, 48, 48, 48);
        statusText.setText("SIGIL OS Quest 3\nInitializing...");
        setContentView(statusText);

        Log.i(TAG, "XR Activity created");

        // Initialize native XR session
        nativeOnCreate();

        // Request runtime permissions before starting sensors
        if (!hasRequiredPermissions()) {
            requestPermissions(REQUIRED_PERMISSIONS, PERMISSION_REQUEST_CODE);
        } else {
            startQuestRuntime();
        }
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if (requestCode == PERMISSION_REQUEST_CODE) {
            boolean allGranted = true;
            for (int result : grantResults) {
                if (result != PackageManager.PERMISSION_GRANTED) {
                    allGranted = false;
                    break;
                }
            }
            if (allGranted) {
                startQuestRuntime();
            } else {
                setStatus("Permissions denied. Voice and vision features are disabled.\nGrant RECORD_AUDIO and CAMERA in system settings to enable them.");
                Log.w(TAG, "Required permissions denied");
            }
        }
    }

    private boolean hasRequiredPermissions() {
        for (String permission : REQUIRED_PERMISSIONS) {
            if (checkSelfPermission(permission) != PackageManager.PERMISSION_GRANTED) {
                return false;
            }
        }
        return true;
    }

    /**
     * Start the SIGIL Quest runtime on a background thread.
     * Initialization performs network calls (device auth, service discovery)
     * which must not run on the main thread.
     */
    private void startQuestRuntime() {
        setStatus("SIGIL OS Quest 3\nConnecting to cognitive services...");
        backgroundExecutor.execute(() -> {
            try {
                questRuntime = new QuestRuntime(this);
                questRuntime.initialize();
                uiHandler.post(() -> {
                    if (questRuntime.isInitialized()) {
                        if (questRuntime.isBackendConnected()) {
                            setStatus("SIGIL OS is ready.\nSay \"SIGIL\" to invoke the companion.");
                        } else {
                            setStatus("SIGIL OS running in offline mode.\nCognitive services unreachable — check adb reverse / host connection.");
                        }
                    } else {
                        setStatus("SIGIL OS runtime failed to initialize.\nCheck adb logcat for details.");
                    }
                });
            } catch (Exception e) {
                Log.e(TAG, "Quest runtime initialization failed", e);
                uiHandler.post(() -> setStatus("SIGIL OS error: " + e.getMessage()));
            }
        });
    }

    private void setStatus(String text) {
        if (statusText != null) {
            statusText.setText(text);
        }
    }

    @Override
    protected void onResume() {
        super.onResume();
        Log.i(TAG, "XR Activity resumed");
        nativeOnResume();
    }

    @Override
    protected void onPause() {
        super.onPause();
        Log.i(TAG, "XR Activity paused");
        nativeOnPause();
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        Log.i(TAG, "XR Activity destroyed");

        if (questRuntime != null) {
            questRuntime.shutdown();
            questRuntime = null;
        }
        backgroundExecutor.shutdown();

        nativeOnDestroy();
    }
}
