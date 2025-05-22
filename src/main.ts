import './styles/global.css';

let s: HTMLScriptElement;

s = document.createElement("script");
s.src = chrome.runtime.getURL("dist/room.js");
s.onload = () => s.remove();
(document.head || document.documentElement).append(s);

s = document.createElement("script");
s.src = chrome.runtime.getURL("dist/psd_replay.js");
s.onload = () => s.remove();
(document.head || document.documentElement).append(s);

let stylesheet: HTMLLinkElement;
stylesheet = document.createElement("link");
stylesheet.rel = "stylesheet";
stylesheet.href = chrome.runtime.getURL("dist/styles/global.css");
stylesheet.onload = () => stylesheet.remove();
(document.head || document.documentElement).append(stylesheet);