# bhAi Application: UI Flow Analysis

This document provides a comprehensive analysis of the application's user interface flow, user roles, permissions, and navigation paths based on the project's codebase.

---

## 1. User Roles & Permissions

The application supports three distinct user roles with clear access levels.

- **Guest (Unauthenticated User)**

  - **Permissions:** Read-only access to public content.
  - **Can:**
    - View the home page with a welcome message (`GuestWelcome`).
    - View the live activity feed (`LiveQueryFeed`).
    - Browse the "Query Marketplace" (`/queries`).
    - Browse "Daily Services" (`/services`).
    - View legal and informational pages (`/about`, `/policy/*`).
  - **Cannot:**
    - Ask a new query.
    - Answer a query.
    - Subscribe to a service.
    - Access user-specific pages like Profile, Wallet, or My Activity.

- **Authenticated User (Standard User / Node)**

  - **Permissions:** Full access to all core application features. The role of a "user" and a "Node" is fluid; any authenticated user can become a Node by answering a query or creating a service.
  - **Can:**
    - Perform all Guest actions.
    - Ask new queries using the `AskQueryForm`.
    - Answer queries from the marketplace, acting as a Node.
    - Create, manage, and provide updates for their own Daily Services.
    - Manage their wallet (add/withdraw credits).
    - View their complete activity history (asked queries, answered queries, subscriptions).
    - Edit their profile.
  - **Cannot:**
    - Access the Admin Panel.

- **Admin User**
  - **Permissions:** Super-user access with all the capabilities of an Authenticated User, plus administrative privileges.
  - **Can:**
    - Perform all Authenticated User actions.
    - Access the `/admin` panel.
    - View and manage all users (including granting/revoking admin status).
    - Review and resolve disputed queries.
    - View and process pending withdrawal requests.

---

## 2. User Flows per Role

### A. Guest User Flow

1.  **Entry Point:** Lands on the Home Page (`/`).
    - **Context:** The user is new or logged out. The goal is to introduce the app and encourage signup/login.
    - **UI Elements:**
      - `GuestWelcome` component is displayed.
      - `LiveQueryFeed` shows recent platform activity.
      - `AppLayout` shows a simplified header and bottom navigation for guests.
2.  **Navigation: Exploration**
    - Clicks **"Continue with Google"** button -> Initiates Google Sign-In popup. On success, they become an Authenticated User.
    - Clicks **"Sign Up"** link -> Navigates to the Signup Page (`/signup`).
    - Clicks **"Login"** link -> Navigates to the Login Page (`/login`).
    - Clicks **"Earn"** or **"Daily"** in the bottom navigation -> Navigates to the Query Marketplace (`/queries`) or Daily Services page (`/services`) respectively, where they can browse content.
3.  **Navigation: Answering a Query (Attempt)**
    - On the Query Marketplace (`/queries`), clicks the **"Sign in to Answer"** button.
    - **Action:** Initiates Google Sign-In popup. On success, they become an Authenticated User and can then answer the query.

### B. Authenticated User Flow

1.  **Entry Point:** Lands on the Home Page (`/`) after logging in.
    - **Context:** The user is logged in and ready to use the app's core features.
    - **UI Elements:**
      - `AskQueryForm` is displayed instead of `GuestWelcome`.
      - `AppLayout` shows a full-featured header (with Notification Bell and User Menu) and a user-specific bottom navigation bar.
2.  **Flow: Asking a Query**
    - On the Home Page (`/`), fills out the `AskQueryForm` (question and location).
    - Clicks the **"Ask bhAi"** button.
    - **Action:** Triggers a server action that first gets AI suggestions and then an AI answer.
    - **UI Update:** The form area updates to show the AI's response (`directAnswer`, `suggestion`, or `escalate`).
    - If the AI provides a `suggestion`, an **"Ask a Local"** button appears, which opens the `EscalationDialog` to send the query to human Nodes.
3.  **Flow: Answering a Query (Acting as a Node)**
    - Navigates to the Query Marketplace (`/queries`).
    - Finds a query and clicks the **"Answer Query"** button.
    - **Action:** Opens the `AnswerQueryDialog`.
    - Fills out the required fields based on the query's `response_types` and submits.
4.  **Flow: Managing Activity**
    - Navigates to the My Activity page (`/my-queries`).
    - **UI Elements:** A tabbed interface appears.
      - **"My Asked Queries" tab:** User can view the status of questions they've asked. They can click **"Accept & Pay"**, **"Ask for Clarification"**, or **"Mark as Disputed"** on answered queries.
      - **"My Answered Queries" tab:** User (as a Node) sees queries they've answered and their status. Can click **"Provide Clarification"** if requested.
      - **"My Subscriptions" tab:** User sees updates for services they are subscribed to.
5.  **Flow: Managing Wallet**
    - Navigates to the Wallet Page (`/wallet`) via the user menu.
    - Clicks **"Add Cash Credits"** -> Opens `AddCreditsDialog` to initiate a payment.
    - Clicks **"Withdraw Credits"** -> Opens `WithdrawCreditsDialog` to request a manual payout.
6.  **Logout**
    - Clicks the user avatar in the header to open the user menu.
    - Clicks the **"Log out"** menu item.
    - **Action:** The user is logged out and redirected to the Home Page (`/`), where they see the Guest view.

### C. Admin User Flow

1.  **Entry Point & Navigation:** Same as an Authenticated User.
2.  **Flow: Accessing Admin Panel**
    - Clicks the user avatar in the header to open the user menu.
    - A unique **"Admin Panel"** link is visible.
    - Clicks **"Admin Panel"** link -> Navigates to the Admin Page (`/admin`).
3.  **Flow: Managing the Platform**
    - On the Admin Page (`/admin`), a tabbed interface is presented.
      - **"User Management" tab:** Admin can see a list of all users and use a toggle switch to grant or revoke admin privileges for any other user.
      - **"Disputed Queries" tab:** Admin reviews disputed queries, sees the conversation history, and can resolve the dispute by clicking **"Uphold Node"**, **"Refund User"**, or **"Refund & Reward"**.
      - **"Withdrawal Queue" tab:** Admin sees a list of pending withdrawal requests. After paying the user manually (outside the app), they click the **"Process"** button to finalize the transaction in the system. This opens a confirmation dialog.
      - **"Withdrawal History" tab:** Admin can view a log of all previously processed withdrawals.

---

## 3. Unique UI Elements per Role

- **Guest:**

  - `GuestWelcome` component on the home page.
  - "Sign in to Answer" button on query cards.
  - Simplified bottom navigation with a "Sign In" link.
  - Header shows a menu icon leading to a sheet with public links and Login/Signup buttons.

- **Authenticated User:**

  - `AskQueryForm` on the home page.
  - Full-featured bottom navigation including "Activity" and "Profile".
  - Header includes a `NotificationBell` and a user avatar with a dropdown menu (`profile`, `wallet`, `logout`, etc.).
  - "Accept & Pay", "Ask for Clarification", "Mark as Disputed" buttons on their own queries.
  - "Answer Query" and "Provide Clarification" buttons on others' queries.
  - "Create New Service", "Add Update", "Complete" buttons on the Services page.

- **Admin User:**
  - **"Admin Panel"** link in the user avatar dropdown menu. This is the primary unique element that grants access to the admin section.
  - The entire `/admin` page and its tabbed interface (`User Management`, `Disputed Queries`, `Withdrawal Queue`, `Withdrawal History`).
  - "Process" button for withdrawal requests.
  - "Uphold Node" / "Refund User" / "Refund & Reward" buttons for dispute resolution.

---

## 4. Navigation Paths

| From Page / Component    | UI Element Trigger                  | Destination / Action                                                                             |
| ------------------------ | ----------------------------------- | ------------------------------------------------------------------------------------------------ |
| **Guest Navigation**     |                                     |                                                                                                  |
| `GuestWelcome` (`/`)     | "Sign Up" link                      | `/signup` page                                                                                   |
| `GuestWelcome` (`/`)     | "Login" link                        | `/login` page                                                                                    |
| `LoginForm` (`/login`)   | "Sign up" link                      | `/signup` page                                                                                   |
| `LoginForm` (`/login`)   | "Forgot password?" link             | `/forgot-password` page                                                                          |
| `SignupForm` (`/signup`) | "Login" link                        | `/login` page                                                                                    |
| Bottom Nav (Guest)       | "Ask", "Earn", "Daily" icons        | `/`, `/queries`, `/services` pages respectively                                                  |
| **User Navigation**      |                                     |                                                                                                  |
| Any Page (Logged In)     | User Menu -> "Profile"              | `/profile` page                                                                                  |
| Any Page (Logged In)     | User Menu -> "Wallet"               | `/wallet` page                                                                                   |
| Any Page (Logged In)     | User Menu -> "Log out"              | Logs the user out and redirects to `/`                                                           |
| Bottom Nav (User)        | All icons                           | `/`, `/queries`, `/services`, `/my-queries`, `/profile` pages respectively                       |
| `MyQueriesPage`          | "Convert to Service" button         | `/services` page (with query data pre-filled in the URL parameters)                              |
| `AskQueryForm`           | "Ask a Local" button                | Opens `EscalationDialog`                                                                         |
| `WalletPage`             | "Add Cash Credits" button           | Opens `AddCreditsDialog`                                                                         |
| `WalletPage`             | "Withdraw Credits" button           | Opens `WithdrawCreditsDialog`                                                                    |
| `AnswerQueryPage`        | "Answer Query" button               | Opens `AnswerQueryDialog`                                                                        |
| **Admin Navigation**     |                                     |                                                                                                  |
| Any Page (Admin)         | User Menu -> "Admin Panel"          | `/admin` page                                                                                    |
| `AdminPage`              | Any Tab (e.g., "Disputed Queries")  | Switches the content view within the `/admin` page.                                              |
| `AdminPage`              | "Process" button (on a withdrawal)  | Opens an `AlertDialog` for confirmation before executing the `processWithdrawal` cloud function. |
| `AdminPage`              | "Uphold Node" button (on a dispute) | Executes the `resolveDispute` cloud function with the 'UPHOLD_NODE' parameter.                   |
