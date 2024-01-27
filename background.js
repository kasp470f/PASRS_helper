chrome.storage.sync.get(["activation"], function (items) {
    if (items.activation)
        chrome.action.setIcon({
            path: {
                "128": "active.png",
            }
        });
    else
        chrome.action.setIcon({
            path: {
                "128": "128.png",
            }
        });
});