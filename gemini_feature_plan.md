# Gemini Feature Plan

This document outlines the plan for adding Generative AI features to the Bhai App using the Firebase AI SDK and Gemini.

## High-Level Goal

Create a simple, intuitive interface within the Flutter application to demonstrate two core Gemini capabilities:
1.  **Text Generation:** Generate content from a user-provided text prompt.
2.  **Multimodal Analysis:** Analyze an image provided by the user and describe it.

## Detailed Plan

### 1. Dependency Management

I will add the following packages to the `pubspec.yaml` file by running `flutter pub add`:
*   `firebase_core`: To ensure the core Firebase services are available.
*   `firebase_ai`: The primary SDK for interacting with Gemini.
*   `image_picker`: To allow users to select images from their device gallery.
*   `provider`: For simple, effective state management to handle UI updates, loading states, and user input.

### 2. Application Structure & State Management

*   **State Holder:** I will create a `ChangeNotifier` class (e.g., `AiProvider`) to manage the application's state. This class will hold:
    *   The user's text prompt.
    *   The picked image file (`XFile` from `image_picker`).
    *   The generated response `String`.
    *   A boolean `isLoading` flag to show a progress indicator during API calls.
*   **Provider Setup:** I will wrap the main `MyApp` widget with a `ChangeNotifierProvider` in `lib/main.dart` to make the `AiProvider` available throughout the widget tree.

### 3. User Interface (UI)

I will build a single-screen UI in `lib/main.dart` that consists of:

*   An `AppBar` with the title "Bhai App - Gemini AI".
*   A `Column` layout containing:
    *   A preview area to display the selected image.
    *   A `TextField` for users to enter their text prompt.
    *   A row of `ElevatedButton`s:
        *   One to trigger the image picker.
        *   One to submit the prompt (either text-only or text-and-image) to the Gemini model.
    *   A section to display the response from the Gemini API. A `CircularProgressIndicator` will be shown here while `isLoading` is true.

### 4. Gemini Integration Logic

*   I will create methods within the `AiProvider` to handle the calls to Firebase AI:
    *   `generateText(String prompt)`: This will call the Gemini text model (`gemini-1.5-flash`).
    *   `analyzeImage(String prompt, Uint8List imageData)`: This will call the Gemini Vision model (`gemini-1.5-flash`) with both the text prompt and the image bytes.
*   **Image Handling:** The `image_picker` provides an `XFile`. I will read this file as bytes (`await file.readAsBytes()`) before passing it to the `analyzeImage` function.
*   **Error Handling:** All API calls will be wrapped in `try...catch` blocks to gracefully handle potential errors from the Firebase AI SDK and display an error message to the user.

### 5. Execution Flow

1.  Add dependencies.
2.  Set up the `AiProvider` and integrate it in `main.dart`.
3.  Build the UI widgets.
4.  Implement the `image_picker` logic.
5.  Implement the Gemini API call logic in the provider.
6.  Connect the UI buttons to the provider methods.
7.  Run `flutter format .` to ensure code quality.
8.  The app will be ready for you to test in the preview window.
