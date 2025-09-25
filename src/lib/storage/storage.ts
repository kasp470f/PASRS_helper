import { AutoReplaySettings } from "../../types/settings";

let autoPlaySettings: AutoReplaySettings = new AutoReplaySettings(localStorage.getItem("auto_replay_settings"));
const updateSettings = () => localStorage.setItem("auto_replay_settings", JSON.stringify(autoPlaySettings));

export { autoPlaySettings, updateSettings };