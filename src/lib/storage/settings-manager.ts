import { Settings } from "../../types/settings";

const settingsStorageKey = 'pasrs_helper_settings';

export class SettingsManager {
    static instance: SettingsManager;
    settings: Settings;
    customFormats: string[] = [];

    private constructor() {
        this.settings = this.loadFromStorage();
    }

    static getInstance(): SettingsManager {
        if (!SettingsManager.instance) {
            SettingsManager.instance = new SettingsManager();
			console.log('SettingsManager instance created');
        }
        return SettingsManager.instance;
    }

    getSettings(): Settings {
        return this.settings;
    }

    updateSetting<K extends keyof Settings>(
        key: K,
        value: Settings[K]
    ): void {
        this.settings[key] = value;
        this.saveToStorage();
    }

    getCustomFormats(): string[] {
        return this.customFormats;
    }

    setCustomFormats(formats: string[]): void {
        this.customFormats = formats;
    }

    private loadFromStorage(): Settings {
        const stored = localStorage.getItem(settingsStorageKey);
        if (stored) {
            try {
                return JSON.parse(stored);
            } catch (error) {
                console.warn('Failed to parse stored settings, using defaults');
            }
        }

        // Default settings
        return {
            active: true,
            use_clipboard: true,
            notifications: true,
            vgc_only: true,
            use_custom_replay_filter: false,
            custom_replay_filter: [],
        };
    }

    private saveToStorage(): void {
        localStorage.setItem(settingsStorageKey, JSON.stringify(this.settings));
    }
}