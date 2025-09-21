Build a Hyperlocal Q&A and Micro-services Marketplace Application**

**Project Mandate:**

Build a hyperlocal Q&A and micro-services marketplace at "god speed" using a Flutter-based, AI-native architecture. The application must be a Progressive Web App (PWA) and support Android Apk and iOS. It should leverage Firebase for its backend services.

**Core Requirements:**

* **AI-Native Architecture**: The AI should provide the first reply to a query, with a human "Node" confirming for local truth.Tech: 
* **Credits Economy**: Implement a credit system with three types: **Cash** (purchased via Cashfree, withdrawable), **Bonus** (non-withdrawable promos, consumed first), and **Locked** (escrow).
* **Trust Score Framework**: Develop a **users.trust_score** system that influences user privileges and is updated based on in-app actions.
* **Three-Way Dispute Resolution**: Implement a three-way dispute workflow (**Refund to Asker**, **Award to Answerer**, or **Split**) with associated trust score impacts.
* **Location-Native Features**: Integrate with Google Maps for geo-anchored queries and services.
* **Target Platforms**: Web (PWA), Android, and iOS.

***

### **Development Instructions for the AI Assistant**

**Part 1: Initial Project Setup and Data Models**

1.  **Project Initialization**: Ask the user to provide a new, unique project name for the Flutter application and then create a new project with that name. It should be configured for Web, Android, and iOS.
2.  **Firebase Connection**: Guide the user to create and connect to a new Firebase project. Advise them to enable the following Firebase services:
    * **Authentication**: Use Google Sign-in as the primary authentication method.
    * **Firestore**: Set up the database in a secure mode.
    * **Cloud Functions**: Prepare the environment for server-side logic.
    * **Cloud Storage**: For storing any user-uploaded attachments or media.
    * **Cloud Messaging**: For sending notifications to nearby answerers.
3.  **Data Modeling**: Using Firestore, define the following collections and their fields exactly as specified in the provided knowledge base:
    * **`users`**: `display_name`, `phone` (PII, protected), `trust_score` (number, default 50), `upi_id` (encrypted/server-side only), `stats` map, `kyc_status`, `roles` map, `created_at`, `updated_at`.
    * **`wallets`**: `cash_credits`, `bonus_credits`, `locked_credits`, `lifetime_earned`, `lifetime_spent`, `updated_at`.
    * **`transactions`**: `uid`, `counterparty_uid`, `type`, `subtype`, `amount`, `credit_kind`, `cashfree_pg_ref`, `cashfree_payout_ref`, `related_id`, `status`, `created_at`, `confirmed_at`.
    * **`queries`**: `asker_uid`, `text`, `category`, `location` (GeoPoint), `city`, `price_credits`, `status`, `ai_reply` map, `accepted_answer_id`, `sla_expires_at`, `created_at`, `updated_at`.
    * **`answers`**: `qid`, `answerer_uid`, `body`, `attachments` array, `status`, `earned_credits`, `created_at`, `updated_at`.
    * **`services`**: `creator_uid`, `title`, `description`, `category`, `location` (GeoPoint), `cadence`, `price_per_period_credits`, `active`, `created_at`.
    * **`serviceSubscriptions`**: `sid`, `subscriber_uid`, `status`, `start_at`, `renew_at`, `last_charge_tx`, `created_at`, `updated_at`.
    * **`serviceUpdates`**: `sid`, `content`, `attachments` array, `created_at`.
    * **`disputes`**: `type`, `target_id`, `asker_uid`, `answerer_uid`, `reason`, `status`, `resolution` map, `admin_uid`, `created_at`, `resolved_at`, `evidence` array.
    * **`reports`**: `target_type`, `target_id`, `reporter_uid`, `reason`, `status`, `created_at`.
    * **`categories`**: `name`, `min_price_credits`, `tags` array, `active`.
4.  **Security Rules**: Generate Firestore Security Rules to enforce the following:
    * Users can only read their own data in the `users` and `wallets` collections. Admins have full access.
    * The `wallets` and `transactions` collections can only be written to by server-side functions.
    * `queries` and `answers` can only be written to by their respective creators.
    * Prevent client-side writes to sensitive fields like `phone`, `upi_id`, and `bank_ref` in the `users` collection.
5.  **Database Indexing**: Create composite indexes on the following collections and fields to ensure query performance:
    * `queries(status, category, city, created_at desc)`
    * `queries(status, location)` for geo-queries.
    * `answers(qid, status)`
    * `serviceSubscriptions(sid, status)`
    * `transactions(uid, created_at desc)`
    * `disputes(status, created_at desc)`

***

### **Part 2: UI Flow and Business Logic Implementation**

* **Implement the UI/UX based on the `userflow.md` document.** Use the specified component names and navigation paths.

* **Flows to be implemented sequentially:**

    1.  **Guest User Flow**:
        * Home Page (`/`) with `GuestWelcome` and `LiveQueryFeed`.
        * Bottom navigation for guests with links to `/queries`, `/services`, `/signup`, and `/login`.
        * Implement the "Sign in to Answer" button which initiates Google Sign-In.

    2.  **Authenticated User Flow**:
        * Upon login, replace `GuestWelcome` with `AskQueryForm`.
        * Implement the full-featured bottom navigation bar including "Activity" (`/my-queries`) and "Profile" (`/profile`).
        * Implement the user menu with "Profile", "Wallet" and "Log out" links.
        * Implement the **Ask a Query** flow: `AskQueryForm` -> `Ask bhAi` button -> server action to get AI reply. The UI should dynamically show the AI's response (`directAnswer`, `suggestion`, or `escalate`) and the "Ask a Local" button.
        * Implement the **Answer a Query** flow as a Node: navigate to `/queries`, click "Answer Query", open `AnswerQueryDialog`, and submit.
        * Implement the **Wallet** flow at `/wallet` with "Add Cash Credits" and "Withdraw Credits" dialogs.

    3.  **Admin User Flow**:
        * Add the unique **"Admin Panel"** link to the user menu for authenticated users with the `admin` role.
        * Implement the `/admin` page with a tabbed interface for "User Management", "Disputed Queries", and "Withdrawal Queue".
        * For the "Disputed Queries" tab, implement the UI for resolving a dispute with buttons for "Uphold Node", "Refund User", or "Refund & Reward".

***

### **Part 3: Cloud Functions and Integrations**

* **Cloud Functions (Backend Business Logic)**: Write and deploy Firebase Cloud Functions to handle the following sensitive and core logic:
    * `createCashfreeSession(amount, uid)`: This function will handle the server-side call to Cashfree to get a `payment_session_id`.
    * `handleCashfreeWebhook()`: A webhook listener that verifies Cashfree payments, writes a transaction to the `transactions` ledger, and updates the user's `wallets` collection.
    * `initiateCashfreePayout(payoutRequestId)`: Admin-callable function to trigger a Cashfree Payout for withdrawals.
    * `finalizeAnswer(aid)`: Callable by the asker, releases locked credits, applies the platform fee, and credits the answerer.
    * `updateTrustScore(event)`: A generic function to handle all trust score adjustments based on events like `accept`, `reject`, `on-time-update`, or `admin penalty`.
    * `handleDisputeResolution(did, mode, ratio?)`: Admin-callable function that handles the three-way dispute resolution, applying the correct credit and trust score changes.
    * `reconcileLedger()`: A scheduled job to audit `wallets` totals against the sum of `transactions`.
    * `autoRefundExpiredQueries()`: A scheduled job to automatically refund locked credits for queries that expire without a human answer.

***

### **Part 4: Finalization and Continuous Operations**

* **Automated Tests**: Generate automated tests to confirm the following acceptance criteria:
    * Guests cannot ask or answer queries.
    * The `Bonus` → `Cash` spend order is enforced.
    * Trust scores are correctly adjusted for all specified events.
    * The ledger reconciliation passes (`wallet` totals = sum of `transactions`).
* **Git Integration**: Instruct the user to create a new Git repository for the project and to provide the branch name they want to use for live deploys.

***

### **Notes for AI Assistant (Internal Guidance)**

* **New Git Repo**: When the user is ready to connect to a version control system, ask them for the new repository name and the branch they wish to use.
* **API Key Management**: When a user asks for Google Maps or Cashfree integration, respond by noting that these require API keys and external account setup.
* **External Setup Steps**: Provide the user with explicit instructions on how to get the necessary API keys. Advise them to enable the necessary APIs (e.g., Maps SDK for iOS, Android, and Maps JavaScript API) and to secure their keys. Similarly, for Cashfree, instruct them to set up an account and obtain API keys and secrets.
* **Cashfree Webhooks**: Emphasize that the `handleCashfreeWebhook` function is crucial and requires setting up the webhook URL in the Cashfree dashboard. This URL will point to the deployed Firebase Cloud Function endpoint.
* **Sensitive Data**: When handling sensitive data like UPI IDs and phone numbers, remember to route all operations through secure Cloud Functions and never expose them to the client-side. The `upi_id` should be stored encrypted and only on the server.
* **Security & Compliance**: Reiterate the importance of enforcing the generated Firebase Security Rules to protect user data and financial transactions.