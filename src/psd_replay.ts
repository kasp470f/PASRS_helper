import { AutoReplaySettings } from "./auto_replay";
import { createHtmlRoom, app } from "./room";

// @ts-ignore : VERSION is injected by the bundler
const VERSION_TEXT = VERSION;

const rooms: Record<string, string> = {};
const appReceive = app.receive.bind(app);
const appSend = app.send.bind(app);

let autoPlaySettings: AutoReplaySettings = new AutoReplaySettings(localStorage.getItem("auto_replay_settings"));
const updateSettings = () => localStorage.setItem("auto_replay_settings", JSON.stringify(autoPlaySettings));

app.receive = (data: string) => {
	if (!autoPlaySettings.active) {
		appReceive(data);
		return;
	}

	if (data.includes("|popup||html|<p>Your replay has been uploaded!")) {
		const url = data.slice(data.indexOf("https://"), data.indexOf('" target='));
		const parts = url.split("/");

		const roomId = `battle-${parts[parts.length - 1]}`;
		if (rooms[roomId] === "finished") {
			setTimeout(function clipboardFunction() {
				navigator.clipboard
					.writeText(url)
					.then(() => {
						if (autoPlaySettings.notifications)
							new Notification("Your replay has been uploaded!");
					})
					.catch(() => {
						setTimeout(clipboardFunction, 250);
					});
			}, 0);

			$("#pasrs_games").append(
				`<li><a href="${url}" target="_blank">${url}</a></li>`,
			);
			delete rooms[roomId];
		} else {
			appReceive(data);
		}
	} else {
		appReceive(data);

		let receivedRoom = data.startsWith(">");
		const data_split = data.split("-");
		if (
			autoPlaySettings.vgc_only &&
			data_split &&
			data_split.length > 1 &&
			!data_split[1].includes("vgc")
		) {
			receivedRoom = false;
		}

		if (receivedRoom) {
			const roomId = data.slice(1, data.indexOf("\n"));
			if (data.includes("|init|battle")) {
				const lines = data.split("\n");
				if (lines[2].includes(app.user.attributes.name)) {
					rooms[roomId] = "ongoing";
				}
			}
			if (data.includes("|win|") && rooms[roomId] === "ongoing") {
				app.send("/savereplay", roomId);
				rooms[roomId] = "finished";
			}
		}
	}
};

app.send = (data: string, room?: string) => {
	appSend(data, room);
	if (
		autoPlaySettings.active &&
		data === "/forfeit" &&
		room &&
		rooms[room] === "ongoing"
	) {
		appSend("/savereplay", room);
		rooms[room] = "finished";
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
                <input type="checkbox" id="activation" name="activation" ${autoPlaySettings.active ? "checked" : ""}/>
                <label for="activation">Enable</label>
            </div>

            <div>
                <input type="checkbox" id="notification" name="notification"  ${autoPlaySettings.notifications ? "checked" : ""}/>
                <label for="notification">Send notifications</label>
            </div>

            <div>
                <input type="checkbox" id="vgc_only" name="vgc_only" ${autoPlaySettings.vgc_only ? "checked" : ""}/>
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

	bindCheckboxSetting("#activation", "active");
	bindCheckboxSetting("#notification", "notifications");
	bindCheckboxSetting("#vgc_only", "vgc_only");
}

function bindCheckboxSetting(selector: string, settingKey: keyof AutoReplaySettings) {
    const element = $(selector);
    element.on("change", null, null, (event: JQuery.ChangeEvent) => {
        const item = event.target as HTMLInputElement;
        autoPlaySettings[settingKey] = item.checked;
        updateSettings();
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
