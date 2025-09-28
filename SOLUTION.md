# Solution: Event-Based State Management for Cross-Context Communication

## Problem
The SettingsManager was being instantiated twice instead of being a true singleton because the application has two separate entry points:
1. `showdown` - Runs in the Pokemon Showdown page context
2. `react` - Runs in the React UI context (PASRS helper panel)

These are separate JavaScript execution contexts, so the singleton pattern doesn't work across them. The `customFormats` were always empty in the React components because they were being set in the showdown context but not accessible to the React context.

## Solution
Implemented an event-based communication system that allows the two contexts to synchronize state without relying on localStorage for formats (as requested).

### Key Components

1. **Event System (`src/lib/events.ts`)**
   - Provides centralized event constants and helper functions
   - Uses browser's native `CustomEvent` and `window.dispatchEvent()` for cross-context communication
   - Supports both formats and settings synchronization

2. **Updated SettingsManager (`src/lib/storage/settings-manager.ts`)**
   - Still uses localStorage for persistent settings (as intended)
   - Uses in-memory storage for `customFormats` (as requested)
   - Dispatches events when formats or settings change
   - Listens for format updates from other contexts

3. **Updated useSettings Hook (`src/hooks/useSettings.ts`)**
   - Listens for both format and settings updates via events
   - Updates React state when events are received
   - Maintains reactivity for UI components

4. **Updated Showdown Integration (`src/lib/showdown/index.ts`)**
   - Listens for settings updates from React UI
   - Dispatches format updates when received from Showdown
   - Ensures bi-directional synchronization

## How It Works

1. **Formats Flow (Showdown → React)**:
   - Showdown receives format data from Pokemon Showdown
   - Calls `settingsManager.setCustomFormats(formats)`
   - SettingsManager dispatches `FORMATS_UPDATED` event
   - React context receives event and updates state
   - UI components re-render with new formats

2. **Settings Flow (React → Showdown)**:
   - User changes settings in React UI
   - Calls `settingsManager.updateSetting(key, value)`
   - SettingsManager saves to localStorage and dispatches `SETTINGS_UPDATED` event
   - Showdown context receives event and stays synchronized

## Benefits

- ✅ **No localStorage for formats**: Formats are kept in memory only
- ✅ **True cross-context synchronization**: Both contexts stay in sync
- ✅ **Minimal changes**: Existing code largely unchanged
- ✅ **Type-safe**: Full TypeScript support with proper interfaces
- ✅ **Reactive**: UI updates automatically when data changes
- ✅ **Bi-directional**: Changes flow both ways between contexts

## Testing
Created comprehensive tests that verify:
- Events are properly dispatched and received
- Multiple SettingsManager instances stay synchronized
- Formats flow from showdown to React context
- Settings flow from React to showdown context
- No data is lost during synchronization