# Notification System & Invite Flow Fix Plan

## Goal
Fix the broken notification and invite system. Ensure invites trigger a notification (not immediate access), recipients must accept invites, and notifications update in real-time. Resolve database schema mismatches (`read` vs `is_read`).

## User Review Required
> [!IMPORTANT]
> This plan changes the default behavior of "Invite". Users will no longer be added immediately. They must click "Accept" in their notification inbox.

## Proposed Changes

### `src/types/index.ts`
- Ensure `Notification` type uses `is_read` to match database.
- Ensure `NotificationData` can hold `status` property for compatibility.

### `src/store/slices/memberSlice.ts`
#### [MODIFY] handleAcceptInvite
- Implement logic to:
    1. Check if user is already a member.
    2. Insert row into `board_members` or `workspace_members`.
    3. Update notification `data.status` to 'accepted'.
    4. Mark notification as `is_read: true`.
    5. Refresh notifications and user data.

#### [MODIFY] inviteToBoard & inviteToWorkspace
- **Remove** direct `insert` into `_members` tables.
- **Add** call to `createNotification` with type `board_invite` or `workspace_invite`.

#### [MODIFY] createNotification
- Remove `status` column from SQL insert (use `data: { status: 'pending' }`).
- Use `is_read: false` instead of `read: false`.

#### [MODIFY] subscribeToRealtime
- Implement robust `postgres_changes` subscription for `INSERT` on `notifications`.
- Ensure new notifications are added to state immediately.

#### [MODIFY] loadNotifications
- Remove SQL filters for `status` (if column missing).
- Filter `accepted/declined` invites client-side.
- User `is_read` for unread status checks.

### `src/components/layout/TopBar.tsx`
- Update unread count logic to use `n.is_read`.
- Ensure `startNotificationSubscription` is called on mount.
## Notification UI Polish
### HomePage.tsx (Inbox Feed)
- [ ] **Fix Missing Text**: Use `n.content` fallback if `n.message` is undefined.
- [ ] **Layout**: Adjust X button positioning and timestamp to prevent overlap.
- [ ] **Styling**: Improve spacing and alignments.

### NotificationItem.tsx (Notification Center)
- [ ] **Alignment**: Remove `justify-content: space-between` for title/time to keep them closer or structure better.
- [ ] **Overlap Fix**: Ensure padding-right accommodates the absolute Dismiss button.
- [ ] **Time Display**: Improve time formatting and placement.

### `src/components/notifications/NotificationItem.tsx`
- Update "Accept" button to call `handleAcceptInvite`.
- Update styling to show "Accepted" state based on `data.status`.
- Use `is_read` for styling read/unread state.

## Verification Plan

### Automated Browser Tests (QA)
1.  **Login as Tester1**:
    -   Create a new Board.
    -   Invite `Tester2@example.com`.
    -   Verify NO error (400) in console.
    -   Verify Tester2 is NOT yet in the board members list (or shows as pending if we had that UI, otherwise just check access).
2.  **Login as Tester2**:
    -   Check Bell Icon (should show red dot).
    -   Open Notifications.
    -   Verify "Invite" notification is present.
    -   Click "Accept".
    -   Verify "Accepted" status change.
    -   Verify automatic redirection or access to the Board.
3.  **Mentions**:
    -   Tester1 mentions Tester2 in a task.
    -   Tester2 receives notification.

## Recently Visited Boards
### Schema Change
- [x] **board_members**: Add `last_viewed_at` column (timestamptz).

### Logic Updates (`boardSlice.ts`, `types/index.ts`)
- [x] **Type**: Add `lastViewedAt` to `Board` interface (transient).
- [x] **Tracking**: Update `setActiveBoard` to update `last_viewed_at` in DB.
- [x] **Loading**: Update `loadUserData` to fetch `last_viewed_at` from `board_members` and map it to `boards`.

### UI Updates (`HomePage.tsx`)
- [x] **Sorting**: Sort `recentBoards` by `lastViewedAt` desc.
- [x] **Card Details**:
    - Show **Board Name** (existing).
    - Show **Workspace Name** (lookup via `workspaceId`).
    - Show **Owner Name**: Fetch owner profile or use workspace owner as fallback.

## Homepage Dark Mode Fix ✅
### `src/pages/HomePage.tsx`
- Replace hardcoded hex colors with CSS variables from `variables.css`.
- **Mappings**:
    - `white` → `hsl(var(--color-bg-surface))`
    - `#323338` → `hsl(var(--color-text-primary))`
    - `#676879` → `hsl(var(--color-text-secondary))`
    - `#e6e9ef` → `hsl(var(--color-border))`
    - `#e5f4ff` → `hsl(var(--color-brand-light))`
    - `#e5f4ff` → `hsl(var(--color-brand-light))`
    - Shadows → `var(--shadow-sm)`

## Notification Center Dark Mode Fix ✅
### `src/pages/NotificationPage.tsx`
- Background: `white` -> `hsl(var(--color-bg-surface))` (or canvas)
- Text: `#111827` -> `hsl(var(--color-text-primary))`
- Gray Text: `#6b7280` -> `hsl(var(--color-text-secondary))`
- Border: `#e5e7eb` -> `hsl(var(--color-border))`

### `src/components/notifications/NotificationItem.tsx`
- Hover BG: `#f9fafb` -> `hsl(var(--color-bg-surface-hover))`
- Unread BG: `#eff6ff` -> `hsl(var(--color-brand-light), 0.3)` or similar
- Text colors as above.

- Text colors as above.

## Database Setup & Automated Cloning ✅
- [x] **Consolidate SQL Scripts**: Created `setup_database_full.sql`.
- [x] **Setup Script**: Created `setup.sh` for one-command installation.
- [x] **Documentation**: Created `SETUP_GUIDE.md`.

## Security Hardening (Audit) ✅
- [x] **Function Security**: Set `search_path = public` for all custom functions. 
- [x] **RLS Policy**: Hardened `INSERT` policies for `notifications` and `activity_logs`.
- [x] **Password Protection**: Advised user on Dashboard configuration.
