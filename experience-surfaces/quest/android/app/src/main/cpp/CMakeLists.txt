# SIGIL Quest 3 native library
cmake_minimum_required(VERSION 3.18.1)

project("sigil_quest")

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# OpenXR loader + headers are supplied as a prefab package by the
# org.khronos.openxr:openxr_loader_for_android AAR (buildFeatures.prefab).
find_package(OpenXR REQUIRED CONFIG)

file(GLOB SOURCES "*.cpp" "*.h")

add_library(sigil_quest SHARED ${SOURCES})

target_link_libraries(sigil_quest
    OpenXR::openxr_loader
    log
    android
)
