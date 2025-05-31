import { AutoReplaySettings } from "./auto_replay";

let autoPlaySettings: AutoReplaySettings = new AutoReplaySettings(localStorage.getItem("auto_replay_settings"));
const updateSettings = () => localStorage.setItem("auto_replay_settings", JSON.stringify(autoPlaySettings));
updateOldSettings();

/**
 * Migrates legacy auto replay settings from localStorage to the current `autoPlaySettings` object.
 *
 * This function checks for old setting keys in localStorage (`auto_replay_active`, 
 * `auto_replay_notifications`, and `auto_replay_vgc_only`). If any are found, it updates 
 * the corresponding properties in `autoPlaySettings`, removes the old keys from localStorage, 
 * and calls `updateSettings()` to persist the changes.
 * 
 * This code should be deleted after a few releases, once all users have migrated to the new settings format.
 * Code was added on `May 22, 2025`
 *
 * @remarks
 * This function should be called during initialization to ensure user settings are up-to-date.
 */
function updateOldSettings(): void {
    let active = localStorage.getItem("auto_replay_active");
    let notifications = localStorage.getItem("auto_replay_notifications");
    let vgc_only = localStorage.getItem("auto_replay_vgc_only");

    if (active !== null) {
        autoPlaySettings.active = active === "true";
        localStorage.removeItem("auto_replay_active");
    }
    if (notifications !== null) {
        autoPlaySettings.notifications = notifications === "true";
        localStorage.removeItem("auto_replay_notifications");
    }
    if (vgc_only !== null) {
        autoPlaySettings.vgc_only = vgc_only === "true";
        localStorage.removeItem("auto_replay_vgc_only");
    }
    if (active !== null || notifications !== null || vgc_only !== null) {
        updateSettings();
    }
}

export { autoPlaySettings, updateSettings };