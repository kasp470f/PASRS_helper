// TODO better activate deactivate functions
// TODO implement vgc only logic

function activate(){
    chrome.action.setIcon({
        path: {
            "128": "active.png",
        }
    });
    
    activationButton.textContent = "Deactivate";

    chrome.storage.sync.set({ activation: true });

    // TODO set active on PSD
}

function deactivate(){
    chrome.action.setIcon({
        path: {
            "128": "128.png",
        }
    });

    activationButton.textContent = "Activate";

    chrome.storage.sync.set({ activation: false });

    // TODO set inactive on PSD
}

function activationToggle(){
    chrome.storage.sync.get(["activation"], function(items){
        console.log(items);
        items.activation ? deactivate() : activate();
    });
}

function notificationToggle(){
    chrome.storage.sync.get(["notification"], function(items){
        if(items.notification){
            chrome.storage.sync.set({ notification: false });
            notificationButton.textContent = "Enable Notifications";
        }else{
            chrome.storage.sync.set({ notification: true });
            notificationButton.textContent = "Disable Notifications";
        }
    });
}

const activationButton = document.getElementById("activation");
const notificationButton = document.getElementById("notification");

chrome.storage.sync.get(["activation"], function(items){
    items.activation ? activate() : deactivate();
});

chrome.storage.sync.get(["notification"], function(items){
    if(items.notification)
        notificationButton.textContent = "Disable Notifications";
    else
        notificationButton.textContent = "Enable Notifications";
});

activationButton.addEventListener("click", activationToggle);
notificationButton.addEventListener("click", notificationToggle);