package com.sigilos.quest;

import android.content.Context;
import androidx.test.ext.junit.runners.AndroidJUnit4;
import androidx.test.platform.app.InstrumentationRegistry;
import org.junit.Test;
import org.junit.runner.RunWith;
import static org.junit.Assert.*;

/**
 * Instrumented test for Quest Runtime.
 * Tests Quest 3 runtime components on device or emulator.
 */
@RunWith(AndroidJUnit4.class)
public class QuestRuntimeTest {

    @Test
    public void useAppContext() {
        Context appContext = InstrumentationRegistry.getInstrumentation().getTargetContext();
        assertEquals("com.sigilos.quest", appContext.getPackageName());
    }

    @Test
    public void testQuestRuntimeInitialization() {
        QuestRuntime runtime = new QuestRuntime();
        assertFalse(runtime.isInitialized());
        assertEquals(QuestRuntime.RuntimeState.IDLE, runtime.getState());

        runtime.initialize();
        assertTrue(runtime.isInitialized());
        assertEquals(QuestRuntime.RuntimeState.READY, runtime.getState());

        runtime.shutdown();
        assertFalse(runtime.isInitialized());
        assertEquals(QuestRuntime.RuntimeState.SHUTDOWN, runtime.getState());
    }

    @Test
    public void testVoiceAssistant() {
        VoiceAssistant assistant = new VoiceAssistant();
        assertNotNull(assistant.getId());
        assertFalse(assistant.isListening());
        assertEquals("en-US", assistant.getLanguage());

        assistant.startListening();
        assertTrue(assistant.isListening());

        assistant.stopListening();
        assertFalse(assistant.isListening());
    }

    @Test
    public void testHandTracking() {
        HandTracking tracking = new HandTracking();
        assertNotNull(tracking.getId());
        assertFalse(tracking.isActive());
        assertTrue(tracking.getHands().isEmpty());

        tracking.startTracking();
        assertTrue(tracking.isActive());

        tracking.stopTracking();
        assertFalse(tracking.isActive());
    }

    @Test
    public void testEyeTracking() {
        EyeTracking tracking = new EyeTracking();
        assertNotNull(tracking.getId());
        assertFalse(tracking.isActive());
        assertNotNull(tracking.getCurrentGaze());

        tracking.startTracking();
        assertTrue(tracking.isActive());

        tracking.stopTracking();
        assertFalse(tracking.isActive());
    }

    @Test
    public void testSpatialMapping() {
        SpatialMapping mapping = new SpatialMapping();
        assertNotNull(mapping.getId());
        assertFalse(mapping.isActive());
        assertTrue(mapping.getMeshes().isEmpty());

        mapping.startMapping();
        assertTrue(mapping.isActive());

        mapping.stopMapping();
        assertFalse(mapping.isActive());
    }

    @Test
    public void testMixedReality() {
        MixedReality mr = new MixedReality();
        assertNotNull(mr.getId());
        assertFalse(mr.isPassthroughEnabled());
        assertTrue(mr.getAnchors().isEmpty());

        mr.enablePassthrough();
        assertTrue(mr.isPassthroughEnabled());

        mr.disablePassthrough();
        assertFalse(mr.isPassthroughEnabled());
    }

    @Test
    public void testPersonalCompanion() {
        PersonalCompanion companion = new PersonalCompanion("SIGIL");
        assertNotNull(companion.getId());
        assertEquals("SIGIL", companion.getName());
        assertEquals(PersonalCompanion.CompanionState.IDLE, companion.getState());
        assertEquals(PersonalCompanion.InteractionMode.VOICE_AND_GESTURE, companion.getMode());

        companion.setState(PersonalCompanion.CompanionState.ACTIVE);
        assertEquals(PersonalCompanion.CompanionState.ACTIVE, companion.getState());

        companion.setMode(PersonalCompanion.InteractionMode.VOICE);
        assertEquals(PersonalCompanion.InteractionMode.VOICE, companion.getMode());
    }

    @Test
    public void testPresenceEngine() {
        PresenceEngine engine = new PresenceEngine();
        assertNotNull(engine.getId());
        assertFalse(engine.isActive());
        assertNotNull(engine.getPresenceState());

        engine.start();
        assertTrue(engine.isActive());

        engine.stop();
        assertFalse(engine.isActive());
    }

    @Test
    public void testVisionProcessor() {
        VisionProcessor processor = new VisionProcessor();
        assertNotNull(processor.getId());
        assertFalse(processor.isCameraInitialized());
        assertFalse(processor.hasPermission());

        processor.initializeCamera();
        assertTrue(processor.isCameraInitialized());

        processor.shutdown();
        assertFalse(processor.isCameraInitialized());
    }
}
