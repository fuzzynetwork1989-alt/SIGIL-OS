#include <jni.h>
#include <cstring>
#include <android/log.h>
#include <android/native_window.h>
#include <android/native_window_jni.h>

#include <openxr/openxr.h>
#include <openxr/openxr_platform.h>

#define LOG_TAG "SIGIL_Quest_Native"
#define LOGI(...) __android_log_print(ANDROID_LOG_INFO, LOG_TAG, __VA_ARGS__)
#define LOGE(...) __android_log_print(ANDROID_LOG_ERROR, LOG_TAG, __VA_ARGS__)

// Global OpenXR instance
static XrInstance g_instance = XR_NULL_HANDLE;
static XrSession g_session = XR_NULL_HANDLE;
static XrSystemId g_systemId = XR_NULL_SYSTEM_ID;

extern "C" {

JNIEXPORT void JNICALL
Java_com_sigilos_quest_XRActivity_nativeOnCreate(JNIEnv* env, jobject thiz) {
    LOGI("nativeOnCreate called");

    // Initialize OpenXR
    XrInstanceCreateInfo createInfo{XR_TYPE_INSTANCE_CREATE_INFO};
    strcpy(createInfo.applicationInfo.applicationName, "SIGIL OS Quest 3");
    createInfo.applicationInfo.applicationVersion = 1;
    strcpy(createInfo.applicationInfo.engineName, "SIGIL");
    createInfo.applicationInfo.engineVersion = 1;
    createInfo.applicationInfo.apiVersion = XR_CURRENT_API_VERSION;

    // Create instance
    XrResult result = xrCreateInstance(&createInfo, &g_instance);
    if (result != XR_SUCCESS) {
        LOGE("Failed to create OpenXR instance: %d", result);
        return;
    }

    LOGI("OpenXR instance created successfully");

    // Get system
    XrSystemGetInfo systemInfo{XR_TYPE_SYSTEM_GET_INFO};
    systemInfo.formFactor = XR_FORM_FACTOR_HEAD_MOUNTED_DISPLAY;
    result = xrGetSystem(g_instance, &systemInfo, &g_systemId);
    if (result != XR_SUCCESS) {
        LOGE("Failed to get system: %d", result);
        return;
    }

    LOGI("System ID: %lu", g_systemId);

    // TODO: Initialize session, runtime components, etc.
}

JNIEXPORT void JNICALL
Java_com_sigilos_quest_XRActivity_nativeOnResume(JNIEnv* env, jobject thiz) {
    LOGI("nativeOnResume called");

    // TODO: Resume XR session
}

JNIEXPORT void JNICALL
Java_com_sigilos_quest_XRActivity_nativeOnPause(JNIEnv* env, jobject thiz) {
    LOGI("nativeOnPause called");

    // TODO: Pause XR session
}

JNIEXPORT void JNICALL
Java_com_sigilos_quest_XRActivity_nativeOnDestroy(JNIEnv* env, jobject thiz) {
    LOGI("nativeOnDestroy called");

    // Destroy session
    if (g_session != XR_NULL_HANDLE) {
        xrDestroySession(g_session);
        g_session = XR_NULL_HANDLE;
    }

    // Destroy instance
    if (g_instance != XR_NULL_HANDLE) {
        xrDestroyInstance(g_instance);
        g_instance = XR_NULL_HANDLE;
    }

    LOGI("OpenXR cleanup complete");
}

} // extern "C"
