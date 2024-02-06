const _rooms = {};
const _appReceive = app.receive.bind(app);
const _appSend = app.send.bind(app);

// TODO: Resized rooms are not working properly

let _auto_replay_active = localStorage.getItem('_auto_replay_active');
if (_auto_replay_active === null) {
    _auto_replay_active = false;
    localStorage.setItem('_auto_replay_active', _auto_replay_active);
}
_auto_replay_active = _auto_replay_active === "true";

let _auto_replay_notifications = localStorage.getItem('_auto_replay_notifications');
if (_auto_replay_notifications === null) {
    _auto_replay_notifications = true;
    localStorage.setItem('_auto_replay_notifications', _auto_replay_notifications);
}
_auto_replay_notifications = _auto_replay_notifications === "true";

let _auto_replay_vgc_only = localStorage.getItem('_auto_replay_vgc_only');
if (_auto_replay_vgc_only === null) {
    _auto_replay_vgc_only = true;
    localStorage.setItem('_auto_replay_vgc_only', _auto_replay_vgc_only);
}
_auto_replay_vgc_only = _auto_replay_vgc_only === "true";

app.receive = (data) => {
    if (!_auto_replay_active) {
        _appReceive(data);
        return;
    }

    if (data.includes('|popup||html|<p>Your replay has been uploaded!')) {
        const url = data.slice(data.indexOf('https://'), data.indexOf('" target='));
        const parts = url.split('/');

        var roomId = `battle-${parts[parts.length - 1]}`;
        if (_rooms[roomId] === "finished") {
            clipboardTimeout = setTimeout(
                function clipboardFunction() {
                    navigator.clipboard.writeText(url).then(() => {
                        if (_auto_replay_notifications)
                            new Notification("Your replay has been uploaded!");
                    }).catch(() => {
                        setTimeout(clipboardFunction, 250);
                    });

                    clearTimeout(clipboardTimeout);
                }, 0);
            
            $("#pasrs_games").append(`<li><a href="${url}" target="_blank">${url}</a></li>`);
            delete _rooms[roomId];
        } else {
            _appReceive(data);
        }
    }
    else {
        _appReceive(data);

        let receivedRoom = data?.startsWith?.('>');
        const data_split = data.split("-")
        if (_auto_replay_vgc_only && (data_split && data_split.length > 1 && !data_split[1].includes("vgc"))) {
            receivedRoom = undefined;
        }

        if (receivedRoom) {
            const roomId = data.slice(1, data.indexOf('\n'));
            if (data.includes("|init|battle")) {
                const lines = data.split('\n');
                if (lines[2].includes(app.user.attributes.name)) {
                    _rooms[roomId] = "ongoing";
                }
            }
            if (data.includes("|win|") && _rooms[roomId] === "ongoing") {
                app.send("/savereplay", roomId);
                _rooms[roomId] = "finished";
            }
        }
    }
};

app.send = (data, room) => {
    _appSend(data, room);
    if (_auto_replay_active && data === "/forfeit" && _rooms[room] === "ongoing") {
        _appSend("/savereplay", room);
        _rooms[room] = "finished";
    }
    if (data.includes("/noreply /leave view-pasrs-helper")) {
        createPASRSRoom();
    }
}

function createPASRSRoom() {
    const room = createHtmlRoom(
        "view-pasrs-helper",
        "PASRS",
        { side: true, icon: "clipboard", focus: true }
    )

    room.$el.html(`
    <div style="padding: 2vh 5vw">
        <h1>PASRS Helper</h1>
        This is the settings tab for the PASRS Helper.
        Automatically uploads the replay of your last battle in PSD then it will be copied to your clipboard.
        <br /><br />
        <fieldset>
            <legend>Settings:</legend>

            <div>
                <input type="checkbox" id="activation" name="activation" ${_auto_replay_active ? "checked" : ""}/>
                <label for="activation">Enable</label>
            </div>

            <div>
                <input type="checkbox" id="notification" name="notification"  ${_auto_replay_notifications ? "checked" : ""}/>
                <label for="notification">Send Notifications</label>
            </div>

            <div>
                <input type="checkbox" id="vgc_only" name="vgc_only" ${_auto_replay_vgc_only ? "checked": ""}/>
                <label for="vgc_only">Create Pastes for VGC Only</label>
            </div>
        </fieldset>

        <br /><br />
        <a href="https://github.com/alchemistake/PASRS_helper" target="_blank">Source Code</a>
        <a href="https://twitter.com/alchemistake" target="_blank">Tweet me the issues</a>

        <h1>Games</h1>
        <ul id="pasrs_games"></ul>
    </div>
    `);

    activation = $('#activation');
    notification = $('#notification');
    vgc_only = $('#vgc_only');

    activation.on('change', function () {
        _auto_replay_active = this.checked;
        localStorage.setItem('_auto_replay_active', _auto_replay_active);
    });
    notification.on('change', function () {
        _auto_replay_notifications = this.checked;
        localStorage.setItem('_auto_replay_notifications', _auto_replay_notifications);
    });
    vgc_only.on('change', function () {
        _auto_replay_vgc_only = this.checked;
        localStorage.setItem('_auto_replay_vgc_only', _auto_replay_vgc_only);
    });
}

// poor mans await.
let roomTimer = setTimeout(function roomCreator(){
    if (app) {
        clearTimeout(roomTimer);
        createPASRSRoom();
    } else {
        roomTimer = setTimeout(roomCreator, 250);
    }
}, 0);