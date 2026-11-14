package com.sigilos.quest;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.WindowManager;

/**
 * Main entry point for SIGIL OS Quest 3 application.
 * Initializes the XR session and launches the XR activity.
 */
public class MainActivity extends Activity {
    private static final String TAG = "MainActivity";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Keep screen on
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);

        Log.i(TAG, "SIGIL OS Quest 3 starting...");

        // Launch XR activity
        Intent intent = new Intent(this, XRActivity.class);
        startActivity(intent);

        finish();
    }
}
