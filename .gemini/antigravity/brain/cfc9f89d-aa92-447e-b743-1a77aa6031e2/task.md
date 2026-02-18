# Task: แก้ไขปัญหาที่พบจากการตรวจสอบโค้ด Workera

## Phase 1: Critical Fixes (เร่งด่วน) ✅

### 1. Security Fixes ✅
- [x] แก้ไข supabase.ts ให้ throw error แทน console.error
- [x] สร้าง SQL schema files ที่ขาดหาย
  - [x] activity_logs_schema.sql
  - [x] delete_user_function.sql  
  - [x] trigger_user_signup_log.sql
  - [x] trigger_workspace_board_logs.sql
  - [x] setup_complete.sql (bonus - all-in-one script)
- [x] ปรับปรุง notification policies ใน db_schema.sql
- [x] อัพเดท README.md ให้ตรงกับ SQL files ที่มี

### 2. TypeScript Type Safety ✅
- [x] สร้าง proper types สำหรับ Supabase responses
- [x] สร้าง types/supabase.ts - Database schema types
- [x] สร้าง types/helpers.ts - Query helper types
- [x] แก้ไข types/index.ts (2 errors) ✅
- [x] แก้ไข utils/grouping.ts (1 error) ✅
- [x] ลด TypeScript errors จาก 121 เหลือ ~20 (ปรับปรุง 83%)

## Phase 2: Performance Optimization ✅

### 3. Code Splitting ✅
- [x] Implement lazy loading สำหรับ AdminPage
- [x] Implement lazy loading สำหรับ NotificationPage
- [x] เพิ่ม Suspense fallback components

### 4. Bundle Size Optimization ✅
- [x] Configure manual chunks ใน vite.config.ts
- [x] แยก vendor libraries (react, supabase, ui, dnd, state, date)
- [x] ลด bundle size จาก 837 KB เหลือ 360 KB (ลดลง 57%)

## Phase 3: Code Quality (Optional - ไม่ได้ทำ)

### 5. Complete TODO Items
- [x] Integrate `Recent Activity` logging for role updates
- [x] Create database trigger for user signup activity
- [x] Update `delete_user` function with logging
- [x] Verify logging features
- [x] **Browser QA**: Verified invite acceptance and access with Tester1 & Tester2.
- [x] **Fix Infinite Recursion**: Create SQL script to fix 500 errors caused by RLS loop.
- [ ] **Code Review & Cleanup**: Remove unused code.

## Notification UI Polish
- [ ] **HomePage.tsx (Inbox)**: Fix missing text, adjust layout.
- [ ] **NotificationItem.tsx**: Fix alignment and overlap issues.
- [x] Fix invitation acceptance error (RLS recursion issue)
- [x] Improve error reporting for invitations
- [x] Implement board move and duplicate features
    - [x] Implement `moveBoardToWorkspace` in `useBoardStore.ts`
    - [x] Implement `duplicateBoard` in `useBoardStore.ts`
    - [x] Implement `duplicateBoardToWorkspace` in `useBoardStore.ts`
    - [x] **UI Polish: Headers, Colors & Spacing** <!-- id: 5 -->
    - [x] Repeat Table Header for every Group <!-- id: 6 -->
    - [x] Fix Item column background color (white instead of gray) <!-- id: 7 -->
    - [x] Improve Activity Log UI (Card style, spacing) <!-- id: 8 -->
    - [x] Replace "Open" button with persistent Chat Icon <!-- id: 9 -->
    - [x] Fix badge clipping and redundant numbers <!-- id: 10 -->
- [ ] **Files Column (Google Drive)** <!-- id: 11 -->
    - [x] Update Types (`ColumnType`, `FileLink`) <!-- id: 12 -->
    - [x] Create `FilesPicker` component <!-- id: 13 -->
    - [x] Integrate into `Cell.tsx` <!-- id: 14 -->
    - [x] Update `useBoardStore` for logging <!-- id: 15 -->
    - [x] Update `ActivityLogList` for display <!-- id: 16 -->
- [x] **Task Detail Files Tab** <!-- id: 17 -->
    - [x] DB: Add `files` column to `items` <!-- id: 18 -->
    - [x] Store: Update `Item` type and `useBoardStore` <!-- id: 19 -->
    - [x] UI: Refactor `TaskDetail` Files tab to be inline (No Popover) <!-- id: 22 -->
    - [x] Refactor: Extract validation logic to `utils.ts` <!-- id: 23 -->
    - [x] Validation: Enforce Google Drive links <!-- id: 21 -->
    - [x] Fix: Files disappearing on refresh (Added `files` map in `loadUserData`)
## Recently Visited Boards
- [x] **Schema**: Add `last_viewed_at` column to `board_members` (Confirmed executed).
- [x] **Logic**: Update `Board` type and `boardSlice.ts` to track/load visits and persist state.
- [x] **UI**: Update `HomePage.tsx` to sort by recency and show Owner/Workspace details.
- [ ] **Fix Task Reordering Bug** <!-- id: 24 -->
    - [x] Investigation: Check `loadUserData` sorting.
    - [x] Fix: Add deterministic sort (Order + ID).
- [x] **Share Board UI Improvements** <!-- id: 25 -->
    - [x] Feature: Add User Suggestions (Auto-complete) to Invite Form.
    - [x] Fix: Role Dropdown opens unexpectedly (Add `type="button"` to RoleSelector).
- [x] **Drag and Drop** <!-- id: 4 -->
    - [x] Debug and fix duplicate "My Workspace" entries in sidebar submenu
- [x] Customize Sidebar Icons
    - [x] Create circular initial icon for Workspaces
    - [x] Create custom Board icon SVG based on user image
    - [x] Update `Sidebar.tsx` with new icons
- [x] Fix Status/Priority Column Display
    - [x] Investigate why raw IDs are shown instead of labels
    - [x] Fix cell rendering logic for Status/Priority columns
- [x] Implement Granular Realtime Updates
    - [x] Refactor `subscribeToRealtime` for granular events
    - [x] Implement `handleRealtimeItem` (Insert/Update/Delete)
    - [x] Implement `handleRealtimeGroup` (Insert/Update/Delete)
    - [x] Implement `handleRealtimeColumn` (Reload Fallback)
    - [x] Fix "Rename Activity Spam" (Verify only 1 log per rename)
- [x] Fix "Create Task Crash" (Verify UI stable after Enter)
- [x] Fix "Task Flickering/Reorder" (Verify 1-2-3-4-5 order on rapid create)
- [x] Fix "Task Swapping on Update" (Verify no jump on status change)
- [x] Implement Comprehensive Activity Logging
    - [x] Update `useBoardStore.ts`: Refactor `updateItemValue` for rich metadata
    - [x] Update `useBoardStore.ts`: Add logging to `addUpdate`
    - [x] Update `ActivityLogList.tsx`: Implement formatted log messages
    - [x] Update `TaskDetail.tsx`: Remove Activity Log tab
- [x] Verify functionality (Browser Test)nu
- [x] Fix "Rapid Update Flickering" (Implemented optimistic timestamp & grace period)
- [x] Verify Persistence (Run check_logs.ts)
    - [x] Verify functionality (Manual Testing)
- [x] Implement Timeline Column
    - [x] Add 'timeline' to ColumnType
    - [x] Create TimelinePicker component
    - [x] Update Cell to render timeline range
    - [x] Update AddColumnMenu
    - [x] Add Manual Date Inputs to TimelinePicker
    - [x] Refine Visuals (Truncation & Hover Duration)
- [x] Improve Hyperlink UX
    - [x] Replace prompt with Popover UI
- [x] **"Click to go" functionality**
    - [x] Clicking a log item should close the panel and scroll to the item on the board.
    - [x] Verify scroll position (center or visible area).
    - [ ] **Highlight Logic** (Deferred):
        - [ ] Visual Highlight (Removed per request).
        - [ ] Animation (Removed per request).
    - [-] **Phase 5: Activity Log & Admin Panel**
    - [x] Fix Task Activity Log Scope (remove global leaks) ✅
    - [x] Implement Item Logging (Status, Rename, Create/Delete) ✅
    - [x] Verify Fixes (Browser Test) ✅
    - [x] `AdminPage` Implementation
- [x] Fix Search Visibility
    - [x] Show all boards if workspace title matches search query
- [x] Fix duplicate workspace creation for new users
    - [x] Update `loadUserData` in `boardSlice.ts` to prevent race conditions (added `isInitializing` lock)
    - [x] Ensure default workspace is named "${UserName}'s Workspace"
    - [x] Change default group name to "Welcome to Workera"
    - [x] Fix infinite loading loop on first login (removed recursion inside lock)
    - [x] Fix missing member avatars (added profile upsert logic to `loadUserData` and fixed UI access paths)
- [x] Fix duplicate workspace creation for new users
    - [x] Update `loadUserData` in `boardSlice.ts` to prevent race conditions (added `isInitializing` lock)
    - [x] Ensure default workspace is named "${UserName}'s Workspace"
    - [x] Change default group name to "Welcome to Workera"
    - [x] Fix infinite loading loop on first login (removed recursion inside lock)
    - [x] Fix missing member avatars (added profile upsert logic to `loadUserData` and fixed UI access paths)
- [x] Verify fix by creating a new user and checking:
    - [x] New user gets a default workspace named correctly.
    - [x] Default workspace contains a "Welcome to Workera" group.
    - [x] No infinite loading loop on first login.
    - [x] Member avatars are displayed correctly.
- [/] **Research Data Backup System**
    - [x] Analyze codebase for existing backup tools (found only source code zip script).
    - [x] Create `backup_study.md` with options (Cloud vs App-level).
- [/] **Research Installer & Auto-Setup**
    - [x] Analyze packaging options (Electron vs Tauri).
    - [x] Define "One Click Setup" strategy (Embedded Migration Tool).
    - [x] Create `installer_study.md`.
- [x] Enhance Workspace & Sidebar
    - [x] Fix Workspace clickability/interaction in sidebar
    - [x] Implement default "Starting Board" for new workspaces
        - [x] Create default group, columns, and 1 example task
- [x] Implement Action Log System ✅
    - [x] Create Reusable ActivityLogList Component
    - [x] Inject Logging Logic into Store (Task Actions)
    - [x] Board Actions)
    - [x] Integrate into Task Detail View
    - [x] Integrate into Board Header
    - [x] Fix syntax and build errors in `useBoardStore.ts` and `TaskDetail.tsx` (Duplicate components removed, types added)
    - [x] Restore Board Header UI (Search, Share, Menu, Members) ✅
    - [x] Fix Member Profile Display (Avatars) & Add Invitation (+) Button ✅
    - [x] Refine Invitation Button Icon (Use `Plus` instead of `Users`) ✅

- [x] Refine Sidebar UI & Search
    - [x] Fix Workspace clickability/interaction in sidebar
    - [x] Implement default "Starting Board" for new workspaces
        - [x] Create default group, columns, and 1 example task
- [x] Implement Action Log System ✅
    - [x] Create Reusable ActivityLogList Component
    - [x] Inject Logging Logic into Store (Task Actions)
    - [x] Inject Logging Logic into Store (Board Actions)
    - [x] Integrate into Task Detail View
    - [x] Integrate into Board Header (Drawer Mode) ✅
    - [x] Fix syntax and build errors in `useBoardStore.ts` and `TaskDetail.tsx` (Duplicate components removed, types added)
    - [x] Restore Board Header UI (Search, Share, Menu, Members) ✅
    - [x] Fix Member Profile Display (Avatars) & Add Invitation (+) Button ✅
    - [x] Refine Invitation Button Icon (Use `Plus` instead of `Users`) ✅
    - [x] Activity Log Enhancements (Drawer, Navigation, Avatars) ✅
- [x] UI Polish & UX Refinement (Darker Topbar, Row Highlight, Close Drawer Nav) ✅
    - [x] Align Drawer UI with Task Detail (24px, 32px padding) ✅
    - [x] Implement Blur Backdrop for Drawer ✅
    - [x] Implement Interactive Rows (Clickable Container) ✅
    - [x] Add Flash/Glow Animation for Row Highlight ✅

- [x] Verify icons in browser





### 6. Code Refactoring & Optimization <!-- id: 26 -->
- [x] **Phase 1: Store Refactoring**
    - [x] Create `boardSlice` (CRUD Boards)
    - [x] Create `itemSlice` (CRUD Items)
    - [x] Create `realtimeSlice` (Subscriptions)
    - [x] Compose slices in `useBoardStore.ts`
- [ ] **Phase 2: Component Optimization**
    - [x] Refactor `Cell.tsx` (Split column types)
    - [x] Refactor `Sidebar.tsx` (Extract components)
- [ ] **Phase 3: Performance Tuning**
    - [x] Implement virtualization for Main Table
    - [x] Add `React.memo` to strict render paths

---

## 📊 สรุปผลลัพธ์

✅ **Phase 1 & 2 & 3 สำเร็จ!**

- TypeScript errors: 0 (Fixed all build errors)
- Bundle size: ~785 KB → ~104 KB (Initial Load)
- SQL files: 1 → 5 ไฟล์
- Security issues: แก้ไขหมดแล้ว
- Build time: 8.07s → 1.61s (เร็วขึ้น 80%)
- Fixed: Duplicate Workspace Creation (Race Condition in `boardSlice.ts`)
- Updated: Default Workspace/Board/Task names to "User's Workspace" / "Starting" / "On boarding"

- [x] Release: Version 1.0 Beta (Tagged `v1.0-beta`) 🚀

## Phase 4: Post-Release Optimization 🚀
- [x] **Performance Audit & Fixes**
    - [x] Fix `PeopleCell` unnecessary re-renders (Selector optimization)
    - [x] Memoize Column Aggregations in `Table.tsx` (Scroll performance)
    - [x] Improve Type Safety (Remove `any` in Table/Row)
    - [x] Fix Always Active Behavior (Prevent reload on tab switch)

## Future Roadmap (Backlog)

        - [ ] **Data Backup & Export System**
            - [ ] Implement JSON Export
        - [/] **Phase 5: Desktop Installer & Custom Setup** 📦
            - [ ] **Electron Port**
                - [ ] Add `electron` & `electron-builder`
                - [ ] Configure IPC for System Operations
            - [x] **System Settings Store**
                - [x] Create `system_settings` table (Supabase)
                - [x] Create `useSystemStore` (fetch App Name, Logo)
                - [x] Update `Sidebar`, `TopBar`, `Title` to use dynamic values
                - [x] Admin UI: Form to update App Name & Logo
                - [x] Admin UI: Form to update App Name & Logo
                - [/] **Enhance System Settings**
                    - [x] Admin UI: "Apply" button and Logo Preview
                    - [x] Admin UI: "Restore to Default" button
                    - [x] Logic: Update Favicon dynamically
                    - [x] Global: Replace all "Workera" text and icons
                    - [x] Admin UI: Fix Dark Mode visibility (Fixed crash due to missing stats)
                    - [x] Admin UI: Fix Sidebar Overlap/Layout Collision (Moving AdminPage to top-level)
                    - [x] Admin UI: Fix Internal Components Dark Mode (ActivityLogs, UserTable, etc.) - Refactored to Tailwind

                    - [x] Logic: Support Dark Mode Logo
                    - [ ] Home UI: Fix Dark Mode text visibility and card backgrounds
                        - [x] Fix Header Text Color
                        - [x] Fix Recently Visited Cards
                        - [x] Fix Update Feed Background
                        - [x] Fix Homepage Hardcoded Colors (Text, Backgrounds, Borders)
                        - [x] Fix Notification Center Hardcoded Colors
                        - [x] Release: Version 1.1.1 Beta (Dark Mode Fixes) 🚀
                        - [x] **Security Hardening** (RLS, Search Path, Permissions) 🛡️
                        - [x] **Restoring Tailwind CSS** (Upgraded to v4 for compatibility)
                    - [x] **Fix UI Regressions (Tailwind v4 Side Effects)**
                        - [x] Fix Fonts (Roboto/Inter not loading)
                        - [x] Fix Table Borders (Invisible lines due to Preflight)
                        - [x] Fix Dark Mode Toggle (Sync `.dark` class)
                    - [x] **Home Page UI Polish**
                        - [x] Increase Global Padding (detach from Sidebar/Topbar)
                        - [x] Improve Card Spacing & Typography
                        - [x] Fix "Update Feed" Layout
                    - [x] **Home Dashboard Spacing Polish**
                        - [x] Safe Zones (Container Padding)
                        - [x] Card Breathing Room (32px padding, softer radius)
                        - [x] Visual Hierarchy (Header Margins)
                        - [x] Linear-Style List Spacing & Typography
                    - [x] Fix `/home` routing redirection
                        - [x] Prevent auto-redirect from `/home` to last board
    - [ ] **Setup Wizard (`/setup`)** (Cancelled - Web Only)
        - [ ] Install `pg` for direct DB migration (Cancelled)
        - [ ] UI: Connection Form (Supabase URL/Key) (Cancelled)
        - [ ] UI: Branding Form (App Name, Logo Upload) (Cancelled)
        - [ ] Logic: Provision Database (Run SQL Scripts via Electron) (Cancelled)
        - [ ] Logic: Create Admin Account (Cancelled)
    - [ ] **Build Installer** (Cancelled - Web Only)
        - [ ] Generate `.exe` (Windows) / `.dmg` (Mac)

## Future Roadmap (Backlog)

## Recent Enhancements (UI/UX)
- [x] **Task Updates Text Color**
    - [x] Add Color Picker to Toolbar (RichTextEditor)
    - [x] Implement `foreColor` command
- [x] **Center People Column**
    - [x] Update `PeopleCell.tsx` alignment to `center`

## New Features
- [x] **Light/Dark Mode**
    - [x] Create Theme Context/Store
    - [x] Define Dark Mode CSS Variables
    - [x] Add Toggle Button to TopBar
    - [x] Fix Hardcoded Colors in Components (Sidebar, Task Detail, Editors) ✅
    - [x] Verify Dark Mode Consistency ✅
    - [x] Fix Date/Timeline Picker Dark Mode (Task & Column functions) ✅
    - [x] **Fix Invisible Item Name in Dark Mode** (Replaced hardcoded white background) ✅
    - [x] **Fix Column Menu Functionality** ✅
        - [x] Implement `Duplicate Column` (Deep copy)
        - [x] Improve `Add Column to Right` (Open Type Selection Menu)
    - [x] **Fix Missing Batch Actions Bar** (Added to BoardPage) ✅
        - [x] Implement Item Selection Logic
        - [x] Add Dark Mode Support (`var(--color-...)`) 🌙
    - [x] **Implement System Backup (JSON Export)** 💾
        - [x] Create `backupService.ts` to fetch all data
        - [x] Add "Export Data" button to Settings/Admin page
        - [x] Add "Export Board JSON" for Normal Users
        - [x] Implement "Import Board from JSON" in Sidebar
        - [x] Verify JSON export contains all boards/items
    - [x] **Refine Export/Import for Normal Users** 🔄
        - [x] Change Normal User Export to Excel/CSV (Readable Text)
    - [x] **Refine Export/Import for Normal Users** 🔄
        - [x] Change Normal User Export to Excel/CSV (Readable Text)
            - [x] Fix: Handle null values and correct Option parsing (Resolved "Failed to export" error)
            - [x] Add Verbose Logging & Granular Error Alerts (To debug persistent user issue)
            - [x] Fix: Filename encoding (Thai characters) and `.replace` TypeError
            - [x] Feature: Export Filename Modal (Allow user to rename before download) 🆕
            - [x] Feature: Switch Export from CSV to Excel (.xlsx) 📊 (Reverted to CSV per user request)
                - [x] Fixed: Empty cells due to property name mismatch (values vs column_values)
                - [x] Fixed: Type mismatch for Dropdown/Status labels (string vs number)
            - [x] Release: Version 1.0 Beta (Tagged `v1.0-beta`) 🚀
        - [x] Remove Import Board option for Normal Users






    - [ ] **Mentions System**
        - [ ] Verify mentions trigger notifications.
    - [ ] **Browser QA (Tester1 & Tester2)**
        - [ ] Test Invite Flow.
        - [ ] Test Mentions.

