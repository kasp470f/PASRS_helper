import { ReplayRoomState } from "../../types/replay";
import { getFormatFromData, getRoomIdFromData, getUrlFromData } from "../../utils/showdown-data-utils";
import { isFormatMessage, isBattleInitMessage, isBattleFormatMessage, isWinMessage, isLeaveViewCommand, isReplayUploadedMessage } from "../../utils/showdown-protocol-utils";
import { ReplaysManager } from "../storage/replays-manager";
import { SettingsManager } from "../storage/settings-manager";
import createPASRSRoom from "./pasrs_room";
import { App } from "./room";

declare const app: App;

const appReceive = app.receive.bind(app);
const appSend = app.send.bind(app);
const settingsManager = SettingsManager.getInstance();

app.receive = (data: string) => {
	const settings = settingsManager.getSettings();

	if (isFormatMessage(data)) {
		settingsManager.setCustomFormats(getFormatFromData(data));
	}

	if (!settings.active) {
		appReceive(data);
		return;
	}
	
	if (isBattleInitMessage(data)) {
		ReplaysManager.addReplay(data);
	} 
	if (isBattleFormatMessage(data)) {
		ReplaysManager.updateFormatReplay(data);
	} 
	if (isWinMessage(data)) {
		const roomId = getRoomIdFromData(data);
		ReplaysManager.setRoomState(roomId, ReplayRoomState.Finished);
	}

	if (isReplayUploadedMessage(data)) {
		const url = getUrlFromData(data);
		const roomId = getRoomIdFromData(data);
		console.log(`Replay uploaded for room ${roomId}: ${url}`);

		if (ReplaysManager.getRoomState(roomId) === ReplayRoomState.Finished) {
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

			ReplaysManager.setRoomState(roomId, ReplayRoomState.Recorded);
		} else {
			appReceive(data);
		}
	} else {
		appReceive(data);

		// TODO: Re-enable room filtering logic when needed
		// let receivedRoom = data.startsWith(">");
		// const data_split = data.split("-");

		// // VGC only filter
		// if (
		// 	settings.vgc_only &&
		// 	data_split &&
		// 	data_split.length > 1 &&
		// 	!data_split[1].includes("vgc")
		// ) {
		// 	receivedRoom = false;
		// }

		// // Custom replay filter
		// if (
		// 	settings.use_custom_replay_filter &&
		// 	data_split &&
		// 	data_split.length > 1 &&
		// 	settings.custom_replay_filter.length > 0 &&
		// 	!settings.custom_replay_filter.some(filter => data_split[1].includes(filter))
		// ) {
		// 	receivedRoom = false;
		// }

		// if (receivedRoom) {
		// 	const roomId = data.slice(1, data.indexOf("\n"));
		// 	if (!rooms.has(roomId) || rooms.get(roomId) !== ReplayRoomState.Recorded) {
		// 		if (isBattleInitMessage(data)) {
		// 			const lines = data.split("\n");
		// 			if (lines[2].includes(app.user.attributes.name)) {
		// 				ReplaysManager.setRoomState(roomId, ReplayRoomState.OnGoing);
		// 			}
		// 		}
		// 		if (isWinMessage(data) && ReplaysManager.getRoomState(roomId) === ReplayRoomState.OnGoing) {
		// 			app.send("/savereplay", roomId);
		// 			ReplaysManager.setRoomState(roomId, ReplayRoomState.Finished);
		// 		}
		// 	}
		// }
	}
};

app.send = (data: string, roomId?: string) => {
	const settings = settingsManager.getSettings();

	appSend(data, roomId);
	if (settings.active && data === "/forfeit" && roomId && ReplaysManager.getRoomState(roomId) === ReplayRoomState.OnGoing) {
		appSend("/savereplay", roomId);
		ReplaysManager.setRoomState(roomId, ReplayRoomState.Finished);
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