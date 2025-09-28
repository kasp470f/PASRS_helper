// src/hooks/useSettings.ts
import { useState, useCallback } from 'react';
import { SettingsManager } from '../lib/storage/settings-manager';
import { Settings } from '../types/settings';

export const useSettings = () => {
    const [settings, setSettings] = useState(() =>
        SettingsManager.getInstance().getSettings()
    );

    const updateSetting = useCallback((key: keyof Settings, value: any) => {
        SettingsManager.getInstance().updateSetting(key, value);
        // Force a fresh read from the settings manager
        setSettings({ ...SettingsManager.getInstance().getSettings() });
    }, []);

    const customFormats = SettingsManager.getInstance().getCustomFormats();

    return { settings, updateSetting, customFormats };
};