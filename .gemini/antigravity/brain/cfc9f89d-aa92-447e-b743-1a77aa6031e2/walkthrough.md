# Recently Visited Boards Walkthrough

We have enhanced the **Recently Visited** section on the Home Page to be more informative and dynamic.

## Features Implemented
1.  **Enhanced Card UI**:
    -   Displays **Board Name**, **Workspace Name**, and **Owner Name**.
2.  **Visit Tracking**:
    -   Clicking a board now attempts to update your "last viewed" timestamp.

### Notification Center Dark Mode Fix
- **Problem**: Notifications had hardcoded white backgrounds and dark text.
- **Solution**: Applied semantic CSS variables (`--color-bg-surface`, `--color-text-primary`, `--color-status-...`).
- **Result**:
    - Notification cards now match the dark theme.
    - Status badges (Accepted/Declined) use transparent backgrounds correctly.
    - Text is visible in both modes.

### Release v1.1.1 Beta
- **Version**: `1.1.1-beta`
- **Artifact**: `workera-v1.1.1-beta.zip`
- **Changes**: Dark Mode fixes for Homepage and Notification Center.
3.  **Smart Sorting**:
    -   Boards are sorted by `last_viewed_at` (most recent first).

### Security Hardening 🛡️
- **Problem**: Security Advisor flagged mutable function search paths and permissive "INSERT" policies.
- **Solution**:
    - **Function Security**: Updated all custom functions to `SET search_path = public` to prevent search path hijacking.
    - **RLS Policy**: Updated `INSERT` policies for `notifications` and `activity_logs` to explicitly require `auth.uid() IS NOT NULL`.
    - **Script**: Created `scripts/security_hardening.sql` for automated application.

## Verification Results
### UI Verification
The card layout has been updated as requested.
![Recently Visited Boards](/Users/jirawat/.gemini/antigravity/brain/cfc9f89d-aa92-447e-b743-1a77aa6031e2/homepage_before_visit_1770898115873.png)

### Sorting Logic (Functional)
The sorting logic is now fully functional. Boards are sorted by recency (newest visits first).
This is powered by the `last_viewed_at` column in the database and optimistic UI updates for instant feedback.

### Final Verification
The screenshot below confirms that after visiting "Test Recently", it correctly moved to the first position.
![Final Recently Visited Verification](/Users/jirawat/.gemini/antigravity/brain/cfc9f89d-aa92-447e-b743-1a77aa6031e2/home_final_verification_1770900788301.png)

## Completed Features
- [x] **Owner Name**: Displays the owner's name on the card.
- [x] **Workspace Name**: Displays the workspace name.
- [x] **Real-time Sorting**: Updates instantly upon board visit.
