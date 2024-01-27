const _rooms = {};
const _appReceive = app.receive.bind(app);
const _appSend = app.send.bind(app);

const _auto_replay_active = false;
const _auto_replay_notifications = true;
const _auto_replay_vgc_only = true; // TODO implement vgc only logic

app.receive = (data) => {
    if(!_auto_replay_active){
        _appReceive(data);
        return;
    }

    const receivedRoom = data?.startsWith?.('>');

    if (data.includes('|popup||html|<p>Your replay has been uploaded!')) {
        const url = data.slice(data.indexOf('https://'),data.indexOf('" target='));
        const parts = url.split('/');
        var roomId = `battle-${parts[parts.length - 1]}`;
        if(_rooms[roomId] === "finished"){
            navigator.clipboard.writeText(url).then(() => {
                if (_auto_replay_notifications)
                    new Notification("Your replay has been uploaded!");
            });
            delete _rooms[roomId];
        }else{
            _appReceive(data);
        }
    }
    else {
        _appReceive(data);

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
}