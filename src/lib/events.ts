export const EVENTS = {
    FORMATS_UPDATED: 'pasrs:formats-updated',
    SETTINGS_UPDATED: 'pasrs:settings-updated'
} as const;

export interface FormatsUpdatedEvent extends CustomEvent {
    detail: {
        formats: string[];
    };
}

export interface SettingsUpdatedEvent extends CustomEvent {
    detail: {
        settings: any;
    };
}

// Helper functions for dispatching events
export const dispatchFormatsUpdated = (formats: string[]) => {
    const event = new CustomEvent(EVENTS.FORMATS_UPDATED, {
        detail: { formats }
    });
    window.dispatchEvent(event);
};

export const dispatchSettingsUpdated = (settings: any) => {
    const event = new CustomEvent(EVENTS.SETTINGS_UPDATED, {
        detail: { settings }
    });
    window.dispatchEvent(event);
};

// Helper functions for listening to events
export const onFormatsUpdated = (callback: (formats: string[]) => void) => {
    const handler = (event: FormatsUpdatedEvent) => {
        callback(event.detail.formats);
    };
    window.addEventListener(EVENTS.FORMATS_UPDATED, handler as EventListener);
    return () => window.removeEventListener(EVENTS.FORMATS_UPDATED, handler as EventListener);
};

export const onSettingsUpdated = (callback: (settings: any) => void) => {
    const handler = (event: SettingsUpdatedEvent) => {
        callback(event.detail.settings);
    };
    window.addEventListener(EVENTS.SETTINGS_UPDATED, handler as EventListener);
    return () => window.removeEventListener(EVENTS.SETTINGS_UPDATED, handler as EventListener);
};