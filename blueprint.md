# bhAi Application Development Blueprint

This document is the definitive and single source of truth for the development of the bhAi application. It outlines the project's vision, technology stack, data models, UI/UX flows, a detailed milestone-based development plan, and our collaborative workflow.

---

## Part 1: Project Overview & Vision

### 1.1 Application Name
**bhAi**

### 1.2 Project Mandate
To build a hyperlocal Q&A and micro-services marketplace at "god speed" using a Flutter-based, AI-native architecture. The application must be a Progressive Web App (PWA) and support Android and iOS, leveraging Firebase for its backend services.

### 1.3 Core Pillars
*   **AI-Native Architecture**: The AI provides the first reply to a query, with a human "Node" confirming for local truth.
*   **Credits Economy**: A system with three credit types: **Cash** (purchased via Cashfree, withdrawable), **Bonus** (non-withdrawable promos, consumed first), and **Locked** (escrow).
*   **Trust Score Framework**: A dynamic `users.trust_score` influences user privileges and is updated based on in-app actions.
*   **Three-Way Dispute Resolution**: A workflow to handle disputes with three outcomes: **Refund to Asker**, **Award to Answerer**, or **Split**.
*   **Location-Native Features**: Integration with Google Maps for geo-anchored queries and services.

### 1.4 Target Platforms
*   Web (Progressive Web App - PWA)
*   Android
*   iOS

---

## Part 2: Technology Stack & Setup

### 2.1 Technology Choices
*   **Frontend**: Flutter
*   **Backend**: Firebase
    *   **Authentication**: Google Sign-in, Email/Password, Phone OTP (with account linking)
    *   **Database**: Firestore
    *   **Serverless Logic**: Cloud Functions
    *   **File Storage**: Cloud Storage
    *   **Notifications**: Cloud Messaging
*   **Generative AI**: Firebase AI SDK (`firebase_ai`) with Gemini
*   **Integrations**:
    *   **Payments**: Cashfree
    *   **Maps**: Google Maps

### 2.2 Initial Setup & Configuration
*   **My Action**: Create a new Flutter project configured for Web, Android, and iOS.
*   **Your Action**: Provide a new, unique project name for the Flutter application.
*   **My Action**: Connect the Flutter application to a new Firebase project.
*   **Your Action**: Create and provide access to a new Firebase project, including `google-services.json` (Android), `GoogleService-Info.plist` (iOS), and web configuration. Enable the following Firebase services:
    *   Authentication (with Google Sign-in, Email/Password, and Phone OTP providers enabled)
    *   Firestore
    *   Cloud Functions
    *   Cloud Storage
    *   Cloud Messaging
*   **My Action**: Add the `firebase_ai` package dependency.
*   **Your Action**: In the Firebase console, enable the **Gemini API**.

---

## Part 3: Data Models & Application Logic

### 3.1 Firestore Collections
*   **`users`**: `display_name`, `phone` (PII, protected), `trust_score` (number, default 50), `upi_id` (encrypted/server-side only), `stats` map, `kyc_status`, `roles` map, `created_at`, `updated_at`.
*   **`wallets`**: `cash_credits`, `bonus_credits`, `locked_credits`, `lifetime_earned`, `lifetime_spent`, `updated_at`.
*   **`transactions`**: `uid`, `counterparty_uid`, `type`, `subtype`, `amount`, `credit_kind`, `cashfree_pg_ref`, `cashfree_payout_ref`, `related_id`, `status`, `created_at`, `confirmed_at`.
*   **`queries`**: `asker_uid`, `text`, `category`, `expected_response_types` (array), `location` (GeoPoint), `city`, `price_credits`, `status`, `ai_reply` map, `accepted_answer_id`, `sla_expires_at`, `created_at`, `updated_at`.
*   **`answers`**: `qid`, `answerer_uid`, `body` (Map, structured based on `expected_response_types`), `attachments` array, `status`, `earned_credits`, `created_at`, `updated_at`.
*   **`services`**: `creator_uid`, `title`, `description`, `category`, `location` (GeoPoint), `cadence`, `price_per_period_credits`, `active`, `created_at`.
*   **`serviceSubscriptions`**: `sid`, `subscriber_uid`, `status`, `start_at`, `renew_at`, `last_charge_tx`, `created_at`, `updated_at`.
*   **`serviceUpdates`**: `sid`, `content`, `attachments` array, `created_at`.
*   **`disputes`**: `type`, `target_id`, `asker_uid`, `answerer_uid`, `reason`, `status`, `resolution` map, `admin_uid`, `created_at`, `resolved_at`, `evidence` array.
*   **`reports`**: `target_type`, `target_id`, `reporter_uid`, `reason`, `status`, `created_at`.
*   **`categories`**: `name`, `min_price_credits`, `tags` array, `active`.

### 3.2 Reference Data: Query Categories & Response Types

#### 📂 Categories of Queries
1.  **Transportation**: Bus/train/cab schedules, parking.
2.  **Food & Restaurants**: Hotel recommendations, dish availability, delivery.
3.  **Location & Address**: Nearest shops, landmarks, services.
4.  **Shopping & Essentials**: Grocery, clothing, electronics.
5.  **Health & Medicine**: Pharmacies, doctors, clinics.
6.  **Finance & Services**: Banks, ATMs, service centers.
7.  **Utilities & Public Services**: Electricity/water supply, municipality.
8.  **Events & Entertainment**: Movie times, local fairs, processions.
9.  **Jobs & Services**: Worker availability, odd jobs, repairs.
10. **Emergency**: Police, ambulance, fire, hospital beds.

#### 📑 Expected Response Types
1.  **Text Answer**: Simple text reply.
2.  **Time Format**: HH:MM, selected from a clock UI.
3.  **Date**: Selected from a calendar UI.
4.  **List / Options**: A ranked or unranked list.
5.  **Price / Estimate Table**: A table with columns like Item, Price, Seller, Contact.
6.  **Yes/No / Status**: A boolean response.
7.  **Step-by-step Instruction**: An ordered list of steps.
8.  **Image**: An image upload.

### 3.3 Security & Indexing
*   **My Action: Security Rules**: Generate and enforce Firestore Security Rules where:
    *   Users can only read their own `users` and `wallets` data. Admins have full access.
    *   `wallets` and `transactions` can only be written to by server-side functions.
    *   Sensitive fields (`phone`, `upi_id`) are protected from client-side writes.
*   **My Action: Database Indexing**: Create composite indexes to ensure query performance:
    *   `queries(status, category, city, created_at desc)`
    *   `queries(status, location)`
    *   `answers(qid, status)`
    *   `transactions(uid, created_at desc)`

---

## Part 4: UI/UX Flow & Navigation

(This section remains largely the same, but the flows in Part 5 now reflect the deeper logic)

---

## Part 5: Development Milestones & Iterations

### **Milestone 1: Foundation & Multi-Factor Authentication**
*   **Objective**: Set up the project, data models, and implement a robust authentication system with Google Sign-in, Email/Password, and Phone OTP, including account linking.
*   **My Actions**:
    1.  Define all Firestore collections and security rules as per Part 3.
    2.  Implement UI and logic for all three authentication providers.
    3.  Implement Firebase's account linking feature to merge anonymous or separate accounts into one unified user profile.
    4.  Create the basic UI layout differentiating guest/authenticated views.
*   **Your Actions**: Review data models; provide Firebase config with all three auth providers enabled.
*   **Testing**: Integration tests for each login method; test that signing in with a second method correctly links to the existing account.
*   **Discussion**: "Milestone 1 complete. We have a foundational app with a flexible and secure authentication system. Ready to implement the AI-assisted query flow?"

### **Milestone 2: AI-Assisted Query Flow**
*   **Objective**: To implement the sophisticated, two-step query process where the AI assists the user in formatting their question for human Nodes.
*   **My Actions**:
    1.  **User Input**: Build the `AskQueryForm` for users to input their raw, natural language question.
    2.  **AI Processing (Cloud Function)**: On submission, trigger a function that calls the Gemini model via `firebase_ai`. The prompt will instruct the AI to:
        *   Analyze the user's text.
        *   Reformat it into a clear, concise question.
        *   Assign a `category` from the list in Part 3.2.
        *   Suggest an array of `expected_response_types` (e.g., `['Text Answer', 'Image']`).
    3.  **User Review (Escalation Dialog)**: Display the AI's output in a review dialog (`EscalationDialog`). This dialog will allow the user to:
        *   Edit the AI-formatted question text.
        *   Change the category.
        *   Modify the selection of expected response types.
        *   **Set the `price_credits` for the answer.**
        *   **Set the `sla_expires_at` (time limit) for the answer.**
    4.  **Submission**: Once the user confirms, write the final, structured query object to the `queries` collection, making it visible to human Nodes.
    5.  **Answering UI**: Create the `AnswerQueryDialog` which dynamically builds input fields based on the query's `expected_response_types`.
*   **Your Actions**: Review the entire flow, from raw input to the review dialog and the final submission.
*   **Testing**: 
    *   Unit test the AI processing function to ensure it returns a structured object.
    *   Widget test the `EscalationDialog` to ensure it's editable.
    *   Integration test the full flow: a user asks a question, reviews the AI suggestions, sets a price, and successfully posts it.
*   **Discussion**: "Milestone 2 complete. The core AI-assisted query flow is now implemented. Shall we build the credit economy and wallet system to power the transactions?"

(Remaining Milestones 3-7 will now build upon this more detailed and accurate foundation, but their core objectives remain the same.)

### **Milestone 3: Credit Economy & Wallet**
*   **Objective**: Implement the credit-based economy and the user wallet with Cashfree integration.
*   **My Actions**:
    1.  Implement `wallets` and `transactions` logic.
    2.  Create Cloud Functions: `createCashfreeSession`, `handleCashfreeWebhook`, and `initiateCashfreePayout`.
    3.  Build the `/wallet` UI.
*   **Your Actions**: Provide Cashfree API keys; set up the webhook URL in the Cashfree dashboard.
*   **Testing**: Test adding credits; test `Bonus` -> `Cash` spend order; test withdrawal requests.
*   **Discussion**: "Milestone 3 complete. We have a functioning wallet. Ready to implement the trust score and dispute resolution systems?"

### **Milestone 4: Trust Score & Dispute Resolution**
*   **Objective**: Implement the user trust score and the three-way dispute resolution system.
*   **My Actions**:
    1.  Implement the `trust_score` field and `updateTrustScore` Cloud Function.
    2.  Implement the `disputes` collection and the UI for users to raise disputes.
    3.  Implement the Admin UI for resolving disputes.
    4.  Create the `handleDisputeResolution` Cloud Function.
*   **Your Actions**: Review the logic for trust score changes and dispute outcomes.
*   **Testing**: Verify trust scores adjust correctly based on actions; test the full dispute lifecycle from creation to admin resolution.
*   **Discussion**: "Milestone 4 complete. Trust and safety mechanisms are in place. Shall we proceed to build the micro-services marketplace?"

### **Milestone 5: Micro-services Marketplace**
*   **Objective**: Build the marketplace for user-created services and subscriptions.
*   **My Actions**:
    1.  Implement the `services`, `serviceSubscriptions`, and `serviceUpdates` collections.
    2.  Create the UI for users to create, manage, browse, and subscribe to services.
    3.  Implement recurring credit deductions for subscriptions via a scheduled Cloud Function.
*   **Your Actions**: Review the service creation and subscription flow.
*   **Testing**: Test creating a service, subscribing to it, and receiving updates.
*   **Discussion**: "Milestone 5 complete. The services marketplace is functional. Shall we build the admin panel to manage the platform?"

### **Milestone 6: Admin Panel**
*   **Objective**: Build the administrative backend for platform management.
*   **My Actions**:
    1.  Implement the `/admin` page with tabs for "User Management", "Disputed Queries", and "Withdrawal Queue".
    2.  Build the functionality for each tab.
*   **Your Actions**: Confirm the admin functionalities meet management needs.
*   **Testing**: Test all admin functions: managing users, resolving disputes, and processing withdrawals.
*   **Discussion**: "Milestone 6 complete. The admin panel is ready. It's time to finalize, conduct comprehensive testing, and prepare for deployment."

### **Milestone 7: Finalization, Testing & Deployment**
*   **Objective**: Prepare the application for a production release across all platforms.
*   **My Actions**:
    1.  Generate comprehensive automated tests (unit, integration, widget) for all major features.
    2.  Set up Git integration and a CI/CD pipeline for automated builds.
    3.  Generate production-ready builds for PWA, Android, and iOS.
*   **Your Actions**: Provide Git repository details; prepare app store listings.
*   **Testing**: Run the full automated test suite; perform manual end-to-end testing on all target platforms.
*   **Discussion**: "Milestone 7 complete. The app is built, tested, and ready for launch. Let's deploy!"

---

## Part 6: Maintenance & Future Development

### 6.1 Bug Reporting & Feature Requests
*   **Procedure**: All bugs and feature requests will be managed as issues in our shared Git repository.

### 6.2 Deployment & Monitoring
*   **Deployment**: A CI/CD pipeline will automate deployments to Firebase Hosting (PWA) and assist with app store releases.
*   **Monitoring**: We will use Firebase Crashlytics, Performance Monitoring, and Analytics to monitor the application's health and user engagement.
