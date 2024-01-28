let s;

s = document.createElement('script');
s.src = chrome.runtime.getURL('stolen.js');
s.onload = () => s.remove();
(document.head || document.documentElement).append(s);

s = document.createElement('script');
s.src = chrome.runtime.getURL('psd_replay.js');
s.onload = () => s.remove();
(document.head || document.documentElement).append(s);