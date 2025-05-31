function injectScript(file: string) {
	const s: HTMLScriptElement = document.createElement("script");
	s.src = chrome.runtime.getURL(file);
	s.onload = () => s.remove();
	(document.head || document.documentElement).append(s);
}

function injectStyle(file: string) {
	const s: HTMLLinkElement = document.createElement("link");
	s.rel = "stylesheet";
	s.href = chrome.runtime.getURL(file);
	(document.head || document.documentElement).append(s);
}

const INJECT_DELAY = 5000;

injectScript("dist/showdown.js");
injectStyle("dist/react.css");
setTimeout(() => {
	console.log(`Injecting React and styles after ${(INJECT_DELAY / 1000).toFixed(2)} seconds delay`);
	injectScript("dist/lib-react.js");
	injectScript("dist/react.js");
}, INJECT_DELAY);