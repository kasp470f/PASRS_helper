import { ReplayRoomState } from "../../types/replay";
import { getFormatFromData, getRoomIdFromData, getRoomIdFromURL, getUrlFromData } from "../../utils/showdown-data-utils";
import { isFormatMessage, isBattleInitMessage, isBattleFormatMessage, isWinMessage, isLeaveViewCommand, isReplayUploadedMessage } from "../../utils/showdown-protocol-utils";
import { onSettingsUpdated } from "../events";
import { ReplaysManager } from "../storage/replays-manager";
import { SettingsManager } from "../storage/settings-manager";
import createPASRSRoom from "./pasrs_room";
import { App } from "./room";

declare const app: App;

const appReceive = app.receive.bind(app);
const appSend = app.send.bind(app);
const settingsManager = SettingsManager.getInstance();
const replaysManager = new ReplaysManager();

let currentSettings = settingsManager.getSettings();

onSettingsUpdated((settings) => {
    currentSettings = settings;
});

app.receive = (data: string) => {
	var settings = currentSettings;

	if (isFormatMessage(data)) {
		settingsManager.setCustomFormats(getFormatFromData(data));
	}

	if (!settings.active) {
		appReceive(data);
		return;
	}
	
	if (isBattleInitMessage(data)) {
		replaysManager.addReplay(data);
	} 
	if (isBattleFormatMessage(data)) {
		replaysManager.updateFormatReplay(data);
	}

	if (settings.vgc_only || settings.use_custom_replay_filter) {
		const roomId = getRoomIdFromData(data);
		const room = replaysManager.getReplay(roomId);

		if (settings.vgc_only) {
			if (room && room.format && !room.format.toLowerCase().includes("vgc")) {
				replaysManager.setRoomState(roomId, ReplayRoomState.Ignored);
			}
		} else if (settings.use_custom_replay_filter) {
			var formats = settings.custom_replay_filter;
			if (room && room.format && formats?.length > 0 && !formats.some(format => room.format?.toLowerCase() === format.toLowerCase())) {
				replaysManager.setRoomState(roomId, ReplayRoomState.Ignored);
			}
		}
	}

	if (isWinMessage(data)) {
		const roomId = getRoomIdFromData(data);
		if (replaysManager.getRoomState(roomId) === ReplayRoomState.OnGoing) {
			replaysManager.setRoomResult(roomId, data);
			app.send("/savereplay", roomId);
		}
	}

	if (isReplayUploadedMessage(data)) {
		const url = getUrlFromData(data);
		const roomId = getRoomIdFromURL(url);
		replaysManager.updateReplayUrl(roomId, url);

		if (replaysManager.getRoomState(roomId) === ReplayRoomState.Finished) {
			if (settings.use_clipboard) {
				setTimeout(function clipboardFunction() {
					navigator.clipboard
						.writeText(url)
						.then(() => {
							if (settings.notifications)
								new Notification("Your replay has been uploaded!");
						})
						.catch(() => {
							setTimeout(clipboardFunction, 250);
						});
				}, 0);
			}

			replaysManager.setRoomState(roomId, ReplayRoomState.Recorded);
		} else {
			appReceive(data);
		}
	}
	
	appReceive(data);
};

app.send = (data: string, roomId?: string) => {
	const settings = currentSettings;

	appSend(data, roomId);
	if (settings.active && data === "/forfeit" && roomId && replaysManager.getRoomState(roomId) === ReplayRoomState.OnGoing) {
		appSend("/savereplay", roomId);
		replaysManager.setRoomState(roomId, ReplayRoomState.Finished);
	}
	if (isLeaveViewCommand(data)) {
		setTimeout(createPASRSRoom, 0);
	}
};

// poor mans await.
// Indeed :(
let roomTimer = setTimeout(function roomCreator() {
	// @ts-ignore : window.app exists within the actual page
	if (window.app) {
		clearTimeout(roomTimer);
		createPASRSRoom();
	} else {
		roomTimer = setTimeout(roomCreator, 250);
	}
}, 0);