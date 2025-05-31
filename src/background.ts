chrome.action.onClicked.addListener((tab) => {
	if (tab.id !== undefined) {
		chrome.scripting.executeScript({
			target: { tabId: tab.id },
			func: () => {
				window.dispatchEvent(new CustomEvent("trigger-create-room"));
			}
		});
	}
});