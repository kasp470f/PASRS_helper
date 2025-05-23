import { createHtmlRoom, app } from "./room";

// @ts-ignore : VERSION is injected by the bundler
const VERSION_TEXT = VERSION;

enum RoomState {
	OnGoing = "ongoing",
	Finished = "finished",
	Recorded = "recorded",
}
const rooms: Map<string, RoomState> = new Map();
const appReceive = app.receive.bind(app);
const appSend = app.send.bind(app);

let auto_replay_active = localStorage.getItem("auto_replay_active") === "true";
if (auto_replay_active === null) {
	auto_replay_active = false;
	localStorage.setItem("auto_replay_active", auto_replay_active.toString());
}

let auto_replay_notifications =
	localStorage.getItem("auto_replay_notifications") === "true";
if (auto_replay_notifications === null) {
	auto_replay_notifications = true;
	localStorage.setItem(
		"auto_replay_notifications",
		auto_replay_notifications.toString(),
	);
}

let auto_replay_vgc_only =
	localStorage.getItem("auto_replay_vgc_only") === "true";
if (auto_replay_vgc_only === null) {
	auto_replay_vgc_only = true;
	localStorage.setItem("auto_replay_vgc_only", auto_replay_vgc_only.toString());
}

app.receive = (data: string) => {
	if (!auto_replay_active) {
		appReceive(data);
		return;
	}

	if (data.includes("|popup||html|<p>Your replay has been uploaded!")) {
		const url = data.slice(data.indexOf("https://"), data.indexOf('" target='));
		const parts = url.split("/");

		const roomId = `battle-${parts[parts.length - 1]}`;
		if (rooms.get(roomId) === RoomState.Finished) {
			setTimeout(function clipboardFunction() {
				navigator.clipboard
					.writeText(url)
					.then(() => {
						if (auto_replay_notifications)
							new Notification("Your replay has been uploaded!");
					})
					.catch(() => {
						setTimeout(clipboardFunction, 250);
					});
			}, 0);

			$("#pasrs_games").append(
				`<li><a href="${url}" target="_blank">${url}</a></li>`,
			);
			rooms.set(roomId, RoomState.Recorded);
		} else {
			appReceive(data);
		}
	} else {
		appReceive(data);

		let receivedRoom = data.startsWith(">");
		const data_split = data.split("-");
		if (
			auto_replay_vgc_only &&
			data_split &&
			data_split.length > 1 &&
			!data_split[1].includes("vgc")
		) {
			receivedRoom = false;
		}

		if (receivedRoom) {
			const roomId = data.slice(1, data.indexOf("\n"));
			if (!rooms.has(roomId) || rooms.get(roomId) !== RoomState.Recorded) {
				if (data.includes("|init|battle")) {
					const lines = data.split("\n");
					if (lines[2].includes(app.user.attributes.name)) {
						rooms.set(roomId, RoomState.OnGoing);
					}
				}
				if (data.includes("|win|") && rooms.get(roomId) === RoomState.OnGoing) {
					app.send("/savereplay", roomId);
					rooms.set(roomId, RoomState.Finished);
				}
			}
		}
	}
};

app.send = (data: string, roomId?: string) => {
	appSend(data, roomId);
	if (
		auto_replay_active &&
		data === "/forfeit" &&
		roomId &&
		rooms.get(roomId) === "ongoing"
	) {
		appSend("/savereplay", roomId);
		rooms.set(roomId, RoomState.Finished);
	}
	if (data.includes("/noreply /leave view-pasrs-helper")) {
		createPASRSRoom();
	}
};

function createPASRSRoom() {
	const room = createHtmlRoom("view-pasrs-helper", "PASRS", {
		side: true,
		icon: "clipboard",
		focus: true,
	});

	if (room === null) {
		return;
	}
	room.$el.html(`
    <div style="padding: 2vh 5vw">
        <h1>PASRS Helper v${VERSION_TEXT}</h1>
        This is the settings tab for the PASRS Helper.
        Automatically uploads the replay of your last battle in PSD then it will be copied to your clipboard.
        <br /><br />
        <fieldset>
            <legend>Settings:</legend>

            <div>
                <input type="checkbox" id="activation" name="activation" ${auto_replay_active ? "checked" : ""}/>
                <label for="activation">Enable</label>
            </div>

            <div>
                <input type="checkbox" id="notification" name="notification"  ${auto_replay_notifications ? "checked" : ""}/>
                <label for="notification">Send notifications</label>
            </div>

            <div>
                <input type="checkbox" id="vgc_only" name="vgc_only" ${auto_replay_vgc_only ? "checked" : ""}/>
                <label for="vgc_only">Save replays for VGC Only</label>
            </div>
        </fieldset>

        <br />
        <p><b>Maintainers:</b> <a href="https://twitter.com/alchemistake" target="_blank">Alchemistake</a> <a href="https://x.com/PokeBin_dev" target="_blank">PokeBin Dev</a></p>
        <p><a href="https://www.patreon.com/malaow3" target="_blank">Support PokeBin Dev on Patreon!</a></p>
        <br />
        <a href="https://github.com/alchemistake/PASRS_helper" target="_blank">Source Code</a>
        <a href="https://twitter.com/alchemistake" target="_blank">Tweet me the issues</a>

        <h1>Games</h1>
        <ul id="pasrs_games"></ul>
    </div>
  `);

	const activation = $("#activation");
	const notification = $("#notification");
	const vgc_only = $("#vgc_only");

	activation.on("change", null, null, (event: JQuery.ChangeEvent) => {
		const item = event.target;
		auto_replay_active = item.checked;
		localStorage.setItem("auto_replay_active", auto_replay_active.toString());
	});
	notification.on("change", null, null, (event: JQuery.ChangeEvent) => {
		const item = event.target;
		auto_replay_notifications = item.checked;
		localStorage.setItem(
			"auto_replay_notifications",
			auto_replay_notifications.toString(),
		);
	});
	vgc_only.on("change", null, null, (event: JQuery.ChangeEvent) => {
		const item = event.target;
		auto_replay_vgc_only = item.checked;
		localStorage.setItem(
			"auto_replay_vgc_only",
			auto_replay_vgc_only.toString(),
		);
	});
}

// poor mans await.
let roomTimer = setTimeout(function roomCreator() {
	// @ts-ignore : window.app exists within the actual page
	if (window.app) {
		clearTimeout(roomTimer);
		createPASRSRoom();
	} else {
		roomTimer = setTimeout(roomCreator, 250);
	}
}, 0);
