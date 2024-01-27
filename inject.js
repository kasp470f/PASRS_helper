const s = document.createElement('script');
s.src = chrome.runtime.getURL('psd_replay.js');
s.onload = () => s.remove();
(document.head || document.documentElement).append(s);

// TODO inject the active or notification or vgc only status into the page