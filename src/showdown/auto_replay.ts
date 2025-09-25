export class AutoReplaySettings {
  active = false;
  notifications = true;
  vgc_only = true;
  use_clipboard = true;
  use_custom_replay_filter = false;
  custom_replay_filter = '';

  constructor(json: string | null) {
    if (!json) return;

    try {
      const options = JSON.parse(json);
      Object.assign(this, options);
    } catch (e) {
      console.error('Failed to parse AutoReplaySettings JSON:', e);
    }
  }
}
