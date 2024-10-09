let s: HTMLScriptElement;

s = document.createElement("script");
s.src = chrome.runtime.getURL("dist/room.js");
s.onload = () => s.remove();
(document.head || document.documentElement).append(s);

s = document.createElement("script");
s.src = chrome.runtime.getURL("dist/psd_replay.js");
s.onload = () => s.remove();
(document.head || document.documentElement).append(s);
